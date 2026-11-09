// Recibe los eventos del camino de venta (36) y los guarda en event_log, la fuente del panel.
// Sin sesión (el recorrido es anónimo): por eso solo acepta nombres del contrato, propiedades
// cortas y un límite por IP. Nunca guarda la IP ni datos personales.

import { z } from 'zod';
import { supabaseConfigurado } from '@/lib/servidor/config';
import { dentroDelLimite, huella, ipDe } from '@/lib/servidor/limites';
import { clienteAdmin } from '@/lib/servidor/supabase';
import { errorInterno, respuesta } from '@/lib/servidor/sesion';

const NOMBRES = ['landing_vista', 'onboarding_iniciado', 'onboarding_paso_completado', 'resultado_visto', 'paywall_visto', 'checkout_iniciado'] as const;

const Cuerpo = z.object({
  nombre: z.enum(NOMBRES),
  anonId: z.string().trim().max(120).optional(),
  propiedades: z.record(z.string().max(40), z.union([z.string().max(120), z.number(), z.boolean()])).default({}),
  qa: z.boolean().default(false),
});

export async function POST(req: Request) {
  if (!supabaseConfigurado()) return respuesta(503, { error: 'no-configurado' });
  const datos = Cuerpo.safeParse(await req.json().catch(() => null));
  if (!datos.success || Object.keys(datos.data.propiedades).length > 12) return respuesta(400, { error: 'evento-invalido' });
  try {
    if (!(await dentroDelLimite(`eventos:${huella(ipDe(req))}`, 120, 10))) return respuesta(429, { error: 'espera' });
    const { nombre, anonId, propiedades, qa } = datos.data;
    const { error } = await clienteAdmin().from('event_log').insert({ nombre, anon_id: anonId ?? null, propiedades, qa });
    if (error) throw error;
    return respuesta(200, { ok: true });
  } catch (e) {
    return errorInterno('eventos', e);
  }
}
