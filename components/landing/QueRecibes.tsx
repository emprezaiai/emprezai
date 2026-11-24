// Justo debajo de la portada: qué es EMPREZAI y qué recibe la persona, en 4 datos claros.
import { FraseOferta } from './FraseOferta';
import { CalendarRange, Clock, Gift, Sparkles } from 'lucide-react';

const DATOS = [
  { icono: CalendarRange, titulo: 'Una ruta de 30 días', detalle: 'Te guía paso a paso, desde tu idea hasta tu negocio armado.' },
  { icono: Clock, titulo: '5 minutos al día', detalle: 'Una misión corta desde el celular. Sin cursos largos.' },
  { icono: Sparkles, titulo: 'La IA arma tus piezas', detalle: 'Tu oferta, tu nombre y tus textos se crean dentro de la app: no copias nada.' },
  { icono: Gift, titulo: 'Pruébala sin riesgo', detalle: <FraseOferta alinear="izquierda" /> },
];

export function QueRecibes() {
  return (
    <section aria-labelledby="que-recibes" className="border-y border-[var(--line)] bg-[color-mix(in_oklab,var(--ink-1)_4%,transparent)] px-4 py-12">
      <div className="mx-auto max-w-[620px]">
        <h2 id="que-recibes" className="text-balance text-center font-display text-pregunta font-bold text-ink-1">
          Qué es EMPREZAI y qué recibes
        </h2>
        <ul className="mt-8 flex flex-col gap-4">
          {DATOS.map(({ icono: Icono, titulo, detalle }) => (
            <li key={titulo} className="flex items-start gap-4">
              <span aria-hidden="true" className="flex size-12 shrink-0 items-center justify-center rounded-[var(--radius-chip)] bg-[color-mix(in_oklab,var(--portada-verde)_14%,transparent)] text-[var(--portada-verde)]">
                <Icono size={24} strokeWidth={2.2} />
              </span>
              <div>
                <p className="font-display text-base font-bold text-ink-1">{titulo}</p>
                <p className="mt-1 text-caption text-ink-2">{detalle}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
