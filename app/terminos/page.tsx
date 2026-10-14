import type { Metadata } from 'next';
import Link from 'next/link';
import { PaginaLegal } from '@/components/app/PaginaLegal';
import { PRECIOS, RESPONSABLE } from '@/lib/legal';

export const metadata: Metadata = { title: 'Términos y Condiciones — EMPREZAI' };

export default function Terminos() {
  return (
    <PaginaLegal
      titulo="Términos y Condiciones"
      resumen="Las reglas claras del servicio: qué es EMPREZAI, qué incluye tu suscripción, qué no prometemos y cómo cancelas."
    >
      <section>
        <h2>1. Qué es EMPREZAI</h2>
        <p>
          EMPREZAI es una app que te guía con misiones diarias de unos 5 minutos para armar las piezas de tu negocio
          (oferta, cliente ideal, nombre, precio, textos de venta y más) con ayuda de inteligencia artificial.
        </p>
      </section>

      <section>
        <h2>2. Qué NO prometemos</h2>
        <p>
          EMPREZAI te ayuda a estructurar tu negocio, pero <strong>no garantiza ventas, ingresos ni resultados
          económicos</strong>. Lo que logres depende de tus decisiones y de tu ejecución. Las piezas que genera la IA son
          orientación y debes revisarlas antes de usarlas (ver el <Link href="/aviso-ia" className="text-gold underline-offset-4 hover:underline">Aviso de IA</Link>).
        </p>
      </section>

      <section>
        <h2>3. Suscripción, prueba gratis y renovación</h2>
        <ul>
          <li>Los planes son {PRECIOS.mensual} o {PRECIOS.anual}, cobrados a través de Hotmart.</li>
          <li>Empiezas con {PRECIOS.diasPrueba} días gratis. Te avisamos por email antes del primer cobro.</li>
          <li>La suscripción <strong>se renueva automáticamente</strong> cada mes o cada año hasta que canceles.</li>
          <li>Puedes cancelar cuando quieras desde la app (Perfil → Mi plan → Cancelar) o desde tu cuenta de Hotmart. Mantienes el acceso hasta el final del periodo pagado.</li>
        </ul>
      </section>

      <section>
        <h2>4. Uso aceptable</h2>
        <ul>
          <li>La cuenta es personal: no la compartas ni revendas el acceso.</li>
          <li>No uses la app para crear contenido ilegal, engañoso o que dañe a otras personas.</li>
          <li>No intentes acceder a datos de otros usuarios ni afectar el funcionamiento del servicio.</li>
        </ul>
        <p className="mt-2">Podemos suspender cuentas que incumplan estas reglas, avisándote el motivo.</p>
      </section>

      <section>
        <h2>5. Tu contenido</h2>
        <p>
          Tu idea, tus respuestas y las piezas generadas para ti <strong>son tuyas</strong>. Solo las usamos para darte el
          servicio, como explica la <Link href="/privacidad" className="text-gold underline-offset-4 hover:underline">Política de Privacidad</Link>.
        </p>
      </section>

      <section>
        <h2>6. Límite de uso de la IA</h2>
        <p>
          Cada plan incluye hasta 40 piezas generadas por mes (tus 30 misiones más 10 para rehacer). El límite existe para
          mantener el servicio accesible para todos.
        </p>
      </section>

      <section>
        <h2>7. Limitación de responsabilidad</h2>
        <p>
          EMPREZAI se ofrece como herramienta de orientación. No somos asesores legales, contables ni financieros, y no
          respondemos por decisiones tomadas a partir de los textos generados. Nuestra responsabilidad máxima se limita al
          monto que pagaste en los últimos 12 meses.
        </p>
      </section>

      <section>
        <h2>8. Ley aplicable y contacto</h2>
        <p>
          Estos términos se rigen por las leyes de {RESPONSABLE.jurisdiccion}. Esto no limita los derechos que te da la ley de protección al consumidor de tu país de residencia. Para cualquier reclamo, escríbenos primero a{' '}
          {RESPONSABLE.emailContacto}: buscamos resolverlo contigo de forma directa.
        </p>
      </section>
    </PaginaLegal>
  );
}
