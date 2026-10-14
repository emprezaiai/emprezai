'use client';

// Marco de la app por dentro. Dos modos (los decide el layout EN SERVIDOR):
// · "servidor": hay acceso real (sesión + suscripción validadas en servidor). Trae la cuenta del
//   servidor y sincroniza cada pieza que se guarda.
// · "local": versión de prueba en este computador (sin Supabase): cuenta en el celular y datos de
//   ejemplo con ?demo=carlos, nunca mezclados con una cuenta real.
// Pone la barra inferior con el BOTÓN CENTRAL del rayo (referencia de la dueña, FICHA-ARTE).

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { MotionConfig, motion } from 'motion/react';
import { Briefcase, Check, House, Map as IconoMapa, RotateCcw, UserRound, WifiOff, Zap } from 'lucide-react';
import { activarDemo, estadoRuta, importarPieza1SiFalta, useCuenta, type Cuenta } from '@/lib/cuenta';
import { activarSincronizacion, cargarDelServidor } from '@/lib/sincronizar';

const ContextoCuenta = createContext<Cuenta | null>(null);
const ContextoModo = createContext<'servidor' | 'local'>('local');

/** Si la app corre con acceso real (servidor) o en la versión de prueba local. */
export const useModoApp = () => useContext(ContextoModo);

// Los datos de ejemplo (?demo=carlos) solo existen en la versión de prueba local: en producción
// nadie entra a la app sin cuenta (fail-closed).
const DEMO_PERMITIDA = process.env.NEXT_PUBLIC_VISTA_PREVIA === '1';
const enLocal = () => ['localhost', '127.0.0.1'].includes(window.location.hostname);
const pideDemo = () => DEMO_PERMITIDA && enLocal() && new URLSearchParams(window.location.search).get('demo') === 'carlos';

/** La cuenta dentro de la app (el Marco garantiza que existe). */
export function useCuentaActiva(): Cuenta {
  const c = useContext(ContextoCuenta);
  if (!c) throw new Error('useCuentaActiva fuera del Marco');
  return c;
}

const DESTINOS = [
  { href: '/app', etiqueta: 'Hoy', icono: House },
  { href: '/app/ruta', etiqueta: 'Ruta', icono: IconoMapa },
  { href: '/app/empresa', etiqueta: 'Mi Empresa', icono: Briefcase },
  { href: '/app/perfil', etiqueta: 'Perfil', icono: UserRound },
] as const;

export function Marco({ children, modo }: { children: ReactNode; modo: 'servidor' | 'local' }) {
  const cuenta = useCuenta();
  const pathname = usePathname();
  const router = useRouter();
  const [carga, setCarga] = useState<'cargando' | 'lista' | 'error'>(modo === 'servidor' ? 'cargando' : 'lista');
  const [intento, setIntento] = useState(0);

  // Modo servidor: traer la cuenta y dejar la sincronización encendida mientras la app esté abierta.
  useEffect(() => {
    if (modo !== 'servidor') return;
    const apagar = activarSincronizacion();
    let vigente = true;
    cargarDelServidor().then((resultado) => {
      if (!vigente) return;
      if (resultado === 'sin-sesion') router.replace('/login');
      else if (resultado === 'sin-acceso') router.replace('/login?estado=sin-acceso');
      else setCarga(resultado === 'ok' ? 'lista' : 'error');
    });
    return () => {
      vigente = false;
      apagar();
    };
  }, [modo, intento, router]);

  useEffect(() => {
    if (modo === 'local' && pideDemo()) activarDemo();
  }, [modo]);

  useEffect(() => {
    if (cuenta && carga === 'lista') importarPieza1SiFalta(cuenta);
  }, [cuenta, carga]);

  useEffect(() => {
    if (modo !== 'local' || cuenta !== null) return;
    // Sin cuenta: si viene con ?demo=carlos, la demo se carga en el efecto de arriba.
    if (pideDemo()) return;
    router.replace('/login');
  }, [modo, cuenta, router]);

  // Sin conexión al abrir: si ya hay copia en el celular se usa; si no, se ofrece reintentar.
  if (modo === 'servidor' && carga === 'error' && !cuenta) {
    return <SinConexion onReintentar={() => { setCarga('cargando'); setIntento((n) => n + 1); }} />;
  }
  if (!cuenta || (modo === 'servidor' && carga === 'cargando')) {
    return pathname.startsWith('/app/ruta') ? <EsqueletoRuta /> : <EsqueletoApp />;
  }

  return (
    <MotionConfig reducedMotion="user">
    <ContextoModo.Provider value={modo}>
    <ContextoCuenta.Provider value={cuenta}>
      <div className="fondo-recorrido min-h-dvh overflow-x-clip">
        <ContenidoConNav>{children}</ContenidoConNav>
      </div>
    </ContextoCuenta.Provider>
    </ContextoModo.Provider>
    </MotionConfig>
  );
}

