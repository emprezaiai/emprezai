// ¿Quién pide y puede pasar? La sesión se valida contra Supabase (getUser, nunca getSession) y el
// acceso se decide EN SERVIDOR con el estado de la membresía (09/25: plan validado en servidor).

import type { SupabaseClient, User } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { tieneAcceso, type Membresia } from '@/lib/membresia';
import { FaltaConfiguracion, supabaseConfigurado } from './config';
import { clienteSesion } from './supabase';

export type Acceso =
  | { estado: 'sin-servicio' }
  | { estado: 'sin-sesion' }
  | { estado: 'sin-acceso'; user: User }
  | { estado: 'ok'; user: User; db: SupabaseClient };

export async function revisarAcceso(): Promise<Acceso> {
  if (!supabaseConfigurado()) return { estado: 'sin-servicio' };
  const db = await clienteSesion();
  const {
    data: { user },
  } = await db.auth.getUser();
  if (!user) return { estado: 'sin-sesion' };
  const { data: perfil } = await db
    .from('profiles')
    .select('status, trial_ends_at, access_until, grace_ends_at')
    .eq('user_id', user.id)
    .maybeSingle();
  if (!perfil || !tieneAcceso(perfil as Membresia)) return { estado: 'sin-acceso', user };
  return { estado: 'ok', user, db };
}

/** Respuesta JSON corta y sin detalles internos. */
export function respuesta(estado: number, cuerpo: Record<string, unknown>) {
  return NextResponse.json(cuerpo, { status: estado, headers: { 'Cache-Control': 'no-store' } });
}

/** Para las rutas privadas de la app: devuelve el acceso o la respuesta de rechazo. */
export async function exigirAcceso(): Promise<{ ok: true; user: User; db: SupabaseClient } | { ok: false; res: NextResponse }> {
  const acceso = await revisarAcceso();
  if (acceso.estado === 'sin-servicio') return { ok: false, res: respuesta(503, { error: 'no-configurado' }) };
  if (acceso.estado === 'sin-sesion') return { ok: false, res: respuesta(401, { error: 'sin-sesion' }) };
  if (acceso.estado === 'sin-acceso') return { ok: false, res: respuesta(403, { error: 'sin-acceso' }) };
  return { ok: true, user: acceso.user, db: acceso.db };
}

/** Errores inesperados: se registran sin datos personales y se responde genérico. */
export function errorInterno(donde: string, e: unknown) {
  if (e instanceof FaltaConfiguracion) return respuesta(503, { error: 'no-configurado' });
  console.error(`[${donde}]`, e instanceof Error ? e.name : 'error');
  return respuesta(500, { error: 'interno' });
}
