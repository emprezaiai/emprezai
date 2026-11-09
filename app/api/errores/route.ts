// Recibe los errores que capturan las pantallas (Error Boundaries) y los guarda en error_log para
// la sección Salud del panel (21). Solo el nombre del error y la ruta: nunca datos de la persona.

import { z } from 'zod';
import { supabaseConfigurado } from '@/lib/servidor/config';
import { dentroDelLimite, huella, ipDe } from '@/lib/servidor/limites';
import { clienteAdmin } from '@/lib/servidor/supabase';
import { respuesta } from '@/lib/servidor/sesion';

const Cuerpo = z.object({
  mensaje: z.string().trim().min(1).max(300),
  ruta: z.string().trim().max(200).optional(),
});

export async function POST(req: Request) {
  if (!supabaseConfigurado()) return respuesta(503, { error: 'no-configurado' });
  const datos = Cuerpo.safeParse(await req.json().catch(() => null));
  if (!datos.success) return respuesta(400, { error: 'error-invalido' });
  try {
    if (!(await dentroDelLimite(`errores:${huella(ipDe(req))}`, 20, 10))) return respuesta(429, { error: 'espera' });
    const { error } = await clienteAdmin().from('error_log').insert({ origen: 'cliente', mensaje: datos.data.mensaje, ruta: datos.data.ruta ?? null });
    if (error) throw error;
    return respuesta(200, { ok: true });
  } catch (e) {
    console.error('[errores]', e instanceof Error ? e.name : 'error');
    return respuesta(500, { error: 'interno' });
  }
}
