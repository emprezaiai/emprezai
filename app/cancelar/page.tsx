import type { Metadata } from 'next';
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';
import { PaginaLegal } from '@/components/app/PaginaLegal';
import { PRECIOS, RESPONSABLE } from '@/lib/legal';

export const metadata: Metadata = { title: 'Cómo cancelar tu suscripción — EMPREZAI' };

const enlace = 'text-gold underline-offset-4 hover:underline';

export default function Cancelar() {
  return (
    <PaginaLegal
      titulo="Cómo cancelar tu suscripción"
      resumen="Cancelas cuando quieras, en menos de un minuto, sin llamar a nadie. La cancelación se hace en tu cuenta de comprador de Hotmart, que es quien cobra."
    >
      <section>
        <h2>Los pasos</h2>
        <ol className="mt-3 flex flex-col gap-4">
          {[
            <>
              Entra a{' '}
              <a href="https://consumer.hotmart.com" target="_blank" rel="noopener noreferrer" className={`${enlace} inline-flex items-center gap-1`}>
                consumer.hotmart.com <ExternalLink size={14} aria-hidden="true" />
              </a>{' '}
              con el correo y la contraseña de tu compra. Si no recuerdas la contraseña, usa «Olvidé mi contraseña» con el mismo correo con el que pagaste.
            </>,
            <>
              En <strong>Mis compras</strong>, abre EMPREZAI y toca <strong>Configurar pago</strong>.
            </>,
            <>
              Elige <strong>Cancelar tu suscripción</strong> y confirma. Hotmart te muestra que quedó cancelada.
            </>,
          ].map((paso, i) => (
            <li key={i} style={{ listStyle: 'none', marginLeft: 0 }} className="flex items-start gap-3">
              <span aria-hidden="true" className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[color-mix(in_oklab,var(--gold)_14%,transparent)] font-display text-sm font-bold text-gold">
                {i + 1}
              </span>
              <span className="min-w-0 pt-0.5">{paso}</span>
            </li>
          ))}
        </ol>
        <p className="mt-3">
          ¿No lo encuentras o algo no funciona? Escríbenos a{' '}
          <a href={`mailto:${RESPONSABLE.emailContacto}?subject=${encodeURIComponent('Quiero cancelar mi suscripción')}`} className={enlace}>
            {RESPONSABLE.emailContacto}
          </a>{' '}
          con el correo de tu compra y te ayudamos a cancelarla.
        </p>
      </section>

      <section>
        <h2>Qué pasa cuando cancelas</h2>
        <ul>
          <li>
            <strong>Durante la prueba gratis ({PRECIOS.diasPrueba} días):</strong> si cancelas antes de que termine, no se te cobra nada.
          </li>
          <li>
            <strong>Después de pagar:</strong> no hay más cobros y mantienes el acceso hasta el final del periodo que ya pagaste (el mes o el año).
          </li>
          <li>
            <strong>Tus piezas siguen siendo tuyas:</strong> puedes descargarlas desde Mi Empresa. Si quieres volver, haces una nueva compra y recuperas el acceso.
          </li>
          <li>
            Cancelar <strong>no devuelve</strong> el dinero ya pagado: para eso está la <Link href="/reembolsos" className={enlace}>Garantía Sin Preguntas de {PRECIOS.diasGarantia} días</Link>.
          </li>
        </ul>
      </section>

      <section>
        <h2>¿Quieres borrar también tu cuenta?</h2>
        <p>
          Cancelar el cobro y borrar tus datos son dos cosas distintas. Si además quieres que borremos tu cuenta, en la app ve a <strong>Perfil → Borrar mi cuenta y mis datos</strong> (mira la{' '}
          <Link href="/privacidad" className={enlace}>Política de Privacidad</Link>).
        </p>
      </section>
    </PaginaLegal>
  );
}
