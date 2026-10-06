'use client';

// Reconocimiento tras "¿Qué te frena?" (50 §A5): nombra el patrón, quita la culpa con la causa
// real y nombra el mecanismo. Mini-visual con los colores reales de la app: la noche en blanco
// (piedra) frente a la misión de 5 minutos (oro), y debajo la ruta (dispositivo de la marca).

import { useEffect } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowRight, LockKeyhole, Moon, Zap } from 'lucide-react';
import { RECONOCIMIENTO, type IdFreno } from '@/lib/onboarding';
import { BotonPrincipal, EASE_SALIDA, TituloAcento, vibrar } from './piezas';

const DIAS_RUTA = [1, 2, 3, 4, 5];

export function PasoReconocimiento({
  freno,
  frenoOtro,
  onSeguir,
}: {
  freno: IdFreno;
  frenoOtro?: string;
  onSeguir: () => void;
}) {
  const reduce = useReducedMotion();
  const r = RECONOCIMIENTO[freno];
  const entrar = (i: number) => ({
    initial: { opacity: 0, y: reduce ? 0 : 12 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.35, delay: reduce ? 0 : i * 0.06, ease: EASE_SALIDA },
  });

  // El reconocimiento se siente llegar (háptica suave al aparecer).
  useEffect(() => vibrar(), []);

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
              transition={{ type: 'spring', bounce: 0.25, duration: 0.45, delay: reduce ? 0 : 0.3 }}
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
          {freno === 'otro' && frenoOtro && (
            <>
              Nos contaste: <span className="text-ink-1">«{frenoOtro}»</span>.{' '}
            </>
          )}
          {r.cuerpo} <strong className="font-semibold text-ink-1">{r.fuerte}</strong>
        </motion.p>

        {/* La ruta: así se ve avanzar un día a la vez */}
        <motion.div {...entrar(3)} className="tarjeta-relieve-base mt-8 rounded-[var(--radius-card)] p-4">
          <p className="text-xs font-semibold tracking-[0.08em] text-gold uppercase">Así avanzas: un día a la vez</p>
          <ol className="relative mt-4 flex items-start justify-between">
            <span aria-hidden="true" className="absolute top-4 right-4 left-4 h-0.5 bg-[color-mix(in_oklab,var(--ink-1)_12%,transparent)]" />
            {DIAS_RUTA.map((dia) => (
              <li key={dia} className="relative flex flex-col items-center gap-1">
                {dia === 1 ? (
                  <span className="relative flex size-8 items-center justify-center">
                    {!reduce && (
                      <motion.span
                        aria-hidden="true"
                        className="absolute inset-0 rounded-full bg-[color-mix(in_oklab,var(--gold)_35%,transparent)]"
                        animate={{ scale: [1, 1.5], opacity: [0.7, 0] }}
                        transition={{ duration: 1.4, repeat: 2, ease: 'easeOut' }}
                      />
                    )}
                    <span className="relieve-oro relative flex size-8 items-center justify-center rounded-full">
                      <Zap size={16} fill="currentColor" strokeWidth={0} aria-hidden="true" />
                    </span>
                  </span>
                ) : (
                  <span className="flex size-8 items-center justify-center rounded-full border border-[var(--line)] bg-sunken text-ink-3">
                    <LockKeyhole size={14} aria-hidden="true" />
                  </span>
                )}
                <span className={`text-xs font-semibold ${dia === 1 ? 'text-gold' : 'text-ink-3'}`}>{dia === 1 ? 'Hoy' : `Día ${dia}`}</span>
              </li>
            ))}
            <li className="relative flex flex-col items-center gap-1">
              <span className="flex size-8 items-center justify-center rounded-full border border-[var(--line)] bg-sunken text-xs font-bold text-ink-2">
                30
              </span>
              <span className="text-xs font-semibold text-ink-3">Lista</span>
            </li>
          </ol>
        </motion.div>
      </div>

      <BotonPrincipal onClick={onSeguir}>
        Tiene sentido, sigamos
        <ArrowRight size={20} aria-hidden="true" />
      </BotonPrincipal>
    </div>
  );
}
