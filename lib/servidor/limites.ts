// Límites de intentos (26: el acceso por correo es blanco de spam y fuerza bruta) y huella de IP.
// La IP nunca se guarda en claro: se guarda su HMAC con la clave secreta del servidor.

import crypto from 'node:crypto';
import { clienteAdmin } from './supabase';
import { requerida } from './config';

export function ipDe(req: Request): string {
  const reenviada = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
  return reenviada || req.headers.get('x-real-ip') || 'desconocida';
}

export function huella(valor: string): string {
  return crypto.createHmac('sha256', requerida('SUPABASE_SECRET_KEY')).update(valor).digest('hex').slice(0, 32);
}

/**
 * Registra un intento y dice si todavía está dentro del límite. Contar y anotar ocurren en UN solo
 * paso dentro de la base, con un candado por clave (I2): ráfagas simultáneas no pasan el límite.
 * Si ya llegó al máximo, NO registra otro. La ventana larga es opcional (ej. por hora y por día).
 */
export async function tomarCupo(clave: string, maximo: number, ventanaMin: number, maximoLargo?: number, ventanaLargaMin?: number): Promise<boolean> {
  const { data, error } = await clienteAdmin().rpc('tomar_cupo', {
    p_clave: clave,
    p_maximo: maximo,
    p_ventana_min: ventanaMin,
    p_maximo_largo: maximoLargo ?? null,
    p_ventana_larga_min: ventanaLargaMin ?? null,
  });
  if (error) throw error;
  return data === true;
}

export function dentroDelLimite(clave: string, maximo: number, ventanaMin: number): Promise<boolean> {
  return tomarCupo(clave, maximo, ventanaMin);
}
