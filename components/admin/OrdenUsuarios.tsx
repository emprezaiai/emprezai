'use client';

// Orden de la lista de Usuarios: un selector (distinto de los chips de filtro, que eligen QUIÉNES se
// ven; esto elige en qué ORDEN). Muestra "Ordenando…" mientras llega la lista.

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowDownUp, LoaderCircle } from 'lucide-react';

export function SelectorOrden({ actual, opciones, urls }: { actual: string; opciones: { valor: string; texto: string }[]; urls: Record<string, string> }) {
  const router = useRouter();
  const [ordenando, iniciar] = useTransition();
  return (
    <label className="mb-2 flex items-center justify-end gap-2 text-caption text-ink-2">
      {ordenando ? <LoaderCircle size={14} className="motion-safe:animate-spin" aria-hidden="true" /> : <ArrowDownUp size={14} aria-hidden="true" />}
      <span className="sr-only">Ordenar la lista por</span>
      <select
        value={actual}
        onChange={(e) => {
          const url = urls[e.target.value];
          if (url) iniciar(() => router.push(url));
        }}
        className="min-h-11 rounded-[var(--radius-chip)] border-0 bg-transparent pr-1 text-caption font-semibold text-ink-1 focus:outline-2 focus:outline-ink-2"
      >
        {opciones.map((o) => (
          <option key={o.valor} value={o.valor}>
            {o.texto}
          </option>
        ))}
      </select>
    </label>
  );
}
