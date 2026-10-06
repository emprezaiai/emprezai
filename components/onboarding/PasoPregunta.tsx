'use client';

// Pregunta de opción única (50 §A1-A3): una decisión por pantalla, auto-avance a los 300 ms
// con la opción marcada visible, doble toque bloqueado durante la pausa.

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import type { Pregunta } from '@/lib/onboarding';
import { EASE_SALIDA, OpcionRespuesta, TituloAcento, vibrar } from './piezas';

export function PasoPregunta<T extends string>({
  pregunta,
  valor,
  onResponder,
  pie,
}: {
  pregunta: Pregunta<T>;
  valor?: T;
  onResponder: (id: T) => void;
  pie?: ReactNode;
}) {
  const reduce = useReducedMotion();
  const [elegida, setElegida] = useState<T | undefined>(valor);
  const [bloqueada, setBloqueada] = useState(false);
  const temporizador = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(temporizador.current), []);

  function elegir(id: T) {
    if (bloqueada) return;
    setElegida(id);
    setBloqueada(true);
    vibrar();
    temporizador.current = window.setTimeout(() => onResponder(id), 300);
  }

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
        {pregunta.opciones.map((opcion, i) => (
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

      {pie && <div className="mt-auto pt-8">{pie}</div>}
    </div>
  );
}
