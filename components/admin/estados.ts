// Cómo se muestra cada estado de membresía en el panel: texto en simple + un punto de color con
// significado (verde = paga, ámbar = en camino o en riesgo, rojo = dinero devuelto, gris = sin acceso).
// El dorado NO se usa aquí: FICHA-ARTE lo reserva para el dato principal y el botón principal.

export const NOMBRE_ESTADO: Record<string, { texto: string; punto: string }> = {
  trialing: { texto: 'En prueba', punto: 'bg-[color-mix(in_oklab,var(--warning)_70%,transparent)]' },
  active: { texto: 'Pagando', punto: 'bg-green' },
  cancelled: { texto: 'Canceló', punto: 'bg-ink-3' },
  past_due: { texto: 'Pago atrasado', punto: 'bg-warning' },
  expired: { texto: 'Sin acceso', punto: 'bg-[color-mix(in_oklab,var(--ink-3)_60%,transparent)]' },
  refunded: { texto: 'Reembolsado', punto: 'bg-danger' },
  chargeback: { texto: 'Contracargo', punto: 'bg-danger' },
};

/** Estado a mostrar: quien entró a mano no "paga", tiene un acceso regalado. */
export function estadoVisible(estado: string, origen: 'hotmart' | 'manual') {
  if (origen === 'manual' && estado === 'active') return { texto: 'Acceso regalado', punto: 'border-2 border-green bg-transparent' };
  return NOMBRE_ESTADO[estado] ?? { texto: estado, punto: 'bg-ink-3' };
}
