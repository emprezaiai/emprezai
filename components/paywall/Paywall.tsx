'use client';

// PANTALLA DE PLANES (50 §C): X visible desde el primer cuadro · titular con la meta + "Hecho con
// tus N respuestas" · la ruta con su Pieza 1 hecha y lo que falta bloqueado (pérdida honesta) ·
// anual preseleccionado (o el que eligió en la landing con ?plan=) · línea de tiempo de la prueba
// con fecha y monto exactos · garantía real · salida limpia. Antes de conectar Hotmart, el botón
// muestra una vista previa honesta (50 §C3ter), nunca un cobro simulado.

import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ArrowRight, Check, LockKeyhole, ShieldCheck, Sparkles, WifiOff, X, Zap } from 'lucide-react';
import { NOMBRE_MOMENTO, contarRespuestas, leerEstado, type EstadoOnboarding, type Plan } from '@/lib/onboarding';
import { PRECIOS } from '@/lib/legal';
import { registrarEvento } from '@/lib/eventos';
import { EASE_SALIDA, TituloAcento, vibrar } from '@/components/onboarding/piezas';

const PLANES: Record<Plan, { nombre: string; porMes: string; cobro: string; monto: string; periodo: string }> = {
  anual: { nombre: 'Anual', porMes: '$6.67', cobro: 'Se cobra $79.99 al año', monto: '$79.99', periodo: 'al año' },
  mensual: { nombre: 'Mensual', porMes: '$9.99', cobro: 'Se cobra $9.99 cada mes', monto: '$9.99', periodo: 'al mes' },
};

// Enlaces de pago de Hotmart (públicos, no son secretos). Vacíos hasta la Sesión 6.
const CHECKOUT: Record<Plan, string | undefined> = {
  anual: process.env.NEXT_PUBLIC_HOTMART_CHECKOUT_ANUAL,
  mensual: process.env.NEXT_PUBLIC_HOTMART_CHECKOUT_MENSUAL,
};

const RUTA = [
  { dia: 1, nombre: 'Tu propuesta' },
  { dia: 2, nombre: 'Cliente ideal' },
  { dia: 3, nombre: 'Tu oferta' },
  { dia: 4, nombre: 'Tu precio' },
];

const suscribirNada = () => () => {};

function fechaEnDias(dias: number): string {
  const fecha = new Date();
  fecha.setDate(fecha.getDate() + dias);
  return new Intl.DateTimeFormat('es', { day: 'numeric', month: 'long' }).format(fecha);
}

export function Paywall({ planInicial }: { planInicial?: Plan }) {
  const hidratado = useSyncExternalStore(
    suscribirNada,
    () => true,
    () => false,
  );
  if (!hidratado) return <EsqueletoPlanes />;
  return <Planes planInicial={planInicial} />;
}

