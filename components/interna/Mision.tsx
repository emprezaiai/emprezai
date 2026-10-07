'use client';

// LA MISIÓN DEL DÍA — 5 minutos, una pieza. Misiones guiadas (días 2-4): preguntas con opciones del
// área + "Otra cosa", la pieza se arma con tus respuestas y tus piezas anteriores (Método Pieza a
// Pieza) y se guarda en Mi Empresa con celebración (hito real). Del día 5 en adelante la arma la IA
// (Sesión 6): la pantalla lo dice con honestidad y no inventa resultados.

import { useEffect, useId, useRef, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ArrowLeft, ArrowRight, Check, Flame, Lightbulb, PencilLine, RotateCcw, Sparkles, Zap } from 'lucide-react';
import { estadoRuta, guardarPieza } from '@/lib/cuenta';
import { misionGuiada, type ContextoMision, type PiezaCompuesta } from '@/lib/misiones';
import { RUTA, diaRuta } from '@/lib/ruta';
import { limpiarTexto } from '@/lib/onboarding';
import { EASE_SALIDA, vibrar } from '@/components/onboarding/piezas';
import { useCuentaActiva } from './Marco';

const LARGO_MAX = 80;
const CHISPAS = [0, 60, 120, 180, 240, 300];

export function Mision() {
  const cuenta = useCuentaActiva();
  const e = estadoRuta(cuenta);
  const dia = diaRuta(e.diaActual);
  // Al guardar, la cuenta ya dice "hecha hoy": la celebración se sostiene con este estado local.
  const [celebrar, setCelebrar] = useState<number | null>(null);

  if (celebrar) return <Celebracion dia={celebrar} />;

  if (e.terminada) return <Aviso titulo="¡Terminaste tu ruta de 30 días!" texto="Tu negocio completo está en Mi Empresa, listo para vender." href="/app/empresa" cta="Ver mi negocio" />;
  if (e.hechaHoy)
    return (
      <Aviso
        titulo="Hoy ya armaste tu pieza"
        texto={`Mañana se abre el día ${dia.dia}: ${dia.pieza.toLowerCase()}. Un día a la vez es lo que hace que funcione.`}
        href="/app/empresa"
        cta="Ver Mi Empresa"
      />
    );
  if (dia.dia === 1)
    return <Aviso titulo="Tu misión 1 está en el recorrido de inicio" texto="Arma tu frase de negocio en 5 minutos y vuelve: se guarda aquí sola." href="/onboarding" cta="Armar mi frase" />;

  const guiada = misionGuiada(dia.dia);
  if (!guiada) return <MisionConIA />;
  return <MisionGuiadaFlujo key={dia.dia} onGuardada={setCelebrar} />;
}

/* ── Pantalla de aviso (sin misión disponible) ── */
function Aviso({ titulo, texto, href, cta }: { titulo: string; texto: string; href: string; cta: string }) {
  return (
    <main className="flex flex-1 flex-col px-4">
      <EncabezadoMision />
      <div className="tarjeta-relieve mt-8 rounded-[var(--radius-card)] p-6 text-center">
        <span aria-hidden="true" className="relieve-verde mx-auto flex size-16 items-center justify-center rounded-full">
          <Check size={30} strokeWidth={3} />
        </span>
        <h1 className="mt-4 font-display text-2xl font-extrabold text-ink-1">{titulo}</h1>
        <p className="mt-2 text-ayuda text-ink-2">{texto}</p>
        <Link href={href} className="boton-oro mt-6 flex h-14 items-center justify-center gap-2 rounded-[var(--radius-pill)] font-display text-boton font-bold">
          {cta}
          <ArrowRight size={20} aria-hidden="true" />
        </Link>
      </div>
    </main>
  );
}

function EncabezadoMision({ kicker, titulo }: { kicker?: string; titulo?: string }) {
  return (
    <header className="flex items-start gap-3 pt-4">
      <Link
        href="/app"
        aria-label="Volver a Hoy"
        className="tarjeta-relieve flex size-11 shrink-0 items-center justify-center rounded-full text-ink-2 transition-transform duration-150 active:scale-95"
      >
        <ArrowLeft size={20} aria-hidden="true" />
      </Link>
      {titulo && (
        <div className="min-w-0 pt-1">
          <p className="flex items-center gap-1 text-xs font-bold tracking-[0.08em] text-gold uppercase">
            <Zap size={12} fill="currentColor" strokeWidth={0} aria-hidden="true" />
            {kicker}
          </p>
          <h1 className="font-display text-2xl leading-tight font-extrabold text-ink-1">{titulo}</h1>
        </div>
      )}
    </header>
  );
}

