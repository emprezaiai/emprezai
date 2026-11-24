import type { Metadata } from 'next';
import Link from 'next/link';
import { PaginaLegal } from '@/components/app/PaginaLegal';
import { PRECIOS, RESPONSABLE } from '@/lib/legal';

export const metadata: Metadata = { title: 'Términos y Condiciones — EMPREZAI' };

const enlace = 'text-gold underline-offset-4 hover:underline';

export default function Terminos() {
  return (
    <PaginaLegal
      titulo="Términos y Condiciones"
      resumen="Las reglas claras del servicio: qué es EMPREZAI, qué incluye tu suscripción, qué no prometemos y cómo cancelas."
    >
      <section>
        <h2>1. Quién ofrece el servicio y quién puede usarlo</h2>
        <p>
          EMPREZAI la opera {RESPONSABLE.nombre}, persona natural desde {RESPONSABLE.pais}. Para usarla debes ser mayor de 18 años y tener capacidad legal para contratar. Al continuar hacia el pago o al entrar a tu cuenta aceptas estos Términos y
          la <Link href="/privacidad" className={enlace}>Política de Privacidad</Link>.
        </p>
      </section>

      <section>
        <h2>2. Qué es EMPREZAI</h2>
        <p>
          EMPREZAI es una app que te guía con misiones diarias de unos 5 minutos para armar las piezas de tu negocio (oferta, cliente ideal, nombre, precio, textos de venta y más) con ayuda de inteligencia artificial. Te damos una licencia
          personal, no exclusiva e intransferible para usarla mientras tu suscripción esté vigente.
        </p>
      </section>

      <section>
        <h2>3. Qué NO prometemos</h2>
        <p>
          EMPREZAI te ayuda a estructurar tu negocio, pero <strong>no garantiza ventas, ingresos ni resultados económicos</strong>. Lo que logres depende de tus decisiones y de tu ejecución. Las piezas que genera la IA son orientación y debes
          revisarlas antes de usarlas (ver el <Link href="/aviso-ia" className={enlace}>Aviso de IA</Link>). No prometemos que el servicio esté libre de interrupciones o errores.
        </p>
      </section>

      <section>
        <h2>4. Suscripción, prueba gratis y renovación</h2>
        <ul>
          <li>Los planes son {PRECIOS.mensual} o {PRECIOS.anual}, cobrados a través de Hotmart.</li>
          <li>Empiezas con {PRECIOS.diasPrueba} días gratis. Te avisamos por correo antes del primer cobro, con la fecha y el monto.</li>
          <li>
            La suscripción <strong>se renueva automáticamente</strong> cada mes o cada año, al mismo precio, hasta que la canceles.
          </li>
          <li>
            <strong>Plan anual:</strong> te enviamos un recordatorio por correo entre 15 y 30 días antes de cada renovación, con la fecha y el monto, para que decidas si sigues o cancelas antes del cobro.
          </li>
          <li>
            Cancelas cuando quieras desde tu cuenta de comprador en Hotmart: en <Link href="/cancelar" className={enlace}>Cómo cancelar</Link> te mostramos los pasos. Mantienes el acceso hasta el final del periodo que ya pagaste.
          </li>
          <li>
            Si no cancelas antes de que termine la prueba, se hace el primer cobro. Tienes {PRECIOS.diasGarantia} días de garantía desde ese pago (ver <Link href="/reembolsos" className={enlace}>Reembolsos</Link>). Si compras desde un país con un
            derecho de arrepentimiento propio (por ejemplo, 7 días en Brasil), ese derecho se respeta.
          </li>
          <li>Si cambiamos el precio, te avisamos con anticipación y se aplica a partir de tu siguiente renovación; puedes cancelar antes sin costo.</li>
        </ul>
      </section>

      <section>
        <h2>5. Uso aceptable</h2>
        <ul>
          <li>La cuenta es personal: no la compartas ni revendas el acceso.</li>
          <li>No uses la app para crear contenido ilegal, engañoso o que dañe a otras personas.</li>
          <li>No intentes acceder a datos de otros usuarios, saltarte los límites ni afectar el funcionamiento del servicio.</li>
        </ul>
        <p className="mt-2">Podemos suspender o cerrar cuentas que incumplan estas reglas, avisándote el motivo. Si cerramos tu cuenta sin que hayas incumplido, te devolvemos la parte no usada de lo que pagaste.</p>
      </section>

      <section>
        <h2>6. Tu contenido y lo que genera la IA</h2>
        <p>
          Tu idea, tus respuestas y las piezas generadas para ti <strong>son tuyas</strong>: puedes usarlas, editarlas y publicarlas donde quieras, incluso comercialmente. Nos das permiso solo para guardarlas, procesarlas con nuestros proveedores y
          mostrártelas, como explica la <Link href="/privacidad" className={enlace}>Política de Privacidad</Link>. Como la IA puede generar textos parecidos para distintas personas, no podemos garantizar que una pieza sea única ni que no se parezca a
          algo existente: revísala antes de publicarla.
        </p>
      </section>

      <section>
        <h2>7. Límite de uso de la IA</h2>
        <p>
          Para mantener el servicio accesible para todos y evitar abusos, la IA tiene un límite de usos por hora y por día para cada persona. Si lo alcanzas, esperas un rato y sigues; tus piezas guardadas no se pierden. Si el servicio de IA no está
          disponible, la app te arma la pieza con tus respuestas, sin IA.
        </p>
      </section>

      <section>
        <h2>8. Limitación de responsabilidad</h2>
        <p>
          EMPREZAI se ofrece como herramienta de orientación. No somos asesores legales, contables, fiscales ni financieros, y no respondemos por decisiones tomadas a partir de los textos generados. En la medida que la ley lo permita, nuestra
          responsabilidad máxima se limita al monto que pagaste en los últimos 12 meses. Esto no limita los derechos que te da la ley de protección al consumidor de tu país ni excluye responsabilidad que la ley no permita excluir.
        </p>
      </section>

      <section>
        <h2>9. Cambios a estos Términos</h2>
        <p>
          Si hacemos un cambio importante, te avisamos por correo antes de que entre en vigor. Si no estás de acuerdo, puedes cancelar sin costo. La fecha y la versión de la última actualización están arriba.
        </p>
      </section>

      <section>
        <h2>10. Ley aplicable y contacto</h2>
        <p>
          Estos términos se rigen por las leyes de {RESPONSABLE.jurisdiccion}. Esto no limita los derechos que te da la ley de protección al consumidor de tu país de residencia, ni tu derecho a acudir a sus autoridades. Para cualquier reclamo,
          escríbenos primero a {RESPONSABLE.emailContacto}: buscamos resolverlo contigo de forma directa y rápida.
        </p>
      </section>
    </PaginaLegal>
  );
}
