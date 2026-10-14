// La cuenta de la persona en el servidor: GET (perfil + piezas) · PUT (respuestas del recorrido) ·
// DELETE ("Borrar mis datos": piezas y respuestas; la suscripción la gestiona Hotmart).
// Todo con SU sesión: RLS decide qué puede leer y escribir.

import { PerfilEntrante } from '@/lib/esquemas';
import { clienteSesion } from '@/lib/servidor/supabase';
import { errorInterno, exigirAcceso, respuesta, revisarAcceso } from '@/lib/servidor/sesion';

export async function GET() {
  const acceso = await exigirAcceso();
  if (!acceso.ok) return acceso.res;
  try {
    const [perfil, piezas] = await Promise.all([
      acceso.db.from('profiles').select('email, name, plan, status, trial_ends_at, idea, area, momento, respuestas, created_at').eq('user_id', acceso.user.id).single(),
      acceso.db
        .from('piezas')
        .select('dia, titulo, contenido, resumen, detalle, fecha, creada_en, base, con_ia, editada_en, original, tu_version')
        .eq('user_id', acceso.user.id)
        .order('dia'),
    ]);
    if (perfil.error) throw perfil.error;
    if (piezas.error) throw piezas.error;
    return respuesta(200, { perfil: perfil.data, piezas: piezas.data });
  } catch (e) {
    return errorInterno('cuenta/get', e);
  }
}

export async function PUT(req: Request) {
  const acceso = await exigirAcceso();
  if (!acceso.ok) return acceso.res;
  const datos = PerfilEntrante.safeParse(await req.json().catch(() => null));
  if (!datos.success) return respuesta(400, { error: 'datos-invalidos' });
  try {
    const { error } = await acceso.db.from('profiles').update(datos.data).eq('user_id', acceso.user.id);
    if (error) throw error;
    return respuesta(200, { ok: true });
  } catch (e) {
    return errorInterno('cuenta/put', e);
  }
}

export async function DELETE() {
  // Borrar es un derecho aunque la suscripción ya no esté activa: basta con tener sesión.
  const acceso = await revisarAcceso();
  if (acceso.estado === 'sin-servicio') return respuesta(503, { error: 'no-configurado' });
  if (acceso.estado === 'sin-sesion') return respuesta(401, { error: 'sin-sesion' });
  try {
    const db = acceso.estado === 'ok' ? acceso.db : await clienteSesion();
    const { error: errorPiezas } = await db.from('piezas').delete().eq('user_id', acceso.user.id);
    if (errorPiezas) throw errorPiezas;
    const { error: errorPerfil } = await db
      .from('profiles')
      .update({ idea: null, area: null, momento: null, respuestas: {} })
      .eq('user_id', acceso.user.id);
    if (errorPerfil) throw errorPerfil;
    await db.auth.signOut();
    return respuesta(200, { ok: true });
  } catch (e) {
    return errorInterno('cuenta/delete', e);
  }
}
