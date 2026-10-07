'use client';

// ENTRAR (50 §E): después de los planes, nunca antes. Sin contraseñas: enlace de acceso por correo
// (método Hotmart-first de 26). Estados diseñados: enviando · enviado (reenviar con cuenta atrás de
// 60 s) · error humano y genérico (no revela si el correo existe).
// HOY no hay servidor de correo: la pantalla "enviado" ofrece una VISTA PREVIA honesta que simula
// abrir el enlace y crea la cuenta en este celular (se reemplaza por Supabase en la Sesión 6).

import { useEffect, useId, useState, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ArrowRight, LoaderCircle, LockKeyhole, MailCheck, RotateCcw } from 'lucide-react';
import { LogoEmpresai } from '@/components/app/LogoEmpresai';
import { EASE_SALIDA, RutaMini, TituloAcento, vibrar } from '@/components/onboarding/piezas';
import { crearCuenta, useCuenta } from '@/lib/cuenta';
import { leerEstado } from '@/lib/onboarding';

const ACCESO_REAL = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL);
const ESPERA_REENVIO = 60;
const CORREO_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const suscribirNada = () => () => {};

export function Acceso() {
  const cuenta = useCuenta();
  const router = useRouter();
  const reduce = useReducedMotion();
  const idCampo = useId();
  const tienePieza = useSyncExternalStore(
    suscribirNada,
    () => Boolean(leerEstado()?.primeraPieza),
    () => false,
  );
  const [email, setEmail] = useState('');
  const [estado, setEstado] = useState<'inicio' | 'enviando' | 'enviado' | 'error'>('inicio');
  const [errorCampo, setErrorCampo] = useState('');
  const [espera, setEspera] = useState(0);

  // Ya tiene sesión: directo a su ruta.
  useEffect(() => {
    if (cuenta) router.replace('/app');
  }, [cuenta, router]);

  useEffect(() => {
    if (espera <= 0) return;
    const t = window.setTimeout(() => setEspera((s) => s - 1), 1000);
    return () => window.clearTimeout(t);
  }, [espera]);

  function enviar(ev?: React.FormEvent) {
    ev?.preventDefault();
    const limpio = email.trim().toLowerCase();
    if (!CORREO_VALIDO.test(limpio)) {
      setErrorCampo('Revisa tu correo: parece que le falta algo (ejemplo: tu@correo.com).');
      vibrar(30);
      return;
    }
    if (!navigator.onLine) {
      setErrorCampo('');
      setEstado('error');
      return;
    }
    setErrorCampo('');
    setEstado('enviando');
    // Sesión 6: aquí se llama al servidor (Supabase, enlace + código de 6 dígitos, límite de intentos).
    window.setTimeout(() => {
      setEmail(limpio);
      setEstado('enviado');
      setEspera(ESPERA_REENVIO);
    }, 700);
  }

  function abrirVistaPrevia() {
    crearCuenta(email);
    router.replace('/app');
  }

  const entrar = (i: number) => ({
    initial: { opacity: 0, y: reduce ? 0 : 12 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.35, delay: reduce ? 0 : i * 0.06, ease: EASE_SALIDA },
  });

  return (
    <main className="fondo-recorrido min-h-dvh overflow-x-clip">
      <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col px-4">
        <motion.header {...entrar(0)} className="flex h-16 items-center">
          <Link href="/" className="flex min-h-11 items-center gap-2" aria-label="EMPRESAI, ir al inicio">
            <LogoEmpresai tamano={28} />
            <span className="font-display text-lg font-extrabold text-ink-1">EMPRESAI</span>
          </Link>
        </motion.header>

        <AnimatePresence mode="wait" initial={false}>
          {estado === 'enviado' ? (
            <motion.section
              key="enviado"
              initial={{ opacity: 0, x: reduce ? 0 : 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: EASE_SALIDA }}
              className="pt-8"
              aria-live="polite"
            >
              <span aria-hidden="true" className="relieve-verde flex size-16 items-center justify-center rounded-full">
                <MailCheck size={30} strokeWidth={2.2} />
              </span>
              <TituloAcento texto="Revisa tu correo" acento="tu correo" className="mt-6 text-pregunta" />
              <p className="mt-2 text-base text-ink-2">
                Te enviamos un enlace de acceso a <strong className="font-semibold break-all text-ink-1">{email}</strong>. Ábrelo desde este celular.
              </p>

              {!ACCESO_REAL && (
                <div className="mt-6 rounded-[var(--radius-card)] border border-dashed border-gold p-4">
                  <p className="text-sm font-semibold text-ink-1">Vista previa</p>
                  <p className="mt-1 text-caption text-ink-2">
                    Todavía no enviamos correos de verdad: se conectan en la próxima etapa. Mientras tanto, simula que abriste el enlace.
                  </p>
                  <button
                    type="button"
                    onClick={abrirVistaPrevia}
                    className="boton-oro mt-4 flex h-14 w-full items-center justify-center gap-2 rounded-[var(--radius-pill)] font-display text-boton font-bold"
                  >
                    Abrir el enlace (vista previa)
                    <ArrowRight size={20} aria-hidden="true" />
                  </button>
                </div>
              )}

              <div className="mt-6 flex flex-col items-center">
                <button
                  type="button"
                  disabled={espera > 0}
                  onClick={() => {
                    setEspera(ESPERA_REENVIO);
                    vibrar();
                  }}
                  className="flex min-h-11 items-center gap-2 text-sm font-semibold text-ink-1 disabled:text-ink-3"
                >
                  <RotateCcw size={16} aria-hidden="true" />
                  {espera > 0 ? `Reenviar en ${espera} s` : 'Reenviar el enlace'}
                </button>
                <button type="button" onClick={() => setEstado('inicio')} className="flex min-h-11 items-center text-sm font-semibold text-ink-2">
                  Usar otro correo
                </button>
              </div>
            </motion.section>
          ) : (
            <motion.section key="inicio" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, x: reduce ? 0 : -16 }} transition={{ duration: 0.25 }} className="pt-8">
              <motion.div {...entrar(1)}>
                <TituloAcento texto="Entra a tu ruta de 30 días" acento="tu ruta" className="text-pregunta" />
                <p className="mt-2 text-base text-ink-2">
                  {tienePieza ? 'Así guardas tu pieza 1 y la ves desde cualquier celular.' : 'Usa el correo con el que compraste en Hotmart.'}
                </p>
              </motion.div>

              <motion.form {...entrar(2)} onSubmit={enviar} noValidate className="mt-8 flex flex-col gap-2">
                <label htmlFor={idCampo} className="text-sm font-semibold text-ink-1">
                  Tu correo
                </label>
                <input
                  id={idCampo}
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  autoFocus
                  value={email}
                  onChange={(ev) => setEmail(ev.target.value)}
                  placeholder="tu@correo.com"
                  aria-invalid={Boolean(errorCampo)}
                  aria-describedby={errorCampo ? `${idCampo}-error` : undefined}
                  className={`h-14 w-full rounded-[var(--radius-chip)] border bg-sunken px-4 text-base text-ink-1 placeholder:text-ink-3 focus:border-gold focus:outline-none ${
                    errorCampo ? 'border-warning' : 'border-[var(--line)]'
                  }`}
                />
                {errorCampo && (
                  <p id={`${idCampo}-error`} className="text-caption text-warning">
                    {errorCampo}
                  </p>
                )}
                {estado === 'error' && (
                  <p role="alert" className="text-caption text-warning">
                    No pudimos enviar el enlace. Revisa tu conexión e intenta de nuevo.
                  </p>
                )}
                <button
                  type="submit"
                  disabled={estado === 'enviando'}
                  className="boton-oro mt-4 flex h-14 w-full items-center justify-center gap-2 rounded-[var(--radius-pill)] font-display text-boton font-bold"
                >
                  {estado === 'enviando' ? (
                    <>
                      <LoaderCircle size={20} className="motion-safe:animate-spin" aria-hidden="true" />
                      Enviando…
                    </>
                  ) : (
                    <>
                      Enviarme mi enlace de acceso
                      <ArrowRight size={20} aria-hidden="true" />
                    </>
                  )}
                </button>
                <p className="mt-2 flex items-start gap-2 text-caption text-ink-2">
                  <LockKeyhole size={16} className="mt-0.5 shrink-0 text-ink-3" aria-hidden="true" />
                  Sin contraseñas: te llega un enlace de un solo uso.
                </p>
              </motion.form>

              <motion.div {...entrar(3)} className="mt-8">
                <RutaMini
                  titulo="Tu ruta te espera"
                  respuestas={tienePieza ? [{ texto: 'Pieza 1 lista', tipo: 'logro' }, { texto: 'Mañana: tu cliente ideal', tipo: 'freno' }] : []}
                />
              </motion.div>

              {!tienePieza && (
                <motion.p {...entrar(4)} className="mt-6 text-center text-sm text-ink-2">
                  ¿Aún no armas tu pieza 1?{' '}
                  <Link href="/onboarding" className="font-semibold text-ink-1 underline underline-offset-4">
                    Empieza gratis aquí
                  </Link>
                </motion.p>
              )}
            </motion.section>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
