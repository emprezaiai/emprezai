'use client';

// PANTALLA DE PLANES (50 §C): X visible desde el primer cuadro · titular con la meta + "Hecho con
// tus N respuestas" · la ruta con su Pieza 1 hecha y lo que falta bloqueado (pérdida honesta) ·
// anual preseleccionado (o el que eligió en la landing con ?plan=) · línea de tiempo de la prueba
// con fecha y monto exactos · garantía real · salida limpia. Antes de conectar Hotmart, el botón
// muestra una vista previa honesta (50 §C3ter), nunca un cobro simulado.

import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { AnimatePresence, animate, motion, useReducedMotion } from 'motion/react';
import { ArrowRight, Bot, Check, LockKeyhole, ShieldCheck, WifiOff, X, Zap } from 'lucide-react';
import { NOMBRE_MOMENTO, contarRespuestas, leerEstado, type EstadoOnboarding, type Plan } from '@/lib/onboarding';
import { PRECIOS, RESPONSABLE } from '@/lib/legal';
import { registrarEvento } from '@/lib/eventos';
import { EASE_SALIDA, TituloAcento, vibrar } from '@/components/onboarding/piezas';

const PLANES: Record<Plan, { nombre: string; porMes: number; cobro: string; porDia: string; monto: number; periodo: string }> = {
  anual: { nombre: 'Anual', porMes: 6.67, cobro: 'Se cobra $79.99 al año', porDia: '$0.22 al día', monto: 79.99, periodo: 'al año' },
  mensual: { nombre: 'Mensual', porMes: 9.99, cobro: 'Se cobra $9.99 cada mes', porDia: '$0.33 al día', monto: 9.99, periodo: 'al mes' },
};
// 12 × $9.99 = $119.88 contra $79.99 → $39.89 de ahorro real (dato exacto, sin redondear).
const AHORRO_ANUAL = '$39.89';

/* Monto que CUENTA al cambiar de plan (50 §C3: 300 ms, tabular-nums; sin conteo si reduce). */
function Monto({ valor, desdeCero = false }: { valor: number; desdeCero?: boolean }) {
  const reduce = useReducedMotion();
  const nodo = useRef<HTMLSpanElement>(null);
  // desdeCero: el precio héroe cuenta de 0 a su valor al entrar (baseline 2 de 22).
  const previo = useRef(desdeCero ? 0 : valor);
  useEffect(() => {
    const desde = previo.current;
    previo.current = valor;
    const pintar = (v: number) => {
      if (nodo.current) nodo.current.textContent = `$${v.toFixed(2)}`;
    };
    if (reduce || desde === valor) {
      pintar(valor);
      return;
    }
    const entrada = desde === 0;
    const control = animate(desde, valor, {
      duration: entrada ? 0.4 : 0.3,
      delay: entrada ? 0.5 : 0,
      ease: 'easeOut',
      onUpdate: pintar,
    });
    return () => control.stop();
  }, [valor, reduce]);
  return (
    <span ref={nodo} className="tabular-nums">
      ${valor.toFixed(2)}
    </span>
  );
}



// Enlaces de pago de Hotmart (públicos, no son secretos). Vacíos hasta la Sesión 6.
const CHECKOUT: Record<Plan, string | undefined> = {
  anual: process.env.NEXT_PUBLIC_HOTMART_CHECKOUT_ANUAL,
  mensual: process.env.NEXT_PUBLIC_HOTMART_CHECKOUT_MENSUAL,
};

