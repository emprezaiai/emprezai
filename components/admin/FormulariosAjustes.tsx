'use client';

// Formularios de Ajustes del panel: % de impuestos, costos fijos y gasto por canal. Cada envío llama
// a una acción de servidor que verifica que eres admin y queda en la auditoría. Quitar algo muestra
// "Quitado · Deshacer" durante 8 s (se vuelve a agregar igual), y todo resultado se ve en pantalla.

import { useActionState, useEffect, useState, useTransition } from 'react';
import { Check, LoaderCircle, Plus, Trash2 } from 'lucide-react';
import { agregarCosto, agregarGasto, borrarCosto, borrarGasto, guardarImpuestos, type Resultado } from '@/app/admin/(panel)/acciones';
import { dinero, fechaCorta, nombreCanal } from '@/lib/panel-formato';
import type { CostoFijo, GastoCanal } from '@/lib/servidor/panel';

const CAMPO =
  'h-12 w-full rounded-[var(--radius-pill)] border border-[color-mix(in_oklab,var(--ink-3)_45%,transparent)] bg-sunken px-4 text-base text-ink-1 placeholder:text-ink-3 focus:border-ink-2 focus:outline-none';
const ETIQUETA = 'text-caption font-semibold text-ink-1';

function Aviso({ r }: { r: Resultado | null }) {
  if (!r) return null;
  return (
    <p role="status" className={`panel-entrar mt-2 text-caption ${r.ok ? 'text-green' : 'text-danger'}`}>
      {r.mensaje}
    </p>
  );
}

/** El mismo botón de guardar en los tres formularios (secundario: en Ajustes no hay una acción principal). */
function BotonGuardar({ enviando, texto = 'Guardar', className = '' }: { enviando: boolean; texto?: string; className?: string }) {
  return (
    <button
      type="submit"
      disabled={enviando}
      className={`flex h-12 shrink-0 items-center justify-center gap-2 rounded-[var(--radius-pill)] border border-[color-mix(in_oklab,var(--ink-2)_45%,transparent)] bg-raised-2 px-5 font-display text-base font-bold text-ink-1 transition-[transform,background-color] duration-100 hover:bg-raised active:scale-[0.97] disabled:opacity-70 ${className}`}
    >
      {enviando ? <LoaderCircle size={18} className="motion-safe:animate-spin" aria-hidden="true" /> : <Check size={18} aria-hidden="true" />}
      {enviando ? 'Guardando…' : texto}
    </button>
  );
}

/** Quitar con "Deshacer" (8 s): guarda lo quitado para volver a agregarlo igual si se arrepiente. */
function useQuitarConDeshacer<T extends { id: number }>(quitar: (id: number) => Promise<Resultado>, rehacer: (item: T) => Promise<Resultado>) {
  const [pendiente, iniciar] = useTransition();
  const [quitado, setQuitado] = useState<T | null>(null);
  const [saliendo, setSaliendo] = useState<number | null>(null);
  const [r, setR] = useState<Resultado | null>(null);
  useEffect(() => {
    if (!quitado) return;
    const t = window.setTimeout(() => setQuitado(null), 8000);
    return () => window.clearTimeout(t);
  }, [quitado]);
  return {
    pendiente,
    quitado,
    r,
    saliendo,
    quitar: (item: T) => {
      setSaliendo(item.id);
      iniciar(async () => {
        const res = await quitar(item.id);
        setR(res);
        setQuitado(res.ok ? item : null);
        setSaliendo(null);
      });
    },
    deshacer: () =>
      iniciar(async () => {
        if (!quitado) return;
        const res = await rehacer(quitado);
        setQuitado(null);
        setR(res.ok ? { ok: true, mensaje: 'Listo, volvió a la lista.' } : res);
      }),
  };
}

function BarraDeshacer({ texto, onDeshacer, pendiente }: { texto: string; onDeshacer: () => void; pendiente: boolean }) {
  return (
    <div role="status" className="panel-entrar mt-2 flex min-h-11 items-center justify-between gap-3 rounded-[var(--radius-chip)] bg-sunken px-3 text-caption text-ink-1">
      <span className="min-w-0 truncate">{texto}</span>
      <button type="button" onClick={onDeshacer} disabled={pendiente} className="min-h-11 shrink-0 font-semibold text-ink-1 underline underline-offset-4">
        Deshacer
      </button>
    </div>
  );
}

function BotonQuitar({ etiqueta, onClick, disabled, quitando = false }: { etiqueta: string; onClick: () => void; disabled: boolean; quitando?: boolean }) {
  return (
    <button type="button" disabled={disabled} onClick={onClick} aria-label={etiqueta} className="flex size-11 items-center justify-center rounded-full text-ink-3 transition-colors hover:bg-sunken hover:text-danger active:scale-[0.95]">
      {quitando ? <LoaderCircle size={16} className="motion-safe:animate-spin" aria-hidden="true" /> : <Trash2 size={16} aria-hidden="true" />}
    </button>
  );
}

