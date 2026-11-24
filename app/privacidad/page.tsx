import type { Metadata } from 'next';
import Link from 'next/link';
import { PaginaLegal } from '@/components/app/PaginaLegal';
import { RESPONSABLE } from '@/lib/legal';

export const metadata: Metadata = { title: 'Política de Privacidad — EMPREZAI' };

const enlace = 'text-gold underline-offset-4 hover:underline';

export default function Privacidad() {
  return (
    <PaginaLegal
      titulo="Política de Privacidad"
      resumen="Tu idea es tuya. Aquí explicamos, sin letra chica, qué datos guardamos, para qué, con quién los compartimos, cuánto tiempo y cómo los borras cuando quieras."
    >
      <section>
        <h2>1. Quién es responsable de tus datos</h2>
        <p>
          La responsable del tratamiento es {RESPONSABLE.nombre}, persona natural que opera EMPREZAI desde {RESPONSABLE.pais}. Cumplimos la ley canadiense de protección de datos personales (PIPEDA) y respetamos las leyes de privacidad
          de tu país en Latinoamérica (por ejemplo la LGPD de Brasil, la Ley 1581 de Colombia y la LFPDPPP de México). Para cualquier consulta o para ejercer tus derechos, escríbenos a {RESPONSABLE.emailContacto}.
        </p>
      </section>

      <section>
        <h2>2. Qué datos guardamos</h2>
        <ul>
          <li>
            <strong>Tu cuenta:</strong> tu correo y, si Hotmart nos lo envía al comprar, tu nombre.
          </li>
          <li>
            <strong>Tu negocio:</strong> la idea y las respuestas que escribes en las misiones, y las piezas que armas con la IA (incluidas tus ediciones).
          </li>
          <li>
            <strong>Tu plan:</strong> si estás en prueba, pagando o cancelaste, el plan elegido, las fechas de acceso y el código de tu suscripción en Hotmart. <strong>No vemos ni guardamos los datos de tu tarjeta:</strong> los
            procesa Hotmart.
          </li>
          <li>
            <strong>Cómo usas la app:</strong> qué misiones completas y tu racha; y, antes de comprar, qué pasos de nuestra página viste (página de ventas, preguntas de inicio, planes) y desde qué enlace llegaste (por ejemplo, de qué red
            social). Esto se guarda con un código anónimo que vive en tu navegador, no con tu nombre.
          </li>
          <li>
            <strong>Datos técnicos:</strong> errores de la app, el registro de cada uso de la IA (cuándo, qué modelo y cuánto costó; <strong>no su contenido</strong>) y una huella cifrada de tu dirección IP, que solo sirve para limitar abusos.
            No guardamos tu IP en claro.
          </li>
        </ul>
        <p className="mt-2">No pedimos ubicación, teléfono, fecha de nacimiento, documentos de identidad ni datos de tu tarjeta.</p>
      </section>

      <section>
        <h2>3. Para qué los usamos</h2>
        <ul>
          <li>Darte acceso a la app, guardar tu progreso y cumplir la suscripción que contrataste.</li>
          <li>Armar cada pieza de tu negocio con IA usando lo que ya construiste (el Método Pieza a Pieza).</li>
          <li>Escribirte por correo solo lo necesario: tu enlace o código para entrar, el aviso antes del primer cobro y avisos importantes sobre tu cuenta. El recordatorio diario por correo todavía no se envía; cuando lo activemos será con el horario
            que elegiste y podrás apagarlo.</li>
          <li>Proteger el servicio (evitar abusos y fraudes) y mejorarlo con datos de uso agregados.</li>
          <li>Cumplir obligaciones legales, como conservar los registros de cobros.</li>
        </ul>
        <p className="mt-2">
          <strong>Nunca</strong> vendemos tus datos, ni mostramos tu idea a otros usuarios, ni te enviamos publicidad de terceros. No te escribimos con fines de marketing sin tu permiso.
        </p>
      </section>

      <section>
        <h2>4. Qué le enviamos a la IA</h2>
        <p>
          Para armar una pieza enviamos a nuestro proveedor de IA (Anthropic, en Estados Unidos) lo que escribiste en la misión, tu idea y las piezas anteriores de tu negocio. <strong>No le enviamos tu correo ni tu nombre.</strong> Según las condiciones
          comerciales de Anthropic, los datos que recibe por su servicio para empresas no se usan para entrenar sus modelos; puede conservarlos por un tiempo limitado por razones de seguridad. No escribas contraseñas, datos bancarios ni información
          personal sensible (salud, documentos de identidad) en tus respuestas. Más detalle en el <Link href="/aviso-ia" className={enlace}>Aviso de IA</Link>.
        </p>
      </section>

      <section>
        <h2>5. Con quién los compartimos</h2>
        <ul>
          <li><strong>Anthropic (EE. UU.):</strong> genera las piezas con IA.</li>
          <li><strong>Supabase (servidores en EE. UU.):</strong> base de datos y acceso a tu cuenta.</li>
          <li><strong>Vercel (EE. UU.):</strong> aloja la app y la página de ventas.</li>
          <li><strong>Resend (EE. UU.):</strong> envía los correos de acceso y de aviso.</li>
          <li><strong>Hotmart (Brasil):</strong> procesa los pagos y las suscripciones, y es quien te cobra y te emite el comprobante. Trata tus datos de compra bajo sus propias condiciones.</li>
        </ul>
        <p className="mt-2">
          Solo compartimos lo necesario para que cada uno cumpla su función. Las personas que ayudan a administrar EMPREZAI ven en el panel datos de cuenta (correo, plan, fechas, cuántas piezas armaste) para darte soporte, pero{' '}
          <strong>el panel no muestra tu idea ni tus piezas</strong>. Si una autoridad competente nos lo exige por ley, podríamos tener que entregar información.
        </p>
      </section>

      <section>
        <h2>6. Transferencia internacional</h2>
        <p>
          Operamos desde Canadá y varios proveedores procesan datos en Estados Unidos y Brasil. Al contratar el servicio, y al usar la IA, aceptas que tus datos se traten fuera de tu país. Elegimos proveedores que protegen la información y los
          usamos solo para darte el servicio.
        </p>
      </section>

      <section id="cookies">
        <h2>7. Cookies y datos guardados en tu dispositivo</h2>
        <ul>
          <li>
            <strong>Cookie de sesión (esencial):</strong> la que te mantiene dentro de tu cuenta al entrar con tu enlace o código. Sin ella la app no funciona; por eso no pedimos permiso para usarla.
          </li>
          <li>
            <strong>Almacenamiento del navegador (esencial):</strong> guarda tu avance, tus borradores, tus preferencias y el código anónimo de la visita. Vive en tu dispositivo y puedes borrarlo desde la configuración de tu navegador.
          </li>
          <li>
            <strong>No usamos</strong> cookies de publicidad, píxeles de redes sociales ni herramientas de seguimiento de terceros. Si algún día los añadimos, te pediremos permiso antes, con botones «Aceptar» y «Rechazar» igual de fáciles.
          </li>
        </ul>
        <p className="mt-2">La página de pago de Hotmart es de Hotmart y tiene sus propias cookies, que se rigen por su política.</p>
      </section>

      <section>
        <h2>8. Cuánto tiempo los guardamos</h2>
        <ul>
          <li><strong>Tu cuenta y tus piezas:</strong> mientras tengas la cuenta. Si la borras, se van al instante.</li>
          <li><strong>Errores técnicos:</strong> 90 días.</li>
          <li><strong>Visitas a la página de ventas y uso de la app:</strong> hasta 13 meses.</li>
          <li><strong>Tu correo en un aviso de pago fallido de Hotmart:</strong> 90 días.</li>
          <li><strong>El registro de usos de IA:</strong> se desvincula de ti a los 13 meses; queda solo el costo, sin tu identidad.</li>
          <li>
            <strong>Registros de cobros:</strong> los conservamos sin tu correo ni tu nombre durante el tiempo que exija la ley contable (en Canadá, normalmente hasta 6 años). Hotmart guarda tus datos de compra según su propia política.
          </li>
        </ul>
      </section>

      <section>
        <h2>9. Tus derechos y cómo ejercerlos</h2>
        <p>Tienes derecho a acceder a tus datos, corregirlos, llevártelos, oponerte a su uso, retirar tu consentimiento y borrarlos.</p>
        <ul>
          <li>
            <strong>Borrarlo todo, tú mismo:</strong> en la app, <strong>Perfil → Borrar mi cuenta y mis datos</strong>. Se borran tu cuenta, tu correo, tus piezas y tus registros de uso, y no se puede deshacer.{' '}
            <strong>Importante: borrar tu cuenta en EMPREZAI borra tus datos de la app, pero NO cancela tu suscripción en Hotmart.</strong> Si tienes un plan activo, cancélalo primero en Hotmart (mira <Link href="/cancelar" className={enlace}>Cómo cancelar</Link>) para evitar futuros cobros.
          </li>
          <li>
            <strong>Llevarte tus piezas:</strong> en Perfil → Descargar todo lo que armé.
          </li>
          <li>
            <strong>Cualquier otra solicitud</strong> (acceso, corrección, oposición): escríbenos a {RESPONSABLE.emailContacto}. Respondemos en un máximo de 15 días hábiles.
          </li>
        </ul>
        <p className="mt-2">
          Si crees que no atendimos bien tu solicitud, puedes reclamar ante la autoridad de tu país (por ejemplo la ANPD en Brasil, la SIC en Colombia, el INAI en México) o ante el Comisionado de Privacidad de Canadá.
        </p>
      </section>

      <section>
        <h2>10. Cómo protegemos tus datos</h2>
        <p>
          Tu información viaja cifrada, cada cuenta solo puede leer sus propios datos, las claves del servicio nunca llegan a tu navegador y registramos las acciones hechas en el panel de administración. Ningún sistema es infalible: si ocurriera una brecha que
          te afecte, te avisaremos por correo y a las autoridades que corresponda.
        </p>
      </section>

      <section>
        <h2>11. Edad mínima</h2>
        <p>EMPREZAI es solo para personas mayores de 18 años. No recopilamos datos de menores a sabiendas; si descubrimos una cuenta de un menor, la borramos.</p>
      </section>

      <section>
        <h2>12. Cambios a esta política</h2>
        <p>
          La fecha y la versión de la última actualización están siempre arriba. Si hacemos un cambio importante, te avisamos por correo antes de que entre en vigor y, si cambia para qué usamos tus datos, te pedimos de nuevo tu permiso.
        </p>
        <p className="mt-2 text-sm text-ink-3">
          Historial: v1.4 (24 nov 2026): aviso más visible de que borrar la cuenta no cancela la suscripción y recordatorio por correo antes de cada renovación anual · v1.3 (nov 2026): borrado real de cuenta, cookies y almacenamiento, plazos de conservación y lista completa de proveedores · v1.2 (oct 2026): versión anterior.
        </p>
      </section>
    </PaginaLegal>
  );
}
