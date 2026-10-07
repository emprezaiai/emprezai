'use client';

// La cuenta del usuario y su progreso en la ruta.
// HOY (antes de la Sesión 6) vive en localStorage del celular; en la Sesión 6 pasa a Supabase
// (tablas profiles / pieces / user_progress de ESTADO.md) con la sesión real del enlace de acceso.
// Las reglas de la ruta (una misión por día, racha, día actual) viven aquí y se reusan en servidor.

import { useMemo, useSyncExternalStore } from 'react';
import { leerEstado as leerOnboarding, type IdArea, type IdMomento, type Plan, type Respuestas } from './onboarding';
import { TOTAL_DIAS } from './ruta';

export interface DetallePieza {
  rotulo: string;
  valor: string;
}

export interface PiezaGuardada {
  dia: number;
  titulo: string;
  contenido: string;
  /** Resumen corto y completo (≤60 caracteres) para el mosaico de Mi Empresa. */
  resumen?: string;
  detalle?: DetallePieza[];
  /** Día calendario local en que se completó (YYYY-MM-DD): de aquí sale la racha. */
  fecha: string;
  creadaEn: string;
  /** Versión base (sin IA o de respaldo): se puede rehacer. */
  base?: boolean;
  /** La persona la ajustó con sus palabras desde Mi Empresa. */
  editadaEn?: string;
  /** Texto y resumen de la versión base, guardados la primera vez que se edita (para volver a ella). */
  original?: { contenido: string; resumen?: string };
}

export interface Cuenta {
  v: 1;
  email: string;
  creadaEn: string;
  plan?: Plan;
  area?: IdArea;
  idea?: string;
  momento?: IdMomento;
  respuestas: Respuestas;
  piezas: PiezaGuardada[];
}

const CLAVE = 'empresai_cuenta';
const CLAVE_DEMO = 'empresai_demo';
const EVENTO = 'empresai-cuenta';

/* ── Fechas locales (la racha se cuenta por día del celular, no por UTC) ── */

