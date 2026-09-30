'use client';

// KIT DE LANDING — §3 AGITACIÓN (blueprint: 55 §3)
// El costo de seguir igual, visible. El tipo de `frases` es string[] a propósito:
// es IMPOSIBLE pasarle un párrafo de 72 palabras — cada frase es corta (máx 2
// líneas; warn a las 18 palabras). El NÚMERO del costo va en [b]/[acento] desde
// el copy marcado (es el dato héroe de la sección). MISMO fondo elevado que §2
// (un solo movimiento visual, sin separador). Cero decoración de miedo.

import { useEffect, useRef } from 'react';
import { animate, motion, useInView, useReducedMotion } from 'motion/react';
import type { LucideIcon } from 'lucide-react';
import { IconChip, SectionShell, useReveal, VIEWPORT_ONCE, type TonoFicha } from './ui';
import { MarkedCopy, warnCopy, warnRango } from './MarkedCopy';

export interface AgitacionProps {
  /** 2-4 frases MARCADAS y cortas — el array es el contrato: nada de párrafos. */
  frases: string[];
  /** Costo de la inacción como DATOS destacados (escaneable): cifra grande que cuenta + etiqueta corta. */
  cifras?: { valor: number; prefijo?: string; sufijo?: string; etiqueta: string; icon: LucideIcon; tono?: TonoFicha }[];
  /** Mini-card opcional "hoy vs en 6 meses" (55 §3). */
  contraste?: {
    labelHoy: string;
    hoy: string;
    labelFuturo: string;
    futuro: string;
  };
  id?: string;
}

/* Número héroe que cuenta de 0 al valor cuando entra en pantalla (baseline 2 de 22). */
function CifraQueCuenta({ valor, prefijo = '', sufijo = '' }: { valor: number; prefijo?: string; sufijo?: string }) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const visible = useInView(ref, { once: true, amount: 0.6 });
  const reduce = useReducedMotion();
  // El HTML del servidor trae el valor FINAL (nunca "0 h" antes de hidratar). En el cliente el
  // número se escribe directo en el DOM (sin re-render): se prepara en 0 y cuenta al entrar en pantalla.
  const numeroRef = useRef<HTMLSpanElement | null>(null);
  const preparado = useRef(false);
  useEffect(() => {
    if (reduce || visible || preparado.current || !numeroRef.current) return;
    numeroRef.current.textContent = '0';
    preparado.current = true;
  }, [reduce, visible]);
  useEffect(() => {
    if (!visible || reduce || !preparado.current) return;
    const control = animate(0, valor, {
      duration: 0.9,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        if (numeroRef.current) numeroRef.current.textContent = String(Math.round(v));
      },
    });
    return () => control.stop();
  }, [visible, reduce, valor]);
  return (
    <span ref={ref} className="tabular-nums">
      {prefijo}
      <span ref={numeroRef}>{valor}</span>
      {sufijo}
    </span>
  );
}

export function Agitacion({ frases, cifras, contraste, id }: AgitacionProps) {
  warnRango('Agitación → frases', frases.length, 2, 4);
  frases.forEach((f, i) => warnCopy(`Agitación → frase ${i + 1}`, f, 18));
  const { contenedor, item } = useReveal();

  return (
    <SectionShell id={id} elevacion="elevada" flush="top" ariaLabel="El costo de seguir igual">
      <motion.div
        variants={contenedor}
        initial="hidden"
        whileInView="visible"
        viewport={VIEWPORT_ONCE}
        className="mx-auto max-w-[620px]"
      >
        <div className="flex flex-col gap-4">
          {frases.slice(0, cifras ? 1 : frases.length).map((f, i) => (
            <motion.p
              key={i}
              variants={item}
              className="text-[16px] leading-[1.6] text-[var(--text-secondary)]"
            >
              <MarkedCopy text={f} />
            </motion.p>
          ))}
        </div>

        {cifras && (
          <motion.ul variants={item} className="tarjeta-relieve-base mt-6 grid grid-cols-3 rounded-[var(--radius-card)]">
            {cifras.map((c, i) => (
              <li
                key={i}
                className="flex flex-col items-center gap-2 border-r border-[color-mix(in_oklab,var(--text-tertiary)_18%,transparent)] px-2 py-5 text-center last:border-r-0"
              >
                <IconChip icon={c.icon} tone={c.tono ?? 'muted'} size="sm" />
                <p className="text-[30px] font-bold leading-none text-[var(--text-primary)] [font-family:var(--font-display)]">
                  <CifraQueCuenta valor={c.valor} prefijo={c.prefijo} sufijo={c.sufijo} />
                </p>
                <p className="text-pretty text-[12px] font-medium leading-snug text-[var(--text-secondary)]">{c.etiqueta}</p>
              </li>
            ))}
          </motion.ul>
        )}

        {cifras && frases.length > 1 && (
          <div className="mt-6 flex flex-col gap-4">
            {frases.slice(1).map((f, i) => (
              <motion.p key={i} variants={item} className="text-[16px] leading-[1.6] text-[var(--text-secondary)]">
                <MarkedCopy text={f} />
              </motion.p>
            ))}
          </div>
        )}

        {contraste && (
          <motion.div variants={item} className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-[var(--radius-card)] bg-[var(--bg)] p-5">
              <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[var(--text-tertiary)]">
                {contraste.labelHoy}
              </p>
              <p className="mt-2 text-[16px] leading-snug text-[var(--text-primary)]">{contraste.hoy}</p>
            </div>
            {/* "si nada cambia": más apagado/frío — el peso lo pone el copy, no el rojo */}
            <div className="rounded-[var(--radius-card)] bg-[var(--surface-2)] p-5">
              <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[var(--text-tertiary)]">
                {contraste.labelFuturo}
              </p>
              <p className="mt-2 text-[16px] leading-snug text-[var(--text-secondary)]">{contraste.futuro}</p>
            </div>
          </motion.div>
        )}
      </motion.div>
    </SectionShell>
  );
}
