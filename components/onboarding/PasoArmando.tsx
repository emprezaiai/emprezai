'use client';

// "Armando tu pieza" (50 §B): 4 líneas personalizadas con SUS respuestas, anillo con mesetas,
// pausa de 400 ms al final. El anillo NUNCA se congela (50 §B2): sube hasta ~90% con las 3 primeras
// líneas y, mientras la IA responde, avanza despacio con la línea 3 viva y mensajes que rotan cada
// 2 s. Recién con la respuesta llega a 100%. A los 6 s aparece una salida. La espera total la corta
// lib/onboarding (8 s): si la IA no llega, sale la frase armada con sus respuestas. Si la composición
// falla, el anillo se detiene y se ofrece Reintentar reusando las respuestas (jamás repetir el recorrido).

import { useEffect, useState } from 'react';
import { AnimatePresence, animate, motion, useMotionValue, useReducedMotion, useTransform } from 'motion/react';
import { Check, RotateCcw, Sparkles } from 'lucide-react';
import { NOMBRE_AREA, armarPrimeraPieza, piezaBase, type PrimeraPieza, type Respuestas } from '@/lib/onboarding';
import { EASE_SALIDA } from './piezas';

const DURACION = 4.6;
const RETRASOS_LINEA = [0, 1.1, 2.3];
const LINEA_ESPERA = 2;
const SALIDA_VISIBLE_MS = 6_000;
const ROTACION_MS = 2_000;
const CIERRE_MS = 400;

/** Corta por palabra (nunca a media palabra) solo si de verdad es largo. */
function recortar(texto: string, max = 60): string {
  if (texto.length <= max) return texto;
  const corte = texto.slice(0, max);
  return `${corte.slice(0, corte.lastIndexOf(' ')).trimEnd()}…`;
}

