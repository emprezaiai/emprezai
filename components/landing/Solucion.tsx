'use client';

// KIT DE LANDING — §4 SOLUCIÓN (blueprint: 55 §4)
// Vuelve al fondo BASE (el alivio también es visual). Kicker + título + el
// MECANISMO BAUTIZADO en su chip con <Accent> y hairline (uno de los 1-3 usos
// permitidos por vista) + Big Idea + EXACTAMENTE 3 pasos con number chip 44px
// (tupla en el tipo: ni 2 ni 4) + antes/después opcional. Pasos entran
// escalonados (whileInView + stagger, reduced-motion respetado).

import { motion } from 'motion/react';
import { Check, Puzzle, X } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Accent, CtaButton, IconChip, Kicker, SectionShell, useReveal, VIEWPORT_ONCE } from './ui';
import { MarkedCopy, warnCopy } from './MarkedCopy';

export interface PasoMecanismo {
  /** Ícono del paso (se muestra en ficha dorada en relieve con su número). */
  icon?: LucideIcon;
  /** Título del paso — 16px/600. */
  titulo: string;
  /** UNA línea (warn a las 14 palabras). */
  detalle: string;
}

export interface SolucionProps {
  /** Kicker en acento — default "EL MECANISMO". */
  kicker?: string;
  /** Copy MARCADO del título de sección (máx 8 palabras). */
  tituloMarked: string;
  /** Nombre PROPIO del mecanismo bautizado (19) — se pinta en el chip con <Accent>. */
  mecanismo: string;
  /** Big Idea en 1-2 líneas, copy MARCADO. */
  bigIdeaMarked: string;
  /** Los 3 pasos del mecanismo — la tupla obliga a que sean exactamente 3. */
  pasos: [PasoMecanismo, PasoMecanismo, PasoMecanismo];
  /** Antes/después opcional: split 2 columnas, el "después" con acento sutil. */
  antesDespues?: {
    labelAntes: string;
    antes: string;
    labelDespues: string;
    despues: string;
  };
  /** CTA tras el mecanismo (el lector ya convencido compra sin buscar). */
  cta?: { label: string; href: string };
  id?: string;
}

export function Solucion({
  kicker = 'EL MECANISMO',
  tituloMarked,
  mecanismo,
  bigIdeaMarked,
  pasos,
  antesDespues,
  cta,
  id,
}: SolucionProps) {
  warnCopy('Solución → título', tituloMarked, 8);
  warnCopy('Solución → Big Idea', bigIdeaMarked, 30);
  pasos.forEach((p, i) => warnCopy(`Solución → paso ${i + 1}`, p.detalle, 14));
  const { contenedor, item } = useReveal();

  return (
    <SectionShell id={id} elevacion="base" ariaLabel="Cómo funciona">
      <motion.div
        variants={contenedor}
        initial="hidden"
        whileInView="visible"
        viewport={VIEWPORT_ONCE}
        className="mx-auto max-w-[780px]"
      >
        <motion.div variants={item}>
          <Kicker>{kicker}</Kicker>
          <h2 className="text-balance text-[30px] font-bold leading-[1.15] text-[var(--text-primary)] [font-family:var(--font-display)] md:text-[40px]">
            <MarkedCopy text={tituloMarked} />
          </h2>
        </motion.div>

        {/* El chip del mecanismo bautizado — hairline + <Accent> (55 §4) */}
        <motion.div variants={item} className="mt-4">
          <span className="inline-flex w-fit items-center gap-2 rounded-[var(--radius-chip,12px)] bg-[color-mix(in_oklab,var(--accent)_10%,transparent)] px-3 py-1.5 text-[13px] font-semibold uppercase tracking-[0.06em]">
            <Puzzle size={14} color="var(--accent)" aria-hidden="true" />
            <Accent>{mecanismo}</Accent>
          </span>
        </motion.div>

        <motion.p variants={item} className="mt-5 max-w-[620px] text-[16px] leading-relaxed text-[var(--text-secondary)] md:text-[18px]">
          <MarkedCopy text={bigIdeaMarked} />
        </motion.p>

        {/* 3 pasos: filas apiladas en mobile, 3 columnas en desktop */}
        <ol className="relative mt-10 grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* El camino: línea punteada que une los nodos, como el mapa de la Ruta */}
          <span
            aria-hidden="true"
            className="absolute top-6 bottom-6 left-[21px] border-l-2 border-dashed border-[color-mix(in_oklab,var(--accent)_35%,transparent)] md:hidden"
          />
          {pasos.map((p, i) => (
            <motion.li key={i} variants={item} className="relative flex items-start gap-4 md:flex-col">
              <span aria-hidden="true" className="relative shrink-0">
                {p.icon ? (
                  <IconChip icon={p.icon} tone={i === pasos.length - 1 ? 'verde' : 'accent'} />
                ) : (
                  <span className="relieve-oro flex size-11 items-center justify-center rounded-[var(--radius-chip,var(--radius-button))] text-[16px] font-bold">
                    {i + 1}
                  </span>
                )}
                {p.icon && (
                  <span className="relieve-piedra absolute -right-2 -top-2 flex size-6 items-center justify-center rounded-full text-[12px] font-bold tabular-nums">
                    {i + 1}
                  </span>
                )}
              </span>
              <div className="pt-1 md:pt-0">
                <h3 className="text-[16px] font-semibold text-[var(--text-primary)]">{p.titulo}</h3>
                <p className="mt-1 text-[16px] leading-snug text-[var(--text-secondary)]">{p.detalle}</p>
              </div>
            </motion.li>
          ))}
        </ol>

        {antesDespues && (
          <motion.div variants={item} className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="tarjeta-relieve flex items-start gap-4 rounded-[var(--radius-card)] p-5">
              <IconChip icon={X} tone="muted" size="sm" />
              <div>
              <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[var(--text-tertiary)]">
                {antesDespues.labelAntes}
              </p>
              <p className="mt-2 text-[16px] leading-snug text-[var(--text-secondary)]">{antesDespues.antes}</p>
              </div>
            </div>
            {/* El "después" en tarjeta dorada en relieve */}
            <div className="tarjeta-relieve-oro flex items-start gap-4 rounded-[var(--radius-card)] p-5">
              <IconChip icon={Check} tone="verde" size="sm" />
              <div>
              <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[var(--accent)]">
                {antesDespues.labelDespues}
              </p>
              <p className="mt-2 text-[16px] font-medium leading-snug text-[var(--text-primary)]">
                {antesDespues.despues}
              </p>
              </div>
            </div>
          </motion.div>
        )}

        {cta && (
          <motion.div variants={item} className="mt-10 flex justify-center">
            <CtaButton href={cta.href}>{cta.label}</CtaButton>
          </motion.div>
        )}
      </motion.div>
    </SectionShell>
  );
}
