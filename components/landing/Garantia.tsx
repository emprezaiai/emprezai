'use client';

// KIT DE LANDING — §7 GARANTÍA (blueprint: 55 §7)
// Franja propia compacta (48-64px) bajo la oferta — NO una línea perdida.
// Escudo SVG en chip 60px (jamás emoji), nombre PROPIO de la garantía en acento,
// condición máx 3 líneas (warn a las 30 palabras), piso Hotmart con candado SVG.
// Nunca placeholders ("garantía visible"): se nombra la política concreta o la
// sección no se monta (52 §5). El plazo = el configurado en Hotmart (19 §7).

import { motion } from 'motion/react';
import { Lock, ShieldCheck } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Accent, CtaButton, Hairline, IconChip, SectionShell, useReveal, VIEWPORT_ONCE } from './ui';
import { MarkedCopy, warnCopy } from './MarkedCopy';

export interface GarantiaProps {
  /** Nombre PROPIO ("la Garantía del Primer Día Claro") — se pinta en acento. */
  nombre: string;
  /** Copy MARCADO de la condición — máx 3 líneas (~30 palabras, warn). */
  condicionMarked: string;
  /** Piso legal verificable ("Respaldada por la garantía Hotmart de 7 días"). */
  pisoLegal?: string;
  /** default ShieldCheck (Lucide) — siempre SVG. */
  icon?: LucideIcon;
  /** 2-3 sellos cortos con ícono (condiciones de un vistazo). */
  sellos?: { icon: LucideIcon; texto: string }[];
  /** CTA tras la garantía (el riesgo ya se quitó: comprar sin buscar). */
  cta?: { label: string; href: string };
  id?: string;
}

export function Garantia({ nombre, condicionMarked, pisoLegal, icon: Icono = ShieldCheck, sellos, cta, id }: GarantiaProps) {
  warnCopy('Garantía → condición', condicionMarked, 30);
  const { contenedor, item } = useReveal();

  return (
    <SectionShell id={id} elevacion="elevada" compacta ariaLabel="Garantía">
      <motion.div
        variants={contenedor}
        initial="hidden"
        whileInView="visible"
        viewport={VIEWPORT_ONCE}
        className="mx-auto max-w-[560px]"
      >
        <motion.div variants={item}>
          {/* La card de garantía: uno de los 1-3 usos de hairline permitidos por vista */}
          <Hairline surface="surface" className="shadow-[0_2px_0_rgb(184_134_15/0.45),0_24px_40px_-20px_rgb(255_194_61/0.3)]">
            <div className="flex flex-col items-center gap-4 px-6 py-10 text-center text-pretty">
              <IconChip icon={Icono} tone="accent" size="lg" />
              <h2 className="text-balance text-[30px] font-bold leading-tight [font-family:var(--font-display)]">
                <Accent>{nombre}</Accent>
              </h2>
              <p className="max-w-[44ch] text-[16px] leading-[1.6] text-[var(--text-secondary)]">
                <MarkedCopy text={condicionMarked} />
              </p>
              {sellos && (
                <ul className="flex flex-wrap justify-center gap-2">
                  {sellos.map((se, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-2 rounded-full bg-[color-mix(in_oklab,var(--accent)_10%,transparent)] py-1 pr-3 pl-1 shadow-[inset_0_1px_0_rgb(255_255_255/0.08),0_2px_0_rgb(0_0_0/0.3)]"
                    >
                      <span className="relieve-oro flex size-7 items-center justify-center rounded-full">
                        <se.icon size={14} strokeWidth={2.5} aria-hidden="true" />
                      </span>
                      <span className="text-[13px] font-semibold text-[var(--text-primary)]">{se.texto}</span>
                    </li>
                  ))}
                </ul>
              )}
              {pisoLegal && (
                <p className="flex items-center gap-1.5 text-[13px] text-[var(--text-tertiary)]">
                  <Lock size={14} aria-hidden="true" />
                  {pisoLegal}
                </p>
              )}
            </div>
          </Hairline>
        </motion.div>
        {cta && (
          <motion.div variants={item} className="mt-8 flex justify-center">
            <CtaButton href={cta.href}>{cta.label}</CtaButton>
          </motion.div>
        )}
      </motion.div>
    </SectionShell>
  );
}