/* Chips "Se arma con": las piezas anteriores que usa hoy (el Método hecho visible). */
function SeArmaCon({ usa, piezasHechas }: { usa: number[]; piezasHechas: Set<number> }) {
  const lista = usa.filter((d) => piezasHechas.has(d));
  if (!lista.length) return null;
  return (
    <div className="mt-4 flex flex-wrap items-center gap-2 text-xs font-semibold text-ink-3">
      <span>Se arma con:</span>
      {lista.map((d) => (
        <span key={d} className="inline-flex items-center gap-1 rounded-[var(--radius-pill)] bg-[color-mix(in_oklab,var(--green)_12%,transparent)] px-2 py-1 text-ink-1">
          <Check size={12} strokeWidth={3} className="text-green" aria-hidden="true" />
          {RUTA[d - 1].pieza}
        </span>
      ))}
    </div>
  );
}

/* ── Misión que arma la IA (día 5+): honesta mientras la IA no está conectada ── */
function MisionConIA() {
  const cuenta = useCuentaActiva();
  const dia = diaRuta(estadoRuta(cuenta).diaActual);
  const hechas = new Set(cuenta.piezas.map((p) => p.dia));
  return (
    <main className="flex flex-1 flex-col px-4">
      <EncabezadoMision kicker={`Día ${dia.dia} · 5 min`} titulo={dia.mision} />
      <SeArmaCon usa={dia.usa} piezasHechas={hechas} />
      <div className="hairline-oro relieve-tarjeta mt-6 rounded-[var(--radius-card)] p-4">
        <p className="flex items-center gap-2 text-sm font-semibold text-ink-1">
          <Sparkles size={18} className="text-gold" aria-hidden="true" />
          Esta pieza la arma la IA con todo lo que ya armaste
        </p>
        <p className="mt-2 text-ayuda leading-snug text-ink-2">
          Vista previa: la IA se conecta en la próxima etapa de construcción. Cuando esté lista, aquí respondes 1 o 2 preguntas y en
          segundos tienes {dia.pieza.toLowerCase()}.
        </p>
      </div>
      <Link href="/app" className="mt-6 flex h-14 items-center justify-center gap-2 rounded-[var(--radius-pill)] border border-[var(--line)] bg-raised-2 font-display text-boton font-bold text-ink-1">
        Volver a Hoy
      </Link>
    </main>
  );
}

