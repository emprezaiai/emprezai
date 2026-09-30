'use client';

// Visual del hero: mini-demo HONESTO del Método Pieza a Pieza (jerarquía de fidelidad nivel 2 del 19).
// Reproduce el mecanismo real (idea → misión → pieza guardada) con un ejemplo rotulado como tal.
// Se reemplaza por la captura real de la app cuando la pantalla de misión exista (pendiente en ESTADO.md).

import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Check, Sparkles, Zap } from 'lucide-react';

const PIEZAS_PREVIAS = ['Tu idea', 'Tu cliente ideal'];

// Conteo animado del dato héroe (baseline 2 de 22): la pieza nueva suma al contador.
function ContadorPiezas({ desde, hasta, retraso }: { desde: number; hasta: number; retraso: number }) {
  const [valor, setValor] = useState(desde);
  useEffect(() => {
    let intervalo: number | undefined;
    const inicio = window.setTimeout(() => {
      intervalo = window.setInterval(() => {
        setValor((v) => Math.min(v + 1, hasta));
      }, 160);
    }, retraso * 1000);
    const fin = window.setTimeout(() => window.clearInterval(intervalo), retraso * 1000 + 160 * (hasta - desde + 1));
    return () => {
      window.clearTimeout(inicio);
      window.clearTimeout(fin);
      window.clearInterval(intervalo);
    };
  }, [desde, hasta, retraso]);
  return (
    <motion.span
      key={valor}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="inline-block font-bold text-green"
    >
      {valor}
    </motion.span>
  );
}

export function DemoMisionHero() {
  const reduce = useReducedMotion();
  const aparecer = (retraso: number) => ({
    initial: { opacity: 0, y: reduce ? 0 : 12 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.45, delay: reduce ? 0 : retraso, ease: [0.16, 1, 0.3, 1] as const },
  });

  return (
    <div
      className="relative px-5 py-8 md:py-10"
      style={{
        background:
          'radial-gradient(420px 260px at 85% 0%, color-mix(in oklab, var(--gold) 16%, transparent), transparent 70%), ' +
          'radial-gradient(360px 260px at 0% 100%, color-mix(in oklab, var(--green) 10%, transparent), transparent 70%), ' +
          'var(--surface-sunken)',
      }}
    >
      <p className="mb-4 text-center text-xs font-semibold uppercase tracking-[0.08em] text-ink-3">
        Ejemplo real de una misión
      </p>

      <div className="mx-auto max-w-sm rounded-[var(--radius-card)] border border-[var(--line)] bg-raised p-4 text-left shadow-[0_24px_48px_-24px_rgb(0_0_0/0.8)]">
        <motion.div {...aparecer(0.1)} className="flex items-center gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-[var(--radius-chip)] bg-gradient-to-br from-gold-light to-gold shadow-[0_3px_0_var(--gold-deep)]">
            <Zap size={20} fill="currentColor" className="text-on-gold" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-gold">Día 3 · 5 min</p>
            <p className="font-display text-lg font-extrabold leading-tight text-ink-1">Tu oferta en una frase</p>
          </div>
        </motion.div>

        <motion.div {...aparecer(0.35)} className="mt-3 flex flex-wrap items-center gap-1.5 text-xs font-semibold text-ink-3">
          <span>La IA usó:</span>
          {PIEZAS_PREVIAS.map((pieza) => (
            <span
              key={pieza}
              className="inline-flex items-center gap-1 rounded-full bg-[color-mix(in_oklab,var(--green)_12%,transparent)] px-2 py-1 text-green"
            >
              <Check size={12} strokeWidth={3} aria-hidden="true" />
              {pieza}
            </span>
          ))}
        </motion.div>

        <motion.div
          {...aparecer(0.7)}
          className="mt-3 rounded-[16px] p-3"
          style={{
            border: '1px solid transparent',
            background:
              'linear-gradient(var(--surface-raised-2), var(--surface-raised-2)) padding-box, ' +
              'linear-gradient(135deg, color-mix(in oklab, var(--gold) 70%, transparent), transparent 60%) border-box',
          }}
        >
          <p className="flex items-center gap-1.5 text-xs font-semibold text-gold">
            <Sparkles size={14} aria-hidden="true" />
            La IA armó tu oferta
          </p>
          <p className="mt-1.5 font-display text-base font-bold leading-snug text-ink-1">
            «Mini curso para que dueños de negocio dominen Excel en 7 días, sin fórmulas raras.»
          </p>
        </motion.div>

        <motion.div {...aparecer(1.05)} className="relative mt-3 rounded-[16px] bg-sunken px-3 py-3">
          {/* Firma de la ficha: la pieza nueva "vuela" a Mi Empresa antes de encenderse el tick */}
          {!reduce && (
            <motion.span
              aria-hidden="true"
              initial={{ opacity: 0, y: -64, scale: 1 }}
              animate={{ opacity: [0, 1, 1, 0], y: [-64, -64, 0, 0], scale: [1, 1, 0.5, 0.5] }}
              transition={{ duration: 0.7, delay: 1.0, times: [0, 0.2, 0.8, 1], ease: [0.16, 1, 0.3, 1] }}
              className="pointer-events-none absolute top-3 left-3 flex h-6 items-center gap-1 rounded-full bg-gold px-2 text-xs font-bold text-on-gold shadow-[0_2px_0_var(--gold-deep)]"
            >
              <Sparkles size={12} />
              Pieza
            </motion.span>
          )}
          <div className="flex items-center justify-between gap-3">
            <span className="flex items-center gap-2 text-xs font-semibold whitespace-nowrap text-ink-2">
              <motion.span
                initial={{ scale: reduce ? 1 : 0 }}
                animate={{ scale: 1 }}
                transition={reduce ? { duration: 0 } : { type: 'spring', bounce: 0.5, duration: 0.5, delay: 1.35 }}
                className="flex size-6 items-center justify-center rounded-full bg-green"
              >
                <Check size={14} strokeWidth={3} className="text-on-green" aria-hidden="true" />
              </motion.span>
              En Mi Empresa
            </span>
            <span className="text-xs font-semibold whitespace-nowrap tabular-nums text-ink-3">
              <ContadorPiezas desde={reduce ? 3 : 0} hasta={3} retraso={reduce ? 0 : 1.35} /> de 30 piezas
            </span>
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[color-mix(in_oklab,var(--ink-1)_10%,transparent)]" aria-hidden="true">
            <motion.div
              initial={{ scaleX: reduce ? 1 : 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: reduce ? 0 : 0.7, delay: reduce ? 0 : 1.35, ease: [0.16, 1, 0.3, 1] }}
              className="h-full w-[10%] origin-left rounded-full bg-gradient-to-r from-green to-green-light"
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
