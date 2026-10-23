// Máquina de estados de la membresía (18 §4). La misma regla vive en SQL (public.tiene_acceso):
// TODO acceso tiene fecha de fin (auditoría 2026-10-23, C1) — si un aviso de Hotmart se pierde, el
// acceso vence solo en vez de quedar abierto para siempre:
// trialing → hasta el fin de la prueba + 2 días · active/cancelled → hasta access_until ·
// past_due → durante la gracia · expired/refunded/chargeback → sin acceso.

export type EstadoMembresia = 'trialing' | 'active' | 'past_due' | 'cancelled' | 'expired' | 'refunded' | 'chargeback';

export interface Membresia {
  status: EstadoMembresia;
  trial_ends_at?: string | null;
  access_until?: string | null;
  grace_ends_at?: string | null;
}

/** Margen tras el fin de la prueba: el primer cobro puede tardar en llegar. */
export const MARGEN_PRUEBA_MS = 2 * 86_400_000;

const antesDe = (iso: string | null | undefined, ahora: Date, margenMs = 0) =>
  Boolean(iso) && ahora.getTime() < new Date(iso as string).getTime() + margenMs;

export function tieneAcceso(m: Membresia, ahora: Date = new Date()): boolean {
  if (m.status === 'trialing') return antesDe(m.trial_ends_at, ahora, MARGEN_PRUEBA_MS);
  if (m.status === 'active' || m.status === 'cancelled') return antesDe(m.access_until, ahora);
  if (m.status === 'past_due') return antesDe(m.grace_ends_at, ahora);
  return false;
}
