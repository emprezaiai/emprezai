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
 * Registra un intento y dice si todavía está dentro del límite.
 * Cuenta los intentos de `clave` en la ventana; si ya llegó al máximo, NO registra otro.
 */
export async function dentroDelLimite(clave: string, maximo: number, ventanaMin: number): Promise<boolean> {
  const db = clienteAdmin();
  const desde = new Date(Date.now() - ventanaMin * 60_000).toISOString();
  const { count, error } = await db
    .from('limite_intentos')
    .select('id', { count: 'exact', head: true })
    .eq('clave', clave)
    .gte('created_at', desde);
  if (error) throw error;
  if ((count ?? 0) >= maximo) return false;
  const { error: errorInsert } = await db.from('limite_intentos').insert({ clave });
  if (errorInsert) throw errorInsert;
  return true;
}
