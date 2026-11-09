'use client';

// Acciones sobre usuarios desde el panel: agregar a mano, copiar enlace de acceso, reenviar,
// extender y quitar. Cada botón llama a una acción de servidor que vuelve a verificar que eres admin.

import { useActionState, useState, useTransition } from 'react';
import { Check, Copy, LoaderCircle, Mail, TimerReset, UserPlus, UserX } from 'lucide-react';
import { agregarUsuario, crearEnlaceAcceso, extenderAcceso, quitarAcceso, reenviarAcceso, type Resultado } from '@/app/admin/(panel)/acciones';

function Aviso({ r }: { r: Resultado | null }) {
  if (!r) return null;
  return (
    <p role="status" className={`mt-3 text-caption ${r.ok ? 'text-green' : 'text-danger'}`}>
      {r.mensaje}
    </p>
  );
}

/** El enlace generado, para copiarlo y mandarlo por WhatsApp. */
function EnlaceCopiable({ enlace, codigo }: { enlace: string; codigo?: string }) {
  const [copiado, setCopiado] = useState(false);
  async function copiar() {
    try {
      await navigator.clipboard.writeText(enlace);
      setCopiado(true);
      window.setTimeout(() => setCopiado(false), 2000);
    } catch {
      setCopiado(false);
    }
  }
  return (
    <div className="mt-3 rounded-[var(--radius-chip)] border border-[var(--line)] bg-sunken p-3">
      <p className="text-xs font-semibold text-ink-2">Enlace para entrar (un solo uso, vence en 1 hora)</p>
      <p className="mt-1 text-caption break-all text-ink-1 select-all">{enlace}</p>
      {codigo && (
        <p className="mt-2 text-caption text-ink-2">
          O el código: <strong className="font-display text-base font-bold tracking-[0.2em] text-ink-1 select-all">{codigo}</strong>
        </p>
      )}
      <button type="button" onClick={copiar} className="mt-2 inline-flex min-h-11 items-center gap-2 text-caption font-semibold text-ink-1">
        {copiado ? <Check size={16} aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />}
        <span aria-live="polite">{copiado ? 'Copiado' : 'Copiar enlace'}</span>
      </button>
    </div>
  );
}

export function FormAgregarUsuario() {
  const [resultado, accion, enviando] = useActionState(agregarUsuario, null);
  const [duracion, setDuracion] = useState('30');
  return (
    <form action={accion} className="flex flex-col gap-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="flex flex-col gap-1">
          <span className="text-caption font-semibold text-ink-1">Correo</span>
          <input
            name="email"
            type="email"
            required
            autoComplete="off"
            placeholder="persona@correo.com"
            className="h-12 rounded-[var(--radius-pill)] border border-[color-mix(in_oklab,var(--ink-3)_45%,transparent)] bg-sunken px-4 text-base text-ink-1 placeholder:text-ink-3 focus:border-ink-2 focus:outline-none"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-caption font-semibold text-ink-1">Nombre</span>
          <input
            name="nombre"
            required
            autoComplete="off"
            placeholder="Nombre y apellido"
            className="h-12 rounded-[var(--radius-pill)] border border-[color-mix(in_oklab,var(--ink-3)_45%,transparent)] bg-sunken px-4 text-base text-ink-1 placeholder:text-ink-3 focus:border-ink-2 focus:outline-none"
          />
        </label>
      </div>
      <fieldset>
        <legend className="text-caption font-semibold text-ink-1">¿Por cuánto tiempo? (todo acceso tiene fecha de fin)</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {[
            ['7', '7 días'],
            ['30', '1 mes'],
            ['365', '1 año'],
            ['fecha', 'Hasta una fecha'],
          ].map(([valor, texto]) => (
            <label key={valor} className="opcion-recorrido flex min-h-11 cursor-pointer items-center gap-2 px-4 text-caption font-semibold text-ink-1 has-[:checked]:border-gold has-[:checked]:text-gold">
              <input type="radio" name="duracion" value={valor} checked={duracion === valor} onChange={() => setDuracion(valor)} className="sr-only" />
              {texto}
            </label>
          ))}
        </div>
      </fieldset>
      {duracion === 'fecha' && (
        <label className="flex flex-col gap-1">
          <span className="text-caption font-semibold text-ink-1">Fecha de fin</span>
          <input
            name="fecha"
            type="date"
            required
            className="h-12 rounded-[var(--radius-pill)] border border-[color-mix(in_oklab,var(--ink-3)_45%,transparent)] bg-sunken px-4 text-base text-ink-1 focus:border-ink-2 focus:outline-none"
          />
        </label>
      )}
      <button type="submit" disabled={enviando} className="boton-oro mt-1 flex h-12 items-center justify-center gap-2 rounded-[var(--radius-pill)] px-6 font-display text-base font-bold sm:w-fit">
        {enviando ? <LoaderCircle size={18} className="motion-safe:animate-spin" aria-hidden="true" /> : <UserPlus size={18} aria-hidden="true" />}
        {enviando ? 'Agregando…' : 'Dar acceso'}
      </button>
      <Aviso r={resultado} />
      {resultado?.ok && resultado.enlace && <EnlaceCopiable enlace={resultado.enlace} codigo={resultado.codigo} />}
    </form>
  );
}