/* En la misión no hay barra (modo foco, como una lección de Duolingo): solo volver. */
function ContenidoConNav({ children }: { children: ReactNode }) {
  const ruta = usePathname();
  const enMision = ruta.startsWith('/app/mision');
  // La Ruta trae su propia tarjeta fija con el espacio de la barra: no se suma otro.
  const conTarjetaFija = ruta.startsWith('/app/ruta');
  return (
    <>
      <div className={`mx-auto flex min-h-dvh w-full max-w-md flex-col ${enMision || conTarjetaFija ? '' : 'pb-28'}`}>{children}</div>
      {!enMision && <NavInferior />}
    </>
  );
}

function NavInferior() {
  const ruta = usePathname();
  const cuenta = useContext(ContextoCuenta);
  const e = cuenta ? estadoRuta(cuenta) : null;
  // Con la pieza de hoy hecha, el botón central deja de llamar a una misión terminada: pasa a verde y abre la pieza.
  const hecha = Boolean(e && (e.hechaHoy || e.terminada));
  const activo = (href: string) => (href === '/app' ? ruta === '/app' : ruta.startsWith(href));
  return (
    <nav
      aria-label="Secciones"
      className="nav-inferior fixed inset-x-0 bottom-0 z-20 mx-auto w-full max-w-md px-2 pb-[max(8px,env(safe-area-inset-bottom))]"
    >
      <ul className="relative grid h-16 grid-cols-[1fr_1fr_88px_1fr_1fr] items-center">
        {DESTINOS.slice(0, 2).map((d) => (
          <ItemNav key={d.href} {...d} activo={activo(d.href)} />
        ))}
        <li className="flex justify-center">
          <Link
            href={hecha && cuenta ? `/app/empresa?pieza=${Math.max(...cuenta.piezas.map((p) => p.dia))}` : '/app/mision'}
            aria-label={hecha ? 'Ver la pieza de hoy' : 'Misión de hoy'}
            className={`${ruta.startsWith('/app/ruta') ? 'boton-central-quieto' : hecha ? 'boton-central-hecho' : 'boton-central'} -mt-8 flex size-16 items-center justify-center rounded-full transition-transform duration-150 active:scale-95`}
          >
            {hecha ? <Check size={30} strokeWidth={3} className={ruta.startsWith('/app/ruta') ? 'text-green' : undefined} aria-hidden="true" /> : <Zap size={28} fill="currentColor" strokeWidth={0} aria-hidden="true" />}
          </Link>
        </li>
        {DESTINOS.slice(2).map((d) => (
          <ItemNav key={d.href} {...d} activo={activo(d.href)} />
        ))}
      </ul>
    </nav>
  );
}