export function fechaLocal(d: Date = new Date()): string {
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const dia = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${m}-${dia}`;
}

function sumarDias(fecha: string, dias: number): string {
  const [a, m, d] = fecha.split('-').map(Number);
  return fechaLocal(new Date(a, m - 1, d + dias));
}

/* ── Lectura / escritura ── */

function esDemo(): boolean {
  try {
    return sessionStorage.getItem(CLAVE_DEMO) === '1';
  } catch {
    return false;
  }
}

function leerCrudo(): string | null {
  try {
    return esDemo() ? sessionStorage.getItem(`${CLAVE}_demo`) : localStorage.getItem(CLAVE);
  } catch {
    return null;
  }
}

/** Guarda la cuenta. Devuelve false si el celular no dejó guardar (quien llama debe avisarlo). */
export function guardarCuenta(cuenta: Cuenta): boolean {
  let ok = true;
  try {
    const crudo = JSON.stringify(cuenta);
    if (esDemo()) sessionStorage.setItem(`${CLAVE}_demo`, crudo);
    else localStorage.setItem(CLAVE, crudo);
  } catch {
    ok = false;
  }
  window.dispatchEvent(new Event(EVENTO));
  return ok;
}

export function cerrarSesion(): void {
  try {
    if (esDemo()) {
      sessionStorage.removeItem(`${CLAVE}_demo`);
      sessionStorage.removeItem(CLAVE_DEMO);
    } else {
      localStorage.removeItem(CLAVE);
    }
  } catch {
    // Nada que limpiar.
  }
  window.dispatchEvent(new Event(EVENTO));
}

/** Borra la cuenta y lo armado en el recorrido (promesa "Tu idea es tuya": se borra en 1 toque). */
export function borrarMisDatos(): void {
  try {
    localStorage.removeItem('empresai_onboarding');
  } catch {
    // Nada que limpiar.
  }
  cerrarSesion();
}

function parsear(crudo: string | null): Cuenta | null {
  if (!crudo) return null;
  try {
    const c = JSON.parse(crudo) as Cuenta;
    return c?.v === 1 && Array.isArray(c.piezas) ? c : null;
  } catch {
    return null;
  }
}

function suscribir(aviso: () => void): () => void {
  window.addEventListener(EVENTO, aviso);
  window.addEventListener('storage', aviso);
  return () => {
    window.removeEventListener(EVENTO, aviso);
    window.removeEventListener('storage', aviso);
  };
}

/**
 * La cuenta actual. `undefined` mientras se hidrata (servidor), `null` si no hay sesión.
 * Se suscribe a los cambios, así todas las pantallas se actualizan al guardar una pieza.
 */
export function useCuenta(): Cuenta | null | undefined {
  const crudo = useSyncExternalStore(
    suscribir,
    () => leerCrudo() ?? '',
    () => undefined,
  );
  return useMemo(() => (crudo === undefined ? undefined : parsear(crudo)), [crudo]);
}

/* ── Crear la cuenta al entrar: migra lo armado en el recorrido de inicio ── */

/** Crea la cuenta en este celular. Devuelve null si el celular no dejó guardar. */
export function crearCuenta(email: string): Cuenta | null {
  const onboarding = leerOnboarding();
  const r = onboarding?.respuestas ?? {};
  const p = onboarding?.primeraPieza;
  const piezas: PiezaGuardada[] = p
    ? [
        {
          dia: 1,
          titulo: 'Tu frase de negocio',
          contenido: p.frase,
          resumen: r.cliente && r.resultado ? `Ayudo a ${r.cliente} a ${r.resultado}` : undefined,
          detalle: [{ rotulo: 'Tu prueba de hoy', valor: p.prueba }],
          fecha: fechaLocal(new Date(p.creadaEn)),
          creadaEn: p.creadaEn,
          base: true,
        },
      ]
    : [];
  const cuenta: Cuenta = {
    v: 1,
    email,
    creadaEn: new Date().toISOString(),
    plan: onboarding?.plan,
    area: r.areaFinal,
    idea: r.idea,
    momento: r.momento,
    respuestas: r,
    piezas,
  };
  return guardarCuenta(cuenta) ? cuenta : null;
}

/* ── Reglas de la ruta ── */

export interface EstadoRuta {
  /** El día de la ruta que toca ahora (siguiente pieza por armar). */
  diaActual: number;
  /** Ya armó la pieza de hoy: la siguiente se abre mañana. */
  hechaHoy: boolean;
  racha: number;
  /** La racha sigue viva pero hoy aún no hay pieza (estado M4: llama apagada). */
  rachaEnRiesgo: boolean;
  piezasListas: number;
  minutos: number;
  terminada: boolean;
}

export function estadoRuta(cuenta: Cuenta, hoy: string = fechaLocal()): EstadoRuta {
  const fechas = new Set(cuenta.piezas.map((p) => p.fecha));
  const hechaHoy = fechas.has(hoy);
  let racha = 0;
  let cursor = hechaHoy ? hoy : sumarDias(hoy, -1);
  while (fechas.has(cursor)) {
    racha += 1;
    cursor = sumarDias(cursor, -1);
  }
  const piezasListas = cuenta.piezas.length;
  return {
    diaActual: Math.min(piezasListas + 1, TOTAL_DIAS),
    hechaHoy,
    racha,
    rachaEnRiesgo: !hechaHoy && racha > 0,
    piezasListas,
    minutos: piezasListas * 5,
    terminada: piezasListas >= TOTAL_DIAS,
  };
}

/** Guarda una pieza. Devuelve null si no se pudo guardar en este celular. */
export function guardarPieza(cuenta: Cuenta, pieza: Omit<PiezaGuardada, 'fecha' | 'creadaEn'>): Cuenta | null {
  const ahora = new Date();
  const nueva: PiezaGuardada = { ...pieza, fecha: fechaLocal(ahora), creadaEn: ahora.toISOString() };
  const piezas = [...cuenta.piezas.filter((p) => p.dia !== pieza.dia), nueva].sort((a, b) => a.dia - b.dia);
  const actualizada = { ...cuenta, piezas };
  return guardarCuenta(actualizada) ? actualizada : null;
}

/** Cambia el texto de una pieza ya guardada. Conserva su fecha (la racha no se mueve).
 *  Devuelve null si no se pudo guardar en este celular. */
export function editarPieza(cuenta: Cuenta, dia: number, contenido: string): Cuenta | null {
  const texto = contenido.trim();
  if (!texto) return null;
  const actual = cuenta.piezas.find((p) => p.dia === dia);
  if (!actual) return null;
  if (texto === actual.contenido) return cuenta; // sin cambios: no se toca la pieza
  const piezas = cuenta.piezas.map((p) =>
    p.dia === dia
      ? {
          ...p,
          contenido: texto,
          resumen: undefined,
          base: false,
          editadaEn: new Date().toISOString(),
          original: p.original ?? { contenido: p.contenido, resumen: p.resumen },
        }
      : p,
  );
  const actualizada = { ...cuenta, piezas };
  return guardarCuenta(actualizada) ? actualizada : null;
}

/** Vuelve a la versión base de una pieza editada. Devuelve null si no se pudo guardar. */
export function restaurarPieza(cuenta: Cuenta, dia: number): Cuenta | null {
  const piezas = cuenta.piezas.map((p) => {
    if (p.dia !== dia || !p.original) return p;
    const { original, editadaEn: _editada, ...resto } = p;
    void _editada;
    return { ...resto, contenido: original.contenido, resumen: original.resumen, base: true };
  });
  const actualizada = { ...cuenta, piezas };
  return guardarCuenta(actualizada) ? actualizada : null;
}

/* ── Datos de EJEMPLO (Carlos, día 8) para capturas y demos: nunca se mezclan con la cuenta real ── */

export function activarDemo(): void {
  try {
    sessionStorage.setItem(CLAVE_DEMO, '1');
  } catch {
    return;
  }
  const hoy = fechaLocal();
  const contenidos: [string, string, string][] = [
    ['Tu frase de negocio', 'Mini curso de Excel: ayudo a dueños de negocio a usarlo paso a paso en su día a día sin cursos eternos de pura teoría.', 'Excel paso a paso para dueños de negocio'],
    ['Tu cliente ideal', 'Dueños de negocio de 35 a 50 años que llevan todo en papel. Les quita el sueño no saber cuánto ganan. Están en Facebook y WhatsApp.', 'Dueños de 35 a 50 que llevan todo en papel'],
    ['Tu oferta', 'Mini curso de 7 días para dominar Excel en tu negocio, sin fórmulas raras: 7 videos cortos y una plantilla lista para usar.', 'Curso de 7 días + plantilla lista'],
    ['Tu precio', '$19 pago único de lanzamiento. Sube a $29 después de los primeros 10 alumnos.', '$19 de lanzamiento, luego $29'],
    ['Tu competencia', '3 cursos analizados: todos duran más de 10 horas y enseñan Excel general. Tu hueco: solo lo que un dueño de negocio usa, en 7 días.', 'Ellos: +10 horas. Tú: 7 días al grano'],
    ['Tus preguntas de validación', '1) ¿Cómo llevas hoy tus ventas y gastos? 2) ¿Qué es lo más difícil de eso? 3) ¿Pagarías por resolverlo en Excel en una semana?', '3 preguntas para hablar con dueños reales'],
    ['Tu idea en 1 página', 'Excel para dueños de negocio en 7 días · para quien lleva todo en papel · $19 de lanzamiento · validado en 3 conversaciones.', 'Excel en 7 días · $19 · validado'],
  ];
  const piezas: PiezaGuardada[] = contenidos.map(([titulo, contenido, resumen], i) => {
    const fecha = sumarDias(hoy, i - contenidos.length);
    return { dia: i + 1, titulo, contenido, resumen, fecha, creadaEn: `${fecha}T19:${String(10 + i).padStart(2, '0')}:00` };
  });
  const demo: Cuenta = {
    v: 1,
    email: 'carlos@ejemplo.com',
    creadaEn: `${piezas[0].fecha}T19:00:00`,
    plan: 'anual',
    area: 'cursos',
    idea: 'Mini curso de Excel para dueños de negocio',
    momento: 'noche',
    respuestas: { punto: 'idea', freno: 'blanco', area: 'cursos', areaFinal: 'cursos', idea: 'Mini curso de Excel para dueños de negocio', momento: 'noche' },
    piezas,
  };
  sessionStorage.setItem(`${CLAVE}_demo`, JSON.stringify(demo));
  window.dispatchEvent(new Event(EVENTO));
}

/** ¿Hay una pieza 1 del recorrido que todavía no llegó a la cuenta? */
export function pieza1PorTraer(cuenta: Cuenta): boolean {
  return !cuenta.piezas.some((p) => p.dia === 1) && Boolean(leerOnboarding()?.primeraPieza);
}

/** Si armó la pieza 1 en el recorrido DESPUÉS de crear la cuenta, la trae a Mi Empresa.
 *  Devuelve false solo si había pieza que traer y no se pudo guardar (celular sin espacio). */
export function importarPieza1SiFalta(cuenta: Cuenta): boolean {
  if (cuenta.piezas.some((p) => p.dia === 1)) return true;
  const o = leerOnboarding();
  const p = o?.primeraPieza;
  if (!p) return true;
  const r = o?.respuestas ?? {};
  return guardarCuenta({
    ...cuenta,
    piezas: [
      {
        dia: 1,
        titulo: 'Tu frase de negocio',
        contenido: p.frase,
        resumen: r.cliente && r.resultado ? `Ayudo a ${r.cliente} a ${r.resultado}` : undefined,
        detalle: [{ rotulo: 'Tu prueba de hoy', valor: p.prueba }],
        fecha: fechaLocal(new Date(p.creadaEn)),
        creadaEn: p.creadaEn,
        base: true,
      },
      ...cuenta.piezas,
    ],
  });
}
