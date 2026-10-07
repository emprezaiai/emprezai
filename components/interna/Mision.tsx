'use client';

// LA MISIÓN DEL DÍA — 5 minutos, una pieza (modo foco, sin barra inferior). Misiones guiadas
// (días 2-4): preguntas con opciones del área + "Otra cosa"; la pieza se arma con tus respuestas y
// tus piezas anteriores (Método Pieza a Pieza) y se guarda en Mi Empresa con celebración (56 §M1:
// la pieza es la protagonista y "vuela" a Mi Empresa). Del día 5 en adelante la arma la IA
// (Sesión 6): la pantalla lo dice con palabras de la usuaria y ofrece algo útil mientras tanto.

import { useEffect, useId, useRef, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, animate, motion, useReducedMotion } from 'motion/react';
import { ArrowLeft, ArrowRight, Check, Flame, Lightbulb, PencilLine, RotateCcw, Sparkles, Zap } from 'lucide-react';
import { estadoRuta, guardarPieza, type PiezaGuardada } from '@/lib/cuenta';
import { misionGuiada, type ContextoMision, type PiezaCompuesta } from '@/lib/misiones';
import { RUTA, diaRuta } from '@/lib/ruta';
import { limpiarTexto } from '@/lib/onboarding';
import { BotonPrincipal, EASE_SALIDA, TituloAcento, vibrar } from '@/components/onboarding/piezas';
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

  if (!misionGuiada(dia.dia)) return <MisionConIA />;
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