/** Clase de la fila que se está quitando: se desvanece antes de salir de la lista. */
const SALIDA = 'transition-[opacity,transform] duration-200 motion-reduce:transition-none';
const salida = (sale: boolean) => `${SALIDA} ${sale ? '-translate-x-2 opacity-40' : ''}`;

const formDe = (campos: Record<string, string | number | null>) => {
  const fd = new FormData();
  for (const [k, v] of Object.entries(campos)) if (v !== null) fd.set(k, String(v));
  return fd;
};

export function FormImpuestos({ actual, esteMes }: { actual: number; esteMes: number | null }) {
  const [r, accion, enviando] = useActionState(guardarImpuestos, null);
  return (
    <form action={accion}>
      <p className="font-display text-4xl leading-none font-extrabold text-ink-1 tabular-nums">{actual}%</p>
      <p className="mt-1 text-caption text-ink-2">
        {esteMes !== null && esteMes > 0 ? `Este mes son unos ${dinero(esteMes)} que se restan de tu ganancia.` : 'Se resta de lo que facturas para calcular tu ganancia.'}
      </p>
      <label className="mt-4 flex flex-col gap-1">
        <span className={ETIQUETA}>Cambiar el porcentaje</span>
        <span className="flex gap-2">
          <span className="relative max-w-36 flex-1">
            <input name="pct" type="number" min={0} max={60} step="0.5" defaultValue={actual} inputMode="decimal" className={`${CAMPO} pr-9`} />
            <span className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-ink-3" aria-hidden="true">
              %
            </span>
          </span>
          <BotonGuardar enviando={enviando} />
        </span>
      </label>
      <Aviso r={r} />
    </form>
  );
}

