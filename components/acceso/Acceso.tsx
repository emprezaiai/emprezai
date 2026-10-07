'use client';

// ENTRAR (50 §E): después de los planes, nunca antes. Sin contraseñas: enlace de acceso por correo
// + código de 6 dígitos (26, Hotmart-first). Estados diseñados: enviando · enviado (código, reenviar
// con cuenta atrás de 60 s, ayuda "¿no te llega?") · error humano y genérico (anti-enumeración).
//
// SEGURIDAD (fail-closed): mientras no hay servidor de correo (Supabase, Sesión 6) NADIE puede entrar
// en producción. Solo con NEXT_PUBLIC_VISTA_PREVIA=1 (en el computador de desarrollo, .env.local)
// aparece el "modo demostración" que crea la cuenta en este celular. En la Sesión 6 el acceso real
// se valida EN SERVIDOR (sesión + suscripción activa por webhook de Hotmart).

import { useEffect, useId, useRef, useState, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ArrowRight, KeyRound, LoaderCircle, LockKeyhole, MailCheck, RotateCcw } from 'lucide-react';
import { LogoEmpresai } from '@/components/app/LogoEmpresai';
import { EASE_SALIDA, RutaMini, TituloAcento, vibrar } from '@/components/onboarding/piezas';
import { crearCuenta, useCuenta } from '@/lib/cuenta';
import { leerEstado } from '@/lib/onboarding';

const ACCESO_REAL = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL);
const BANDERA_DEMO = !ACCESO_REAL && process.env.NEXT_PUBLIC_VISTA_PREVIA === '1';
const demoPermitida = () => BANDERA_DEMO && ['localhost', '127.0.0.1'].includes(window.location.hostname);
const ESPERA_REENVIO = 60;
const CORREO_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const suscribirNada = () => () => {};

