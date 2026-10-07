'use client';

// MI EMPRESA — el negocio armado pieza a pieza (deseo #2 del avatar: "la estructura de mi empresa
// armada"). La pieza más nueva destacada, las demás en mosaico, la siguiente bloqueada (pérdida
// honesta), y todo exportable: "Tu idea es tuya" también significa que te la llevas.

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ArrowRight, Check, Copy, Download, LockKeyhole, Share2, X } from 'lucide-react';
import { estadoRuta, type Cuenta, type PiezaGuardada } from '@/lib/cuenta';
import { SEMANAS, TOTAL_DIAS, diaRuta } from '@/lib/ruta';
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

const rotulo = (titulo: string) => titulo.replace(/^Tu |^Tus |^El |^La /, '');

export function Empresa() {
  const cuenta = useCuentaActiva();
  const reduce = useReducedMotion();
  const params = useSearchParams();
  const e = estadoRuta(cuenta);
  const piezas = [...cuenta.piezas].sort((a, b) => b.dia - a.dia);
  const [nueva, ...resto] = piezas;
  const [abierta, setAbierta] = useState<number | null>(() => {
    const n = Number(params.get('pieza'));
    return Number.isInteger(n) && n > 0 ? n : null;
  });
  const [aviso, setAviso] = useState('');
  const siguiente = !e.terminada ? diaRuta(e.diaActual) : undefined;
  const semana = SEMANAS[diaRuta(e.terminada ? TOTAL_DIAS : e.diaActual).semana - 1];
  const piezaAbierta = cuenta.piezas.find((p) => p.dia === abierta);

  const entrar = (i: number) => ({
    initial: { opacity: 0, y: reduce ? 0 : 14 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, delay: reduce ? 0 : 0.05 + i * 0.06, ease: EASE_SALIDA },
  });

  function descargar() {
    const blob = new Blob([textoExportable(cuenta)], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mi-empresa-empresai.txt';
    a.click();
    URL.revokeObjectURL(url);
    setAviso('Descargamos tu negocio en un archivo de texto.');
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
    } catch {
      setAviso('No se pudo compartir. Usa el botón de descargar.');
    }
  }

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
          <Share2 size={20} aria-hidden="true" />
        </button>
      </header>

      <div className="px-4">
        <motion.div {...entrar(0)}>
          <h1 className="font-display text-pregunta font-extrabold tracking-[-0.02em] text-balance break-words text-ink-1">{nombreNegocio(cuenta)}</h1>
          <div className="mt-4 flex gap-1" role="progressbar" aria-label="Piezas armadas" aria-valuemin={0} aria-valuemax={TOTAL_DIAS} aria-valuenow={e.piezasListas}>
            {Array.from({ length: TOTAL_DIAS }, (_, i) => {
              const dia = i + 1;
              const lista = cuenta.piezas.some((p) => p.dia === dia);
              const actual = dia === e.diaActual && !e.terminada;
              return (
                <motion.span
                  key={dia}
                  aria-hidden="true"
                  initial={{ scaleY: reduce ? 1 : 0.3, opacity: 0 }}
                  animate={{ scaleY: 1, opacity: 1 }}
                  transition={{ duration: 0.25, delay: reduce ? 0 : 0.2 + i * 0.015 }}
                  className={`h-3 flex-1 rounded-full ${lista ? 'bg-green' : actual ? 'bg-gold' : 'bg-raised-2'}`}
                />
              );
            })}
          </div>
          <p className="mt-2 flex justify-between gap-2 text-xs text-ink-3">
            <span className="tabular-nums">
              {e.piezasListas} de {TOTAL_DIAS} piezas
            </span>
            <span className="truncate">
              Semana {semana.numero} · {semana.tema}
            </span>
          </p>
        </motion.div>

        <p role="status" aria-live="polite" className={aviso ? 'mt-4 rounded-[var(--radius-chip)] bg-raised-2 px-3 py-2 text-caption text-ink-1' : 'sr-only'}>
          {aviso}
        </p>

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
              {...entrar(1)}
              type="button"
              onClick={() => setAbierta(nueva.dia)}
              className="hairline-oro relieve-tarjeta mt-6 block w-full rounded-[var(--radius-card)] p-4 text-left transition-transform duration-150 active:scale-[0.99]"
            >
              <span className="flex items-center justify-between gap-2 text-xs font-bold tracking-[0.08em] uppercase">
                <span className="text-ink-3">{rotulo(nueva.titulo)}</span>
                <span className="text-gold">Nueva · Día {nueva.dia}</span>
              </span>
              <span className="mt-2 line-clamp-4 block font-display text-lg leading-snug font-bold text-ink-1">{nueva.contenido}</span>
            </motion.button>

            {/* El resto en mosaico */}
            {resto.length > 0 && (
              <motion.ul {...entrar(2)} className="mt-3 grid grid-cols-2 gap-3">
                {resto.map((p) => (
                  <li key={p.dia}>
                    <button
                      type="button"
                      onClick={() => setAbierta(p.dia)}
                      className="tarjeta-relieve flex h-full w-full flex-col rounded-[var(--radius-card)] p-3 text-left transition-transform duration-150 active:scale-[0.98]"
                    >
                      <span className="text-xs font-bold tracking-[0.06em] text-ink-3 uppercase">{rotulo(p.titulo)}</span>
                      <span className="mt-1 line-clamp-4 text-sm leading-snug font-semibold text-ink-1">{p.contenido}</span>
                      <span className="mt-auto pt-2 text-xs font-semibold text-green">Día {p.dia}</span>
                    </button>
                  </li>
                ))}
              </motion.ul>
            )}
          </>
        )}

        {/* Lo que viene (bloqueado con honestidad) */}
        {siguiente && nueva && (
          <motion.div {...entrar(3)} className="mt-3">
            {e.hechaHoy ? (
              <div className="flex items-center gap-3 rounded-[var(--radius-card)] border border-dashed border-[var(--line)] bg-sunken p-4">
                <LockKeyhole size={18} className="shrink-0 text-ink-3" aria-hidden="true" />
                <p className="min-w-0 text-sm">
                  <span className="block font-semibold text-ink-1">Mañana · Día {siguiente.dia}</span>
                  <span className="block text-ink-2">{siguiente.pieza}</span>
                </p>
              </div>
            ) : (
              <Link href="/app/mision" className="flex items-center gap-3 rounded-[var(--radius-card)] border border-dashed border-gold p-4 transition-transform duration-150 active:scale-[0.99]">
                <span className="min-w-0 flex-1 text-sm">
                  <span className="block font-semibold text-ink-1">Hoy · Día {siguiente.dia}</span>
                  <span className="block text-ink-2">{siguiente.pieza}: se arma en 5 minutos</span>
                </span>
                <ArrowRight size={18} className="shrink-0 text-gold" aria-hidden="true" />
              </Link>
            )}
          </motion.div>
        )}
      </div>

      <AnimatePresence>{piezaAbierta && <HojaPieza pieza={piezaAbierta} onCerrar={() => setAbierta(null)} />}</AnimatePresence>
    </main>
  );
}