function Planes({ planInicial }: { planInicial?: Plan }) {
  const reduce = useReducedMotion();
  const [onboarding] = useState<EstadoOnboarding | null>(() => leerEstado());
  const [plan, setPlan] = useState<Plan>(planInicial ?? onboarding?.plan ?? 'anual');
  const [vistaPrevia, setVistaPrevia] = useState(false);
  const [sinConexion, setSinConexion] = useState(false);
  const [yendo, setYendo] = useState(false);
  const [fechaCobro] = useState(() => fechaEnDias(PRECIOS.diasPrueba));
  const [fechaAviso] = useState(() => fechaEnDias(PRECIOS.diasPrueba - 2));

  const pieza = onboarding?.primeraPieza;
  const respuestas = onboarding ? contarRespuestas(onboarding.respuestas) : 0;
  const momento = onboarding?.respuestas.momento;
  const p = PLANES[plan];
  const volver = pieza ? '/onboarding' : '/';

  useEffect(() => {
    registrarEvento('paywall_visto', { plan, respuestas, con_pieza: Boolean(pieza) });
    // Una vez por visita.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Volver desde Hotmart con el botón "atrás" no deja el botón cargando.
    const reiniciar = () => setYendo(false);
    window.addEventListener('pageshow', reiniciar);
    return () => window.removeEventListener('pageshow', reiniciar);
  }, []);

  function elegirPlan(nuevo: Plan) {
    if (nuevo === plan) return;
    setPlan(nuevo);
    vibrar(20);
  }

  function irAlPago() {
    if (yendo) return;
    if (!navigator.onLine) {
      setSinConexion(true);
      return;
    }
    setSinConexion(false);
    registrarEvento('checkout_iniciado', { plan });
    const base = CHECKOUT[plan];
    if (!base) {
      setVistaPrevia(true);
      return;
    }
    const url = new URL(base);
    url.searchParams.set('showOnlyTrial', '1');
    const sck = new URLSearchParams(window.location.search).get('sck');
    if (sck) url.searchParams.set('sck', sck.slice(0, 120));
    setYendo(true);
    window.location.assign(url.toString());
  }

  const entrar = (i: number) => ({
    initial: { opacity: 0, y: reduce ? 0 : 14 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, delay: reduce ? 0 : 0.05 + i * 0.07, ease: EASE_SALIDA },
  });

  return (
    <main className="fondo-recorrido min-h-dvh">
      <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col">
        <header className="flex h-14 items-center px-2">
          <Link
            href={volver}
            aria-label="Cerrar y volver"
            className="flex size-11 items-center justify-center rounded-full text-ink-2 transition-colors duration-150 hover:bg-raised active:scale-95"
          >
            <X size={24} aria-hidden="true" />
          </Link>
        </header>

        <div className="px-4 pt-2">
          <motion.div {...entrar(0)}>
            <TituloAcento texto="Desbloquea los 29 días que faltan" acento="29 días" className="text-pregunta" />
            <p className="mt-2 text-base leading-relaxed text-ink-2">
              Y deja que la IA construya tu empresa completa.
              {respuestas > 0 && <strong className="font-semibold text-ink-1"> Hecho con tus {respuestas} respuestas.</strong>}
            </p>
          </motion.div>

          {/* Tu ruta: la pieza 1 hecha, lo demás bloqueado */}
          <motion.section {...entrar(1)} aria-label="Tu ruta de 30 días" className="tarjeta-relieve mt-6 rounded-[var(--radius-card)] p-4">
            <ol className="relative grid grid-cols-5 gap-1">
              <span aria-hidden="true" className="absolute top-5 right-[10%] left-[10%] h-0.5 bg-[color-mix(in_oklab,var(--ink-1)_12%,transparent)]" />
              {RUTA.map((r, i) => {
                const hecho = i === 0 && Boolean(pieza);
                const hoy = i === 0 && !pieza;
                return (
                  <li key={r.dia} className="relative flex flex-col items-center gap-2 text-center">
                    <span
                      className={`flex size-10 items-center justify-center rounded-full ${
                        hecho ? 'relieve-verde' : hoy ? 'relieve-oro' : 'relieve-piedra'
                      }`}
                    >
                      {hecho ? (
                        <Check size={20} strokeWidth={3} aria-hidden="true" />
                      ) : hoy ? (
                        <Zap size={18} fill="currentColor" strokeWidth={0} aria-hidden="true" />
                      ) : (
                        <LockKeyhole size={16} strokeWidth={2.2} aria-hidden="true" />
                      )}
                    </span>
                    <span className="text-xs leading-tight text-ink-2">
                      <span className={`block font-semibold ${hecho ? 'text-green' : 'text-ink-1'}`}>Día {r.dia}</span>
                      {r.nombre}
                      <span className="sr-only">{hecho ? ' (hecho)' : ' (bloqueado)'}</span>
                    </span>
                  </li>
                );
              })}
              <li className="relative flex flex-col items-center gap-2 text-center">
                <span className="flex size-10 items-center justify-center rounded-full border border-dashed border-[var(--line)] bg-sunken font-display text-sm font-bold text-ink-2">
                  +26
                </span>
                <span className="text-xs leading-tight text-ink-2">
                  <span className="block font-semibold text-ink-1">Día 30</span>
                  Lista para vender
                </span>
              </li>
            </ol>
            <p className="mt-4 flex items-start gap-2 border-t border-[var(--line)] pt-4 text-ayuda leading-snug text-ink-2">
              <Sparkles size={18} className="mt-0.5 shrink-0 text-gold" aria-hidden="true" />
              <span>
                Una misión de 5 minutos {momento ? NOMBRE_MOMENTO[momento] : 'al día'}:{' '}
                <strong className="font-semibold text-ink-1">la IA arma cada pieza usando las anteriores.</strong>
              </span>
            </p>
          </motion.section>

          {/* Planes */}
          <motion.div {...entrar(2)} role="radiogroup" aria-label="Elige tu plan" className="mt-6 flex flex-col gap-3">
            {(['anual', 'mensual'] as const).map((id) => {
              const datos = PLANES[id];
              const activo = plan === id;
              return (
                <button
                  key={id}
                  type="button"
                  role="radio"
                  aria-checked={activo}
                  onClick={() => elegirPlan(id)}
                  className={`relative flex min-h-20 items-center gap-3 rounded-[var(--radius-card)] border border-[var(--line)] px-4 py-4 text-left transition-colors duration-200 active:scale-[0.99] ${
                    activo ? 'bg-[color-mix(in_oklab,var(--gold)_8%,var(--surface-raised))]' : 'bg-raised'
                  }`}
                >
                  {activo && (
                    <motion.span
                      layoutId="plan-activo"
                      aria-hidden="true"
                      transition={{ duration: reduce ? 0 : 0.2, ease: EASE_SALIDA }}
                      className="pointer-events-none absolute -inset-px rounded-[var(--radius-card)] border-2 border-gold shadow-[0_2px_0_var(--gold-deep)]"
                    />
                  )}
                  {id === 'anual' && (
                    <motion.span
                      initial={{ scale: reduce ? 1 : 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: 'spring', bounce: 0.3, duration: 0.4, delay: reduce ? 0 : 0.5 }}
                      className="absolute -top-3 right-4 rounded-[var(--radius-chip)] bg-gradient-to-b from-gold-light to-gold px-2 py-1 text-xs font-extrabold tracking-[0.04em] text-on-gold uppercase shadow-[0_2px_0_var(--gold-deep)]"
                    >
                      Ahorras 33%
                    </motion.span>
                  )}
                  <span
                    aria-hidden="true"
                    className={`flex size-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors duration-200 ${
                      activo ? 'border-gold bg-gold text-on-gold' : 'border-ink-3'
                    }`}
                  >
                    {activo && <Check size={14} strokeWidth={3.5} />}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-display text-lg font-bold text-ink-1">{datos.nombre}</span>
                    <span className="block text-sm text-ink-2">{datos.cobro}</span>
                  </span>
                  <span className="text-right">
                    <span className="block font-display text-precio leading-none font-extrabold tabular-nums text-ink-1">{datos.porMes}</span>
                    <span className="block text-xs text-ink-3">al mes</span>
                  </span>
                </button>
              );
            })}
          </motion.div>

          {/* Línea de tiempo de la prueba (la verdad del puente, 50 §C4) */}
          <motion.section {...entrar(3)} aria-label="Cómo funciona tu prueba gratis" className="mt-6 pl-1">
            <ol className="flex flex-col">
              {[
                { titulo: 'Hoy: empiezas gratis', texto: 'Acceso completo a tu ruta de 30 días.', tono: 'oro' as const },
                { titulo: `${fechaAviso}: te avisamos`, texto: 'Te escribimos antes de cualquier cobro.', tono: 'oro' as const },
                {
                  titulo: `${fechaCobro}: primer cobro de ${p.monto}`,
                  texto: 'Cancela antes en 1 toque y no pagas nada.',
                  tono: 'neutro' as const,
                },
              ].map((n, i, todos) => (
                <li key={n.titulo} className="relative flex gap-3 pb-4 last:pb-0">
                  {i < todos.length - 1 && (
                    <motion.span
                      aria-hidden="true"
                      initial={{ scaleY: reduce ? 1 : 0 }}
                      animate={{ scaleY: 1 }}
                      transition={{ duration: reduce ? 0 : 0.3, delay: reduce ? 0 : 0.5 + i * 0.3, ease: EASE_SALIDA }}
                      className={`absolute top-4 left-1.5 h-full w-0.5 origin-top ${i === 0 ? 'bg-gold' : 'bg-[color-mix(in_oklab,var(--ink-1)_14%,transparent)]'}`}
                    />
                  )}
                  <span
                    aria-hidden="true"
                    className={`relative mt-1 size-3 shrink-0 rounded-full ${n.tono === 'oro' ? 'bg-gold' : 'border-2 border-ink-3 bg-base'}`}
                  />
                  <span>
                    <AnimatePresence mode="wait" initial={false}>
                      <motion.span
                        key={n.titulo}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        className="block text-ayuda font-semibold text-ink-1"
                      >
                        {n.titulo}
                      </motion.span>
                    </AnimatePresence>
                    <span className="block text-caption text-ink-2">{n.texto}</span>
                  </span>
                </li>
              ))}
            </ol>
          </motion.section>

          {/* La Garantía Sin Preguntas */}
          <motion.section {...entrar(4)} className="hairline-oro mt-6 flex items-start gap-3 rounded-[var(--radius-card)] p-4">
            <span className="relieve-verde flex size-10 shrink-0 items-center justify-center rounded-[var(--radius-chip)]" aria-hidden="true">
              <ShieldCheck size={20} strokeWidth={2.2} />
            </span>
            <div>
              <h2 className="font-display text-base font-bold text-ink-1">La Garantía Sin Preguntas</h2>
              <p className="mt-1 text-caption leading-snug text-ink-2">
                <strong className="font-semibold text-ink-1">{PRECIOS.diasGarantia} días desde tu primer pago.</strong> Si sientes que la app no
                es para ti, pides la devolución en 1 clic y te devolvemos todo.
              </p>
            </div>
          </motion.section>

          <p className="mt-4 flex items-center justify-center gap-2 text-xs text-ink-3">
            <LockKeyhole size={14} aria-hidden="true" />
            Pago seguro por Hotmart · Tu idea es tuya
          </p>

          <div className="mt-2 flex justify-center">
            <Link
              href={volver}
              className="flex min-h-11 items-center px-4 text-sm font-medium text-ink-3 underline-offset-4 transition-colors duration-150 hover:text-ink-2 hover:underline"
            >
              Ahora no
            </Link>
          </div>
        </div>

        {/* Botón fijo con el plan elegido (el precio nunca queda bajo el pliegue) */}
        <div className="barra-inferior sticky bottom-0 z-10 mt-auto px-4 pt-6">
          <motion.button
            type="button"
            onClick={irAlPago}
            disabled={yendo}
            whileTap={{ scale: 0.98 }}
            className="boton-oro flex h-14 w-full items-center justify-center gap-2 rounded-[var(--radius-pill)] px-6 font-display text-boton font-bold"
          >
            {yendo ? 'Abriendo la página de pago…' : `Empezar mis ${PRECIOS.diasPrueba} días gratis`}
            {!yendo && <ArrowRight size={20} aria-hidden="true" />}
          </motion.button>
          <p className="mt-2 text-center text-caption text-ink-2" aria-live="polite">
            {sinConexion ? (
              <span className="inline-flex items-center gap-1 text-warning">
                <WifiOff size={14} aria-hidden="true" />
                Sin conexión. Conéctate para ir a la página de pago.
              </span>
            ) : (
              <>
                Hoy pagas <strong className="font-semibold text-ink-1">$0</strong> · luego {p.monto} {p.periodo} · cancelas en 1 toque
              </>
            )}
          </p>
        </div>
      </div>

      <AnimatePresence>{vistaPrevia && <AvisoVistaPrevia plan={p.nombre} onCerrar={() => setVistaPrevia(false)} />}</AnimatePresence>
    </main>
  );
}