/* ── Misión guiada (días 2-4) ── */
function MisionGuiadaFlujo({ onGuardada }: { onGuardada: (dia: number) => void }) {
  const cuenta = useCuentaActiva();
  const reduce = useReducedMotion();
  const idCampo = useId();
  const e = estadoRuta(cuenta);
  const dia = diaRuta(e.diaActual);
  const mision = misionGuiada(dia.dia)!;
  const ctx: ContextoMision = { area: cuenta.area ?? 'servicios', respuestas: cuenta.respuestas, piezas: cuenta.piezas };
  const hechas = new Set(cuenta.piezas.map((p) => p.dia));

  const [paso, setPaso] = useState(0);
  const [resp, setResp] = useState<Record<string, string[]>>({});
  const [escribiendo, setEscribiendo] = useState(false);
  const [propio, setPropio] = useState('');
  const [aviso, setAviso] = useState(0);
  const [fase, setFase] = useState<'preguntas' | 'armando' | 'resultado'>('preguntas');
  const [pieza, setPieza] = useState<PiezaCompuesta | null>(null);
  const temporizador = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(temporizador.current), []);

  const pregunta = mision.preguntas[paso];
  const elegidas = pregunta ? (resp[pregunta.id] ?? []) : [];
  const opciones = pregunta ? pregunta.opciones(ctx) : [];

  function armar(respuestas: Record<string, string[]>) {
    setFase('armando');
    temporizador.current = window.setTimeout(
      () => {
        setPieza(mision.componer(respuestas, ctx));
        setFase('resultado');
      },
      reduce ? 400 : 1600,
    );
  }

  function confirmar(valores: string[]) {
    const nuevas = { ...resp, [pregunta.id]: valores };
    setResp(nuevas);
    setEscribiendo(false);
    setPropio('');
    vibrar();
    temporizador.current = window.setTimeout(() => {
      if (paso + 1 < mision.preguntas.length) setPaso(paso + 1);
      else armar(nuevas);
    }, 300);
  }

  function elegir(op: string) {
    if (pregunta.multiple) {
      setResp({ ...resp, [pregunta.id]: elegidas.includes(op) ? elegidas.filter((o) => o !== op) : [...elegidas, op] });
      vibrar();
      return;
    }
    confirmar([op]);
  }

  function usarPropio() {
    const t = limpiarTexto(propio, LARGO_MAX);
    if (t.length < 3) {
      setAviso((n) => n + 1);
      vibrar(30);
      return;
    }
    if (pregunta.multiple) {
      setResp({ ...resp, [pregunta.id]: [...elegidas, t] });
      setEscribiendo(false);
      setPropio('');
      return;
    }
    confirmar([t]);
  }

  function guardar() {
    if (!pieza) return;
    guardarPieza(cuenta, { dia: dia.dia, titulo: dia.pieza, contenido: pieza.contenido, detalle: pieza.detalle, base: true });
    vibrar(40);
    onGuardada(dia.dia);
  }

  return (
    <main className="flex flex-1 flex-col">
      <div className="px-4">
        <EncabezadoMision kicker={`Día ${dia.dia} · 5 min`} titulo={dia.mision} />
        <SeArmaCon usa={dia.usa} piezasHechas={hechas} />

        {/* Lo ya respondido: se toca para cambiarlo */}
        {fase === 'preguntas' && paso > 0 && (
          <ul className="mt-4 flex flex-wrap gap-2" aria-label="Tus respuestas">
            {mision.preguntas.slice(0, paso).map((q, i) => (
              <li key={q.id}>
                <button
                  type="button"
                  onClick={() => setPaso(i)}
                  className="inline-flex min-h-11 items-center gap-1 rounded-[var(--radius-pill)] border border-[var(--line)] bg-raised px-3 text-xs font-semibold text-ink-1"
                >
                  <PencilLine size={12} className="text-ink-3" aria-hidden="true" />
                  {(resp[q.id] ?? []).join(', ')}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <AnimatePresence mode="wait" initial={false}>
        {fase === 'preguntas' && pregunta && (
          <motion.section
            key={pregunta.id}
            initial={{ opacity: 0, x: reduce ? 0 : 32 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: reduce ? 0 : -20 }}
            transition={{ duration: 0.25, ease: EASE_SALIDA }}
            className="mt-6 px-4"
            aria-label={pregunta.pregunta}
          >
            <p className="text-xs font-semibold text-ink-3 tabular-nums">
              Paso {paso + 1} de {mision.preguntas.length}
            </p>
            <h2 className="mt-1 font-display text-xl font-bold text-ink-1">{pregunta.pregunta}</h2>
            <p className="mt-1 flex items-center gap-2 text-caption text-ink-2">
              <Lightbulb size={16} className="shrink-0 text-ink-3" aria-hidden="true" />
              {pregunta.consejo}
            </p>
            <div className="mt-4 flex flex-col gap-2" role={pregunta.multiple ? 'group' : 'radiogroup'} aria-label={pregunta.pregunta}>
              {[...opciones, ...elegidas.filter((o) => !opciones.includes(o))].map((op, i) => {
                const marcada = elegidas.includes(op);
                return (
                  <motion.button
                    key={op}
                    type="button"
                    role={pregunta.multiple ? 'checkbox' : 'radio'}
                    aria-checked={marcada}
                    onClick={() => elegir(op)}
                    initial={{ opacity: 0, y: reduce ? 0 : 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, delay: reduce ? 0 : 0.04 + i * 0.045, ease: EASE_SALIDA }}
                    whileTap={{ scale: 0.98 }}
                    className="opcion-recorrido flex min-h-12 items-center gap-3 py-3 pr-4 pl-5 text-left text-ayuda font-medium text-ink-1"
                  >
                    <span className="flex-1">{op}</span>
                    {marcada && (
                      <span aria-hidden="true" className="flex size-6 items-center justify-center rounded-full bg-[color-mix(in_oklab,var(--gold)_16%,transparent)] text-gold">
                        <Check size={14} strokeWidth={3} />
                      </span>
                    )}
                  </motion.button>
                );
              })}

              {escribiendo ? (
                <div className="flex flex-col gap-2">
                  <label htmlFor={idCampo} className="text-sm font-semibold text-ink-1">
                    Escríbela con tus palabras
                  </label>
                  <input
                    key={aviso}
                    id={idCampo}
                    autoFocus
                    value={propio}
                    maxLength={LARGO_MAX}
                    onChange={(ev) => setPropio(ev.target.value)}
                    onKeyDown={(ev) => ev.key === 'Enter' && usarPropio()}
                    className={`h-12 w-full rounded-[var(--radius-chip)] border bg-sunken px-4 text-base text-ink-1 focus:outline-none ${
                      aviso && limpiarTexto(propio, LARGO_MAX).length < 3 ? 'sacudir border-warning' : 'border-gold'
                    }`}
                  />
                  {aviso > 0 && limpiarTexto(propio, LARGO_MAX).length < 3 && <p className="text-caption text-warning">Escribe al menos unas letras.</p>}
                  <button type="button" onClick={usarPropio} className="boton-oro flex h-12 items-center justify-center rounded-[var(--radius-pill)] font-display text-base font-bold">
                    Usar esta
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEscribiendo(false);
                      setPropio('');
                    }}
                    className="flex min-h-11 items-center justify-center text-sm font-semibold text-ink-2"
                  >
                    Cancelar
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setEscribiendo(true)}
                  className="opcion-recorrido flex min-h-12 items-center gap-2 py-3 pr-4 pl-5 text-left text-ayuda font-medium text-ink-2"
                >
                  <PencilLine size={16} aria-hidden="true" />
                  Otra cosa (escribe la tuya)
                </button>
              )}
            </div>

            {pregunta.multiple && !escribiendo && (
              <button
                type="button"
                onClick={() => (elegidas.length ? confirmar(elegidas) : (setAviso((n) => n + 1), vibrar(30)))}
                className="boton-oro mt-6 flex h-14 w-full items-center justify-center gap-2 rounded-[var(--radius-pill)] font-display text-boton font-bold"
              >
                Continuar
                <ArrowRight size={20} aria-hidden="true" />
              </button>
            )}
            {pregunta.multiple && aviso > 0 && !elegidas.length && <p className="mt-2 text-center text-caption text-warning">Elige al menos una.</p>}
          </motion.section>
        )}

        {fase === 'armando' && (
          <motion.section key="armando" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-8 px-4" aria-live="polite" aria-busy="true">
            <p className="flex items-center gap-2 font-display text-lg font-bold text-ink-1">
              <Sparkles size={20} className="text-gold" aria-hidden="true" />
              Armando {dia.pieza.toLowerCase()}…
            </p>
            <div className="hairline-oro relieve-tarjeta mt-4 flex flex-col gap-2 rounded-[var(--radius-card)] p-4">
              {['w-full', 'w-11/12', 'w-4/5', 'w-2/3'].map((a) => (
                <span key={a} className={`h-3 rounded-full bg-[color-mix(in_oklab,var(--ink-1)_10%,transparent)] motion-safe:animate-pulse ${a}`} />
              ))}
            </div>
          </motion.section>
        )}

        {fase === 'resultado' && pieza && (
          <motion.section key="resultado" initial={{ opacity: 0, y: reduce ? 0 : 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, ease: EASE_SALIDA }} className="mt-6 px-4">
            <article className="hairline-oro relieve-tarjeta rounded-[var(--radius-card)] p-4">
              <p className="text-xs font-bold tracking-[0.08em] text-gold uppercase">Pieza {dia.dia} · {dia.pieza}</p>
              <p className="mt-2 font-display text-lg leading-snug font-bold text-pretty break-words text-ink-1">«{pieza.contenido}»</p>
              {pieza.detalle?.map((d) => (
                <p key={d.rotulo} className="mt-4 border-t border-[var(--line)] pt-4 text-ayuda leading-snug text-ink-2">
                  <strong className="font-semibold text-ink-1">{d.rotulo}:</strong> {d.valor}
                </p>
              ))}
            </article>
            <button type="button" onClick={guardar} className="boton-oro mt-6 flex h-14 w-full items-center justify-center gap-2 rounded-[var(--radius-pill)] font-display text-boton font-bold">
              Guardar en Mi Empresa
              <ArrowRight size={20} aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => {
                setFase('preguntas');
                setPaso(0);
              }}
              className="mt-2 flex min-h-11 w-full items-center justify-center gap-2 text-sm font-semibold text-ink-2"
            >
              <RotateCcw size={16} aria-hidden="true" />
              Cambiar mis respuestas
            </button>
            {RUTA[dia.dia] && (
              <p className="mt-4 flex items-start gap-2 text-caption text-ink-2">
                <Sparkles size={16} className="mt-0.5 shrink-0 text-ink-3" aria-hidden="true" />
                Mañana, el día {dia.dia + 1} ({RUTA[dia.dia].pieza.toLowerCase()}) usa esta pieza.
              </p>
            )}
          </motion.section>
        )}
      </AnimatePresence>
    </main>
  );
}

