'use client';

// ENTRAR (50 §E): después de los planes, nunca antes. Sin contraseñas: enlace de acceso por correo
// + código de 6 dígitos (26, Hotmart-first). Estados diseñados: enviando · enviado (código, reenviar
// con cuenta atrás de 60 s, ayuda "¿no te llega?") · error humano y genérico (anti-enumeración).
//
// ACCESO REAL (con Supabase conectado): /api/acceso/enviar manda enlace + código SOLO si el correo
// tiene una compra vigente (respuesta uniforme, anti-enumeración); /api/acceso/verificar crea la
// sesión en servidor. La puerta de /app la decide el servidor (sesión + suscripción).
// SIN Supabase (fail-closed): nadie entra en producción; solo con NEXT_PUBLIC_VISTA_PREVIA=1 en el
// computador de desarrollo aparece el "modo demostración" que crea la cuenta en este celular.

import { useEffect, useId, useRef, useState, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ArrowRight, Check, CheckCircle2, CircleAlert, Copy, KeyRound, LoaderCircle, MailCheck, RotateCcw, ShieldCheck } from 'lucide-react';
import { Marca } from '@/components/app/Marca';
import { CheckCustom, EASE_SALIDA, RutaMini, TituloAcento, vibrar } from '@/components/onboarding/piezas';
import { crearCuenta, useCuenta } from '@/lib/cuenta';
import { leerEstado } from '@/lib/onboarding';
import { RESPONSABLE } from '@/lib/legal';

const ACCESO_REAL = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL);
const BANDERA_DEMO = !ACCESO_REAL && process.env.NEXT_PUBLIC_VISTA_PREVIA === '1';
const demoPermitida = () => BANDERA_DEMO && ['localhost', '127.0.0.1'].includes(window.location.hostname);
const ESPERA_REENVIO = 60;
const CORREO_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Si escribió mal un dominio muy usado (gmial.com, hotmal.com), se le sugiere el correcto. El
// servidor responde igual a todos los correos (anti-enumeración), así que sin esta ayuda quien se
// equivoca de dominio esperaría un correo que nunca llega. Se compara solo el nombre (antes del
// primer punto) y se conserva su terminación (.com, .es, .cl…); los dominios reales parecidos
// (ymail, mail, email, hotmail.cl…) nunca se "corrigen".
const NOMBRES_COMUNES = ['gmail', 'hotmail', 'outlook', 'yahoo', 'icloud', 'live'];
const NOMBRES_REALES = new Set(['gmail', 'hotmail', 'outlook', 'yahoo', 'icloud', 'live', 'ymail', 'mail', 'email', 'aol', 'msn', 'proton', 'protonmail', 'gmx', 'zoho', 'me', 'mac']);

/** Distancia de edición contando como 1 el cambio de dos letras vecinas ("gmial" → "gmail"). */
function distancia(a: string, b: string): number {
  const d = Array.from({ length: a.length + 1 }, (_, i) => Array.from({ length: b.length + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0)));
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const costo = a[i - 1] === b[j - 1] ? 0 : 1;
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + costo);
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
    }
  }
  return d[a.length][b.length];
}

/** "carla@gmial.com" → "carla@gmail.com"; undefined si el dominio es real o no se parece a uno común. */
function sugerirCorreo(correo: string): string | undefined {
  const [usuario, dominio] = correo.trim().toLowerCase().split('@');
  if (!usuario || !dominio || !CORREO_VALIDO.test(correo.trim())) return undefined;
  const punto = dominio.indexOf('.');
  const nombre = dominio.slice(0, punto);
  const terminacion = dominio.slice(punto);
  // Gmail solo existe como gmail.com.
  if (nombre === 'gmail') return dominio === 'gmail.com' ? undefined : `${usuario}@gmail.com`;
  if (NOMBRES_REALES.has(nombre)) return undefined;
  const cercano = NOMBRES_COMUNES.find((c) => distancia(nombre, c) <= (c.length <= 5 ? 1 : 2));
  if (!cercano) return undefined;
  return `${usuario}@${cercano}${cercano === 'gmail' ? '.com' : terminacion}`;
}

