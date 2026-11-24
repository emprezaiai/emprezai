# VEREDICTO revisor-visual — entrar
Fecha: 2026-11-24 16:00
Screenshot: docs/revisiones/entrar-375.png
Usabilidad: 30/40
Craft: 14/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos:
1. Pie «7 días gratis, sin cobro hoy · Garantía Sin Preguntas de 15 días» se parte dejando el punto medio «·» huérfano al final de la primera línea, y la mayúscula «Sin Preguntas» es inconsistente con el resto del copy. Fix: dos líneas explícitas sin separador («7 días gratis, sin cobro hoy» / «Garantía sin preguntas de 15 días») o un solo mensaje corto.
2. Hueco muerto entre la mascota y el label «Tu correo» (~70 px a 375 de ancho): la mascota se redujo pero el contenedor conserva su alto. Fix: ajustar el aspect-ratio/altura del contenedor para que el hueco sea ≤32 px.
3. Fondo casi plano: el campo (#12161F con luz interior) se despega algo, pero la zona del formulario no tiene superficie elevada visible y el resto del fondo sigue en un solo plano. Fix: tarjeta o banda #12161F con hairline #1F2937 bajo el formulario, o un radial sutil detrás de la mascota.
4. Alineación mixta: títulos y pie centrados; label, ayuda, escudo y Términos a la izquierda; Términos en ~12px ink-3 (text-xs, l.688). Fix: un solo eje o subir los Términos a text-caption.
5. Dos promesas de gratuidad cerca («7 días gratis, sin cobro hoy» y «Prueba gratis») y ninguna aclara cómo se combina con «el correo con el que pagaste». Verifica los plazos contra FICHA-MERCADO/Hotmart (no pude confirmarlos). Fix: quedarse con una sola frase de oferta y confirmar su exactitud.

Corregido y verificado en esta ronda: subtítulo en una línea (l.530); ayuda exacta «Usa el correo con el que pagaste en Hotmart.» pegada al campo (l.615); mascota 176px con flotado que respeta reduced-motion; campo con luz interior (inset 1px) sobre --surface; toda la pantalla cabe en una vista sin scroll; CTA vivo (contraste alto, 56px, tap con translateY, valida al enviar); la rama «enviado/código» hereda .paleta-portada (no está en la captura, no puntuada visualmente). Verificado en código: autoFocus, correo recordado, sugerencia de dominio mal escrito, errores con solución, volver (logo, «Usar otro correo»), aria-live.

Detalle usabilidad: h1:3 h2:3 h3:3 h4:3 h5:3 h6:3 h7:3 h8:3 h9:3 h10:3
Detalle craft: jerarquía:3 profundidad:2 identidad:3 movimiento:3 encaje:3
