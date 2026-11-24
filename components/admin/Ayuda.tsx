'use client';

// ⓘ junto a una métrica técnica: al tocarlo (o al pasar el mouse en computador) explica qué es, cómo
// se calcula y qué valor es sano. Se dibuja en el <body> para que nunca quede cortado por una tarjeta,
// se acomoda dentro de la pantalla y se queda abierto hasta que la persona toca afuera o Escape
// (lo que hay que LEER no se va solo).

import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Info, X } from 'lucide-react';
import { GLOSARIO, type ClaveGlosario } from '@/lib/panel-glosario';

const ANCHO = 300;
const MARGEN = 16;

export function Ayuda({ clave }: { clave: ClaveGlosario }) {
  const d = GLOSARIO[clave];
  const id = useId();
  const boton = useRef<HTMLButtonElement>(null);
  const caja = useRef<HTMLDivElement>(null);
  const cierre = useRef<number | null>(null);
  const [abierto, setAbierto] = useState(false);
  const [fijado, setFijado] = useState(false);
  const [pos, setPos] = useState<{ top: number; left: number; flecha: number; arriba: boolean } | null>(null);

  const ubicar = useCallback(() => {
    const b = boton.current?.getBoundingClientRect();
    if (!b) return;
    const ancho = Math.min(ANCHO, window.innerWidth - MARGEN * 2);
    const centro = b.left + b.width / 2;
    const left = Math.min(Math.max(centro - ancho / 2, MARGEN), window.innerWidth - ancho - MARGEN);
    const alto = caja.current?.offsetHeight ?? 200;
    const arriba = b.bottom + 8 + alto > window.innerHeight - MARGEN && b.top - 8 - alto > MARGEN;
    setPos({ top: arriba ? b.top - 8 - alto : b.bottom + 8, left, flecha: centro - left, arriba });
  }, []);

  const cerrar = useCallback(() => {
    setAbierto(false);
    setFijado(false);
  }, []);

  useEffect(() => {
    if (!abierto) return;
    ubicar();
    // Segunda pasada con la altura real de la caja (decide si va arriba o abajo).
    const raf = requestAnimationFrame(ubicar);
    const fuera = (e: PointerEvent) => {
      const t = e.target as Node;
      if (!caja.current?.contains(t) && !boton.current?.contains(t)) cerrar();
    };
    const tecla = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        cerrar();
        boton.current?.focus();
      }
    };
    document.addEventListener('pointerdown', fuera);
    document.addEventListener('keydown', tecla);
    window.addEventListener('scroll', ubicar, true);
    window.addEventListener('resize', ubicar);
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener('pointerdown', fuera);
      document.removeEventListener('keydown', tecla);
      window.removeEventListener('scroll', ubicar, true);
      window.removeEventListener('resize', ubicar);
    };
  }, [abierto, ubicar, cerrar]);

  // En computador se abre al pasar el mouse; al tocarlo queda fijo hasta cerrarlo.
  const conMouse = () => typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const entrar = () => {
    if (!conMouse()) return;
    if (cierre.current) window.clearTimeout(cierre.current);
    setAbierto(true);
  };
  const salir = () => {
    if (!conMouse() || fijado) return;
    cierre.current = window.setTimeout(() => setAbierto(false), 150);
  };

  return (
    <>
      <button
        ref={boton}
        type="button"
        aria-label={`Qué significa «${d.titulo}»`}
        aria-expanded={abierto}
        aria-controls={abierto ? id : undefined}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (abierto && fijado) cerrar();
          else {
            setAbierto(true);
            setFijado(true);
          }
        }}
        onMouseEnter={entrar}
        onMouseLeave={salir}
        className="relative z-10 -mt-0.5 inline-flex size-5 shrink-0 align-middle items-center justify-center rounded-full text-ink-3 transition-colors duration-150 before:absolute before:-inset-3 before:content-[''] hover:text-ink-1 focus-visible:text-ink-1 aria-expanded:text-ink-1"
      >
        <Info size={15} strokeWidth={2.2} aria-hidden="true" />
      </button>
      {abierto &&
        createPortal(
          <div
            ref={caja}
            id={id}
            role="dialog"
            aria-label={d.titulo}
            onMouseEnter={entrar}
            onMouseLeave={salir}
            style={{ top: pos?.top ?? -9999, left: pos?.left ?? -9999, width: Math.min(ANCHO, typeof window !== 'undefined' ? window.innerWidth - MARGEN * 2 : ANCHO) }}
            className="ayuda-caja fixed z-50 rounded-[var(--radius-chip)] border border-[var(--line)] bg-raised-2 p-4 text-left shadow-[0_18px_40px_-12px_rgb(0_0_0/0.75)]"
          >
            <span
              aria-hidden="true"
              className={`absolute size-3 rotate-45 border-[var(--line)] bg-raised-2 ${pos?.arriba ? '-bottom-1.5 border-r border-b' : '-top-1.5 border-t border-l'}`}
              style={{ left: (pos?.flecha ?? 0) - 6 }}
            />
            <div className="flex items-start justify-between gap-3">
              <p className="font-display text-base font-bold text-ink-1">{d.titulo}</p>
              <button type="button" onClick={cerrar} aria-label="Cerrar explicación" className="relative -mt-1 -mr-1 inline-flex size-7 shrink-0 items-center justify-center rounded-full text-ink-3 before:absolute before:-inset-2 before:content-[''] hover:text-ink-1">
                <X size={16} aria-hidden="true" />
              </button>
            </div>
            <p className="mt-1 text-caption text-ink-2">{d.que}</p>
            <p className="mt-3 text-xs font-semibold tracking-[0.06em] text-ink-3 uppercase">Cómo se calcula</p>
            <p className="mt-1 text-caption text-ink-1">{d.como}</p>
            {'sano' in d && d.sano && (
              <p className="mt-3 flex items-start gap-2 rounded-[var(--radius-chip)] bg-[color-mix(in_oklab,var(--green)_10%,transparent)] px-3 py-2 text-caption text-ink-1">
                <span aria-hidden="true" className="mt-1.5 size-1.5 shrink-0 rounded-full bg-green" />
                <span>
                  <strong className="font-semibold">Qué es sano: </strong>
                  {d.sano}
                </span>
              </p>
            )}
          </div>,
          document.body,
        )}
    </>
  );
}
