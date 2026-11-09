'use client';

// Si una sección del panel no carga: qué pasó, qué hacer y reintentar (nunca la pantalla genérica).

import { useEffect } from 'react';
import { RotateCcw } from 'lucide-react';

export default function ErrorPanel({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    const mensaje = `Panel · ${error.name}: ${error.message}`.slice(0, 160) + (error.digest ? ` · ${error.digest}` : '');
    void fetch('/api/errores', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mensaje, ruta: window.location.pathname }),
      keepalive: true,
    }).catch(() => {});
  }, [error]);

  return (
    <div role="alert" className="tarjeta-relieve rounded-[var(--radius-card)] p-6 text-center">
      <h1 className="font-display text-2xl font-extrabold text-ink-1">No pudimos cargar esta sección</h1>
      <p className="mx-auto mt-2 max-w-sm text-ayuda text-ink-2">
        Puede ser un corte de conexión con la base de datos. Tus datos están a salvo: vuelve a intentarlo en un momento.
      </p>
      <button
        type="button"
        onClick={reset}
        className="boton-oro mx-auto mt-6 flex h-12 items-center gap-2 rounded-[var(--radius-pill)] px-6 font-display text-base font-bold"
      >
        <RotateCcw size={18} aria-hidden="true" />
        Reintentar
      </button>
      <p className="mt-3 text-caption text-ink-3">Si se repite, quedó registrado en Salud.</p>
    </div>
  );
}
