// Datos del panel de la dueña (21/40/31/36). TODO se lee con la clave del servidor DESPUÉS de
// verificar que quien pide es admin (lib/servidor/admin.ts). Las sumas las hace la base
// (funciones panel_*): nunca se traen filas para sumarlas aquí (tope de filas por consulta).
// Regla: si un dato no existe, se devuelve null y la pantalla dice "Sin datos". Nada se inventa;
// lo que es estimación (impuestos, comisión cuando Hotmart no la informó) se marca como estimado.

import { readFileSync } from 'node:fs';
import { clienteAdmin } from './supabase';

/* ── Tipos de lo que devuelven las funciones de la base ── */
export interface DineroMoneda {
  moneda: string;
  ventas: number;
  bruto_minor: number;
  comision_minor: number;
  afiliados_minor: number;
  neto_minor: number;
  ventas_sin_neto: number;
  bruto_sin_neto_minor: number;
  reembolsos: number;
  reembolsos_minor: number;
  contracargos: number;
  contracargos_minor: number;
}
export interface Ventas {
  dinero: DineroMoneda[];
  pruebas_iniciadas: number;
  pruebas_a_pago: number;
  compras_directas: number;
  cancelaciones_voluntarias: number;
  cobros_fallidos: number;
  perdidos_por_pago: number;
  reembolsados: number;
  pagando_al_inicio: number;
}
export interface Clientes {
  por_estado: Record<string, number>;
  activos_mensual: number;
  activos_anual: number;
  activos_sin_plan: number;
  en_prueba: number;
  manuales: number;
  total: number;
  con_cuenta: number;
}
export interface MesSerie {
  mes: string;
  dinero: {
    moneda: string;
    bruto_minor: number;
    neto_minor: number;
    afiliados_minor: number;
    ventas_sin_neto: number;
    bruto_sin_neto_minor: number;
    reembolsos_minor: number;
  }[];
  ia_usd: number;
}
export interface Uso {
  activos_hoy: number;
  activos_7: number;
  activos_30: number;
  con_piezas: number;
  activados: number;
  base_activacion: number;
  retencion: { base_d1: number; d1: number; base_d7: number; d7: number; base_d30: number; d30: number };
  piezas_por_dia: { fecha: string; piezas: number }[];
  dia_maximo: Record<string, number>;
  fantasmas: number;
}
export interface Funnel {
  pasos: Record<string, number>;
  pruebas_o_compras: number;
  sin_eventos: boolean;
}
export interface Ia {
  total_usd: number;
  llamadas: number;
  fallos: number;
  hoy_usd: number;
  por_funcion: { tipo: string; usd: number; llamadas: number; fallos: number }[];
  usuarios_con_ia: number;
  top_usuarios: { email: string; usd: number; llamadas: number }[];
  anonima_usd: number;
}
export interface Canal {
  canal: string;
  clientes: number;
  siguen: number;
  dinero: { moneda: string; neto_minor: number; devuelto_minor: number }[];
  gasto_usd: number;
}
export interface Salud {
  webhook_ultimo: string | null;
  webhook_7d: Record<string, number>;
  webhook_errores_24h: number;
  errores_7d: { mensaje: string; ruta: string | null; origen: string; veces: number; personas: number; ultima: string }[];
  errores_hoy: number;
  vencidos_sin_aviso: number;
  pagaron_sin_acceso: number;
  alertas: { clave: string; en: string }[];
}
export interface CostoFijo {
  id: number;
  nombre: string;
  monto_usd: number;
  activo: boolean;
}
export interface GastoCanal {
  id: number;
  canal: string;
  monto_usd: number;
  desde: string;
  hasta: string;
  nota: string | null;
}

/* ── Captura local con datos de prueba (NUNCA en producción) ──
   Para las capturas del revisor, el panel puede leer un archivo generado por
   tests/db/panel-fixture.mjs (las MISMAS funciones SQL corriendo sobre una base en memoria con
   datos de prueba). Solo con PANEL_CAPTURA apuntando a ese archivo y fuera de Vercel. */