export function ListaCostos({ costos }: { costos: CostoFijo[] }) {
  const [r, accion, enviando] = useActionState(agregarCosto, null);
  const q = useQuitarConDeshacer<CostoFijo>(borrarCosto, (c) => agregarCosto(null, formDe({ nombre: c.nombre, monto: c.monto_usd })));
  const visibles = costos.filter((c) => c.id !== q.quitado?.id);
  const total = visibles.reduce((t, c) => t + c.monto_usd, 0);
  return (
    <div>
      {visibles.length > 0 ? (
        <>
          <ul className="divide-y divide-[var(--line)]">
            {visibles.map((c) => (
              <li key={c.id} className={`flex items-center justify-between gap-3 py-1 ${salida(q.saliendo === c.id)}`}>
                <span className="min-w-0 text-ayuda break-words text-ink-1">{c.nombre}</span>
                <span className="flex shrink-0 items-center gap-1">
                  <span className="text-ayuda whitespace-nowrap tabular-nums text-ink-2">{dinero(c.monto_usd)} al mes</span>
                  <BotonQuitar etiqueta={`Quitar ${c.nombre}`} onClick={() => q.quitar(c)} disabled={q.pendiente} quitando={q.saliendo === c.id} />
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-2 flex justify-between border-t border-[var(--line)] pt-2 text-ayuda">
            <span className="font-semibold text-ink-1">Total</span>
            <span className="font-semibold whitespace-nowrap tabular-nums text-ink-1">{dinero(total)} al mes</span>
          </p>
        </>
      ) : (
        <p className="text-caption text-ink-3">Aún no anotaste costos fijos.</p>
      )}
      {q.quitado ? <BarraDeshacer texto={`Quitado: ${q.quitado.nombre}`} onDeshacer={q.deshacer} pendiente={q.pendiente} /> : <Aviso r={q.r} />}

      <details className="group mt-3" open={visibles.length === 0}>
        <summary className="flex min-h-11 cursor-pointer list-none items-center gap-1.5 text-caption font-semibold text-ink-1 [&::-webkit-details-marker]:hidden">
          <Plus size={16} className="transition-transform group-open:rotate-45" aria-hidden="true" />
          Agregar un costo
        </summary>
      <form action={accion} className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-end">
        <label className="flex flex-1 flex-col gap-1">
          <span className={ETIQUETA}>Qué pagas</span>
          <input name="nombre" required placeholder="Ej.: Vercel Pro" className={CAMPO} />
        </label>
        <label className="flex flex-col gap-1 sm:w-40">
          <span className={ETIQUETA}>Cuánto al mes (USD)</span>
          <input name="monto" type="number" min={0} step="0.01" required placeholder="Ej.: 20" inputMode="decimal" className={CAMPO} />
        </label>
        <BotonGuardar enviando={enviando} texto="Agregar" />
      </form>
      </details>
      <Aviso r={r} />
    </div>
  );
}

export function ListaGastos({ gastos, canales, desde, hasta }: { gastos: GastoCanal[]; canales: string[]; desde: string; hasta: string }) {
  const [r, accion, enviando] = useActionState(agregarGasto, null);
  const q = useQuitarConDeshacer<GastoCanal>(borrarGasto, (g) => agregarGasto(null, formDe({ canal: g.canal, monto: g.monto_usd, desde: g.desde, hasta: g.hasta, nota: g.nota })));
  const [elegido, setElegido] = useState(canales[0] ?? 'otro');
  const [inicio, setInicio] = useState(desde);
  // Agrupados por mes (por la fecha de inicio), del más reciente al más antiguo.
  const totalMes = (fecha: string) => visibles.filter((x) => mesDe(x.desde) === mesDe(fecha)).reduce((t, x) => t + x.monto_usd, 0);
  const mesDe = (fecha: string) => new Intl.DateTimeFormat('es', { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${fecha}T12:00:00Z`));
  const visibles = gastos.filter((g) => g.id !== q.quitado?.id);
  return (
    <div>
      {visibles.length > 0 ? (
        <ul className="divide-y divide-[var(--line)]">
          {visibles.map((g, i) => (
            <li key={g.id} className={`py-1 ${salida(q.saliendo === g.id)}`}>
              {(i === 0 || mesDe(visibles[i - 1].desde) !== mesDe(g.desde)) && (
                <p className="flex justify-between pt-2 pb-1 text-xs font-semibold tracking-[0.08em] text-ink-3 uppercase">
                  <span>{mesDe(g.desde)}</span>
                  <span className="tabular-nums">{dinero(totalMes(g.desde))}</span>
                </p>
              )}
              <div className="flex items-center justify-between gap-3">
              <span className="min-w-0">
                <span className="block text-ayuda font-semibold break-words text-ink-1">{nombreCanal(g.canal)}</span>
                <span className="block text-xs text-ink-3">
                  {fechaCorta(`${g.desde}T12:00:00Z`)} – {fechaCorta(`${g.hasta}T12:00:00Z`)}
                  {g.nota && ` · ${g.nota}`}
                </span>
              </span>
              <span className="flex shrink-0 items-center gap-1">
                <span className="text-ayuda whitespace-nowrap tabular-nums text-ink-2">{dinero(g.monto_usd)}</span>
                <BotonQuitar etiqueta={`Quitar el gasto de ${nombreCanal(g.canal)}`} onClick={() => q.quitar(g)} disabled={q.pendiente} quitando={q.saliendo === g.id} />
              </span>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-caption text-ink-3">Aún no anotaste gastos en anuncios.</p>
      )}
      {q.quitado ? <BarraDeshacer texto={`Quitado: gasto de ${nombreCanal(q.quitado.canal)}`} onDeshacer={q.deshacer} pendiente={q.pendiente} /> : <Aviso r={q.r} />}

      <details className="group mt-3" open={visibles.length === 0}>
        <summary className="flex min-h-11 cursor-pointer list-none items-center gap-1.5 text-caption font-semibold text-ink-1 [&::-webkit-details-marker]:hidden">
          <Plus size={16} className="transition-transform group-open:rotate-45" aria-hidden="true" />
          Anotar un gasto
        </summary>
      <form action={accion} className="mt-2 grid gap-3 sm:grid-cols-2">
        <label className="flex flex-col gap-1">
          <span className={ETIQUETA}>Dónde pusiste el anuncio</span>
          <select value={elegido} onChange={(e) => setElegido(e.target.value)} name={elegido === 'otro' ? undefined : 'canal'} className={CAMPO}>
            {canales.map((c) => (
              <option key={c} value={c}>
                {nombreCanal(c)}
              </option>
            ))}
            <option value="otro">Otro…</option>
          </select>
        </label>
        {elegido === 'otro' && (
          <label className="flex flex-col gap-1">
            <span className={ETIQUETA}>Nombre del canal</span>
            <input name="canal" required placeholder="Ej.: pinterest" className={CAMPO} />
            <span className="text-xs text-ink-3">Por ejemplo: pinterest, un evento o una alianza.</span>
          </label>
        )}
        <label className="flex flex-col gap-1">
          <span className={ETIQUETA}>Cuánto gastaste (USD)</span>
          <input name="monto" type="number" min={0} step="0.01" required inputMode="decimal" placeholder="Ej.: 150" className={CAMPO} />
        </label>
        <label className="flex flex-col gap-1">
          <span className={ETIQUETA}>Desde</span>
          <input name="desde" type="date" required value={inicio} onChange={(e) => setInicio(e.target.value)} className={CAMPO} />
        </label>
        <label className="flex flex-col gap-1">
          <span className={ETIQUETA}>Hasta</span>
          <input name="hasta" type="date" required defaultValue={hasta} min={inicio} className={CAMPO} />
        </label>
        <label className="flex flex-col gap-1 sm:col-span-2">
          <span className={ETIQUETA}>Nota (opcional)</span>
          <input name="nota" maxLength={200} placeholder="Ej.: video de la hoja en blanco" className={CAMPO} />
        </label>
        <div className="sm:col-span-2">
          <BotonGuardar enviando={enviando} texto="Guardar gasto" className="w-full sm:w-auto" />
        </div>
      </form>
      </details>
      <Aviso r={r} />
    </div>
  );
}
