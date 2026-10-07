'use client';

// RUTA — el mapa de juego de la Opción B (camino de nodos en relieve estilo Duolingo) con los colores
// de la C. 30 días en 4 semanas; el nodo de HOY pulsa (firma de motion de FICHA-ARTE). Cada nodo hace
// algo: hecho → abre la pieza · hoy → la misión · bloqueado → dice cuándo se abre.

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, animate, motion, useReducedMotion } from 'motion/react';
import { ArrowRight, Bell, Check, Clock, Flame, Gift, LocateFixed, LockKeyhole, Puzzle, X, Zap } from 'lucide-react';
import { vibrar } from '@/components/onboarding/piezas';
import { estadoRuta } from '@/lib/cuenta';
import { RUTA, SEMANAS, TOTAL_DIAS, diaRuta } from '@/lib/ruta';
import { EASE_SALIDA } from '@/components/onboarding/piezas';
import { useCuentaActiva } from './Marco';

// Zigzag del camino (desplazamiento horizontal en px desde el centro) y paso vertical.
const ZIGZAG = [-90, 0, 90, 0, -90, 0, 90];
const PASO = 124;
// Centro del primer nodo y aire bajo la etiqueta del último (deja espacio al rótulo "HOY · 5 min").
const ARRIBA = 64;
const ABAJO = 76;
const ANCHO = 320;

type EstadoNodo = 'hecho' | 'hoy' | 'manana' | 'bloqueado';

