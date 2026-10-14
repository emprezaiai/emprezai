// Máquina de estados de la membresía (18 §4). La misma regla vive en SQL (public.tiene_acceso):
// trialing/active → acceso completo · cancelled → hasta access_until · past_due → durante la gracia ·
// expired/refunded/chargeback → sin acceso. 'trialing' y 'active' se distinguen solo para medir
// cuántas pruebas gratis se convierten en pago.

export type EstadoMembresia = 'trialing' | 'active' | 'past_due' | 'cancelled' | 'expired' | 'refunded' | 'chargeback';

export interface Membresia {
  status: EstadoMembresia;
  access_until?: string | null;
  grace_ends_at?: string | null;
}

export function tieneAcceso(m: Membresia, ahora: Date = new Date()): boolean {
  if (m.status === 'trialing' || m.status === 'active') return true;
  if (m.status === 'cancelled') return Boolean(m.access_until) && ahora < new Date(m.access_until as string);
  if (m.status === 'past_due') return Boolean(m.grace_ends_at) && ahora < new Date(m.grace_ends_at as string);
  return false;
}