export function PasoArmando({
  respuestas,
  onListo,
  onVolver,
}: {
  respuestas: Respuestas;
  onListo: (pieza: PrimeraPieza) => void;
  onVolver: () => void;
}) {
  const reduce = useReducedMotion();
  const avance = useMotionValue(0);
  const porcentaje = useTransform(avance, (v) => `${Math.round(v * 100)}%`);
  const [lineaActiva, setLineaActiva] = useState(0);
  const [giro, setGiro] = useState(0);
  const [lento, setLento] = useState(false);
  const [error, setError] = useState(false);
  const [intento, setIntento] = useState(0);

  const cliente = recortar(respuestas.cliente ?? '');
  const mensajesEspera = [
    `Puliendo tu frase para ${cliente}`,
    'Eligiendo las palabras exactas',
    'Revisando que se entienda en 5 segundos',
  ];
  const lineas = [
    `Leyendo tu idea: ${recortar(respuestas.idea ?? '')}`,
    `Enfocando tu área: ${respuestas.areaFinal ? NOMBRE_AREA[respuestas.areaFinal] : ''}`,
    mensajesEspera[giro % mensajesEspera.length],
    'Guardando tu pieza en Mi Empresa',
  ];

  useEffect(() => {
    let cancelado = false;
    let rotacion: number | undefined;
    const temporizadores: number[] = [];
    const duracion = reduce ? 2.4 : DURACION;
    const escala = duracion / DURACION;

    // Fase 1: hasta 90% con mesetas mientras se encienden las 3 primeras líneas.
    let anillo = animate(avance, [0, 0.22, 0.24, 0.48, 0.5, 0.74, 0.76, 0.9], {
      duration: duracion,
      times: [0, 0.2, 0.26, 0.46, 0.52, 0.72, 0.8, 1],
      ease: 'easeOut',
    });
    RETRASOS_LINEA.forEach((retraso, i) => {
      temporizadores.push(window.setTimeout(() => !cancelado && setLineaActiva(i), retraso * escala * 1000));
    });
    // Fase 2 (si la IA sigue trabajando): el anillo avanza despacio y la línea viva cambia de mensaje.
    temporizadores.push(
      window.setTimeout(() => {
        if (cancelado) return;
        anillo = animate(avance, 0.97, { duration: 8, ease: 'easeOut' });
        if (!reduce) rotacion = window.setInterval(() => setGiro((n) => n + 1), ROTACION_MS);
      }, duracion * 1000),
    );
    temporizadores.push(window.setTimeout(() => !cancelado && setLento(true), SALIDA_VISIBLE_MS));

    const minimo = new Promise((resolver) => {
      temporizadores.push(window.setTimeout(resolver, duracion * 1000));
    });

    Promise.all([armarPrimeraPieza(respuestas), minimo])
      .then(([pieza]) => {
        if (cancelado) return;
        window.clearInterval(rotacion);
        anillo.stop();
        setLento(false);
        setLineaActiva(3);
        anillo = animate(avance, 1, { duration: CIERRE_MS / 1000, ease: 'easeOut' });
        temporizadores.push(window.setTimeout(() => !cancelado && setLineaActiva(4), CIERRE_MS / 2));
        temporizadores.push(window.setTimeout(() => !cancelado && onListo(pieza), CIERRE_MS * 2));
      })
      .catch(() => {
        if (cancelado) return;
        // Segundo fallo: nunca a las puertas de los planes con las manos vacías (50 §B).
        if (intento > 0) {
          onListo(piezaBase(respuestas));
          return;
        }
        anillo.stop();
        window.clearInterval(rotacion);
        temporizadores.forEach((t) => window.clearTimeout(t));
        setLento(false);
        setError(true);
      });

    return () => {
      cancelado = true;
      anillo.stop();
      window.clearInterval(rotacion);
      temporizadores.forEach((t) => window.clearTimeout(t));
    };
    // Se reinicia solo al reintentar; las respuestas ya están fijas en este paso.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [intento]);

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-8" aria-live="polite" aria-busy={!error}>
      <div className="relative size-32">
        <svg viewBox="0 0 120 120" className="size-full -rotate-90" aria-hidden="true">
          <circle cx="60" cy="60" r="52" fill="none" strokeWidth="10" className="stroke-[color-mix(in_oklab,var(--ink-1)_12%,transparent)]" />
          <motion.circle
            cx="60"
            cy="60"
            r="52"
            fill="none"
            strokeWidth="10"
            strokeLinecap="round"
            className={error ? 'stroke-danger' : 'stroke-gold'}
            style={{ pathLength: avance }}
          />
        </svg>
        <motion.span className="absolute inset-0 flex items-center justify-center font-display text-precio font-extrabold tabular-nums text-ink-1">
          {porcentaje}
        </motion.span>
      </div>

      {error ? (
        <div className="mt-8 w-full text-center">
          <h1 className="font-display text-2xl font-extrabold text-ink-1">No pudimos terminar tu pieza</h1>
          <p className="mt-2 text-base text-ink-2">
            Tus respuestas están guardadas. Vuelve a intentarlo, no tienes que repetir nada.
          </p>
          <button
            type="button"
            onClick={() => {
              setError(false);
              setLineaActiva(0);
              setGiro(0);
              avance.set(0);
              setIntento((n) => n + 1);
            }}
            className="boton-oro mt-6 inline-flex h-14 items-center justify-center gap-2 rounded-[var(--radius-pill)] px-8 font-display text-boton font-bold"
          >
            <RotateCcw size={20} aria-hidden="true" />
            Reintentar
          </button>
          <button
            type="button"
            onClick={onVolver}
            className="mt-2 flex min-h-11 w-full items-center justify-center text-sm font-semibold text-ink-2 underline-offset-4 hover:underline"
          >
            Volver a mi frase
          </button>
        </div>
      ) : (
        <>
          <h1 className="mt-8 font-display text-2xl font-extrabold text-ink-1">Armando tu pieza 1…</h1>
          <ul className="mt-8 flex w-full flex-col gap-4">
            {lineas.map((linea, i) => {
              const estado = i < lineaActiva ? 'hecha' : i === lineaActiva ? 'activa' : 'pendiente';
              return (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, y: reduce ? 0 : 8 }}
                  animate={{ opacity: estado === 'pendiente' ? 0.4 : 1, y: 0 }}
                  transition={{ duration: 0.2, ease: EASE_SALIDA }}
                  className="flex items-start gap-3"
                >
                  <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center">
                    {estado === 'hecha' ? (
                      <motion.span
                        initial={{ scale: 0.5 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', bounce: 0.25, duration: 0.3 }}
                        className="flex size-5 items-center justify-center rounded-full bg-green text-on-green"
                      >
                        <Check size={12} strokeWidth={3.5} aria-hidden="true" />
                      </motion.span>
                    ) : estado === 'activa' ? (
                      <motion.span
                        className="size-3 rounded-full bg-gold"
                        animate={reduce ? undefined : { scale: [1, 1.35, 1], opacity: [1, 0.6, 1] }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
                      />
                    ) : (
                      <span className="size-3 rounded-full border-2 border-ink-3" />
                    )}
                  </span>
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                      key={linea}
                      initial={{ opacity: 0, y: reduce ? 0 : 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: reduce ? 0 : -4 }}
                      transition={{ duration: 0.2, ease: EASE_SALIDA }}
                      className="text-ayuda leading-snug text-ink-1"
                    >
                      {linea}
                    </motion.span>
                  </AnimatePresence>
                </motion.li>
              );
            })}
          </ul>

          {/* Vista previa de lo que se está armando (esqueleto con la forma de la pieza) */}
          <div aria-hidden="true" className="hairline-oro mt-8 w-full rounded-[var(--radius-card)] p-4 opacity-80">
            <div className="flex items-center gap-3">
              <span className="relieve-oro flex size-10 items-center justify-center rounded-[var(--radius-chip)]">
                <Sparkles size={20} strokeWidth={2.2} />
              </span>
              <div>
                <p className="text-xs font-semibold text-gold">Pieza 1 de 30</p>
                <p className="font-display text-base font-bold text-ink-1">Tu frase de negocio</p>
              </div>
            </div>
            <div className="mt-4 flex flex-col gap-2">
              {['w-full', 'w-11/12', 'w-2/3'].map((ancho) => (
                <span key={ancho} className={`h-3 animate-pulse rounded-full bg-[color-mix(in_oklab,var(--ink-1)_10%,transparent)] ${ancho}`} />
              ))}
            </div>
          </div>

          {/* A los 6 s: decir qué pasa y dar una salida (la escala de latencia pide cancelar a partir de 3 s). */}
          <AnimatePresence>
            {lento && lineaActiva === LINEA_ESPERA && (
              <motion.div
                initial={{ opacity: 0, y: reduce ? 0 : 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25, ease: EASE_SALIDA }}
                className="mt-6 w-full text-center"
              >
                <p className="text-caption text-ink-2">La IA está terminando tu frase. Unos segundos más.</p>
                <button
                  type="button"
                  onClick={onVolver}
                  className="mt-1 inline-flex min-h-11 items-center justify-center px-4 text-sm font-semibold text-ink-2 underline-offset-4 hover:underline"
                >
                  Volver a mi frase
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  );
}
