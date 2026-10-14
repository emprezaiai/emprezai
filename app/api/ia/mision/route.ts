// IA de la misión del día (con sesión y acceso vigente):
// · modo "armar" (días 2-4): arma la pieza con lo que eligió + lo que ya armó.
// · modo "opciones" (días 5-29): 3 opciones tocables armadas con sus piezas anteriores.
// El contexto (idea y piezas previas) se lee del SERVIDOR, no del navegador. Límite 10/hora, 30/día.

import { z } from 'zod';
import { guiaBorrador } from '@/lib/misiones';
import { diaRuta } from '@/lib/ruta';
import { leerVariable } from '@/lib/servidor/config';
import { IaNoDisponible, dentroDelLimiteIA, generar } from '@/lib/servidor/ia';
import { encargoArmar, encargoOpciones } from '@/lib/servidor/ia-encargos';
import { errorInterno, exigirAcceso, respuesta } from '@/lib/servidor/sesion';

const Cuerpo = z.discriminatedUnion('modo', [
  z.object({
    modo: z.literal('armar'),
    dia: z.number().int().min(2).max(4),
    respuestas: z
      .array(z.object({ pregunta: z.string().trim().min(2).max(160), respuesta: z.string().trim().min(1).max(400) }))
      .min(1)
      .max(4),
  }),
  z.object({ modo: z.literal('opciones'), dia: z.number().int().min(5).max(29) }),
]);

export async function POST(req: Request) {
  if (!leerVariable('ANTHROPIC_API_KEY')) return respuesta(503, { error: 'no-configurado' });
  const acceso = await exigirAcceso();
  if (!acceso.ok) return acceso.res;
  const datos = Cuerpo.safeParse(await req.json().catch(() => null));
  if (!datos.success) return respuesta(400, { error: 'datos-invalidos' });
  const pedido = datos.data;
  const dia = diaRuta(pedido.dia);
  try {
    if (!(await dentroDelLimiteIA({ userId: acceso.user.id }, 10, 30))) return respuesta(429, { error: 'espera' });

    const [perfil, piezas] = await Promise.all([
      acceso.db.from('profiles').select('idea').eq('user_id', acceso.user.id).single(),
      dia.usa.length
        ? acceso.db.from('piezas').select('dia, titulo, contenido, resumen').eq('user_id', acceso.user.id).in('dia', dia.usa).order('dia')
        : Promise.resolve({ data: [], error: null }),
    ]);
    if (perfil.error) throw perfil.error;
    if (piezas.error) throw piezas.error;
    const idea = (perfil.data?.idea as string | null) ?? 'aún sin nombre';
    const previas = (piezas.data ?? []).map((p) => `${p.titulo}: ${String(p.contenido).slice(0, 500)}`);

    if (pedido.modo === 'armar') {
      const salida = await generar({
        tipo: 'mision_armar',
        sistema: encargoArmar.sistema,
        usuario: encargoArmar.usuario({ pieza: dia.pieza, idea, piezasPrevias: previas, respuestas: pedido.respuestas }),
        esquema: encargoArmar.esquema,
        validar: encargoArmar.validar,
        userId: acceso.user.id,
      });
      return respuesta(200, salida);
    }

    const guia = guiaBorrador(pedido.dia);
    if (!guia) return respuesta(400, { error: 'dia-sin-borrador' });
    const salida = await generar({
      tipo: 'mision_opciones',
      sistema: encargoOpciones.sistema,
      usuario: encargoOpciones.usuario({ pieza: dia.pieza, pregunta: guia.pregunta, consejo: guia.consejo, plantilla: guia.plantilla, idea, piezasPrevias: previas }),
      esquema: encargoOpciones.esquema,
      validar: encargoOpciones.validar,
      userId: acceso.user.id,
    });
    return respuesta(200, salida);
  } catch (e) {
    if (e instanceof IaNoDisponible) return respuesta(503, { error: 'ia-no-disponible' });
    return errorInterno('ia/mision', e);
  }
}