/* Detalle de una pieza: texto completo, cómo usarla, copiar. */
function HojaPieza({ pieza, onCerrar }: { pieza: PiezaGuardada; onCerrar: () => void }) {
  const reduce = useReducedMotion();
  const cerrar = useRef<HTMLButtonElement>(null);
  const [copiado, setCopiado] = useState<'no' | 'si' | 'error'>('no');

  useEffect(() => {
    cerrar.current?.focus();
    const tecla = (ev: KeyboardEvent) => ev.key === 'Escape' && onCerrar();
    window.addEventListener('keydown', tecla);
    return () => window.removeEventListener('keydown', tecla);
  }, [onCerrar]);

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
        role="dialog"
        aria-modal="true"
        aria-labelledby="titulo-pieza"
        initial={{ y: reduce ? 0 : 48, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: reduce ? 0 : 48, opacity: 0 }}
        transition={{ duration: 0.3, ease: EASE_SALIDA }}
        onClick={(ev) => ev.stopPropagation()}
        className="tarjeta-relieve max-h-[85dvh] w-full max-w-md overflow-y-auto rounded-t-[var(--radius-card)] px-4 pt-4 pb-[max(16px,env(safe-area-inset-bottom))]"
      >
        <div className="flex items-start gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold tracking-[0.08em] text-green uppercase">Día {pieza.dia} · lista</p>
            <h2 id="titulo-pieza" className="mt-1 font-display text-xl font-extrabold text-ink-1">
              {pieza.titulo}
            </h2>
          </div>
          <button
            ref={cerrar}
            type="button"
            onClick={onCerrar}
            aria-label="Cerrar"
            className="flex size-11 shrink-0 items-center justify-center rounded-full text-ink-2 transition-colors duration-150 hover:bg-raised-2"
          >
            <X size={22} aria-hidden="true" />
          </button>
        </div>
        <p className="mt-4 font-display text-lg leading-snug font-bold text-pretty break-words text-ink-1">«{pieza.contenido}»</p>
        {pieza.detalle?.map((d) => (
          <p key={d.rotulo} className="mt-4 text-ayuda leading-snug text-ink-2">
            <strong className="font-semibold text-ink-1">{d.rotulo}:</strong> {d.valor}
          </p>
        ))}
        {pieza.base && <p className="mt-4 text-caption text-ink-3">Versión armada con tus respuestas. La IA la afina cuando se conecte.</p>}
        <button type="button" onClick={copiar} className="boton-oro mt-6 flex h-14 w-full items-center justify-center gap-2 rounded-[var(--radius-pill)] font-display text-boton font-bold">
          {copiado === 'si' ? <Check size={20} aria-hidden="true" /> : <Copy size={20} aria-hidden="true" />}
          {copiado === 'si' ? '¡Copiada!' : 'Copiar pieza'}
        </button>
        <p role="status" className={copiado === 'error' ? 'mt-2 text-center text-caption text-warning' : 'sr-only'}>
          {copiado === 'error' ? 'No se pudo copiar: mantén presionado el texto para copiarlo.' : copiado === 'si' ? 'Pieza copiada' : ''}
        </p>
      </motion.div>
    </motion.div>
  );
}
