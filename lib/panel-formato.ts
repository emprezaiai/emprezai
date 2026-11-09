// Formato de números del panel de la dueña: dinero, porcentajes y fechas en español, siempre igual.

export function dinero(n: number, decimales = 2): string {
  const signo = n < 0 ? '−' : '';
  return `${signo}$${Math.abs(n).toLocaleString('es', { minimumFractionDigits: decimales, maximumFractionDigits: decimales })}`;
}

export function dineroMinor(minor: number, moneda: string): string {
  const valor = (minor / 100).toLocaleString('es', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return moneda === 'USD' ? `$${valor}` : `${valor} ${moneda}`;
}

export function pct(n: number, decimales = 0): string {
  return `${n.toLocaleString('es', { minimumFractionDigits: decimales, maximumFractionDigits: decimales })}%`;
}

export function entero(n: number): string {
  return n.toLocaleString('es');
}

export function fechaCorta(iso: string): string {
  return new Intl.DateTimeFormat('es', { day: 'numeric', month: 'short' }).format(new Date(iso));
}

export function fechaHora(iso: string): string {
  return new Intl.DateTimeFormat('es', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }).format(new Date(iso));
}

/** "2026-11" → "nov" (eje de los gráficos mensuales). */
export function mesCorto(aaaamm: string): string {
  const [a, m] = aaaamm.split('-').map(Number);
  return new Intl.DateTimeFormat('es', { month: 'short', timeZone: 'UTC' }).format(new Date(Date.UTC(a, m - 1, 1))).replace('.', '');
}

/** Cambio contra el período anterior, en palabras: "↑ 12%". null si no hay base; sube=null si no cambió. */
export function variacion(actual: number, anterior: number): { texto: string; sube: boolean | null } | null {
  if (anterior === 0) return null;
  const cambio = ((actual - anterior) / Math.abs(anterior)) * 100;
  if (Math.abs(cambio) < 0.5) return { texto: 'igual', sube: null };
  return { texto: `${cambio >= 0 ? '↑' : '↓'} ${pct(Math.abs(cambio))}`, sube: cambio >= 0 };
}

/** Decimal en español ("1,6"), para razones como "vuelve $1,6 por cada $1". */
export function decimal(n: number, decimales = 1): string {
  return n.toLocaleString('es', { minimumFractionDigits: decimales, maximumFractionDigits: decimales });
}

/** Nombre legible de un canal (el código sck del enlace de Hotmart). */
export function nombreCanal(codigo: string): string {
  if (codigo === 'sin código') return 'Llegaron solos (sin código)';
  const conocidos: Record<string, string> = { tiktok: 'TikTok', instagram: 'Instagram', facebook: 'Facebook', youtube: 'YouTube', whatsapp: 'WhatsApp', google: 'Google', email: 'Correo' };
  if (conocidos[codigo]) return conocidos[codigo];
  const afiliado = /^afiliad[oa]-(.+)$/.exec(codigo);
  if (afiliado) return `Afiliado: ${afiliado[1].replace(/-/g, ' ').replace(/^./, (c) => c.toUpperCase())}`;
  return codigo.replace(/-/g, ' ').replace(/^./, (c) => c.toUpperCase());
}
