// Cuentas de acceso: el pago (webhook) crea el perfil; aquí se crea la cuenta de auth, se reconcilia
// con el perfil y se manda el enlace + código. Patrón de dos fases de 18 ("pagó y no entra"):
// profiles.completed pasa a true SOLO cuando la bienvenida salió; si algo falla, el cron reintenta.

import { clienteAdmin } from './supabase';
import { urlDelSitio } from './config';
import { enviarAcceso, enviarBienvenida } from './correo';
import { tieneAcceso, type Membresia } from '@/lib/membresia';

interface PerfilAcceso extends Membresia {
  id: string;
  user_id: string | null;
  email: string;
  completed: boolean;
}

export async function perfilPorEmail(email: string): Promise<PerfilAcceso | null> {
  const { data, error } = await clienteAdmin()
    .from('profiles')
    .select('id, user_id, email, status, access_until, grace_ends_at, completed')
    .eq('email', email.toLowerCase())
    .maybeSingle();
  if (error) throw error;
  return (data as PerfilAcceso | null) ?? null;
}

/** Garantiza que el perfil tenga su cuenta de auth (la crea o reutiliza) y devuelve su id. */
async function asegurarCuenta(perfil: PerfilAcceso): Promise<string> {
  if (perfil.user_id) return perfil.user_id;
  const db = clienteAdmin();
  let userId: string | null = null;
  const { data, error } = await db.auth.admin.createUser({ email: perfil.email, email_confirm: true });
  if (data?.user) userId = data.user.id;
  else if (error?.code === 'email_exists' || error?.code === 'user_already_exists') {
    const { data: existente, error: errorBusqueda } = await db.rpc('auth_user_id_por_email', { p_email: perfil.email });
    if (errorBusqueda) throw errorBusqueda;
    userId = (existente as string | null) ?? null;
  } else if (error) throw error;
  if (!userId) throw new Error('No se pudo crear ni encontrar la cuenta de acceso');
  const { error: errorUpdate } = await db.from('profiles').update({ user_id: userId }).eq('id', perfil.id);
  if (errorUpdate) throw errorUpdate;
  return userId;
}

/** Enlace de un solo uso (vuelve a NUESTRO dominio con token_hash, sesión SSR en cookies) + código. */
async function enlaceDeAcceso(email: string): Promise<{ url: string; codigo?: string }> {
  const sitio = urlDelSitio();
  const { data, error } = await clienteAdmin().auth.admin.generateLink({
    type: 'magiclink',
    email,
    options: { redirectTo: `${sitio}/app` },
  });
  if (error || !data?.properties) throw error ?? new Error('Sin enlace');
  const { hashed_token, email_otp } = data.properties;
  return { url: `${sitio}/auth/confirmar?token_hash=${encodeURIComponent(hashed_token)}&type=magiclink`, codigo: email_otp || undefined };
}

/** Tras una compra/prueba aprobada: cuenta + bienvenida. Idempotente (no reenvía si ya salió). */
export async function darAccesoTrasCompra(email: string): Promise<void> {
  const perfil = await perfilPorEmail(email);
  if (!perfil || perfil.completed || !tieneAcceso(perfil)) return;
  await asegurarCuenta(perfil);
  const { url, codigo } = await enlaceDeAcceso(perfil.email);
  await enviarBienvenida(perfil.email, url, codigo);
  const { error } = await clienteAdmin()
    .from('profiles')
    .update({ completed: true, welcome_sent_at: new Date().toISOString() })
    .eq('id', perfil.id);
  if (error) throw error;
}

/**
 * Pedido desde la pantalla Entrar. Solo envía si ese correo tiene acceso vigente; si no, no hace
 * nada. Quien llama responde SIEMPRE igual (anti-enumeración, 26).
 */
export async function enviarAccesoSiCorresponde(email: string): Promise<void> {
  const perfil = await perfilPorEmail(email);
  if (!perfil || !tieneAcceso(perfil)) return;
  await asegurarCuenta(perfil);
  const { url, codigo } = await enlaceDeAcceso(perfil.email);
  await enviarAcceso(perfil.email, url, codigo);
  if (!perfil.completed) {
    await clienteAdmin().from('profiles').update({ completed: true }).eq('id', perfil.id);
  }
}
