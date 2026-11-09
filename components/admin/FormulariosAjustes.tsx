'use client';

// Formularios de Ajustes del panel: % de impuestos, costos fijos y gasto por canal. Cada envío llama
// a una acción de servidor que verifica que eres admin y queda en la auditoría.

import { useActionState, useTransition } from 'react';
import { LoaderCircle, Plus, Trash2 } from 'lucide-react';
import { agregarCosto, agregarGasto, borrarCosto, borrarGasto, guardarImpuestos, type Resultado } from '@/app/admin/(panel)/acciones';
import { dinero, fechaCorta } from '@/lib/panel-formato';
import type { CostoFijo, GastoCanal } from '@/lib/servidor/panel';

const CAMPO =
  'h-12 w-full rounded-[var(--radius-pill)] border border-[color-mix(in_oklab,var(--ink-3)_45%,transparent)] bg-sunken px-4 text-base text-ink-1 placeholder:text-ink-3 focus:border-ink-2 focus:outline-none';

function Aviso({ r }: { r: Resultado | null }) {
  if (!r) return null;
  return (
    <p role="status" className={`mt-2 text-caption ${r.ok ? 'text-green' : 'text-danger'}`}>
      {r.mensaje}
    </p>
  );
}

function BotonGuardar({ enviando, texto }: { enviando: boolean; texto: string }) {
  return (
    <button type="submit" disabled={enviando} className="boton-oro flex h-12 shrink-0 items-center justify-center gap-2 rounded-[var(--radius-pill)] px-5 font-display text-base font-bold">
      {enviando ? <LoaderCircle size={18} className="motion-safe:animate-spin" aria-hidden="true" /> : <Plus size={18} aria-hidden="true" />}
      {texto}
    </button>
  );
}

export function FormImpuestos({ actual }: { actual: number }) {
  const [r, accion, enviando] = useActionState(guardarImpuestos, null);
  return (
    <form action={accion}>
      <label className="flex flex-col gap-1">
        <span className="text-caption font-semibold text-ink-1">Impuestos y retenciones (% de lo que facturas)</span>
        <span className="flex gap-2">
          <input name="pct" type="number" min={0} max={60} step="0.5" defaultValue={actual} inputMode="decimal" className={`${CAMPO} max-w-32`} />
          <button type="submit" disabled={enviando} className="opcion-recorrido min-h-12 px-5 text-caption font-semibold text-ink-1">
            {enviando ? 'Guardando…' : 'Guardar'}
          </button>
        </span>
      </label>
      <Aviso r={r} />
    </form>
  );
}

export function ListaCostos({ costos }: { costos: CostoFijo[] }) {
  const [r, accion, enviando] = useActionState(agregarCosto, null);
  const [borrando, iniciar] = useTransition();
  return (
    <div>
      {costos.length > 0 && (
        <ul className="mb-4 divide-y divide-[var(--line)]">
          {costos.map((c) => (
            <li key={c.id} className="flex items-center justify-between gap-3 py-2">
              <span className="text-ayuda text-ink-1">{c.nombre}</span>
              <span className="flex items-center gap-2">
                <span className="text-ayuda tabular-nums text-ink-2">{dinero(c.monto_usd)} al mes</span>
                <button type="button" disabled={borrando} onClick={() => iniciar(async () => void (await borrarCosto(c.id)))} aria-label={`Quitar ${c.nombre}`} className="flex size-11 items-center justify-center rounded-full text-ink-3 hover:text-danger">
                  <Trash2 size={16} aria-hidden="true" />
                </button>
              </span>
            </li>
          ))}
        </ul>
      )}
      <form action={accion} className="flex flex-col gap-2 sm:flex-row">
        <label className="flex-1">
          <span className="sr-only">Nombre del costo</span>
          <input name="nombre" required placeholder="Ej.: Vercel Pro" className={CAMPO} />
        </label>
        <label className="sm:w-40">
          <span className="sr-only">Monto mensual en dólares</span>
          <input name="monto" type="number" min={0} step="0.01" required placeholder="$ al mes" inputMode="decimal" className={CAMPO} />
        </label>
        <BotonGuardar enviando={enviando} texto="Agregar" />
      </form>
      <Aviso r={r} />
    </div>
  );
}

export function ListaGastos({ gastos }: { gastos: GastoCanal[] }) {
  const [r, accion, enviando] = useActionState(agregarGasto, null);
  const [borrando, iniciar] = useTransition();
  return (
    <div>
      {gastos.length > 0 && (
        <ul className="mb-4 divide-y divide-[var(--line)]">
          {gastos.map((g) => (
            <li key={g.id} className="flex items-center justify-between gap-3 py-2">
              <span className="min-w-0">
                <span className="block text-ayuda font-semibold break-all text-ink-1">{g.canal}</span>
                <span className="block text-xs text-ink-3">
                  {fechaCorta(`${g.desde}T12:00:00Z`)} – {fechaCorta(`${g.hasta}T12:00:00Z`)}
                  {g.nota && ` · ${g.nota}`}
                </span>
              </span>
              <span className="flex shrink-0 items-center gap-2">
                <span className="text-ayuda tabular-nums text-ink-2">{dinero(g.monto_usd)}</span>
                <button type="button" disabled={borrando} onClick={() => iniciar(async () => void (await borrarGasto(g.id)))} aria-label={`Quitar el gasto de ${g.canal}`} className="flex size-11 items-center justify-center rounded-full text-ink-3 hover:text-danger">
                  <Trash2 size={16} aria-hidden="true" />
                </button>
              </span>
            </li>
          ))}
        </ul>
      )}
      <form action={accion} className="grid gap-2 sm:grid-cols-2">
        <label className="flex flex-col gap-1">
          <span className="text-caption font-semibold text-ink-1">Canal (el mismo código del enlace)</span>
          <input name="canal" required placeholder="tiktok" className={CAMPO} />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-caption font-semibold text-ink-1">Cuánto gastaste (USD)</span>
          <input name="monto" type="number" min={0} step="0.01" required inputMode="decimal" placeholder="150" className={CAMPO} />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-caption font-semibold text-ink-1">Desde</span>
          <input name="desde" type="date" required className={CAMPO} />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-caption font-semibold text-ink-1">Hasta</span>
          <input name="hasta" type="date" required className={CAMPO} />
        </label>
        <label className="flex flex-col gap-1 sm:col-span-2">
          <span className="text-caption font-semibold text-ink-1">Nota (opcional)</span>
          <input name="nota" maxLength={200} placeholder="Ej.: anuncio del video de la hoja en blanco" className={CAMPO} />
        </label>
        <div className="sm:col-span-2">
          <BotonGuardar enviando={enviando} texto="Guardar gasto" />
        </div>
      </form>
      <Aviso r={r} />
    </div>
  );
}
