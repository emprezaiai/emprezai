'use client';

// Entrada al panel de la dueña: enlace + código al correo (sin contraseñas, 26). La respuesta es la
// misma para cualquier correo; solo el correo admin recibe algo. El permiso se vuelve a verificar
// en el servidor al abrir el panel (eso no se le cuenta a la dueña: no cambia nada para ella).

import { useEffect, useId, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowRight, KeyRound, LoaderCircle, ShieldCheck } from 'lucide-react';
import { Marca } from '@/components/app/Marca';
import { Entrada } from '@/components/admin/movimiento';

const CORREO_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const ESPERA_REENVIO = 60;
const CAMPO =
  'h-14 w-full rounded-[var(--radius-pill)] border border-[color-mix(in_oklab,var(--ink-3)_45%,transparent)] bg-sunken px-5 text-base text-ink-1 placeholder:text-ink-3 focus:border-ink-2 focus:outline-none';
const BOTON = 'boton-oro mt-4 flex h-14 w-full items-center justify-center gap-2 rounded-[var(--radius-pill)] font-display text-base font-bold transition-transform duration-100 active:scale-[0.97] disabled:opacity-70';

export function EntrarPanel() {
  const router = useRouter();
  const reduce = useReducedMotion();
  const idCorreo = useId();
  const idCodigo = useId();
  const [email, setEmail] = useState('');
  const [codigo, setCodigo] = useState('');
  const [paso, setPaso] = useState<'correo' | 'codigo'>('correo');
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');
  const [aviso, setAviso] = useState('');
  const [espera, setEspera] = useState(0);

  useEffect(() => {
    if (espera <= 0) return;
    const t = window.setTimeout(() => setEspera((s) => s - 1), 1000);
    return () => window.clearTimeout(t);
  }, [espera]);

  /** Pide el enlace y el código. Devuelve true si salió bien. */
  async function enviar(correo: string): Promise<boolean> {
    try {
      const res = await fetch('/api/admin/entrar', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: correo }) });
      if (res.ok) return true;
      setError(
        res.status === 429
          ? 'Pediste varios enlaces seguidos. Espera unos minutos.'
          : res.status === 503
            ? 'Todavía no conectamos el envío de correos. Escríbeme y lo activamos.'
            : 'No pudimos enviar el correo ahora. Intenta en un minuto.',
      );
    } catch {
      setError('Sin conexión. Revisa tu internet e intenta de nuevo.');
    }
    return false;
  }

  async function pedir(ev: React.FormEvent) {
    ev.preventDefault();
    const limpio = email.trim().toLowerCase();
    if (!CORREO_VALIDO.test(limpio)) {
      setError('Escribe tu correo completo. Ejemplo: tu@correo.com');
      return;
    }
    setCargando(true);
    setError('');
    if (await enviar(limpio)) {
      setEmail(limpio);
      setPaso('codigo');
      setEspera(ESPERA_REENVIO);
    }
    setCargando(false);
  }

  async function reenviar() {
    setError('');
    setAviso('');
    setEspera(ESPERA_REENVIO);
    if (await enviar(email)) setAviso('Te mandamos un correo nuevo. Usa el código más reciente.');
    else setEspera(0);
  }

  async function verificar(ev: React.FormEvent) {
    ev.preventDefault();
    if (!/^\d{6,8}$/.test(codigo)) {
      setError('Escribe el código de números que llegó a tu correo.');
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
      setError(res.status === 429 ? 'Demasiados intentos. Espera 15 minutos o toca el botón del correo.' : 'Ese código no coincide o ya venció. Pide uno nuevo abajo.');
    } catch {
      setError('Sin conexión. Revisa tu internet e intenta de nuevo.');
    }
    setCargando(false);
  }

  return (
    <main className="fondo-recorrido flex min-h-dvh flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <Entrada indice={0} className="flex items-center justify-between gap-3">
          <span className="flex items-center gap-2">
            <Marca tamano="md" />
            <span className="rounded-[var(--radius-pill)] border border-[var(--line)] px-2 py-0.5 text-xs font-semibold text-ink-2">Panel</span>
          </span>
          {/* El guía de la marca, flotando suave (quieto si se pidió menos movimiento) */}
          <motion.span aria-hidden="true" className="block size-16 shrink-0" animate={reduce ? undefined : { y: [0, -6, 0] }} transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}>
            <Image src="/marca/personaje.webp" alt="" width={64} height={64} unoptimized className="size-full object-contain drop-shadow-[0_6px_8px_rgb(0_0_0/0.5)]" />
          </motion.span>
        </Entrada>

        <Entrada indice={1}>
          <h1 className="mt-6 font-display text-pregunta font-extrabold text-ink-1">{paso === 'correo' ? 'Entra a tu panel' : 'Revisa tu correo'}</h1>
          <p className="mt-2 text-ayuda text-ink-2">
            {paso === 'correo' ? (
              <>
                Tus ventas, tu ganancia y tus clientes en un solo lugar. Te llega <strong className="font-semibold text-ink-1">un enlace y un código</strong> para entrar.
              </>
            ) : (
              <>
                Si <strong className="font-semibold [overflow-wrap:anywhere] text-ink-1">{email}</strong> es el correo del panel, ya te llegaron un enlace y un código. Toca el enlace o escribe el código aquí.
              </>
            )}
          </p>
        </Entrada>

        {paso === 'correo' ? (
          <Entrada indice={2}>
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
                className={CAMPO}
              />
              {error && (
                <p role="alert" className="text-caption text-danger">
                  {error}
                </p>
              )}
              <button type="submit" disabled={cargando} className={BOTON}>
                {cargando ? <LoaderCircle size={20} className="motion-safe:animate-spin" aria-hidden="true" /> : null}
                {cargando ? 'Enviando…' : 'Enviarme el enlace'}
                {!cargando && <ArrowRight size={20} aria-hidden="true" />}
              </button>
            </form>
          </Entrada>
        ) : (
          <Entrada indice={2}>
            <form onSubmit={verificar} noValidate className="mt-8 flex flex-col gap-2">
              <label htmlFor={idCodigo} className="text-caption font-semibold text-ink-1">
                Código del correo
              </label>
              <input
                id={idCodigo}
                inputMode="numeric"
                autoComplete="one-time-code"
                autoFocus
                maxLength={8}
                value={codigo}
                onChange={(e) => {
                  setCodigo(e.target.value.replace(/\D/g, '').slice(0, 8));
                  setError('');
                }}
                placeholder="Solo números"
                aria-invalid={Boolean(error)}
                className={`${CAMPO} text-center font-display text-xl font-bold tracking-[0.3em] tabular-nums placeholder:font-sans placeholder:text-base placeholder:font-normal placeholder:tracking-normal`}
              />
              {error && (
                <p role="alert" className="text-caption text-danger">
                  {error}
                </p>
              )}
              {aviso && !error && (
                <p role="status" className="text-caption text-green">
                  {aviso}
                </p>
              )}
              <button type="submit" disabled={cargando} className={BOTON}>
                {cargando ? <LoaderCircle size={20} className="motion-safe:animate-spin" aria-hidden="true" /> : <KeyRound size={20} aria-hidden="true" />}
                {cargando ? 'Revisando…' : 'Entrar con el código'}
              </button>
              <div className="mt-2 flex items-center justify-between gap-3">
                <button type="button" onClick={reenviar} disabled={espera > 0} className="flex min-h-11 items-center text-caption font-semibold text-ink-1 underline underline-offset-4 disabled:text-ink-3 disabled:no-underline">
                  {espera > 0 ? `Reenviar en ${espera} s` : 'Reenviar el correo'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPaso('correo');
                    setCodigo('');
                    setError('');
                    setAviso('');
                  }}
                  className="flex min-h-11 items-center text-caption font-semibold text-ink-2"
                >
                  Usar otro correo
                </button>
              </div>
            </form>
          </Entrada>
        )}

        <Entrada indice={3}>
          <p className="mt-8 flex items-start gap-2 text-caption text-ink-3">
            <ShieldCheck size={14} className="mt-0.5 shrink-0" aria-hidden="true" />
            Solo tu correo abre este panel. Nadie más puede ver tus números.
          </p>
        </Entrada>
      </div>
    </main>
  );
}
