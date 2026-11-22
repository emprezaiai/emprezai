import type { Metadata } from 'next';
import Link from 'next/link';
import { PaginaLegal } from '@/components/app/PaginaLegal';
import { PRECIOS, RESPONSABLE } from '@/lib/legal';

export const metadata: Metadata = { title: 'Política de Reembolsos — EMPREZAI' };

const enlace = 'text-gold underline-offset-4 hover:underline';

export default function Reembolsos() {
  return (
    <PaginaLegal
      titulo="Política de Reembolsos"
      resumen="La Garantía Sin Preguntas: 15 días desde tu primer pago para pedir el 100% de tu dinero, sin preguntas."
    >
      <section>
        <h2>1. Prueba gratis</h2>
        <p>
          Los primeros {PRECIOS.diasPrueba} días son gratis. Si cancelas antes de que terminen, no se te cobra nada. Te avisamos por correo antes del primer cobro, con la fecha y el monto. Para cancelar,{' '}
          <Link href="/cancelar" className={enlace}>sigue estos pasos</Link>.
        </p>
      </section>

      <section>
        <h2>2. La Garantía Sin Preguntas ({PRECIOS.diasGarantia} días)</h2>
        <p>
          Tienes {PRECIOS.diasGarantia} días de garantía de devolución a partir de tu <strong>primer pago</strong> (el día que termina la prueba y se hace el primer cobro). Si en ese tiempo sientes que la app no es para ti, pides la devolución
          y te regresamos el 100% de tu dinero, sin preguntas ni explicaciones.
        </p>
        <p className="mt-2">
          Si compras desde un país donde la ley te da un derecho de arrepentimiento propio (por ejemplo, 7 días en Brasil), ese derecho también se respeta; nuestra garantía de {PRECIOS.diasGarantia} días es más amplia.
        </p>
      </section>

      <section>
        <h2>3. Cómo pedir tu reembolso</h2>
        <ul>
          <li>
            Desde tu cuenta de comprador de Hotmart, en <a href="https://consumer.hotmart.com" target="_blank" rel="noopener noreferrer" className={enlace}>consumer.hotmart.com</a> → Mis compras → tu compra → solicitar reembolso, o
          </li>
          <li>Escribiéndonos a {RESPONSABLE.emailContacto} con el correo de tu compra: lo gestionamos por ti.</li>
        </ul>
        <p className="mt-2">
          El reembolso lo procesa Hotmart por el mismo medio con el que pagaste; cuánto tarda en reflejarse depende de tu banco o medio de pago. Pedir el reembolso no es lo mismo que cancelar la suscripción: si te devolvemos el dinero, se cierra tu
          acceso de pago y no hay más cobros.
        </p>
      </section>

      <section>
        <h2>4. Renovaciones</h2>
        <p>
          La garantía aplica al primer pago de tu suscripción. Las renovaciones siguientes no se reembolsan, pero puedes{' '}
          <Link href="/cancelar" className={enlace}>cancelar</Link> en cualquier momento para que no haya más cobros, y conservas el acceso hasta el final del periodo que ya pagaste. Si te cobraron una renovación sin que lo esperaras, escríbenos
          a {RESPONSABLE.emailContacto} y lo revisamos contigo.
        </p>
      </section>

      <section>
        <h2>5. Qué pasa con tu cuenta y tus datos</h2>
        <p>
          Al reembolsarse tu compra se cierra el acceso de pago. Antes, puedes descargar tu negocio desde Mi Empresa. Tus piezas y tu cuenta siguen guardadas hasta que tú las borres desde Perfil → Borrar mi cuenta y mis datos (ver la{' '}
          <Link href="/privacidad" className={enlace}>Política de Privacidad</Link>).
        </p>
      </section>
    </PaginaLegal>
  );
}
