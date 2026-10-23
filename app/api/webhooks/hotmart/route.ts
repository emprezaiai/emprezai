// Webhook de Hotmart (18: la única implementación válida). Orden obligatorio:
// raw body → autenticidad (hottok) → parse → frescura → catálogo → idempotencia + ledger + transición
// (RPC atómica) → acceso/correo → log. Nunca 200 si falló de verdad (Hotmart reintenta).

import crypto from 'node:crypto';
import { NextResponse } from 'next/server';
import { darAccesoTrasCompra } from '@/lib/servidor/accesos';
import { leerVariable, supabaseConfigurado } from '@/lib/servidor/config';
import {
  PayloadHotmart,
  accesoTrasPago,
  emailDe,
  estadoPorEvento,
  fechaDe,
  finDePrueba,
  hottokValido,
  planDe,
  productoDe,
  proximoCobroDe,
  suscriptorDe,
  tipoEconomico,
} from '@/lib/servidor/hotmart';
import { clienteAdmin } from '@/lib/servidor/supabase';

export const runtime = 'nodejs';

// Hotmart reintenta un evento durante horas/días con su fecha original: la ventana anti-replay es
// amplia y la protección real contra el doble proceso es la idempotencia por event_id.
const VENTANA_MS = 7 * 86_400_000;

type Resultado = 'applied' | 'duplicate' | 'illegal' | 'unauthorized' | 'rejected' | 'ignored' | 'error';

async function registrar(eventId: string | null, tipo: string | null, result: Resultado) {
  const { error } = await clienteAdmin().from('webhook_log').insert({ event_id: eventId, type: tipo, result });
  if (error) console.error('[hotmart/log]', error.code);
}

const json = (estado: number, cuerpo: Record<string, unknown>) => NextResponse.json(cuerpo, { status: estado });

export async function POST(req: Request) {
  const hottok = leerVariable('HOTMART_HOTTOK');
  const productoEsperado = leerVariable('HOTMART_PRODUCT_ID');
  // Fail-closed: sin secreto o sin catálogo no se procesa nada (Hotmart reintentará).
  if (!hottok || !productoEsperado || !supabaseConfigurado()) return json(503, { error: 'no-configurado' });

  const crudo = await req.text();
  let cuerpoHottok: string | undefined;
  let parseado: unknown = null;
  try {
    parseado = JSON.parse(crudo);
    cuerpoHottok = (parseado as { hottok?: string })?.hottok;
  } catch {
    parseado = null;
  }
  const recibido = req.headers.get('x-hotmart-hottok') ?? cuerpoHottok;
  if (!hottokValido(recibido ?? undefined, hottok)) {
    await registrar(null, null, 'unauthorized');
    return json(401, { error: 'unauthorized' });
  }

  const datos = PayloadHotmart.safeParse(parseado);
  if (!datos.success) {
    await registrar(null, null, 'rejected');
    return json(400, { error: 'bad request' });
  }
  const p = datos.data;
  const compra = p.data?.purchase;
  const eventId = p.id ?? `${p.event}:${compra?.transaction ?? 'sin-tx'}:${p.creation_date ?? ''}`;

  if (p.creation_date && Date.now() - p.creation_date > VENTANA_MS) {
    await registrar(eventId, p.event, 'rejected');
    return json(400, { error: 'stale' });
  }
  // Catálogo obligatorio (I4): el hottok es de TODA la cuenta de Hotmart, así que un aviso sin
  // producto, o de otro producto de la misma cuenta, nunca da acceso a EMPREZAI.
  if (productoDe(p) !== productoEsperado) {
    await registrar(eventId, p.event, 'rejected');
    return json(200, { received: true, result: 'otro-producto' });
  }

  const email = emailDe(p);
  const subscriberCode = suscriptorDe(p);
  const payloadHash = crypto.createHash('sha256').update(crudo).digest('hex');
  const db = clienteAdmin();

  try {
    if (p.event === 'SWITCH_PLAN') {
      const { data, error } = await db.rpc('apply_hotmart_switch_plan', {
        p_event_id: eventId,
        p_payload_hash: payloadHash,
        p_subscriber_code: subscriberCode,
        p_email: email ?? null,
        p_plan: planDe(p),
      });
      if (error) throw error;
      await registrar(eventId, p.event, data?.status === 'duplicate' ? 'duplicate' : 'applied');
      return json(200, { received: true });
    }

    const nuevo = estadoPorEvento(p);
    if (!nuevo || !email) {
      await registrar(eventId, p.event, 'ignored');
      return json(200, { received: true, ignored: p.event });
    }

    const valor = compra?.price?.value;
    const economico = tipoEconomico(p.event, valor);
    const { data, error } = await db.rpc('apply_hotmart_event', {
      p_event_id: eventId,
      p_event_type: p.event,
      p_payload_hash: payloadHash,
      p_email: email,
      p_name: p.data?.buyer?.name ?? '',
      p_subscriber_code: subscriberCode,
      p_new_status: nuevo,
      p_plan: planDe(p),
      p_anon_id: compra?.origin?.src?.slice(0, 120) ?? null,
      p_trial_ends_at: nuevo === 'trialing' ? finDePrueba() : null,
      // Todo acceso con fecha de fin (C1): pago aprobado → próximo cobro + gracia; cancelado → hasta
      // el fin del período ya pagado.
      p_access_until: nuevo === 'active' ? accesoTrasPago(p) : nuevo === 'cancelled' ? fechaDe(proximoCobroDe(p)) : null,
      p_grace_ends_at: null,
      p_transaction_id: economico ? (compra?.transaction ?? null) : null,
      p_economic_kind: economico,
      p_product_id: productoEsperado,
      p_offer_id: compra?.offer?.code ?? null,
      p_amount_minor: economico && valor !== undefined ? Math.round(valor * 100) : null,
      p_currency: compra?.price?.currency_value ?? 'USD',
      p_occurred_at: fechaDe(compra?.approved_date) ?? fechaDe(p.creation_date),
      p_event_at: fechaDe(p.creation_date),
      p_solo_crear: p.event === 'PURCHASE_COMPLETE',
    });
    if (error) throw error;

    const estado = (data as { status?: string; needs_access?: boolean } | null)?.status;
    if (estado === 'duplicate') {
      await registrar(eventId, p.event, 'duplicate');
      return json(200, { received: true, result: 'duplicate' });
    }
    if (estado === 'stale') {
      // Aviso más viejo que el último aplicado (llegó tarde): queda en el libro, no cambia el acceso.
      await registrar(eventId, p.event, 'ignored');
      return json(200, { received: true, result: 'stale' });
    }
    if (estado === 'illegal_transition') {
      await registrar(eventId, p.event, 'illegal');
      return json(200, { received: true, result: 'illegal' });
    }
    // Acceso + bienvenida. Si falla, el perfil queda completed=false y el cron diario lo reintenta:
    // el evento ya se aplicó, así que respondemos 200 (no duplicar el ledger) pero queda en el log.
    if ((data as { needs_access?: boolean } | null)?.needs_access) {
      try {
        await darAccesoTrasCompra(email);
      } catch (e) {
        console.error('[hotmart/acceso]', e instanceof Error ? e.name : 'error');
        await registrar(eventId, p.event, 'error');
        return json(200, { received: true, result: 'applied-acceso-pendiente' });
      }
    }
    await registrar(eventId, p.event, 'applied');
    return json(200, { received: true, result: 'applied' });
  } catch (e) {
    console.error('[hotmart]', p.event, e instanceof Error ? e.name : 'error');
    await registrar(eventId, p.event, 'error');
    return json(500, { error: 'processing failed' });
  }
}