const ARCHIVO_CAPTURA = process.env.VERCEL ? undefined : process.env.PANEL_CAPTURA;
let captura: Record<string, unknown> | null = null;
export const modoCaptura = Boolean(ARCHIVO_CAPTURA);
function datoDeCaptura<T>(clave: string): T {
  if (!captura) captura = JSON.parse(readFileSync(ARCHIVO_CAPTURA as string, 'utf8')) as Record<string, unknown>;
  return captura[clave] as T;
}

async function rpc<T>(fn: string, args: Record<string, unknown> = {}, clave = fn): Promise<T> {
  if (ARCHIVO_CAPTURA) return datoDeCaptura<T>(clave);
  const { data, error } = await clienteAdmin().rpc(fn, args);
  if (error) throw error;
  return data as T;
}

/* ── Períodos (mes calendario en hora UTC, igual que el tope de gasto de IA) ── */
export function periodoMes(desplazamiento = 0): { desde: Date; hasta: Date; etiqueta: string } {
  const hoy = new Date();
  const desde = new Date(Date.UTC(hoy.getUTCFullYear(), hoy.getUTCMonth() + desplazamiento, 1));
  const hasta = new Date(Date.UTC(hoy.getUTCFullYear(), hoy.getUTCMonth() + desplazamiento + 1, 1));
  const etiqueta = new Intl.DateTimeFormat('es', { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(desde);
  return { desde, hasta, etiqueta };
}
export interface PeriodoElegido {
  desde: Date;
  hasta: Date;
  etiqueta: string;
  esActual: boolean;
  param: string;
  anterior: string;
  siguiente: string | null;
  /** Contra qué se compara: los mismos días del mes pasado (mes en curso) o el mes pasado completo. */
  comparar: { desde: Date; hasta: Date; etiqueta: string };
  textoComparar: string;
  /** Día del mes de hoy si es el mes en curso (para avisar que los costos fijos van completos). */
  diaDeHoy: number | null;
}

const aParam = (d: Date) => `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`;

/** El mes que pide la URL (?mes=2026-10), con sus vecinos para las flechas ← →. Máx. 24 meses atrás. */
export function periodoElegido(param?: string): PeriodoElegido {
  const hoy = new Date();
  let desplazamiento = 0;
  if (param && /^\d{4}-\d{2}$/.test(param)) {
    const [a, m] = param.split('-').map(Number);
    desplazamiento = (a - hoy.getUTCFullYear()) * 12 + (m - 1 - hoy.getUTCMonth());
    if (desplazamiento > 0 || desplazamiento < -24) desplazamiento = 0;
  }
  const p = periodoMes(desplazamiento);
  const esActual = desplazamiento === 0;
  const mesDe = (d: number) => new Date(Date.UTC(hoy.getUTCFullYear(), hoy.getUTCMonth() + d, 1));
  const comparar = esActual ? periodoMesHastaHoy(-1) : periodoMes(desplazamiento - 1);
  const nombreAnterior = comparar.etiqueta.split(' ')[0];
  return {
    ...p,
    esActual,
    param: aParam(mesDe(desplazamiento)),
    anterior: aParam(mesDe(desplazamiento - 1)),
    siguiente: esActual ? null : aParam(mesDe(desplazamiento + 1)),
    comparar,
    textoComparar: esActual ? `los mismos días de ${nombreAnterior}` : nombreAnterior,
    diaDeHoy: esActual ? hoy.getUTCDate() : null,
  };
}

/** Fechas por defecto del formulario de gasto: del día 1 del mes actual a hoy (AAAA-MM-DD). */
export function fechasPorDefecto(): { desde: string; hasta: string } {
  const hoy = new Date().toISOString().slice(0, 10);
  return { desde: `${hoy.slice(0, 8)}01`, hasta: hoy };
}

/**
 * Los mismos días ya transcurridos de un mes anterior (del 1 al día de hoy): comparar el mes en
 * curso contra un mes COMPLETO siempre haría parecer que todo cae.
 */
export function periodoMesHastaHoy(desplazamiento = -1): { desde: Date; hasta: Date; etiqueta: string } {
  const hoy = new Date();
  const base = periodoMes(desplazamiento);
  const finMes = new Date(Date.UTC(hoy.getUTCFullYear(), hoy.getUTCMonth() + desplazamiento + 1, 1));
  const mismoDia = new Date(Date.UTC(hoy.getUTCFullYear(), hoy.getUTCMonth() + desplazamiento, hoy.getUTCDate() + 1));
  return { ...base, hasta: mismoDia < finMes ? mismoDia : finMes };
}

/**
 * Lo que deja un cliente en toda su vida (estimado, 21/40): ingreso neto mensual por cliente
 * pagando (precio de lista menos la comisión estimada de Hotmart) × meses que se queda (1 ÷ churn
 * mensual, tope 24). null si todavía no hay clientes pagando.
 */
export function calcularLtv(c: Clientes, churnMensualPct: number | null): { ltv: number; vidaMeses: number } | null {
  const { mrr, pagando } = calcularMrr(c);
  if (pagando === 0) return null;
  const arpuNeto = (mrr / pagando) * (1 - HOTMART_PCT) - HOTMART_FIJO_USD * (c.activos_mensual / pagando);
  const vidaMeses = churnMensualPct && churnMensualPct > 0 ? Math.min(24, 100 / churnMensualPct) : 24;
  return { ltv: arpuNeto * vidaMeses, vidaMeses };
}

const rango = (p: { desde: Date; hasta: Date }) => ({ p_desde: p.desde.toISOString(), p_hasta: p.hasta.toISOString() });

export const leerVentas = (p: { desde: Date; hasta: Date }, clave: string) => rpc<Ventas>('panel_ventas', rango(p), clave);
export const leerClientes = () => rpc<Clientes>('panel_clientes');
export const leerSerie = (meses = 6) => rpc<MesSerie[]>('panel_serie_mensual', { p_meses: meses });
export const leerUso = () => rpc<Uso>('panel_uso');
export const leerFunnel = (p: { desde: Date; hasta: Date }, clave = 'panel_funnel') => rpc<Funnel>('panel_funnel', rango(p), clave);
export const leerIa = (p: { desde: Date; hasta: Date }, clave = 'panel_ia') => rpc<Ia>('panel_ia', rango(p), clave);
export const leerCanales = (p: { desde: Date; hasta: Date }, clave = 'panel_canales') => rpc<Canal[]>('panel_canales', rango(p), clave);
export const leerSalud = () => rpc<Salud>('panel_salud');

export async function leerAjustes(): Promise<{ impuestosPct: number; costos: CostoFijo[]; gastos: GastoCanal[] }> {
  if (ARCHIVO_CAPTURA) return datoDeCaptura('ajustes');
  const db = clienteAdmin();
  const [ajustes, costos, gastos] = await Promise.all([
    db.from('panel_ajustes').select('clave, valor'),
    db.from('costos_fijos').select('id, nombre, monto_usd, activo').order('id'),
    db.from('acquisition_spend').select('id, canal, monto_usd, desde, hasta, nota').order('desde', { ascending: false }).limit(100),
  ]);
  if (ajustes.error) throw ajustes.error;
  if (costos.error) throw costos.error;
  if (gastos.error) throw gastos.error;
  const impuestos = (ajustes.data ?? []).find((a) => a.clave === 'impuestos_pct');
  return {
    impuestosPct: impuestos ? Number(impuestos.valor) : 0,
    costos: (costos.data ?? []).map((c) => ({ ...c, monto_usd: Number(c.monto_usd) })) as CostoFijo[],
    gastos: (gastos.data ?? []).map((g) => ({ ...g, monto_usd: Number(g.monto_usd) })) as GastoCanal[],
  };
}

/* ── Precios de lista (lib/legal) para el ingreso mensual recurrente ── */
export const PRECIO_MENSUAL_USD = 9.99;
export const PRECIO_ANUAL_USD = 79.99;
// Comisión de Hotmart cuando el aviso NO trae el reparto (estimación de ESTADO.md, marcada como tal):
// 9,9% + US$0,45 por venta.
const HOTMART_PCT = 0.099;
const HOTMART_FIJO_USD = 0.45;

const usd = (minor: number) => minor / 100;
const comisionEstimada = (brutoSinNetoUsd: number, ventasSinNeto: number) =>
  ventasSinNeto > 0 ? brutoSinNetoUsd * HOTMART_PCT + ventasSinNeto * HOTMART_FIJO_USD : 0;

/** Lo que quedó cada mes (misma cuenta que la ganancia del período, con los costos fijos de hoy). */
export function gananciaPorMes(serie: MesSerie[], impuestosPct: number, fijosUsd: number) {
  return serie.map((m) => {
    const d = m.dinero.find((x) => x.moneda === 'USD');
    const bruto = d ? usd(d.bruto_minor) : 0;
    const devuelto = d ? usd(d.reembolsos_minor) : 0;
    // Con reparto informado: el neto de Hotmart ya descuenta comisión y afiliados.
    const brutoConNeto = d ? usd(d.bruto_minor - d.bruto_sin_neto_minor) : 0;
    const netoInformado = d ? usd(d.neto_minor) : 0;
    const descuentosHotmart = brutoConNeto - netoInformado + comisionEstimada(d ? usd(d.bruto_sin_neto_minor) : 0, d?.ventas_sin_neto ?? 0);
    const impuestos = Math.max(0, bruto - devuelto) * (impuestosPct / 100);
    const quedo = bruto - devuelto - descuentosHotmart - impuestos - m.ia_usd - fijosUsd;
    return { mes: m.mes, ingresos: bruto, quedo, ia: m.ia_usd, hayVentas: bruto > 0 };
  });
}

export interface Ganancia {
  /** Hay al menos una venta o un costo en el período. */
  hayDatos: boolean;
  bruto: number;
  devuelto: number;
  comision: number;
  comisionEstimada: boolean;
  afiliados: number;
  afiliadosSinInformar: number;
  impuestos: number;
  impuestosPct: number;
  ia: number;
  fijos: number;
  ganancia: number;
  /** null si no hubo ingresos (un margen sobre $0 no significa nada). */
  margenPct: number | null;
  ventas: number;
  otrasMonedas: string[];
}

/**
 * "Facturaste $X y te quedaron $Y": ingresos − devoluciones − Hotmart − afiliados − impuestos −
 * IA (real, de ai_calls) − costos fijos. Solo USD (moneda de los planes); otras monedas se listan
 * aparte, nunca se suman sin un tipo de cambio con fuente.
 */
export function calcularGanancia(v: Ventas, iaUsd: number, impuestosPct: number, fijosUsd: number): Ganancia {
  const m = v.dinero.find((d) => d.moneda === 'USD');
  const bruto = m ? usd(m.bruto_minor) : 0;
  const devuelto = m ? usd(m.reembolsos_minor + m.contracargos_minor) : 0;
  const ventas = m?.ventas ?? 0;
  const sinNeto = m?.ventas_sin_neto ?? 0;
  // Comisión real donde Hotmart la informó; estimada en las ventas que llegaron sin reparto.
  const comision = (m ? usd(m.comision_minor) : 0) + comisionEstimada(m ? usd(m.bruto_sin_neto_minor) : 0, sinNeto);
  const afiliados = m ? usd(m.afiliados_minor) : 0;
  const impuestos = Math.max(0, bruto - devuelto) * (impuestosPct / 100);
  const ganancia = bruto - devuelto - comision - afiliados - impuestos - iaUsd - fijosUsd;
  return {
    hayDatos: bruto > 0 || iaUsd > 0 || fijosUsd > 0,
    bruto,
    devuelto,
    comision,
    comisionEstimada: sinNeto > 0,
    afiliados,
    afiliadosSinInformar: sinNeto,
    impuestos,
    impuestosPct,
    ia: iaUsd,
    fijos: fijosUsd,
    ganancia,
    margenPct: bruto > 0 ? (ganancia / bruto) * 100 : null,
    ventas,
    otrasMonedas: v.dinero.filter((d) => d.moneda !== 'USD' && d.ventas > 0).map((d) => d.moneda),
  };
}

/** Ingreso mensual recurrente a precio de lista: el anual se reparte en 12 meses. */
export function calcularMrr(c: Clientes): { mrr: number; pagando: number } {
  return {
    mrr: c.activos_mensual * PRECIO_MENSUAL_USD + (c.activos_anual * PRECIO_ANUAL_USD) / 12,
    pagando: c.activos_mensual + c.activos_anual + c.activos_sin_plan,
  };
}

/** Clientes que se fueron en el período sobre los que pagaban al empezarlo. null sin base. */
export function calcularChurn(v: Ventas): { total: number | null; voluntario: number; involuntario: number } {
  const voluntario = v.cancelaciones_voluntarias;
  const involuntario = v.perdidos_por_pago;
  return { total: v.pagando_al_inicio > 0 ? ((voluntario + involuntario) / v.pagando_al_inicio) * 100 : null, voluntario, involuntario };
}

/* ── AVISOS AUTOMÁTICOS (21): qué pasó → por qué importa → qué hacer, en simple ── */
export type Gravedad = 'alta' | 'media';
export interface Aviso {
  id: string;
  gravedad: Gravedad;
  titulo: string;
  porque: string;
  queHacer: string;
  enlace?: { texto: string; href: string };
}

const dinero = (n: number) => `$${n.toLocaleString('es', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export function calcularAvisos(d: { ganancia: Ganancia; ventas: Ventas; salud: Salud; canales: Canal[]; uso: Uso; ltv: number | null }): Aviso[] {
  const avisos: Aviso[] = [];
  const { ganancia: g, ventas: v, salud: s } = d;

  if (s.pagaron_sin_acceso > 0) {
    avisos.push({
      id: 'sin-acceso',
      gravedad: 'alta',
      titulo: `${s.pagaron_sin_acceso} ${s.pagaron_sin_acceso === 1 ? 'persona pagó' : 'personas pagaron'} y no recibió su acceso`,
      porque: 'Pagaron y no pueden entrar: es la causa número uno de reembolsos y quejas.',
      queHacer: 'Entra a Usuarios, búscalas y toca "Copiar enlace de acceso" para mandárselo por WhatsApp.',
      enlace: { texto: 'Ver usuarios', href: '/admin/usuarios?estado=sin-acceso' },
    });
  }
  if (s.webhook_errores_24h > 0) {
    avisos.push({
      id: 'webhook',
      gravedad: 'alta',
      titulo: `El aviso de pagos de Hotmart falló ${s.webhook_errores_24h} ${s.webhook_errores_24h === 1 ? 'vez' : 'veces'} en las últimas 24 horas`,
      porque: 'Si los avisos de Hotmart no entran, una compra podría no dar acceso (o un reembolso no quitarlo).',
      queHacer: 'Revisa en Hotmart que la URL del aviso y la clave (hottok) sean las de tu app. Hotmart reintenta solo.',
      enlace: { texto: 'Ver salud', href: '/admin/salud' },
    });
  }
  if (g.margenPct !== null && g.ganancia <= 0) {
    avisos.push({
      id: 'margen',
      gravedad: 'alta',
      titulo: `Este mes estás perdiendo dinero: ${dinero(g.ganancia)}`,
      porque: 'Cada venta nueva te cuesta más de lo que deja; vender más empeora el número.',
      queHacer: 'Revisa en Ganancia real qué costo pesa más (IA, costos fijos o comisiones) antes de invertir en anuncios.',
      enlace: { texto: 'Ver ganancia', href: '/admin/ganancia' },
    });
  }
  if (g.bruto > 0 && g.ia / g.bruto > 0.2) {
    avisos.push({
      id: 'ia-cara',
      gravedad: 'media',
      titulo: `La IA se come el ${Math.round((g.ia / g.bruto) * 100)}% de lo que cobras`,
      porque: 'Por encima del 20% el margen se achica rápido a medida que crecen los clientes.',
      queHacer: 'Revisa en IA qué función gasta más y si alguien está usando mucho más que el resto.',
      enlace: { texto: 'Ver IA', href: '/admin/ia' },
    });
  }
  if (v.cobros_fallidos + v.perdidos_por_pago >= 3 && v.cobros_fallidos + v.perdidos_por_pago > v.cancelaciones_voluntarias) {
    avisos.push({
      id: 'involuntario',
      gravedad: 'media',
      titulo: `${v.cobros_fallidos + v.perdidos_por_pago} cobros fallaron este mes`,
      porque: 'Son clientes que SÍ querían pagar: recuperarlos es lo más barato que existe.',
      queHacer: 'Escríbeles para que actualicen su tarjeta en Hotmart. Más adelante se puede automatizar ese recordatorio.',
      enlace: { texto: 'Ver ventas', href: '/admin/ventas' },
    });
  }
  // Canal que pierde dinero (34/40): lo que dejarán sus clientes en toda su vida no paga lo gastado
  // (LTV:CAC < 1). Una suscripción casi nunca se paga en el primer mes: por eso no se compara solo
  // con lo cobrado este mes.
  for (const c of d.canales) {
    if (c.gasto_usd <= 0) continue;
    if (c.clientes === 0) {
      avisos.push({
        id: `canal-${c.canal}`,
        gravedad: 'media',
        titulo: `El canal "${c.canal}" no trajo clientes este mes`,
        porque: `Llevas ${dinero(c.gasto_usd)} gastados ahí sin ninguna prueba ni compra.`,
        queHacer: 'Revisa el anuncio y el enlace (que lleve tu código de seguimiento) o pausa el gasto.',
        enlace: { texto: 'Ver canales', href: '/admin/canales' },
      });
    } else if (d.ltv !== null && (c.siguen * d.ltv) / c.gasto_usd < 1) {
      avisos.push({
        id: `canal-${c.canal}`,
        gravedad: 'media',
        titulo: `El canal "${c.canal}" cuesta más de lo que deja`,
        porque: `Gastaste ${dinero(c.gasto_usd)} y sus ${c.siguen} clientes activos dejarían unos ${dinero(c.siguen * d.ltv)} en total.`,
        queHacer: 'Baja el gasto ahí o mejora el anuncio antes de invertir más.',
        enlace: { texto: 'Ver canales', href: '/admin/canales' },
      });
    }
  }
  const conGasto = d.canales.filter((c) => c.gasto_usd > 0);
  const gasto = conGasto.reduce((t, c) => t + c.gasto_usd, 0);
  const clientesPagados = conGasto.reduce((t, c) => t + c.clientes, 0);
  if (d.ltv !== null && clientesPagados > 0 && gasto / clientesPagados > d.ltv) {
    avisos.push({
      id: 'cac-ltv',
      gravedad: 'alta',
      titulo: `Conseguir un cliente te cuesta ${dinero(gasto / clientesPagados)} y deja unos ${dinero(d.ltv)}`,
      porque: 'Cada cliente que pagas con anuncios te hace perder dinero, aunque el mes se vea bien.',
      queHacer: 'Baja el gasto en anuncios o sube lo que deja cada cliente (precio, plan anual) antes de invertir más.',
      enlace: { texto: 'Ver canales', href: '/admin/canales' },
    });
  }
  const peorError = s.errores_7d[0];
  if (s.errores_hoy >= 10 || (peorError && peorError.personas >= 3)) {
    avisos.push({
      id: 'errores',
      gravedad: 'media',
      titulo: peorError && peorError.personas >= 3 ? `${peorError.personas} personas chocaron con el mismo error esta semana` : `${s.errores_hoy} errores hoy en la app`,
      porque: 'Un error repetido hace que la gente abandone sin avisarte.',
      queHacer: 'Mira en Salud cuál es el error más común y pásamelo para arreglarlo.',
      enlace: { texto: 'Ver salud', href: '/admin/salud' },
    });
  }
  if (s.vencidos_sin_aviso > 0) {
    avisos.push({
      id: 'vencidos',
      gravedad: 'media',
      titulo: `${s.vencidos_sin_aviso} ${s.vencidos_sin_aviso === 1 ? 'acceso venció' : 'accesos vencieron'} sin aviso de Hotmart`,
      porque: 'Puede ser un cobro que Hotmart no informó: esas personas quedaron sin entrar.',
      queHacer: 'Compáralas con tus ventas en Hotmart y, si pagaron, extiéndeles el acceso desde Usuarios.',
      enlace: { texto: 'Ver usuarios', href: '/admin/usuarios?estado=vencido' },
    });
  }
  return avisos.sort((a, b) => (a.gravedad === b.gravedad ? 0 : a.gravedad === 'alta' ? -1 : 1));
}

/* ── Usuarios, ficha, cobros recientes y topes de IA ── */
export interface FilaUsuario {
  id: string;
  email: string;
  nombre: string | null;
  estado: string;
  plan: string | null;
  origen: 'hotmart' | 'manual';
  canal: string | null;
  alta: string;
  acceso_hasta: string | null;
  tiene_cuenta: boolean;
  acceso_enviado: boolean;
  piezas: number;
  ultima_actividad: string | null;
}
export interface Ficha extends Omit<FilaUsuario, 'acceso_hasta'> {
  acceso_hasta: string | null;
  prueba_hasta: string | null;
  gracia_hasta: string | null;
  primer_pago: string | null;
  idea: string | null;
  momento: string | null;
  historial: { de: string | null; a: string; en: string }[];
  pagos: { tipo: string; monto_minor: number; moneda: string; en: string }[];
  dia_maximo: number | null;
  ia_usd: number;
}
export interface Cobro {
  tipo: string;
  monto_minor: number;
  moneda: string;
  en: string;
  email: string | null;
}

export const FILTROS_USUARIOS = ['todos', 'activo', 'trialing', 'active', 'sin-acceso', 'fantasma', 'cancelled', 'past_due', 'expired', 'refunded', 'vencido', 'manual'] as const;
export type FiltroUsuarios = (typeof FILTROS_USUARIOS)[number];
export const POR_PAGINA = 25;

export const leerPruebasSinPago = (p: { desde: Date; hasta: Date }, clave = 'pruebas_sin_pago_mes') => rpc<number>('panel_pruebas_sin_pago', rango(p), clave);

export function leerUsuarios(buscar: string, estado: FiltroUsuarios, pagina: number) {
  return rpc<{ total: number; filas: FilaUsuario[] }>(
    'panel_usuarios',
    { p_buscar: buscar.slice(0, 80), p_estado: estado, p_limite: POR_PAGINA, p_desde: Math.max(0, pagina - 1) * POR_PAGINA },
    'usuarios',
  );
}

export const leerFicha = (id: string) => rpc<Ficha | null>('panel_ficha', { p_id: id }, 'ficha');

export async function leerUltimosCobros(limite = 12): Promise<Cobro[]> {
  if (ARCHIVO_CAPTURA) return datoDeCaptura('ultimos_cobros');
  const { data, error } = await clienteAdmin()
    .from('payment_transactions')
    .select('economic_kind, amount_minor, currency, occurred_at, email')
    .order('occurred_at', { ascending: false })
    .limit(limite);
  if (error) throw error;
  return (data ?? []).map((t) => ({ tipo: t.economic_kind, monto_minor: Number(t.amount_minor), moneda: t.currency, en: t.occurred_at, email: t.email }));
}

/** Los topes de gasto de IA que frenan la app (mismas variables y valores por defecto que lib/servidor/ia.ts). */
export function topesIa(): { diario: number; mensual: number } {
  const leer = (v: string | undefined, porDefecto: number) => {
    const n = Number(v);
    return Number.isFinite(n) && n > 0 ? n : porDefecto;
  };
  return { diario: leer(process.env.LIMITE_DIARIO_USD, 5), mensual: leer(process.env.LIMITE_MENSUAL_USD, 50) };
}

/** Hasta cuándo tiene acceso hoy y si sigue vigente (misma regla que la app: prueba, pago o gracia). */
export function accesoDe(f: Ficha): { hasta: string | null; vigente: boolean } {
  const hasta = f.estado === 'trialing' ? f.prueba_hasta : f.estado === 'past_due' ? f.gracia_hasta : f.acceso_hasta;
  const vigente = Boolean(hasta && new Date(hasta).getTime() > Date.now() && ['trialing', 'active', 'cancelled', 'past_due'].includes(f.estado));
  return { hasta, vigente };
}

/** Días desde la última pieza armada (null si nunca armó ninguna). */
export function diasSinActividad(f: Ficha): number | null {
  return f.ultima_actividad ? Math.floor((Date.now() - new Date(f.ultima_actividad).getTime()) / 86_400_000) : null;
}
