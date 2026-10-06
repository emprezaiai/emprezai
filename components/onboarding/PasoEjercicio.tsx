'use client';

// LA PRIMERA MISIÓN (ejercicio intermedio-fácil, adaptado al área): completar la propuesta de
// valor "Ayudo a [cliente] a [resultado] sin [dolor]" tocando opciones del área o escribiendo
// las propias. La frase se arma en vivo arriba; cada hueco trae un consejo de una línea.

import { useEffect, useId, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ArrowRight, Lightbulb, MessageCircle, PencilLine, Store, UserRound, Zap } from 'lucide-react';
import {
  HUECOS,
  LARGO_MAX_HUECO,
  NOMBRE_AREA,
  OPCIONES_EJERCICIO,
  QUITAR_INICIO,
  limpiarTexto,
  type IdArea,
  type IdHueco,
} from '@/lib/onboarding';
import { BotonPrincipal, CheckCustom, EASE_SALIDA, TituloAcento, vibrar } from './piezas';

type Valores = Partial<Record<IdHueco, string>>;

export function PasoEjercicio({
  area,
  inicial,
  onTerminar,
}: {
  area: IdArea;
  inicial: Valores;
  onTerminar: (valores: Required<Valores>) => void;
}) {
  const reduce = useReducedMotion();
  const idCampo = useId();
  const [valores, setValores] = useState<Valores>(inicial);
  const primeroVacio = HUECOS.findIndex((h) => !inicial[h.id]);
  const [actual, setActual] = useState(primeroVacio < 0 ? HUECOS.length - 1 : primeroVacio);
  const [escribiendo, setEscribiendo] = useState(false);
  const [propio, setPropio] = useState('');
  const temporizador = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(temporizador.current), []);

  const hueco = HUECOS[actual];
  const completa = HUECOS.every((h) => Boolean(valores[h.id]));
  const opciones = OPCIONES_EJERCICIO[area][hueco.id];

  function irAHueco(i: number) {
    window.clearTimeout(temporizador.current);
    setActual(i);
    setEscribiendo(false);
    setPropio('');
  }

  function llenar(texto: string) {
    const limpio = limpiarTexto(texto, LARGO_MAX_HUECO, QUITAR_INICIO[hueco.id]);
    if (!limpio) return;
    const nuevos = { ...valores, [hueco.id]: limpio };
    setValores(nuevos);
    vibrar();
    const siguiente = HUECOS.findIndex((h) => !nuevos[h.id]);
    if (siguiente >= 0) temporizador.current = window.setTimeout(() => irAHueco(siguiente), 300);
    else setEscribiendo(false);
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="px-4 pt-6">
        <motion.div
          initial={{ opacity: 0, y: reduce ? 0 : 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: EASE_SALIDA }}
        >
          <p className="flex items-center gap-2 text-xs font-semibold tracking-[0.08em] text-gold uppercase">
            <Zap size={14} fill="currentColor" strokeWidth={0} aria-hidden="true" />
            Misión 1 · 2 min · {NOMBRE_AREA[area]}
          </p>
          <TituloAcento texto="Arma tu propuesta de valor" acento="propuesta de valor" className="mt-2 text-pregunta" />
        </motion.div>

        {/* La frase en vivo: cada hueco es tocable para cambiarlo */}
        <div className="hairline-oro mt-6 rounded-[var(--radius-card)] p-4 shadow-[0_18px_32px_-18px_rgb(0_0_0/0.8)]">
          <p className="text-xs font-semibold text-ink-3">Tu frase</p>
          <p className="mt-2 font-display text-xl leading-snug font-bold text-ink-1" aria-live="polite">
            {HUECOS.map((h, i) => {
              const valor = valores[h.id];
              const esActual = i === actual && !completa;
              return (
                <span key={h.id}>
                  {h.conector}{' '}
                  <button
                    type="button"
                    onClick={() => irAHueco(i)}
                    aria-label={`${h.pregunta} ${valor ? `Elegiste: ${valor}. Toca para cambiarlo.` : 'Sin completar.'}`}
                    className={`rounded-sm text-left transition-colors duration-200 ${
                      valor
                        ? `text-gold ${i === actual ? 'underline decoration-2 underline-offset-4' : ''}`
                        : esActual
                          ? 'hueco-vacio text-ink-3'
                          : 'text-ink-3'
                    }`}
                  >
                    {valor ?? (esActual ? '_ _ _ _ _' : '…')}
                  </button>
                  {i < HUECOS.length - 1 ? ' ' : '.'}
                </span>
              );
            })}
          </p>
        </div>

        <AnimatePresence mode="wait" initial={false}>
          {completa && !escribiendo && valores[hueco.id] && actual === HUECOS.length - 1 ? (
            <motion.div
              key="completa"
              initial={{ opacity: 0, y: reduce ? 0 : 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, ease: EASE_SALIDA }}
              className="mt-6"
            >
              <div className="flex items-start gap-3">
                <CheckCustom tono="verde" tamano={24} />
                <p className="text-ayuda text-ink-2">
                  <strong className="font-semibold text-ink-1">¡Frase completa!</strong> Toca cualquier parte en dorado si quieres cambiarla.
                </p>
              </div>
              <div className="tarjeta-relieve-base mt-6 rounded-[var(--radius-card)] p-4">
                <p className="text-xs font-semibold tracking-[0.08em] text-gold uppercase">Dónde la vas a usar</p>
                <ul className="mt-3 flex flex-col gap-3">
                  {[
                    { icono: UserRound, texto: 'En tu perfil de redes, para que sepan qué haces' },
                    { icono: MessageCircle, texto: 'En tu primer mensaje a un posible cliente' },
                    { icono: Store, texto: 'En el título de tu oferta (la armas el día 3)' },
                  ].map(({ icono: Icono, texto }) => (
                    <li key={texto} className="flex items-center gap-3 text-ayuda leading-snug text-ink-1">
                      <span className="relieve-piedra flex size-9 shrink-0 items-center justify-center rounded-[var(--radius-chip)]" aria-hidden="true">
                        <Icono size={18} strokeWidth={2.2} />
                      </span>
                      {texto}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key={hueco.id}
              initial={{ opacity: 0, x: reduce ? 0 : 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: reduce ? 0 : -16 }}
              transition={{ duration: 0.25, ease: EASE_SALIDA }}
              className="mt-6"
            >
              <p className="text-xs font-semibold text-ink-3 tabular-nums">
                Paso {actual + 1} de {HUECOS.length}
              </p>
              <h2 className="mt-1 font-display text-xl font-bold text-ink-1">{hueco.pregunta}</h2>
              <p className="mt-1 flex items-center gap-2 text-caption text-ink-2">
                <Lightbulb size={16} className="shrink-0 text-gold" aria-hidden="true" />
                {hueco.consejo}
              </p>

              <div className="mt-4 flex flex-col gap-2" role="group" aria-label={hueco.pregunta}>
                {opciones.map((op, i) => (
                  <motion.button
                    key={op}
                    type="button"
                    aria-pressed={valores[hueco.id] === op}
                    onClick={() => llenar(op)}
                    initial={{ opacity: 0, y: reduce ? 0 : 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, delay: reduce ? 0 : 0.05 + i * 0.05, ease: EASE_SALIDA }}
                    whileTap={{ scale: 0.98 }}
                    className="opcion-recorrido min-h-12 rounded-[var(--radius-chip)] px-4 py-3 text-left text-ayuda leading-snug font-medium text-ink-1"
                  >
                    {op}
                  </motion.button>
                ))}

                {escribiendo ? (
                  <div className="flex flex-col gap-2">
                    <label htmlFor={idCampo} className="sr-only">
                      {hueco.pregunta} (escribe la tuya)
                    </label>
                    <input
                      id={idCampo}
                      autoFocus
                      value={propio}
                      maxLength={LARGO_MAX_HUECO}
                      onChange={(e) => setPropio(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') llenar(propio);
                      }}
                      placeholder="Escríbela con tus palabras"
                      className="h-12 w-full rounded-[var(--radius-chip)] border border-gold bg-sunken px-4 text-base text-ink-1 placeholder:text-ink-3 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => llenar(propio)}
                      disabled={limpiarTexto(propio, LARGO_MAX_HUECO).length < 3}
                      className="h-12 rounded-[var(--radius-chip)] border border-[var(--line)] bg-raised-2 text-ayuda font-semibold text-ink-1 transition-opacity duration-200 active:scale-[0.98] disabled:opacity-65"
                    >
                      Usar esta
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setEscribiendo(true)}
                    className="flex min-h-12 items-center gap-2 rounded-[var(--radius-chip)] px-4 text-ayuda font-semibold text-gold transition-colors duration-150 hover:bg-raised active:scale-[0.98]"
                  >
                    <PencilLine size={18} aria-hidden="true" />
                    Escribir la mía
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <BotonPrincipal
        deshabilitado={!completa}
        onClick={() => {
          if (completa) onTerminar(valores as Required<Valores>);
        }}
        nota={completa ? 'Se guarda en Mi Empresa como tu pieza 1' : `Completa los ${HUECOS.length} huecos de tu frase`}
      >
        Armar mi pieza
        <ArrowRight size={20} aria-hidden="true" />
      </BotonPrincipal>
    </div>
  );
}
