'use client';

// Chip de filtro que muestra que está cargando apenas se toca (la lista nueva llega del servidor).

import Link, { useLinkStatus } from 'next/link';
import { LoaderCircle } from 'lucide-react';

function Cargando() {
  const { pending } = useLinkStatus();
  return pending ? <LoaderCircle size={12} className="motion-safe:animate-spin" aria-label="Cargando" /> : null;
}

/** Flecha del selector de mes: muestra que carga apenas se toca. */
export function FlechaMes({ href, etiqueta, children }: { href: string; etiqueta: string; children: React.ReactNode }) {
  return (
    <Link href={href} aria-label={etiqueta} className="flex size-11 items-center justify-center rounded-full border border-[var(--line)] text-ink-1 transition-transform duration-100 hover:bg-raised active:scale-[0.98]">
      <IconoOCarga>{children}</IconoOCarga>
    </Link>
  );
}

function IconoOCarga({ children }: { children: React.ReactNode }) {
  const { pending } = useLinkStatus();
  return pending ? <LoaderCircle size={18} className="motion-safe:animate-spin" aria-label="Cargando" /> : <>{children}</>;
}

export function ChipFiltro({ href, activo, children, cuenta }: { href: string; activo: boolean; children: React.ReactNode; cuenta?: number }) {
  return (
    <Link
      href={href}
      aria-current={activo ? 'true' : undefined}
      className={`flex min-h-11 items-center gap-1.5 rounded-[var(--radius-pill)] border px-3 text-xs font-semibold transition-transform duration-100 active:scale-[0.98] ${
        activo ? 'border-ink-2 bg-raised-2 text-ink-1' : 'border-[var(--line)] text-ink-2 hover:text-ink-1'
      }`}
    >
      {children}
      {cuenta !== undefined && <span className={`tabular-nums ${activo ? 'text-ink-2' : 'text-ink-3'}`}>{cuenta}</span>}
      <Cargando />
    </Link>
  );
}
