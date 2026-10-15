'use client';

// FICHA VIVA (pedido de la dueña 2026-10-15): la ficha de ícono en relieve con más volumen
// (brillo arriba + canto de 3px, clase .ficha-3d) y un GESTO propio por ícono que cuenta lo
// que significa — la llama titila, la pieza encaja, el calendario sella el día, el rayo da su
// sacudida, el dolor "se enciende" en la noche. El gesto se hace UNA vez por visita a la app (volver
// a Hoy desde la barra no lo repite: la pantalla más vista se queda quieta). Con movimiento reducido:
// quieta siempre.

import { useEffect, useState } from 'react';
import { motion, useReducedMotion, type TargetAndTransition } from 'motion/react';
import type { LucideIcon } from 'lucide-react';

export type Gesto = 'llama' | 'encaje' | 'calendario' | 'globo' | 'rayo' | 'encender';

const GESTOS: Record<Gesto, { desde: TargetAndTransition; hacia: TargetAndTransition }> = {
  // La racha está viva: la llama titila desde su base un par de veces y se queda quieta.
  llama: {
    desde: { scaleY: 1, rotate: 0 },
    hacia: {
      scaleY: [1, 1.1, 0.96, 1.06, 1],
      rotate: [0, -4, 3, -2, 0],
      transition: { duration: 1.6, ease: 'linear', repeat: 1, delay: 1 },
    },
  },
  // La pieza llega de costado y encaja con un pequeño rebote.
  encaje: {
    desde: { x: 9, rotate: 18, opacity: 0 },
    hacia: { x: [9, -2, 0], rotate: [18, -5, 0], opacity: 1, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } },
  },
  // El calendario SELLA el día: baja como un sello y rebota (solo si la semana ya tiene piezas).
  calendario: {
    desde: { scale: 1, y: 0 },
    hacia: { scale: [1, 1.18, 0.94, 1], y: [0, -3, 1, 0], transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
  },
  // El globo de la idea sube y vuelve, como un mensaje que acaba de llegar.
  globo: {
    desde: { y: 6, scale: 0.8, opacity: 0 },
    hacia: { y: [6, -4, 0], scale: [0.8, 1.08, 1], opacity: 1, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
  },
  // El rayo de la misión: sacudida corta con un destello.
  rayo: {
    desde: { rotate: 0, scale: 1 },
    hacia: { rotate: [0, -14, 11, -5, 0], scale: [1, 1.18, 1], transition: { duration: 0.55, ease: 'easeOut' } },
  },
  // El dolor de la noche: el ícono pasa de apagado a encendido en dorado, con un halo que se asienta.
  encender: {
    desde: { opacity: 0.3, filter: 'drop-shadow(0 0 0 rgb(255 194 61 / 0))' },
    hacia: {
      opacity: [0.3, 1, 1],
      filter: [
        'drop-shadow(0 0 0 rgb(255 194 61 / 0))',
        'drop-shadow(0 0 7px rgb(255 194 61 / 0.95))',
        'drop-shadow(0 0 3px rgb(255 194 61 / 0.45))',
      ],
      transition: { duration: 0.9, ease: 'easeOut' },
    },
  },
};

// Gestos ya hechos en esta visita (la app es una sola página: volver a Hoy no vuelve a montarlos).
const hechos = new Set<string>();

export function FichaViva({
  icon: Icono,
  gesto,
  className,
  tamanoIcono = 22,
  grosor = 2.2,
  relleno = false,
  activo = true,
  enVista = false,
  retraso = 0,
  clave,
}: {
  icon: LucideIcon;
  gesto: Gesto;
  /** Material (relieve-oro / -verde / -piedra / -noche…), tamaño y radio de la ficha. */
  className: string;
  tamanoIcono?: number;
  grosor?: number;
  relleno?: boolean;
  /** false = la ficha queda quieta (p. ej. racha en cero). */
  activo?: boolean;
  /** true = el gesto se hace al entrar en pantalla (página de ventas); false = al montarse. */
  enVista?: boolean;
  retraso?: number;
  /** Si se da, el gesto se hace una sola vez por visita (para pantallas que se abren muchas veces). */
  clave?: string;
}) {
  const reduce = useReducedMotion();
  const g = GESTOS[gesto];
  const [repetido] = useState(() => Boolean(clave && hechos.has(clave)));
  useEffect(() => {
    if (clave && activo) hechos.add(clave);
  }, [clave, activo]);
  const mover = activo && !reduce && !repetido;
  const hacia: TargetAndTransition = mover
    ? { ...g.hacia, transition: { ...(g.hacia.transition ?? {}), delay: ((g.hacia.transition?.delay as number) ?? 0) + retraso } }
    : { opacity: 1 };
  const disparo = enVista
    ? { initial: mover ? g.desde : false, whileInView: hacia, viewport: { once: true, amount: 0.6 } }
    : { initial: mover ? g.desde : false, animate: hacia };

  return (
    <span aria-hidden="true" className={`ficha-3d inline-flex shrink-0 items-center justify-center ${className}`}>
      <motion.span className={`flex ${gesto === 'llama' ? 'origin-bottom' : ''}`} {...disparo}>
        <Icono size={tamanoIcono} strokeWidth={grosor} fill={relleno ? 'currentColor' : 'none'} />
      </motion.span>
    </span>
  );
}
