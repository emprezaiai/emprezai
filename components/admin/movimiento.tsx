'use client';

// Movimiento del panel (22/41): entrada escalonada de los bloques, conteo del número principal y
// nada de eso si la persona pidió menos movimiento.

import { useEffect, useRef } from 'react';
import { animate, motion, useReducedMotion } from 'motion/react';

/** Cada bloque entra 60 ms después del anterior. */
export function Entrada({ indice = 0, children, className }: { indice?: number; children: React.ReactNode; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: reduce ? 0 : 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduce ? 0 : 0.35, delay: reduce ? 0 : indice * 0.06, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

export type Formato = 'dinero' | 'entero' | 'pct';

function formatear(n: number, formato: Formato, decimales: number) {
  const signo = n < 0 ? '−' : '';
  const abs = Math.abs(n).toLocaleString('es', { minimumFractionDigits: decimales, maximumFractionDigits: decimales });
  if (formato === 'dinero') return `${signo}$${abs}`;
  if (formato === 'pct') return `${signo}${abs}%`;
  return `${signo}${abs}`;
}

/** El número héroe cuenta desde 0 hasta su valor (baseline 2 del SO); quieto con menos movimiento. */
export function Cuenta({ valor, formato = 'entero', decimales = 0 }: { valor: number; formato?: Formato; decimales?: number }) {
  const reduce = useReducedMotion();
  const nodo = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const pintar = (v: number) => {
      if (nodo.current) nodo.current.textContent = formatear(v, formato, decimales);
    };
    if (reduce) {
      pintar(valor);
      return;
    }
    const control = animate(0, valor, { duration: 0.7, ease: 'easeOut', onUpdate: pintar });
    return () => control.stop();
  }, [valor, formato, decimales, reduce]);
  return (
    <span ref={nodo} className="tabular-nums">
      {formatear(valor, formato, decimales)}
    </span>
  );
}
