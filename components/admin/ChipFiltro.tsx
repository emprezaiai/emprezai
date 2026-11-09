'use client';

// Chip de filtro que muestra que está cargando apenas se toca (la lista nueva llega del servidor).

import Link, { useLinkStatus } from 'next/link';
import { LoaderCircle } from 'lucide-react';

function Cargando() {
  const { pending } = useLinkStatus();
  return pending ? <LoaderCircle size={12} className="motion-safe:animate-spin" aria-label="Cargando" /> : null;
}

export function ChipFiltro({ href, activo, children }: { href: string; activo: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      aria-current={activo ? 'true' : undefined}
      className={`flex min-h-11 items-center gap-1.5 rounded-[var(--radius-pill)] border px-3 text-xs font-semibold transition-transform duration-100 active:scale-[0.98] ${
        activo ? 'border-ink-2 bg-raised-2 text-ink-1' : 'border-[var(--line)] text-ink-2 hover:text-ink-1'
      }`}
    >
      {children}
      <Cargando />
    </Link>
  );
}
