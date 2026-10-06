'use client';

// Etiquetado positivo (50 §A5, variante final obligatoria): identidad aspiracional + la evidencia
// sacada de SUS respuestas + puente a la primera misión. La etiqueta CAMBIA según cómo llegó:
// quien no tenía idea no lee "llegaste con esto claro" (sería adular sin evidencia).

import { motion, useReducedMotion } from 'motion/react';
import { ArrowRight, Zap } from 'lucide-react';
import { NOMBRE_AREA, NOMBRE_MOMENTO, type IdArea, type IdMomento, type IdPunto } from '@/lib/onboarding';
import { BotonPrincipal, CheckCustom, EASE_SALIDA, TituloAcento } from './piezas';

function etiqueta(punto: IdPunto | undefined, eligioConAyuda: boolean): { titulo: string; acento: string; cuerpo: string } {
  if (punto === 'sin-idea' || eligioConAyuda) {
    return {
      titulo: 'Elegiste en vez de quedarte en blanco',
      acento: 'en vez de quedarte en blanco',
      cuerpo: 'Eso ya es avanzar: ahora tienes área, idea y horario, cuando muchos se quedan solo pensándolo.',
    };
  }
  if (punto === 'oferta') {
    return {
      titulo: 'Tus respuestas dicen que vas directo al grano',
      acento: 'directo al grano',
      cuerpo: 'Ya sabes qué vender; te falta convertirlo en una oferta que se entienda en una frase.',
    };
  }
  return {
    titulo: 'Tus respuestas dicen que eres de los que actúan',
    acento: 'de los que actúan',
    cuerpo: 'Tenías una idea guardada y hoy le pusiste área y horario. Ese es el paso que casi nadie da.',
  };
}

export function PasoEtiqueta({
  punto,
  eligioConAyuda,
  area,
  idea,
  momento,
  onSeguir,
}: {
  punto?: IdPunto;
  eligioConAyuda: boolean;
  area: IdArea;
  idea: string;
  momento: IdMomento;
  onSeguir: () => void;
}) {
  const reduce = useReducedMotion();
  const e = etiqueta(punto, eligioConAyuda);
  const entrar = (i: number) => ({
    initial: { opacity: 0, y: reduce ? 0 : 12 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.35, delay: reduce ? 0 : i * 0.06, ease: EASE_SALIDA },
  });
  const evidencia = [
    { rotulo: 'Tu área', valor: NOMBRE_AREA[area] },
    { rotulo: 'Tu idea', valor: idea },
    { rotulo: 'Tu momento', valor: `5 minutos ${NOMBRE_MOMENTO[momento]}` },
  ];

  return (
    <div className="flex flex-1 flex-col">
      <div className="px-4 pt-6" aria-live="polite">
        <motion.div {...entrar(0)} className="flex items-center gap-3">
          <span className="relative flex size-12 items-center justify-center" aria-hidden="true">
            {!reduce && (
              <motion.span
                className="absolute inset-0 rounded-full bg-[color-mix(in_oklab,var(--gold)_30%,transparent)]"
                initial={{ scale: 1, opacity: 0.7 }}
                animate={{ scale: 1.5, opacity: 0 }}
                transition={{ duration: 1.4, repeat: 2, ease: 'easeOut' }}
              />
            )}
            <span className="relieve-oro relative flex size-12 items-center justify-center rounded-full">
              <Zap size={24} fill="currentColor" strokeWidth={0} />
            </span>
          </span>
          <p className="text-xs font-semibold tracking-[0.08em] text-gold uppercase">Día 1 de 30 · tu ruta está lista</p>
        </motion.div>

        <motion.div {...entrar(1)}>
          <TituloAcento texto={e.titulo} acento={e.acento} className="mt-6 text-pregunta" />
        </motion.div>
        <motion.p {...entrar(2)} className="mt-4 text-base leading-relaxed text-ink-2">
          {e.cuerpo} <strong className="font-semibold text-ink-1">Tu primera misión usa justo eso: en 5 minutos armas tu frase de negocio.</strong>
        </motion.p>

        <motion.ul {...entrar(3)} className="tarjeta-relieve mt-6 flex flex-col gap-3 rounded-[var(--radius-card)] p-4">
          {evidencia.map((ev) => (
            <li key={ev.rotulo} className="flex items-start gap-3">
              <span className="mt-0.5">
                <CheckCustom tono="verde" />
              </span>
              <span className="min-w-0">
                <span className="block text-xs font-semibold text-ink-3">{ev.rotulo}</span>
                <span className="block text-ayuda leading-snug font-medium break-words text-ink-1">{ev.valor}</span>
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
