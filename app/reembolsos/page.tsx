import type { Metadata } from 'next';
import { PaginaLegal } from '@/components/app/PaginaLegal';
import { PRECIOS, RESPONSABLE } from '@/lib/legal';

export const metadata: Metadata = { title: 'Política de Reembolsos — EMPRESAI' };

export default function Reembolsos() {
  return (
    <PaginaLegal
      titulo="Política de Reembolsos"
      resumen="La Garantía de la Primera Oferta: 15 días desde tu primer pago para pedir el 100% de tu dinero, sin preguntas."
    >
      <section>
        <h2>1. Prueba gratis</h2>
        <p>
          Los primeros {PRECIOS.diasPrueba} días son gratis. Si cancelas antes de que terminen, no se te cobra nada.
          Te avisamos por email antes del primer cobro.
        </p>
      </section>

      <section>
        <h2>2. La Garantía de la Primera Oferta ({PRECIOS.diasGarantia} días)</h2>
        <p>
          Tienes {PRECIOS.diasGarantia} días de garantía de devolución a partir de tu primer pago. Si durante los primeros{' '}
          {PRECIOS.diasGarantia} días pagados sientes que la app no es para ti, pides la devolución en 1 clic y Hotmart te
          regresa el 100% de tu dinero, sin preguntas.
        </p>
      </section>

      <section>
        <h2>3. Cómo pedir tu reembolso</h2>
        <ul>
          <li>Desde tu cuenta de Hotmart, en «Mis compras», con el botón de solicitar reembolso, o</li>
          <li>Escribiéndonos a {RESPONSABLE.emailContacto} con el email de tu compra y lo gestionamos por ti.</li>
        </ul>
        <p className="mt-2">El reembolso lo procesa Hotmart por el mismo medio con el que pagaste.</p>
      </section>

      <section>
        <h2>4. Renovaciones</h2>
        <p>
          La garantía aplica al primer pago de tu suscripción. Las renovaciones siguientes no se reembolsan, pero puedes
          cancelar en cualquier momento y conservas el acceso hasta el final del periodo pagado.
        </p>
      </section>

      <section>
        <h2>5. Qué pasa con tu cuenta</h2>
        <p>
          Al reembolsarse tu compra se cierra el acceso de pago. Antes, puedes descargar tu negocio desde Mi Empresa.
        </p>
      </section>
    </PaginaLegal>
  );
}
