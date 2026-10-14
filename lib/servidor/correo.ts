// Correos transaccionales (Resend, 18/46). Remitente desde EMAIL_FROM (dominio propio verificado);
// las respuestas van al correo de soporte. Nunca se registran direcciones ni contenido en los logs.

import { Resend } from 'resend';
import { RESPONSABLE } from '@/lib/legal';
import { requerida } from './config';

let cliente: Resend | null = null;
function resend(): Resend {
  if (!cliente) cliente = new Resend(requerida('RESEND_API_KEY'));
  return cliente;
}

const escapar = (t: string) => t.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] as string);

/** Marco del correo con la identidad de la app (oscuro cálido, acento dorado solo en la acción). */
function plantilla({ titulo, parrafos, boton, codigo, pie }: { titulo: string; parrafos: string[]; boton?: { texto: string; url: string }; codigo?: string; pie?: string }) {
  const html = `<!doctype html><html lang="es"><body style="margin:0;background:#0f0d16;font-family:Segoe UI,Helvetica,Arial,sans-serif;color:#efeaf5">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:32px 16px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;background:#1a1622;border-radius:20px;padding:28px">
<tr><td style="font-weight:800;font-size:18px;letter-spacing:-0.01em;color:#ffc23d">⚡ EMPREZAI</td></tr>
<tr><td style="padding-top:20px;font-size:24px;line-height:1.2;font-weight:800;color:#efeaf5">${escapar(titulo)}</td></tr>
${parrafos.map((p) => `<tr><td style="padding-top:12px;font-size:16px;line-height:1.5;color:#bdb4cb">${escapar(p)}</td></tr>`).join('')}
${boton ? `<tr><td style="padding-top:24px"><a href="${boton.url}" style="display:inline-block;background:#ffc23d;color:#1a1206;font-weight:700;font-size:17px;text-decoration:none;padding:14px 28px;border-radius:999px">${escapar(boton.texto)}</a></td></tr>` : ''}
${codigo ? `<tr><td style="padding-top:20px;font-size:14px;color:#bdb4cb">O escribe este código en la app:</td></tr><tr><td style="padding-top:8px;font-size:30px;font-weight:800;letter-spacing:0.3em;color:#efeaf5">${escapar(codigo)}</td></tr>` : ''}
<tr><td style="padding-top:24px;font-size:13px;line-height:1.5;color:#998fa8">${escapar(pie ?? `¿Dudas? Responde este correo o escríbenos a ${RESPONSABLE.emailContacto}.`)}</td></tr>
</table></td></tr></table></body></html>`;
  const texto = [titulo, '', ...parrafos, boton ? `\n${boton.texto}: ${boton.url}` : '', codigo ? `\nTu código: ${codigo}` : '', '', pie ?? `¿Dudas? ${RESPONSABLE.emailContacto}`]
    .filter((l) => l !== undefined)
    .join('\n');
  return { html, texto };
}

async function enviar(para: string, asunto: string, contenido: { html: string; texto: string }) {
  const { error } = await resend().emails.send({
    from: requerida('EMAIL_FROM'),
    to: para,
    replyTo: RESPONSABLE.emailContacto,
    subject: asunto,
    html: contenido.html,
    text: contenido.texto,
  });
  if (error) throw new Error(`No se pudo enviar el correo (${error.name})`);
}

/** Bienvenida tras la compra en Hotmart: el acceso con enlace + código (26: siempre ambos). */
export async function enviarBienvenida(para: string, enlace: string, codigo: string | undefined) {
  await enviar(
    para,
    'Tu acceso a EMPREZAI: tu ruta de 30 días empieza hoy',
    plantilla({
      titulo: 'Te damos la bienvenida a tu ruta de 30 días',
      parrafos: [
        'Tu prueba gratis de 7 días ya está activa. Entra con el botón y arma tu pieza de hoy en 5 minutos.',
        'Si armaste tu pieza 1 en este mismo celular, ya te está esperando en Mi Empresa.',
      ],
      boton: { texto: 'Entrar a mi ruta', url: enlace },
      codigo,
      pie: `El enlace y el código son de un solo uso y vencen en 1 hora. Si vencen, pide uno nuevo desde la pantalla Entrar. ¿Dudas? Responde este correo o escríbenos a ${RESPONSABLE.emailContacto}.`,
    }),
  );
}

/** Acceso pedido desde la pantalla Entrar. */
export async function enviarAcceso(para: string, enlace: string, codigo: string | undefined) {
  await enviar(
    para,
    'Tu enlace para entrar a EMPREZAI',
    plantilla({
      titulo: 'Entra a tu ruta',
      parrafos: ['Toca el botón desde este celular para entrar, o escribe el código en la pantalla donde lo pediste.'],
      boton: { texto: 'Entrar a mi ruta', url: enlace },
      codigo,
      pie: `El enlace y el código son de un solo uso y vencen en 1 hora. Si no pediste entrar, ignora este correo: nadie puede entrar sin él. ¿Dudas? ${RESPONSABLE.emailContacto}`,
    }),
  );
}

/** Aviso antes del primer cobro (día 5 de la prueba de 7, decisión de la dueña 2026-10-13). */
export async function enviarAvisoDeCobro(para: string, fechaCobro: string, plan: string | null) {
  const cuanto = plan === 'anual' ? '$79.99 USD al año' : plan === 'mensual' ? '$9.99 USD al mes' : 'el precio de tu plan';
  await enviar(
    para,
    'Tu prueba gratis termina en 2 días',
    plantilla({
      titulo: 'Te avisamos antes de cobrar',
      parrafos: [
        `Tu prueba gratis termina el ${fechaCobro}. Ese día Hotmart cobra ${cuanto} y tu ruta sigue sin cortes.`,
        'Si no quieres seguir, cancela antes desde tu correo de compra de Hotmart (o escríbenos y te ayudamos). Tus piezas siguen siendo tuyas.',
        'Además tienes la Garantía de 15 días: si no es para ti, pides la devolución.',
      ],
      boton: { texto: 'Seguir con mi ruta', url: `${requerida('NEXT_PUBLIC_SITE_URL').replace(/\/+$/, '')}/app` },
    }),
  );
}

/** Alerta interna a la dueña (tope de gasto de IA, pagos sin acceso). */
export async function alertarDuena(asunto: string, detalle: string) {
  await enviar(RESPONSABLE.emailContacto, `[EMPREZAI] ${asunto}`, plantilla({ titulo: asunto, parrafos: [detalle] }));
}
