// Cerrar sesión invalida la sesión en el SERVIDOR (26), no solo borra la cookie.

import { supabaseConfigurado } from '@/lib/servidor/config';
import { clienteSesion } from '@/lib/servidor/supabase';
import { errorInterno, respuesta } from '@/lib/servidor/sesion';

export async function POST() {
  if (!supabaseConfigurado()) return respuesta(200, { ok: true });
  try {
    const db = await clienteSesion();
    await db.auth.signOut();
    return respuesta(200, { ok: true });
  } catch (e) {
    return errorInterno('acceso/salir', e);
  }
}
