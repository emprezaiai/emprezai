'use client';

// PERFIL (pantalla secundaria): tu recordatorio diario, tu plan, tus datos (descargar / borrar en
// 1 toque: "Tu idea es tuya"), legales y cerrar sesión. Todo lo tocable hace algo real hoy.

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Bus, ChevronRight, Download, LifeBuoy, LogOut, Moon, SunMedium, Trash2 } from 'lucide-react';
import { borrarMisDatos, cerrarSesion, guardarCuenta, estadoRuta } from '@/lib/cuenta';
import { NOMBRE_MOMENTO, type IdMomento } from '@/lib/onboarding';
import { RESPONSABLE } from '@/lib/legal';
import { TOTAL_DIAS } from '@/lib/ruta';
import { EASE_SALIDA, vibrar } from '@/components/onboarding/piezas';
import { useCuentaActiva } from './Marco';

const MOMENTOS: { id: IdMomento; texto: string; icono: typeof Moon }[] = [
  { id: 'manana', texto: 'En la mañana', icono: SunMedium },
  { id: 'mediodia', texto: 'Al mediodía', icono: Bus },
  { id: 'noche', texto: 'En la noche', icono: Moon },
];

export function Perfil() {
  const cuenta = useCuentaActiva();
  const router = useRouter();
  const reduce = useReducedMotion();
  const e = estadoRuta(cuenta);
  const [confirmarBorrado, setConfirmarBorrado] = useState(false);
  const [aviso, setAviso] = useState('');

  const entrar = (i: number) => ({
    initial: { opacity: 0, y: reduce ? 0 : 12 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.35, delay: reduce ? 0 : 0.05 + i * 0.06, ease: EASE_SALIDA },
  });

  function cambiarMomento(m: IdMomento) {
    guardarCuenta({ ...cuenta, momento: m });
    vibrar();
    setAviso(`Listo: tu misión será ${NOMBRE_MOMENTO[m]}.`);
  }

  function descargar() {
    const texto = [`EMPRESAI — ${cuenta.idea ?? 'Mi negocio'}`, '', ...cuenta.piezas.flatMap((p) => [`Día ${p.dia} · ${p.titulo}`, p.contenido, ''])].join('\n');
    const url = URL.createObjectURL(new Blob([texto], { type: 'text/plain;charset=utf-8' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mi-empresa-empresai.txt';
    a.click();
    URL.revokeObjectURL(url);
    setAviso('Descargamos todo lo que armaste.');
  }

  return (
    <main className="px-4">
      <header className="flex h-16 items-center justify-center">
        <h1 className="font-display text-lg font-extrabold text-ink-1">Perfil</h1>
      </header>

      <motion.section {...entrar(0)} className="tarjeta-relieve rounded-[var(--radius-card)] p-4">
        <p className="truncate font-display text-lg font-bold text-ink-1">{cuenta.email}</p>
        <p className="mt-1 text-sm text-ink-2">
          {e.piezasListas} de {TOTAL_DIAS} piezas · racha de {e.racha} {e.racha === 1 ? 'día' : 'días'}
        </p>
        <p className="mt-3 border-t border-[var(--line)] pt-3 text-caption text-ink-3">
          Plan elegido: {cuenta.plan === 'mensual' ? 'mensual' : 'anual'} · Vista previa: el pago y la cuenta en la nube se conectan en la próxima etapa.
        </p>
      </motion.section>

      <p role="status" aria-live="polite" className={aviso ? 'mt-4 rounded-[var(--radius-chip)] bg-raised-2 px-3 py-2 text-caption text-ink-1' : 'sr-only'}>
        {aviso}
      </p>

      <motion.section {...entrar(1)} id="recordatorio" className="mt-6 scroll-mt-4" aria-labelledby="titulo-recordatorio">
        <h2 id="titulo-recordatorio" className="font-display text-base font-bold text-ink-1">
          Tu misión diaria
        </h2>
        <p className="mt-1 text-caption text-ink-2">A esa hora te recordaremos tu misión (el aviso por correo se activa en la próxima etapa).</p>
        <div role="radiogroup" aria-label="Momento de tu misión" className="mt-3 grid grid-cols-3 gap-2">
          {MOMENTOS.map(({ id, texto, icono: Icono }) => {
            const activo = cuenta.momento === id;
            return (
              <button
                key={id}
                type="button"
                role="radio"
                aria-checked={activo}
                onClick={() => cambiarMomento(id)}
                className="opcion-recorrido flex min-h-20 flex-col items-center justify-center gap-1 px-2 py-3 text-xs font-semibold text-ink-1"
              >
                <Icono size={20} className={activo ? 'text-gold' : 'text-ink-3'} aria-hidden="true" />
                {texto}
              </button>
            );
          })}
        </div>
      </motion.section>

      <motion.section {...entrar(2)} className="mt-6" aria-labelledby="titulo-datos">
        <h2 id="titulo-datos" className="font-display text-base font-bold text-ink-1">
          Tus datos
        </h2>
        <p className="mt-1 text-caption text-ink-2">Tu idea es tuya: solo tú la ves y te la llevas cuando quieras.</p>
        <ul className="mt-3 flex flex-col gap-2">
          <FilaAccion icono={Download} texto="Descargar todo lo que armé" onClick={descargar} />
          <FilaAccion icono={Trash2} texto="Borrar mis datos" onClick={() => setConfirmarBorrado(true)} peligro />
        </ul>
      </motion.section>

      <motion.section {...entrar(3)} className="mt-6" aria-labelledby="titulo-ayuda">
        <h2 id="titulo-ayuda" className="font-display text-base font-bold text-ink-1">
          Ayuda y condiciones
        </h2>
        <ul className="mt-3 flex flex-col gap-2">
          <FilaEnlace href={`mailto:${RESPONSABLE.emailContacto}?subject=${encodeURIComponent('Ayuda con EMPRESAI')}`} icono={LifeBuoy} texto="Escribir a soporte" />
          <FilaEnlace href="/reembolsos" texto="Cómo cancelar o pedir reembolso" />
          <FilaEnlace href="/terminos" texto="Términos" />
          <FilaEnlace href="/privacidad" texto="Privacidad" />
          <FilaEnlace href="/aviso-ia" texto="Cómo usamos la IA" />
        </ul>
      </motion.section>

      <motion.div {...entrar(4)} className="mt-6">
        <button
          type="button"
          onClick={() => {
            cerrarSesion();
            router.replace('/login');
          }}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-[var(--radius-pill)] border border-[var(--line)] bg-raised text-sm font-semibold text-ink-1"
        >
          <LogOut size={18} aria-hidden="true" />
          Cerrar sesión
        </button>
      </motion.div>

      <AnimatePresence>
        {confirmarBorrado && (
          <ConfirmarBorrado
            onCancelar={() => setConfirmarBorrado(false)}
            onBorrar={() => {
              borrarMisDatos();
              router.replace('/');
            }}
          />
        )}
      </AnimatePresence>
    </main>
  );
}

function FilaAccion({ icono: Icono, texto, onClick, peligro = false }: { icono: typeof Moon; texto: string; onClick: () => void; peligro?: boolean }) {
  return (
    <li>
      <button type="button" onClick={onClick} className="fila-pildora flex min-h-12 w-full items-center gap-3 py-2 pr-4 pl-4 text-left text-sm font-semibold transition-transform duration-150 active:scale-[0.99]">
        <Icono size={18} className={peligro ? 'text-danger' : 'text-ink-3'} aria-hidden="true" />
        <span className={`flex-1 ${peligro ? 'text-danger' : 'text-ink-1'}`}>{texto}</span>
        <ChevronRight size={18} className="text-ink-3" aria-hidden="true" />
      </button>
    </li>
  );
}

function FilaEnlace({ href, texto, icono: Icono }: { href: string; texto: string; icono?: typeof Moon }) {
  const contenido = (
    <>
      {Icono && <Icono size={18} className="text-ink-3" aria-hidden="true" />}
      <span className="flex-1 text-ink-1">{texto}</span>
      <ChevronRight size={18} className="text-ink-3" aria-hidden="true" />
    </>
  );
  const clases = 'fila-pildora flex min-h-12 w-full items-center gap-3 py-2 pr-4 pl-4 text-sm font-semibold transition-transform duration-150 active:scale-[0.99]';
  return <li>{href.startsWith('mailto:') ? <a href={href} className={clases}>{contenido}</a> : <Link href={href} className={clases}>{contenido}</Link>}</li>;
}

/* Borrar es IRREVERSIBLE: se confirma (regla UX 8), sin culpa ni presión. */
function ConfirmarBorrado({ onCancelar, onBorrar }: { onCancelar: () => void; onBorrar: () => void }) {
  const reduce = useReducedMotion();
  const cancelar = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    cancelar.current?.focus();
    const tecla = (ev: KeyboardEvent) => ev.key === 'Escape' && onCancelar();
    window.addEventListener('keydown', tecla);
    return () => window.removeEventListener('keydown', tecla);
  }, [onCancelar]);
  return (
    <motion.div className="velo-oscuro fixed inset-0 z-30 flex items-end justify-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onCancelar}>
      <motion.div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="titulo-borrar"
        aria-describedby="texto-borrar"
        initial={{ y: reduce ? 0 : 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: reduce ? 0 : 40, opacity: 0 }}
        transition={{ duration: 0.3, ease: EASE_SALIDA }}
        onClick={(ev) => ev.stopPropagation()}
        className="tarjeta-relieve w-full max-w-md rounded-t-[var(--radius-card)] px-4 pt-6 pb-[max(16px,env(safe-area-inset-bottom))]"
      >
        <h2 id="titulo-borrar" className="font-display text-xl font-bold text-ink-1">
          ¿Borrar todo lo que armaste?
        </h2>
        <p id="texto-borrar" className="mt-2 text-ayuda text-ink-2">
          Se borran tus piezas, tu racha y tus respuestas de este celular. No se puede deshacer. Si quieres guardarlas, descárgalas antes.
        </p>
        <button type="button" onClick={onBorrar} className="mt-6 flex h-12 w-full items-center justify-center rounded-[var(--radius-pill)] bg-danger font-display text-base font-bold text-[var(--surface-base)]">
          Sí, borrar todo
        </button>
        <button ref={cancelar} type="button" onClick={onCancelar} className="mt-2 flex h-12 w-full items-center justify-center rounded-[var(--radius-pill)] text-sm font-semibold text-ink-1">
          No, conservar mis datos
        </button>
      </motion.div>
    </motion.div>
  );
}
