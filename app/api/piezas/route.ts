// Guarda (crea o actualiza) una pieza. Solo el SERVIDOR escribe piezas (I1): la persona ya no tiene
// permiso de escritura directa en la base. Aquí se valida sesión + acceso vigente (exigirAcceso) y
// se escribe con la clave del servidor, siempre con el user_id de la sesión (nunca del navegador).
// Una pieza ya guardada conserva su fecha y su creación (la racha no se puede reescribir);
// una nueva acepta la fecha del celular solo si está a ±2 días del servidor (zonas horarias).

import { PiezaEntrante } from '@/lib/esquemas';
import { errorInterno, exigirAcceso, respuesta } from '@/lib/servidor/sesion';
import { clienteAdmin } from '@/lib/servidor/supabase';

const DIA_MS = 86_400_000;

export async function PUT(req: Request) {
  const acceso = await exigirAcceso();
  if (!acceso.ok) return acceso.res;
  const datos = PiezaEntrante.safeParse(await req.json().catch(() => null));
  if (!datos.success) return respuesta(400, { error: 'pieza-invalida' });
  const p = datos.data;
  try {
    const { data: previa, error: errorPrevia } = await acceso.db
      .from('piezas')
      .select('fecha, creada_en')
      .eq('user_id', acceso.user.id)
      .eq('dia', p.dia)
      .maybeSingle();
    if (errorPrevia) throw errorPrevia;

    let fecha = p.fecha;
    let creadaEn = p.creadaEn;
    if (previa) {
      fecha = previa.fecha as string;
      creadaEn = previa.creada_en as string;
    } else {
      const distancia = Math.abs(new Date(`${p.fecha}T12:00:00Z`).getTime() - Date.now());
      // La pieza 1 se arma en el recorrido ANTES de comprar: puede llegar días después.
      const margen = p.dia === 1 ? 30 * DIA_MS : 2 * DIA_MS + DIA_MS / 2;
      if (distancia > margen) return respuesta(400, { error: 'fecha-invalida' });
    }

    const { error } = await clienteAdmin().from('piezas').upsert(
      {
        user_id: acceso.user.id,
        dia: p.dia,
        titulo: p.titulo,
        contenido: p.contenido,
        resumen: p.resumen ?? null,
        detalle: p.detalle ?? [],
        fecha,
        creada_en: creadaEn,
        base: p.base ?? true,
        con_ia: p.conIA ?? false,
        editada_en: p.editadaEn ?? null,
        original: p.original ?? null,
        tu_version: p.tuVersion ?? null,
      },
      { onConflict: 'user_id,dia' },
    );
    if (error) throw error;
    return respuesta(200, { ok: true });
  } catch (e) {
    return errorInterno('piezas/put', e);
  }
}
