// Mini demo estático: cómo se ve una misión de 5 minutos resuelta por la IA (ejemplo rotulado como tal).
import { Check, Clock, Sparkles } from 'lucide-react';

export function DemoMision() {
  return (
    <section aria-labelledby="demo-mision" className="px-4 py-12">
      <div className="mx-auto max-w-[620px]">
        <h2 id="demo-mision" className="text-balance text-center font-display text-pregunta font-bold text-ink-1">
          Así se ve una misión de 5 minutos
        </h2>
        <p className="mt-2 text-center text-caption text-ink-2">Ejemplo con un negocio inventado. En la app, la IA usa tus respuestas.</p>

        <div className="mt-8 rounded-[var(--radius-card)] border border-[var(--portada-borde)] bg-[var(--surface)] p-4 shadow-[var(--shadow-2)]">
          <div className="flex items-center justify-between text-xs font-semibold tracking-[0.08em] text-ink-2 uppercase">
            <span>Tu misión de hoy</span>
            <span className="inline-flex items-center gap-1 text-ink-1">
              <Clock size={16} aria-hidden="true" />5 min
            </span>
          </div>
          <p className="mt-3 font-display text-base font-bold text-ink-1">¿Qué problema resuelves y para quién?</p>
          <p className="mt-3 flex items-start gap-2 text-base text-ink-2">
            <Check size={16} className="mt-1 shrink-0 text-[var(--portada-verde)]" aria-hidden="true" />
            <span>
              Tu respuesta: <strong className="font-semibold text-ink-1">«Ayudo a mamás ocupadas a preparar comida sana en 20 minutos.»</strong>
            </span>
          </p>

          <div className="mt-4 border-t border-[var(--portada-borde)] pt-4">
            <p className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.08em] text-[var(--portada-amarillo)] uppercase">
              <Sparkles size={16} aria-hidden="true" />
              La IA armó tu propuesta de valor
            </p>
            <p className="mt-2 text-base leading-relaxed text-ink-1">
              «Comida sana para mamás con poco tiempo: <strong className="font-bold">menús listos en 20 minutos</strong>, sin pensar qué cocinar cada noche.»
            </p>
            <p className="mt-3 inline-flex items-center gap-2 text-caption font-semibold text-ink-2">
              <Check size={16} className="text-[var(--portada-verde)]" aria-hidden="true" />
              Guardada en Mi Empresa, lista para usar
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
