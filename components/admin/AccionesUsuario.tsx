'use client';

// Acciones sobre usuarios desde el panel: dar acceso a mano, copiar enlace de acceso (se copia en el
// mismo toque), reenviar, extender y quitar (los dos últimos con "Deshacer" 8 segundos). Cada botón
// llama a una acción de servidor que vuelve a verificar que eres admin.

import { useActionState, useEffect, useRef, useState, useTransition } from 'react';
import { Check, Copy, LoaderCircle, Mail, RotateCcw, TimerReset, UserPlus, UserX } from 'lucide-react';
import {
  agregarUsuario,
  crearEnlaceAcceso,
  extenderAcceso,
  quitarAcceso,
  reenviarAcceso,
  restaurarAcceso,
  type AccesoPrevio,
  type Resultado,
} from '@/app/admin/(panel)/acciones';

const TOCABLE = 'transition-transform duration-100 active:scale-[0.98]';
const CAMPO =
  'h-12 rounded-[var(--radius-pill)] border border-[color-mix(in_oklab,var(--ink-3)_45%,transparent)] bg-sunken px-4 text-base text-ink-1 placeholder:text-ink-3 focus:border-ink-2 focus:outline-none';

function Aviso({ r }: { r: Resultado | null }) {
  if (!r) return null;
  return (
    <p role="status" className={`mt-3 text-caption ${r.ok ? 'text-green' : 'text-danger'}`}>
      {r.mensaje}
    </p>
  );
}

async function copiarTexto(texto: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(texto);
    return true;
  } catch {
    return false;
  }
}

/** El enlace generado, para mandarlo por WhatsApp (ya copiado si el navegador lo permitió). */
function EnlaceCopiable({ enlace, codigo, copiadoAlInicio }: { enlace: string; codigo?: string; copiadoAlInicio: boolean }) {
  const [copiado, setCopiado] = useState(copiadoAlInicio);
  return (
    <div className="mt-3 rounded-[var(--radius-chip)] border border-[var(--line)] bg-sunken p-3">
      <p className="text-xs font-semibold text-ink-2">{copiado ? 'Enlace copiado: pégalo en WhatsApp.' : 'Enlace para entrar'} Sirve una sola vez y vence en 1 hora.</p>
      <p className="mt-1 text-caption break-all text-ink-1 select-all">{enlace}</p>
      {codigo && (
        <p className="mt-2 text-caption text-ink-2">
          O el código: <strong className="font-display text-base font-bold tracking-[0.2em] text-ink-1 select-all">{codigo}</strong>
        </p>
      )}
      <button
        type="button"
        onClick={async () => setCopiado(await copiarTexto(enlace))}
        className={`${TOCABLE} mt-2 inline-flex min-h-11 items-center gap-2 text-caption font-semibold text-ink-1`}
      >
        {copiado ? <Check size={16} aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />}
        <span aria-live="polite">{copiado ? 'Copiado' : 'Copiar de nuevo'}</span>
      </button>
    </div>
  );
}

export function FormAgregarUsuario({ emailInicial = '' }: { emailInicial?: string }) {
  const [resultado, accion, enviando] = useActionState(agregarUsuario, null);
  const [duracion, setDuracion] = useState('30');
  const [copiado, setCopiado] = useState(false);
  useEffect(() => {
    if (resultado?.ok && resultado.enlace) void copiarTexto(resultado.enlace).then(setCopiado);
  }, [resultado]);
  return (
    <form action={accion} className="flex flex-col gap-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="flex flex-col gap-1">
          <span className="text-caption font-semibold text-ink-1">Correo</span>
          <input name="email" type="email" required autoComplete="off" defaultValue={emailInicial} placeholder="persona@correo.com" className={CAMPO} />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-caption font-semibold text-ink-1">Nombre</span>
          <input name="nombre" required autoComplete="off" placeholder="Nombre y apellido" className={CAMPO} />
        </label>
      </div>
      <fieldset>
        <legend className="text-caption font-semibold text-ink-1">¿Por cuánto tiempo? Todo acceso tiene fecha de fin.</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {[
            ['7', '7 días'],
            ['30', '1 mes'],
            ['365', '1 año'],
            ['fecha', 'Hasta una fecha'],
          ].map(([valor, texto]) => (
            <label
              key={valor}
              className={`${TOCABLE} opcion-recorrido flex min-h-11 cursor-pointer items-center gap-2 px-4 text-caption font-semibold text-ink-1 has-[:checked]:border-ink-2 has-[:checked]:bg-raised-2`}
            >
              <input type="radio" name="duracion" value={valor} checked={duracion === valor} onChange={() => setDuracion(valor)} className="sr-only" />
              {texto}
            </label>
          ))}
        </div>
      </fieldset>
      {duracion === 'fecha' && (
        <label className="flex flex-col gap-1">
          <span className="text-caption font-semibold text-ink-1">Fecha de fin</span>
          <input name="fecha" type="date" required className={CAMPO} />
        </label>
      )}
      <button type="submit" disabled={enviando} className={`${TOCABLE} boton-oro mt-1 flex h-12 items-center justify-center gap-2 rounded-[var(--radius-pill)] px-6 font-display text-base font-bold sm:w-fit`}>
        {enviando ? <LoaderCircle size={18} className="motion-safe:animate-spin" aria-hidden="true" /> : <UserPlus size={18} aria-hidden="true" />}
        {enviando ? 'Dando acceso…' : 'Dar acceso'}
      </button>
      <Aviso r={resultado} />
      {resultado?.ok && resultado.enlace && <EnlaceCopiable key={resultado.enlace} enlace={resultado.enlace} codigo={resultado.codigo} copiadoAlInicio={copiado} />}
    </form>
  );
}