function ItemNav({
  href,
  etiqueta,
  icono: Icono,
  activo,
}: {
  href: string;
  etiqueta: string;
  icono: typeof House;
  activo: boolean;
}) {
  return (
    <li className="flex justify-center">
      <Link
        href={href}
        aria-current={activo ? 'page' : undefined}
        className={`relative flex min-h-12 min-w-16 flex-col items-center justify-center gap-1 rounded-[var(--radius-chip)] px-2 text-xs font-semibold transition-colors duration-150 ${
          activo ? 'text-gold' : 'text-ink-3 hover:text-ink-2'
        }`}
      >
        {activo && (
          <motion.span
            layoutId="nav-activo"
            aria-hidden="true"
            transition={{ type: 'spring', bounce: 0.25, duration: 0.35 }}
            className="absolute inset-0 rounded-[var(--radius-chip)] bg-[color-mix(in_oklab,var(--gold)_14%,transparent)]"
          />
        )}
        <Icono size={22} strokeWidth={activo ? 2.4 : 2} className="relative" aria-hidden="true" />
        <span className="relative whitespace-nowrap">{etiqueta}</span>
      </Link>
    </li>
  );
}

function SinConexion({ onReintentar }: { onReintentar: () => void }) {
  return (
    <main className="fondo-recorrido flex min-h-dvh flex-col items-center justify-center px-4 text-center">
      <span aria-hidden="true" className="relieve-piedra flex size-16 items-center justify-center rounded-full">
        <WifiOff size={28} />
      </span>
      <h1 className="mt-6 font-display text-2xl font-extrabold text-ink-1">No pudimos abrir tu ruta</h1>
      <p className="mt-2 max-w-xs text-base text-ink-2">Revisa tu conexión a internet y vuelve a intentarlo. Tus piezas están guardadas.</p>
      <button
        type="button"
        onClick={onReintentar}
        className="boton-oro mt-6 inline-flex h-14 items-center justify-center gap-2 rounded-[var(--radius-pill)] px-8 font-display text-boton font-bold"
      >
        <RotateCcw size={20} aria-hidden="true" />
        Reintentar
      </button>
    </main>
  );
}

function EsqueletoRuta() {
  const zigzag = [-90, 0, 90, 0];
  return (
    <div className="fondo-recorrido min-h-dvh" aria-busy="true" aria-label="Cargando tu ruta">
      <div className="mx-auto flex w-full max-w-md flex-col px-4">
        <div className="flex h-16 items-center gap-2">
          <div className="h-9 w-24 rounded-full bg-raised" />
          <div className="h-9 w-20 rounded-full bg-raised" />
        </div>
        <div className="mt-2 h-24 rounded-[var(--radius-card)] bg-raised motion-safe:animate-pulse" />
        <div className="relative mx-auto mt-6 w-[320px]">
          {zigzag.map((x, i) => (
            <div key={i} className="flex justify-center" style={{ transform: `translateX(${x}px)`, marginTop: i ? 60 : 0 }}>
              <div className="size-16 rounded-full bg-raised motion-safe:animate-pulse" />
            </div>
          ))}
        </div>
      </div>
      <div className="fixed inset-x-0 bottom-24 mx-auto w-full max-w-md px-4">
        <div className="h-20 rounded-[var(--radius-card)] bg-raised motion-safe:animate-pulse" />
      </div>
      <div className="fixed inset-x-0 bottom-0 mx-auto h-20 w-full max-w-md rounded-t-[var(--radius-card)] bg-raised" />
    </div>
  );
}

function EsqueletoApp() {
  return (
    <div className="fondo-recorrido min-h-dvh" aria-busy="true" aria-label="Cargando tu ruta">
      <div className="mx-auto flex w-full max-w-md flex-col px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="size-11 rounded-full bg-raised" />
          <div className="h-4 w-24 rounded-full bg-raised" />
          <div className="size-11 rounded-full bg-raised" />
        </div>
        <div className="mt-2 h-4 w-40 rounded-full bg-raised motion-safe:animate-pulse" />
        <div className="mt-2 h-8 w-48 rounded-[var(--radius-chip)] bg-raised motion-safe:animate-pulse" />
        <div className="mt-6 h-48 rounded-[var(--radius-card)] bg-raised motion-safe:animate-pulse" />
        <div className="mt-4 grid grid-cols-3 gap-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-24 rounded-[var(--radius-card)] bg-raised motion-safe:animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
}
