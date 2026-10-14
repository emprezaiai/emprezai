// Verifica el código del correo y crea la sesión (cookies del servidor). Máx. 5 intentos / 15 min
// por correo; el error es siempre el mismo (no dice si el correo existe).

import { z } from 'zod';
import { supabaseConfigurado } from '@/lib/servidor/config';
import { dentroDelLimite, huella } from '@/lib/servidor/limites';
import { clienteSesion } from '@/lib/servidor/supabase';
import { errorInterno, respuesta } from '@/lib/servidor/sesion';

const Cuerpo = z.object({
  email: z.string().trim().toLowerCase().email().max(254),
  codigo: z.string().regex(/^\d{6,8}$/),
});

export async function POST(req: Request) {
  if (!supabaseConfigurado()) return respuesta(503, { error: 'no-configurado' });
  const datos = Cuerpo.safeParse(await req.json().catch(() => null));
  if (!datos.success) return respuesta(400, { error: 'codigo-invalido' });
  const { email, codigo } = datos.data;
  try {
    if (!(await dentroDelLimite(`verificar:${huella(email)}`, 5, 15))) return respuesta(429, { error: 'espera' });
    const db = await clienteSesion();
    let { error } = await db.auth.verifyOtp({ email, token: codigo, type: 'email' });
    if (error) ({ error } = await db.auth.verifyOtp({ email, token: codigo, type: 'magiclink' }));
    if (error) return respuesta(400, { error: 'codigo-incorrecto' });
    return respuesta(200, { ok: true });
  } catch (e) {
    return errorInterno('acceso/verificar', e);
  }
}
