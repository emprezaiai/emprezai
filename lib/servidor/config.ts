// Configuración privada del servidor (09/27: fail-closed). Ninguna clave tiene valor por defecto:
// si falta, la ruta que la necesita responde "no configurado" (503) y NO hace nada a medias.
// Solo las variables NEXT_PUBLIC_* llegan al navegador; las demás viven únicamente aquí.

export class FaltaConfiguracion extends Error {
  constructor(public readonly variable: string) {
    super(`Falta la configuración ${variable}`);
    this.name = 'FaltaConfiguracion';
  }
}

export function leerVariable(nombre: string): string | undefined {
  const valor = process.env[nombre];
  return valor && valor.trim() ? valor.trim() : undefined;
}

export function requerida(nombre: string): string {
  const valor = leerVariable(nombre);
  if (!valor) throw new FaltaConfiguracion(nombre);
  return valor;
}

export function numeroOr(nombre: string, porDefecto: number): number {
  const n = Number(leerVariable(nombre));
  return Number.isFinite(n) && n > 0 ? n : porDefecto;
}

/** Supabase está conectado (URL + clave pública + clave secreta). */
export function supabaseConfigurado(): boolean {
  return Boolean(
    leerVariable('NEXT_PUBLIC_SUPABASE_URL') && leerVariable('NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY') && leerVariable('SUPABASE_SECRET_KEY'),
  );
}

/** URL pública del sitio (para enlaces de los correos). */
export function urlDelSitio(): string {
  return requerida('NEXT_PUBLIC_SITE_URL').replace(/\/+$/, '');
}
