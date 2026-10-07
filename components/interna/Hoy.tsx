'use client';

// HOY — el ritual diario (56 §M0), la pantalla más vista. Composición de la referencia de la dueña
// (cabecera con 2 chips + título centrado · saludo · tarjeta héroe con cubos de vidrio · acción ·
// 3 datos · filas en píldora) con los colores de la Opción C (FICHA-ARTE).
// Orden M0: el dato de hoy → la acción de 1 toque (visible sin bajar) → la racha → el insight.

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { animate, motion, useReducedMotion } from 'motion/react';
import { ArrowRight, Bell, CalendarCheck, ChevronRight, Flame, LifeBuoy, Puzzle, Sparkles } from 'lucide-react';
import { estadoRuta } from '@/lib/cuenta';
import { RESPONSABLE } from '@/lib/legal';
import { RUTA, TOTAL_DIAS, diaRuta } from '@/lib/ruta';
import { EASE_SALIDA } from '@/components/onboarding/piezas';
import { useCuentaActiva } from './Marco';

function fechaLarga(): string {
  const t = new Intl.DateTimeFormat('es', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date());
  return t.charAt(0).toUpperCase() + t.slice(1).replace(',', '');
}

function saludo(): string {
  const h = new Date().getHours();
  return h < 12 ? 'Buenos días' : h < 19 ? 'Buenas tardes' : 'Buenas noches';
}

const minusculaInicial = (t: string) => t.charAt(0).toLowerCase() + t.slice(1);
const lista = (items: string[]) => (items.length <= 1 ? (items[0] ?? '') : `${items.slice(0, -1).join(', ')} y ${items[items.length - 1]}`);

/* Número héroe que cuenta de 0 a su valor (baseline 2 de 22). */
function Cuenta({ valor }: { valor: number }) {
  const reduce = useReducedMotion();
  const nodo = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (!nodo.current) return;
    if (reduce) {
      nodo.current.textContent = String(valor);
      return;
    }
    const control = animate(0, valor, {
      duration: 0.6,
      delay: 0.3,
      ease: 'easeOut',
      onUpdate: (v) => {
        if (nodo.current) nodo.current.textContent = String(Math.round(v));
      },
    });
    return () => control.stop();
  }, [valor, reduce]);
  return (
    <span ref={nodo} className="tabular-nums">
      {valor}
    </span>
  );
}

