'use client';

// Sincronización celular ↔ servidor (con acceso real). El servidor es la fuente de verdad; el
// celular guarda una copia para abrir al instante y funcionar sin conexión. Cada pieza guardada
// entra a una cola (persistente) que se sube en cuanto hay conexión; si falla, se reintenta.

import { escucharPiezas, guardarCuenta, leerCuentaActual, type Cuenta, type PiezaGuardada } from './cuenta';
import { leerEstado as leerOnboarding, type Respuestas } from './onboarding';

const CLAVE_COLA = 'empresai_pendientes';

interface PiezaServidor {
  dia: number;
  titulo: string;
  contenido: string;
  resumen: string | null;
  detalle: { rotulo: string; valor: string }[] | null;
  fecha: string;
  creada_en: string;
  base: boolean;
  con_ia: boolean;
  editada_en: string | null;
  original: { contenido: string; resumen?: string } | null;
  tu_version: string | null;
}

interface PerfilServidor {
  email: string;
  plan: 'mensual' | 'anual' | null;
  idea: string | null;
  area: Cuenta['area'] | null;
  momento: Cuenta['momento'] | null;
  respuestas: Respuestas | null;
  created_at: string;
}

function leerCola(): number[] {
  try {
    const crudo = JSON.parse(localStorage.getItem(CLAVE_COLA) ?? '[]');
    return Array.isArray(crudo) ? crudo.filter((d) => Number.isInteger(d)) : [];
  } catch {
    return [];
  }
}

function escribirCola(dias: number[]) {
  try {
    localStorage.setItem(CLAVE_COLA, JSON.stringify([...new Set(dias)]));
  } catch {
    // Sin almacenamiento: la pieza se sube en este mismo intento o en la próxima carga.
  }
}

const aServidor = (p: PiezaGuardada) => ({
  dia: p.dia,
  titulo: p.titulo,
  contenido: p.contenido,
  resumen: p.resumen,
  detalle: p.detalle,
  fecha: p.fecha,
  creadaEn: new Date(p.creadaEn).toISOString(),
  base: p.base,
  conIA: p.conIA,
  editadaEn: p.editadaEn,
  original: p.original,
  tuVersion: p.tuVersion,
});

const desdeServidor = (p: PiezaServidor): PiezaGuardada => ({
  dia: p.dia,
  titulo: p.titulo,
  contenido: p.contenido,
  resumen: p.resumen ?? undefined,
  detalle: p.detalle ?? undefined,
  fecha: p.fecha,
  creadaEn: p.creada_en,
  base: p.base,
  conIA: p.con_ia,
  editadaEn: p.editada_en ?? undefined,
  original: p.original ?? undefined,
  tuVersion: p.tu_version ?? undefined,
});

let subiendo = false;

/** Sube las piezas pendientes. Se detiene si no hay sesión o acceso (no insiste en vano). */
export async function subirPendientes(): Promise<void> {
  if (subiendo || !navigator.onLine) return;
  subiendo = true;
  try {
    for (const dia of leerCola()) {
      const pieza = leerCuentaActual()?.piezas.find((p) => p.dia === dia);
      if (!pieza) {
        escribirCola(leerCola().filter((d) => d !== dia));
        continue;
      }
      const res = await fetch('/api/piezas', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(aServidor(pieza)) });
      if (res.ok || res.status === 400) escribirCola(leerCola().filter((d) => d !== dia));
      else break; // 401/403/5xx: se reintenta luego, sin perder la pieza local
    }
  } catch {
    // Sin conexión a mitad de camino: la cola queda intacta y se reintenta al volver la conexión.
  } finally {
    subiendo = false;
  }
}

/** Activa la sincronización: cada pieza guardada se encola y se sube. Devuelve cómo apagarla. */
export function activarSincronizacion(): () => void {
  escucharPiezas((dia) => {
    escribirCola([...leerCola(), dia]);
    void subirPendientes();
  });
  const alVolver = () => void subirPendientes();
  window.addEventListener('online', alVolver);
  void subirPendientes();
  return () => {
    escucharPiezas(null);
    window.removeEventListener('online', alVolver);
  };
}

export type ResultadoCarga = 'ok' | 'sin-sesion' | 'sin-acceso' | 'error';

/**
 * Trae la cuenta del servidor y la deja en el celular. Lo que el celular tenga pendiente de subir
 * (guardado sin conexión) se respeta y se sube. Si el servidor no tiene aún las respuestas del
 * recorrido pero este celular sí (primera entrada tras comprar), se completan y se guardan.
 */
export async function cargarDelServidor(): Promise<ResultadoCarga> {
  let res: Response;
  try {
    res = await fetch('/api/cuenta', { cache: 'no-store' });
  } catch {
    return 'error';
  }
  if (res.status === 401) return 'sin-sesion';
  if (res.status === 403) return 'sin-acceso';
  if (!res.ok) return 'error';
  const { perfil, piezas } = (await res.json()) as { perfil: PerfilServidor; piezas: PiezaServidor[] };

  const local = leerCuentaActual();
  const mismaPersona = local?.email.toLowerCase() === perfil.email.toLowerCase();
  const pendientes = new Set(mismaPersona ? leerCola() : []);
  if (!mismaPersona) escribirCola([]);

  const delServidor = new Map(piezas.map((p) => [p.dia, desdeServidor(p)]));
  for (const p of mismaPersona ? (local?.piezas ?? []) : []) {
    // Lo guardado aquí sin conexión gana para esos días, y se sube.
    if (pendientes.has(p.dia) || !delServidor.has(p.dia)) {
      delServidor.set(p.dia, p);
      pendientes.add(p.dia);
    }
  }

  const onboarding = leerOnboarding();
  const r = perfil.respuestas && Object.keys(perfil.respuestas).length ? perfil.respuestas : (onboarding?.respuestas ?? {});
  const cuenta: Cuenta = {
    v: 1,
    email: perfil.email,
    creadaEn: perfil.created_at,
    plan: perfil.plan ?? onboarding?.plan,
    area: perfil.area ?? r.areaFinal,
    idea: perfil.idea ?? r.idea,
    momento: perfil.momento ?? r.momento,
    respuestas: r,
    piezas: [...delServidor.values()].sort((a, b) => a.dia - b.dia),
  };
  guardarCuenta(cuenta);
  escribirCola([...pendientes]);

  // Primera entrada: el servidor aún no tiene lo que respondió en el recorrido → se guarda.
  if (!perfil.idea && cuenta.idea) {
    void fetch('/api/cuenta', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idea: cuenta.idea, area: cuenta.area, momento: cuenta.momento, respuestas: r }),
    }).catch(() => undefined);
  }
  void subirPendientes();
  return 'ok';
}

/** Guarda en el servidor el momento del recordatorio (Perfil). */
export async function guardarMomentoEnServidor(momento: Cuenta['momento']): Promise<boolean> {
  try {
    const res = await fetch('/api/cuenta', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ momento }) });
    return res.ok;
  } catch {
    return false;
  }
}

/** Cierra la sesión en el servidor (y luego quien llama limpia el celular). */
export async function salirDelServidor(): Promise<void> {
  try {
    await fetch('/api/acceso/salir', { method: 'POST' });
  } finally {
    escribirCola([]);
  }
}

/** "Borrar mis datos": en el servidor primero; solo si se pudo, se limpia el celular. */
export async function borrarEnServidor(): Promise<boolean> {
  try {
    const res = await fetch('/api/cuenta', { method: 'DELETE' });
    if (res.ok) escribirCola([]);
    return res.ok;
  } catch {
    return false;
  }
}
