'use client';

// RUTA — el mapa de juego de la Opción B (camino de nodos en relieve estilo Duolingo) con los colores
// de la C. 30 días en 4 semanas; el nodo de HOY pulsa (firma de motion de FICHA-ARTE). Cada nodo hace
// algo: hecho → abre la pieza · hoy → la misión · bloqueado → dice cuándo se abre.

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, animate, motion, useReducedMotion } from 'motion/react';
import { ArrowRight, Check, Clock, Flame, Gift, LocateFixed, LockKeyhole, Puzzle, X, Zap } from 'lucide-react';
import { vibrar } from '@/components/onboarding/piezas';
import { estadoRuta } from '@/lib/cuenta';
import { RUTA, SEMANAS, TOTAL_DIAS, diaRuta } from '@/lib/ruta';
import { EASE_SALIDA } from '@/components/onboarding/piezas';
import { useCuentaActiva } from './Marco';

// Zigzag del camino (desplazamiento horizontal en px desde el centro) y paso vertical.
const ZIGZAG = [-90, 0, 90, 0, -90, 0, 90];
const PASO = 96;
const ANCHO = 320;

type EstadoNodo = 'hecho' | 'hoy' | 'manana' | 'bloqueado';

export function Ruta() {
  const cuenta = useCuentaActiva();
  const reduce = useReducedMotion();
  const e = estadoRuta(cuenta);
  const [aviso, setAviso] = useState('');
  const [hoyVisible, setHoyVisible] = useState(true);
  const [llamado, setLlamado] = useState(0);
  const semanaActual = diaRuta(e.hechaHoy ? Math.max(e.piezasListas, 1) : e.diaActual).semana;
  const refHoy = useRef<HTMLLIElement>(null);
  const hecho = new Set(cuenta.piezas.map((p) => p.dia));

  function irAHoy(suave = true) {
    refHoy.current?.scrollIntoView({ block: 'center', behavior: suave && !reduce ? 'smooth' : 'auto' });
  }

  useEffect(() => {
    // Abre la ruta en el día que toca (no en el día 1 si ya vas en la semana 3).
    if (e.diaActual > 2) irAHoy(false);
    // Solo al entrar.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const nodo = refHoy.current;
    if (!nodo || typeof IntersectionObserver === 'undefined') return;
    const obs = new IntersectionObserver(([entrada]) => setHoyVisible(entrada.isIntersecting), { rootMargin: '-64px 0px -200px 0px' });
    obs.observe(nodo);
    return () => obs.disconnect();
  }, []);

  function estadoDe(dia: number): EstadoNodo {
    if (hecho.has(dia)) return 'hecho';
    if (dia === e.diaActual && !e.terminada) return e.hechaHoy ? 'manana' : 'hoy';
    return 'bloqueado';
  }

  const hoy = diaRuta(e.diaActual);

  return (
    <main className="fondo-puntos-ruta">
      <header className="sticky top-0 z-10 flex h-16 items-center gap-2 border-b border-[var(--line)] bg-[var(--surface-base)] px-4">
        <p className="flex items-center gap-1 text-sm text-ink-2">
          <Flame size={18} className={e.rachaEnRiesgo ? 'text-ink-2' : 'text-gold'} fill={e.rachaEnRiesgo ? 'none' : 'currentColor'} aria-hidden="true" />
          <span className="font-display text-base font-extrabold text-ink-1 tabular-nums">{e.racha}</span>
          {e.racha === 1 ? 'día' : 'días'}
          {e.rachaEnRiesgo && <span className="sr-only">(hoy falta tu pieza para mantenerla)</span>}
        </p>
        <p className="flex items-center gap-1 text-sm text-ink-2">
          <Puzzle size={18} className="text-green" aria-hidden="true" />
          <span className="font-display text-base font-extrabold text-ink-1 tabular-nums">
            <CuentaRuta valor={e.piezasListas} />/{TOTAL_DIAS}
          </span>
        </p>
        {!hoyVisible && (
          <motion.button
            type="button"
            onClick={() => irAHoy()}
            aria-label="Ir a mi día"
            initial={{ opacity: 0, scale: reduce ? 1 : 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="tarjeta-relieve ml-auto flex size-11 items-center justify-center rounded-full text-ink-1 transition-transform duration-150 active:scale-95"
          >
            <LocateFixed size={18} aria-hidden="true" />
          </motion.button>
        )}
      </header>

      <div className="px-4 pt-2">
        {SEMANAS.map((s) => {
          const dias = RUTA.filter((d) => d.semana === s.numero);
          const completa = dias.every((d) => hecho.has(d.dia));
          const actual = s.numero === semanaActual;
          const alto = dias.length * PASO + 24;
          const puntos = dias.map((_, i) => ({ x: ANCHO / 2 + ZIGZAG[i % ZIGZAG.length], y: i * PASO + 72 }));
          const camino = puntos
            .slice(1)
            .map((p, j) => {
              const a = puntos[j];
              const desde = { x: a.x, y: a.y + 70 };
              const hasta = { x: p.x, y: p.y - 34 };
              return `M ${desde.x} ${desde.y} Q ${(desde.x + hasta.x) / 2} ${hasta.y} ${hasta.x} ${hasta.y}`;
            })
            .join(' ');
          return (
            <section key={s.numero} aria-label={`Semana ${s.numero}: ${s.tema}`} className="scroll-mt-20 pb-8">
              <div
                className={`rounded-[var(--radius-card)] p-4 ${
                  actual ? 'bg-gradient-to-b from-gold-light to-gold text-on-gold shadow-[0_4px_0_var(--gold-deep)]' : 'tarjeta-relieve'
                }`}
              >
                <p className={`flex items-center gap-2 text-xs font-bold tracking-[0.08em] uppercase ${actual ? '' : completa ? 'text-green' : 'text-ink-3'}`}>
                  {completa && <Check size={14} strokeWidth={3} aria-hidden="true" />}
                  Semana {s.numero} de 4
                </p>
                <h2 className={`mt-1 font-display text-xl leading-tight font-extrabold ${actual ? '' : 'text-ink-1'}`}>{s.tema}</h2>
                <p className={`mt-1 text-sm ${actual ? 'opacity-80' : 'text-ink-2'}`}>{s.meta}</p>
              </div>

              <div className="relative mx-auto mt-4" style={{ width: ANCHO, height: alto }}>
                <svg aria-hidden="true" className="absolute inset-0" width={ANCHO} height={alto} viewBox={`0 0 ${ANCHO} ${alto}`}>
                  <defs>
                    <clipPath id={`revelar-${s.numero}`}>
                      <motion.rect
                        x="0"
                        y="0"
                        width={ANCHO}
                        initial={{ height: actual && !reduce ? 0 : alto }}
                        animate={{ height: alto }}
                        transition={{ duration: 0.9, delay: 0.2, ease: EASE_SALIDA }}
                      />
                    </clipPath>
                  </defs>
                  <path
                    d={camino}
                    clipPath={`url(#revelar-${s.numero})`}
                    fill="none"
                    stroke="rgb(255 255 255 / 0.16)"
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray="0.1 14"
                  />
                </svg>
                <ol>
                  {dias.map((d, i) => {
                    const estado = estadoDe(d.dia);
                    const p = puntos[i];
                    const grande = estado === 'hoy';
                    const tam = grande ? 80 : 64;
                    const contenido = (
                      <>
                        {grande && !reduce && (
                          <motion.span
                            aria-hidden="true"
                            className="absolute inset-0 rounded-full bg-[color-mix(in_oklab,var(--gold)_35%,transparent)]"
                            animate={{ scale: [1, 1.35], opacity: [0.6, 0] }}
                            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut' }}
                          />
                        )}
                        <span
                          className={`relative flex size-full items-center justify-center rounded-full ${
                            estado === 'hecho'
                              ? 'relieve-verde'
                              : estado === 'hoy'
                                ? 'relieve-oro'
                                : estado === 'manana'
                                  ? 'relieve-piedra'
                                  : 'relieve-piedra-apagada'
                          }`}
                        >
                          {estado === 'hecho' ? (
                            <Check size={28} strokeWidth={3} aria-hidden="true" />
                          ) : estado === 'hoy' ? (
                            <Zap size={34} fill="currentColor" strokeWidth={0} aria-hidden="true" />
                          ) : estado === 'manana' ? (
                            <Clock size={24} aria-hidden="true" />
                          ) : d.cierre ? (
                            <Gift size={24} aria-hidden="true" />
                          ) : (
                            <LockKeyhole size={22} aria-hidden="true" />
                          )}
                        </span>
                      </>
                    );
                    const etiqueta = `Día ${d.dia}: ${d.pieza}${estado === 'hecho' ? ' (lista)' : estado === 'hoy' ? ' (hoy)' : estado === 'manana' ? ' (mañana)' : ' (bloqueado)'}`;
                    return (
                      <motion.li
                        key={d.dia}
                        ref={estado === 'hoy' || estado === 'manana' ? refHoy : undefined}
                        initial={{ opacity: 0, scale: reduce ? 1 : 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ type: 'spring', bounce: 0.25, duration: 0.4, delay: reduce ? 0 : i * 0.05 }}
                        className="absolute flex flex-col items-center"
                        style={{ left: p.x - 60, top: p.y - tam / 2, width: 120, scrollMarginTop: 120 }}
                      >
                        {grande && (
                          <span className="absolute -top-8 z-10 rounded-[var(--radius-pill)] bg-ink-1 px-3 py-1 text-xs font-extrabold whitespace-nowrap text-[var(--surface-base)] shadow-[0_2px_0_rgb(0_0_0/0.4)]">
                            HOY · 5 MIN
                          </span>
                        )}
                        {estado === 'hecho' ? (
                          <Link href={`/app/empresa?pieza=${d.dia}`} aria-label={etiqueta} className="relative block transition-transform duration-150 active:scale-95" style={{ width: tam, height: tam }}>
                            {contenido}
                          </Link>
                        ) : estado === 'hoy' ? (
                          <button
                            type="button"
                            aria-label={`${etiqueta}. Empiézala desde la tarjeta de abajo.`}
                            onClick={() => {
                              setLlamado((n) => n + 1);
                              vibrar();
                            }}
                            className="relative block transition-transform duration-150 active:scale-95"
                            style={{ width: tam, height: tam }}
                          >
                            {contenido}
                          </button>
                        ) : (
                          <button
                            type="button"
                            aria-label={etiqueta}
                            onClick={() =>
                              setAviso(
                                estado === 'manana'
                                  ? `El día ${d.dia} se abre mañana. Hoy ya armaste tu pieza.`
                                  : `El día ${d.dia} (${d.pieza.toLowerCase()}) se abre cuando termines el día ${d.dia - 1}.`,
                              )
                            }
                            className="relative block transition-transform duration-150 active:scale-95"
                            style={{ width: tam, height: tam }}
                          >
                            {contenido}
                          </button>
                        )}
                        <span className="relative mt-1 flex flex-col items-center px-2 text-center">
                          <span className={`text-xs font-bold ${estado === 'hoy' ? 'text-gold' : estado === 'hecho' ? 'text-green' : 'text-ink-3'}`}>Día {d.dia}</span>
                          <span className="text-xs whitespace-nowrap text-ink-2">{d.corto}</span>
                        </span>
                      </motion.li>
                    );
                  })}
                </ol>
              </div>
            </section>
          );
        })}
      </div>

      {/* La misión de hoy, siempre a mano */}
      <div className="velo-tarjeta-fija sticky bottom-0 z-10 px-4 pt-6 pb-24">
        <AnimatePresence initial={false}>
          {aviso && (
            <motion.div
              key={aviso}
              role="status"
              aria-live="polite"
              initial={{ opacity: 0, y: reduce ? 0 : 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: EASE_SALIDA }}
              className="mb-2 flex items-start gap-2 rounded-[var(--radius-chip)] bg-raised-2 py-2 pr-1 pl-3 text-caption text-ink-1"
            >
              <span className="flex-1 pt-1">{aviso}</span>
              <button type="button" onClick={() => setAviso('')} aria-label="Cerrar aviso" className="flex size-8 shrink-0 items-center justify-center rounded-full text-ink-2">
                <X size={16} aria-hidden="true" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
        <motion.div
          key={llamado}
          initial={llamado ? { scale: reduce ? 1 : 0.97 } : { opacity: 0, y: reduce ? 0 : 16 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={llamado ? { type: 'spring', bounce: 0.25, duration: 0.4 } : { duration: 0.4, delay: reduce ? 0 : 0.3, ease: EASE_SALIDA }}
          className={`flex items-center gap-3 rounded-[var(--radius-card)] p-3 ${e.hechaHoy || e.terminada ? 'tarjeta-relieve' : 'hairline-oro relieve-tarjeta'}`}
        >
          <span
            aria-hidden="true"
            className={`flex size-11 shrink-0 items-center justify-center rounded-[var(--radius-chip)] ${e.hechaHoy || e.terminada ? 'relieve-verde' : 'relieve-piedra'}`}
          >
            {e.hechaHoy || e.terminada ? <Check size={20} strokeWidth={3} /> : <Puzzle size={20} strokeWidth={2.2} />}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-xs font-semibold text-ink-3">
              {e.terminada
                ? '¡Ruta completa!'
                : e.hechaHoy
                  ? 'Pieza de hoy lista'
                  : e.rachaEnRiesgo
                    ? `Hazla y sigues con ${e.racha} ${e.racha === 1 ? 'día' : 'días'}`
                    : `Hoy · Día ${hoy.dia} · 5 min`}
            </span>
            <span className="line-clamp-2 font-display text-base leading-snug font-bold text-ink-1">
              {e.terminada ? 'Tu negocio está listo' : e.hechaHoy ? `Mañana: ${hoy.pieza.charAt(0).toLowerCase()}${hoy.pieza.slice(1)}` : hoy.pieza}
            </span>
          </span>
          <Link
            href={e.hechaHoy || e.terminada ? '/app/empresa' : '/app/mision'}
            className={`flex h-12 shrink-0 items-center gap-1 rounded-[var(--radius-pill)] px-4 font-display text-sm font-bold ${
              e.hechaHoy || e.terminada ? 'border border-[var(--line)] bg-raised-2 text-ink-1' : 'boton-oro'
            }`}
          >
            {e.hechaHoy || e.terminada ? 'Mi Empresa' : 'Empezar'}
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </motion.div>
      </div>
    </main>
  );
}

/* Número que cuenta de 0 a su valor al entrar (baseline 2 de 22). */
function CuentaRuta({ valor }: { valor: number }) {
  const reduce = useReducedMotion();
  const nodo = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (!nodo.current || reduce) return;
    const control = animate(0, valor, {
      duration: 0.6,
      delay: 0.2,
      ease: 'easeOut',
      onUpdate: (v) => {
        if (nodo.current) nodo.current.textContent = String(Math.round(v));
      },
    });
    return () => control.stop();
  }, [valor, reduce]);
  return <span ref={nodo}>{valor}</span>;
}
