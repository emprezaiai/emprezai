'use client';

// Buscador de Usuarios: muestra "Buscando…" mientras llega la lista y tiene una × para limpiar la
// búsqueda. Conserva el filtro de estado elegido.

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { LoaderCircle, Search, X } from 'lucide-react';

export function BuscadorUsuarios({ inicial, estado }: { inicial: string; estado: string }) {
  const router = useRouter();
  const [texto, setTexto] = useState(inicial);
  const [buscando, iniciar] = useTransition();

  const ir = (q: string) => {
    const p = new URLSearchParams();
    if (q.trim()) p.set('q', q.trim());
    if (estado !== 'todos') p.set('estado', estado);
    const qs = p.toString();
    iniciar(() => router.push(`/admin/usuarios${qs ? `?${qs}` : ''}`));
  };

  return (
    <form
      role="search"
      className="flex gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        ir(texto);
      }}
    >
      <label className="relative min-w-0 flex-1">
        <span className="sr-only">Buscar por correo o nombre</span>
        <Search size={18} className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-ink-3" aria-hidden="true" />
        <input
          name="q"
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder="Correo o nombre"
          className="h-12 w-full rounded-[var(--radius-pill)] border border-[color-mix(in_oklab,var(--ink-3)_45%,transparent)] bg-sunken pr-11 pl-11 text-base text-ink-1 placeholder:text-ink-3 focus:border-ink-2 focus:outline-none"
        />
        {texto && (
          <button
            type="button"
            aria-label="Borrar la búsqueda"
            onClick={() => {
              setTexto('');
              if (inicial) ir('');
            }}
            className="absolute top-1/2 right-1 flex size-10 -translate-y-1/2 items-center justify-center rounded-full text-ink-3 hover:text-ink-1"
          >
            <X size={16} aria-hidden="true" />
          </button>
        )}
      </label>
      <button
        type="submit"
        disabled={buscando}
        className="opcion-recorrido flex min-h-12 shrink-0 items-center gap-2 px-5 text-caption font-semibold text-ink-1 transition-transform duration-100 active:scale-[0.98]"
      >
        {buscando && <LoaderCircle size={14} className="motion-safe:animate-spin" aria-hidden="true" />}
        {buscando ? 'Buscando…' : 'Buscar'}
      </button>
    </form>
  );
}
