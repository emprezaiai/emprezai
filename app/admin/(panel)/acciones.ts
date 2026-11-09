'use server';

// Acciones del panel de la dueña. CADA una vuelve a verificar en el servidor que quien la pide es
// admin (una acción de servidor se puede llamar directo, sin pasar por la pantalla), valida los
// datos con zod y queda en la auditoría. Nunca se guardan enlaces ni códigos de acceso.

import { revalidatePath } from 'next/cache';
import { nombreCanal } from '@/lib/panel-formato';
import { z } from 'zod';
import { adminActual, auditar, type Admin } from '@/lib/servidor/admin';
import { asegurarCuenta, enlaceDeAcceso } from '@/lib/servidor/accesos';
import { leerVariable } from '@/lib/servidor/config';
import { enviarAcceso } from '@/lib/servidor/correo';
import { modoCaptura } from '@/lib/servidor/panel';
import { clienteAdmin } from '@/lib/servidor/supabase';

/** Cómo estaba el acceso antes de un cambio: permite "Deshacer". */
export interface AccesoPrevio {
  estado: string;
  hasta: string | null;
}
export type Resultado = { ok: true; mensaje: string; enlace?: string; codigo?: string; previo?: AccesoPrevio } | { ok: false; mensaje: string };

const DIA_MS = 86_400_000;

const SIN_PERMISO: Resultado = { ok: false, mensaje: 'Tu sesión venció. Vuelve a entrar al panel con tu correo.' };

/** La dueña, o null (y la acción responde SIN_PERMISO). En la captura local no hay acciones. */
async function exigirAdmin(): Promise<Admin | null> {
  if (modoCaptura) return null;
  try {
    return await adminActual();
  } catch {
    return null;
  }
}

const correoListo = () => Boolean(leerVariable('RESEND_API_KEY') && leerVariable('EMAIL_FROM'));

function falla(e: unknown, donde: string): Resultado {
  console.error(`[admin/${donde}]`, e instanceof Error ? e.name : 'error');
  return { ok: false, mensaje: 'No se pudo completar. Vuelve a intentarlo en un momento.' };
}

/* ── Usuarios ── */

const AltaManual = z.object({
  email: z.string().trim().toLowerCase().email('Escribe un correo válido.').max(254),
  nombre: z.string().trim().min(2, 'Escribe el nombre.').max(120),
  duracion: z.enum(['7', '30', '365', 'fecha']),
  fecha: z.string().optional(),
});

