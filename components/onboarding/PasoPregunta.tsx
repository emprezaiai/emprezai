'use client';

// Pregunta de opción única (50 §A1-A3): una decisión por pantalla, auto-avance a los 300 ms
// con la opción marcada visible, doble toque bloqueado durante la pausa. Si la categoría es
// abierta, el último chip es "Otra cosa (escribe la tuya)": NO avanza solo, abre un campo.

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import type { Pregunta } from '@/lib/onboarding';
import { CampoPropio, EASE_SALIDA, OpcionRespuesta, TituloAcento, vibrar } from './piezas';

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
  const [elegida, setElegida] = useState<T | undefined>(valor);
  const [bloqueada, setBloqueada] = useState(false);
  const [otra, setOtra] = useState(valorOtra ?? '');
  const temporizador = useRef<number | undefined>(undefined);
  const esOtra = pregunta.otra !== undefined && elegida === pregunta.otra.id;

  useEffect(() => () => window.clearTimeout(temporizador.current), []);

  function elegir(id: T) {
    if (bloqueada) return;
    setElegida(id);
    vibrar();
    if (pregunta.otra && id === pregunta.otra.id) return;
    setBloqueada(true);
    temporizador.current = window.setTimeout(() => onResponder(id), 300);
  }

  const opciones = pregunta.otra
    ? [...pregunta.opciones, { id: pregunta.otra.id, texto: pregunta.otra.texto, icono: 'PencilSimpleLine' as const }]
    : pregunta.opciones;

  return (
    // Contenido y pie forman un solo bloque centrado en el alto disponible: ni aire muerto abajo
    // ni un hueco a mitad de pantalla.
    <div className="flex flex-1 flex-col justify-center px-4 pt-6 pb-8">
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
            className="mt-4"
          >
            <CampoPropio
              etiqueta="Escríbela con tus palabras"
              valor={otra}
              onCambiar={setOtra}
              onConfirmar={(texto) => pregunta.otra && onResponder(pregunta.otra.id, texto)}
              onCancelar={() => {
                setElegida(undefined);
                setOtra('');
              }}
              placeholder={pregunta.otra.placeholder}
              largoMax={LARGO_MAX_OTRA}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {pie && <div className="mt-8">{pie}</div>}
    </div>
  );
}
