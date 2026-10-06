'use client';

// Reconocimiento tras "¿Qué te frena?" (50 §A5): nombra el patrón, quita la culpa con la causa
// real y nombra el mecanismo. Mini-visual con los colores reales de la app: la noche en blanco
// (piedra) frente a la misión de 5 minutos (oro → pieza verde).

import { motion, useReducedMotion } from 'motion/react';
import { ArrowRight, Moon, Zap } from 'lucide-react';
import { RECONOCIMIENTO, type IdFreno } from '@/lib/onboarding';
import { BotonPrincipal, EASE_SALIDA, TituloAcento } from './piezas';

export function PasoReconocimiento({ freno, onSeguir }: { freno: IdFreno; onSeguir: () => void }) {
  const reduce = useReducedMotion();
  const r = RECONOCIMIENTO[freno];
  const entrar = (i: number) => ({
    initial: { opacity: 0, y: reduce ? 0 : 12 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.35, delay: reduce ? 0 : i * 0.07, ease: EASE_SALIDA },
  });

  return (
    <div className="flex flex-1 flex-col">
      <div className="px-4 pt-6" aria-live="polite">
        <motion.div {...entrar(0)} className="grid grid-cols-[1fr_auto_1fr] items-stretch gap-2" aria-hidden="true">
          <div className="tarjeta-relieve-base flex flex-col gap-3 rounded-[var(--radius-card)] p-3">
            <span className="relieve-piedra flex size-10 items-center justify-center rounded-[var(--radius-chip)]">
              <Moon size={20} strokeWidth={2.2} />
            </span>
            <div>
              <p className="text-xs font-semibold text-ink-3">{r.antes}</p>
              <p className="mt-1 font-display text-base leading-tight font-bold text-ink-2">{r.antesDato}</p>
            </div>
          </div>
          <span className="flex items-center text-ink-3">
            <ArrowRight size={20} />
          </span>
          <div className="tarjeta-relieve-oro flex flex-col gap-3 rounded-[var(--radius-card)] p-3">
            <motion.span
              initial={{ scale: reduce ? 1 : 0.6 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', bounce: 0.45, duration: 0.5, delay: reduce ? 0 : 0.35 }}
              className="relieve-oro flex size-10 items-center justify-center rounded-[var(--radius-chip)]"
            >
              <Zap size={20} fill="currentColor" strokeWidth={0} />
            </motion.span>
            <div>
              <p className="text-xs font-semibold text-gold">Con tu misión</p>
              <p className="mt-1 font-display text-base leading-tight font-bold text-ink-1">5 min · 1 pieza</p>
            </div>
          </div>
        </motion.div>

        <motion.div {...entrar(1)}>
          <TituloAcento texto={r.titulo} acento={r.acento} as="h1" className="mt-8 text-pregunta" />
        </motion.div>
        <motion.p {...entrar(2)} className="mt-4 text-base leading-relaxed text-ink-2">
          {r.cuerpo} <strong className="font-semibold text-ink-1">{r.fuerte}</strong>
        </motion.p>
      </div>

      <BotonPrincipal onClick={onSeguir}>
        Tiene sentido, sigamos
        <ArrowRight size={20} aria-hidden="true" />
      </BotonPrincipal>
    </div>
  );
}
