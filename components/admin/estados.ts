// Cómo se muestra cada estado de membresía en el panel (texto en simple + color con significado).

export const NOMBRE_ESTADO: Record<string, { texto: string; tono: string }> = {
  trialing: { texto: 'En prueba', tono: 'text-gold' },
  active: { texto: 'Pagando', tono: 'text-green' },
  cancelled: { texto: 'Canceló', tono: 'text-ink-2' },
  past_due: { texto: 'Pago atrasado', tono: 'text-warning' },
  expired: { texto: 'Vencido', tono: 'text-ink-3' },
  refunded: { texto: 'Reembolsado', tono: 'text-danger' },
  chargeback: { texto: 'Contracargo', tono: 'text-danger' },
};
