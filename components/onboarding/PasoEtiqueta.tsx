'use client';

// Etiquetado positivo (50 §A5, variante final obligatoria): identidad aspiracional + la evidencia
// sacada de SUS respuestas + puente a la primera misión. El nodo "Día 1" con el rayo es el
// dispositivo de la marca (FICHA-ARTE).

import { motion, useReducedMotion } from 'motion/react';
import { ArrowRight, Zap } from 'lucide-react';
import { NOMBRE_AREA, NOMBRE_MOMENTO, type IdArea, type IdMomento } from '@/lib/onboarding';
import { BotonPrincipal, CheckCustom, EASE_SALIDA, TituloAcento } from './piezas';

export function PasoEtiqueta({
  area,
  idea,
  momento,
  onSeguir,
}: {
  area: IdArea;
  idea: string;
  momento: IdMomento;
  onSeguir: () => void;
}) {
  const reduce = useReducedMotion();
  const entrar = (i: number) => ({
    initial: { opacity: 0, y: reduce ? 0 : 12 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.35, delay: reduce ? 0 : i * 0.07, ease: EASE_SALIDA },
  });
  const evidencia = [
    { rotulo: 'Tu área', valor: NOMBRE_AREA[area] },
    { rotulo: 'Tu idea', valor: idea },
    { rotulo: 'Tu momento', valor: `5 minutos ${NOMBRE_MOMENTO[momento]}` },
  ];

  return (
    <div className="flex flex-1 flex-col">
      <div className="px-4 pt-6" aria-live="polite">
        <motion.div {...entrar(0)} className="flex items-center gap-3" aria-hidden="true">
          <span className="relative flex size-16 items-center justify-center">
            {!reduce && (
              <motion.span
                className="absolute inset-0 rounded-full bg-[color-mix(in_oklab,var(--gold)_30%,transparent)]"
                initial={{ scale: 0.8, opacity: 0.8 }}
                animate={{ scale: 1.5, opacity: 0 }}
                transition={{ duration: 1.4, repeat: 2, ease: 'easeOut' }}
              />
            )}
            <span className="relieve-oro relative flex size-16 items-center justify-center rounded-full">
              <Zap size={30} fill="currentColor" strokeWidth={0} />
            </span>
          </span>
          <div>
            <p className="text-xs font-semibold tracking-[0.08em] text-gold uppercase">Día 1 de 30</p>
            <p className="font-display text-lg font-bold text-ink-1">Tu ruta está lista para empezar</p>
          </div>
        </motion.div>

        <motion.div {...entrar(1)}>
          <TituloAcento texto="Tus respuestas dicen que eres de los que actúan" acento="de los que actúan" className="mt-8 text-pregunta" />
        </motion.div>
        <motion.p {...entrar(2)} className="mt-4 text-base leading-relaxed text-ink-2">
          Pocos llegan con esto claro antes de empezar. <strong className="font-semibold text-ink-1">Tu primera misión usa justo eso:</strong> en 2 minutos armas tu propuesta de valor.
        </motion.p>

        <motion.ul {...entrar(3)} className="tarjeta-relieve mt-6 flex flex-col gap-3 rounded-[var(--radius-card)] p-4">
          {evidencia.map((e) => (
            <li key={e.rotulo} className="flex items-start gap-3">
              <span className="mt-0.5">
                <CheckCustom tono="verde" />
              </span>
              <span className="min-w-0">
                <span className="block text-xs font-semibold text-ink-3">{e.rotulo}</span>
                <span className="block text-ayuda leading-snug font-medium break-words text-ink-1">{e.valor}</span>
              </span>
            </li>
          ))}
        </motion.ul>
      </div>

      <BotonPrincipal onClick={onSeguir}>
        Hacer mi primera misión
        <ArrowRight size={20} aria-hidden="true" />
      </BotonPrincipal>
    </div>
  );
}
