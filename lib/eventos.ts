'use client';

// Contrato de eventos del funnel (SECUENCIA MAESTRA: se siembran junto a cada pantalla, no al final — 36/60).
// Mientras no se conecte el proveedor de analítica (Sesión 6/8), los eventos se encolan en memoria del
// navegador y, en desarrollo, se muestran en consola. Las sesiones de prueba se marcan con ?qa=1.

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

export function registrarEvento(nombre: NombreEvento, propiedades: Propiedades = {}): void {
  if (typeof window === 'undefined') return;
  const evento: EventoRegistrado = {
    nombre,
    propiedades: { ...atribucion(), ...propiedades, qa: esSesionQa() },
    en: new Date().toISOString(),
  };
  window.__empresaiEventos = [...(window.__empresaiEventos ?? []), evento];
  if (process.env.NODE_ENV === 'development') console.info('[evento]', evento.nombre, evento.propiedades);
}

export function useEventoAlMontar(nombre: NombreEvento, propiedades?: Propiedades): void {
  useEffect(() => {
    registrarEvento(nombre, propiedades);
    // Se registra una sola vez por montaje de la pantalla.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nombre]);
}