export function Acceso() {
  const cuenta = useCuenta();
  const router = useRouter();
  const reduce = useReducedMotion();
  const idCampo = useId();
  const idCodigo = useId();
  const campo = useRef<HTMLInputElement>(null);
  const tienePieza = useSyncExternalStore(
    suscribirNada,
    () => Boolean(leerEstado()?.primeraPieza),
    () => false,
  );
  const [email, setEmail] = useState('');
  const [codigo, setCodigo] = useState('');
  const [estado, setEstado] = useState<'inicio' | 'enviando' | 'enviado' | 'pronto' | 'error'>('inicio');
  const [demo, setDemo] = useState(false);
  const [errorCampo, setErrorCampo] = useState('');
  const [errorCodigo, setErrorCodigo] = useState('');
  const [espera, setEspera] = useState(0);
  const [reenviado, setReenviado] = useState(false);
  const [intentos, setIntentos] = useState(0);

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
      setErrorCampo(limpio ? 'Ese correo parece incompleto. Ejemplo: tu@correo.com' : 'Escribe tu correo para recibir el enlace.');
      setIntentos((n) => n + 1);
      vibrar(30);
      campo.current?.focus();
      return;
    }
    if (!navigator.onLine) {
      setErrorCampo('');
      setEstado('error');
      return;
    }
    setErrorCampo('');
    setEstado('enviando');
    // Sesión 6: aquí se pide al servidor el enlace + código (límite de intentos; mismo mensaje exista o no el correo).
    const enDemo = demoPermitida();
    window.setTimeout(() => {
      setEmail(limpio);
      setDemo(enDemo);
      setEstado(ACCESO_REAL || enDemo ? 'enviado' : 'pronto');
      setEspera(ESPERA_REENVIO);
      setReenviado(false);
    }, 700);
  }

  function entrarConCodigo(ev: React.FormEvent) {
    ev.preventDefault();
    if (!/^\d{6}$/.test(codigo)) {
      setErrorCodigo('El código tiene 6 números. Cópialo tal cual del correo.');
      vibrar(30);
      return;
    }
    if (demo) {
      entrarDemostracion();
      return;
    }
    // Sin servidor no se puede verificar: nunca se deja entrar a ciegas (fail-closed).
    setErrorCodigo('No pudimos verificar el código. Pide uno nuevo e intenta otra vez.');
  }

  function entrarDemostracion() {
    if (!demoPermitida()) return;
    crearCuenta(email);
    router.replace('/app');
  }

  if (cuenta !== null) return <main className="fondo-recorrido min-h-dvh" aria-busy="true" />;

  const entrar = (i: number) => ({
    initial: { opacity: 0, y: reduce ? 0 : 12 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.35, delay: reduce ? 0 : i * 0.06, ease: EASE_SALIDA },
  });

  return (
    <main className="fondo-recorrido min-h-dvh overflow-x-clip">
      <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col px-4 pb-8">
        <motion.header {...entrar(0)} className="flex h-16 items-center">
          <Link href="/" className="flex min-h-11 items-center gap-2" aria-label="EMPRESAI, ir al inicio">
            <LogoEmpresai tamano={28} />
            <span className="font-display text-lg font-extrabold text-ink-1">EMPRESAI</span>
          </Link>
        </motion.header>

        <AnimatePresence mode="wait" initial={false}>
          {estado === 'pronto' ? (
            <motion.section key="pronto" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-1 flex-col pt-8" aria-live="polite">
              <TituloAcento texto="El acceso abre muy pronto" acento="muy pronto" className="text-pregunta" />
              <p className="mt-2 text-base text-ink-2">
                Estamos terminando de activar la entrada a la app. Guarda este correo: es el que usarás para entrar,{' '}
                <strong className="font-semibold [overflow-wrap:anywhere] text-ink-1">{email}</strong>.
              </p>
              {tienePieza && (
                <p className="mt-4 flex items-start gap-2 text-caption text-ink-2">
                  <LockKeyhole size={16} className="mt-0.5 shrink-0 text-green" aria-hidden="true" />
                  Tu pieza 1 queda guardada en este celular: al entrar, pasa a tu cuenta sola.
                </p>
              )}
              <button
                type="button"
                onClick={() => setEstado('inicio')}
                className="mt-6 flex min-h-11 items-center text-sm font-semibold text-ink-2 transition-transform duration-100 active:scale-[0.97]"
              >
                Usar otro correo
              </button>
              <div className="mt-auto pt-8">
                <RutaMini destacada titulo="Tu ruta te espera" respuestas={tienePieza ? [{ texto: 'Pieza 1 lista', tipo: 'logro' }] : [{ texto: '5 minutos al día', tipo: 'freno' }]} />
              </div>
            </motion.section>
          ) : estado === 'enviado' ? (
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
              <TituloAcento texto="Te enviamos tu enlace" acento="tu enlace" className="mt-6 text-pregunta" />
              <p className="mt-2 text-base text-ink-2">
                Lo mandamos a <strong className="font-semibold [overflow-wrap:anywhere] text-ink-1">{email}</strong>. Ábrelo desde este celular o escribe el código
                que viene en el correo.
              </p>

              <form onSubmit={entrarConCodigo} noValidate className="mt-6 flex flex-col gap-2">
                <label htmlFor={idCodigo} className="text-sm font-semibold text-ink-1">
                  Código de 6 números
                </label>
                <input
                  id={idCodigo}
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={6}
                  value={codigo}
                  onChange={(ev) => {
                    setCodigo(ev.target.value.replace(/\D/g, '').slice(0, 6));
                    setErrorCodigo('');
                  }}
                  placeholder="6 números"
                  aria-invalid={Boolean(errorCodigo)}
                  aria-describedby={errorCodigo ? `${idCodigo}-error` : undefined}
                  className={`h-14 w-full rounded-[var(--radius-pill)] border bg-sunken px-5 text-center font-display text-xl font-bold tracking-[0.3em] text-ink-1 tabular-nums placeholder:font-sans placeholder:text-base placeholder:font-normal placeholder:tracking-normal placeholder:text-ink-3 focus:outline-none ${
                    errorCodigo ? 'border-danger' : 'border-[var(--line)] focus:border-gold'
                  }`}
                />
                {errorCodigo && (
                  <p id={`${idCodigo}-error`} role="alert" className="text-caption text-danger">
                    {errorCodigo}
                  </p>
                )}
                <button type="submit" className="boton-oro mt-2 flex h-14 w-full items-center justify-center gap-2 rounded-[var(--radius-pill)] font-display text-boton font-bold">
                  <KeyRound size={20} aria-hidden="true" />
                  Entrar con el código
                </button>
              </form>

              <p className="mt-4 text-caption text-ink-2">¿No te llega? Revisa Spam o Promociones; a veces tarda un minuto.</p>

              {demo && (
                <div className="tarjeta-relieve-base mt-6 rounded-[var(--radius-card)] p-4">
                  <p className="text-sm font-semibold text-ink-1">Modo demostración</p>
                  <p className="mt-1 text-caption text-ink-2">Entra sin esperar el correo. Solo existe en esta versión de prueba.</p>
                  <button
                    type="button"
                    onClick={entrarDemostracion}
                    className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-[var(--radius-pill)] border border-[var(--line)] bg-raised-2 font-display text-base font-bold text-ink-1 transition-transform duration-100 active:scale-[0.97]"
                  >
                    Entrar en modo demostración
                    <ArrowRight size={18} aria-hidden="true" />
                  </button>
                </div>
              )}

              <div className="mt-6 flex flex-col items-center">
                <button
                  type="button"
                  disabled={espera > 0}
                  onClick={() => {
                    setEspera(ESPERA_REENVIO);
                    setReenviado(true);
                    vibrar();
                  }}
                  className="flex min-h-11 items-center gap-2 text-sm font-semibold text-ink-1 transition-transform duration-100 active:scale-[0.97] disabled:text-ink-3"
                >
                  <RotateCcw size={16} aria-hidden="true" />
                  {espera > 0 ? `Reenviar en ${espera} s` : 'Reenviar el enlace'}
                </button>
                <p role="status" className={reenviado ? 'text-caption text-green' : 'sr-only'}>
                  {reenviado ? (demo ? 'En modo demostración no se envían correos.' : 'Te reenviamos el enlace.') : ''}
                </p>
                <button
                  type="button"
                  onClick={() => setEstado('inicio')}
                  className="flex min-h-11 items-center text-sm font-semibold text-ink-2 transition-transform duration-100 active:scale-[0.97]"
                >
                  Usar otro correo
                </button>
              </div>
            </motion.section>
          ) : (
            <motion.section
              key="inicio"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, x: reduce ? 0 : -16 }}
              transition={{ duration: 0.25 }}
              className="flex flex-1 flex-col pt-8"
            >
              <motion.div {...entrar(1)}>
                <TituloAcento texto="Entra a tu ruta de 30 días" acento="tu ruta" className="text-pregunta" />
                <p className="mt-2 text-base text-ink-2">
                  {tienePieza ? (
                    <>
                      Usa el <strong className="font-semibold text-ink-1">mismo correo con el que pagaste en Hotmart</strong>: así guardas tu pieza 1 y tu plan.
                    </>
                  ) : (
                    <>
                      Usa el <strong className="font-semibold text-ink-1">correo con el que pagaste en Hotmart</strong>.
                    </>
                  )}
                </p>
              </motion.div>

              <motion.form {...entrar(2)} onSubmit={enviar} noValidate className="mt-8 flex flex-col gap-2">
                <label htmlFor={idCampo} className="text-sm font-semibold text-ink-1">
                  Tu correo
                </label>
                <input
                  ref={campo}
                  id={idCampo}
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  autoFocus
                  value={email}
                  onChange={(ev) => {
                    setEmail(ev.target.value);
                    if (errorCampo) setErrorCampo('');
                  }}
                  placeholder="tu@correo.com"
                  aria-invalid={Boolean(errorCampo)}
                  aria-describedby={errorCampo ? `${idCampo}-error` : undefined}
                  key={intentos}
                  className={`h-14 w-full rounded-[var(--radius-pill)] border bg-sunken px-5 text-base text-ink-1 placeholder:text-ink-3 focus:outline-none ${
                    errorCampo ? 'sacudir border-danger' : 'border-[var(--line)] focus:border-gold'
                  }`}
                />
                {errorCampo && (
                  <p id={`${idCampo}-error`} role="alert" className="text-caption text-danger">
                    {errorCampo}
                  </p>
                )}
                {estado === 'error' && (
                  <p role="alert" className="text-caption text-danger">
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
                  <span>
                    Sin contraseñas: te llega un enlace de un solo uso. <strong className="font-semibold text-ink-1">Tu idea es tuya:</strong> solo tú ves lo que
                    armas.
                  </span>
                </p>
              </motion.form>

              <motion.div {...entrar(3)} className="mt-auto pt-8">
                <RutaMini
                  destacada
                  titulo={tienePieza ? 'Tu ruta te espera' : 'Lo que te espera adentro'}
                  respuestas={
                    tienePieza
                      ? [
                          { texto: 'Pieza 1 lista', tipo: 'logro' },
                          { texto: 'Mañana: tu cliente ideal · 5 min', tipo: 'freno' },
                        ]
                      : [{ texto: '5 minutos al día', tipo: 'freno' }]
                  }
                />
                <p className="mt-3 text-center text-caption text-ink-2">
                  Tu negocio, pieza a pieza: hoy ya sabes qué hacer, y en 5 minutos está hecho.
                </p>
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
