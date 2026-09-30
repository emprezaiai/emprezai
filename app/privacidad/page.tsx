import type { Metadata } from 'next';
import { PaginaLegal } from '@/components/app/PaginaLegal';
import { RESPONSABLE } from '@/lib/legal';

export const metadata: Metadata = { title: 'Política de Privacidad — EMPRESAI' };

export default function Privacidad() {
  return (
    <PaginaLegal
      titulo="Política de Privacidad"
      resumen="Tu idea es tuya. Aquí explicamos qué datos usamos, para qué, con quién los compartimos y cómo los borras cuando quieras."
    >
      <section>
        <h2>1. Quién es responsable de tus datos</h2>
        <p>
          El responsable del tratamiento es {RESPONSABLE.nombre}, con operación desde {RESPONSABLE.pais}. Puedes
          contactarnos en {RESPONSABLE.emailContacto} para cualquier consulta o para ejercer tus derechos.
        </p>
      </section>

      <section>
        <h2>2. Qué datos recopilamos</h2>
        <ul>
          <li><strong>Datos de cuenta:</strong> tu email (para darte acceso) y, si lo das, tu nombre.</li>
          <li><strong>Datos de tu negocio:</strong> la idea y las respuestas que escribes en las misiones, y las piezas que la IA arma contigo.</li>
          <li><strong>Datos de uso:</strong> qué misiones completas, tu racha y cómo usas la app, para mejorarla.</li>
          <li><strong>Datos de pago:</strong> los procesa Hotmart. Nosotros nunca vemos ni guardamos tu tarjeta.</li>
        </ul>
        <p className="mt-2">No pedimos ubicación, teléfono, fecha de nacimiento ni datos financieros.</p>
      </section>

      <section>
        <h2>3. Para qué los usamos</h2>
        <ul>
          <li>Darte acceso a la app y guardar tu progreso.</li>
          <li>Que la IA arme cada pieza de tu negocio usando lo que ya construiste (el Método Pieza a Pieza).</li>
          <li>Enviarte avisos útiles: tu misión del día, el aviso antes de un cobro y mensajes sobre tu cuenta.</li>
          <li>Mejorar la app con datos de uso agregados.</li>
        </ul>
        <p className="mt-2">
          <strong>Nunca</strong> vendemos tus datos, ni compartimos tu idea de negocio con otros usuarios, ni la usamos
          para otra cosa que no sea ayudarte a armar tu negocio.
        </p>
      </section>

      <section>
        <h2>4. Con quién los compartimos (proveedores)</h2>
        <ul>
          <li><strong>Anthropic (Estados Unidos):</strong> procesa los textos de tus misiones para generar tus piezas con IA. Según sus condiciones para empresas, no usa esos datos para entrenar sus modelos.</li>
          <li><strong>Supabase:</strong> base de datos y acceso a tu cuenta.</li>
          <li><strong>Vercel:</strong> aloja la app en internet.</li>
          <li><strong>Resend:</strong> envía los correos de acceso y avisos.</li>
          <li><strong>Hotmart:</strong> procesa los pagos y las suscripciones.</li>
        </ul>
      </section>

      <section>
        <h2>5. Transferencia internacional</h2>
        <p>
          Algunos proveedores procesan datos en Estados Unidos. Al crear tu cuenta das tu consentimiento para esa
          transferencia, que se hace solo con proveedores que protegen tus datos y únicamente para darte el servicio.
        </p>
      </section>

      <section>
        <h2>6. Cuánto tiempo los guardamos</h2>
        <p>
          Mientras tengas tu cuenta. Si la borras, eliminamos tu perfil, tu negocio, tus piezas, tu progreso y los
          registros de uso de IA asociados a ti. Los datos de facturación los conserva Hotmart según la ley aplicable.
        </p>
      </section>

      <section>
        <h2>7. Tus derechos</h2>
        <p>
          Puedes acceder a tus datos, corregirlos, descargarlos, oponerte a su uso o borrarlos. El borrado completo se
          hace desde la app (Perfil → Borrar mi cuenta) o escribiéndonos a {RESPONSABLE.emailContacto}. Respondemos en
          un máximo de 15 días hábiles.
        </p>
      </section>

      <section>
        <h2>8. Edad mínima</h2>
        <p>EMPRESAI es solo para personas mayores de 18 años.</p>
      </section>

      <section>
        <h2>9. Cambios a esta política</h2>
        <p>
          Si hacemos un cambio importante, te avisamos por email antes de que entre en vigor. La fecha de la última
          actualización siempre está arriba.
        </p>
      </section>
    </PaginaLegal>
  );
}