/** Agregar a alguien a mano: cuenta + acceso con fecha de fin (fail-closed) + enlace para entrar. */
export async function agregarUsuario(_previo: Resultado | null, datos: FormData): Promise<Resultado> {
  const admin = await exigirAdmin();
  if (!admin) return SIN_PERMISO;
  const parse = AltaManual.safeParse(Object.fromEntries(datos));
  if (!parse.success) return { ok: false, mensaje: parse.error.issues[0]?.message ?? 'Revisa los datos.' };
  const { email, nombre, duracion, fecha } = parse.data;

  let hasta: Date;
  if (duracion === 'fecha') {
    const elegida = fecha ? new Date(`${fecha}T23:59:59Z`) : null;
    if (!elegida || Number.isNaN(elegida.getTime()) || elegida.getTime() <= Date.now()) return { ok: false, mensaje: 'Elige una fecha de fin en el futuro.' };
    if (elegida.getTime() > Date.now() + 3 * 365 * DIA_MS) return { ok: false, mensaje: 'La fecha de fin puede ser de hasta 3 años.' };
    hasta = elegida;
  } else {
    hasta = new Date(Date.now() + Number(duracion) * DIA_MS);
  }

  try {
    const db = clienteAdmin();
    const { data: previo, error: errorPrevio } = await db.from('profiles').select('id, user_id, email, status, access_until').eq('email', email).maybeSingle();
    if (errorPrevio) throw errorPrevio;
    if (previo && ['active', 'cancelled'].includes(previo.status) && previo.access_until && new Date(previo.access_until) > new Date()) {
      return { ok: false, mensaje: 'Esa persona ya tiene acceso. Búscala en la lista y usa "Extender acceso".' };
    }
    let perfil = previo;
    if (previo) {
      const { error } = await db
        .from('profiles')
        .update({ name: nombre, status: 'active', access_until: hasta.toISOString(), origen_acceso: 'manual', completed: false })
        .eq('id', previo.id);
      if (error) throw error;
    } else {
      const { data, error } = await db
        .from('profiles')
        .insert({ email, name: nombre, status: 'active', access_until: hasta.toISOString(), origen_acceso: 'manual', completed: false })
        .select('id, user_id, email, status, access_until')
        .single();
      if (error) throw error;
      perfil = data;
    }
    if (!perfil) throw new Error('Sin perfil');
    await asegurarCuenta(perfil);
    const { url, codigo } = await enlaceDeAcceso(email);
    let enviado = false;
    if (correoListo()) {
      try {
        await enviarAcceso(email, url, codigo);
        enviado = true;
        await db.from('profiles').update({ completed: true, welcome_sent_at: new Date().toISOString() }).eq('id', perfil.id);
      } catch (e) {
        console.error('[admin/agregar-correo]', e instanceof Error ? e.name : 'error');
      }
    }
    await auditar(admin, 'agregar_usuario', { email, hasta: hasta.toISOString(), enviado });
    revalidatePath('/admin', 'layout');
    return {
      ok: true,
      mensaje: enviado
        ? `Listo: ${nombre} ya tiene acceso hasta el ${hasta.toLocaleDateString('es')} y le llegó el correo para entrar.`
        : `Listo: ${nombre} ya tiene acceso hasta el ${hasta.toLocaleDateString('es')}. Cópiale este enlace (sirve 1 hora, una sola vez).`,
      enlace: enviado ? undefined : url,
      codigo: enviado ? undefined : codigo,
    };
  } catch (e) {
    return falla(e, 'agregar');
  }
}

const Id = z.string().uuid();

async function perfilPorId(id: string) {
  const { data, error } = await clienteAdmin().from('profiles').select('id, user_id, email, name, status, access_until, trial_ends_at').eq('id', id).maybeSingle();
  if (error) throw error;
  return data;
}

/** Enlace de un solo uso para mandarlo por WhatsApp cuando el correo no llega. */
export async function crearEnlaceAcceso(id: string): Promise<Resultado> {
  const admin = await exigirAdmin();
  if (!admin) return SIN_PERMISO;
  if (!Id.safeParse(id).success) return { ok: false, mensaje: 'Usuario no válido.' };
  try {
    const perfil = await perfilPorId(id);
    if (!perfil) return { ok: false, mensaje: 'No encontramos a esa persona.' };
    await asegurarCuenta(perfil);
    const { url, codigo } = await enlaceDeAcceso(perfil.email);
    await auditar(admin, 'crear_enlace', { email: perfil.email });
    return { ok: true, mensaje: 'Enlace listo. Sirve 1 hora y una sola vez: si vence, crea otro.', enlace: url, codigo };
  } catch (e) {
    return falla(e, 'enlace');
  }
}

export async function reenviarAcceso(id: string): Promise<Resultado> {
  const admin = await exigirAdmin();
  if (!admin) return SIN_PERMISO;
  if (!Id.safeParse(id).success) return { ok: false, mensaje: 'Usuario no válido.' };
  if (!correoListo()) return { ok: false, mensaje: 'El envío de correos todavía no está conectado. Usa "Copiar enlace de acceso".' };
  try {
    const perfil = await perfilPorId(id);
    if (!perfil) return { ok: false, mensaje: 'No encontramos a esa persona.' };
    await asegurarCuenta(perfil);
    const { url, codigo } = await enlaceDeAcceso(perfil.email);
    await enviarAcceso(perfil.email, url, codigo);
    await clienteAdmin().from('profiles').update({ completed: true }).eq('id', perfil.id);
    await auditar(admin, 'reenviar_acceso', { email: perfil.email });
    revalidatePath('/admin', 'layout');
    return { ok: true, mensaje: `Le reenviamos el acceso a ${perfil.email}.` };
  } catch (e) {
    return falla(e, 'reenviar');
  }
}

