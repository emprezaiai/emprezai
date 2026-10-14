'use client';

// Llamadas del celular a la IA (siempre por NUESTRO servidor: la clave nunca sale de ahí).
// Si la IA no está disponible (sin conexión, tope de gasto, límite), devuelven null y la misión
// sigue con la versión armada con las respuestas.

export interface OpcionIA {
  texto: string;
  porque: string;
}

async function pedir<T>(cuerpo: unknown, msMax = 25_000): Promise<T | null> {
  const control = new AbortController();
  const corte = window.setTimeout(() => control.abort(), msMax);
  try {
    const res = await fetch('/api/ia/mision', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cuerpo),
      signal: control.signal,
    });
    return res.ok ? ((await res.json()) as T) : null;
  } catch {
    // Sin conexión o tiempo agotado: se usa la versión armada con las respuestas.
    return null;
  } finally {
    window.clearTimeout(corte);
  }
}

export function pedirArmado(dia: number, respuestas: { pregunta: string; respuesta: string }[]) {
  return pedir<{ contenido: string; resumen: string; uso: string }>({ modo: 'armar', dia, respuestas });
}

const claveOpciones = (dia: number) => `empresai_ia_opciones_${dia}`;

/** Opciones del borrador del día. Se guardan en el celular: volver a la misión no vuelve a gastar. */
export async function pedirOpciones(dia: number): Promise<OpcionIA[] | null> {
  try {
    const guardadas = JSON.parse(localStorage.getItem(claveOpciones(dia)) ?? 'null') as OpcionIA[] | null;
    if (Array.isArray(guardadas) && guardadas.length) return guardadas;
  } catch {
    // Copia ilegible: se piden de nuevo.
  }
  const res = await pedir<{ opciones: OpcionIA[] }>({ modo: 'opciones', dia });
  if (!res?.opciones?.length) return null;
  try {
    localStorage.setItem(claveOpciones(dia), JSON.stringify(res.opciones));
  } catch {
    // Sin almacenamiento: se usan igual en pantalla.
  }
  return res.opciones;
}

export function olvidarOpciones(dia: number) {
  try {
    localStorage.removeItem(claveOpciones(dia));
  } catch {
    // Nada que limpiar.
  }
}
