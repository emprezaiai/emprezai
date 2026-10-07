'use client';

// LA MISIÓN DEL DÍA — 5 minutos, una pieza (modo foco, sin barra inferior).
// · Días 2-4: misiones guiadas con opciones del área + "Otra cosa"; la pieza se compone sola.
// · Días 5-30: borrador guiado (pregunta + consejo + plantilla para rellenar), así la ruta nunca se
//   frena mientras se conecta la IA (Sesión 6); se guarda como "versión base" que la IA afinará.
// · Cierres de semana (7, 14, 21, 30): juntan las piezas de la semana en una sola, sin preguntas.
// Al guardar: celebración con la pieza como protagonista que "vuela" a Mi Empresa (firma de FICHA-ARTE).

import { Fragment, useEffect, useId, useRef, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { AnimatePresence, animate, motion, useReducedMotion } from 'motion/react';
import { ArrowLeft, ArrowRight, Check, Flame, Lightbulb, PencilLine, RotateCcw, Sparkles, WandSparkles, Zap } from 'lucide-react';
import { estadoRuta, guardarPieza, type Cuenta, type PiezaGuardada } from '@/lib/cuenta';
import { guiaBorrador, misionGuiada, type ContextoMision, type PiezaCompuesta } from '@/lib/misiones';
import { RUTA, diaRuta, type DiaRuta } from '@/lib/ruta';
import { limpiarTexto } from '@/lib/onboarding';
import { BotonPrincipal, EASE_SALIDA, TituloAcento, vibrar } from '@/components/onboarding/piezas';
import { useCuentaActiva } from './Marco';

const LARGO_MAX = 80;
const LARGO_MAX_BORRADOR = 600;
const CHISPAS = [0, 60, 120, 180, 240, 300];

const resumenCorto = (t: string) => {
  const limpio = t.replace(/\s+/g, ' ').trim();
  if (limpio.length <= 60) return limpio;
  const corte = limpio.slice(0, 58);
  return `${corte.slice(0, corte.lastIndexOf(' '))}…`;
};

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

  if (misionGuiada(dia.dia)) return <MisionGuiadaFlujo key={dia.dia} onGuardada={setCelebrar} />;
  if (dia.cierre) return <CierreSemana key={dia.dia} onGuardada={setCelebrar} />;
  return <MisionBorrador key={dia.dia} onGuardada={setCelebrar} />;
}

/* ── Piezas comunes ── */

function Pantalla({ children, accion, encabezado, centrado = false }: { children: ReactNode; accion?: ReactNode; encabezado?: ReactNode; centrado?: boolean }) {
  return (
    <main className="flex min-h-dvh flex-1 flex-col">
      {encabezado && <div className="px-4">{encabezado}</div>}
      <div className={`px-4 ${centrado ? 'flex flex-1 flex-col justify-center py-8' : ''}`}>{children}</div>
      {accion}
    </main>
  );
}

function BarraAccion({ href, children }: { href: string; children: ReactNode }) {
  return (
    <div className="barra-inferior sticky bottom-0 z-10 mt-auto px-4 pt-6">
      <Link href={href} className="boton-oro flex h-14 w-full items-center justify-center gap-2 rounded-[var(--radius-pill)] font-display text-boton font-bold">
        {children}
        <ArrowRight size={20} aria-hidden="true" />
      </Link>
    </div>
  );
}

/* Pantalla de aviso (sin misión disponible): contenido arriba, la acción fija abajo. */
function Aviso({ titulo, texto, href, cta }: { titulo: string; texto: string; href: string; cta: string }) {
  const cuenta = useCuentaActiva();
  return (
    <Pantalla accion={<BarraAccion href={href}>{cta}</BarraAccion>} encabezado={<EncabezadoMision />} centrado>
      <div className="tarjeta-relieve rounded-[var(--radius-card)] p-6 text-center">
        <span aria-hidden="true" className="relieve-verde mx-auto flex size-16 items-center justify-center rounded-full">
          <Check size={30} strokeWidth={3} />
        </span>
        <h1 className="mt-4 font-display text-2xl font-extrabold text-ink-1">{titulo}</h1>
        <p className="mt-2 text-ayuda text-ink-2">{texto}</p>
      </div>
      <SemanaEnNodos dia={Math.max(cuenta.piezas.length, 1)} />
    </Pantalla>
  );
}

