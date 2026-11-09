'use client';

// Atajo de teclado del selector de mes: ← mes anterior, → mes siguiente (no actúa mientras se escribe).

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function AtajoMes({ anterior, siguiente }: { anterior: string; siguiente: string | null }) {
  const router = useRouter();
  useEffect(() => {
    const alPresionar = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (e.altKey || e.ctrlKey || e.metaKey || (t && (t.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(t.tagName)))) return;
      if (e.key === 'ArrowLeft') router.push(anterior);
      else if (e.key === 'ArrowRight' && siguiente) router.push(siguiente);
    };
    window.addEventListener('keydown', alPresionar);
    return () => window.removeEventListener('keydown', alPresionar);
  }, [router, anterior, siguiente]);
  return null;
}