/** El soporte, igual en todos los estados: visible, seleccionable y con un botón que lo copia. */
function SoporteLinea({ className = '' }: { className?: string }) {
  const [copiado, setCopiado] = useState(false);
  async function copiar() {
    try {
      await navigator.clipboard.writeText(RESPONSABLE.emailContacto);
      setCopiado(true);
      window.setTimeout(() => setCopiado(false), 2000);
    } catch {
      // Sin permiso de portapapeles: la dirección sigue visible y seleccionable.
    }
  }
  return (
    <p className={`flex flex-wrap items-center gap-x-2 text-caption text-ink-2 ${className}`}>
      <span>
        Soporte: <span className="font-semibold [overflow-wrap:anywhere] text-ink-1 select-all">{RESPONSABLE.emailContacto}</span>
      </span>
      <button
        type="button"
        onClick={copiar}
        className="inline-flex min-h-11 items-center gap-1 font-semibold text-ink-1 underline-offset-4 hover:underline"
      >
        {copiado ? <Check size={14} aria-hidden="true" /> : <Copy size={14} aria-hidden="true" />}
        <span aria-live="polite">{copiado ? 'Copiado' : 'Copiar'}</span>
      </button>
    </p>
  );
}

const suscribirNada = () => () => {};
const leerAvisoUrl = () => new URLSearchParams(window.location.search).get('estado') ?? '';

