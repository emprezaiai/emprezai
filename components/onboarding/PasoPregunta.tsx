'use client';

// Pregunta de opción única (50 §A1-A3): una decisión por pantalla, auto-avance a los 300 ms
// con la opción marcada visible, doble toque bloqueado durante la pausa. Si la categoría es
// abierta, el último chip es "Otra cosa (escribe la tuya)": NO avanza solo, abre un campo.

import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { limpiarTexto, type Pregunta } from '@/lib/onboarding';
import { EASE_SALIDA, OpcionRespuesta, TituloAcento, vibrar } from './piezas';

const LARGO_MAX_OTRA = 60;

export function PasoPregunta<T extends string>({
  pregunta,
  valor,
  valorOtra,
  onResponder,
  pie,
}: {
  pregunta: Pregunta<T>;
  valor?: T;
  valorOtra?: string;
  onResponder: (id: T, textoOtra?: string) => void;
  pie?: ReactNode;
}) {
  const reduce = useReducedMotion();
  const idCampo = useId();
  const [elegida, setElegida] = useState<T | undefined>(valor);
  const [bloqueada, setBloqueada] = useState(false);
  const [otra, setOtra] = useState(valorOtra ?? '');
  const [aviso, setAviso] = useState(0);
  const temporizador = useRef<number | undefined>(undefined);
  const esOtra = pregunta.otra !== undefined && elegida === pregunta.otra.id;
  const otraValida = limpiarTexto(otra, LARGO_MAX_OTRA).length >= 3;

  useEffect(() => () => window.clearTimeout(temporizador.current), []);

  function elegir(id: T) {
    if (bloqueada) return;
    setElegida(id);
    vibrar();
    if (pregunta.otra && id === pregunta.otra.id) return;
    setBloqueada(true);
    temporizador.current = window.setTimeout(() => onResponder(id), 300);
  }

  function confirmarOtra() {
    if (!pregunta.otra) return;
    if (!otraValida) {
      setAviso((n) => n + 1);
      vibrar(30);
      return;
    }
    onResponder(pregunta.otra.id, limpiarTexto(otra, LARGO_MAX_OTRA));
  }

  const opciones = pregunta.otra
    ? [...pregunta.opciones, { id: pregunta.otra.id, texto: pregunta.otra.texto, icono: 'PencilSimpleLine' as const }]
    : pregunta.opciones;

  return (
    <div className="flex flex-1 flex-col px-4 pt-6 pb-8">
      <motion.div
        initial={{ opacity: 0, y: reduce ? 0 : 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: EASE_SALIDA }}
      >
        <TituloAcento texto={pregunta.titulo} acento={pregunta.acento} className="text-pregunta" />
        <p className="mt-2 text-ayuda text-ink-2">{pregunta.ayuda}</p>
      </motion.div>

      <div role="radiogroup" aria-label={pregunta.titulo} className="mt-8 flex flex-col gap-3">
        {opciones.map((opcion, i) => (
          <OpcionRespuesta
            key={opcion.id}
            opcion={opcion}
            indice={i}
            elegida={elegida === opcion.id}
            bloqueada={bloqueada}
            onElegir={() => elegir(opcion.id)}
          />
        ))}
      </div>

      <AnimatePresence initial={false}>
        {esOtra && pregunta.otra && (
          <motion.div
            key="otra"
            initial={{ opacity: 0, y: reduce ? 0 : 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: EASE_SALIDA }}
            className="mt-4 flex flex-col gap-2"
          >
            <label htmlFor={idCampo} className="text-sm font-semibold text-ink-1">
              Escríbela con tus palabras
            </label>
            <input
              key={aviso}
              id={idCampo}
              autoFocus
              value={otra}
              maxLength={LARGO_MAX_OTRA}
              onChange={(e) => setOtra(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') confirmarOtra();
              }}
              placeholder={pregunta.otra.placeholder}
              className={`h-12 w-full rounded-[var(--radius-chip)] border bg-sunken px-4 text-base text-ink-1 placeholder:text-ink-3 focus:outline-none ${
                aviso && !otraValida ? 'sacudir border-warning' : 'border-gold'
              }`}
            />
            {aviso > 0 && !otraValida && <p className="text-caption text-warning">Escribe al menos unas letras.</p>}
            <button
              type="button"
              onClick={confirmarOtra}
              className="boton-oro flex h-12 items-center justify-center gap-2 rounded-[var(--radius-pill)] font-display text-base font-bold"
            >
              Continuar
              <ArrowRight size={18} aria-hidden="true" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {pie && <div className="mt-6">{pie}</div>}
    </div>
  );
}
