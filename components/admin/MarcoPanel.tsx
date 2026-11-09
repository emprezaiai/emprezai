'use client';

// Marco del panel de la dueña: cabecera fija con la marca y el menú de secciones. En el celular el
// menú se abre como lista (sin barra que se desplace de lado); en computador queda una columna fija.

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Menu, X } from 'lucide-react';
import { Marca } from '@/components/app/Marca';
import { SECCIONES } from './secciones';



function activa(ruta: string, href: string) {
  return href === '/admin' ? ruta === '/admin' : ruta.startsWith(href);
}

function ListaSecciones({ ruta, onElegir }: { ruta: string; onElegir?: () => void }) {
  return (
    <ul className="flex flex-col gap-1">
      {SECCIONES.map(({ href, etiqueta, icono: Icono }) => {
        const esta = activa(ruta, href);
        return (
          <li key={href}>
            <Link
              href={href}
              onClick={onElegir}
              aria-current={esta ? 'page' : undefined}
              className={`flex min-h-11 items-center gap-3 rounded-[var(--radius-chip)] px-3 text-ayuda font-semibold transition-colors duration-150 ${
                esta ? 'bg-[color-mix(in_oklab,var(--gold)_14%,transparent)] text-gold' : 'text-ink-2 hover:bg-raised hover:text-ink-1'
              }`}
            >
              <Icono size={18} strokeWidth={2.2} aria-hidden="true" />
              {etiqueta}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

export function MarcoPanel({ email, children }: { email: string; children: React.ReactNode }) {
  const ruta = usePathname();
  const reduce = useReducedMotion();
  const [abierto, setAbierto] = useState(false);
  const actual = SECCIONES.find((s) => activa(ruta, s.href));

  return (
    <div className="fondo-recorrido min-h-dvh">
      <header className="sticky top-0 z-20 border-b border-[var(--line)] bg-[color-mix(in_oklab,var(--surface-base)_92%,transparent)] backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-6xl items-center gap-3 px-4">
          <Link href="/admin" className="flex min-h-11 items-center gap-2" aria-label="Panel de EMPREZAI, inicio">
            <Marca tamano="sm" />
          </Link>
          <span className="rounded-[var(--radius-pill)] border border-[var(--line)] px-2 py-0.5 text-xs font-semibold text-ink-2">Panel</span>
          <button
            type="button"
            onClick={() => setAbierto((a) => !a)}
            aria-expanded={abierto}
            aria-controls="menu-panel"
            className="ml-auto flex min-h-11 max-w-[50%] items-center gap-2 rounded-[var(--radius-pill)] border border-[var(--line)] px-3 text-sm font-semibold text-ink-1 lg:hidden"
          >
            {abierto ? <X size={18} className="shrink-0" aria-hidden="true" /> : <Menu size={18} className="shrink-0" aria-hidden="true" />}
            <span className="truncate whitespace-nowrap">{actual?.etiqueta ?? 'Secciones'}</span>
          </button>
        </div>
        <AnimatePresence>
          {abierto && (
            <motion.nav
              id="menu-panel"
              aria-label="Secciones del panel"
              initial={{ opacity: 0, y: reduce ? 0 : -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: reduce ? 0 : -8 }}
              transition={{ duration: 0.2 }}
              className="border-t border-[var(--line)] bg-raised px-4 py-3 lg:hidden"
            >
              <ListaSecciones ruta={ruta} onElegir={() => setAbierto(false)} />
              <p className="mt-3 border-t border-[var(--line)] pt-3 text-caption text-ink-3">Entraste como {email}</p>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>

      <div className="mx-auto flex max-w-6xl gap-8 px-4 lg:py-8">
        <nav aria-label="Secciones del panel" className="sticky top-24 hidden h-fit w-56 shrink-0 lg:block">
          <ListaSecciones ruta={ruta} />
          <p className="mt-4 border-t border-[var(--line)] pt-4 text-caption break-words text-ink-3">Entraste como {email}</p>
        </nav>
        <main className="min-w-0 flex-1 pt-6 pb-16 lg:pt-0">{children}</main>
      </div>
    </div>
  );
}
