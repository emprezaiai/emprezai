// Piezas del panel de la dueña (17-VISUALIZACION-DATOS): un dato héroe por tarjeta, label claro y el
// insight en palabras. Si no hay dato, "Sin datos" con el porqué — nunca un cero inventado.

import Link from 'next/link';
import { ArrowRight, CircleAlert, CircleCheck, Info, TriangleAlert } from 'lucide-react';
import type { Aviso } from '@/lib/servidor/panel';

export function Encabezado({ titulo, periodo, children }: { titulo: string; periodo?: string; children?: React.ReactNode }) {
  return (
    <div className="mb-6">
      {periodo && <p className="text-xs font-semibold tracking-[0.08em] text-ink-3 uppercase">{periodo}</p>}
      <h1 className="mt-1 font-display text-pregunta font-extrabold text-ink-1">{titulo}</h1>
      {children && <div className="mt-2 text-ayuda text-ink-2">{children}</div>}
    </div>
  );
}

export function Tarjeta({ children, className = '', destacada = false, id }: { children: React.ReactNode; className?: string; destacada?: boolean; id?: string }) {
  return (
    <section id={id} className={`${destacada ? 'hairline-oro relieve-tarjeta' : 'tarjeta-relieve'} rounded-[var(--radius-card)] p-4 ${className}`}>{children}</section>
  );
}

export function TituloTarjeta({ children, ayuda }: { children: React.ReactNode; ayuda?: string }) {
  return (
    <div className="mb-3">
      <h2 className="font-display text-base font-bold text-ink-1">{children}</h2>
      {ayuda && <p className="mt-1 text-caption text-ink-3">{ayuda}</p>}
    </div>
  );
}

/** El "no hay dato todavía", con el porqué en una línea. */
export function SinDatos({ porque }: { porque: string }) {
  return (
    <div className="flex items-start gap-2 rounded-[var(--radius-chip)] bg-sunken p-3">
      <Info size={16} className="mt-0.5 shrink-0 text-ink-3" aria-hidden="true" />
      <p className="text-caption text-ink-2">
        <strong className="font-semibold text-ink-1">Sin datos.</strong> {porque}
      </p>
    </div>
  );
}

type Tono = 'neutro' | 'bien' | 'mal' | 'oro';
const COLOR_TONO: Record<Tono, string> = {
  neutro: 'text-ink-1',
  bien: 'text-green',
  mal: 'text-danger',
  oro: 'text-gold',
};

/** Un número que se entiende de un vistazo: etiqueta arriba, dato grande, explicación abajo. */
export function Dato({
  etiqueta,
  valor,
  detalle,
  tono = 'neutro',
  estimado = false,
}: {
  etiqueta: string;
  valor: string | null;
  detalle?: React.ReactNode;
  tono?: Tono;
  estimado?: boolean;
}) {
  return (
    <div className="flex min-w-0 flex-col">
      <p className="text-caption font-semibold text-ink-2">{etiqueta}</p>
      {valor === null ? (
        <p className="mt-1 font-display text-precio font-extrabold text-ink-3">Sin datos</p>
      ) : (
        <p className={`mt-1 font-display text-precio font-extrabold tabular-nums ${COLOR_TONO[tono]}`}>
          {valor}
          {estimado && <span className="ml-1 align-middle text-xs font-semibold text-ink-3">estimado</span>}
        </p>
      )}
      {detalle && <div className="mt-1 text-caption text-ink-2">{detalle}</div>}
    </div>
  );
}

export function Variacion({ cambio, contra }: { cambio: { texto: string; sube: boolean } | null; contra: string }) {
  if (!cambio) return <span className="text-ink-3">Sin mes anterior para comparar</span>;
  return (
    <span>
      <span className={`font-semibold ${cambio.sube ? 'text-green' : 'text-danger'}`}>{cambio.texto}</span> vs {contra}
    </span>
  );
}

/** Banner de avisos (21): qué pasó → por qué importa → qué hacer. Si no hay, lo dice. */
export function BannerAvisos({ avisos, periodo }: { avisos: Aviso[]; periodo: string }) {
  if (avisos.length === 0) {
    return (
      <div role="status" className="mb-6 flex items-center gap-3 rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--green)_35%,transparent)] bg-[color-mix(in_oklab,var(--green)_8%,transparent)] p-4">
        <CircleCheck size={22} className="shrink-0 text-green" aria-hidden="true" />
        <p className="text-ayuda text-ink-1">
          <strong className="font-semibold">Todo en orden en {periodo}.</strong> No hay nada que necesite tu atención.
        </p>
      </div>
    );
  }
  return (
    <section aria-label="Avisos" className="mb-6 flex flex-col gap-3">
      {avisos.map((a) => {
        const alta = a.gravedad === 'alta';
        const Icono = alta ? CircleAlert : TriangleAlert;
        return (
          <article
            key={a.id}
            className={`rounded-[var(--radius-card)] border p-4 ${
              alta
                ? 'border-[color-mix(in_oklab,var(--danger)_45%,transparent)] bg-[color-mix(in_oklab,var(--danger)_8%,transparent)]'
                : 'border-[color-mix(in_oklab,var(--warning)_45%,transparent)] bg-[color-mix(in_oklab,var(--warning)_8%,transparent)]'
            }`}
          >
            <div className="flex items-start gap-3">
              <Icono size={20} className={`mt-0.5 shrink-0 ${alta ? 'text-danger' : 'text-warning'}`} aria-hidden="true" />
              <div className="min-w-0">
                <h2 className="font-display text-base font-bold text-ink-1">{a.titulo}</h2>
                <p className="mt-1 text-caption text-ink-2">
                  <strong className="font-semibold text-ink-1">Por qué importa:</strong> {a.porque}
                </p>
                <p className="mt-1 text-caption text-ink-2">
                  <strong className="font-semibold text-ink-1">Qué hacer:</strong> {a.queHacer}
                </p>
                {a.enlace && (
                  <Link href={a.enlace.href} className="mt-1 inline-flex min-h-11 items-center gap-1 text-caption font-semibold text-ink-1 underline underline-offset-4">
                    {a.enlace.texto}
                    <ArrowRight size={14} aria-hidden="true" />
                  </Link>
                )}
              </div>
            </div>
          </article>
        );
      })}
    </section>
  );
}

/** Fila "concepto · monto" de la cascada de ganancia. */
export function FilaMonto({ concepto, monto, nota, total = false }: { concepto: string; monto: string; nota?: string; total?: boolean }) {
  return (
    <div className={`flex items-baseline justify-between gap-4 py-2 ${total ? 'border-t border-[var(--line)] pt-3' : ''}`}>
      <span className="min-w-0">
        <span className={total ? 'font-display text-base font-bold text-ink-1' : 'text-ayuda text-ink-1'}>{concepto}</span>
        {nota && <span className="block text-caption text-ink-3">{nota}</span>}
      </span>
      <span className={`shrink-0 tabular-nums ${total ? 'font-display text-base font-extrabold text-gold' : 'text-ayuda text-ink-2'}`}>{monto}</span>
    </div>
  );
}