const Extension = z.object({ id: Id, dias: z.coerce.number().int().refine((d) => [7, 30, 365].includes(d)) });

/** Suma días desde hoy o desde su fecha de fin actual (lo que sea más tarde). */
export async function extenderAcceso(id: string, dias: number): Promise<Resultado> {
  const admin = await exigirAdmin();
  if (!admin) return SIN_PERMISO;
  const parse = Extension.safeParse({ id, dias });
  if (!parse.success) return { ok: false, mensaje: 'Elige 7, 30 o 365 días.' };
  try {
    const perfil = await perfilPorId(id);
    if (!perfil) return { ok: false, mensaje: 'No encontramos a esa persona.' };
    const base = Math.max(Date.now(), perfil.access_until ? new Date(perfil.access_until).getTime() : 0);
    const hasta = new Date(base + parse.data.dias * DIA_MS);
    const { error } = await clienteAdmin().from('profiles').update({ status: 'active', access_until: hasta.toISOString() }).eq('id', id);
    if (error) throw error;
    await auditar(admin, 'extender_acceso', { email: perfil.email, dias: parse.data.dias, hasta: hasta.toISOString() });
    revalidatePath('/admin', 'layout');
    return { ok: true, mensaje: `Acceso extendido hasta el ${hasta.toLocaleDateString('es')}.`, previo: { estado: perfil.status, hasta: perfil.access_until } };
  } catch (e) {
    return falla(e, 'extender');
  }
}

export async function quitarAcceso(id: string): Promise<Resultado> {
  const admin = await exigirAdmin();
  if (!admin) return SIN_PERMISO;
  if (!Id.safeParse(id).success) return { ok: false, mensaje: 'Usuario no válido.' };
  try {
    const perfil = await perfilPorId(id);
    if (!perfil) return { ok: false, mensaje: 'No encontramos a esa persona.' };
    const ahora = new Date().toISOString();
    const { error } = await clienteAdmin().from('profiles').update({ status: 'expired', access_until: ahora }).eq('id', id);
    if (error) throw error;
    await auditar(admin, 'quitar_acceso', { email: perfil.email, estado_previo: perfil.status });
    revalidatePath('/admin', 'layout');
    return { ok: true, mensaje: `${perfil.email} ya no tiene acceso. Sus piezas siguen guardadas.`, previo: { estado: perfil.status, hasta: perfil.access_until } };
  } catch (e) {
    return falla(e, 'quitar');
  }
}

const Previo = z.object({
  id: Id,
  estado: z.enum(['trialing', 'active', 'past_due', 'cancelled', 'expired', 'refunded', 'chargeback']),
  hasta: z.string().datetime({ offset: true }).nullable(),
});

/** "Deshacer": deja el acceso como estaba justo antes de extenderlo o quitarlo. */
export async function restaurarAcceso(id: string, previo: AccesoPrevio): Promise<Resultado> {
  const admin = await exigirAdmin();
  if (!admin) return SIN_PERMISO;
  const parse = Previo.safeParse({ id, ...previo });
  if (!parse.success) return { ok: false, mensaje: 'No se pudo deshacer.' };
  try {
    const { error } = await clienteAdmin().from('profiles').update({ status: parse.data.estado, access_until: parse.data.hasta }).eq('id', id);
    if (error) throw error;
    await auditar(admin, 'deshacer_acceso', { id, estado: parse.data.estado, hasta: parse.data.hasta });
    revalidatePath('/admin', 'layout');
    return { ok: true, mensaje: 'Listo: quedó como estaba.' };
  } catch (e) {
    return falla(e, 'deshacer');
  }
}

/* ── Ajustes ── */

export async function guardarImpuestos(_previo: Resultado | null, datos: FormData): Promise<Resultado> {
  const admin = await exigirAdmin();
  if (!admin) return SIN_PERMISO;
  const parse = z.coerce.number().min(0).max(60).safeParse(datos.get('pct'));
  if (!parse.success) return { ok: false, mensaje: 'Escribe un porcentaje entre 0 y 60.' };
  try {
    const { error } = await clienteAdmin()
      .from('panel_ajustes')
      .upsert({ clave: 'impuestos_pct', valor: parse.data, actualizado_en: new Date().toISOString() });
    if (error) throw error;
    await auditar(admin, 'guardar_impuestos', { pct: parse.data });
    revalidatePath('/admin', 'layout');
    return { ok: true, mensaje: `Guardado: impuestos estimados en ${parse.data}%.` };
  } catch (e) {
    return falla(e, 'impuestos');
  }
}