function EncabezadoMision({ dia }: { dia?: DiaRuta }) {
  return (
    <header className="flex items-start gap-3 pt-4">
      <Link
        href="/app"
        aria-label="Volver a Hoy"
        className="tarjeta-relieve flex size-11 shrink-0 items-center justify-center rounded-full text-ink-2 transition-transform duration-150 active:scale-95"
      >
        <ArrowLeft size={20} aria-hidden="true" />
      </Link>
      {dia && (
        <div className="min-w-0 pt-1">
          <p className="flex items-center gap-1 text-xs font-bold tracking-[0.08em] text-gold uppercase">
            <Zap size={12} fill="currentColor" strokeWidth={0} aria-hidden="true" />
            Día {dia.dia} · 5 min
          </p>
          <p className="font-display text-base leading-tight font-extrabold text-ink-1">{dia.mision}</p>
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
          {RUTA[d - 1].corto}
        </span>
      ))}
    </div>
  );
}

function ErrorGuardado({ visible }: { visible: boolean }) {
  return (
    <p role="alert" className={visible ? 'mx-4 mt-4 rounded-[var(--radius-chip)] bg-raised-2 px-3 py-2 text-caption text-danger' : 'sr-only'}>
      {visible ? 'No pudimos guardar tu pieza en este celular. Revisa que no estés en modo incógnito o sin espacio, e inténtalo otra vez.' : ''}
    </p>
  );
}

