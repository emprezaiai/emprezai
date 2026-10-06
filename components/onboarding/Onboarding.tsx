'use client';

// Recorrido de inicio (anónimo, modelo 2): diagnóstico → reconocimiento → idea → momento →
// etiqueta → MISIÓN 1 (ejercicio por área) → armando → PIEZA 1 → pantalla de planes.
// El estado se guarda en cada paso (localStorage versionado) y se retoma al volver.

import { useEffect, useState, useSyncExternalStore } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import {
  PREGUNTA_AREA,
  PREGUNTA_AYUDA,
  PREGUNTA_FRENO,
  PREGUNTA_MOMENTO,
  PREGUNTA_PUNTO,
  guardarEstado,
  leerEstado,
  progreso,
  secuencia,
  type EstadoOnboarding,
  type IdPaso,
  type Plan,
  type PrimeraPieza,
  type Respuestas,
} from '@/lib/onboarding';
import { registrarEvento } from '@/lib/eventos';
import { LogoEmpresai } from '@/components/app/LogoEmpresai';
import { Encabezado, PromesaRecorrido } from './piezas';
import { PasoPregunta } from './PasoPregunta';
import { PasoReconocimiento } from './PasoReconocimiento';
import { PasoIdea } from './PasoIdea';
import { PasoEtiqueta } from './PasoEtiqueta';
import { PasoEjercicio } from './PasoEjercicio';
import { PasoArmando } from './PasoArmando';
import { PasoPieza } from './PasoPieza';

const suscribirNada = () => () => {};

/** true solo en el navegador ya hidratado (evita leer localStorage en el servidor). */
function useHidratado(): boolean {
  return useSyncExternalStore(
    suscribirNada,
    () => true,
    () => false,
  );
}

export function Onboarding({ planInicial }: { planInicial?: Plan }) {
  const hidratado = useHidratado();
  if (!hidratado) return <EsqueletoRecorrido />;
  return <Flujo planInicial={planInicial} />;
}

function estadoInicial(planInicial?: Plan): EstadoOnboarding {
  const guardado = leerEstado();
  const base: EstadoOnboarding = guardado ?? { v: 1, paso: 'punto', respuestas: {} };
  return { ...base, plan: planInicial ?? base.plan };
}

