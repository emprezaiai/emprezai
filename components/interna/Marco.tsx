'use client';

// Marco de la app por dentro: protege el acceso (sin cuenta → /login), carga los datos de ejemplo
// con ?demo=carlos (capturas y demos, nunca mezclados con la cuenta real) y pone la barra inferior
// con el BOTÓN CENTRAL del rayo (composición de la referencia de la dueña, FICHA-ARTE).

import { createContext, useContext, useEffect, type ReactNode } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { MotionConfig, motion } from 'motion/react';
import { Briefcase, Check, House, Map as IconoMapa, UserRound, Zap } from 'lucide-react';
import { activarDemo, estadoRuta, importarPieza1SiFalta, useCuenta, type Cuenta } from '@/lib/cuenta';

const ContextoCuenta = createContext<Cuenta | null>(null);

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

export function Marco({ children }: { children: ReactNode }) {
  const cuenta = useCuenta();
  const router = useRouter();

  useEffect(() => {
    if (pideDemo()) activarDemo();
  }, []);

  useEffect(() => {
    if (cuenta) importarPieza1SiFalta(cuenta);
  }, [cuenta]);

  useEffect(() => {
    if (cuenta !== null) return;
    // Sin cuenta: si viene con ?demo=carlos, la demo se carga en el efecto de arriba.
    if (pideDemo()) return;
    router.replace('/login');
  }, [cuenta, router]);

  if (!cuenta) return <EsqueletoApp />;

  return (
    <MotionConfig reducedMotion="user">
    <ContextoCuenta.Provider value={cuenta}>
      <div className="fondo-recorrido min-h-dvh overflow-x-clip">
        <ContenidoConNav>{children}</ContenidoConNav>
      </div>
    </ContextoCuenta.Provider>
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
            className={`${hecha ? 'boton-central-hecho' : ruta.startsWith('/app/ruta') ? 'boton-central-quieto' : 'boton-central'} -mt-8 flex size-16 items-center justify-center rounded-full transition-transform duration-150 active:scale-95`}
          >
            {hecha ? <Check size={30} strokeWidth={3} aria-hidden="true" /> : <Zap size={28} fill="currentColor" strokeWidth={0} aria-hidden="true" />}
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
