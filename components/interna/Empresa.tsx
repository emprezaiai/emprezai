'use client';

// MI EMPRESA — el negocio armado pieza a pieza (deseo #2 del avatar: "la estructura de mi empresa
// armada"). La pieza más nueva destacada, el resto agrupado por semana (las cerradas se pliegan),
// lo que viene como fantasmas bloqueados, y todo exportable: "Tu idea es tuya" = te la llevas.

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, animate, motion, useDragControls, useReducedMotion } from 'motion/react';
import { ArrowRight, Check, ChevronDown, Copy, Download, LockKeyhole, PencilLine, Puzzle, Share, X } from 'lucide-react';
import { editarPieza, estadoRuta, fechaLocal, type Cuenta, type PiezaGuardada } from '@/lib/cuenta';
import { RUTA, SEMANAS, TOTAL_DIAS, diaRuta } from '@/lib/ruta';
import { EASE_SALIDA } from '@/components/onboarding/piezas';
import { useCuentaActiva } from './Marco';

function nombreNegocio(c: Cuenta): string {
  const nombre = c.piezas.find((p) => p.dia === 8)?.contenido.split(/[.\n]/)[0];
  return nombre || c.idea || 'Tu negocio';
}

function textoExportable(c: Cuenta): string {
  const lineas = [`EMPRESAI — ${nombreNegocio(c)}`, `${c.piezas.length} de ${TOTAL_DIAS} piezas`, ''];
  for (const p of c.piezas) {
    lineas.push(`Día ${p.dia} · ${p.titulo}`, p.contenido);
    for (const d of p.detalle ?? []) lineas.push(`${d.rotulo}: ${d.valor}`);
    lineas.push('');
  }
  return lineas.join('\n');
}

/** Resumen completo (sin cortes a media palabra): el resumen guardado, la 1ª frase corta o un corte por palabra. */
function resumenDe(p: PiezaGuardada): string {
  if (p.resumen) return p.resumen;
  const primera = p.contenido.split(/(?<=[.:])\s/)[0];
  if (primera.length <= 90) return primera.replace(/[:]$/, '');
  const corte = p.contenido.slice(0, 80);
  return `${corte.slice(0, corte.lastIndexOf(' '))}…`;
}

const rotulo = (p: PiezaGuardada) => RUTA[p.dia - 1]?.corto ?? p.titulo;

