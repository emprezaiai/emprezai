// Tarea diaria (Vercel Cron, protegida con CRON_SECRET):
// 1) "Pagó y no entra": reintenta el acceso + bienvenida de los perfiles con completed=false.
// 2) Aviso antes de cobrar: día 5 de la prueba de 7 (decisión de la dueña, 2026-10-13).
// 3) Alerta a la dueña si hay pagos sin acceso por más de 1 hora (una vez al día).
// 3b) Alerta si ayer vencieron accesos sin aviso de Hotmart (renovación o prueba sin cobro): como
//     todo acceso tiene fecha de fin (C1), un aviso perdido corta el acceso en vez de regalarlo; la
//     dueña revisa en Hotmart si esa persona sí pagó.
// 4) Limpieza de registros temporales.

import crypto from 'node:crypto';
import { NextResponse } from 'next/server';
import { darAccesoTrasCompra } from '@/lib/servidor/accesos';
import { leerVariable, supabaseConfigurado } from '@/lib/servidor/config';
import { alertarDuena, enviarAvisoDeCobro } from '@/lib/servidor/correo';
import { clienteAdmin } from '@/lib/servidor/supabase';
import { MARGEN_PRUEBA_MS } from '@/lib/membresia';

export const runtime = 'nodejs';

function autorizado(req: Request): boolean {
  const secreto = leerVariable('CRON_SECRET');
  if (!secreto) return false;
  const a = crypto.createHash('sha256').update(req.headers.get('authorization') ?? '').digest();
  const b = crypto.createHash('sha256').update(`Bearer ${secreto}`).digest();
  return crypto.timingSafeEqual(a, b);
}

const fechaLarga = (iso: string) => new Intl.DateTimeFormat('es', { day: 'numeric', month: 'long' }).format(new Date(iso));

export async function GET(req: Request) {
  if (!autorizado(req)) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  if (!supabaseConfigurado()) return NextResponse.json({ error: 'no-configurado' }, { status: 503 });
  const db = clienteAdmin();
  const resumen = { accesosReintentados: 0, accesosFallidos: 0, avisosEnviados: 0, avisosFallidos: 0 };

  // 1) Accesos pendientes (más de 5 minutos: el webhook ya tuvo su oportunidad).
  const { data: pendientes, error: errorPendientes } = await db
    .from('profiles')
    .select('email, created_at')
    .eq('completed', false)
    .in('status', ['trialing', 'active'])
    .lt('created_at', new Date(Date.now() - 5 * 60_000).toISOString())
    .limit(50);
  if (errorPendientes) return NextResponse.json({ error: 'interno' }, { status: 500 });
  for (const p of pendientes ?? []) {
    try {
      await darAccesoTrasCompra(p.email as string);
      resumen.accesosReintentados += 1;
    } catch (e) {
      resumen.accesosFallidos += 1;
      console.error('[cron/acceso]', e instanceof Error ? e.name : 'error');
    }
  }
  const viejos = (pendientes ?? []).filter((p) => Date.now() - new Date(p.created_at as string).getTime() > 3_600_000);
  if (resumen.accesosFallidos > 0 && viejos.length > 0) {
    const { error } = await db.from('alertas').insert({ clave: `pagos-sin-acceso-${new Date().toISOString().slice(0, 10)}` });
    if (!error) {
      await alertarDuena(
        'Hay compras sin acceso',
        `${viejos.length} persona(s) pagaron hace más de 1 hora y su acceso no salió. Revisa la configuración de correo (Resend) y de Supabase; el sistema lo reintenta cada día.`,
      ).catch((e) => console.error('[cron/alerta]', e instanceof Error ? e.name : 'error'));
    }
  }

  // 2) Aviso antes de cobrar: la prueba termina en las próximas 48 horas.
  const { data: porCobrar, error: errorCobro } = await db
    .from('profiles')
    .select('id, email, plan, trial_ends_at')
    .eq('status', 'trialing')
    .is('aviso_cobro_enviado_at', null)
    .gt('trial_ends_at', new Date().toISOString())
    .lte('trial_ends_at', new Date(Date.now() + 48 * 3_600_000).toISOString())
    .limit(200);
  if (errorCobro) return NextResponse.json({ error: 'interno' }, { status: 500 });
  for (const p of porCobrar ?? []) {
    try {
      await enviarAvisoDeCobro(p.email as string, fechaLarga(p.trial_ends_at as string), (p.plan as string | null) ?? null);
      await db.from('profiles').update({ aviso_cobro_enviado_at: new Date().toISOString() }).eq('id', p.id);
      resumen.avisosEnviados += 1;
    } catch (e) {
      resumen.avisosFallidos += 1;
      console.error('[cron/aviso]', e instanceof Error ? e.name : 'error');
    }
  }

  // 3b) Accesos vencidos en las últimas 24 h sin que llegara el aviso de renovación / primer cobro.
  const ahoraIso = new Date().toISOString();
  const ayerIso = new Date(Date.now() - 86_400_000).toISOString();
  const finPruebaDesde = new Date(Date.now() - 86_400_000 - MARGEN_PRUEBA_MS).toISOString();
  const finPruebaHasta = new Date(Date.now() - MARGEN_PRUEBA_MS).toISOString();
  const [activas, pruebas] = await Promise.all([
    db.from('profiles').select('id', { count: 'exact', head: true }).eq('status', 'active').gte('access_until', ayerIso).lt('access_until', ahoraIso),
    db.from('profiles').select('id', { count: 'exact', head: true }).eq('status', 'trialing').gte('trial_ends_at', finPruebaDesde).lt('trial_ends_at', finPruebaHasta),
  ]);
  const vencidos = (activas.count ?? 0) + (pruebas.count ?? 0);
  if (vencidos > 0) {
    const { error } = await db.from('alertas').insert({ clave: `accesos-vencidos-${ahoraIso.slice(0, 10)}` });
    if (!error) {
      await alertarDuena(
        'Accesos que vencieron sin aviso de Hotmart',
        `${vencidos} persona(s) perdieron el acceso porque Hotmart no avisó de su renovación o de su primer cobro. Revisa en Hotmart si pagaron: si sí, escríbeles; el acceso vuelve solo cuando llegue el aviso.`,
      ).catch((e) => console.error('[cron/vencidos]', e instanceof Error ? e.name : 'error'));
    }
  }

  // 4) Higiene: intentos de acceso de más de 1 día y eventos procesados de más de 90 días.
  const haceUnDia = new Date(Date.now() - 86_400_000).toISOString();
  const hace90 = new Date(Date.now() - 90 * 86_400_000).toISOString();
  const [{ error: e1 }, { error: e2 }] = await Promise.all([
    db.from('limite_intentos').delete().lt('created_at', haceUnDia),
    db.from('processed_events').delete().lt('processed_at', hace90),
  ]);
  if (e1 || e2) console.error('[cron/higiene]', e1?.code ?? e2?.code);

  return NextResponse.json({ ok: true, ...resumen });
}