export function Ruta() {
  const cuenta = useCuentaActiva();
  const reduce = useReducedMotion();
  const e = estadoRuta(cuenta);
  const [aviso, setAviso] = useState('');
  const [hoyVisible, setHoyVisible] = useState(true);
  const [llamado, setLlamado] = useState(0);
  const [avisoQuieto, setAvisoQuieto] = useState(false);
  const [verGuia, setVerGuia] = useState(() => {
    try {
      return localStorage.getItem('empresai_guia_ruta') !== 'vista';
    } catch {
      return false;
    }
  });

  function cerrarGuia() {
    setVerGuia(false);
    try {
      localStorage.setItem('empresai_guia_ruta', 'vista');
    } catch {
      // Sin almacenamiento: se vuelve a mostrar la próxima vez.
    }
  }

  useEffect(() => {
    if (!aviso) return;
    const t = avisoQuieto ? undefined : window.setTimeout(() => setAviso(''), 4000);
    const tecla = (ev: KeyboardEvent) => {
      if (ev.key === 'Escape') setAviso('');
    };
    window.addEventListener('keydown', tecla);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener('keydown', tecla);
    };
  }, [aviso, avisoQuieto]);
  const semanaActual = diaRuta(e.hechaHoy ? Math.max(e.piezasListas, 1) : e.diaActual).semana;
  const refHoy = useRef<HTMLLIElement>(null);
  const refSemana = useRef<HTMLElement>(null);
  const hecho = new Set(cuenta.piezas.map((p) => p.dia));

  function irAHoy(suave = true) {
    refHoy.current?.scrollIntoView({ block: 'center', behavior: suave && !reduce ? 'smooth' : 'auto' });
  }

  useEffect(() => {
    // Abre la ruta en el día que toca (no en el día 1 si ya vas en la semana 3).
    if (e.diaActual <= 2) return;
    const seccion = refSemana.current;
    const nodo = refHoy.current;
    // 64 = encabezado; 280 = tarjeta fija + barra de abajo
    if (seccion && nodo && nodo.getBoundingClientRect().bottom - seccion.getBoundingClientRect().top + 64 < window.innerHeight - 280) {
      seccion.scrollIntoView({ block: 'start' });
    } else irAHoy(false);
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
        <Link
          href="/app/perfil#recordatorio"
          aria-label={`Racha de ${e.racha} ${e.racha === 1 ? 'día' : 'días'}${e.rachaEnRiesgo ? ', en juego hoy' : ''}. Ver tu recordatorio diario`}
          className={`flex h-11 items-center gap-1 rounded-[var(--radius-pill)] border px-3 text-sm transition-transform duration-150 active:scale-[0.97] ${
            e.rachaEnRiesgo ? 'border-[color-mix(in_oklab,var(--warning)_45%,transparent)] text-warning' : 'border-[var(--line)] text-ink-2'
          }`}
        >
          <span className="relative flex">
            <Flame size={18} className={e.rachaEnRiesgo ? 'text-warning' : 'text-gold'} fill={e.rachaEnRiesgo ? 'none' : 'currentColor'} aria-hidden="true" />
          </span>
          <span className="font-display text-base font-extrabold text-ink-1 tabular-nums">{e.racha}</span>
          {e.racha === 1 ? 'día' : 'días'}
          {e.rachaEnRiesgo && <span aria-hidden="true">· en juego</span>}
        </Link>
        <Link
          href="/app/empresa"
          aria-label={`${e.piezasListas} de ${TOTAL_DIAS} piezas. Ver Mi Empresa`}
          className="flex h-11 items-center gap-1 rounded-[var(--radius-pill)] border border-[var(--line)] px-3 text-sm text-ink-2 transition-transform duration-150 active:scale-[0.97]"
        >
          <Puzzle size={18} className="text-green" aria-hidden="true" />
          <span className="font-display text-base font-extrabold text-ink-1 tabular-nums">
            <CuentaRuta valor={e.piezasListas} />/{TOTAL_DIAS}
          </span>
        </Link>
        {!hoyVisible && (
          <motion.button
            type="button"
            onClick={() => irAHoy()}
            aria-label="Ir a mi día de hoy"
            initial={{ opacity: 0, scale: reduce ? 1 : 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="tarjeta-relieve ml-auto flex h-11 items-center gap-1 rounded-[var(--radius-pill)] px-3 text-sm font-semibold text-ink-1 transition-transform duration-150 active:scale-95"
          >
            <LocateFixed size={16} aria-hidden="true" />
            Hoy
          </motion.button>
        )}
      </header>

      <div className="px-4 pt-2">
        <AnimatePresence initial={false}>
          {verGuia && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: reduce ? 0 : 0.2, ease: EASE_SALIDA }}
              className="overflow-hidden"
            >
              <p className="mb-4 flex items-start gap-2 rounded-[var(--radius-chip)] border border-[var(--line)] bg-sunken py-2 pr-1 pl-3 text-caption text-ink-2">
                <span className="flex-1 pt-1">
                  Cada día se abre una pieza nueva de 5 minutos. Toca un día <strong className="font-semibold text-green">hecho</strong> para ver su pieza.
                </span>
                <button type="button" onClick={cerrarGuia} aria-label="Cerrar la guía" className="-my-1 flex size-11 shrink-0 items-center justify-center rounded-full text-ink-2">
                  <X size={16} aria-hidden="true" />
                </button>
              </p>
            </motion.div>
          )}
        </AnimatePresence>
        {SEMANAS.map((s) => {
          const dias = RUTA.filter((d) => d.semana === s.numero);
          const completa = dias.every((d) => hecho.has(d.dia));
          const actual = s.numero === semanaActual;
          const arriba = ARRIBA + (estadoDe(dias[0].dia) === 'hoy' ? 28 : 0);
          const alto = (dias.length - 1) * PASO + arriba + ABAJO;
          const puntos = dias.map((_, i) => ({ x: ANCHO / 2 + ZIGZAG[i % ZIGZAG.length], y: i * PASO + arriba }));
          const radio = (dia: number) => (estadoDe(dia) === 'hoy' ? 40 : 32);
          // Cada tramo sale por el COSTADO del nodo (hacia el siguiente) y baja en curva hasta su tapa:
          // nunca cruza las etiquetas, que van debajo de cada nodo.
          const camino = puntos
            .slice(1)
            .map((p, j) => {
              const a = puntos[j];
              const lado = Math.sign(p.x - a.x) || 1;
              const desde = { x: a.x + lado * (radio(dias[j].dia) + 8), y: a.y };
              const hasta = { x: p.x, y: p.y - radio(dias[j + 1].dia) - (estadoDe(dias[j + 1].dia) === 'hoy' ? 40 : 8) };
              return `M ${desde.x} ${desde.y} C ${desde.x + lado * 48} ${desde.y} ${hasta.x - lado * 60} ${hasta.y - 30} ${hasta.x} ${hasta.y}`;
            })
            .join(' ');
          return (
            <section
              key={s.numero}
              ref={actual ? refSemana : undefined}
              aria-label={`Semana ${s.numero}: ${s.tema}`}
              className="scroll-mt-20 pb-14"
            >
              <div
                className={`rounded-[var(--radius-card)] p-4 ${
                  actual ? 'bg-gradient-to-b from-gold-light to-gold text-on-gold' : 'tarjeta-relieve'
                }`}
              >
                <p className={`flex items-center gap-2 text-xs font-bold tracking-[0.08em] uppercase ${actual ? '' : completa ? 'text-green' : 'text-ink-3'}`}>
                  {completa && <Check size={14} strokeWidth={3} aria-hidden="true" />}
                  Semana {s.numero} de 4
                  <span className={`ml-auto tracking-normal normal-case ${actual ? '' : 'text-ink-3'}`}>
                    {dias.filter((d) => hecho.has(d.dia)).length} de {dias.length} listas
                  </span>
                </p>
                <h2 className={`mt-1 font-display text-xl leading-tight font-extrabold ${actual ? '' : 'text-ink-1'}`}>{s.tema}</h2>
                <p className={`mt-1 text-sm ${actual ? 'opacity-80' : 'text-ink-2'}`}>{s.meta}</p>
              </div>

              <div className="relative mx-auto mt-3" style={{ width: ANCHO, height: alto }}>
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
                            HOY · 5 min
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
                          {estado === 'manana' && <span className="text-xs whitespace-nowrap text-ink-3">se abre mañana</span>}
                          {estado === 'bloqueado' && !e.hechaHoy && d.dia === e.diaActual + 1 && (
                            <span className="text-xs whitespace-nowrap text-ink-3">al terminar el día {e.diaActual}</span>
                          )}
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
              onPointerEnter={() => setAvisoQuieto(true)}
              onPointerLeave={() => setAvisoQuieto(false)}
              onFocus={() => setAvisoQuieto(true)}
              onBlur={() => setAvisoQuieto(false)}
              role="status"
              aria-live="polite"
              initial={{ opacity: 0, y: reduce ? 0 : 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: EASE_SALIDA }}
              className="mb-2 flex items-start gap-2 rounded-[var(--radius-chip)] bg-raised-2 py-2 pr-1 pl-3 text-caption text-ink-1"
            >
              <span className="flex-1 pt-1">{aviso}</span>
              <button type="button" onClick={() => setAviso('')} aria-label="Cerrar aviso" className="-my-1 flex size-11 shrink-0 items-center justify-center rounded-full text-ink-2">
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
            <span className="block truncate text-xs font-semibold text-ink-3">
              {e.terminada
                ? '¡Ruta completa!'
                : e.hechaHoy
                  ? 'Pieza de hoy lista'
                  : e.rachaEnRiesgo
                    ? `Racha de ${e.racha} en juego`
                    : `Hoy · Día ${hoy.dia} · 5 min`}
            </span>
            <span className="line-clamp-2 font-display text-base leading-snug font-bold text-ink-1">
              {e.terminada ? 'Tu negocio está listo' : e.hechaHoy ? `Mañana: ${hoy.pieza.charAt(0).toLowerCase()}${hoy.pieza.slice(1)}` : hoy.pieza}
            </span>
          </span>
          <Link
            href={e.terminada ? '/app/empresa' : e.hechaHoy ? '/app/perfil#recordatorio' : '/app/mision'}
            className={`flex h-12 shrink-0 items-center gap-1 rounded-[var(--radius-pill)] px-4 font-display text-sm font-bold ${
              e.hechaHoy || e.terminada ? 'border border-[var(--line)] bg-raised-2 text-ink-1' : 'boton-oro'
            }`}
          >
            {e.terminada ? 'Mi Empresa' : e.hechaHoy ? 'Recordarme' : 'Empezar'}
            {e.hechaHoy && !e.terminada ? <Bell size={16} aria-hidden="true" /> : <ArrowRight size={16} aria-hidden="true" />}
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
    if (!nodo.current) return;
    if (reduce) {
      nodo.current.textContent = String(valor);
      return;
    }
    const control = animate(0, valor, {
      duration: 0.6,
      ease: 'easeOut',
      onUpdate: (v) => {
        if (nodo.current) nodo.current.textContent = String(Math.round(v));
      },
    });
    return () => control.stop();
  }, [valor, reduce]);
  return <span ref={nodo}>{reduce ? valor : 0}</span>;
}
