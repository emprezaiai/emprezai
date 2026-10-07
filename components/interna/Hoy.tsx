'use client';

// HOY — el ritual diario (56 §M0), la pantalla más vista. Composición de la referencia de la dueña
// (cabecera con 2 chips + título centrado · saludo · tarjeta héroe con cubos de vidrio · acción ·
// 3 datos · filas en píldora) con los colores de la Opción C (FICHA-ARTE).
// Orden M0: el dato de hoy → la acción de 1 toque (visible sin bajar) → la racha → el insight.

import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { animate, motion, useReducedMotion } from 'motion/react';
import { ArrowRight, Bell, BellRing, CalendarCheck, CheckCircle2, ChevronRight, Flame, LifeBuoy, LockKeyhole, Map as IconoMapa, Puzzle, RotateCcw, Sparkles, WifiOff } from 'lucide-react';
import { avanceBorrador } from '@/lib/borradores';
import { estadoRuta, importarPieza1SiFalta, pieza1PorTraer } from '@/lib/cuenta';
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

function suscribirConexion(aviso: () => void) {
  window.addEventListener('online', aviso);
  window.addEventListener('offline', aviso);
  return () => {
    window.removeEventListener('online', aviso);
    window.removeEventListener('offline', aviso);
  };
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
      {reduce ? valor : 0}
    </span>
  );
}

