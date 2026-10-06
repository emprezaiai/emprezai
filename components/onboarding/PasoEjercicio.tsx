'use client';

// LA PRIMERA MISIÓN (ejercicio intermedio-fácil, adaptado al área): completar su frase de negocio
// (propuesta de valor) "Con [su idea], ayudo a [cliente] a [resultado] sin [dolor]" tocando
// opciones del área o escribiendo las propias. La frase se arma en vivo arriba; cada hueco trae
// un consejo de una línea. El botón nunca está muerto: si falta algo, lleva al hueco vacío.

import { useEffect, useId, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ArrowRight, Lightbulb, MessageCircle, PencilLine, Store, UserRound, Zap } from 'lucide-react';
import {
  HUECOS,
  LARGO_MAX_HUECO,
  NOMBRE_AREA,
  QUITAR_INICIO,
  ideaEnFrase,
  limpiarTexto,
  opcionesHueco,
  type IdArea,
  type IdHueco,
} from '@/lib/onboarding';
import { BotonPrincipal, CheckCustom, EASE_SALIDA, TituloAcento, vibrar } from './piezas';

type Valores = Partial<Record<IdHueco, string>>;

export function PasoEjercicio({
  area,
  idea,
  inicial,
  onTerminar,
}: {
  area: IdArea;
  idea: string;
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
  const [aviso, setAviso] = useState(0);
  const [avisoPropio, setAvisoPropio] = useState(0);
  const temporizador = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(temporizador.current), []);

  const hueco = HUECOS[actual];
  const completa = HUECOS.every((h) => Boolean(valores[h.id]));
  const opciones = opcionesHueco(area, hueco.id, idea);

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
            Misión 1 · Día 1 · {NOMBRE_AREA[area]}
          </p>
          <TituloAcento texto="Arma tu frase de negocio" acento="frase de negocio" className="mt-2 text-pregunta" />
          <p className="mt-1 text-ayuda text-ink-2">Qué haces y para quién, en una sola frase (tu propuesta de valor).</p>
        </motion.div>

        {/* La frase en vivo: cada hueco es tocable para cambiarlo */}
        <div
          key={aviso}
          className={`hairline-oro mt-6 rounded-[var(--radius-card)] p-4 shadow-[0_18px_32px_-18px_rgb(0_0_0/0.8)] ${aviso ? 'sacudir' : ''}`}
        >
          <p className="text-xs font-semibold text-ink-3">Tu frase</p>
          <p className="mt-2 font-display text-xl leading-snug font-bold text-ink-1" aria-live="polite">
            <span className="text-ink-2">{ideaEnFrase(idea, valores.cliente)}: </span>
            {HUECOS.map((h, i) => {
              const valor = valores[h.id];
              const esActual = i === actual && !completa;
              return (
                <span key={h.id}>
                  {h.conector}{' '}
                  {/* span con rol de botón: un <button> no puede partirse entre líneas (es inline-block) */}
                  <span
                    role="button"
                    tabIndex={0}
                    onClick={() => irAHueco(i)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        irAHueco(i);
                      }
                    }}
                    aria-label={`${h.pregunta} ${valor ? `Elegiste: ${valor}. Toca para cambiarlo.` : 'Sin completar.'}`}
                    className={`cursor-pointer transition-colors duration-200 ${
                      valor
                        ? `hueco-lleno text-gold ${i === actual ? 'underline decoration-2 underline-offset-4' : ''}`
                        : esActual
                          ? 'hueco-vacio'
                          : 'hueco-lleno text-ink-3'
                    }`}
                  >
                    {valor ?? (esActual ? '\u00A0' : '…')}
                  </span>
                  {i < HUECOS.length - 1 ? ' ' : valor ? '.' : ''}
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
                <p className="text-xs font-semibold tracking-[0.08em] text-ink-3 uppercase">Dónde la vas a usar</p>
                <ul className="mt-3 flex flex-col gap-3">
                  {[
                    { icono: UserRound, texto: 'En tu perfil de redes, para que sepan qué haces' },
                    { icono: MessageCircle, texto: 'En tu primer mensaje a un posible cliente' },
                    { icono: Store, texto: 'En el título de tu oferta (la armas el día 3)' },
                  ].map(({ icono: Icono, texto }) => (
                    <li key={texto} className="flex items-center gap-3 text-ayuda leading-snug text-ink-1">
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-[var(--radius-chip)] bg-raised-2 text-ink-2" aria-hidden="true">
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
                <Lightbulb size={16} className="shrink-0 text-ink-3" aria-hidden="true" />
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
                    className="opcion-recorrido min-h-12 px-5 py-3 text-left text-ayuda leading-snug font-medium text-ink-1"
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
                      key={avisoPropio}
                      id={idCampo}
                      autoFocus
                      value={propio}
                      maxLength={LARGO_MAX_HUECO}
                      onChange={(e) => setPropio(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') llenar(propio);
                      }}
                      placeholder="Escríbela con tus palabras"
                      className={`h-12 w-full rounded-[var(--radius-chip)] border bg-sunken px-4 text-base text-ink-1 placeholder:text-ink-3 focus:outline-none ${
                        avisoPropio && limpiarTexto(propio, LARGO_MAX_HUECO).length < 3 ? 'sacudir border-warning' : 'border-gold'
                      }`}
                    />
                    {avisoPropio > 0 && limpiarTexto(propio, LARGO_MAX_HUECO).length < 3 && (
                      <p className="text-caption text-warning">Escribe al menos unas letras.</p>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        if (limpiarTexto(propio, LARGO_MAX_HUECO).length < 3) {
                          setAvisoPropio((n) => n + 1);
                          vibrar(30);
                          return;
                        }
                        llenar(propio);
                      }}
                      className="boton-oro flex h-12 items-center justify-center rounded-[var(--radius-pill)] font-display text-base font-bold"
                    >
                      Usar esta
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setEscribiendo(true)}
                    className="flex min-h-12 items-center gap-2 rounded-[var(--radius-pill)] px-5 text-ayuda font-semibold text-ink-1 underline decoration-[var(--line)] underline-offset-4 transition-colors duration-150 hover:bg-raised active:scale-[0.98]"
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
        onClick={() => {
          if (completa) {
            onTerminar(valores as Required<Valores>);
            return;
          }
          // Botón vivo: si falta algo, lleva al hueco vacío y lo señala.
          irAHueco(HUECOS.findIndex((h) => !valores[h.id]));
          setAviso((n) => n + 1);
          vibrar(30);
        }}
        nota={
          completa ? (
            'Se guarda en Mi Empresa como tu pieza 1'
          ) : aviso ? (
            <span className="text-warning">Te falta completar el hueco marcado</span>
          ) : (
            `Completa los ${HUECOS.length} huecos de tu frase`
          )
        }
      >
        Armar mi pieza
        <ArrowRight size={20} aria-hidden="true" />
      </BotonPrincipal>
    </div>
  );
}
