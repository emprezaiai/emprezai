// Adaptador de IA (30): BFF con la clave SOLO en el servidor, modelo en AI_MODEL, salida JSON
// forzada por esquema + validada con zod, límites por persona/IP y kill-switch de gasto diario y
// mensual leído de ai_calls (compartido entre instancias). Si algo falla, quien llama degrada a la
// versión armada con las respuestas: la app nunca se queda en blanco.

import Anthropic from '@anthropic-ai/sdk';
import type { z } from 'zod';
import { clienteAdmin } from './supabase';
import { leerVariable, numeroOr, requerida } from './config';
import { alertarDuena } from './correo';

export type TipoLlamada = 'primera_pieza' | 'mision_armar' | 'mision_opciones';

export class IaNoDisponible extends Error {
  constructor(public readonly motivo: 'presupuesto' | 'limite' | 'proveedor' | 'salida' | 'circuito') {
    super(`IA no disponible: ${motivo}`);
    this.name = 'IaNoDisponible';
  }
}

const MODELO_POR_DEFECTO = 'claude-opus-5-5';
const modelo = () => leerVariable('AI_MODEL') ?? MODELO_POR_DEFECTO;

// USD por millón de tokens [entrada, salida]. Modelo desconocido → se cobra como el más caro
// conocido (conservador: el tope de gasto nunca se queda corto).
const PRECIOS: Record<string, [number, number]> = {
  'claude-opus-5-5': [4, 20],
  'claude-sonnet-5-5': [2, 10],
  'claude-haiku-5-5': [0.1, 0.5],
};
const PRECIO_CONSERVADOR: [number, number] = [10, 50];
// Modelos que aceptan la reejecución automática si un filtro de seguridad rechaza la petición.
const CON_FALLBACK = new Set(['claude-opus-5-5', 'claude-opus-5', 'claude-fable-5-1', 'claude-sonnet-5-5']);

let cliente: Anthropic | null = null;
function anthropic(): Anthropic {
  if (!cliente) cliente = new Anthropic({ apiKey: requerida('ANTHROPIC_API_KEY'), timeout: 25_000, maxRetries: 2 });
  return cliente;
}

/* Circuito suave por instancia (30): tras 5 fallos seguidos, 30 s sin llamar al proveedor. */
let fallosSeguidos = 0;
let abiertoHasta = 0;

function costoUSD(m: string, uso: Anthropic.Beta.BetaUsage): number {
  const [entrada, salida] = PRECIOS[m] ?? PRECIO_CONSERVADOR;
  const escritos = uso.cache_creation_input_tokens ?? 0;
  const leidos = uso.cache_read_input_tokens ?? 0;
  return (uso.input_tokens * entrada + escritos * entrada * 1.25 + leidos * entrada * 0.1 + uso.output_tokens * salida) / 1_000_000;
}

async function gastoDesde(desde: Date): Promise<number> {
  const { data, error } = await clienteAdmin().from('ai_calls').select('cost_usd').gte('created_at', desde.toISOString());
  if (error) throw error;
  return (data ?? []).reduce((suma, fila) => suma + Number(fila.cost_usd), 0);
}

/** Kill-switch global (diario y mensual). Avisa a la dueña UNA vez por tope y período. */
async function dentroDelPresupuesto(): Promise<boolean> {
  const ahora = new Date();
  const inicioDia = new Date(Date.UTC(ahora.getUTCFullYear(), ahora.getUTCMonth(), ahora.getUTCDate()));
  const inicioMes = new Date(Date.UTC(ahora.getUTCFullYear(), ahora.getUTCMonth(), 1));
  const topeDia = numeroOr('LIMITE_DIARIO_USD', 5);
  const topeMes = numeroOr('LIMITE_MENSUAL_USD', 50);
  const [dia, mes] = await Promise.all([gastoDesde(inicioDia), gastoDesde(inicioMes)]);
  const excedido = dia >= topeDia ? `diario-${inicioDia.toISOString().slice(0, 10)}` : mes >= topeMes ? `mensual-${inicioMes.toISOString().slice(0, 7)}` : null;
  if (!excedido) return true;
  const { error } = await clienteAdmin().from('alertas').insert({ clave: `ia-tope-${excedido}` });
  if (!error) {
    await alertarDuena(
      'Pausamos la IA: se alcanzó el tope de gasto',
      `Se llegó al tope ${excedido.startsWith('diario') ? `diario de $${topeDia}` : `mensual de $${topeMes}`} USD. Mientras tanto, las piezas se arman con las respuestas de cada persona (sin cortes para nadie). Revisa el uso y, si todo es normal, sube el tope en la configuración de Vercel.`,
    ).catch((e) => console.error('[ia/alerta]', e instanceof Error ? e.name : 'error'));
  }
  return false;
}