/* ── Celebración al guardar (hito real; nivel 2 de FICHA-ARTE; cierre de semana más grande) ── */
function Celebracion({ dia }: { dia: number }) {
  const cuenta = useCuentaActiva();
  const reduce = useReducedMotion();
  const e = estadoRuta(cuenta);
  const d = diaRuta(dia);
  const siguiente = dia < RUTA.length ? diaRuta(dia + 1) : undefined;
  return (
    <main className="flex flex-1 flex-col items-center px-4 pt-16 text-center" aria-live="polite">
      <span className="relative flex size-24 items-center justify-center" aria-hidden="true">
        {!reduce &&
          CHISPAS.map((g) => (
            <motion.span
              key={g}
              className="absolute size-2 rounded-full bg-gold"
              initial={{ x: 0, y: 0, opacity: 0 }}
              animate={{ x: Math.cos((g * Math.PI) / 180) * 64, y: Math.sin((g * Math.PI) / 180) * 64, opacity: [0, 1, 0] }}
              transition={{ duration: 0.8, delay: 0.2, ease: EASE_SALIDA }}
            />
          ))}
        <motion.span
          initial={{ scale: reduce ? 1 : 0.4 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', bounce: 0.25, duration: 0.6 }}
          className="relieve-verde flex size-24 items-center justify-center rounded-full"
        >
          <Check size={48} strokeWidth={3} />
        </motion.span>
      </span>
      <p className="mt-6 text-xs font-bold tracking-[0.08em] text-green uppercase">{d.cierre ? `¡Semana ${d.semana} completa!` : `Día ${dia} listo`}</p>
      <h1 className="mt-1 font-display text-pregunta font-extrabold text-ink-1">¡Pieza {dia} guardada!</h1>
      <p className="mt-1 text-ayuda text-ink-2">{d.pieza} ya está en Mi Empresa.</p>
      <p className="mt-2 flex items-center justify-center gap-2 text-ayuda text-ink-2">
        <Flame size={18} className="text-gold" fill="currentColor" aria-hidden="true" />
        Racha de {e.racha} {e.racha === 1 ? 'día' : 'días'} · {e.piezasListas} de {RUTA.length} piezas
      </p>
      <SemanaEnNodos dia={dia} />
      {siguiente && <p className="mt-4 text-sm text-ink-3">Mañana · Día {siguiente.dia}: {siguiente.pieza.toLowerCase()}</p>}
      <div className="mt-8 flex w-full flex-col gap-2">
        <Link href={`/app/empresa?pieza=${dia}`} className="boton-oro flex h-14 items-center justify-center gap-2 rounded-[var(--radius-pill)] font-display text-boton font-bold">
          Ver en Mi Empresa
          <ArrowRight size={20} aria-hidden="true" />
        </Link>
        <Link href="/app" className="flex min-h-11 items-center justify-center text-sm font-semibold text-ink-2">
          Volver a Hoy
        </Link>
      </div>
    </main>
  );
}

/* La semana en nodos: se ve cuánto falta para cerrarla (el progreso hecho visible, en verde). */
function SemanaEnNodos({ dia }: { dia: number }) {
  const cuenta = useCuentaActiva();
  const reduce = useReducedMotion();
  const semana = diaRuta(dia).semana;
  const dias = RUTA.filter((d) => d.semana === semana);
  const hechas = new Set(cuenta.piezas.map((p) => p.dia));
  return (
    <div className="tarjeta-relieve mt-8 w-full rounded-[var(--radius-card)] p-4 text-left">
      <p className="text-xs font-bold tracking-[0.08em] text-ink-3 uppercase">
        Semana {semana} · {dias.filter((d) => hechas.has(d.dia)).length} de {dias.length}
      </p>
      <ol className="relative mt-4 flex items-center justify-between">
        <span aria-hidden="true" className="absolute top-1/2 right-4 left-4 h-0.5 -translate-y-1/2 bg-[color-mix(in_oklab,var(--ink-1)_12%,transparent)]" />
        {dias.map((d, i) => {
          const lista = hechas.has(d.dia);
          return (
            <motion.li
              key={d.dia}
              initial={{ scale: reduce ? 1 : d.dia === dia ? 0.4 : 1 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', bounce: 0.25, duration: 0.5, delay: reduce ? 0 : 0.4 + i * 0.04 }}
              className={`relative flex size-9 items-center justify-center rounded-full ${lista ? 'relieve-verde' : 'border border-[var(--line)] bg-sunken text-ink-3'}`}
              aria-label={`Día ${d.dia}${lista ? ', listo' : ''}`}
            >
              {lista ? <Check size={16} strokeWidth={3} aria-hidden="true" /> : <span className="text-xs font-bold">{d.dia}</span>}
            </motion.li>
          );
        })}
      </ol>
    </div>
  );
}