export function AccionesFicha({ id, puedeEnviarCorreo, conAcceso, enlaceEsPrincipal = true }: { id: string; puedeEnviarCorreo: boolean; conAcceso: boolean; enlaceEsPrincipal?: boolean }) {
  const [resultado, setResultado] = useState<Resultado | null>(null);
  const [copiado, setCopiado] = useState(false);
  const [deshacer, setDeshacer] = useState<AccesoPrevio | null>(null);
  const [pendiente, iniciar] = useTransition();
  const [confirmarQuitar, setConfirmarQuitar] = useState(false);
  const reloj = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(reloj.current), []);

  function correr(fn: () => Promise<Resultado>, conDeshacer = false) {
    iniciar(async () => {
      const r = await fn();
      setResultado(r);
      setCopiado(false);
      window.clearTimeout(reloj.current);
      if (r.ok && r.enlace) setCopiado(await copiarTexto(r.enlace));
      if (conDeshacer && r.ok && r.previo) {
        setDeshacer(r.previo);
        reloj.current = window.setTimeout(() => setDeshacer(null), 8000);
      } else {
        setDeshacer(null);
      }
    });
  }

  const secundario = `${TOCABLE} opcion-recorrido flex min-h-11 items-center justify-center gap-2 px-4 text-caption font-semibold text-ink-1 disabled:opacity-50`;
  return (
    <div>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          disabled={pendiente}
          onClick={() => correr(() => crearEnlaceAcceso(id))}
          className={enlaceEsPrincipal ? `${TOCABLE} boton-oro flex min-h-11 items-center gap-2 rounded-[var(--radius-pill)] px-4 text-caption font-bold` : secundario}
        >
          <Copy size={16} aria-hidden="true" />
          Copiar enlace de acceso
        </button>
        {puedeEnviarCorreo && (
          <button type="button" disabled={pendiente} onClick={() => correr(() => reenviarAcceso(id))} className={secundario}>
            <Mail size={16} aria-hidden="true" />
            Reenviar acceso por correo
          </button>
        )}
      </div>

      <p className="mt-4 text-caption font-semibold text-ink-1">Extender acceso</p>
      <div className="mt-2 grid grid-cols-3 gap-2">
        {[7, 30, 365].map((d) => (
          <button key={d} type="button" disabled={pendiente} onClick={() => correr(() => extenderAcceso(id, d), true)} className={`${secundario} px-2 whitespace-nowrap`}>
            <TimerReset size={16} className="hidden shrink-0 sm:block" aria-hidden="true" />+{d === 365 ? '1 año' : d === 30 ? '1 mes' : '7 días'}
          </button>
        ))}
      </div>

      {conAcceso && (
        <div className="mt-4">
          {confirmarQuitar ? (
            <div className="rounded-[var(--radius-chip)] border border-[color-mix(in_oklab,var(--danger)_45%,transparent)] p-3">
              <p className="text-caption text-ink-1">¿Quitarle el acceso ahora? Sus piezas quedan guardadas y tendrás 8 segundos para deshacerlo.</p>
              <div className="mt-2 flex flex-wrap gap-2">
                <button
                  type="button"
                  disabled={pendiente}
                  onClick={() => {
                    setConfirmarQuitar(false);
                    correr(() => quitarAcceso(id), true);
                  }}
                  className={`${TOCABLE} flex min-h-11 items-center gap-2 rounded-[var(--radius-pill)] bg-danger px-4 text-caption font-bold text-on-gold`}
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
            <button type="button" disabled={pendiente} onClick={() => setConfirmarQuitar(true)} className={`${TOCABLE} flex min-h-11 items-center gap-2 text-caption font-semibold text-danger`}>
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
      {!pendiente && (resultado || deshacer) && (
        <div className="flex flex-wrap items-center gap-x-3">
          <Aviso r={resultado} />
          {deshacer && (
            <button
              type="button"
              onClick={() => {
                const previo = deshacer;
                setDeshacer(null);
                correr(() => restaurarAcceso(id, previo));
              }}
              className={`${TOCABLE} mt-3 inline-flex min-h-11 items-center gap-1 text-caption font-semibold text-ink-1 underline underline-offset-4`}
            >
              <RotateCcw size={14} aria-hidden="true" />
              Deshacer
            </button>
          )}
        </div>
      )}
      {resultado?.ok && resultado.enlace && <EnlaceCopiable key={resultado.enlace} enlace={resultado.enlace} codigo={resultado.codigo} copiadoAlInicio={copiado} />}
    </div>
  );
}
