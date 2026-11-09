// Piezas del panel de la dueña (17-VISUALIZACION-DATOS): un dato héroe por tarjeta, label claro y el
// insight en palabras. Si no hay dato, "Sin datos" con el porqué — nunca un cero inventado.
// Dorado SOLO en el dato principal y el botón principal (FICHA-ARTE); verde = bien, rojo = mal.

import Link from 'next/link';
import { ArrowRight, ChevronLeft, ChevronRight, CircleAlert, CircleCheck, Info, TriangleAlert } from 'lucide-react';
import type { Aviso, PeriodoElegido } from '@/lib/servidor/panel';
import { Cuenta, Entrada, Llenado, type Formato } from './movimiento';
import { FlechaMes } from './ChipFiltro';
import { AtajoMes } from './AtajoMes';

/** Respuesta al tocar de todo lo tocable del panel (tap < 150 ms). */
export const TOCABLE = 'transition-transform duration-100 active:scale-[0.98]';

export function Encabezado({ titulo, periodo, children }: { titulo: string; periodo?: React.ReactNode; children?: React.ReactNode }) {
  return (
    <Entrada className="mb-6">
      <span aria-hidden="true" className="rayo-marca mb-3" />
      {periodo && <div className="text-xs font-semibold tracking-[0.08em] text-ink-3 uppercase">{periodo}</div>}
      <h1 className="mt-1 font-display text-pregunta font-extrabold text-ink-1">{titulo}</h1>
      {children && <div className="mt-2 text-ayuda text-ink-2">{children}</div>}
    </Entrada>
  );
}

/** ← mes anterior · mes · mes siguiente → (regla UX 13: vista con fechas reales y navegación). */
export function SelectorMes({ periodo, ruta }: { periodo: PeriodoElegido; ruta: string }) {
  return (
    <nav aria-label="Cambiar de mes (también con las flechas ← → del teclado)" className="mb-6 flex items-center gap-2">
      <AtajoMes anterior={`${ruta}?mes=${periodo.anterior}`} siguiente={periodo.siguiente ? (periodo.esActual ? ruta : `${ruta}?mes=${periodo.siguiente}`) : null} />
      <FlechaMes href={`${ruta}?mes=${periodo.anterior}`} etiqueta="Mes anterior">
        <ChevronLeft size={18} aria-hidden="true" />
      </FlechaMes>
      <span className="min-w-0 flex-1 text-center text-ayuda font-semibold text-ink-1 first-letter:uppercase">
        {periodo.etiqueta}
        {periodo.diaDeHoy && <span className="block text-xs font-normal text-ink-3">va en el día {periodo.diaDeHoy}</span>}
      </span>
      <span className="sr-only lg:not-sr-only lg:order-last lg:text-xs lg:text-ink-3">← → del teclado</span>
      {periodo.siguiente ? (
        <FlechaMes href={periodo.esActual ? ruta : `${ruta}?mes=${periodo.siguiente}`} etiqueta="Mes siguiente">
          <ChevronRight size={18} aria-hidden="true" />
        </FlechaMes>
      ) : (
        <span aria-hidden="true" className="flex size-11 items-center justify-center rounded-full border border-[var(--line)] text-ink-3 opacity-40">
          <ChevronRight size={18} />
        </span>
      )}
    </nav>
  );
}

