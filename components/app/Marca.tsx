// Marca de EMPREZAI (isotipo de la dueña, 2026-10-14): "E" blanca con el rayo verde y la traza de
// circuito, dentro de un chip oscuro con borde degradé dorado→verde y halo verde. El nombre va con
// "EMPREZ" claro y "AI" en verde. Es la ÚNICA pieza que usa la letra de la marca (--font-marca).

import { useId } from 'react';

export function Isotipo({ tamano = 28, className = '' }: { tamano?: number; className?: string }) {
  const id = useId().replace(/:/g, '');
  return (
    <svg
      aria-hidden="true"
      width={tamano}
      height={tamano}
      viewBox="0 0 64 64"
      className={`shrink-0 ${className}`}
      style={{ filter: 'drop-shadow(0 0 6px rgb(61 220 151 / 0.35))' }}
    >
      <defs>
        <linearGradient id={`${id}b`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" style={{ stopColor: 'var(--gold-light)' }} />
          <stop offset="0.45" style={{ stopColor: 'var(--green)' }} />
          <stop offset="1" style={{ stopColor: 'var(--green)' }} />
        </linearGradient>
        <linearGradient id={`${id}l`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" style={{ stopColor: 'var(--ink-1)' }} />
          <stop offset="1" style={{ stopColor: 'var(--ink-2)' }} />
        </linearGradient>
        <linearGradient id={`${id}r`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" style={{ stopColor: 'var(--green-light)' }} />
          <stop offset="1" style={{ stopColor: 'var(--green)' }} />
        </linearGradient>
      </defs>
      <rect x="3" y="3" width="58" height="58" rx="15" style={{ fill: 'var(--surface-sunken)' }} stroke={`url(#${id}b)`} strokeWidth="2.5" />
      {/* La E */}
      <g fill={`url(#${id}l)`}>
        <rect x="21" y="15" width="24" height="7" rx="2" />
        <rect x="21" y="15" width="8" height="34" rx="2" />
        <rect x="21" y="42" width="24" height="7" rx="2" />
        <rect x="27" y="29" width="9" height="6" rx="1.5" />
      </g>
      {/* La traza de circuito */}
      <path d="M36 32H41L45 27.6" fill="none" style={{ stroke: 'var(--green)' }} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="46.6" cy="25.9" r="2.4" style={{ fill: 'var(--surface-sunken)', stroke: 'var(--green)' }} strokeWidth="2" />
      {/* El rayo */}
      <path d="M27 17 14 35h9l-4 12 15-19h-9l5-11z" fill={`url(#${id}r)`} style={{ stroke: 'var(--surface-sunken)' }} strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}

const TAMANOS = {
  sm: { iso: 24, texto: 'text-ayuda', gap: 'gap-2' },
  md: { iso: 28, texto: 'text-boton', gap: 'gap-2' },
  lg: { iso: 40, texto: 'text-precio', gap: 'gap-3' },
} as const;

/** El nombre escrito como en el logo: EMPREZ claro + AI verde. */
export function NombreMarca({ className = '' }: { className?: string }) {
  return (
    <span className={`font-marca font-extrabold tracking-[0.01em] whitespace-nowrap ${className}`}>
      <span className="text-ink-1">EMPREZ</span>
      <span className="text-green">AI</span>
    </span>
  );
}

/** Isotipo + nombre (cabeceras y pies). */
export function Marca({ tamano = 'md', className = '' }: { tamano?: keyof typeof TAMANOS; className?: string }) {
  const t = TAMANOS[tamano];
  return (
    <span className={`inline-flex items-center ${t.gap} ${className}`}>
      <Isotipo tamano={t.iso} />
      <NombreMarca className={`${t.texto} leading-none`} />
      <span className="sr-only">EMPREZAI</span>
    </span>
  );
}