export function Empresa() {
  const cuenta = useCuentaActiva();
  const reduce = useReducedMotion();
  const e = estadoRuta(cuenta);
  const piezas = [...cuenta.piezas].sort((a, b) => b.dia - a.dia);
  const [nueva, ...resto] = piezas;
  const recienGuardada = Boolean(nueva && nueva.fecha === fechaLocal() && !reduce);
  const [abierta, setAbierta] = useState<number | null>(null);
  const [aviso, setAviso] = useState('');
  const semanaActual = diaRuta(e.terminada ? TOTAL_DIAS : e.diaActual).semana;
  // Abiertas al entrar: la semana en curso y la de la pieza anterior a la nueva (nunca una pantalla "vacía").
  const [abiertas, setAbiertas] = useState<Set<number>>(() => new Set([semanaActual, ...(resto[0] ? [diaRuta(resto[0].dia).semana] : [])]));
  const siguiente = !e.terminada ? diaRuta(e.diaActual) : undefined;
  const semana = SEMANAS[semanaActual - 1];
  const piezaAbierta = cuenta.piezas.find((p) => p.dia === abierta);
  const origen = useRef<HTMLElement | null>(null);

  // ?pieza=N (desde Hoy o la Ruta) abre esa pieza; el botón atrás del celular la cierra.
  useEffect(() => {
    const leerUrl = () => {
      const n = Number(new URLSearchParams(window.location.search).get('pieza'));
      setAbierta(Number.isInteger(n) && n > 0 ? n : null);
    };
    leerUrl();
    window.addEventListener('popstate', leerUrl);
    return () => window.removeEventListener('popstate', leerUrl);
  }, []);

  useEffect(() => {
    if (!aviso) return;
    const t = window.setTimeout(() => setAviso(''), 4000);
    return () => window.clearTimeout(t);
  }, [aviso]);

  function abrir(dia: number) {
    origen.current = document.activeElement as HTMLElement | null;
    window.history.pushState({ pieza: dia }, '', `/app/empresa?pieza=${dia}`);
    setAbierta(dia);
  }

  const cerrar = useCallback(() => {
    if ((window.history.state as { pieza?: number } | null)?.pieza) window.history.back();
    else {
      window.history.replaceState(null, '', '/app/empresa');
      setAbierta(null);
    }
    window.setTimeout(() => origen.current?.focus(), 0);
  }, []);

  const entrar = (i: number) => ({
    initial: { opacity: 0, y: reduce ? 0 : 14 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, delay: reduce ? 0 : 0.05 + i * 0.06, ease: EASE_SALIDA },
  });

  function descargar() {
    const url = URL.createObjectURL(new Blob([textoExportable(cuenta)], { type: 'text/plain;charset=utf-8' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mi-empresa-empresai.txt';
    a.click();
    // Se libera después: revocar en la misma línea cancela la descarga en Safari/Firefox.
    window.setTimeout(() => URL.revokeObjectURL(url), 2000);
    setAviso('Tu negocio se está descargando en un archivo de texto.');
  }

  async function compartir() {
    const texto = textoExportable(cuenta);
    try {
      if (navigator.share) {
        await navigator.share({ title: nombreNegocio(cuenta), text: texto });
        return;
      }
      await navigator.clipboard.writeText(texto);
      setAviso('Copiamos todo tu negocio. Pégalo donde quieras.');
    } catch (err) {
      // Cerrar la hoja de compartir sin elegir no es un error.
      if (err instanceof DOMException && err.name === 'AbortError') return;
      setAviso('No se pudo compartir. Usa el botón de descargar.');
    }
  }

  // El resto agrupado por semana (de la más nueva a la más vieja)
  const grupos = SEMANAS.map((s) => ({ semana: s, piezas: resto.filter((p) => diaRuta(p.dia).semana === s.numero) }))
    .filter((g) => g.piezas.length)
    .reverse();
  // Con pocas piezas, lo que viene se ve como fantasmas (la promesa de la ruta, sin vacío)
  const fantasmas = cuenta.piezas.length < 4 && !e.terminada ? RUTA.slice(e.diaActual - 1, e.diaActual + 2).filter((d) => !cuenta.piezas.some((p) => p.dia === d.dia)) : [];

  return (
    <main>
      <header className="flex h-16 items-center justify-between px-4">
        <button
          type="button"
          onClick={descargar}
          aria-label="Descargar mi empresa"
          className="tarjeta-relieve flex size-11 items-center justify-center rounded-full text-ink-2 transition-transform duration-150 active:scale-95"
        >
          <Download size={20} aria-hidden="true" />
        </button>
        <p className="font-display text-lg font-extrabold text-ink-1">Mi Empresa</p>
        <button
          type="button"
          onClick={compartir}
          aria-label="Compartir mi empresa"
          className="tarjeta-relieve flex size-11 items-center justify-center rounded-full text-ink-2 transition-transform duration-150 active:scale-95"
        >
          <Share size={20} aria-hidden="true" />
        </button>
      </header>

      <div className="px-4">
        <motion.div {...entrar(0)}>
          <h1 className="font-display text-pregunta font-extrabold tracking-[-0.02em] text-balance break-words text-ink-1">{nombreNegocio(cuenta)}</h1>
          <div className="mt-4 flex gap-1" role="progressbar" aria-label="Piezas armadas" aria-valuemin={0} aria-valuemax={TOTAL_DIAS} aria-valuenow={e.piezasListas}>
            {Array.from({ length: TOTAL_DIAS }, (_, i) => {
              const dia = i + 1;
              const lista = cuenta.piezas.some((p) => p.dia === dia);
              const actual = dia === e.diaActual && !e.terminada && !e.hechaHoy;
              return (
                <motion.span
                  key={dia}
                  aria-hidden="true"
                  /* el segmento de la pieza nueva destella una vez */
                  initial={{ scaleY: reduce ? 1 : 0.3, opacity: 0 }}
                  animate={{ scaleY: 1, opacity: 1 }}
                  transition={{ duration: 0.25, delay: reduce ? 0 : 0.2 + i * 0.015 }}
                  className={`h-3 flex-1 rounded-full ${lista ? 'bg-green' : actual ? 'bg-gold' : 'bg-raised-2'}`}
                >
                  {recienGuardada && dia === nueva.dia && (
                    <motion.span
                      className="block size-full rounded-full bg-green-light"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0, 1, 0] }}
                      transition={{ duration: 1, delay: 0.9, ease: 'easeInOut' }}
                    />
                  )}
                </motion.span>
              );
            })}
          </div>
          <p className="mt-2 flex justify-between gap-2 text-xs text-ink-3">
            <span className="tabular-nums">
              <CuentaPiezas valor={e.piezasListas} /> de {TOTAL_DIAS} piezas
            </span>
            <span className="truncate">
              Semana {semana.numero} · {semana.tema}
            </span>
          </p>
        </motion.div>

        {!nueva ? (
          <motion.div {...entrar(1)} className="tarjeta-relieve mt-6 rounded-[var(--radius-card)] p-6 text-center">
            <p className="font-display text-xl font-extrabold text-ink-1">Tu empresa empieza con una frase</p>
            <p className="mt-2 text-ayuda text-ink-2">Arma tu pieza 1 en 5 minutos y aparece aquí, lista para copiar.</p>
            <Link href="/onboarding" className="boton-oro mt-6 inline-flex h-12 items-center gap-2 rounded-[var(--radius-pill)] px-6 font-display text-base font-bold">
              Armar mi pieza 1
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </motion.div>
        ) : (
          <>
            {/* La pieza más nueva, destacada */}
            <motion.button
              initial={recienGuardada ? { opacity: 0, scale: 0.94, y: 10 } : { opacity: 0, y: reduce ? 0 : 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={recienGuardada ? { type: 'spring', bounce: 0.25, duration: 0.55, delay: 0.15 } : { duration: 0.4, delay: reduce ? 0 : 0.1, ease: EASE_SALIDA }}
              type="button"
              onClick={() => abrir(nueva.dia)}
              className="hairline-oro relieve-tarjeta mt-6 block w-full rounded-[var(--radius-card)] p-4 text-left transition-transform duration-150 active:scale-[0.99]"
            >
              <span className="flex items-center justify-between gap-2 text-xs font-bold tracking-[0.04em] uppercase">
                <span className="truncate text-ink-3">{rotulo(nueva)}</span>
                <span className="flex shrink-0 items-center gap-1 text-gold">
                  {recienGuardada && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', bounce: 0.25, duration: 0.45, delay: 0.7 }}
                      className="flex size-4 items-center justify-center rounded-full bg-green text-on-green"
                      aria-hidden="true"
                    >
                      <Check size={10} strokeWidth={3.5} />
                    </motion.span>
                  )}
                  Nueva · Día {nueva.dia}
                </span>
              </span>
              <span className="mt-2 block font-display text-xl leading-snug font-extrabold text-pretty text-ink-1">{resumenDe(nueva)}</span>
              <span className="mt-2 block text-xs font-semibold text-ink-3">Toca para verla completa y copiarla</span>
            </motion.button>

            {siguiente && !e.hechaHoy && (
              <motion.div {...entrar(2)}>
                <Link
                  href="/app/mision"
                  className="mt-3 flex items-center gap-3 rounded-[var(--radius-card)] border border-dashed border-gold p-4 transition-transform duration-150 active:scale-[0.99]"
                >
                  <span className="min-w-0 flex-1 text-sm">
                    <span className="block font-semibold text-ink-1">Hoy · Día {siguiente.dia}</span>
                    <span className="block text-pretty text-ink-2">{siguiente.pieza} · 5 minutos</span>
                  </span>
                  <ArrowRight size={18} className="shrink-0 text-gold" aria-hidden="true" />
                </Link>
              </motion.div>
            )}

            {/* El resto, por semana: la actual abierta, las cerradas plegadas */}
            {grupos.map((g, gi) => {
              const abiertaSemana = abiertas.has(g.semana.numero);
              const completa = RUTA.filter((d) => d.semana === g.semana.numero).every((d) => cuenta.piezas.some((p) => p.dia === d.dia));
              return (
                <motion.section key={g.semana.numero} {...entrar(3 + gi)} className="mt-6" aria-label={`Semana ${g.semana.numero}`}>
                  <button
                    type="button"
                    aria-expanded={abiertaSemana}
                    onClick={() =>
                      setAbiertas((a) => {
                        const n = new Set(a);
                        if (n.has(g.semana.numero)) n.delete(g.semana.numero);
                        else n.add(g.semana.numero);
                        return n;
                      })
                    }
                    className="flex min-h-11 w-full items-center gap-2 text-left"
                  >
                    {completa && <Check size={16} strokeWidth={3} className="text-green" aria-hidden="true" />}
                    <span className="flex-1 font-display text-lg font-bold text-ink-1">
                      Semana {g.semana.numero} · {g.semana.tema}
                    </span>
                    <span className="text-xs text-ink-3 tabular-nums">
                      {cuenta.piezas.filter((p) => diaRuta(p.dia).semana === g.semana.numero).length}/{RUTA.filter((d) => d.semana === g.semana.numero).length}
                    </span>
                    <ChevronDown size={18} className={`text-ink-3 transition-transform duration-200 ${abiertaSemana ? 'rotate-180' : ''}`} aria-hidden="true" />
                  </button>
                  <AnimatePresence initial={false}>
                    {abiertaSemana && (
                      <motion.ul
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: reduce ? 0 : 0.25, ease: EASE_SALIDA }}
                        className="mt-2 grid grid-cols-2 gap-3 overflow-hidden"
                      >
                        {g.piezas.map((p, i) => (
                          <motion.li
                            key={p.dia}
                            initial={{ opacity: 0, y: reduce ? 0 : 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: reduce ? 0 : 0.05 + i * 0.05, ease: EASE_SALIDA }}
                          >
                            <button
                              type="button"
                              onClick={() => abrir(p.dia)}
                              className="tarjeta-relieve flex h-full w-full flex-col rounded-[var(--radius-card)] p-3 text-left transition-transform duration-150 active:scale-[0.98]"
                            >
                              <span className="block truncate text-xs font-bold tracking-[0.04em] text-ink-3 uppercase">{rotulo(p)}</span>
                              <span className="mt-1 line-clamp-3 text-sm leading-snug font-semibold text-ink-1">{resumenDe(p)}</span>
                              <span className="mt-auto pt-2 text-xs font-semibold text-green">Día {p.dia}</span>
                            </button>
                          </motion.li>
                        ))}
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </motion.section>
              );
            })}
          </>
        )}

        {/* Lo que viene: la de hoy (acción) + fantasmas bloqueados */}
        {siguiente && nueva && (
          <motion.div {...entrar(3 + grupos.length)} className="mt-6 flex flex-col gap-3">
            {(fantasmas.length ? fantasmas.filter((d) => e.hechaHoy || d.dia !== siguiente.dia) : e.hechaHoy ? [siguiente] : []).map((d, i) => (
              <div key={d.dia} className="flex items-center gap-3 rounded-[var(--radius-card)] border border-dashed border-[var(--line)] bg-sunken p-4">
                <LockKeyhole size={18} className="shrink-0 text-ink-3" aria-hidden="true" />
                <p className="min-w-0 text-sm">
                  <span className="block font-semibold text-ink-1">{e.hechaHoy && i === 0 ? `Mañana · Día ${d.dia}` : `Día ${d.dia}`}</span>
                  <span className="block text-ink-2">{d.pieza}</span>
                </p>
              </div>
            ))}
            {fantasmas.length > 0 && (
              <p className="mt-1 flex items-start gap-2 text-caption text-ink-2">
                <Puzzle size={16} className="mt-0.5 shrink-0 text-ink-3" aria-hidden="true" />
                Al día 30 aquí estará tu negocio completo: 30 piezas listas para copiar y usar.
              </p>
            )}
          </motion.div>
        )}
      </div>

      {/* Aviso flotante (no empuja nada; se va solo a los 4 s) */}
      <AnimatePresence>
        {aviso && (
          <motion.p
            role="status"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="fixed inset-x-4 bottom-28 z-20 mx-auto max-w-sm rounded-[var(--radius-pill)] bg-raised-2 px-4 py-3 text-center text-caption text-ink-1 shadow-[0_12px_24px_-12px_rgb(0_0_0/0.8)]"
          >
            {aviso}
          </motion.p>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {piezaAbierta && <HojaPieza pieza={piezaAbierta} onCerrar={cerrar} onEditar={(texto) => Boolean(editarPieza(cuenta, piezaAbierta.dia, texto))} />}
      </AnimatePresence>
    </main>
  );
}

/* Detalle de una pieza: texto completo, cómo usarla, copiar. */
function HojaPieza({ pieza, onCerrar, onEditar }: { pieza: PiezaGuardada; onCerrar: () => void; onEditar: (texto: string) => boolean }) {
  const reduce = useReducedMotion();
  const [editando, setEditando] = useState(false);
  const [borrador, setBorrador] = useState(pieza.contenido);
  const [errorEdicion, setErrorEdicion] = useState('');
  const campoEdicion = useRef<HTMLTextAreaElement>(null);
  const arrastre = useDragControls();
  const hoja = useRef<HTMLDivElement>(null);
  const cerrar = useRef<HTMLButtonElement>(null);
  const [copiado, setCopiado] = useState<'no' | 'si' | 'error'>('no');

  useEffect(() => {
    cerrar.current?.focus();
    const tecla = (ev: KeyboardEvent) => {
      if (ev.key === 'Escape') onCerrar();
      // El foco no se escapa de la hoja mientras está abierta.
      if (ev.key === 'Tab' && hoja.current) {
        const enfocables = hoja.current.querySelectorAll<HTMLElement>('button, a[href], textarea');
        const primero = enfocables[0];
        const ultimo = enfocables[enfocables.length - 1];
        if (ev.shiftKey && document.activeElement === primero) {
          ev.preventDefault();
          ultimo?.focus();
        } else if (!ev.shiftKey && document.activeElement === ultimo) {
          ev.preventDefault();
          primero?.focus();
        }
      }
    };
    window.addEventListener('keydown', tecla);
    return () => window.removeEventListener('keydown', tecla);
  }, [onCerrar]);

  useEffect(() => {
    const anterior = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = anterior;
    };
  }, []);

  useEffect(() => {
    if (copiado !== 'si') return;
    const t = window.setTimeout(() => setCopiado('no'), 2400);
    return () => window.clearTimeout(t);
  }, [copiado]);

  function guardarEdicion() {
    if (!borrador.trim()) {
      setErrorEdicion('Escribe algo antes de guardar, o toca Cancelar.');
      return;
    }
    if (!onEditar(borrador)) {
      setErrorEdicion('No pudimos guardar en este celular. Libera espacio e intenta otra vez.');
      return;
    }
    setErrorEdicion('');
    setEditando(false);
  }

  async function copiar() {
    try {
      await navigator.clipboard.writeText(pieza.contenido);
      setCopiado('si');
    } catch {
      setCopiado('error');
    }
  }

  return (
    <motion.div className="velo-oscuro fixed inset-0 z-30 flex items-end justify-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onCerrar}>
      <motion.div
        ref={hoja}
        role="dialog"
        aria-modal="true"
        aria-labelledby="titulo-pieza"
        initial={{ y: reduce ? 0 : 48, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: reduce ? 0 : 48, opacity: 0 }}
        transition={{ duration: 0.3, ease: EASE_SALIDA }}
        onClick={(ev) => ev.stopPropagation()}
        drag={reduce ? false : 'y'}
        dragControls={arrastre}
        dragListener={false}
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ top: 0, bottom: 0.6 }}
        onDragEnd={(_, info) => {
          if (info.offset.y > 100) onCerrar();
        }}
        className="tarjeta-relieve max-h-[85dvh] w-full max-w-md overflow-y-auto rounded-t-[var(--radius-card)] px-4 pt-4 pb-[max(16px,env(safe-area-inset-bottom))]"
      >
        <div
          aria-hidden="true"
          onPointerDown={(ev) => arrastre.start(ev)}
          className="sticky -top-4 z-10 -mx-4 -mt-4 mb-1 flex h-8 cursor-grab touch-none items-center justify-center bg-raised"
        >
          <span className="block h-1 w-10 rounded-full bg-ink-3" />
        </div>
        <div className="flex items-start gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold tracking-[0.04em] text-green uppercase">Día {pieza.dia} · {pieza.editadaEn ? 'tu versión' : 'lista'}</p>
            <h2 id="titulo-pieza" className="mt-1 font-display text-xl font-extrabold text-ink-1">
              {pieza.titulo}
            </h2>
          </div>
          <button
            ref={cerrar}
            type="button"
            onClick={onCerrar}
            aria-label="Cerrar"
            className="-mr-2 mt-2 flex size-11 shrink-0 items-center justify-center rounded-full text-ink-2 transition-colors duration-150 hover:bg-raised-2"
          >
            <X size={22} aria-hidden="true" />
          </button>
        </div>
        {editando ? (
          <div className="mt-4">
            <label htmlFor="editar-pieza" className="text-sm font-semibold text-ink-1">
              Tu versión
            </label>
            <textarea
              id="editar-pieza"
              ref={campoEdicion}
              value={borrador}
              onChange={(ev) => {
                setBorrador(ev.target.value);
                if (errorEdicion) setErrorEdicion('');
              }}
              rows={6}
              aria-invalid={Boolean(errorEdicion)}
              aria-describedby={errorEdicion ? 'editar-pieza-error' : undefined}
              className={`mt-2 w-full resize-none rounded-[var(--radius-chip)] border bg-sunken p-4 text-base leading-snug text-ink-1 focus:outline-none ${
                errorEdicion ? 'border-danger' : 'border-[var(--line)] focus:border-ink-3'
              }`}
            />
            {errorEdicion && (
              <p id="editar-pieza-error" role="alert" className="mt-1 text-caption text-danger">
                {errorEdicion}
              </p>
            )}
          </div>
        ) : (
          <p className="mt-4 text-lg leading-snug font-semibold text-pretty break-words text-ink-1">{pieza.contenido}</p>
        )}
        {pieza.detalle?.map((d) => (
          <p key={d.rotulo} className="mt-4 border-t border-[var(--line)] pt-4 text-ayuda leading-snug text-ink-2">
            <strong className="font-semibold text-ink-1">{d.rotulo}:</strong> {d.valor}
          </p>
        ))}
        {!editando && pieza.base && <p className="mt-4 text-caption text-ink-3">Versión base, armada con tus respuestas. Ajústala con tus palabras cuando quieras.</p>}
        {editando ? (
          <>
            <button type="button" onClick={guardarEdicion} className="boton-oro mt-6 flex h-14 w-full items-center justify-center gap-2 rounded-[var(--radius-pill)] font-display text-boton font-bold">
              <Check size={20} aria-hidden="true" />
              Guardar mi versión
            </button>
            <button
              type="button"
              onClick={() => {
                setEditando(false);
                setBorrador(pieza.contenido);
                setErrorEdicion('');
              }}
              className="mt-2 flex min-h-11 w-full items-center justify-center text-sm font-semibold text-ink-2 transition-transform duration-150 active:scale-[0.97]"
            >
              Cancelar
            </button>
          </>
        ) : (
          <>
            <button type="button" onClick={copiar} className="boton-oro mt-6 flex h-14 w-full items-center justify-center gap-2 rounded-[var(--radius-pill)] font-display text-boton font-bold">
              {copiado === 'si' ? <Check size={20} aria-hidden="true" /> : <Copy size={20} aria-hidden="true" />}
              {copiado === 'si' ? '¡Copiada!' : 'Copiar pieza'}
            </button>
            <button
              type="button"
              onClick={() => {
                setBorrador(pieza.contenido);
                setEditando(true);
                window.setTimeout(() => campoEdicion.current?.focus(), 0);
              }}
              className="mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-[var(--radius-pill)] border border-[var(--line)] bg-raised-2 font-display text-base font-bold text-ink-1 transition-transform duration-150 active:scale-[0.98]"
            >
              <PencilLine size={18} aria-hidden="true" />
              Editar con mis palabras
            </button>
          </>
        )}
        <p role="status" className={copiado === 'error' ? 'mt-2 text-center text-caption text-warning' : 'sr-only'}>
          {copiado === 'error' ? 'No se pudo copiar: mantén presionado el texto para copiarlo.' : copiado === 'si' ? 'Pieza copiada' : ''}
        </p>
      </motion.div>
    </motion.div>
  );
}

/* El número de piezas cuenta de 0 a su valor (baseline 2 de 22). */
function CuentaPiezas({ valor }: { valor: number }) {
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
      ease: 'easeOut',
      onUpdate: (v) => {
        if (nodo.current) nodo.current.textContent = String(Math.round(v));
      },
    });
    return () => control.stop();
  }, [valor, reduce]);
  return <span ref={nodo}>{reduce ? valor : 0}</span>;
}