/* ── Borrador guiado (días 5-30 que no cierran semana) ── */
function MisionBorrador({ onGuardada }: { onGuardada: (dia: number) => void }) {
  const cuenta = useCuentaActiva();
  const reduce = useReducedMotion();
  const idCampo = useId();
  const dia = diaRuta(estadoRuta(cuenta).diaActual);
  const guia = guiaBorrador(dia.dia);
  const hechas = new Set(cuenta.piezas.map((p) => p.dia));
  const usadas = dia.usa.map((d) => cuenta.piezas.find((p) => p.dia === d)).filter((p): p is PiezaGuardada => Boolean(p));
  const clave = `empresai_borrador_${dia.dia}`;
  const [texto, setTexto] = useState(() => {
    try {
      return sessionStorage.getItem(clave) ?? '';
    } catch {
      return '';
    }
  });
  const [aviso, setAviso] = useState(0);
  const [errorGuardado, setErrorGuardado] = useState(false);
  const [anterior, setAnterior] = useState<string | null>(null);
  const valido = limpiarTexto(texto, LARGO_MAX_BORRADOR).length >= 15 && !texto.includes('___');

  useEffect(() => {
    if (anterior === null) return;
    const t = window.setTimeout(() => setAnterior(null), 5000);
    return () => window.clearTimeout(t);
  }, [anterior]);

  useEffect(() => {
    try {
      sessionStorage.setItem(clave, texto);
    } catch {
      // Sin almacenamiento: el borrador vive solo en pantalla.
    }
  }, [clave, texto]);

  if (!guia) return null;

  function guardar() {
    if (!valido) {
      setAviso((n) => n + 1);
      vibrar(30);
      return;
    }
    const contenido = texto.replace(/\s+/g, ' ').trim();
    const ok = guardarPieza(cuenta, { dia: dia.dia, titulo: dia.pieza, contenido, resumen: resumenCorto(contenido), base: true });
    if (!ok) {
      setErrorGuardado(true);
      return;
    }
    try {
      sessionStorage.removeItem(clave);
    } catch {
      // Nada que limpiar.
    }
    vibrar(40);
    onGuardada(dia.dia);
  }

  return (
    <Pantalla
      accion={
        <BotonPrincipal
          onClick={guardar}
          nota={
            aviso > 0 && !valido ? (
              <span className="text-danger">{texto.includes('___') ? 'Completa los espacios ___ con tus palabras.' : 'Escribe al menos una frase.'}</span>
            ) : (
              'Se guarda como tu pieza de hoy'
            )
          }
        >
          Guardar en Mi Empresa
          <ArrowRight size={20} aria-hidden="true" />
        </BotonPrincipal>
      }
    >
      <EncabezadoMision dia={dia} />
      <SeArmaCon usa={dia.usa} piezasHechas={hechas} />
      <motion.div initial={{ opacity: 0, y: reduce ? 0 : 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease: EASE_SALIDA }} className="mt-6">
        <TituloAcento texto={guia.pregunta} acento={guia.acento} as="h1" className="text-pregunta" />
        <p className="mt-2 flex items-start gap-2 text-caption text-ink-2">
          <Lightbulb size={16} className="mt-0.5 shrink-0 text-ink-3" aria-hidden="true" />
          {guia.consejo}
        </p>
      </motion.div>

      <div className="hairline-oro relieve-tarjeta mt-4 rounded-[var(--radius-card)] p-3">
        <label htmlFor={idCampo} className="flex items-center justify-between gap-2 px-1 text-sm font-semibold text-ink-1">
          Tu {dia.corto.toLowerCase()}
          <button
            type="button"
            onClick={() => {
              setAnterior(texto);
              setTexto(texto.trim() ? `${texto.trim()}\n${guia.plantilla}` : guia.plantilla);
              vibrar();
            }}
            className="flex min-h-11 items-center gap-1 rounded-[var(--radius-pill)] px-3 text-xs font-semibold text-gold active:scale-95"
          >
            <WandSparkles size={14} aria-hidden="true" />
            Usar plantilla
          </button>
        </label>
        <textarea
          key={aviso}
          id={idCampo}
          value={texto}
          maxLength={LARGO_MAX_BORRADOR}
          onChange={(ev) => setTexto(ev.target.value)}
          rows={5}
          placeholder="Escríbelo aquí con tus palabras, o toca «Usar plantilla»."
          className={`mt-1 w-full resize-none rounded-[var(--radius-chip)] border bg-sunken px-4 py-3 text-base leading-snug text-ink-1 placeholder:text-ink-3 focus:outline-none ${
            aviso && !valido ? 'sacudir border-danger focus:border-danger' : 'border-[var(--line)] focus:border-gold'
          }`}
        />
        {anterior !== null && (
          <p role="status" className="mt-2 flex items-center justify-between gap-2 px-1 text-caption text-ink-2">
            Pusimos la plantilla: completa los ___.
            <button
              type="button"
              onClick={() => {
                setTexto(anterior);
                setAnterior(null);
              }}
              className="flex min-h-11 items-center px-2 font-semibold text-ink-1 underline underline-offset-4"
            >
              Deshacer
            </button>
          </p>
        )}
        <p className="mt-2 px-1 text-caption text-ink-3">Es tu versión base: la puedes mejorar cuando quieras desde Mi Empresa.</p>
      </div>

      {usadas.length > 0 && (
        <section className="mt-6" aria-labelledby="titulo-repaso">
          <h2 id="titulo-repaso" className="text-sm font-semibold text-ink-2">
            Para inspirarte, lo que ya armaste:
          </h2>
          <ul className="mt-2 flex flex-col gap-2">
            {usadas.map((p) => (
              <li key={p.dia} className="rounded-[var(--radius-chip)] bg-raised px-3 py-2 text-sm">
                <span className="block text-xs font-semibold text-ink-3">{RUTA[p.dia - 1].corto}</span>
                <span className="text-ink-1">{p.resumen ?? p.contenido}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
      <ErrorGuardado visible={errorGuardado} />
    </Pantalla>
  );
}

/* ── Cierre de semana (7, 14, 21, 30): junta las piezas en una sola ── */
function CierreSemana({ onGuardada }: { onGuardada: (dia: number) => void }) {
  const cuenta = useCuentaActiva();
  const reduce = useReducedMotion();
  const dia = diaRuta(estadoRuta(cuenta).diaActual);
  const [errorGuardado, setErrorGuardado] = useState(false);
  const piezas = dia.dia === 30 ? cuenta.piezas : cuenta.piezas.filter((p) => diaRuta(p.dia).semana === dia.semana);

  function guardar() {
    const contenido = piezas.map((p) => `${RUTA[p.dia - 1].corto}: ${p.resumen ?? p.contenido}`).join(' · ');
    const ok = guardarPieza(cuenta, {
      dia: dia.dia,
      titulo: dia.pieza,
      contenido,
      resumen: `${piezas.length} piezas en una sola página`,
      detalle: [{ rotulo: 'Úsalo así', valor: 'Es tu resumen para compartir o revisar antes de seguir con la siguiente semana.' }],
      base: true,
    });
    if (!ok) {
      setErrorGuardado(true);
      return;
    }
    vibrar(40);
    onGuardada(dia.dia);
  }

  return (
    <Pantalla
      accion={
        <BotonPrincipal onClick={guardar} nota="Se guarda como tu pieza de hoy">
          {dia.dia === 30 ? 'Guardar mi negocio completo' : 'Cerrar mi semana'}
          <ArrowRight size={20} aria-hidden="true" />
        </BotonPrincipal>
      }
    >
      <EncabezadoMision dia={dia} />
      <motion.div initial={{ opacity: 0, y: reduce ? 0 : 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease: EASE_SALIDA }} className="mt-6">
        <TituloAcento texto={dia.dia === 30 ? 'Tu negocio, en una página' : `Tu semana ${dia.semana}, en una página`} acento="en una página" as="h1" className="text-pregunta" />
        <p className="mt-2 text-ayuda text-ink-2">Revisa lo que armaste. Al guardarlo queda como una sola pieza, lista para compartir.</p>
      </motion.div>
      <ul className="hairline-oro relieve-tarjeta mt-4 flex flex-col gap-3 rounded-[var(--radius-card)] p-4">
        {piezas.map((p, i) => (
          <Fragment key={p.dia}>
          {(i === 0 || diaRuta(piezas[i - 1].dia).semana !== diaRuta(p.dia).semana) && dia.dia === 30 && (
            <li key={`s${p.dia}`} className="pt-1 text-xs font-bold tracking-[0.08em] text-ink-3 uppercase">
              Semana {diaRuta(p.dia).semana}
            </li>
          )}
          <li key={p.dia} className="flex items-start gap-3">
            <span aria-hidden="true" className="relieve-verde mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full">
              <Check size={12} strokeWidth={3} />
            </span>
            <span className="min-w-0 text-sm">
              <span className="block text-xs font-semibold text-ink-3">
                Día {p.dia} · {RUTA[p.dia - 1].corto}
              </span>
              <span className="text-ink-1">{p.resumen ?? p.contenido}</span>
            </span>
          </li>
          </Fragment>
        ))}
      </ul>
      <ErrorGuardado visible={errorGuardado} />
    </Pantalla>
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
  const [errorGuardado, setErrorGuardado] = useState(false);
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
    const ok = guardarPieza(cuenta, { dia: dia.dia, titulo: dia.pieza, contenido: pieza.contenido, resumen: pieza.resumen, detalle: pieza.detalle, base: true });
    if (!ok) {
      setErrorGuardado(true);
      return;
    }
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
    <main className="flex min-h-dvh flex-1 flex-col">
      <div className="px-4">
        <EncabezadoMision dia={dia} />
        {fase !== 'preguntas' && <SeArmaCon usa={dia.usa} piezasHechas={hechas} />}

        {/* Lo ya respondido: se toca para cambiarlo */}
        {fase === 'preguntas' && paso > 0 && (
          <ul className="mt-4 flex flex-wrap gap-2" aria-label="Tus respuestas">
            {mision.preguntas.slice(0, paso).map((q, i) => (
              <li key={q.id} className="max-w-full">
                <button
                  type="button"
                  disabled={bloqueado}
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

            {/* Las opciones agrupadas en una tarjeta con hairline, como la referencia aprobada */}
            <div className="hairline-oro relieve-tarjeta mt-4 rounded-[var(--radius-card)] p-3">
              <div className={`gap-2 ${pregunta.multiple ? 'grid grid-cols-2' : 'flex flex-col'}`} role={pregunta.multiple ? 'group' : 'radiogroup'} aria-label={pregunta.pregunta}>
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
                        aviso && limpiarTexto(propio, LARGO_MAX).length < 3 ? 'sacudir border-danger' : 'border-gold'
                      }`}
                    />
                    {aviso > 0 && limpiarTexto(propio, LARGO_MAX).length < 3 && <p className="text-caption text-danger">Escribe al menos unas letras.</p>}
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
                Pieza {dia.dia} · {dia.corto}
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
      <ErrorGuardado visible={errorGuardado} />

      {fase === 'preguntas' && !pregunta.multiple && (
        <div className="barra-inferior sticky bottom-0 z-10 mt-auto px-4 pt-6">
          <div className="flex gap-1" aria-hidden="true">
            {mision.preguntas.map((q, i) => (
              <span key={q.id} className={`h-1.5 flex-1 rounded-full ${i < paso ? 'bg-green' : i === paso ? 'bg-gold' : 'bg-raised-2'}`} />
            ))}
          </div>
          <p className="mt-2 text-center text-caption text-ink-2">Toca una opción y seguimos · al final se guarda en Mi Empresa</p>
        </div>
      )}

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
          nota={avisoMultiple ? <span className="text-danger">Elige al menos una.</span> : `${elegidas.length} elegida${elegidas.length === 1 ? '' : 's'}`}
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

/* ── Celebración: la pieza es la protagonista; una copia vuela hasta "Ver en Mi Empresa" y al llegar
   se enciende el tick verde (firma de FICHA-ARTE). Al cerrar semana, confeti (solo ahí). ── */
const CONFETI = Array.from({ length: 18 }, (_, i) => i);

function Celebracion({ dia }: { dia: number }) {
  const cuenta: Cuenta = useCuentaActiva();
  const reduce = useReducedMotion();
  const e = estadoRuta(cuenta);
  const d = diaRuta(dia);
  const pieza = cuenta.piezas.find((p) => p.dia === dia);
  const siguiente = dia < RUTA.length ? diaRuta(dia + 1) : undefined;
  const refTarjeta = useRef<HTMLElement>(null);
  const refBoton = useRef<HTMLAnchorElement>(null);
  const [vuelo, setVuelo] = useState<number | null>(null);
  const [enEmpresa, setEnEmpresa] = useState(Boolean(reduce));

  useEffect(() => {
    if (reduce) return;
    const t = window.setTimeout(() => {
      const a = refTarjeta.current?.getBoundingClientRect();
      const b = refBoton.current?.getBoundingClientRect();
      if (a && b) setVuelo(b.top + b.height / 2 - (a.top + 28));
      else setEnEmpresa(true);
    }, 900);
    return () => window.clearTimeout(t);
  }, [reduce]);

  return (
    <main className="flex min-h-dvh flex-1 flex-col">
      <div className="flex flex-1 flex-col items-center justify-center px-4 py-8 text-center" aria-live="polite">
        <p className="text-xs font-bold tracking-[0.08em] text-green uppercase">{d.cierre ? `¡Semana ${d.semana} completa!` : `Día ${dia} listo`}</p>
        <h1 className="mt-1 font-display text-pregunta font-extrabold text-ink-1">¡Pieza {dia} guardada!</h1>

        <div className="relative mt-6 w-full">
          {!reduce &&
            (d.cierre ? CONFETI : CHISPAS).map((g, i) => {
              const ang = d.cierre ? (i / CONFETI.length) * 360 : g;
              return (
                <motion.span
                  key={`${g}-${i}`}
                  aria-hidden="true"
                  className={`absolute top-1/2 left-1/2 rounded-full ${d.cierre && i % 2 ? 'size-1.5 bg-green' : 'size-2 bg-gold'}`}
                  initial={{ x: 0, y: 0, opacity: 0 }}
                  animate={{
                    x: Math.cos((ang * Math.PI) / 180) * (d.cierre ? 170 : 150),
                    y: Math.sin((ang * Math.PI) / 180) * (d.cierre ? 120 : 70) + (d.cierre ? 40 : 0),
                    opacity: [0, 1, 0],
                  }}
                  transition={{ duration: d.cierre ? 1.2 : 0.8, delay: 0.25, ease: EASE_SALIDA }}
                />
              );
            })}
          <motion.article
            ref={refTarjeta}
            initial={{ opacity: 0, scale: reduce ? 1 : 0.85, y: reduce ? 0 : 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: 'spring', bounce: 0.25, duration: 0.6 }}
            className="hairline-oro relieve-tarjeta relative rounded-[var(--radius-card)] p-4 text-left"
          >
            <p className="flex items-center justify-between gap-2 text-xs font-bold tracking-[0.08em] uppercase">
              <span className="text-gold">{d.corto}</span>
              {enEmpresa && (
                <motion.span
                  initial={{ scale: reduce ? 1 : 0 }}
                  animate={{ scale: 1 }}
                  transition={reduce ? { duration: 0 } : { type: 'spring', bounce: 0.25, duration: 0.5 }}
                  className="flex shrink-0 items-center gap-1 text-green"
                >
                  <Check size={14} strokeWidth={3} aria-hidden="true" />
                  En Mi Empresa
                </motion.span>
              )}
            </p>
            <p className="mt-2 line-clamp-3 text-base leading-snug font-semibold text-ink-1">{pieza?.resumen ?? pieza?.contenido}</p>
          </motion.article>
          {vuelo !== null && !enEmpresa && (
            <motion.span
              aria-hidden="true"
              className="pointer-events-none absolute top-4 left-1/2 z-20 flex h-7 -translate-x-1/2 items-center gap-1 rounded-full bg-gold px-3 text-xs font-bold text-on-gold shadow-[0_2px_0_var(--gold-deep)]"
              initial={{ opacity: 0, y: 0, scale: 1 }}
              animate={{ opacity: [0, 1, 1, 0], y: [0, 0, vuelo, vuelo], scale: [1, 1, 0.7, 0.5] }}
              transition={{ duration: 0.9, times: [0, 0.15, 0.85, 1], ease: EASE_SALIDA }}
              onAnimationComplete={() => {
                setEnEmpresa(true);
                vibrar(20);
              }}
            >
              <Sparkles size={12} />
              Pieza {dia}
            </motion.span>
          )}
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
      </div>
      <div className="barra-inferior sticky bottom-0 z-10 px-4 pt-6">
        <Link
          ref={refBoton}
          href={`/app/empresa?pieza=${dia}`}
          className="boton-oro flex h-14 items-center justify-center gap-2 rounded-[var(--radius-pill)] font-display text-boton font-bold"
        >
          Ver en Mi Empresa
          <ArrowRight size={20} aria-hidden="true" />
        </Link>
        <Link href="/app" className="mt-1 flex min-h-11 items-center justify-center text-sm font-semibold text-ink-2">
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
              className={`relative flex size-9 items-center justify-center rounded-full ${lista ? 'relieve-verde' : 'relieve-piedra-apagada'}`}
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