export function AccionesFicha({ id, puedeEnviarCorreo, conAcceso }: { id: string; puedeEnviarCorreo: boolean; conAcceso: boolean }) {
  const [resultado, setResultado] = useState<Resultado | null>(null);
  const [pendiente, iniciar] = useTransition();
  const [confirmarQuitar, setConfirmarQuitar] = useState(false);
  const correr = (fn: () => Promise<Resultado>) => iniciar(async () => setResultado(await fn()));

  const secundario = 'opcion-recorrido flex min-h-11 items-center justify-center gap-2 px-4 text-caption font-semibold text-ink-1 disabled:opacity-50';
  return (
    <div>
      <div className="flex flex-wrap gap-2">
        <button type="button" disabled={pendiente} onClick={() => correr(() => crearEnlaceAcceso(id))} className="boton-oro flex min-h-11 items-center gap-2 rounded-[var(--radius-pill)] px-4 text-caption font-bold">
          <Copy size={16} aria-hidden="true" />
          Copiar enlace de acceso
        </button>
        <button
          type="button"
          disabled={pendiente || !puedeEnviarCorreo}
          title={puedeEnviarCorreo ? undefined : 'Se activa al conectar el envío de correos'}
          onClick={() => correr(() => reenviarAcceso(id))}
          className={secundario}
        >
          <Mail size={16} aria-hidden="true" />
          Reenviar acceso por correo
        </button>
      </div>
      {!puedeEnviarCorreo && <p className="mt-2 text-xs text-ink-3">Reenviar por correo se activa al conectar el envío de correos (Resend).</p>}

      <p className="mt-4 text-caption font-semibold text-ink-1">Extender acceso</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {[7, 30, 365].map((d) => (
          <button key={d} type="button" disabled={pendiente} onClick={() => correr(() => extenderAcceso(id, d))} className={secundario}>
            <TimerReset size={16} aria-hidden="true" />+{d === 365 ? '1 año' : d === 30 ? '1 mes' : '7 días'}
          </button>
        ))}
      </div>

      {conAcceso && (
        <div className="mt-4">
          {confirmarQuitar ? (
            <div className="rounded-[var(--radius-chip)] border border-[color-mix(in_oklab,var(--danger)_45%,transparent)] p-3">
              <p className="text-caption text-ink-1">¿Quitarle el acceso ahora? Sus piezas quedan guardadas y puedes volver a dárselo.</p>
              <div className="mt-2 flex flex-wrap gap-2">
                <button
                  type="button"
                  disabled={pendiente}
                  onClick={() => {
                    setConfirmarQuitar(false);
                    correr(() => quitarAcceso(id));
                  }}
                  className="flex min-h-11 items-center gap-2 rounded-[var(--radius-pill)] bg-danger px-4 text-caption font-bold text-on-gold"
                >
                  <UserX size={16} aria-hidden="true" />
                  Sí, quitar acceso
                </button>
                <button type="button" onClick={() => setConfirmarQuitar(false)} className={secundario}>
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
            <button type="button" disabled={pendiente} onClick={() => setConfirmarQuitar(true)} className="flex min-h-11 items-center gap-2 text-caption font-semibold text-danger">
              <UserX size={16} aria-hidden="true" />
              Quitar acceso
            </button>
          )}
        </div>
      )}

      {pendiente && (
        <p className="mt-3 flex items-center gap-2 text-caption text-ink-2" role="status">
          <LoaderCircle size={14} className="motion-safe:animate-spin" aria-hidden="true" />
          Un momento…
        </p>
      )}
      <Aviso r={resultado} />
      {resultado?.ok && resultado.enlace && <EnlaceCopiable enlace={resultado.enlace} codigo={resultado.codigo} />}
    </div>
  );
}
