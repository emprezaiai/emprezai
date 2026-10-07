'use client';

// Transición entre pestañas de la app (baseline 5 de 22): un fundido corto, nunca bloqueante.
import { motion } from 'motion/react';

export default function TransicionPestanas({ children }: { children: React.ReactNode }) {
  return (
    <motion.div className="flex flex-1 flex-col" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2, ease: 'easeOut' }}>
      {children}
    </motion.div>
  );
}