/* Vista previa honesta mientras Hotmart no está conectado (nunca un cobro simulado). */
function AvisoVistaPrevia({ plan, onCerrar }: { plan: string; onCerrar: () => void }) {
  const reduce = useReducedMotion();
  const boton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    boton.current?.focus();
    const alTeclear = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCerrar();
    };
    window.addEventListener('keydown', alTeclear);
    return () => window.removeEventListener('keydown', alTeclear);
  }, [onCerrar]);

  return (
    <motion.div
      className="fixed inset-0 z-20 flex items-end justify-center velo-oscuro"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onCerrar}
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby="titulo-vista-previa"
        initial={{ y: reduce ? 0 : 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: reduce ? 0 : 40, opacity: 0 }}
        transition={{ duration: 0.3, ease: EASE_SALIDA }}
        onClick={(e) => e.stopPropagation()}
        className="tarjeta-relieve w-full max-w-md rounded-t-[var(--radius-card)] px-4 pt-6 pb-[max(16px,env(safe-area-inset-bottom))]"
      >
        <h2 id="titulo-vista-previa" className="font-display text-xl font-bold text-ink-1">
          Aquí se abre la página de pago de Hotmart
        </h2>
        <p className="mt-2 text-ayuda text-ink-2">
          Esta es una vista previa: el pago todavía no está conectado, así que no se cobró nada. Elegiste el plan{' '}
          <strong className="font-semibold text-ink-1">{plan}</strong>.
        </p>
        <button
          ref={boton}
          type="button"
          onClick={onCerrar}
          className="boton-oro mt-6 flex h-14 w-full items-center justify-center rounded-[var(--radius-pill)] font-display text-boton font-bold"
        >
          Entendido
        </button>
      </motion.div>
    </motion.div>
  );
}

function EsqueletoPlanes() {
  return (
    <main className="fondo-recorrido min-h-dvh" aria-busy="true" aria-label="Cargando los planes">
      <div className="mx-auto flex w-full max-w-md flex-col px-4 pt-16">
        <div className="h-8 w-4/5 animate-pulse rounded-[var(--radius-chip)] bg-raised" />
        <div className="mt-2 h-4 w-3/5 animate-pulse rounded-[var(--radius-chip)] bg-raised" />
        <div className="mt-6 h-32 animate-pulse rounded-[var(--radius-card)] bg-raised" />
        <div className="mt-6 h-20 animate-pulse rounded-[var(--radius-card)] bg-raised" />
        <div className="mt-3 h-20 animate-pulse rounded-[var(--radius-card)] bg-raised" />
      </div>
    </main>
  );
}
