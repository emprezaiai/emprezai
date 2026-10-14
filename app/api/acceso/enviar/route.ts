// Pide el enlace + código de acceso. Respuesta UNIFORME exista o no la compra (anti-enumeración, 26);
// límites por correo y por IP (spam/abuso). Solo se envía si ese correo tiene acceso vigente.

import { z } from 'zod';
import { enviarAccesoSiCorresponde } from '@/lib/servidor/accesos';
import { supabaseConfigurado } from '@/lib/servidor/config';
import { dentroDelLimite, huella, ipDe } from '@/lib/servidor/limites';
import { errorInterno, respuesta } from '@/lib/servidor/sesion';

const Cuerpo = z.object({ email: z.string().trim().toLowerCase().email().max(254) });

export async function POST(req: Request) {
  if (!supabaseConfigurado()) return respuesta(503, { error: 'no-configurado' });
  const datos = Cuerpo.safeParse(await req.json().catch(() => null));
  if (!datos.success) return respuesta(400, { error: 'correo-invalido' });
  const { email } = datos.data;
  try {
    const ip = huella(ipDe(req));
    const porCorreo = await dentroDelLimite(`enviar:${huella(email)}`, 3, 5);
    const porIp = porCorreo && (await dentroDelLimite(`enviar-ip:${ip}`, 10, 60));
    if (!porCorreo || !porIp) return respuesta(429, { error: 'espera' });
    await enviarAccesoSiCorresponde(email);
    return respuesta(200, { ok: true });
  } catch (e) {
    return errorInterno('acceso/enviar', e);
  }
}
