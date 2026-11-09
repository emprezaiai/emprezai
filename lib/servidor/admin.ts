// ¿Es la dueña? (09/26: acceso solo-admin verificado EN SERVIDOR en cada página y cada acción del
// panel; ocultar la ruta no protege nada). La sesión se valida con getUser contra Supabase y el
// correo debe estar en public.admins, tabla que solo lee el servidor con la clave secreta.

import { supabaseConfigurado } from './config';
import { clienteAdmin, clienteSesion } from './supabase';

export interface Admin {
  email: string;
  userId: string;
}

export async function esAdmin(email: string): Promise<boolean> {
  const { data, error } = await clienteAdmin().from('admins').select('email').eq('email', email.toLowerCase()).maybeSingle();
  if (error) throw error;
  return Boolean(data);
}

/** La dueña con sesión válida, o null (sin servicio, sin sesión o sin permiso: para afuera es igual). */
export async function adminActual(): Promise<Admin | null> {
  if (!supabaseConfigurado()) return null;
  const {
    data: { user },
  } = await (await clienteSesion()).auth.getUser();
  if (!user?.email) return null;
  return (await esAdmin(user.email)) ? { email: user.email.toLowerCase(), userId: user.id } : null;
}

/** Deja constancia de cada acción de la dueña en el panel. Nunca guarda enlaces ni códigos de acceso. */
export async function auditar(admin: Admin, accion: string, detalle: Record<string, unknown> = {}) {
  const { error } = await clienteAdmin().from('admin_auditoria').insert({ admin_email: admin.email, accion, detalle });
  if (error) console.error('[admin/auditoria]', error.code);
}
