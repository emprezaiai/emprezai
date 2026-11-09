'use client';

// Copia un texto (por ejemplo, el detalle técnico de un error para pasárselo a quien lo arregla).

import { useState } from 'react';
import { Check, Copy } from 'lucide-react';

export function BotonCopiar({ texto, etiqueta = 'Copiar' }: { texto: string; etiqueta?: string }) {
  const [copiado, setCopiado] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(texto);
          setCopiado(true);
          window.setTimeout(() => setCopiado(false), 2000);
        } catch {
          setCopiado(false);
        }
      }}
      className="inline-flex min-h-11 items-center gap-1 text-caption font-semibold text-ink-1 transition-transform duration-100 active:scale-[0.98]"
    >
      {copiado ? <Check size={14} aria-hidden="true" /> : <Copy size={14} aria-hidden="true" />}
      <span aria-live="polite">{copiado ? 'Copiado' : etiqueta}</span>
    </button>
  );
}
