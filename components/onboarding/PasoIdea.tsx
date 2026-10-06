'use client';

// La idea en una línea (50 §A3 "Sugerir por mí"): las sugerencias del área RELLENAN el campo,
// no avanzan. Si el usuario no tiene idea, las sugerencias van primero. "Tu idea es tuya" junto
// al campo (objeción 6 de FICHA-AVATAR).

import { useId, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowRight, LockKeyhole, Sparkles } from 'lucide-react';
import { IDEAS_SUGERIDAS, LARGO_MAX_IDEA, NOMBRE_AREA, type IdArea, type IdPunto } from '@/lib/onboarding';
import { BotonPrincipal, EASE_SALIDA, TituloAcento, vibrar } from './piezas';

export function PasoIdea({
  area,
  punto,
  areaElegidaPorAyuda,
  valor,
  onSeguir,
}: {
  area: IdArea;
  punto?: IdPunto;
  areaElegidaPorAyuda: boolean;
  valor?: string;
  onSeguir: (idea: string) => void;
}) {
  const reduce = useReducedMotion();
  const idCampo = useId();
  const [idea, setIdea] = useState(valor ?? '');
  const [aviso, setAviso] = useState(0);
  const campo = useRef<HTMLTextAreaElement>(null);
  const sinIdea = punto === 'sin-idea';
  const valida = idea.trim().length >= 6;

  const titulo = sinIdea ? 'Elige una idea para empezar' : 'Cuéntame tu idea en una línea';
  const acento = sinIdea ? 'una idea' : 'tu idea';

  return (
    <div className="flex flex-1 flex-col">
      <div className="px-4 pt-6">
        <motion.div
          initial={{ opacity: 0, y: reduce ? 0 : 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: EASE_SALIDA }}
        >
          <p className="text-xs font-semibold tracking-[0.08em] text-gold uppercase">
            {NOMBRE_AREA[area]}
            {areaElegidaPorAyuda && <span className="text-ink-3 normal-case tracking-normal"> · por lo que se te da mejor</span>}
          </p>
          <TituloAcento texto={titulo} acento={acento} className="mt-2 text-pregunta" />
          <p className="mt-2 text-ayuda text-ink-2">
            {sinIdea ? 'Toca una para completar el campo. Puedes cambiarla cuando quieras.' : 'Si te cuesta, toca una sugerencia y edítala.'}
          </p>
        </motion.div>

        <div className="mt-6 flex flex-col gap-2" aria-label="Sugerencias de idea">
          <p className="flex items-center gap-1 text-xs font-semibold text-ink-3">
            <Sparkles size={14} className="text-gold" aria-hidden="true" />
            Sugerencias para tu área
          </p>
          {IDEAS_SUGERIDAS[area].map((sugerencia, i) => (
            <motion.button
              key={sugerencia}
              type="button"
              aria-pressed={idea === sugerencia}
              onClick={() => {
                setIdea(sugerencia);
                vibrar();
              }}
              initial={{ opacity: 0, y: reduce ? 0 : 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: reduce ? 0 : 0.1 + i * 0.055, ease: EASE_SALIDA }}
              whileTap={{ scale: 0.98 }}
              className="opcion-recorrido min-h-12 px-5 py-3 text-left text-ayuda leading-snug font-medium text-ink-1"
            >
              {sugerencia}
            </motion.button>
          ))}
        </div>

        <label htmlFor={idCampo} className="mt-6 block text-sm font-semibold text-ink-1">
          Tu idea
        </label>
        <textarea
          key={aviso}
          ref={campo}
          id={idCampo}
          value={idea}
          onChange={(e) => setIdea(e.target.value.slice(0, LARGO_MAX_IDEA))}
          rows={2}
          maxLength={LARGO_MAX_IDEA}
          placeholder="Ej.: Pasteles para cumpleaños infantiles"
          className={`mt-2 w-full resize-none rounded-[var(--radius-chip)] border bg-sunken px-4 py-3 text-base text-ink-1 placeholder:text-ink-3 focus:border-gold focus:outline-none ${
            aviso && !valida ? 'sacudir border-warning' : 'border-[var(--line)]'
          }`}
        />
        <div className="mt-2 flex items-start justify-between gap-4">
          <p className="flex items-start gap-2 text-caption text-ink-2">
            <LockKeyhole size={16} className="mt-0.5 shrink-0 text-green" aria-hidden="true" />
            <span>
              <strong className="font-semibold text-ink-1">Tu idea es tuya.</strong> Solo tú la ves y no se usa para entrenar IA.
            </span>
          </p>
          <span className="text-caption tabular-nums text-ink-3" aria-hidden="true">
            {idea.length}/{LARGO_MAX_IDEA}
          </span>
        </div>
      </div>

      <BotonPrincipal
        onClick={() => {
          if (valida) {
            onSeguir(idea.replace(/\s+/g, ' ').trim());
            return;
          }
          // Botón vivo: si falta la idea, lleva al campo y lo señala.
          setAviso((n) => n + 1);
          vibrar(30);
          window.setTimeout(() => campo.current?.focus(), 0);
        }}
        nota={
          valida ? undefined : (
            <span className={aviso ? 'text-warning' : undefined}>Escribe al menos unas palabras o toca una sugerencia.</span>
          )
        }
      >
        Esta es mi idea
        <ArrowRight size={20} aria-hidden="true" />
      </BotonPrincipal>
    </div>
  );
}
