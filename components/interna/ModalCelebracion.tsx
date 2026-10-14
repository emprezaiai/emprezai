'use client';

// Celebración de logro (56: los momentos que retienen). Ventana modal reusable: insignia central
// animada con el check, confeti, reconocimiento con el nombre, la recompensa REAL (la racha), tres
// insignias en la base y una sola acción principal. Accesible: diálogo modal con foco en la acción,
// Escape cierra, el foco no se escapa, y respeta "reducir movimiento".

import { useEffect, useRef, type ComponentType } from 'react';
import Link from 'next/link';
import { AnimatePresence, animate, motion, useReducedMotion } from 'motion/react';
import { ArrowRight, Check, X } from 'lucide-react';
import { EASE_SALIDA, vibrar } from '@/components/onboarding/piezas';

type Icono = ComponentType<{ size?: number; strokeWidth?: number; className?: string; 'aria-hidden'?: boolean | 'true' }>;

export interface PropsCelebracion {
  abierto: boolean;
  titulo: string;
  subtitulo: string;
  /** El dato real que se gana hoy: el número cuenta y va en grande ("8" + "días de racha"). */
  recompensa: { icono: Icono; valor: number; texto: string };
  /** Qué sigue (la ventana tapa el aviso de abajo: aquí se dice). */
  siguiente?: string;
  insignias: { icono: Icono; texto: string }[];
  accion: { texto: string; href: string };
  secundaria?: { texto: string; href: string };
  /** Hito grande (cierre de semana): más confeti. */
  hito?: boolean;
  onCerrar: () => void;
}

const PIEZAS_CONFETI = 22;

/* El número de la recompensa cuenta de 0 a su valor (baseline 2 de 22). */
function Conteo({ valor }: { valor: number }) {
  const reduce = useReducedMotion();
  const nodo = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (!nodo.current) return;
    if (reduce) {
      nodo.current.textContent = String(valor);
      return;
    }
    const control = animate(0, valor, {
      duration: 0.6,
      delay: 0.6,
      ease: 'easeOut',
      onUpdate: (v) => {
        if (nodo.current) nodo.current.textContent = String(Math.round(v));
      },
    });
    return () => control.stop();
  }, [valor, reduce]);
  return (
    <span ref={nodo} className="tabular-nums">
      {reduce ? valor : 0}
    </span>
  );
}

