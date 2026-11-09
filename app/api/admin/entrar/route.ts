// Pide el enlace para entrar al panel. Respuesta UNIFORME sea o no el correo de la dueña
// (anti-enumeración, 26); límites por correo y por IP. Solo un correo de public.admins recibe algo.

import { z } from 'zod';
import { esAdmin } from '@/lib/servidor/admin';
import { cuentaPara, enlaceDeAcceso } from '@/lib/servidor/accesos';
import { leerVariable, supabaseConfigurado } from '@/lib/servidor/config';
import { enviarAccesoPanel } from '@/lib/servidor/correo';
import { dentroDelLimite, huella, ipDe } from '@/lib/servidor/limites';
import { errorInterno, respuesta } from '@/lib/servidor/sesion';

const Cuerpo = z.object({ email: z.string().trim().toLowerCase().email().max(254) });

export async function POST(req: Request) {
  if (!supabaseConfigurado() || !leerVariable('RESEND_API_KEY') || !leerVariable('EMAIL_FROM')) {
    return respuesta(503, { error: 'no-configurado' });
  }
  const datos = Cuerpo.safeParse(await req.json().catch(() => null));
  if (!datos.success) return respuesta(400, { error: 'correo-invalido' });
  const { email } = datos.data;
  try {
    const porCorreo = await dentroDelLimite(`panel:${huella(email)}`, 3, 15);
    const porIp = porCorreo && (await dentroDelLimite(`panel-ip:${huella(ipDe(req))}`, 10, 60));
    if (!porCorreo || !porIp) return respuesta(429, { error: 'espera' });
    if (await esAdmin(email)) {
      await cuentaPara(email);
      const { url, codigo } = await enlaceDeAcceso(email, 'admin');
      await enviarAccesoPanel(email, url, codigo);
    }
    return respuesta(200, { ok: true });
  } catch (e) {
    return errorInterno('admin/entrar', e);
  }
}
