import type { Metadata } from 'next';
import { PaginaLegal } from '@/components/app/PaginaLegal';

export const metadata: Metadata = { title: 'Aviso de IA — EMPREZAI' };

export default function AvisoIa() {
  return (
    <PaginaLegal
      titulo="Aviso sobre la Inteligencia Artificial"
      resumen="La IA de EMPREZAI te ayuda a pensar y a escribir más rápido. Tú sigues decidiendo."
    >
      <section>
        <h2>1. Es orientación, no asesoría profesional</h2>
        <p>
          Las piezas que genera EMPREZAI (ofertas, nombres, precios, textos de venta, análisis) son{' '}
          <strong>orientación generada por IA</strong>. No son consejo legal, contable, fiscal ni financiero. Para
          decisiones legales o de impuestos de tu negocio, consulta a un profesional de tu país.
        </p>
      </section>

      <section>
        <h2>2. La IA puede equivocarse</h2>
        <p>
          La IA puede producir información incorrecta, incompleta o desactualizada. Revisa cada pieza antes de usarla,
          sobre todo precios, datos de competidores y afirmaciones sobre tu producto.
        </p>
      </section>

      <section>
        <h2>3. Sin promesas de ingresos</h2>
        <p>
          Ninguna pieza generada es una promesa de ventas ni de ganancias. EMPREZAI te ayuda a tener tu negocio armado;
          los resultados dependen de ti.
        </p>
      </section>

      <section>
        <h2>4. Qué se envía a la IA</h2>
        <p>
          Para armar cada pieza, enviamos a nuestro proveedor de IA (Anthropic, en Estados Unidos) las respuestas de tu
          misión y las piezas anteriores de tu negocio. No incluyas contraseñas, datos bancarios ni información personal
          sensible en tus respuestas.
        </p>
      </section>

      <section>
        <h2>5. Tu idea es tuya</h2>
        <p>
          Tu negocio no se comparte con otros usuarios ni se usa para entrenar modelos de IA. Puedes borrarlo todo cuando
          quieras desde tu perfil.
        </p>
      </section>
    </PaginaLegal>
  );
}