export function ModalCelebracion({ abierto, titulo, subtitulo, recompensa, siguiente, insignias, accion, secundaria, hito = false, onCerrar }: PropsCelebracion) {
  const reduce = useReducedMotion();
  const caja = useRef<HTMLDivElement>(null);
  const principal = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (!abierto) return;
    vibrar(40);
    const t = window.setTimeout(() => principal.current?.focus({ preventScroll: true }), 50);
    const anterior = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const tecla = (ev: KeyboardEvent) => {
      if (ev.key === 'Escape') onCerrar();
      if (ev.key === 'Tab' && caja.current) {
        const enfocables = caja.current.querySelectorAll<HTMLElement>('a[href], button');
        const primero = enfocables[0];
        const ultimo = enfocables[enfocables.length - 1];
        if (ev.shiftKey && document.activeElement === primero) {
          ev.preventDefault();
          ultimo?.focus();
        } else if (!ev.shiftKey && document.activeElement === ultimo) {
          ev.preventDefault();
          primero?.focus();
        }
      }
    };
    window.addEventListener('keydown', tecla);
    return () => {
      window.clearTimeout(t);
      document.body.style.overflow = anterior;
      window.removeEventListener('keydown', tecla);
    };
  }, [abierto, onCerrar]);

  const Recompensa = recompensa.icono;

  return (
    <AnimatePresence>
      {abierto && (
        <motion.div
          className="velo-oscuro fixed inset-0 z-40 flex items-center justify-center px-4 py-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onCerrar}
        >
          <motion.div
            ref={caja}
            role="dialog"
            aria-modal="true"
            aria-labelledby="celebracion-titulo"
            aria-describedby="celebracion-texto"
            initial={{ opacity: 0, scale: reduce ? 1 : 0.92, y: reduce ? 0 : 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: reduce ? 1 : 0.96 }}
            transition={reduce ? { duration: 0.15 } : { type: 'spring', bounce: 0.25, duration: 0.5 }}
            onClick={(ev) => ev.stopPropagation()}
            className="tarjeta-relieve relative max-h-full w-full max-w-sm overflow-y-auto rounded-[var(--radius-card)] px-5 pt-5 pb-6 text-center"
          >
            <button
              type="button"
              onClick={onCerrar}
              aria-label="Cerrar"
              className="absolute top-2 right-2 flex size-11 items-center justify-center rounded-full text-ink-2 transition-[background-color,transform] duration-150 hover:bg-raised-2 active:scale-95"
            >
              <X size={20} aria-hidden="true" />
            </button>

            {/* Insignia central: el check en relieve verde, con anillo que respira y confeti alrededor */}
            <div className="relative mx-auto mt-4 flex size-28 items-center justify-center">
              {!reduce &&
                Array.from({ length: hito ? PIEZAS_CONFETI : 12 }, (_, i) => {
                  const total = hito ? PIEZAS_CONFETI : 12;
                  const angulo = (i / total) * Math.PI * 2;
                  const distancia = hito ? 150 : 110;
                  return (
                    <motion.span
                      key={i}
                      aria-hidden="true"
                      className={`absolute rounded-full ${i % 3 === 0 ? 'size-2 bg-green' : i % 3 === 1 ? 'size-2 bg-gold' : 'size-1.5 bg-gold-light'}`}
                      initial={{ x: 0, y: 0, opacity: 0, scale: 0.6 }}
                      animate={{ x: Math.cos(angulo) * distancia, y: Math.sin(angulo) * distancia * 0.75 + 20, opacity: [0, 1, 0], scale: 1 }}
                      transition={{ duration: hito ? 1.3 : 0.9, delay: 0.3 + (i % 4) * 0.03, ease: EASE_SALIDA }}
                    />
                  );
                })}
              {!reduce && (
                <motion.span
                  aria-hidden="true"
                  className="absolute inset-0 rounded-full bg-[color-mix(in_oklab,var(--green)_30%,transparent)]"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: [0.8, 1.25], opacity: [0.7, 0] }}
                  transition={{ duration: 1.4, delay: 0.35, repeat: 1, ease: 'easeOut' }}
                />
              )}
              <motion.span
                aria-hidden="true"
                className="relieve-verde relative flex size-24 items-center justify-center rounded-full"
                initial={{ scale: reduce ? 1 : 0.4, rotate: reduce ? 0 : -12 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={reduce ? { duration: 0 } : { type: 'spring', bounce: 0.25, duration: 0.6, delay: 0.1 }}
              >
                <Check size={48} strokeWidth={3.2} />
              </motion.span>
            </div>

            <motion.h2
              id="celebracion-titulo"
              initial={{ opacity: 0, y: reduce ? 0 : 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: reduce ? 0 : 0.35, ease: EASE_SALIDA }}
              className="mt-6 font-display text-pregunta font-extrabold text-balance text-ink-1"
            >
              {titulo}
            </motion.h2>
            <motion.p
              id="celebracion-texto"
              initial={{ opacity: 0, y: reduce ? 0 : 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: reduce ? 0 : 0.42, ease: EASE_SALIDA }}
              className="mt-2 text-base text-pretty text-ink-2"
            >
              {subtitulo}
            </motion.p>

            {/* La recompensa: real (la racha), con el rayo dorado de la marca */}
            <motion.p
              initial={{ opacity: 0, scale: reduce ? 1 : 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={reduce ? { duration: 0 } : { type: 'spring', bounce: 0.25, duration: 0.45, delay: 0.55 }}
              className="mx-auto mt-5 inline-flex items-center gap-3 rounded-[var(--radius-pill)] border border-[color-mix(in_oklab,var(--gold)_40%,transparent)] bg-[color-mix(in_oklab,var(--gold)_12%,transparent)] py-2 pr-5 pl-2"
            >
              <span aria-hidden="true" className="relieve-oro flex size-10 items-center justify-center rounded-full">
                <Recompensa size={20} strokeWidth={1.5} />
              </span>
              <span className="font-display text-precio leading-none font-extrabold text-ink-1">
                <Conteo valor={recompensa.valor} />
              </span>
              <span className="text-base font-semibold text-ink-1">{recompensa.texto}</span>
            </motion.p>

            {/* Tres insignias en la base */}
            <ul className="mt-5 grid grid-cols-3 gap-2" aria-label="Lo que sumas hoy">
              {insignias.map(({ icono: IconoInsignia, texto }, i) => (
                <motion.li
                  key={texto}
                  initial={{ opacity: 0, y: reduce ? 0 : 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: reduce ? 0 : 0.7 + i * 0.07, ease: EASE_SALIDA }}
                  className="flex flex-col items-center gap-1 text-xs font-semibold whitespace-nowrap text-ink-3"
                >
                  <IconoInsignia size={18} strokeWidth={2} aria-hidden="true" />
                  {texto}
                </motion.li>
              ))}
            </ul>
            {siguiente && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: reduce ? 0 : 0.85 }}
                className="mt-4 border-t border-[var(--line)] pt-4 text-caption text-pretty text-ink-2"
              >
                {siguiente}
              </motion.p>
            )}

            <motion.div
              initial={{ opacity: 0, y: reduce ? 0 : 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: reduce ? 0 : 0.85, ease: EASE_SALIDA }}
              className="mt-6"
            >
              <Link
                ref={principal}
                href={accion.href}
                className="boton-oro flex h-14 w-full items-center justify-center gap-2 rounded-[var(--radius-pill)] font-display text-boton font-bold"
              >
                {accion.texto}
                <ArrowRight size={20} aria-hidden="true" />
              </Link>
              {secundaria && (
                <Link
                href={secundaria.href}
                className="mt-1 flex min-h-11 items-center justify-center text-sm font-semibold text-ink-2 transition-transform duration-150 active:scale-[0.97]"
              >
                  {secundaria.texto}
                </Link>
              )}
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