export function Hoy() {
  const cuenta = useCuentaActiva();
  const reduce = useReducedMotion();
  const [reintento, setReintento] = useState<'' | 'fallo' | 'fallo2' | 'ok'>('');
  const [reintentando, setReintentando] = useState(false);
  const enLinea = useSyncExternalStore(suscribirConexion, () => navigator.onLine, () => true);

  useEffect(() => {
    if (reintento !== 'ok') return;
    const t = window.setTimeout(() => setReintento(''), 2400);
    return () => window.clearTimeout(t);
  }, [reintento]);
  const faltaPieza1 = pieza1PorTraer(cuenta);
  const e = estadoRuta(cuenta);
  const hoyRuta = diaRuta(e.diaActual);
  const diaMostrado = e.hechaHoy ? e.piezasListas : e.diaActual;
  const siguiente = !e.terminada ? diaRuta(e.hechaHoy ? e.diaActual : e.diaActual + 1) : undefined;
  // "tu cliente ideal y tu oferta" (con posesivo: se lee natural y no exige concordar)
  const usadas = hoyRuta.usa.filter((d) => cuenta.piezas.some((p) => p.dia === d)).map((d) => minusculaInicial(RUTA[d - 1].pieza));
  const ultimas = [...cuenta.piezas]
    .filter((p) => !(e.hechaHoy && p.dia === diaMostrado))
    .sort((a, b) => b.dia - a.dia)
    .slice(0, 2);
  const semanaDeHoy = diaRuta(Math.max(diaMostrado, 1)).semana;
  const enSemana = cuenta.piezas.filter((p) => diaRuta(p.dia).semana === semanaDeHoy).length;
  const diasSemana = RUTA.filter((d) => d.semana === semanaDeHoy).length;

  const entrar = (i: number) => ({
    initial: { opacity: 0, y: reduce ? 0 : 14 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, delay: reduce ? 0 : 0.05 + i * 0.06, ease: EASE_SALIDA },
  });

  // Racha rota: volvió después de días sin pieza (la racha cayó a 0 pero ya tiene piezas)
  const rachaRota = e.racha === 0 && e.piezasListas > 0 && !e.hechaHoy && !e.terminada;
  const insight = rachaRota
    ? `Tu racha vuelve a empezar hoy: arma ${minusculaInicial(hoyRuta.pieza)} y enciende la llama de nuevo.`
    : e.hechaHoy
    ? `Mañana el Método Pieza a Pieza usa lo de hoy para armar ${siguiente ? minusculaInicial(siguiente.pieza) : 'el cierre de tu ruta'}.`
    : usadas.length
      ? `El Método Pieza a Pieza ya tiene ${lista(usadas)}: hoy arma ${minusculaInicial(hoyRuta.pieza)} con eso.`
      : 'Hoy empieza tu Método Pieza a Pieza: cada pieza se suma a la siguiente.';

  // Si ya empezó la misión y la dejó a medias, el botón lo dice (sigue donde quedó).
  const avance = !e.hechaHoy && !e.terminada ? avanceBorrador(e.diaActual) : null;
  const enCurso = Boolean(avance);
  const textoCta = e.terminada
    ? 'Ver mi negocio completo'
    : e.hechaHoy
      ? 'Ver lo que sigue en mi ruta'
      : enCurso
        ? 'Seguir donde lo dejé'
        : 'Empezar la misión de hoy';
  const destinoCta = e.terminada ? '/app/empresa' : e.hechaHoy ? '/app/ruta' : '/app/mision';

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
          <p className="text-xs text-ink-3">{fechaLarga()}</p>
          <p className="font-display text-base font-semibold text-ink-1">{saludo()}</p>
        </motion.div>

        {/* 1. EL DATO DE HOY: la misión (o lo que ya armaste). La acción es el botón de abajo. */}
        <motion.div {...entrar(1)}>
          <div
            className={`heroe-hoy relative mt-4 block overflow-hidden rounded-[var(--radius-card)] p-4 ${
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
            <h1 className="relative mt-2 block font-display text-2xl leading-tight font-extrabold text-ink-1">
              <span aria-hidden="true" className="float-right h-[1lh] w-24" />
              {e.terminada ? '¡Tu negocio está listo para vender!' : e.hechaHoy ? `¡Pieza ${diaMostrado} lista!` : `Hoy: ${minusculaInicial(hoyRuta.mision)}`}
            </h1>
            <span className="relative mt-2 block text-ayuda text-ink-2">
              {e.hechaHoy
                ? 'Ya está guardada en Mi Empresa'
                : avance?.tipo === 'guiado'
                  ? `Ya respondiste ${avance.respondidas} de 3: te falta poco`
                  : avance?.tipo === 'texto'
                    ? 'Tu borrador te espera, tal como lo dejaste'
                    : '5 minutos, desde el celular'}
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
                  style={{ width: `${(e.piezasListas / TOTAL_DIAS) * 100}%` }}
                  initial={{ scaleX: reduce ? 1 : 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: reduce ? 0 : 0.7, delay: reduce ? 0 : 0.35, ease: EASE_SALIDA }}
                />
              </span>
              <span className="text-xs font-semibold tabular-nums text-ink-3">
                {e.piezasListas}/{TOTAL_DIAS}
              </span>
            </span>
          </div>
        </motion.div>

        {/* 2. LA ACCIÓN DE 1 TOQUE (siempre visible sin bajar) */}
        <motion.div {...entrar(2)} className="mt-4">
          <Link
            href={destinoCta}
            className={`flex h-14 items-center justify-center gap-2 rounded-[var(--radius-pill)] font-display text-boton font-bold ${
              e.hechaHoy || e.terminada ? 'fila-pildora text-ink-1 transition-transform duration-150 active:scale-[0.98]' : 'boton-oro'
            }`}
          >
            {textoCta}
            <ArrowRight size={20} aria-hidden="true" />
          </Link>
        </motion.div>

        {/* 3. LA RACHA (visible, no protagonista) + 2 datos reales; cada uno lleva a su sección */}
        <motion.ul {...entrar(3)} className="mt-6 grid grid-cols-3 gap-3" aria-label="Tu avance">
          <li>
            <Link
              href="/app/perfil#recordatorio"
              aria-label={`${e.racha} ${e.racha === 1 ? 'día' : 'días'} de racha${e.rachaEnRiesgo ? ', en juego hoy' : ''}. Ver tu recordatorio diario`}
              className="tarjeta-relieve flex h-full flex-col gap-2 rounded-[var(--radius-card)] p-3 transition-transform duration-150 active:scale-[0.97]"
            >
              <motion.span
                aria-hidden="true"
                className={`flex size-10 items-center justify-center rounded-[var(--radius-chip)] ${
                  e.racha === 0 ? 'relieve-piedra-apagada' : e.rachaEnRiesgo ? 'relieve-ambar' : 'relieve-oro'
                }`}
                /* la llama viva late una vez cuando termina de contar */
                initial={{ scale: 1 }}
                animate={e.racha > 0 && !e.rachaEnRiesgo && !reduce ? { scale: [1, 1.15, 1] } : { scale: 1 }}
                transition={{ duration: 0.45, delay: 0.95, ease: 'easeOut' }}
              >
                <Flame size={20} fill={e.racha > 0 ? 'currentColor' : 'none'} strokeWidth={e.racha > 0 ? 1.5 : 1.8} />
              </motion.span>
              <span className="font-display text-precio leading-none font-extrabold text-ink-1">
                <Cuenta valor={e.racha} />
              </span>
              <span className="mt-auto text-xs text-ink-2">{e.racha === 1 ? 'día de racha' : 'días de racha'}</span>
              <span className="-mt-1 flex items-center gap-1 text-[11px] font-semibold text-ink-3">
                <BellRing size={11} aria-hidden="true" />
                {cuenta.momento === 'manana' ? 'aviso de mañana' : cuenta.momento === 'mediodia' ? 'aviso al mediodía' : cuenta.momento === 'noche' ? 'aviso de noche' : 'tu aviso'}
              </span>
            </Link>
          </li>
          <li>
            <Link href="/app/empresa" className="tarjeta-relieve flex h-full flex-col gap-2 rounded-[var(--radius-card)] p-3 transition-transform duration-150 active:scale-[0.97]">
              <span
                aria-hidden="true"
                className={`${e.piezasListas ? 'relieve-verde' : 'relieve-piedra-apagada'} flex size-10 items-center justify-center rounded-[var(--radius-chip)]`}
              >
                <Puzzle size={20} strokeWidth={2.2} />
              </span>
              <span className="font-display text-precio leading-none font-extrabold text-ink-1">
                <Cuenta valor={e.piezasListas} />
              </span>
              <span className="mt-auto text-xs text-ink-2">{e.piezasListas === 1 ? 'pieza lista' : 'piezas listas'}</span>
            </Link>
          </li>
          <li>
            <div className="tarjeta-relieve-base flex h-full flex-col gap-2 rounded-[var(--radius-card)] p-3">
              <span aria-hidden="true" className="relieve-piedra flex size-10 items-center justify-center rounded-[var(--radius-chip)]">
                <CalendarCheck size={20} strokeWidth={2.2} />
              </span>
              <span className="font-display text-precio leading-none font-extrabold text-ink-1">
                <Cuenta valor={enSemana} />
                <span className="text-base text-ink-3">/{diasSemana}</span>
              </span>
              <span role="img" className="flex h-2 items-center gap-1" aria-label={`${enSemana} de ${diasSemana} piezas de la semana ${semanaDeHoy}`}>
                {Array.from({ length: diasSemana }, (_, i) => (
                  <motion.span
                    key={i}
                    aria-hidden="true"
                    initial={{ scale: reduce ? 1 : 0.4, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', bounce: 0.25, duration: 0.4, delay: reduce ? 0 : 0.35 + i * 0.04 }}
                    className={`size-2 rounded-full ${i < enSemana ? 'bg-green' : 'border-[1.5px] border-ink-3'}`}
                  />
                ))}
              </span>
              <span className="mt-auto text-xs text-ink-2">semana {semanaDeHoy}</span>
            </div>
          </li>
        </motion.ul>
        {/* 4. EL INSIGHT en la voz del Método (con el estado de la racha si está en riesgo) */}
        <motion.p {...entrar(4)} className="mt-4 flex items-start gap-2 rounded-[var(--radius-card)] bg-sunken p-4 text-ayuda leading-snug text-ink-2">
          <Sparkles size={18} className="mt-0.5 shrink-0 text-ink-3" aria-hidden="true" />
          <span>
            {e.rachaEnRiesgo ? (
              usadas.length ? (
                <>
                  <strong className="font-semibold text-ink-1">
                    Tu racha de {e.racha} {e.racha === 1 ? 'día' : 'días'} sigue si hoy armas {minusculaInicial(hoyRuta.pieza)}.
                  </strong>{' '}
                  El Método ya tiene {lista(usadas)} para ayudarte.
                </>
              ) : (
                <strong className="font-semibold text-ink-1">
                  Tu racha de {e.racha} {e.racha === 1 ? 'día' : 'días'} sigue si hoy armas {minusculaInicial(hoyRuta.pieza)}.
                </strong>
              )
            ) : (
              insight
            )}
          </span>
        </motion.p>

        <p role="status" aria-live="polite" className="sr-only">
          {reintento === 'ok' && !faltaPieza1
            ? 'Listo: tu pieza 1 ya está en Mi Empresa.'
            : faltaPieza1 && reintento === 'fallo2'
              ? 'Tu pieza 1 sigue sin entrar. Escríbenos y lo resolvemos contigo.'
              : faltaPieza1 && reintento === 'fallo'
                ? 'Tu pieza 1 sigue sin entrar: libera espacio y vuelve a tocar Reintentar.'
                : !enLinea
                  ? 'Sin conexión: puedes hacer la misión igual; todo se guarda en este celular.'
                  : ''}
        </p>
        <div>
          {faltaPieza1 ? (
            <motion.div {...entrar(5)} className="mt-4 flex items-center gap-3 rounded-[var(--radius-card)] border border-[var(--line)] bg-sunken p-3">
              <p className="min-w-0 flex-1 text-caption text-ink-2">
                {reintento === 'fallo2' ? (
                  <>
                    Sigue sin entrar.{' '}
                    <a
                      href={`mailto:${RESPONSABLE.emailContacto}?subject=${encodeURIComponent('Mi pieza 1 no pasa a Mi Empresa')}`}
                      className="font-semibold text-ink-1 underline underline-offset-4"
                    >
                      Escríbenos
                    </a>{' '}
                    y lo resolvemos contigo.
                  </>
                ) : reintento === 'fallo' ? (
                  'Sigue sin entrar: libera espacio en el celular y vuelve a tocar.'
                ) : (
                  'Tu pieza 1 todavía no pasó a Mi Empresa. Suele ser falta de espacio en el celular.'
                )}
              </p>
              <button
                type="button"
                disabled={reintentando}
                onClick={() => {
                  setReintentando(true);
                  const ok = importarPieza1SiFalta(cuenta);
                  setReintento(ok ? 'ok' : reintento === '' ? 'fallo' : 'fallo2');
                  window.setTimeout(() => setReintentando(false), 800);
                }}
                className="flex min-h-11 shrink-0 items-center gap-1 rounded-[var(--radius-pill)] border border-[var(--line)] bg-raised-2 px-3 text-sm font-semibold text-ink-1 transition-transform duration-150 active:scale-[0.97] disabled:opacity-60"
              >
                <RotateCcw size={16} aria-hidden="true" />
                Reintentar
              </button>
            </motion.div>
          ) : reintento === 'ok' ? (
            <motion.p
              initial={{ opacity: 0, y: reduce ? 0 : 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: EASE_SALIDA }}
              className="mt-4 flex items-center gap-2 text-caption text-green"
            >
              <CheckCircle2 size={16} aria-hidden="true" />
              Listo: tu pieza 1 ya está en Mi Empresa.
            </motion.p>
          ) : null}
          {!enLinea && (
            <p className="mt-4 flex items-center gap-2 text-caption text-ink-2">
              <WifiOff size={16} className="shrink-0 text-ink-3" aria-hidden="true" />
              Sin conexión: puedes hacer la misión igual; todo se guarda en este celular.
            </p>
          )}
        </div>

        {/* Filas en píldora: tus últimas piezas */}
        {e.piezasListas === 0 && (
          <motion.div {...entrar(5)} className="mt-4">
            <Link
              href="/app/ruta"
              className="fila-pildora flex min-h-16 items-center gap-3 py-2 pr-2 pl-5 transition-transform duration-150 active:scale-[0.98]"
            >
              <span className="min-w-0 flex-1">
                <span className="block truncate font-display text-ayuda font-bold text-ink-1">Esta semana: 7 piezas de 5 min</span>
                <span className="block truncate text-xs text-ink-3">Tu frase, tu cliente ideal, tu oferta, tu precio…</span>
              </span>
              <span aria-hidden="true" className="relieve-piedra flex size-11 shrink-0 items-center justify-center rounded-full">
                <IconoMapa size={18} strokeWidth={2.2} />
              </span>
            </Link>
          </motion.div>
        )}

        {(ultimas.length > 0 || (e.hechaHoy && siguiente)) && (
          <motion.ul {...entrar(5)} className="mt-4 flex flex-col gap-3" aria-label="Tus últimas piezas">
            {ultimas.map((p) => (
              <li key={p.dia}>
                <Link
                  href={`/app/empresa?pieza=${p.dia}`}
                  className="fila-pildora flex min-h-16 items-center gap-3 py-2 pr-2 pl-5 transition-transform duration-150 active:scale-[0.98]"
                >
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-display text-ayuda font-bold text-ink-1">{p.titulo}</span>
                    <span className="block text-xs text-ink-3">Día {p.dia} · lista</span>
                  </span>
                  <span aria-hidden="true" className="relieve-piedra flex size-11 shrink-0 items-center justify-center rounded-full">
                    <ChevronRight size={20} strokeWidth={2.4} />
                  </span>
                </Link>
              </li>
            ))}
            {e.hechaHoy && siguiente && (
              <li>
                <div className="flex min-h-16 items-center gap-3 rounded-[var(--radius-pill)] border border-dashed border-[var(--line)] bg-sunken py-2 pr-2 pl-5">
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-display text-ayuda font-bold text-ink-1">{siguiente.pieza}</span>
                    <span className="block text-xs text-ink-3">Mañana · Día {siguiente.dia} · 5 min</span>
                  </span>
                  <span aria-hidden="true" className="relieve-piedra-apagada flex size-11 shrink-0 items-center justify-center rounded-full">
                    <LockKeyhole size={18} />
                  </span>
                </div>
              </li>
            )}
          </motion.ul>
        )}
      </div>
    </main>
  );
}
