'use client';

// Entrada al panel de la dueña: enlace + código al correo (sin contraseñas, 26). La respuesta es la
// misma para cualquier correo; solo el correo admin recibe algo. El permiso se vuelve a verificar
// en el servidor al abrir el panel.

import { useId, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, KeyRound, LoaderCircle, LockKeyhole } from 'lucide-react';
import { Marca } from '@/components/app/Marca';

const CORREO_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function EntrarPanel() {
  const router = useRouter();
  const idCorreo = useId();
  const idCodigo = useId();
  const [email, setEmail] = useState('');
  const [codigo, setCodigo] = useState('');
  const [paso, setPaso] = useState<'correo' | 'codigo'>('correo');
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');

  async function pedir(ev: React.FormEvent) {
    ev.preventDefault();
    const limpio = email.trim().toLowerCase();
    if (!CORREO_VALIDO.test(limpio)) {
      setError('Escribe tu correo completo. Ejemplo: tu@correo.com');
      return;
    }
    setCargando(true);
    setError('');
    try {
      const res = await fetch('/api/admin/entrar', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: limpio }) });
      if (res.status === 429) setError('Pediste varios enlaces seguidos. Espera unos minutos.');
      else if (res.status === 503) setError('El envío de correos todavía no está conectado. Se activa al configurar Resend.');
      else if (!res.ok) setError('No pudimos enviar el enlace ahora. Intenta en un minuto.');
      else {
        setEmail(limpio);
        setPaso('codigo');
      }
    } catch {
      setError('Sin conexión. Revisa tu internet e intenta de nuevo.');
    } finally {
      setCargando(false);
    }
  }

  async function verificar(ev: React.FormEvent) {
    ev.preventDefault();
    if (!/^\d{6,8}$/.test(codigo)) {
      setError('Escribe el código de números del correo.');
      return;
    }
    setCargando(true);
    setError('');
    try {
      const res = await fetch('/api/acceso/verificar', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, codigo }) });
      if (res.ok) {
        router.replace('/admin');
        return;
      }
      setError(res.status === 429 ? 'Demasiados intentos. Espera 15 minutos o usa el botón del correo.' : 'Ese código no coincide o ya venció.');
    } catch {
      setError('Sin conexión. Revisa tu internet e intenta de nuevo.');
    } finally {
      setCargando(false);
    }
  }

  return (
    <main className="fondo-recorrido flex min-h-dvh flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-2">
          <Marca tamano="md" />
          <span className="rounded-[var(--radius-pill)] border border-[var(--line)] px-2 py-0.5 text-xs font-semibold text-ink-2">Panel</span>
        </div>
        <h1 className="mt-8 font-display text-pregunta font-extrabold text-ink-1">{paso === 'correo' ? 'Entra a tu panel' : 'Revisa tu correo'}</h1>
        <p className="mt-2 text-ayuda text-ink-2">
          {paso === 'correo' ? (
            'Solo para la dueña de EMPREZAI. Te llega un enlace de un solo uso.'
          ) : (
            <>
              Si <strong className="font-semibold [overflow-wrap:anywhere] text-ink-1">{email}</strong> es el correo del panel, te llegan un enlace y un código.
            </>
          )}
        </p>

        {paso === 'correo' ? (
          <form onSubmit={pedir} noValidate className="mt-8 flex flex-col gap-2">
            <label htmlFor={idCorreo} className="text-caption font-semibold text-ink-1">
              Tu correo
            </label>
            <input
              id={idCorreo}
              type="email"
              inputMode="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError('');
              }}
              placeholder="tu@correo.com"
              aria-invalid={Boolean(error)}
              className="h-14 w-full rounded-[var(--radius-pill)] border border-[color-mix(in_oklab,var(--ink-3)_45%,transparent)] bg-sunken px-5 text-base text-ink-1 placeholder:text-ink-3 focus:border-ink-2 focus:outline-none"
            />
            {error && (
              <p role="alert" className="text-caption text-danger">
                {error}
              </p>
            )}
            <button
              type="submit"
              disabled={cargando}
              className="boton-oro mt-4 flex h-14 w-full items-center justify-center gap-2 rounded-[var(--radius-pill)] font-display text-base font-bold"
            >
              {cargando ? <LoaderCircle size={20} className="motion-safe:animate-spin" aria-hidden="true" /> : null}
              {cargando ? 'Enviando…' : 'Enviarme el enlace'}
              {!cargando && <ArrowRight size={20} aria-hidden="true" />}
            </button>
          </form>
        ) : (
          <form onSubmit={verificar} noValidate className="mt-8 flex flex-col gap-2">
            <label htmlFor={idCodigo} className="text-caption font-semibold text-ink-1">
              Código del correo
            </label>
            <input
              id={idCodigo}
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={8}
              value={codigo}
              onChange={(e) => {
                setCodigo(e.target.value.replace(/\D/g, '').slice(0, 8));
                setError('');
              }}
              placeholder="Solo números"
              aria-invalid={Boolean(error)}
              className="h-14 w-full rounded-[var(--radius-pill)] border border-[color-mix(in_oklab,var(--ink-3)_45%,transparent)] bg-sunken px-5 text-center font-display text-xl font-bold tracking-[0.3em] text-ink-1 tabular-nums placeholder:font-sans placeholder:text-base placeholder:font-normal placeholder:tracking-normal placeholder:text-ink-3 focus:border-ink-2 focus:outline-none"
            />
            {error && (
              <p role="alert" className="text-caption text-danger">
                {error}
              </p>
            )}
            <button
              type="submit"
              disabled={cargando}
              className="boton-oro mt-4 flex h-14 w-full items-center justify-center gap-2 rounded-[var(--radius-pill)] font-display text-base font-bold"
            >
              {cargando ? <LoaderCircle size={20} className="motion-safe:animate-spin" aria-hidden="true" /> : <KeyRound size={20} aria-hidden="true" />}
              {cargando ? 'Revisando…' : 'Entrar con el código'}
            </button>
            <button
              type="button"
              onClick={() => {
                setPaso('correo');
                setCodigo('');
                setError('');
              }}
              className="flex min-h-11 items-center justify-center text-caption font-semibold text-ink-2"
            >
              Usar otro correo
            </button>
          </form>
        )}

        <p className="mt-8 flex items-start gap-2 text-caption text-ink-3">
          <LockKeyhole size={14} className="mt-0.5 shrink-0" aria-hidden="true" />
          El permiso se revisa en el servidor cada vez que abres el panel.
        </p>
      </div>
    </main>
  );
}
