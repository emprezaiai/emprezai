// Borradores de la misión del día: viven en este celular hasta guardar la pieza.
// Texto libre (días 5-30) y respuestas de la misión guiada (días 2-4).

export const claveBorradorTexto = (dia: number) => `empresai_borrador_${dia}`;
export const claveBorradorGuiado = (dia: number) => `empresai_mision_${dia}`;

export function leerBorrador(clave: string): string | null {
  try {
    return localStorage.getItem(clave);
  } catch {
    return null;
  }
}

export function guardarBorrador(clave: string, valor: string): void {
  try {
    localStorage.setItem(clave, valor);
  } catch {
    // Sin almacenamiento: el borrador vive solo en pantalla.
  }
}

export function borrarBorrador(clave: string): void {
  try {
    localStorage.removeItem(clave);
  } catch {
    // Nada que limpiar.
  }
}

/** ¿Ya empezó la misión de ese día y la dejó a medias? */
export function hayBorrador(dia: number): boolean {
  const texto = leerBorrador(claveBorradorTexto(dia));
  if (texto && texto.trim()) return true;
  const guiado = leerBorrador(claveBorradorGuiado(dia));
  if (!guiado) return false;
  try {
    const d = JSON.parse(guiado) as { paso?: number; resp?: Record<string, string[]> };
    return Boolean(d.paso || Object.keys(d.resp ?? {}).length);
  } catch {
    return false;
  }
}