function Flujo({ planInicial }: { planInicial?: Plan }) {
  const router = useRouter();
  const reduce = useReducedMotion();
  const [estado, setEstado] = useState<EstadoOnboarding>(() => estadoInicial(planInicial));
  const [direccion, setDireccion] = useState<1 | -1>(1);
  const { paso, respuestas } = estado;

  useEffect(() => {
    if (!leerEstado()) registrarEvento('onboarding_iniciado', { plan: planInicial ?? 'ninguno' });
    // Solo al montar por primera vez.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    guardarEstado(estado);
  }, [estado]);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [paso]);

  function irA(siguiente: IdPaso, cambios: Partial<EstadoOnboarding> = {}, dir: 1 | -1 = 1) {
    setDireccion(dir);
    setEstado((e) => ({ ...e, ...cambios, paso: siguiente }));
  }

  function avanzar(nuevas: Respuestas, extra: Partial<EstadoOnboarding> = {}) {
    registrarEvento('onboarding_paso_completado', { paso });
    const pasos = secuencia(nuevas);
    irA(pasos[pasos.indexOf(paso) + 1], { respuestas: nuevas, ...extra });
  }

  function atras() {
    const pasos = secuencia(respuestas);
    const i = pasos.indexOf(paso);
    if (i <= 0) {
      router.push('/');
      return;
    }
    irA(pasos[i - 1], {}, -1);
  }

  function responderArea(area: NonNullable<Respuestas['area']>) {
    // "No lo sé" de nuevo conserva lo que ya eligió en la pregunta de ayuda.
    const areaFinal = area === 'nose' ? (respuestas.area === 'nose' ? respuestas.areaFinal : undefined) : area;
    avanzar(conAreaFinal({ ...respuestas, area }, areaFinal));
  }

  // Si cambia el área efectiva, el ejercicio anterior ya no aplica: se vacía.
  function conAreaFinal(r: Respuestas, areaFinal: Respuestas['areaFinal']): Respuestas {
    if (areaFinal === r.areaFinal) return r;
    return { ...r, areaFinal, cliente: undefined, resultado: undefined, dolor: undefined };
  }

  const conBarra = paso !== 'armando' && paso !== 'pieza';

  let contenido: React.ReactNode = null;
  switch (paso) {
    case 'punto':
      contenido = (
        <PasoPregunta
          pregunta={PREGUNTA_PUNTO}
          valor={respuestas.punto}
          onResponder={(punto) => avanzar({ ...respuestas, punto })}
          pie={<PromesaRecorrido />}
        />
      );
      break;
    case 'freno':
      contenido = (
        <PasoPregunta pregunta={PREGUNTA_FRENO} valor={respuestas.freno} onResponder={(freno) => avanzar({ ...respuestas, freno })} />
      );
      break;
    case 'reconocimiento':
      contenido = <PasoReconocimiento freno={respuestas.freno ?? 'blanco'} onSeguir={() => avanzar(respuestas)} />;
      break;
    case 'area':
      contenido = <PasoPregunta pregunta={PREGUNTA_AREA} valor={respuestas.area} onResponder={responderArea} />;
      break;
    case 'ayuda':
      contenido = (
        <PasoPregunta
          pregunta={PREGUNTA_AYUDA}
          valor={respuestas.areaFinal}
          onResponder={(areaFinal) => avanzar(conAreaFinal(respuestas, areaFinal))}
        />
      );
      break;
    case 'idea':
      contenido = (
        <PasoIdea
          area={respuestas.areaFinal ?? 'servicios'}
          punto={respuestas.punto}
          areaElegidaPorAyuda={respuestas.area === 'nose'}
          valor={respuestas.idea}
          onSeguir={(idea) => avanzar({ ...respuestas, idea })}
        />
      );
      break;
    case 'momento':
      contenido = (
        <PasoPregunta pregunta={PREGUNTA_MOMENTO} valor={respuestas.momento} onResponder={(momento) => avanzar({ ...respuestas, momento })} />
      );
      break;
    case 'etiqueta':
      contenido = (
        <PasoEtiqueta
          area={respuestas.areaFinal ?? 'servicios'}
          idea={respuestas.idea ?? ''}
          momento={respuestas.momento ?? 'noche'}
          onSeguir={() => avanzar(respuestas)}
        />
      );
      break;
    case 'ejercicio':
      contenido = (
        <PasoEjercicio
          area={respuestas.areaFinal ?? 'servicios'}
          inicial={{ cliente: respuestas.cliente, resultado: respuestas.resultado, dolor: respuestas.dolor }}
          onTerminar={(valores) => avanzar({ ...respuestas, ...valores })}
        />
      );
      break;
    case 'armando':
      contenido = (
        <PasoArmando
          respuestas={respuestas}
          onListo={(primeraPieza: PrimeraPieza) => {
            registrarEvento('resultado_visto', { area: respuestas.areaFinal ?? 'ninguna' });
            irA('pieza', { primeraPieza });
          }}
        />
      );
      break;
    case 'pieza':
      contenido = estado.primeraPieza ? (
        <PasoPieza
          pieza={estado.primeraPieza}
          onEditar={() => irA('ejercicio', {}, -1)}
          onSeguir={() => router.push(estado.plan ? `/paywall?plan=${estado.plan}` : '/paywall')}
        />
      ) : (
        <PasoArmando respuestas={respuestas} onListo={(primeraPieza) => irA('pieza', { primeraPieza })} />
      );
      break;
  }

  return (
    <main className="fondo-recorrido min-h-dvh">
      <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col">
        {conBarra ? (
          <Encabezado progreso={progreso(paso, respuestas)} onAtras={atras} />
        ) : (
          <header className="flex h-14 items-center justify-center gap-2">
            <LogoEmpresai tamano={24} />
            <span className="font-display text-base font-extrabold tracking-[-0.01em] text-ink-1">EMPRESAI</span>
          </header>
        )}
        <AnimatePresence mode="wait" initial={false} custom={direccion}>
          <motion.div
            key={paso}
            custom={direccion}
            initial={{ opacity: 0, x: reduce ? 0 : 40 * direccion }}
            animate={{ opacity: 1, x: 0, transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] } }}
            exit={{ opacity: 0, x: reduce ? 0 : -24 * direccion, transition: { duration: 0.2, ease: 'easeIn' } }}
            className="flex flex-1 flex-col"
          >
            {contenido}
          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  );
}

/* Esqueleto con la forma de una pregunta (nunca spinner genérico). */
function EsqueletoRecorrido() {
  return (
    <main className="fondo-recorrido min-h-dvh" aria-busy="true" aria-label="Cargando tu recorrido">
      <div className="mx-auto flex w-full max-w-md flex-col px-4">
        <div className="flex h-14 items-center gap-4 pl-12">
          <div className="h-0.75 flex-1 rounded-full bg-raised" />
        </div>
        <div className="mt-6 h-8 w-3/4 animate-pulse rounded-[var(--radius-chip)] bg-raised" />
        <div className="mt-2 h-4 w-1/2 animate-pulse rounded-[var(--radius-chip)] bg-raised" />
        <div className="mt-8 flex flex-col gap-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-16 animate-pulse rounded-[var(--radius-card)] bg-raised" />
          ))}
        </div>
      </div>
    </main>
  );
}