const RUTA = [
  { dia: 1, nombre: 'Frase' },
  { dia: 2, nombre: 'Cliente' },
  { dia: 3, nombre: 'Oferta' },
  { dia: 4, nombre: 'Precio' },
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
  const [errorPago, setErrorPago] = useState(false);
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
    vibrar(35);
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
    let url: URL;
    try {
      url = new URL(base);
    } catch {
      setErrorPago(true);
      return;
    }
    setErrorPago(false);
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
    <main className="fondo-recorrido min-h-dvh overflow-x-clip">
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
            {pieza && (
              <p className="mb-2 flex items-center gap-2 text-xs font-semibold tracking-[0.08em] text-green uppercase">
                <Check size={14} strokeWidth={3} aria-hidden="true" />
                Pieza 1 lista{respuestas > 0 ? ` · ${respuestas} respuestas` : ''}
              </p>
            )}
            <TituloAcento texto="Desbloquea los 29 días hasta tu oferta lista" acento="tu oferta lista" className="text-pregunta" />
            <p className="mt-2 text-base leading-relaxed text-ink-2">
              Adiós a la hoja en blanco: con el Método Pieza a Pieza, la IA arma tu negocio contigo,{' '}
              <span className="font-semibold text-ink-1">5 minutos al día</span>.
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
                        hecho ? 'relieve-verde' : hoy ? 'relieve-oro' : 'border border-[var(--line)] bg-sunken text-ink-3'
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
                    <span className={`text-xs leading-tight font-semibold ${hecho ? 'text-green' : 'text-ink-2'}`}>
                      {r.nombre}
                      <span className="sr-only">{` (día ${r.dia}${hecho ? ', hecho' : ', bloqueado'})`}</span>
                    </span>
                  </li>
                );
              })}
              <li className="relative flex flex-col items-center gap-2 text-center">
                <span className="flex size-10 items-center justify-center rounded-full border border-[var(--line)] bg-sunken font-display text-sm font-bold text-ink-2">
                  +26
                </span>
                <span className="text-xs leading-tight font-semibold text-ink-2">
                  A vender
                  <span className="sr-only"> (día 30, oferta lista para vender)</span>
                </span>
              </li>
            </ol>
            {!pieza && (
              <p className="mt-4 text-caption text-ink-2">
                5 minutos {momento ? NOMBRE_MOMENTO[momento] : 'al día'}: una misión y una pieza nueva cada día.
              </p>
            )}
            {pieza && (
              <figure className="mt-4 rounded-[var(--radius-chip)] border-l-2 border-green bg-sunken px-3 py-2">
                <figcaption className="text-xs font-semibold text-green">Día 1 · tu frase de negocio</figcaption>
                <blockquote className="mt-1 font-display text-sm leading-snug font-bold text-ink-1">«{pieza.frase}»</blockquote>
              </figure>
            )}
          </motion.section>

          {/* Planes */}
          <motion.div
            {...entrar(2)}
            role="radiogroup"
            aria-label="Elige tu plan"
            className="mt-4 flex flex-col gap-3"
            onKeyDown={(e) => {
              if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) return;
              e.preventDefault();
              const nuevo: Plan = plan === 'anual' ? 'mensual' : 'anual';
              elegirPlan(nuevo);
              e.currentTarget.querySelector<HTMLButtonElement>(`[data-plan="${nuevo}"]`)?.focus();
            }}
          >
            {(['anual', 'mensual'] as const).map((id) => {
              const datos = PLANES[id];
              const activo = plan === id;
              return (
                <button
                  key={id}
                  type="button"
                  role="radio"
                  aria-checked={activo}
                  data-plan={id}
                  tabIndex={activo ? 0 : -1}
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
                      className="absolute -top-3 right-4 rounded-[var(--radius-chip)] bg-gradient-to-b from-gold-light to-gold px-2 py-1 text-caption font-extrabold tracking-[0.04em] text-on-gold uppercase shadow-[0_2px_0_var(--gold-deep)]"
                    >
                      Ahorras {AHORRO_ANUAL}
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
                    <span className="block text-xs text-ink-3">{datos.porDia}</span>
                  </span>
                  <span className="text-right">
                    <span className="block font-display text-precio leading-none font-extrabold tabular-nums text-ink-1">
                      <Monto valor={datos.porMes} desdeCero />
                    </span>
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
                { titulo: <>Hoy: empiezas gratis</>, texto: 'Acceso completo a tu ruta de 30 días.', tono: 'oro' as const },
                { titulo: <>{fechaAviso}: te avisamos</>, texto: 'Te escribimos antes de cualquier cobro.', tono: 'oro' as const },
                {
                  titulo: (
                    <>
                      {fechaCobro}: primer cobro de <Monto valor={p.monto} />
                    </>
                  ),
                  texto: 'Si cancelas antes, no pagas nada.',
                  tono: 'neutro' as const,
                },
              ].map((n, i, todos) => (
                <li key={i} className="relative flex gap-3 pb-4 last:pb-0">
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
                    <span className="block text-ayuda font-semibold text-ink-1">{n.titulo}</span>
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

          <ul className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-ink-2">
            <li className="flex items-center gap-1">
              <Bot size={14} className="text-ink-3" aria-hidden="true" />
              La IA ya viene incluida
            </li>
            <li className="flex items-center gap-1">
              <LockKeyhole size={14} className="text-ink-3" aria-hidden="true" />
              Pago seguro por Hotmart
            </li>
          </ul>

          <div className="mt-2 flex flex-col items-center">
            <Link
              href={volver}
              className="flex min-h-11 items-center px-3 text-sm font-medium whitespace-nowrap text-ink-3 underline-offset-4 transition-colors duration-150 hover:text-ink-2 hover:underline"
            >
              Ahora no
            </Link>
            <a
              href={`mailto:${RESPONSABLE.emailContacto}?subject=${encodeURIComponent('Ya pagué EMPRESAI y quiero entrar')}`}
              className="flex min-h-11 items-center px-3 text-sm font-medium whitespace-nowrap text-ink-3 underline-offset-4 transition-colors duration-150 hover:text-ink-2 hover:underline"
            >
              ¿Ya pagaste? Recupera tu acceso
            </a>
          </div>
        </div>

        {/* Botón fijo con el plan elegido (el precio nunca queda bajo el pliegue) */}
        <div className="barra-inferior sticky bottom-0 z-10 mt-auto px-4 pt-6">
          <motion.button
            type="button"
            onClick={irAlPago}
            disabled={yendo}
            animate={reduce ? undefined : { scale: [1, 1.02, 1] }}
            transition={{ duration: 0.6, delay: 2, ease: 'easeInOut' }}
            whileTap={{ scale: 0.98 }}
            className="boton-oro flex h-14 w-full items-center justify-center gap-2 rounded-[var(--radius-pill)] px-6 font-display text-boton font-bold"
          >
            {yendo ? 'Abriendo la página de pago…' : `Empezar mis ${PRECIOS.diasPrueba} días gratis`}
            {!yendo && <ArrowRight size={20} aria-hidden="true" />}
          </motion.button>
          <p className="mt-2 text-center text-caption text-ink-2" aria-live="polite">
            {errorPago ? (
              <span className="text-warning">
                No pudimos abrir la página de pago.{' '}
                <a
                  className="font-semibold underline underline-offset-4"
                  href={`mailto:${RESPONSABLE.emailContacto}?subject=${encodeURIComponent('No pude abrir el pago de EMPRESAI')}`}
                >
                  Escríbenos
                </a>{' '}
                y te ayudamos a terminar.
              </span>
            ) : sinConexion ? (
              <span className="inline-flex items-center gap-1 text-warning">
                <WifiOff size={14} aria-hidden="true" />
                Sin conexión. Conéctate para ir a la página de pago.
              </span>
            ) : (
              <>
                Hoy <strong className="font-semibold text-ink-1">$0</strong> · luego <Monto valor={p.monto} /> {p.periodo} · cancela cuando quieras
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
    <main className="fondo-recorrido min-h-dvh overflow-x-clip" aria-busy="true" aria-label="Cargando los planes">
      <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col">
        <div className="flex h-14 items-center px-2">
          <div className="size-11 rounded-full bg-raised" />
        </div>
        <div className="px-4 pt-2">
          <div className="h-3 w-2/5 animate-pulse rounded-full bg-raised" />
          <div className="mt-2 h-16 w-11/12 animate-pulse rounded-[var(--radius-chip)] bg-raised" />
          <div className="mt-2 h-12 w-4/5 animate-pulse rounded-[var(--radius-chip)] bg-raised" />
          <div className="mt-6 h-48 animate-pulse rounded-[var(--radius-card)] bg-raised" />
          <div className="mt-4 h-20 animate-pulse rounded-[var(--radius-card)] bg-raised" />
          <div className="mt-3 h-20 animate-pulse rounded-[var(--radius-card)] bg-raised" />
        </div>
        <div className="mt-auto px-4 pt-6 pb-4">
          <div className="h-14 animate-pulse rounded-[var(--radius-pill)] bg-raised" />
        </div>
      </div>
    </main>
  );
}
