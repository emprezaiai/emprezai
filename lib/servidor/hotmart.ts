// Webhook de Hotmart: autenticidad (hottok en tiempo constante), lectura del payload y mapeo de
// eventos a la máquina de estados (18 §1-4). Los nombres EXACTOS de eventos y el campo que marca
// la prueba gratis se confirman con la compra de prueba (18: "el evento de trial es un placeholder").

import crypto from 'node:crypto';
import { z } from 'zod';
import type { EstadoMembresia } from '@/lib/membresia';
import { PRECIOS } from '@/lib/legal';
import { leerVariable } from './config';

export function hottokValido(recibido: string | undefined, esperado: string): boolean {
  if (!recibido) return false;
  // HMAC de ambos lados → buffers de igual largo: comparación en tiempo constante sin filtrar el largo.
  const a = crypto.createHmac('sha256', 'hotmart').update(recibido).digest();
  const b = crypto.createHmac('sha256', 'hotmart').update(esperado).digest();
  return crypto.timingSafeEqual(a, b);
}

const num = z.coerce.number();
export const PayloadHotmart = z
  .object({
    id: z.string().optional(),
    event: z.string(),
    creation_date: num.optional(),
    hottok: z.string().optional(),
    data: z
      .object({
        product: z.object({ id: z.coerce.string() }).partial().optional(),
        buyer: z.object({ email: z.string().email(), name: z.string().optional() }).optional(),
        purchase: z
          .object({
            transaction: z.string(),
            status: z.string(),
            approved_date: num,
            date_next_charge: num,
            price: z.object({ value: num, currency_value: z.string() }).partial(),
            offer: z.object({ code: z.string() }).partial(),
            origin: z.object({ src: z.string(), sck: z.string() }).partial(),
          })
          .partial()
          .optional(),
        subscription: z
          .object({
            status: z.string(),
            plan: z.object({ name: z.string() }).partial(),
            subscriber: z.object({ code: z.string() }).partial(),
            product: z.object({ id: z.coerce.string() }).partial(),
            user: z.object({ email: z.string().email() }).partial(),
          })
          .partial()
          .optional(),
        // Los avisos de suscripción (cancelación, cambio de plan) traen a la persona en "subscriber"
        // y la fecha del próximo cobro en la raíz de data, no en "buyer"/"purchase".
        subscriber: z.object({ code: z.string(), email: z.string().email(), name: z.string() }).partial().optional(),
        date_next_charge: num.optional(),
      })
      .passthrough()
      .optional(),
  })
  .passthrough();
export type PayloadHotmart = z.infer<typeof PayloadHotmart>;

/** Evento → estado. null = evento que no cambia la membresía (se registra como ignorado). */
export function estadoPorEvento(p: PayloadHotmart): EstadoMembresia | null {
  const valor = p.data?.purchase?.price?.value;
  switch (p.event) {
    case 'PURCHASE_APPROVED':
    case 'PURCHASE_COMPLETE':
      // Inicio de prueba gratis: llega como compra aprobada de valor 0 (confirmar en la compra de prueba).
      // PURCHASE_COMPLETE llega al vencer la garantía: el webhook lo marca "solo crear" para que nunca
      // cambie el estado de un perfil que ya existe (no revive una suscripción cancelada).
      return valor === 0 ? 'trialing' : 'active';
    case 'PURCHASE_DELAYED':
      return 'past_due';
    case 'SUBSCRIPTION_CANCELLATION':
      return 'cancelled';
    case 'PURCHASE_EXPIRED':
      return 'expired';
    case 'PURCHASE_REFUNDED':
      return 'refunded';
    case 'PURCHASE_CHARGEBACK':
      return 'chargeback';
    default:
      return null;
  }
}

export function planDe(p: PayloadHotmart): 'mensual' | 'anual' | null {
  const oferta = p.data?.purchase?.offer?.code;
  if (oferta && oferta === leerVariable('HOTMART_OFFER_ANUAL')) return 'anual';
  if (oferta && oferta === leerVariable('HOTMART_OFFER_MENSUAL')) return 'mensual';
  const nombre = (p.data?.subscription?.plan?.name ?? '').toLowerCase();
  if (nombre.includes('anual')) return 'anual';
  if (nombre.includes('mensual')) return 'mensual';
  return null;
}

export function tipoEconomico(evento: string, valor: number | undefined): 'sale' | 'refund' | 'chargeback' | null {
  if ((evento === 'PURCHASE_APPROVED' || evento === 'PURCHASE_COMPLETE') && (valor ?? 0) > 0) return 'sale';
  if (evento === 'PURCHASE_REFUNDED') return 'refund';
  if (evento === 'PURCHASE_CHARGEBACK') return 'chargeback';
  return null;
}

export const fechaDe = (ms: number | undefined) => (ms && Number.isFinite(ms) ? new Date(ms).toISOString() : null);

export function finDePrueba(): string {
  return new Date(Date.now() + PRECIOS.diasPrueba * 86_400_000).toISOString();
}

/** Quién es: los avisos de compra la traen en buyer; los de suscripción, en subscriber. */
export function emailDe(p: PayloadHotmart): string | undefined {
  return (p.data?.buyer?.email ?? p.data?.subscriber?.email ?? p.data?.subscription?.user?.email)?.toLowerCase();
}

export function suscriptorDe(p: PayloadHotmart): string | null {
  return p.data?.subscription?.subscriber?.code ?? p.data?.subscriber?.code ?? null;
}

export function productoDe(p: PayloadHotmart): string | undefined {
  return p.data?.product?.id ?? p.data?.subscription?.product?.id;
}

export function proximoCobroDe(p: PayloadHotmart): number | undefined {
  return p.data?.purchase?.date_next_charge ?? p.data?.date_next_charge;
}

/** Días extra tras el próximo cobro: Hotmart reintenta el cobro antes de avisar que falló. */
export const GRACIA_COBRO_DIAS = 3;
const DIA_MS = 86_400_000;

/**
 * Hasta cuándo da acceso un pago aprobado: el próximo cobro + gracia. Si Hotmart no manda la fecha,
 * un período del plan + gracia. Así, si se pierde el aviso de renovación o de cancelación, el
 * acceso vence solo (C1) en vez de quedar abierto para siempre.
 */
export function accesoTrasPago(p: PayloadHotmart, ahora = Date.now()): string {
  const proximo = proximoCobroDe(p);
  const base = proximo && Number.isFinite(proximo) && proximo > ahora ? proximo : ahora + (planDe(p) === 'anual' ? 366 : 31) * DIA_MS;
  return new Date(base + GRACIA_COBRO_DIAS * DIA_MS).toISOString();
}