function EncabezadoMision({ kicker, titulo, compacto = false }: { kicker?: string; titulo?: string; compacto?: boolean }) {
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
          <p className={`font-display leading-tight font-extrabold text-ink-1 ${compacto ? 'text-base' : 'text-2xl'}`}>{titulo}</p>
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

/* ── Misión que arma la IA (día 5+): honesta y con algo útil que hacer hoy ── */
function MisionConIA() {
  const cuenta = useCuentaActiva();
  const dia = diaRuta(estadoRuta(cuenta).diaActual);
  const hechas = new Set(cuenta.piezas.map((p) => p.dia));
  const usadas = dia.usa.map((d) => cuenta.piezas.find((p) => p.dia === d)).filter((p): p is PiezaGuardada => Boolean(p));
  return (
    <main className="flex flex-1 flex-col">
      <div className="px-4">
        <EncabezadoMision kicker={`Día ${dia.dia} · 5 min`} titulo={dia.mision} />
        <SeArmaCon usa={dia.usa} piezasHechas={hechas} />
        <div className="hairline-oro relieve-tarjeta mt-6 rounded-[var(--radius-card)] p-4">
          <p className="flex items-start gap-2 font-display text-lg leading-snug font-bold text-ink-1">
            <Sparkles size={20} className="mt-0.5 shrink-0 text-gold" aria-hidden="true" />
            Esta pieza la arma la IA con todo lo que ya armaste
          </p>
          <p className="mt-2 text-ayuda leading-snug text-ink-2">
            Estamos activando la IA de esta misión. Muy pronto respondes 1 o 2 preguntas y en segundos tienes {dia.pieza.toLowerCase()}. Te avisamos
            apenas esté lista.
          </p>
        </div>
        {usadas.length > 0 && (
          <section className="mt-6" aria-labelledby="titulo-repaso">
            <h2 id="titulo-repaso" className="font-display text-base font-bold text-ink-1">
              Mientras tanto, repasa lo que la IA va a usar
            </h2>
            <ul className="mt-3 flex flex-col gap-2">
              {usadas.map((p) => (
                <li key={p.dia}>
                  <Link
                    href={`/app/empresa?pieza=${p.dia}`}
                    className="fila-pildora flex min-h-14 items-center gap-3 py-2 pr-3 pl-5 transition-transform duration-150 active:scale-[0.99]"
                  >
                    <span className="min-w-0 flex-1">
                      <span className="block text-xs font-semibold text-ink-3">
                        Día {p.dia} · {p.titulo}
                      </span>
                      <span className="block truncate text-sm font-semibold text-ink-1">{p.resumen ?? p.contenido}</span>
                    </span>
                    <ArrowRight size={18} className="shrink-0 text-ink-3" aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
      <div className="barra-inferior sticky bottom-0 z-10 mt-auto px-4 pt-6">
        <Link href="/app/empresa" className="boton-oro flex h-14 w-full items-center justify-center gap-2 rounded-[var(--radius-pill)] font-display text-boton font-bold">
          Repasar mis piezas
          <ArrowRight size={20} aria-hidden="true" />
        </Link>
      </div>
    </main>
  );
}

/* ── Misión guiada (días 2-4) ── */
function claveBorrador(dia: number) {
  return `empresai_mision_${dia}`;
}

function MisionGuiadaFlujo({ onGuardada }: { onGuardada: (dia: number) => void }) {
  const cuenta = useCuentaActiva();
  const reduce = useReducedMotion();
  const idCampo = useId();
  const e = estadoRuta(cuenta);
  const dia = diaRuta(e.diaActual);
  const mision = misionGuiada(dia.dia)!;
  const ctx: ContextoMision = { area: cuenta.area ?? 'servicios', respuestas: cuenta.respuestas, piezas: cuenta.piezas };
  const hechas = new Set(cuenta.piezas.map((p) => p.dia));

  // Si sale a mitad de la misión, sus respuestas lo esperan al volver (no se pierden sin aviso).
  const [borrador] = useState<{ paso: number; resp: Record<string, string[]> }>(() => {
    try {
      return JSON.parse(sessionStorage.getItem(claveBorrador(dia.dia)) ?? '') as { paso: number; resp: Record<string, string[]> };
    } catch {
      return { paso: 0, resp: {} };
    }
  });
  const [paso, setPaso] = useState(Math.min(borrador.paso ?? 0, mision.preguntas.length - 1));
  const [resp, setResp] = useState<Record<string, string[]>>(borrador.resp ?? {});
  const [escribiendo, setEscribiendo] = useState(false);
  const [propio, setPropio] = useState('');
  const [aviso, setAviso] = useState(0);
  const [avisoMultiple, setAvisoMultiple] = useState(false);
  const [bloqueado, setBloqueado] = useState(false);
  const [fase, setFase] = useState<'preguntas' | 'armando' | 'resultado'>('preguntas');
  const [pieza, setPieza] = useState<PiezaCompuesta | null>(null);
  const temporizador = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(temporizador.current), []);
  useEffect(() => {
    try {
      sessionStorage.setItem(claveBorrador(dia.dia), JSON.stringify({ paso, resp }));
    } catch {
      // Sin almacenamiento: el borrador vive solo en pantalla.
    }
  }, [paso, resp, dia.dia]);

  const pregunta = mision.preguntas[paso];
  const elegidas = resp[pregunta.id] ?? [];
  const opciones = pregunta.opciones(ctx);

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
    if (bloqueado) return;
    const nuevas = { ...resp, [pregunta.id]: valores };
    setResp(nuevas);
    setEscribiendo(false);
    setPropio('');
    setBloqueado(true);
    vibrar();
    temporizador.current = window.setTimeout(() => {
      setBloqueado(false);
      if (paso + 1 < mision.preguntas.length) setPaso(paso + 1);
      else armar(nuevas);
    }, 300);
  }

  function elegir(op: string) {
    if (pregunta.multiple) {
      setResp({ ...resp, [pregunta.id]: elegidas.includes(op) ? elegidas.filter((o) => o !== op) : [...elegidas, op] });
      setAvisoMultiple(false);
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
    guardarPieza(cuenta, { dia: dia.dia, titulo: dia.pieza, contenido: pieza.contenido, resumen: pieza.resumen, detalle: pieza.detalle, base: true });
    try {
      sessionStorage.removeItem(claveBorrador(dia.dia));
    } catch {
      // Nada que limpiar.
    }
    vibrar(40);
    onGuardada(dia.dia);
  }

  const todas = [...opciones, ...elegidas.filter((o) => !opciones.includes(o))];

  return (
    <main className="flex flex-1 flex-col">
      <div className="px-4">
        <EncabezadoMision kicker={`Día ${dia.dia} · 5 min`} titulo={dia.mision} compacto={fase === 'preguntas'} />
        {fase !== 'preguntas' && <SeArmaCon usa={dia.usa} piezasHechas={hechas} />}

        {/* Lo ya respondido: se toca para cambiarlo */}
        {fase === 'preguntas' && paso > 0 && (
          <ul className="mt-4 flex flex-wrap gap-2" aria-label="Tus respuestas">
            {mision.preguntas.slice(0, paso).map((q, i) => (
              <li key={q.id} className="max-w-full">
                <button
                  type="button"
                  onClick={() => setPaso(i)}
                  aria-label={`Cambiar: ${q.pregunta} ${(resp[q.id] ?? []).join(', ')}`}
                  className="inline-flex min-h-11 max-w-full items-center gap-1 rounded-[var(--radius-pill)] bg-raised-2 px-3 text-xs font-semibold text-ink-1"
                >
                  <PencilLine size={12} className="shrink-0 text-ink-3" aria-hidden="true" />
                  <span className="truncate">{(resp[q.id] ?? []).join(', ')}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <AnimatePresence mode="wait" initial={false}>
        {fase === 'preguntas' && (
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
            <TituloAcento texto={pregunta.pregunta} acento={pregunta.acento} as="h1" className="mt-1 text-pregunta" />
            <p className="mt-2 flex items-start gap-2 text-caption text-ink-2">
              <Lightbulb size={16} className="mt-0.5 shrink-0 text-ink-3" aria-hidden="true" />
              {pregunta.consejo}
            </p>

            <div
              className={`mt-4 gap-2 ${pregunta.multiple ? 'grid grid-cols-2' : 'flex flex-col'}`}
              role={pregunta.multiple ? 'group' : 'radiogroup'}
              aria-label={pregunta.pregunta}
            >
              {todas.map((op, i) => {
                const marcada = elegidas.includes(op);
                return (
                  <motion.button
                    key={op}
                    type="button"
                    role={pregunta.multiple ? 'checkbox' : 'radio'}
                    aria-checked={marcada}
                    disabled={bloqueado && !marcada}
                    onClick={() => elegir(op)}
                    initial={{ opacity: 0, y: reduce ? 0 : 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, delay: reduce ? 0 : 0.04 + i * 0.045, ease: EASE_SALIDA }}
                    whileTap={{ scale: 0.98 }}
                    className={`opcion-recorrido flex min-h-12 items-center gap-3 py-3 text-left text-ayuda font-medium text-ink-1 disabled:opacity-100 ${
                      pregunta.multiple ? 'pr-3 pl-4' : 'pr-4 pl-5'
                    }`}
                  >
                    <span className="min-w-0 flex-1">{op}</span>
                    {pregunta.multiple ? (
                      <span
                        aria-hidden="true"
                        className={`flex size-6 shrink-0 items-center justify-center rounded-full border-2 ${marcada ? 'border-gold bg-gold text-on-gold' : 'border-ink-3'}`}
                      >
                        {marcada && <Check size={14} strokeWidth={3.5} />}
                      </span>
                    ) : (
                      marcada && (
                        <span aria-hidden="true" className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[color-mix(in_oklab,var(--gold)_16%,transparent)] text-gold">
                          <Check size={14} strokeWidth={3} />
                        </span>
                      )
                    )}
                  </motion.button>
                );
              })}
            </div>

            <div className="mt-2">
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
                    onKeyDown={(ev) => {
                      if (ev.key === 'Enter') usarPropio();
                      if (ev.key === 'Escape') {
                        setEscribiendo(false);
                        setPropio('');
                      }
                    }}
                    className={`h-12 w-full rounded-[var(--radius-pill)] border bg-sunken px-5 text-base text-ink-1 focus:outline-none ${
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
                  className="opcion-recorrido flex min-h-12 w-full items-center gap-2 py-3 pr-4 pl-5 text-left text-ayuda font-medium text-ink-2"
                >
                  <PencilLine size={16} aria-hidden="true" />
                  Otra cosa (escribe la tuya)
                </button>
              )}
            </div>
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
              <p className="text-xs font-bold tracking-[0.08em] text-gold uppercase">
                Pieza {dia.dia} · {dia.pieza}
              </p>
              <p className="mt-2 text-lg leading-snug font-semibold text-pretty break-words text-ink-1">{pieza.contenido}</p>
              {pieza.detalle?.map((d) => (
                <p key={d.rotulo} className="mt-4 border-t border-[var(--line)] pt-4 text-ayuda leading-snug text-ink-2">
                  <strong className="font-semibold text-ink-1">{d.rotulo}:</strong> {d.valor}
                </p>
              ))}
            </article>
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
              <p className="mt-2 flex items-start gap-2 text-caption text-ink-2">
                <Sparkles size={16} className="mt-0.5 shrink-0 text-ink-3" aria-hidden="true" />
                Mañana, el día {dia.dia + 1} ({RUTA[dia.dia].pieza.toLowerCase()}) usa esta pieza.
              </p>
            )}
          </motion.section>
        )}
      </AnimatePresence>

      {/* El botón principal, fijo abajo como en el recorrido de inicio */}
      {fase === 'preguntas' && pregunta.multiple && !escribiendo && (
        <BotonPrincipal
          onClick={() => {
            if (elegidas.length) confirmar(elegidas);
            else {
              setAvisoMultiple(true);
              vibrar(30);
            }
          }}
          nota={avisoMultiple ? <span className="text-warning">Elige al menos una.</span> : `${elegidas.length} elegida${elegidas.length === 1 ? '' : 's'}`}
        >
          Continuar
          <ArrowRight size={20} aria-hidden="true" />
        </BotonPrincipal>
      )}
      {fase === 'resultado' && (
        <BotonPrincipal onClick={guardar} nota="Se guarda como tu pieza de hoy">
          Guardar en Mi Empresa
          <ArrowRight size={20} aria-hidden="true" />
        </BotonPrincipal>
      )}
    </main>
  );
}

/* Número que cuenta de 0 a su valor (baseline 2 de 22). */
function Cuenta({ valor }: { valor: number }) {
  const reduce = useReducedMotion();
  const nodo = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (!nodo.current || reduce) return;
    const control = animate(0, valor, {
      duration: 0.6,
      delay: 0.5,
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

/* ── Celebración al guardar: la pieza es la protagonista y vuela a Mi Empresa (firma de FICHA-ARTE) ── */
function Celebracion({ dia }: { dia: number }) {
  const cuenta = useCuentaActiva();
  const reduce = useReducedMotion();
  const e = estadoRuta(cuenta);
  const d = diaRuta(dia);
  const pieza = cuenta.piezas.find((p) => p.dia === dia);
  const siguiente = dia < RUTA.length ? diaRuta(dia + 1) : undefined;
  return (
    <main className="flex flex-1 flex-col items-center px-4 pt-10 text-center" aria-live="polite">
      <p className="text-xs font-bold tracking-[0.08em] text-green uppercase">{d.cierre ? `¡Semana ${d.semana} completa!` : `Día ${dia} listo`}</p>
      <h1 className="mt-1 font-display text-pregunta font-extrabold text-ink-1">¡Pieza {dia} guardada!</h1>

      {/* La pieza: aparece con resorte, el tick "En Mi Empresa" se enciende en verde */}
      <div className="relative mt-6 w-full">
        {!reduce &&
          CHISPAS.map((g) => (
            <motion.span
              key={g}
              aria-hidden="true"
              className="absolute top-1/2 left-1/2 size-2 rounded-full bg-gold"
              initial={{ x: 0, y: 0, opacity: 0 }}
              animate={{ x: Math.cos((g * Math.PI) / 180) * 150, y: Math.sin((g * Math.PI) / 180) * 70, opacity: [0, 1, 0] }}
              transition={{ duration: 0.8, delay: 0.25, ease: EASE_SALIDA }}
            />
          ))}
        <motion.article
          initial={{ opacity: 0, scale: reduce ? 1 : 0.85, y: reduce ? 0 : 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: 'spring', bounce: 0.25, duration: 0.6 }}
          className="hairline-oro relieve-tarjeta relative rounded-[var(--radius-card)] p-4 text-left"
        >
          <p className="flex items-center justify-between gap-2 text-xs font-bold tracking-[0.08em] uppercase">
            <span className="text-gold">{d.pieza}</span>
            <motion.span
              initial={{ scale: reduce ? 1 : 0 }}
              animate={{ scale: 1 }}
              transition={reduce ? { duration: 0 } : { type: 'spring', bounce: 0.25, duration: 0.5, delay: 0.9 }}
              className="flex shrink-0 items-center gap-1 text-green"
            >
              <Check size={14} strokeWidth={3} aria-hidden="true" />
              En Mi Empresa
            </motion.span>
          </p>
          <p className="mt-2 line-clamp-3 text-base leading-snug font-semibold text-ink-1">{pieza?.resumen ?? pieza?.contenido}</p>
        </motion.article>
      </div>

      <p className="mt-6 flex flex-wrap items-center justify-center gap-x-2 text-ayuda text-ink-2">
        <Flame size={18} className="text-gold" fill="currentColor" aria-hidden="true" />
        <span>
          Racha de{' '}
          <strong className="font-display text-lg text-ink-1">
            <Cuenta valor={e.racha} />
          </strong>{' '}
          {e.racha === 1 ? 'día' : 'días'}
        </span>
        <span aria-hidden="true">·</span>
        <span>
          <strong className="font-display text-lg text-ink-1">
            <Cuenta valor={e.piezasListas} />
          </strong>{' '}
          de {RUTA.length} piezas
        </span>
      </p>
      <SemanaEnNodos dia={dia} />
      {siguiente && (
        <p className="mt-4 text-sm text-ink-3">
          Mañana · Día {siguiente.dia}: {siguiente.pieza.toLowerCase()}
        </p>
      )}
      <div className="mt-6 flex w-full flex-col gap-2 pb-4">
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

/* La semana en nodos: se ve cuánto falta para cerrarla (el tramo recorrido, en verde). */
function SemanaEnNodos({ dia }: { dia: number }) {
  const cuenta = useCuentaActiva();
  const reduce = useReducedMotion();
  const semana = diaRuta(dia).semana;
  const dias = RUTA.filter((d) => d.semana === semana);
  const hechas = new Set(cuenta.piezas.map((p) => p.dia));
  const listas = dias.filter((d) => hechas.has(d.dia)).length;
  return (
    <div className="tarjeta-relieve mt-6 w-full rounded-[var(--radius-card)] p-4 text-left">
      <p className="text-xs font-bold tracking-[0.08em] text-ink-3 uppercase">
        Semana {semana} · {listas} de {dias.length}
      </p>
      <ol className="relative mt-4 flex items-center justify-between">
        <span aria-hidden="true" className="absolute top-1/2 right-4 left-4 h-0.5 -translate-y-1/2 bg-[color-mix(in_oklab,var(--ink-1)_12%,transparent)]" />
        <motion.span
          aria-hidden="true"
          className="absolute top-1/2 left-4 h-0.5 origin-left -translate-y-1/2 bg-green"
          style={{ width: `calc((100% - 2rem) * ${Math.max(listas - 1, 0) / (dias.length - 1)})` }}
          initial={{ scaleX: reduce ? 1 : 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: reduce ? 0 : 0.6, delay: reduce ? 0 : 0.5, ease: EASE_SALIDA }}
        />
        {dias.map((d, i) => {
          const lista = hechas.has(d.dia);
          return (
            <motion.li
              key={d.dia}
              initial={{ scale: reduce ? 1 : d.dia === dia ? 0.4 : 1 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', bounce: 0.25, duration: 0.5, delay: reduce ? 0 : 0.4 + i * 0.04 }}
              className={`relative flex size-9 items-center justify-center rounded-full ${lista ? 'relieve-verde' : 'relieve-piedra opacity-60'}`}
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
