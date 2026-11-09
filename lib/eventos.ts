'use client';

// Contrato de eventos del funnel (SECUENCIA MAESTRA: se siembran junto a cada pantalla, no al final — 36/60).
// Cada evento viaja a NUESTRO servidor (/api/eventos → event_log, la fuente del panel de la dueña) con
// el mismo id anónimo que acompaña la compra en Hotmart (src), así el camino de venta se une con el
// pago. Las sesiones de prueba se marcan con ?qa=1 y el panel las excluye.

import { useEffect } from 'react';

export type NombreEvento =
  | 'landing_vista'
  | 'onboarding_iniciado'
  | 'onboarding_paso_completado'
  | 'resultado_visto'
  | 'paywall_visto'
  | 'checkout_iniciado';

type Propiedades = Record<string, string | number | boolean>;

interface EventoRegistrado {
  nombre: NombreEvento;
  propiedades: Propiedades;
  en: string;
}

declare global {
  interface Window {
    __empresaiEventos?: EventoRegistrado[];
  }
}

const CLAVE_QA = 'empresai_qa';

function esSesionQa(): boolean {
  try {
    const params = new URLSearchParams(window.location.search);
    if (params.get('qa') === '1') sessionStorage.setItem(CLAVE_QA, '1');
    return sessionStorage.getItem(CLAVE_QA) === '1';
  } catch {
    return false;
  }
}

function atribucion(): Propiedades {
  const params = new URLSearchParams(window.location.search);
  const props: Propiedades = {};
  for (const clave of ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'sck']) {
    const valor = params.get(clave);
    if (valor) props[clave] = valor.slice(0, 120);
  }
  return props;
}

// El MISMO id que la pantalla de planes manda a Hotmart como src (Paywall.tsx, misma clave).
function idAnonimo(): string | undefined {
  try {
    const previo = localStorage.getItem('empresai_anon');
    if (previo) return previo;
    const nuevo = crypto.randomUUID();
    localStorage.setItem('empresai_anon', nuevo);
    return nuevo;
  } catch {
    return undefined;
  }
}

function enviar(evento: EventoRegistrado) {
  const { qa, ...propiedades } = evento.propiedades;
  try {
    void fetch('/api/eventos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre: evento.nombre, anonId: idAnonimo(), propiedades, qa: qa === true }),
      keepalive: true,
    }).catch(() => {
      // Sin conexión: el evento se pierde (no bloquea nada de la persona).
    });
  } catch {
    // Navegador sin fetch: nada que hacer.
  }
}

export function registrarEvento(nombre: NombreEvento, propiedades: Propiedades = {}): void {
  if (typeof window === 'undefined') return;
  const evento: EventoRegistrado = {
    nombre,
    propiedades: { ...atribucion(), ...propiedades, qa: esSesionQa() },
    en: new Date().toISOString(),
  };
  window.__empresaiEventos = [...(window.__empresaiEventos ?? []), evento];
  if (process.env.NODE_ENV === 'development') console.info('[evento]', evento.nombre, evento.propiedades);
  enviar(evento);
}

export function useEventoAlMontar(nombre: NombreEvento, propiedades?: Propiedades): void {
  useEffect(() => {
    registrarEvento(nombre, propiedades);
    // Se registra una sola vez por montaje de la pantalla.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nombre]);
}
