'use client';

// Si algo falla dentro de la app (por ejemplo, el almacenamiento del celular), nunca pantalla en
// blanco: se explica qué pasó y se ofrece reintentar. Las piezas guardadas no se tocan.

import Link from 'next/link';
import { RotateCcw } from 'lucide-react';
import { RESPONSABLE } from '@/lib/legal';

export default function ErrorApp({ reset }: { error: Error; reset: () => void }) {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-4 py-16 text-center">
      <h1 className="font-display text-2xl font-extrabold text-ink-1">Algo no cargó bien</h1>
      <p className="mt-2 max-w-sm text-ayuda text-ink-2">Tus piezas siguen guardadas. Vuelve a intentarlo; si se repite, escríbenos.</p>
      <button
        type="button"
        onClick={reset}
        className="boton-oro mt-6 flex h-14 items-center gap-2 rounded-[var(--radius-pill)] px-8 font-display text-boton font-bold"
      >
        <RotateCcw size={20} aria-hidden="true" />
        Reintentar
      </button>
      <a
        href={`mailto:${RESPONSABLE.emailContacto}?subject=${encodeURIComponent('Algo no cargó en EMPRESAI')}`}
        className="mt-2 flex min-h-11 items-center text-sm font-semibold text-ink-1 underline underline-offset-4"
      >
        Escribir a soporte
      </a>
      <Link href="/" className="flex min-h-11 items-center text-sm font-semibold text-ink-2">
        Ir al inicio
      </Link>
    </main>
  );
}
