'use client';

// LA RECOMPENSA (momento aha, antes de la pantalla de planes): la Pieza #1 armada con sus
// respuestas, celebrada (hito real: su primera pieza) y guardada en Mi Empresa. Debajo, el Día 2
// bloqueado: la tensión honesta que lleva a la pantalla de planes.

import { useEffect, useState } from 'react';
import { animate, motion, useMotionValue, useReducedMotion, useTransform } from 'motion/react';
import { ArrowRight, Check, Copy, LockKeyhole, PencilLine, Sparkles, Target } from 'lucide-react';
import type { PrimeraPieza } from '@/lib/onboarding';
import { BotonPrincipal, EASE_SALIDA, TituloAcento } from './piezas';

const CHISPAS = [0, 60, 120, 180, 240, 300];

export function PasoPieza({
  pieza,
  onEditar,
  onSeguir,
}: {
  pieza: PrimeraPieza;
  onEditar: () => void;
  onSeguir: () => void;
}) {
  const reduce = useReducedMotion();
  const [copiado, setCopiado] = useState<'no' | 'si' | 'error'>('no');
  const piezas = useMotionValue(reduce ? 1 : 0);
  const piezasTexto = useTransform(piezas, (v) => Math.round(v).toString());

  useEffect(() => {
    if (reduce) return;
    const control = animate(piezas, 1, { duration: 0.4, delay: 1.3 });
    return () => control.stop();
  }, [piezas, reduce]);

  const entrar = (i: number) => ({
    initial: { opacity: 0, y: reduce ? 0 : 14 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, delay: reduce ? 0 : 0.15 + i * 0.08, ease: EASE_SALIDA },
  });

  async function copiar() {
    try {
      await navigator.clipboard.writeText(pieza.frase);
      setCopiado('si');
    } catch {
      setCopiado('error');
    }
    window.setTimeout(() => setCopiado('no'), 2400);
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="px-4 pt-8">
        {/* Celebración: insignia verde con resorte + chispas doradas (una sola vez) */}
        <div className="flex items-center gap-4">
          <span className="relative flex size-16 shrink-0 items-center justify-center" aria-hidden="true">
            {!reduce &&
              CHISPAS.map((grados) => (
                <motion.span
                  key={grados}
                  className="absolute size-2 rounded-full bg-gold"
                  initial={{ x: 0, y: 0, opacity: 0, scale: 0.6 }}
                  animate={{
                    x: Math.cos((grados * Math.PI) / 180) * 44,
                    y: Math.sin((grados * Math.PI) / 180) * 44,
                    opacity: [0, 1, 0],
                    scale: [0.6, 1, 0.4],
                  }}
                  transition={{ duration: 0.7, delay: 0.25, ease: EASE_SALIDA }}
                />
              ))}
            <motion.span
              initial={{ scale: reduce ? 1 : 0.4, rotate: reduce ? 0 : -12 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', bounce: 0.25, duration: 0.6 }}
              className="relieve-verde relative flex size-16 items-center justify-center rounded-full"
            >
              <Check size={32} strokeWidth={3} />
            </motion.span>
          </span>
          <motion.div {...entrar(0)}>
            <p className="text-xs font-semibold tracking-[0.08em] text-green uppercase">Día 1 completado</p>
            <TituloAcento texto="¡Tu pieza 1 está lista!" acento="pieza 1" className="text-2xl leading-tight" />
          </motion.div>
        </div>

        {/* La pieza */}
        <motion.article {...entrar(1)} className="hairline-oro mt-6 rounded-[var(--radius-card)] p-4 shadow-[0_24px_40px_-20px_rgb(0_0_0/0.85)]">
          <div className="flex items-center gap-3">
            <span className="relieve-oro flex size-10 shrink-0 items-center justify-center rounded-[var(--radius-chip)]" aria-hidden="true">
              <Sparkles size={20} strokeWidth={2.2} />
            </span>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-gold">Pieza 1 de 30</p>
              <h2 className="font-display text-lg leading-tight font-bold text-ink-1">{pieza.titulo}</h2>
            </div>
          </div>

          <blockquote className="mt-4 font-display text-xl leading-snug font-bold text-pretty break-words text-ink-1">
            «{pieza.frase}»
          </blockquote>

          <div className="mt-4 flex flex-col gap-3 border-t border-[var(--line)] pt-4">
            <p className="flex items-start gap-2 text-ayuda leading-snug text-ink-2">
              <Target size={18} className="mt-0.5 shrink-0 text-gold" aria-hidden="true" />
              <span>
                <strong className="font-semibold text-ink-1">Tu prueba de hoy:</strong> {pieza.prueba}
              </span>
            </p>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={copiar}
              className="flex h-11 items-center justify-center gap-2 rounded-[var(--radius-pill)] border border-[var(--line)] bg-raised-2 text-sm font-semibold text-ink-1 transition-colors duration-150 active:scale-[0.98]"
            >
              {copiado === 'si' ? <Check size={16} className="text-green" aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />}
              {copiado === 'si' ? '¡Copiada!' : 'Copiar frase'}
            </button>
            <button
              type="button"
              onClick={onEditar}
              className="flex h-11 items-center justify-center gap-2 rounded-[var(--radius-pill)] border border-[var(--line)] bg-raised-2 text-sm font-semibold text-ink-1 transition-colors duration-150 active:scale-[0.98]"
            >
              <PencilLine size={16} aria-hidden="true" />
              Editar
            </button>
          </div>
          <p role="status" className={copiado === 'error' ? 'mt-2 text-center text-xs text-warning' : 'sr-only'}>
            {copiado === 'error' ? 'No se pudo copiar: mantén presionada la frase para copiarla.' : copiado === 'si' ? 'Frase copiada' : ''}
          </p>
        </motion.article>

        {/* Guardada en Mi Empresa: la pieza "vuela" y el contador sube */}
        <motion.div {...entrar(2)} className="tarjeta-relieve-base relative mt-4 rounded-[var(--radius-card)] p-4">
          {!reduce && (
            <motion.span
              aria-hidden="true"
              initial={{ opacity: 0, y: -48, scale: 1 }}
              animate={{ opacity: [0, 1, 1, 0], y: [-48, -48, 0, 0], scale: [1, 1, 0.5, 0.5] }}
              transition={{ duration: 0.7, delay: 0.9, times: [0, 0.2, 0.8, 1], ease: EASE_SALIDA }}
              className="pointer-events-none absolute top-4 left-4 flex h-6 items-center gap-1 rounded-full bg-gold px-2 text-xs font-bold text-on-gold"
            >
              <Sparkles size={12} />
              Pieza 1
            </motion.span>
          )}
          <div className="flex items-center justify-between gap-3">
            <span className="flex items-center gap-2 text-sm font-semibold text-ink-1">
              <motion.span
                initial={{ scale: reduce ? 1 : 0 }}
                animate={{ scale: 1 }}
                transition={reduce ? { duration: 0 } : { type: 'spring', bounce: 0.25, duration: 0.5, delay: 1.3 }}
                className="flex size-6 items-center justify-center rounded-full bg-green text-on-green"
              >
                <Check size={14} strokeWidth={3} aria-hidden="true" />
              </motion.span>
              Guardada en Mi Empresa
            </span>
            <span className="text-xs font-semibold whitespace-nowrap tabular-nums text-ink-2">
              <motion.span className="font-bold text-green">{piezasTexto}</motion.span> de 30 piezas
            </span>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-[color-mix(in_oklab,var(--ink-1)_10%,transparent)]" aria-hidden="true">
            <motion.div
              initial={{ scaleX: reduce ? 1 : 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: reduce ? 0 : 0.6, delay: reduce ? 0 : 1.3, ease: EASE_SALIDA }}
              className="h-full min-w-3 origin-left rounded-full bg-gradient-to-r from-green to-green-light"
              style={{ width: `${100 / 30}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-ink-3">En este celular por ahora; pasa a tu cuenta al crearla.</p>
        </motion.div>

        {/* Mañana: el Día 2 bloqueado (pérdida honesta) */}
        <motion.div {...entrar(3)} className="mt-4 flex items-center gap-3 rounded-[var(--radius-card)] border border-dashed border-[var(--line)] bg-sunken p-4">
          <span className="relieve-piedra flex size-10 shrink-0 items-center justify-center rounded-[var(--radius-chip)]" aria-hidden="true">
            <LockKeyhole size={18} strokeWidth={2.2} />
          </span>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-ink-3">Mañana · Día 2</p>
            <p className="text-ayuda leading-snug font-semibold text-ink-1">Tu cliente ideal</p>
            <p className="text-caption leading-snug text-ink-2">La IA arma su retrato usando la frase de hoy.</p>
          </div>
        </motion.div>
      </div>

      <BotonPrincipal onClick={onSeguir} nota="Tu pieza 1 ya quedó guardada">
        Seguir armando mi empresa
        <ArrowRight size={20} aria-hidden="true" />
      </BotonPrincipal>
    </div>
  );
}
