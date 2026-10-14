// Pieza 1 del recorrido de inicio (antes de pagar, sin cuenta): la IA escribe la frase de negocio.
// Anónima → límite estricto por IP (3/hora, 6/día) + tope global de gasto. Si no se puede, 503 y
// el recorrido usa la frase armada con las respuestas (nunca se queda en blanco).

import { z } from 'zod';
import { NOMBRE_AREA } from '@/lib/onboarding';
import { leerVariable, supabaseConfigurado } from '@/lib/servidor/config';
import { IaNoDisponible, dentroDelLimiteIA, generar } from '@/lib/servidor/ia';
import { encargoPrimeraPieza } from '@/lib/servidor/ia-encargos';
import { huella, ipDe } from '@/lib/servidor/limites';
import { errorInterno, respuesta } from '@/lib/servidor/sesion';

const corto = z.string().trim().min(2).max(160);
const Cuerpo = z.object({
  idea: z.string().trim().min(3).max(300),
  areaFinal: z.enum(['servicios', 'cursos', 'productos']),
  cliente: corto,
  resultado: corto,
  dolor: corto,
});

export async function POST(req: Request) {
  if (!supabaseConfigurado() || !leerVariable('ANTHROPIC_API_KEY')) return respuesta(503, { error: 'no-configurado' });
  const datos = Cuerpo.safeParse(await req.json().catch(() => null));
  if (!datos.success) return respuesta(400, { error: 'datos-invalidos' });
  const r = datos.data;
  try {
    const ipHash = huella(ipDe(req));
    if (!(await dentroDelLimiteIA({ ipHash }, 3, 6))) return respuesta(429, { error: 'espera' });
    const salida = await generar({
      tipo: 'primera_pieza',
      sistema: encargoPrimeraPieza.sistema,
      usuario: encargoPrimeraPieza.usuario({ idea: r.idea, area: NOMBRE_AREA[r.areaFinal], cliente: r.cliente, resultado: r.resultado, dolor: r.dolor }),
      esquema: encargoPrimeraPieza.esquema,
      validar: encargoPrimeraPieza.validar,
      ipHash,
    });
    return respuesta(200, salida);
  } catch (e) {
    if (e instanceof IaNoDisponible) return respuesta(503, { error: 'ia-no-disponible' });
    return errorInterno('ia/primera-pieza', e);
  }
}
