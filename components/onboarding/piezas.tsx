'use client';

// Piezas compartidas del recorrido de inicio y de la pantalla de planes (50 §A2-A4, C2).
// Consumen SOLO los tokens de app/globals.css y el material en relieve.

import type { ReactNode } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Check, ChevronLeft } from 'lucide-react';
import {
  Books,
  Brain,
  Briefcase,
  Bus,
  ChalkboardTeacher,
  Clock,
  Compass,
  GraduationCap,
  Handshake,
  Lightbulb,
  Moon,
  NoteBlank,
  Package,
  Signpost,
  SunHorizon,
  Target,
  type Icon,
} from '@phosphor-icons/react';
import type { Opcion } from '@/lib/onboarding';

export const EASE_SALIDA = [0.16, 1, 0.3, 1] as const;

const ICONOS: Record<Opcion<string>['icono'], Icon> = {
  Lightbulb,
  Target,
  Compass,
  NoteBlank,
  Clock,
  GraduationCap,
  Brain,
  Briefcase,
  Books,
  Package,
  Signpost,
  Handshake,
  ChalkboardTeacher,
  SunHorizon,
  Bus,
  Moon,
};

/** Vibración corta en Android (iOS la ignora). Nunca falla. */
export function vibrar(ms = 10): void {
  try {
    navigator.vibrate?.(ms);
  } catch {
    // Sin soporte de vibración: no pasa nada.
  }
}

/* ── Título con la palabra que vende en dorado ─────────────────────────────── */
export function TituloAcento({
  texto,
  acento,
  className = '',
  as: Etiqueta = 'h1',
}: {
  texto: string;
  acento: string;
  className?: string;
  as?: 'h1' | 'h2';
}) {
  const i = texto.indexOf(acento);
  const partes = i < 0 ? [texto, '', ''] : [texto.slice(0, i), acento, texto.slice(i + acento.length)];
  return (
    <Etiqueta className={`font-display font-extrabold tracking-[-0.02em] text-balance text-ink-1 ${className}`}>
      {partes[0]}
      {partes[1] && <span className="text-gold">{partes[1]}</span>}
      {partes[2]}
    </Etiqueta>
  );
}

/* ── Encabezado: atrás 44px + barra fina con % real que anima ──────────────── */
export function Encabezado({
  progreso,
  onAtras,
  atrasDeshabilitado = false,
}: {
  progreso: number;
  onAtras?: () => void;
  atrasDeshabilitado?: boolean;
}) {
  const reduce = useReducedMotion();
  const porcentaje = Math.round(progreso * 100);
  return (
    <header className="flex h-14 items-center gap-2 px-2">
      <button
        type="button"
        onClick={onAtras}
        disabled={atrasDeshabilitado || !onAtras}
        aria-label="Volver a la pregunta anterior"
        className="flex size-11 shrink-0 items-center justify-center rounded-full text-ink-2 transition-colors duration-150 hover:bg-raised active:scale-95 disabled:invisible"
      >
        <ChevronLeft size={24} aria-hidden="true" />
      </button>
      <div
        role="progressbar"
        aria-label="Avance del recorrido"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={porcentaje}
        className="h-0.75 flex-1 overflow-hidden rounded-full bg-[color-mix(in_oklab,var(--ink-1)_12%,transparent)]"
      >
        <motion.div
          className="h-full origin-left rounded-full bg-gradient-to-r from-gold to-gold-light"
          initial={false}
          animate={{ scaleX: progreso }}
          transition={{ duration: reduce ? 0 : 0.3, ease: EASE_SALIDA }}
        />
      </div>
      <span className="w-12 pr-2 text-right text-xs font-semibold tabular-nums text-ink-3">{porcentaje}%</span>
    </header>
  );
}

/* ── Ficha de ícono en relieve (Phosphor duotone, el peso del onboarding — 22) ── */
export function FichaIcono({
  icono,
  tono = 'piedra',
  tamano = 40,
}: {
  icono: Opcion<string>['icono'];
  tono?: 'piedra' | 'oro' | 'verde';
  tamano?: 40 | 48 | 64;
}) {
  const Icono = ICONOS[icono];
  return (
    <span
      aria-hidden="true"
      className={`relieve-${tono} inline-flex shrink-0 items-center justify-center rounded-[var(--radius-chip)] transition-colors duration-200`}
      style={{ width: tamano, height: tamano }}
    >
      <Icono size={Math.round(tamano * 0.55)} weight="duotone" />
    </span>
  );
}