const Costo = z.object({ nombre: z.string().trim().min(1, 'Escribe el nombre del costo.').max(60), monto: z.coerce.number().min(0).max(100000) });

export async function agregarCosto(_previo: Resultado | null, datos: FormData): Promise<Resultado> {
  const admin = await exigirAdmin();
  if (!admin) return SIN_PERMISO;
  const parse = Costo.safeParse({ nombre: datos.get('nombre'), monto: datos.get('monto') });
  if (!parse.success) return { ok: false, mensaje: parse.error.issues[0]?.message ?? 'Revisa los datos.' };
  try {
    const { error } = await clienteAdmin().from('costos_fijos').insert({ nombre: parse.data.nombre, monto_usd: parse.data.monto });
    if (error) throw error;
    await auditar(admin, 'agregar_costo', parse.data);
    revalidatePath('/admin', 'layout');
    return { ok: true, mensaje: `Agregado: ${parse.data.nombre}.` };
  } catch (e) {
    return falla(e, 'costo');
  }
}

export async function borrarCosto(id: number): Promise<Resultado> {
  const admin = await exigirAdmin();
  if (!admin) return SIN_PERMISO;
  if (!Number.isInteger(id) || id <= 0) return { ok: false, mensaje: 'Costo no válido.' };
  try {
    const { error } = await clienteAdmin().from('costos_fijos').delete().eq('id', id);
    if (error) throw error;
    await auditar(admin, 'borrar_costo', { id });
    revalidatePath('/admin', 'layout');
    return { ok: true, mensaje: 'Costo quitado.' };
  } catch (e) {
    return falla(e, 'borrar-costo');
  }
}

const Gasto = z
  .object({
    canal: z.string().trim().toLowerCase().min(1, 'Escribe el canal (el mismo código que pusiste en el enlace).').max(60),
    monto: z.coerce.number().min(0).max(1000000),
    desde: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Elige la fecha de inicio.'),
    hasta: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Elige la fecha de fin.'),
    nota: z.string().trim().max(200).optional(),
  })
  .refine((g) => g.hasta >= g.desde, { message: 'La fecha de fin no puede ser antes del inicio.' });

export async function agregarGasto(_previo: Resultado | null, datos: FormData): Promise<Resultado> {
  const admin = await exigirAdmin();
  if (!admin) return SIN_PERMISO;
  const parse = Gasto.safeParse(Object.fromEntries(datos));
  if (!parse.success) return { ok: false, mensaje: parse.error.issues[0]?.message ?? 'Revisa los datos.' };
  try {
    const { canal, monto, desde, hasta, nota } = parse.data;
    const { error } = await clienteAdmin().from('acquisition_spend').insert({ canal, monto_usd: monto, desde, hasta, nota: nota || null });
    if (error) throw error;
    await auditar(admin, 'agregar_gasto', { canal, monto, desde, hasta });
    revalidatePath('/admin', 'layout');
    return { ok: true, mensaje: `Gasto de ${nombreCanal(canal)} guardado.` };
  } catch (e) {
    return falla(e, 'gasto');
  }
}

export async function borrarGasto(id: number): Promise<Resultado> {
  const admin = await exigirAdmin();
  if (!admin) return SIN_PERMISO;
  if (!Number.isInteger(id) || id <= 0) return { ok: false, mensaje: 'Gasto no válido.' };
  try {
    const { error } = await clienteAdmin().from('acquisition_spend').delete().eq('id', id);
    if (error) throw error;
    await auditar(admin, 'borrar_gasto', { id });
    revalidatePath('/admin', 'layout');
    return { ok: true, mensaje: 'Gasto quitado.' };
  } catch (e) {
    return falla(e, 'borrar-gasto');
  }
}
