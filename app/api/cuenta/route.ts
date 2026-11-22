// La cuenta de la persona en el servidor: GET (perfil + piezas) · PUT (respuestas del recorrido) ·
// DELETE (borrar mi cuenta: todo lo que identifica a la persona; el cobro de la suscripción lo cancela
// ella en Hotmart — ver /cancelar).
// Todo con SU sesión: RLS decide qué puede leer y escribir.

import { PerfilEntrante } from '@/lib/esquemas';
import { clienteAdmin, clienteSesion } from '@/lib/servidor/supabase';
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
    // 1) Datos (perfil, piezas, registros de uso): una sola función en la base, repetible si algo falla.
    const admin = clienteAdmin();
    const { error: errorDatos } = await admin.rpc('borrar_cuenta', { p_user: acceso.user.id });
    if (errorDatos) throw errorDatos;
    // 2) La cuenta de acceso (correo + sesiones). Si falla, la persona repite el botón y se completa.
    const { error: errorCuenta } = await admin.auth.admin.deleteUser(acceso.user.id);
    if (errorCuenta) throw errorCuenta;
    // 3) Cierra la sesión de este navegador (la cuenta ya no existe).
    const db = acceso.estado === 'ok' ? acceso.db : await clienteSesion();
    await db.auth.signOut().catch(() => undefined);
    return respuesta(200, { ok: true });
  } catch (e) {
    return errorInterno('cuenta/delete', e);
  }
}