/* ── Check custom (círculo + check SVG; jamás el ✓ del sistema) ─────────────── */
export function CheckCustom({ tono = 'oro', tamano = 20 }: { tono?: 'oro' | 'verde'; tamano?: 20 | 24 }) {
  return (
    <span
      aria-hidden="true"
      className={`inline-flex shrink-0 items-center justify-center rounded-full ${
        tono === 'oro'
          ? 'bg-[color-mix(in_oklab,var(--gold)_16%,transparent)] text-gold'
          : 'bg-[color-mix(in_oklab,var(--green)_16%,transparent)] text-green'
      }`}
      style={{ width: tamano, height: tamano }}
    >
      <Check size={Math.round(tamano * 0.62)} strokeWidth={3} />
    </span>
  );
}

/* ── Opción de respuesta (56-64px, ícono en relieve, check que entra con resorte) ── */
export function OpcionRespuesta({
  opcion,
  elegida,
  bloqueada,
  onElegir,
  indice,
}: {
  opcion: Opcion<string>;
  elegida: boolean;
  bloqueada: boolean;
  onElegir: () => void;
  indice: number;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.button
      type="button"
      role="radio"
      aria-checked={elegida}
      disabled={bloqueada && !elegida}
      onClick={onElegir}
      initial={{ opacity: 0, y: reduce ? 0 : 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: reduce ? 0 : 0.08 + indice * 0.055, ease: EASE_SALIDA }}
      whileTap={{ scale: 0.98 }}
      className="opcion-recorrido flex min-h-16 w-full items-center gap-3 rounded-[var(--radius-card)] px-3 py-3 text-left disabled:opacity-100"
    >
      <FichaIcono icono={opcion.icono} tono={elegida ? 'oro' : 'piedra'} />
      <span className="flex-1 text-base leading-snug font-medium text-ink-1">{opcion.texto}</span>
      <span className="flex size-6 shrink-0 items-center justify-center">
        {elegida && (
          <motion.span
            initial={{ scale: reduce ? 1 : 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', bounce: 0.4, duration: 0.3 }}
          >
            <CheckCustom tamano={24} />
          </motion.span>
        )}
      </span>
    </motion.button>
  );
}

/* ── Botón principal dorado, fijo abajo con safe-area ──────────────────────── */
export function BotonPrincipal({
  children,
  onClick,
  deshabilitado = false,
  nota,
}: {
  children: ReactNode;
  onClick: () => void;
  deshabilitado?: boolean;
  nota?: ReactNode;
}) {
  return (
    <div className="barra-inferior sticky bottom-0 z-10 mt-auto px-4 pt-6">
      <motion.button
        type="button"
        onClick={onClick}
        disabled={deshabilitado}
        whileTap={deshabilitado ? undefined : { scale: 0.98 }}
        className="boton-oro flex h-14 w-full items-center justify-center gap-2 rounded-[var(--radius-pill)] px-6 font-display text-boton font-bold"
      >
        {children}
      </motion.button>
      {nota && <p className="mt-2 text-center text-caption text-ink-3">{nota}</p>}
    </div>
  );
}

/* ── Lo que se lleva al terminar (pie de la primera pregunta) ─────────────── */
export function PromesaRecorrido() {
  const reduce = useReducedMotion();
  const items = [
    { titulo: '2 minutos', texto: '5 preguntas rápidas' },
    { titulo: 'Tu pieza 1', texto: 'tu propuesta de valor' },
    { titulo: 'Gratis', texto: 'sin crear cuenta' },
  ];
  return (
    <motion.div
      initial={{ opacity: 0, y: reduce ? 0 : 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: reduce ? 0 : 0.35, ease: EASE_SALIDA }}
      className="tarjeta-relieve-base rounded-[var(--radius-card)] p-4"
    >
      <p className="text-xs font-semibold tracking-[0.08em] text-gold uppercase">Al terminar te llevas</p>
      <ul className="mt-3 grid grid-cols-3 gap-2">
        {items.map((it) => (
          <li key={it.titulo} className="flex flex-col gap-1">
            <CheckCustom tono="verde" />
            <span className="font-display text-sm font-bold text-ink-1">{it.titulo}</span>
            <span className="text-xs leading-snug text-ink-2">{it.texto}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}