/** Límite por persona (sesión) o por IP (recorrido anónimo), contado sobre ai_calls. */
export async function dentroDelLimiteIA(filtro: { userId?: string; ipHash?: string }, porHora: number, porDia: number): Promise<boolean> {
  const db = clienteAdmin();
  const contar = async (desdeMs: number) => {
    let q = db.from('ai_calls').select('id', { count: 'exact', head: true }).gte('created_at', new Date(Date.now() - desdeMs).toISOString());
    q = filtro.userId ? q.eq('user_id', filtro.userId) : q.eq('ip_hash', filtro.ipHash ?? '-');
    const { count, error } = await q;
    if (error) throw error;
    return count ?? 0;
  };
  const [hora, dia] = await Promise.all([contar(3_600_000), contar(86_400_000)]);
  return hora < porHora && dia < porDia;
}

interface Pedido<T> {
  tipo: TipoLlamada;
  sistema: string;
  usuario: string;
  /** JSON Schema de la salida (tipos + required + additionalProperties:false). */
  esquema: Record<string, unknown>;
  validar: z.ZodType<T>;
  userId?: string;
  ipHash?: string;
}

/** Una generación con salida estructurada. Lanza IaNoDisponible si no se puede (quien llama degrada). */
export async function generar<T>(p: Pedido<T>): Promise<T> {
  if (Date.now() < abiertoHasta) throw new IaNoDisponible('circuito');
  if (!(await dentroDelPresupuesto())) throw new IaNoDisponible('presupuesto');

  const m = modelo();
  const mensajes: Anthropic.Beta.BetaMessageParam[] = [{ role: 'user', content: p.usuario }];
  let ultimoError: IaNoDisponible = new IaNoDisponible('salida');

  for (let intento = 0; intento < 2; intento++) {
    let res: Anthropic.Beta.BetaMessage;
    try {
      res = await anthropic().beta.messages.create({
        model: m,
        max_tokens: 4000,
        ...(CON_FALLBACK.has(m) ? { betas: ['server-side-fallback-2026-07-01'], fallbacks: 'default' as const } : {}),
        output_config: { effort: 'low', format: { type: 'json_schema', schema: p.esquema } },
        system: [{ type: 'text', text: p.sistema, cache_control: { type: 'ephemeral' } }],
        messages: mensajes,
      });
    } catch (e) {
      fallosSeguidos += 1;
      if (fallosSeguidos >= 5) abiertoHasta = Date.now() + 30_000;
      await registrar(p, m, null, false);
      console.error('[ia]', e instanceof Anthropic.APIError ? `status ${e.status}` : e instanceof Error ? e.name : 'error');
      throw new IaNoDisponible('proveedor');
    }
    fallosSeguidos = 0;

    const texto = res.content.flatMap((b) => (b.type === 'text' ? [b.text] : [])).join('');
    let valido: T | null = null;
    let problema = '';
    if (res.stop_reason === 'refusal') problema = 'rechazo';
    else if (res.stop_reason === 'max_tokens') problema = 'salida incompleta';
    else {
      try {
        const r = p.validar.safeParse(JSON.parse(texto));
        if (r.success) valido = r.data;
        else problema = r.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; ');
      } catch {
        problema = 'JSON inválido';
      }
    }
    await registrar(p, res.model ?? m, res.usage, Boolean(valido));
    if (valido) return valido;
    if (res.stop_reason === 'refusal') throw new IaNoDisponible('salida');

    // Reintento que le devuelve el error al modelo para que se corrija (30), una sola vez.
    mensajes.push({ role: 'assistant', content: res.content });
    mensajes.push({ role: 'user', content: `Tu respuesta no cumplió el formato (${problema}). Corrígela respetando los límites de largo.` });
    ultimoError = new IaNoDisponible('salida');
  }
  throw ultimoError;
}

async function registrar<T>(p: Pedido<T>, m: string, uso: Anthropic.Beta.BetaUsage | null, ok: boolean) {
  const { error } = await clienteAdmin()
    .from('ai_calls')
    .insert({
      user_id: p.userId ?? null,
      ip_hash: p.ipHash ?? null,
      kind: p.tipo,
      model: m,
      input_tokens: uso?.input_tokens ?? 0,
      output_tokens: uso?.output_tokens ?? 0,
      cost_usd: uso ? costoUSD(m, uso) : 0,
      ok,
    });
  if (error) console.error('[ia/registrar]', error.code);
}
