'use client';

// HOY — el ritual diario (56 §M0), la pantalla más vista. Composición de la referencia de la dueña
// (cabecera con 2 chips + título centrado · saludo · tarjeta héroe con cubos de vidrio · 3 datos ·
// filas en píldora · CTA en píldora) con los colores de la Opción C (FICHA-ARTE).
// Orden M0: el dato de hoy → la acción de 1 toque → la racha → el insight en voz del Método.

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { animate, motion, useReducedMotion } from 'motion/react';
import { ArrowRight, Bell, ChevronRight, Clock, Flame, Puzzle, Settings2, Sparkles } from 'lucide-react';
import { estadoRuta } from '@/lib/cuenta';
import { RUTA, SEMANAS, TOTAL_DIAS, diaRuta } from '@/lib/ruta';
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
  const semana = SEMANAS[hoyRuta.semana - 1];
  const diaMostrado = e.hechaHoy ? e.piezasListas : e.diaActual;
  const siguiente = !e.terminada ? diaRuta(e.hechaHoy ? e.diaActual : e.diaActual + 1) : undefined;
  const usadas = hoyRuta.usa.map((d) => RUTA[d - 1].pieza.replace(/^Tu |^Tus |^El |^La /, '').toLowerCase());
  const ultimas = [...cuenta.piezas].sort((a, b) => b.dia - a.dia).slice(0, 2);
  const semanaHecha = diaRuta(Math.max(diaMostrado, 1)).semana;
  const enSemana = cuenta.piezas.filter((p) => diaRuta(p.dia).semana === semanaHecha).length;

  const entrar = (i: number) => ({
    initial: { opacity: 0, y: reduce ? 0 : 14 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, delay: reduce ? 0 : 0.05 + i * 0.06, ease: EASE_SALIDA },
  });

  const insight = e.hechaHoy
    ? `Llevas ${enSemana} de 7 piezas de la semana ${semanaHecha}. Mañana el Método usa lo de hoy para ${siguiente ? siguiente.pieza.toLowerCase() : 'cerrar tu ruta'}.`
    : usadas.length
      ? `El Método Pieza a Pieza ya tiene ${usadas.join(' y ')}: hoy los usa para armar ${hoyRuta.pieza.toLowerCase()}.`
      : 'Hoy empieza tu Método Pieza a Pieza: cada pieza se suma a la siguiente.';

  return (
    <main>
      {/* Cabecera: 2 chips circulares + título centrado */}
      <header className="flex h-16 items-center justify-between px-4">
        <Link
          href="/app/perfil"
          aria-label="Ajustes"
          className="tarjeta-relieve flex size-11 items-center justify-center rounded-full text-ink-2 transition-transform duration-150 active:scale-95"
        >
          <Settings2 size={20} aria-hidden="true" />
        </Link>
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
          <h1 className="font-display text-pregunta font-extrabold tracking-[-0.02em] text-ink-1">{saludo()}</h1>
        </motion.div>

        {/* 1. EL DATO DE HOY: la misión (o lo que ya armaste) */}
        <motion.section
          {...entrar(1)}
          aria-label="Tu misión de hoy"
          className={`relative mt-4 overflow-hidden rounded-[var(--radius-card)] p-4 ${e.hechaHoy ? 'tarjeta-relieve' : 'tarjeta-relieve-oro'}`}
        >
          <div aria-hidden="true" className="pointer-events-none absolute -top-2 right-2 h-32 w-32">
            <motion.span
              className="cubo-vidrio absolute top-8 right-12 flex size-14 rotate-[-10deg] items-center justify-center rounded-[var(--radius-chip)]"
              animate={reduce ? undefined : { y: [0, -4, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            >
              <span className="size-6 rounded-[var(--radius-chip)] bg-gradient-to-br from-green-light to-green" />
            </motion.span>
            <motion.span
              className="cubo-vidrio absolute top-4 right-1 flex size-12 rotate-[8deg] items-center justify-center rounded-[var(--radius-chip)]"
              animate={reduce ? undefined : { y: [0, 4, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <span className="size-5 rounded-[var(--radius-chip)] bg-gradient-to-br from-gold-light to-gold" />
            </motion.span>
          </div>

          <p className={`relative text-xs font-bold tracking-[0.08em] uppercase ${e.hechaHoy ? 'text-green' : 'text-gold'}`}>
            Día {diaMostrado} de {TOTAL_DIAS} · {e.hechaHoy ? 'Listo' : `Semana ${semana.numero}`}
          </p>
          <h2 className="relative mt-2 max-w-[70%] font-display text-xl leading-snug font-extrabold text-ink-1">
            {e.terminada ? '¡Tu negocio está listo para vender!' : e.hechaHoy ? `¡Pieza ${diaMostrado} lista!` : `Hoy: ${hoyRuta.mision.charAt(0).toLowerCase()}${hoyRuta.mision.slice(1)}`}
          </h2>
          <p className="relative mt-2 text-sm text-ink-2">
            {e.hechaHoy && siguiente
              ? `Mañana · Día ${siguiente.dia}: ${siguiente.pieza.toLowerCase()}`
              : usadas.length
                ? `5 minutos · usa ${usadas.join(' y ')}`
                : '5 minutos · tu primera pieza'}
          </p>
          <div className="relative mt-4 flex items-center gap-3">
            <div
              className="h-2 flex-1 overflow-hidden rounded-full bg-[color-mix(in_oklab,var(--ink-1)_10%,transparent)]"
              role="progressbar"
              aria-label="Piezas de tu ruta"
              aria-valuemin={0}
              aria-valuemax={TOTAL_DIAS}
              aria-valuenow={e.piezasListas}
            >
              <motion.div
                className="h-full origin-left rounded-full bg-gradient-to-r from-green to-green-light"
                style={{ width: `${Math.max(e.piezasListas / TOTAL_DIAS, 0.03) * 100}%` }}
                initial={{ scaleX: reduce ? 1 : 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: reduce ? 0 : 0.7, delay: reduce ? 0 : 0.35, ease: EASE_SALIDA }}
              />
            </div>
            <span className="text-xs font-semibold tabular-nums text-ink-3">
              {e.piezasListas}/{TOTAL_DIAS}
            </span>
          </div>
        </motion.section>

        {/* 3. LA RACHA (visible, no protagonista) + 2 datos */}
        <motion.ul {...entrar(2)} className="mt-4 grid grid-cols-3 gap-3" aria-label="Tu avance">
          <li className="tarjeta-relieve flex flex-col gap-2 rounded-[var(--radius-card)] p-3">
            {e.rachaEnRiesgo ? (
              <motion.span
                aria-hidden="true"
                className="flex size-10 items-center justify-center rounded-[var(--radius-chip)] border-[1.5px] border-ink-3 text-ink-3"
                animate={reduce ? undefined : { opacity: [0.5, 0.75, 0.5] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              >
                <Flame size={20} strokeWidth={1.8} />
              </motion.span>
            ) : (
              <span aria-hidden="true" className="relieve-oro flex size-10 items-center justify-center rounded-[var(--radius-chip)]">
                <Flame size={20} fill="currentColor" strokeWidth={1.5} />
              </span>
            )}
            <span className={`font-display text-precio leading-none font-extrabold ${e.rachaEnRiesgo ? 'text-ink-2' : 'text-ink-1'}`}>
              <Cuenta valor={e.racha} />
            </span>
            <span className="text-xs text-ink-2">{e.racha === 1 ? 'día de racha' : 'días de racha'}</span>
          </li>
          <li className="tarjeta-relieve flex flex-col gap-2 rounded-[var(--radius-card)] p-3">
            <span aria-hidden="true" className="relieve-verde flex size-10 items-center justify-center rounded-[var(--radius-chip)]">
              <Puzzle size={20} strokeWidth={2.2} />
            </span>
            <span className="font-display text-precio leading-none font-extrabold text-ink-1">
              <Cuenta valor={e.piezasListas} />
            </span>
            <span className="text-xs text-ink-2">{e.piezasListas === 1 ? 'pieza lista' : 'piezas listas'}</span>
          </li>
          <li className="tarjeta-relieve flex flex-col gap-2 rounded-[var(--radius-card)] p-3">
            <span aria-hidden="true" className="relieve-piedra flex size-10 items-center justify-center rounded-[var(--radius-chip)]">
              <Clock size={20} strokeWidth={2.2} />
            </span>
            <span className="font-display text-precio leading-none font-extrabold text-ink-1">
              <Cuenta valor={e.minutos} />
            </span>
            <span className="text-xs text-ink-2">min en total</span>
          </li>
        </motion.ul>
        {e.rachaEnRiesgo && (
          <p className="mt-2 text-caption text-ink-2">
            Tu racha de {e.racha} {e.racha === 1 ? 'día' : 'días'} sigue viva: la misión de hoy la mantiene.
          </p>
        )}

        {/* 4. EL INSIGHT en la voz del Método */}
        <motion.p {...entrar(3)} className="mt-4 flex items-start gap-2 text-ayuda leading-snug text-ink-2">
          <Sparkles size={18} className="mt-0.5 shrink-0 text-ink-3" aria-hidden="true" />
          {insight}
        </motion.p>

        {/* Filas en píldora: tus últimas piezas */}
        {ultimas.length > 0 && (
          <motion.ul {...entrar(4)} className="mt-4 flex flex-col gap-3" aria-label="Tus últimas piezas">
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

        {/* 2. LA ACCIÓN DE 1 TOQUE */}
        <motion.div {...entrar(5)} className="mt-6">
          {e.terminada ? (
            <Link href="/app/empresa" className="boton-oro flex h-14 items-center justify-center gap-2 rounded-[var(--radius-pill)] font-display text-boton font-bold">
              Ver mi negocio completo
              <ArrowRight size={20} aria-hidden="true" />
            </Link>
          ) : e.hechaHoy ? (
            <Link
              href={`/app/empresa?pieza=${diaMostrado}`}
              className="boton-oro flex h-14 items-center justify-center gap-2 rounded-[var(--radius-pill)] font-display text-boton font-bold"
            >
              Ver mi pieza de hoy
              <ArrowRight size={20} aria-hidden="true" />
            </Link>
          ) : (
            <Link href="/app/mision" className="boton-oro flex h-14 items-center justify-center gap-2 rounded-[var(--radius-pill)] font-display text-boton font-bold">
              Empezar la misión de hoy
              <ArrowRight size={20} aria-hidden="true" />
            </Link>
          )}
        </motion.div>
      </div>
    </main>
  );
}