export function Hoy() {
  const cuenta = useCuentaActiva();
  const reduce = useReducedMotion();
  const e = estadoRuta(cuenta);
  const hoyRuta = diaRuta(e.diaActual);
  const diaMostrado = e.hechaHoy ? e.piezasListas : e.diaActual;
  const siguiente = !e.terminada ? diaRuta(e.hechaHoy ? e.diaActual : e.diaActual + 1) : undefined;
  // "tu cliente ideal y tu oferta" (con posesivo: se lee natural y no exige concordar)
  const usadas = hoyRuta.usa.filter((d) => cuenta.piezas.some((p) => p.dia === d)).map((d) => minusculaInicial(RUTA[d - 1].pieza));
  const ultimas = [...cuenta.piezas].sort((a, b) => b.dia - a.dia).slice(0, 2);
  const semanaDeHoy = diaRuta(Math.max(diaMostrado, 1)).semana;
  const enSemana = cuenta.piezas.filter((p) => diaRuta(p.dia).semana === semanaDeHoy).length;
  const diasSemana = RUTA.filter((d) => d.semana === semanaDeHoy).length;

  const entrar = (i: number) => ({
    initial: { opacity: 0, y: reduce ? 0 : 14 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, delay: reduce ? 0 : 0.05 + i * 0.06, ease: EASE_SALIDA },
  });

  const insight = e.hechaHoy
    ? `Mañana el Método Pieza a Pieza usa lo de hoy para armar ${siguiente ? minusculaInicial(siguiente.pieza) : 'el cierre de tu ruta'}.`
    : usadas.length
      ? `El Método Pieza a Pieza ya tiene ${lista(usadas)}: hoy arma ${minusculaInicial(hoyRuta.pieza)} con eso.`
      : 'Hoy empieza tu Método Pieza a Pieza: cada pieza se suma a la siguiente.';

  const destinoHeroe = e.terminada ? '/app/empresa' : e.hechaHoy ? `/app/empresa?pieza=${diaMostrado}` : '/app/mision';
  const textoCta = e.terminada ? 'Ver mi negocio completo' : e.hechaHoy ? 'Ver mi pieza de hoy' : 'Empezar la misión de hoy';

  return (
    <main>
      {/* Cabecera: 2 chips circulares + título centrado */}
      <header className="flex h-16 items-center justify-between px-4">
        <a
          href={`mailto:${RESPONSABLE.emailContacto}?subject=${encodeURIComponent('Ayuda con EMPRESAI')}`}
          aria-label="Pedir ayuda"
          className="tarjeta-relieve flex size-11 items-center justify-center rounded-full text-ink-2 transition-transform duration-150 active:scale-95"
        >
          <LifeBuoy size={20} aria-hidden="true" />
        </a>
        <p className="font-display text-lg font-extrabold tracking-[-0.01em] text-ink-1">EMPRESAI</p>
        <Link
          href="/app/perfil#recordatorio"
          aria-label="Tu recordatorio diario"
          className="tarjeta-relieve flex size-11 items-center justify-center rounded-full text-ink-2 transition-transform duration-150 active:scale-95"
        >
          <Bell size={20} aria-hidden="true" />
        </Link>
      </header>

      <div className="px-4">
        <motion.div {...entrar(0)}>
          <p className="text-sm text-ink-3">{fechaLarga()}</p>
          <h1 className="font-display text-xl font-extrabold text-ink-1">{saludo()}</h1>
        </motion.div>

        {/* 1. EL DATO DE HOY: la misión (o lo que ya armaste). Toda la tarjeta lleva a la acción. */}
        <motion.div {...entrar(1)}>
          <Link
            href={destinoHeroe}
            className={`heroe-hoy relative mt-4 block overflow-hidden rounded-[var(--radius-card)] p-4 transition-transform duration-150 active:scale-[0.99] ${
              e.hechaHoy ? 'tarjeta-relieve' : 'tarjeta-relieve-oro'
            }`}
          >
            <span aria-hidden="true" className="pointer-events-none absolute -top-1 right-1 h-28 w-28">
              <motion.span
                className="cubo-vidrio cubo-verde absolute top-8 right-10 flex size-12 rotate-[-10deg] items-center justify-center rounded-[var(--radius-chip)]"
                animate={reduce ? undefined : { y: [0, -4, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              >
                <span className="size-5 rounded-[var(--radius-chip)] bg-gradient-to-br from-green-light to-green" />
              </motion.span>
              <motion.span
                className="cubo-vidrio cubo-oro absolute top-3 right-1 flex size-11 rotate-[8deg] items-center justify-center rounded-[var(--radius-chip)]"
                animate={reduce ? undefined : { y: [0, 4, 0] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
              >
                <span className="size-4 rounded-[var(--radius-chip)] bg-gradient-to-br from-gold-light to-gold" />
              </motion.span>
            </span>

            <span className={`relative block text-xs font-bold tracking-[0.08em] uppercase ${e.hechaHoy ? 'text-green' : 'text-gold'}`}>
              Día {diaMostrado} de {TOTAL_DIAS} · {e.hechaHoy ? 'Listo' : `Semana ${hoyRuta.semana}`}
            </span>
            <span className="relative mt-2 block pr-24 font-display text-2xl leading-tight font-extrabold text-ink-1">
              {e.terminada ? '¡Tu negocio está listo para vender!' : e.hechaHoy ? `¡Pieza ${diaMostrado} lista!` : `Hoy: ${minusculaInicial(hoyRuta.mision)}`}
            </span>
            <span className="relative mt-2 block text-sm text-ink-2">
              {e.hechaHoy && siguiente ? `Mañana · Día ${siguiente.dia}: ${minusculaInicial(siguiente.pieza)}` : '5 minutos, desde el celular'}
            </span>
            <span className="relative mt-4 flex items-center gap-3">
              <span
                className="h-2 flex-1 overflow-hidden rounded-full bg-[color-mix(in_oklab,var(--ink-1)_10%,transparent)]"
                role="progressbar"
                aria-label="Piezas de tu ruta"
                aria-valuemin={0}
                aria-valuemax={TOTAL_DIAS}
                aria-valuenow={e.piezasListas}
              >
                <motion.span
                  className="block h-full origin-left rounded-full bg-gradient-to-r from-green to-green-light"
                  style={{ width: `${Math.max(e.piezasListas / TOTAL_DIAS, 0.03) * 100}%` }}
                  initial={{ scaleX: reduce ? 1 : 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: reduce ? 0 : 0.7, delay: reduce ? 0 : 0.35, ease: EASE_SALIDA }}
                />
              </span>
              <span className="text-xs font-semibold tabular-nums text-ink-3">
                {e.piezasListas}/{TOTAL_DIAS}
              </span>
            </span>
          </Link>
        </motion.div>

        {/* 2. LA ACCIÓN DE 1 TOQUE (siempre visible sin bajar) */}
        <motion.div {...entrar(2)} className="mt-4">
          <Link href={destinoHeroe} className="boton-oro flex h-14 items-center justify-center gap-2 rounded-[var(--radius-pill)] font-display text-boton font-bold">
            {textoCta}
            <ArrowRight size={20} aria-hidden="true" />
          </Link>
        </motion.div>

        {/* 3. LA RACHA (visible, no protagonista) + 2 datos reales; cada uno lleva a su sección */}
        <motion.ul {...entrar(3)} className="mt-6 grid grid-cols-3 gap-3" aria-label="Tu avance">
          <li>
            <Link href="/app/ruta" className="tarjeta-relieve flex h-full flex-col gap-2 rounded-[var(--radius-card)] p-3 transition-transform duration-150 active:scale-[0.97]">
              {e.rachaEnRiesgo ? (
                <span aria-hidden="true" className="flex size-10 items-center justify-center rounded-[var(--radius-chip)] border-[1.5px] border-ink-2 text-ink-2">
                  <Flame size={20} strokeWidth={1.8} />
                </span>
              ) : (
                <span aria-hidden="true" className="relieve-oro flex size-10 items-center justify-center rounded-[var(--radius-chip)]">
                  <Flame size={20} fill="currentColor" strokeWidth={1.5} />
                </span>
              )}
              <span className="font-display text-precio leading-none font-extrabold text-ink-1">
                <Cuenta valor={e.racha} />
              </span>
              <span className="text-xs text-ink-2">{e.racha === 1 ? 'día de racha' : 'días de racha'}</span>
            </Link>
          </li>
          <li>
            <Link href="/app/empresa" className="tarjeta-relieve flex h-full flex-col gap-2 rounded-[var(--radius-card)] p-3 transition-transform duration-150 active:scale-[0.97]">
              <span aria-hidden="true" className="relieve-verde flex size-10 items-center justify-center rounded-[var(--radius-chip)]">
                <Puzzle size={20} strokeWidth={2.2} />
              </span>
              <span className="font-display text-precio leading-none font-extrabold text-ink-1">
                <Cuenta valor={e.piezasListas} />
              </span>
              <span className="text-xs text-ink-2">{e.piezasListas === 1 ? 'pieza lista' : 'piezas listas'}</span>
            </Link>
          </li>
          <li>
            <Link href="/app/ruta" className="tarjeta-relieve flex h-full flex-col gap-2 rounded-[var(--radius-card)] p-3 transition-transform duration-150 active:scale-[0.97]">
              <span aria-hidden="true" className="relieve-piedra flex size-10 items-center justify-center rounded-[var(--radius-chip)]">
                <CalendarCheck size={20} strokeWidth={2.2} />
              </span>
              <span className="font-display text-precio leading-none font-extrabold text-ink-1">
                <Cuenta valor={enSemana} />
                <span className="text-base text-ink-3">/{diasSemana}</span>
              </span>
              <span className="text-xs text-ink-2">esta semana</span>
            </Link>
          </li>
        </motion.ul>
        {e.rachaEnRiesgo && (
          <p className="mt-2 text-caption text-ink-2">
            La llama está en modo siesta: tu misión de hoy la vuelve a prender y sigue tu racha de {e.racha} {e.racha === 1 ? 'día' : 'días'}.
          </p>
        )}

        {/* 4. EL INSIGHT en la voz del Método */}
        <motion.p {...entrar(4)} className="mt-4 flex items-start gap-2 text-ayuda leading-snug text-ink-2">
          <Sparkles size={18} className="mt-0.5 shrink-0 text-ink-3" aria-hidden="true" />
          {insight}
        </motion.p>

        {/* Filas en píldora: tus últimas piezas */}
        {ultimas.length > 0 && (
          <motion.ul {...entrar(5)} className="mt-4 flex flex-col gap-3" aria-label="Tus últimas piezas">
            {ultimas.map((p) => (
              <li key={p.dia}>
                <Link
                  href={`/app/empresa?pieza=${p.dia}`}
                  className="fila-pildora flex min-h-16 items-center gap-3 py-2 pr-2 pl-5 transition-transform duration-150 active:scale-[0.98]"
                >
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-display text-base font-bold text-ink-1">{p.titulo}</span>
                    <span className="block text-xs text-ink-3">Día {p.dia} · lista</span>
                  </span>
                  <span aria-hidden="true" className="relieve-piedra flex size-11 shrink-0 items-center justify-center rounded-full">
                    <ChevronRight size={20} strokeWidth={2.4} />
                  </span>
                </Link>
              </li>
            ))}
          </motion.ul>
        )}
      </div>
    </main>
  );
}