// Mientras el acceso no abre, el correo de compra queda guardado en este celular (y vuelve escrito).
const CLAVE_CORREO = 'empresai_correo_acceso';
function leerCorreo(): string {
  try {
    return localStorage.getItem(CLAVE_CORREO) ?? '';
  } catch {
    return '';
  }
}
function guardarCorreo(correo: string): boolean {
  try {
    localStorage.setItem(CLAVE_CORREO, correo);
    return true;
  } catch {
    return false;
  }
}

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
  const correoGuardado = useSyncExternalStore(suscribirNada, leerCorreo, () => '');
  const [escrito, setEmail] = useState<string | null>(null);
  const email = escrito ?? correoGuardado;
  const [noGuardado, setNoGuardado] = useState(false);
  const [codigo, setCodigo] = useState('');
  const [estado, setEstado] = useState<'inicio' | 'enviando' | 'enviado' | 'pronto' | 'error'>('inicio');
  // El error del servidor no se disfraza de error de conexión (h9).
  const [falla, setFalla] = useState<'red' | 'servidor'>('red');
  const [demo, setDemo] = useState(false);
  const [errorCampo, setErrorCampo] = useState('');
  const [errorCodigo, setErrorCodigo] = useState('');
  const [espera, setEspera] = useState(0);
  const [reenviado, setReenviado] = useState(false);
  const [intentos, setIntentos] = useState(0);
  const [verificando, setVerificando] = useState(false);
  const avisoUrl = useSyncExternalStore(suscribirNada, leerAvisoUrl, () => '');
  // Se calcula al salir del campo o al enviar (no mientras escribe "gmail.co" antes de la "m").
  const [sugerencia, setSugerencia] = useState<string | undefined>(undefined);

  // Versión de prueba local: con cuenta en el celular, directo a su ruta. (Con acceso real, la
  // sesión la decide el servidor: una copia local no es una sesión.)
  useEffect(() => {
    if (!ACCESO_REAL && cuenta) router.replace('/app');
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
      setFalla('red');
      setEstado('error');
      return;
    }
    setErrorCampo('');
    // Primer toque con un dominio dudoso: se muestra la sugerencia y no se envía; un segundo toque
    // (o corregirlo) envía. Nunca bloquea para siempre.
    const sugerido = sugerirCorreo(limpio);
    if (sugerido && sugerencia !== sugerido) {
      setSugerencia(sugerido);
      return;
    }
    setEstado('enviando');
    if (ACCESO_REAL) {
      void pedirEnlace(limpio);
      return;
    }
    const enDemo = demoPermitida();
    const quedaGuardado = ACCESO_REAL || enDemo ? true : guardarCorreo(limpio);
    window.setTimeout(() => {
      setNoGuardado(!quedaGuardado);
      setEmail(limpio);
      setDemo(enDemo);
      setEstado(ACCESO_REAL || enDemo ? 'enviado' : 'pronto');
      setEspera(ESPERA_REENVIO);
      setReenviado(false);
    }, 700);
  }

  async function pedirEnlace(limpio: string, reenvio = false) {
    guardarCorreo(limpio);
    try {
      const res = await fetch('/api/acceso/enviar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: limpio }),
      });
      if (res.status === 503) {
        setEmail(limpio);
        setEstado('pronto');
        return;
      }
      if (res.status === 429) {
        setEstado(reenvio ? 'enviado' : 'inicio');
        const mensaje = 'Pediste varios enlaces seguidos. Espera unos minutos y vuelve a intentarlo.';
        if (reenvio) setErrorCodigo(mensaje);
        else setErrorCampo(mensaje);
        return;
      }
      if (!res.ok) {
        setFalla('servidor');
        setEstado(reenvio ? 'enviado' : 'error');
        if (reenvio) setErrorCodigo('No pudimos reenviar el enlace ahora. Intenta en un minuto; si sigue, escríbenos desde el enlace de abajo.');
        return;
      }
      setEmail(limpio);
      setDemo(false);
      setEstado('enviado');
      setEspera(ESPERA_REENVIO);
      setReenviado(reenvio);
    } catch {
      setFalla('red');
      setEstado(reenvio ? 'enviado' : 'error');
      if (reenvio) setErrorCodigo('No pudimos reenviar el enlace. Revisa tu conexión e intenta de nuevo.');
    }
  }

  async function entrarConCodigo(ev: React.FormEvent) {
    ev.preventDefault();
    if (verificando) return;
    if (!/^\d{6,8}$/.test(codigo)) {
      setErrorCodigo('Escribe el código de números tal cual viene en el correo.');
      vibrar(30);
      return;
    }
    if (demo) {
      entrarDemostracion();
      return;
    }
    if (!ACCESO_REAL) {
      // Sin servidor no se puede verificar: nunca se deja entrar a ciegas (fail-closed).
      setErrorCodigo('No pudimos verificar el código. Pide uno nuevo e intenta otra vez.');
      return;
    }
    setVerificando(true);
    try {
      const res = await fetch('/api/acceso/verificar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, codigo }),
      });
      if (res.ok) {
        router.replace('/app');
        return;
      }
      vibrar(30);
      setErrorCodigo(
        res.status === 429
          ? 'Demasiados intentos. Espera 15 minutos o entra con el botón del correo.'
          : res.status >= 500
            ? 'No pudimos revisar el código ahora. Intenta en un minuto; si sigue, escríbenos desde el enlace de abajo.'
            : 'Ese código no coincide o ya venció. Revísalo o pide uno nuevo.',
      );
    } catch {
      setErrorCodigo('No pudimos revisar el código. Revisa tu conexión e intenta de nuevo.');
    } finally {
      setVerificando(false);
    }
  }

  function entrarDemostracion() {
    if (!demoPermitida()) return;
    if (!crearCuenta(email)) {
      setErrorCodigo('No pudimos guardar tu cuenta en este celular. Libera espacio e intenta otra vez.');
      return;
    }
    router.replace('/app');
  }

  if (!ACCESO_REAL && cuenta !== null) return <main className="fondo-recorrido min-h-dvh" aria-busy="true" />;

  const entrar = (i: number) => ({
    initial: { opacity: 0, y: reduce ? 0 : 12 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.35, delay: reduce ? 0 : i * 0.06, ease: EASE_SALIDA },
  });

  return (
    <main className="fondo-recorrido min-h-dvh overflow-x-clip">
      <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col px-4 pb-8">
        <motion.header {...entrar(0)} className="flex h-16 items-center">
          <Link href="/" className="flex min-h-11 items-center gap-2" aria-label="EMPREZAI, ir al inicio">
            <Marca tamano="md" />
          </Link>
        </motion.header>

        <AnimatePresence mode="wait" initial={false}>
          {estado === 'pronto' ? (
            <motion.section
              key="pronto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-1 flex-col justify-center py-8"
              aria-live="polite"
            >
              <span aria-hidden="true" className="relieve-verde flex size-16 items-center justify-center rounded-full">
                <CheckCircle2 size={30} strokeWidth={2.2} />
              </span>
              <TituloAcento
                texto={noGuardado ? 'Anota tu correo de acceso' : 'Tu correo de acceso quedó guardado'}
                acento={noGuardado ? 'correo de acceso' : 'quedó guardado'}
                className="mt-6 text-pregunta"
              />
              <p className="mt-2 text-base text-ink-2">
                Estamos terminando de abrir la entrada a la app. Cuando abra, entras con{' '}
                <strong className="font-semibold [overflow-wrap:anywhere] text-ink-1">{email}</strong>
                {noGuardado ? ' (este celular no tiene espacio para recordarlo).' : ' y aquí ya estará escrito.'}
              </p>
              {tienePieza && (
                <p className="mt-4 flex items-start gap-2 text-caption text-ink-2">
                  <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-green" aria-hidden="true" />
                  Tu pieza 1 queda guardada en este celular: al entrar, pasa a tu cuenta sola.
                </p>
              )}
              <a
                href={`mailto:${RESPONSABLE.emailContacto}?subject=${encodeURIComponent('Ya pagué EMPREZAI y quiero entrar')}&body=${encodeURIComponent(`Mi correo de compra: ${email}`)}`}
                className="mt-6 flex h-12 w-full items-center justify-center rounded-[var(--radius-pill)] border border-[var(--line)] bg-raised-2 font-display text-base font-bold text-ink-1 transition-transform duration-100 active:scale-[0.97]"
              >
                Ya pagué: pedir mi acceso
              </a>
              <SoporteLinea className="mt-2 justify-center" />
              <button
                type="button"
                onClick={() => setEstado('inicio')}
                className="mt-2 flex min-h-11 items-center justify-center text-caption font-semibold text-ink-2 transition-transform duration-100 active:scale-[0.97]"
              >
                Corregir mi correo
              </button>
              <div className="mt-8">
                <RutaMini
                  destacada
                  titulo="Tu ruta te espera"
                  respuestas={
                    tienePieza
                      ? [
                          { texto: 'Pieza 1 lista', tipo: 'logro' },
                          { texto: 'Mañana: tu cliente ideal · 5 min', tipo: 'freno' },
                        ]
                      : [{ texto: '5 minutos al día', tipo: 'freno' }]
                  }
                />
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
              <TituloAcento texto="Revisa tu correo" acento="tu correo" className="mt-6 text-pregunta" />
              <p className="mt-2 text-base text-ink-2">
                Escribimos a <strong className="font-semibold [overflow-wrap:anywhere] text-ink-1">{email}</strong>. Si tiene una compra activa, te llegan tu
                enlace y tu código; si no, te explicamos qué hacer.
              </p>

              <form onSubmit={entrarConCodigo} noValidate className="mt-6 flex flex-col gap-2">
                <label htmlFor={idCodigo} className="text-caption font-semibold text-ink-1">
                  Código del correo
                </label>
                <input
                  id={idCodigo}
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={8}
                  value={codigo}
                  onChange={(ev) => {
                    setCodigo(ev.target.value.replace(/\D/g, '').slice(0, 8));
                    setErrorCodigo('');
                  }}
                  placeholder="Solo números"
                  aria-invalid={Boolean(errorCodigo)}
                  aria-describedby={errorCodigo ? `${idCodigo}-error` : undefined}
                  className={`h-14 w-full rounded-[var(--radius-pill)] border bg-sunken px-5 text-center font-display text-xl font-bold tracking-[0.3em] text-ink-1 tabular-nums placeholder:font-sans placeholder:text-base placeholder:font-normal placeholder:tracking-normal placeholder:text-ink-3 focus:outline-none ${
                    errorCodigo ? 'border-danger' : 'border-[color-mix(in_oklab,var(--ink-3)_45%,transparent)] focus:border-ink-2'
                  }`}
                />
                {errorCodigo && (
                  <p id={`${idCodigo}-error`} role="alert" className="text-caption text-danger">
                    {errorCodigo}
                  </p>
                )}
                <button
                  type="submit"
                  disabled={verificando}
                  className="boton-oro mt-2 flex h-14 w-full items-center justify-center gap-2 rounded-[var(--radius-pill)] font-display text-base font-bold"
                >
                  {verificando ? (
                    <LoaderCircle size={20} className="motion-safe:animate-spin" aria-hidden="true" />
                  ) : (
                    <KeyRound size={20} aria-hidden="true" />
                  )}
                  {verificando ? 'Revisando…' : 'Entrar con el código'}
                </button>
              </form>

              <div className="tarjeta-relieve-base mt-6 rounded-[var(--radius-card)] p-4">
                <p className="font-display text-base font-bold text-ink-1">¿Compraste y no te llega?</p>
                <ul className="mt-3 flex flex-col gap-2 text-caption text-ink-2">
                  <li className="flex items-start gap-2">
                    <span className="mt-px shrink-0">
                      <CheckCustom />
                    </span>
                    <span>Revisa Spam y Promociones: a veces tarda un minuto.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-px shrink-0">
                      <CheckCustom />
                    </span>
                    <span>
                      Usa el <strong className="font-semibold text-ink-1">mismo correo</strong> con el que pagaste en Hotmart (está en tu comprobante).
                    </span>
                  </li>
                </ul>
                <a
                  href={`mailto:${RESPONSABLE.emailContacto}?subject=${encodeURIComponent(`No me llega el acceso — ${email}`)}`}
                  className="mt-2 flex min-h-11 items-center text-caption font-semibold text-ink-1 underline underline-offset-4"
                >
                  Escríbenos y te damos acceso
                </a>
                <SoporteLinea />
              </div>

              {demo && (
                <div className="tarjeta-relieve-base mt-6 rounded-[var(--radius-card)] p-4">
                  <p className="text-caption font-semibold text-ink-1">Modo demostración</p>
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
                    vibrar();
                    if (ACCESO_REAL && !demo) {
                      void pedirEnlace(email, true);
                      return;
                    }
                    setEspera(ESPERA_REENVIO);
                    setReenviado(true);
                  }}
                  className="flex min-h-11 items-center gap-2 text-caption font-semibold text-ink-1 transition-transform duration-100 active:scale-[0.97] disabled:text-ink-3"
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
                  className="flex min-h-11 items-center text-caption font-semibold text-ink-2 transition-transform duration-100 active:scale-[0.97]"
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
              className="flex flex-1 flex-col justify-center py-8"
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

              {avisoUrl === 'enlace-vencido' && (
                <motion.p {...entrar(2)} role="status" className="mt-6 rounded-[var(--radius-card)] border border-[var(--line)] bg-sunken p-3 text-caption text-ink-2">
                  Ese enlace ya se usó o venció. Pide uno nuevo aquí abajo: llega en un minuto.
                </motion.p>
              )}
              {avisoUrl === 'sin-acceso' && (
                <motion.div
                  {...entrar(2)}
                  role="status"
                  className="mt-6 flex items-start gap-3 rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--warning)_45%,transparent)] bg-[color-mix(in_oklab,var(--warning)_8%,transparent)] p-4"
                >
                  <CircleAlert size={20} className="mt-0.5 shrink-0 text-warning" aria-hidden="true" />
                  <div className="text-caption text-ink-2">
                    <p>
                      <strong className="font-semibold text-ink-1">Tu suscripción no está activa.</strong> Tus piezas siguen guardadas.
                    </p>
                    <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
                      <Link
                        href="/paywall"
                        className="opcion-recorrido flex h-12 items-center justify-center gap-2 px-5 font-display text-base font-bold text-ink-1"
                      >
                        Reactivar mi plan
                        <ArrowRight size={18} aria-hidden="true" />
                      </Link>
                      <a
                        href={`mailto:${RESPONSABLE.emailContacto}?subject=${encodeURIComponent('Ya pagué EMPREZAI y no puedo entrar')}${email ? `&body=${encodeURIComponent(`Mi correo de compra: ${email}`)}` : ''}`}
                        className="flex min-h-11 items-center font-semibold text-ink-1 underline underline-offset-4"
                      >
                        Ya pagué: escríbenos
                      </a>
                    </div>
                    <SoporteLinea />
                  </div>
                </motion.div>
              )}
              <motion.form {...entrar(2)} onSubmit={enviar} noValidate className="mt-8 flex flex-col gap-2">
                <label htmlFor={idCampo} className="text-caption font-semibold text-ink-1">
                  Tu correo
                </label>
                {!ACCESO_REAL && !demoPermitida() && correoGuardado && email === correoGuardado && (
                  <p className="flex items-start gap-2 text-caption text-ink-2">
                    <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-green" aria-hidden="true" />
                    Ya guardaste este correo. El acceso todavía no abre: cuando abra, entras con él.
                  </p>
                )}
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
                    if (estado === 'error') setEstado('inicio');
                    if (sugerencia) setSugerencia(undefined);
                  }}
                  onBlur={() => setSugerencia(sugerirCorreo(email))}
                  placeholder="tu@correo.com"
                  aria-invalid={Boolean(errorCampo)}
                  aria-describedby={errorCampo ? `${idCampo}-error` : undefined}
                  key={intentos}
                  className={`h-14 w-full rounded-[var(--radius-pill)] border bg-sunken px-5 text-base text-ink-1 placeholder:text-ink-3 focus:outline-none ${
                    errorCampo ? 'sacudir border-danger' : 'border-[color-mix(in_oklab,var(--ink-3)_45%,transparent)] focus:border-ink-2'
                  }`}
                />
                {errorCampo && (
                  <p id={`${idCampo}-error`} role="alert" className="text-caption text-danger">
                    {errorCampo}
                  </p>
                )}
                {/* Contenedor aria-live siempre montado: el lector anuncia la sugerencia al aparecer. */}
                <div aria-live="polite">
                  <AnimatePresence initial={false}>
                    {sugerencia && !errorCampo && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: reduce ? 0 : 0.15 }}
                        className="text-caption text-ink-2"
                      >
                        ¿Quisiste decir{' '}
                        <button
                          type="button"
                          onClick={() => {
                            setEmail(sugerencia);
                            setSugerencia(undefined);
                            campo.current?.focus();
                          }}
                          className="inline-flex min-h-11 items-center font-semibold text-ink-1 underline underline-offset-4"
                        >
                          {sugerencia}
                        </button>
                        ?
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
                {estado === 'error' && (
                  <p role="alert" className="text-caption text-danger">
                    {falla === 'servidor' ? (
                      <>
                        No pudimos enviar el enlace ahora. Intenta en un minuto; si sigue, escríbenos.
                      </>
                    ) : (
                      'No pudimos enviar el enlace. Revisa tu conexión e intenta de nuevo.'
                    )}
                  </p>
                )}
                <button
                  type="submit"
                  disabled={estado === 'enviando'}
                  className="boton-oro mt-4 flex h-14 w-full items-center justify-center gap-2 rounded-[var(--radius-pill)] font-display text-base font-bold"
                >
                  {estado === 'enviando' ? (
                    <>
                      <LoaderCircle size={20} className="motion-safe:animate-spin" aria-hidden="true" />
                      Enviando…
                    </>
                  ) : (
                    <>
                      {ACCESO_REAL || demoPermitida() ? 'Enviarme mi enlace de acceso' : 'Guardar mi correo de acceso'}
                      <ArrowRight size={20} aria-hidden="true" />
                    </>
                  )}
                </button>
                <p className="mt-2 flex items-start gap-2 text-caption text-ink-2">
                  <ShieldCheck size={16} className="mt-0.5 shrink-0 text-ink-3" aria-hidden="true" />
                  <span>
                    {ACCESO_REAL || demoPermitida()
                      ? 'Sin contraseñas: te llega un enlace de un solo uso. '
                      : 'Sin contraseñas: cuando abra el acceso, te llegará un enlace de un solo uso. '}
                    <strong className="font-semibold text-ink-1">Tu idea es tuya:</strong> no se usa para entrenar IA
                    ni se comparte.
                  </span>
                </p>
              </motion.form>

              <motion.div {...entrar(3)} className="mt-10">
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
              </motion.div>

              {!tienePieza && (
                <motion.p {...entrar(4)} className="mt-6 text-center text-caption text-ink-2">
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