export function Tarjeta({
  children,
  className = '',
  destacada = false,
  id,
  indice = 0,
  href,
}: {
  children: React.ReactNode;
  className?: string;
  destacada?: boolean;
  id?: string;
  indice?: number;
  /** Si la tarjeta lleva a otra sección: toda ella es tocable y muestra la flecha. */
  href?: string;
}) {
  const clase = `${destacada ? 'hairline-oro relieve-tarjeta' : 'tarjeta-relieve'} h-full rounded-[var(--radius-card)] p-4`;
  return (
    <Entrada indice={indice} className={className}>
      {href ? (
        <Link href={href} className={`${clase} ${TOCABLE} group relative block hover:bg-raised`}>
          <ChevronRight size={16} className="absolute right-3 bottom-4 text-ink-3 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
          {children}
        </Link>
      ) : (
        <section id={id} className={clase}>
          {children}
        </section>
      )}
    </Entrada>
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

/** Una lectura en palabras, para que el número diga qué hacer. */
export function Lectura({ children, tono = 'neutro' }: { children: React.ReactNode; tono?: 'neutro' | 'bien' | 'mal' }) {
  const Icono = tono === 'bien' ? CircleCheck : tono === 'mal' ? TriangleAlert : Info;
  const color = tono === 'bien' ? 'text-green' : tono === 'mal' ? 'text-warning' : 'text-ink-3';
  return (
    <p className="mt-3 flex items-start gap-2 text-caption text-ink-2">
      <Icono size={16} className={`mt-0.5 shrink-0 ${color}`} aria-hidden="true" />
      <span>{children}</span>
    </p>
  );
}

type Tono = 'neutro' | 'bien' | 'mal' | 'oro';
const COLOR_TONO: Record<Tono, string> = {
  neutro: 'text-ink-1',
  bien: 'text-green',
  mal: 'text-danger',
  oro: 'text-gold',
};

/** Un número que se entiende de un vistazo: etiqueta arriba, dato grande (que cuenta), explicación abajo. */
export function Dato({
  etiqueta,
  valor,
  numero,
  formato = 'entero',
  decimales = 0,
  detalle,
  tono = 'neutro',
  estimado = false,
  reservar = false,
}: {
  etiqueta: string;
  /** Texto ya formateado (para valores que no son un número, como una fecha). */
  valor?: string | null;
  /** Número que se anima de 0 a su valor; null = "Sin datos". */
  numero?: number | null;
  formato?: Formato;
  decimales?: number;
  detalle?: React.ReactNode;
  tono?: Tono;
  estimado?: boolean;
  /** Reserva 2 líneas para la etiqueta (alinea los números en cuadrículas de 2 columnas). */
  reservar?: boolean;
}) {
  const sinDato = numero === null || (numero === undefined && (valor === null || valor === undefined));
  return (
    <div className="flex min-w-0 flex-col">
      <p className={`line-clamp-2 text-caption font-semibold text-ink-2 ${reservar ? 'min-h-[2lh]' : ''}`}>{etiqueta}</p>
      {sinDato ? (
        <p className="mt-1 font-display text-precio font-extrabold text-ink-3">Sin datos</p>
      ) : (
        <p className={`mt-1 font-display text-precio font-extrabold whitespace-nowrap tabular-nums ${COLOR_TONO[tono]}`}>
          {numero !== undefined && numero !== null ? <Cuenta valor={numero} formato={formato} decimales={decimales} /> : valor}
          {estimado && <span className="ml-1 align-middle text-xs font-semibold text-ink-3">estimado</span>}
        </p>
      )}
      {detalle && <div className="mt-1 text-caption text-ink-2">{detalle}</div>}
    </div>
  );
}

export function Variacion({ cambio, contra }: { cambio: { texto: string; sube: boolean | null } | null; contra: string }) {
  if (!cambio) return <span className="text-ink-3">sin datos de {contra} para comparar</span>;
  if (cambio.sube === null) return <span className="text-ink-3">igual que {contra}</span>;
  return (
    <span>
      <span className={`font-semibold whitespace-nowrap ${cambio.sube ? 'text-green' : 'text-danger'}`}>{cambio.texto}</span> vs {contra}
    </span>
  );
}

/** Banner de avisos (21): qué pasó → por qué importa → qué hacer. Si no hay, lo dice. */
export function BannerAvisos({ avisos, periodo }: { avisos: Aviso[]; periodo: string }) {
  if (avisos.length === 0) {
    return (
      <Entrada indice={1} className="mb-6">
        <div role="status" className="flex items-center gap-3 rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--green)_35%,transparent)] bg-[color-mix(in_oklab,var(--green)_8%,transparent)] p-4">
          <CircleCheck size={22} className="shrink-0 text-green" aria-hidden="true" />
          <p className="text-ayuda text-ink-1">
            <strong className="font-semibold">Todo en orden en {periodo}.</strong> No hay nada que necesite tu atención.
          </p>
        </div>
      </Entrada>
    );
  }
  const tarjeta = (a: Aviso, i: number) => {
        const alta = a.gravedad === 'alta';
        const Icono = alta ? CircleAlert : TriangleAlert;
        return (
          <Entrada key={a.id} indice={i + 1}>
            <article
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
                  <p className="mt-1 text-caption text-ink-2">{a.queHacer}</p>
                  {/* Enlace y "Por qué importa" en la misma fila; el porqué ocupa la fila entera al abrirse. */}
                  <div className="flex flex-wrap items-center gap-x-5">
                    {a.enlace && (
                      <Link href={a.enlace.href} className={`${TOCABLE} inline-flex min-h-11 items-center gap-1 text-caption font-semibold text-ink-1 underline underline-offset-4`}>
                        {a.enlace.texto}
                        <ArrowRight size={14} aria-hidden="true" />
                      </Link>
                    )}
                    <details className="group/porque panel-plegable open:basis-full">
                      <summary className="flex min-h-11 cursor-pointer list-none items-center gap-1 text-caption text-ink-3 [&::-webkit-details-marker]:hidden">
                        <ChevronRight size={14} className="transition-transform group-open/porque:rotate-90" aria-hidden="true" />
                        Por qué importa
                      </summary>
                      <p className="pb-1 text-caption text-ink-2">{a.porque}</p>
                    </details>
                  </div>
                </div>
              </div>
            </article>
          </Entrada>
        );
  };
  const primeros = avisos.slice(0, 1);
  const resto = avisos.slice(1);
  return (
    <section aria-label="Avisos" className="mb-6 flex flex-col gap-3">
      {primeros.map(tarjeta)}
      {resto.length > 0 && (
        <details className="group panel-plegable">
          <summary className={`${TOCABLE} flex min-h-11 cursor-pointer list-none items-center gap-1 text-caption font-semibold text-ink-1 underline underline-offset-4 [&::-webkit-details-marker]:hidden`}>
            <ChevronRight size={14} className="transition-transform group-open:rotate-90" aria-hidden="true" />
            Ver {resto.length === 1 ? '1 aviso más' : `${resto.length} avisos más`}
          </summary>
          <div className="mt-3 flex flex-col gap-3">{resto.map((a, i) => tarjeta(a, i + 2))}</div>
        </details>
      )}
    </section>
  );
}

/** Fila "concepto · monto" de la cascada de ganancia. El signo vive SOLO en el monto. */
export function FilaMonto({
  concepto,
  monto,
  nota,
  total = false,
  color,
  apagada = false,
  href,
  reservarFlecha = false,
}: {
  concepto: string;
  monto: string;
  nota?: string;
  total?: boolean;
  color?: string;
  apagada?: boolean;
  href?: string;
  /** En listas donde algunas filas son tocables: deja el lugar de la flecha para que los montos queden alineados. */
  reservarFlecha?: boolean;
}) {
  if (href) {
    return (
      <Link href={href} className={`${TOCABLE} group flex items-center gap-1 hover:bg-[color-mix(in_oklab,var(--ink-1)_4%,transparent)]`}>
        <span className="min-w-0 flex-1">
          <FilaMonto concepto={concepto} monto={monto} nota={nota} total={total} color={color} apagada={apagada} />
        </span>
        <ChevronRight size={14} className="shrink-0 text-ink-3 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
      </Link>
    );
  }
  if (reservarFlecha) {
    return (
      <div className="flex items-center gap-1">
        <span className="min-w-0 flex-1">
          <FilaMonto concepto={concepto} monto={monto} nota={nota} total={total} color={color} apagada={apagada} />
        </span>
        <span aria-hidden="true" className="w-3.5 shrink-0" />
      </div>
    );
  }
  return (
    <div className={`flex items-baseline justify-between gap-4 py-2 ${total ? 'border-t border-[var(--line)] pt-3' : ''}`}>
      <span className="flex min-w-0 items-baseline gap-2">
        <span aria-hidden="true" className="size-2.5 shrink-0 translate-y-[-1px] rounded-full" style={{ background: color && !apagada ? color : 'transparent' }} />
        <span className="min-w-0">
          <span className={total ? 'font-display text-base font-bold text-ink-1' : `text-ayuda ${apagada ? 'text-ink-3' : 'text-ink-1'}`}>{concepto}</span>
          {nota && <span className="block text-caption text-ink-3">{nota}</span>}
        </span>
      </span>
      <span className={`shrink-0 whitespace-nowrap tabular-nums ${total ? 'font-display text-base font-extrabold text-gold' : `text-ayuda ${apagada ? 'text-ink-3' : 'text-ink-1'}`}`}>{monto}</span>
    </div>
  );
}

/** Barra de progreso simple (verde = avance, neutra = reparto, ámbar = alerta). */
export function Barra({ pct, tono = 'verde', indice = 0 }: { pct: number; tono?: 'verde' | 'neutra' | 'ambar' | 'clara'; indice?: number }) {
  const color = tono === 'verde' ? 'bg-green' : tono === 'ambar' ? 'bg-warning' : tono === 'clara' ? 'bg-ink-1' : 'bg-[color-mix(in_oklab,var(--ink-2)_55%,transparent)]';
  return (
    <span className="block h-1.5 rounded-full bg-sunken">
      <Llenado pct={Math.max(pct > 0 ? 2 : 0, pct)} className={color} indice={indice} />
    </span>
  );
}
