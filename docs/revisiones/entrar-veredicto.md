# VEREDICTO revisor-visual — entrar
Fecha: 2026-11-24 18:00
Screenshot: docs/revisiones/entrar-375.png
Usabilidad: 30/40
Craft: 15/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos:
1. Promesas sin verificar: «7 días gratis, sin cobro hoy · Garantía sin preguntas de 15 días» y «¿Aún no tienes cuenta? Prueba gratis» conviven con «Usa el correo con el que pagaste en Hotmart». No pude confirmar los plazos contra FICHA-MERCADO/Hotmart, y «sin cobro hoy» junto a «el correo con el que pagaste» puede confundir a quien aún no paga. Fix: confirmar los plazos con la dueña y dejar una sola frase de oferta; si es la misma, nombrar igual la prueba en pie y enlace.
2. Términos se parte con «Privacidad.» huérfana en la segunda línea dentro de la tarjeta. Fix: text-balance o acortar a «Al entrar aceptas los Términos y la Privacidad.»
3. Ritmo interno de la tarjeta: ~40 px entre la ayuda y el botón frente a ~16–24 px entre el resto de bloques; el botón queda desligado de su campo. Fix: unificar a 24 px.
4. Mascota (aprox. 176 px, estática salvo flotado) sin relación visual con la tarjeta: queda a ~25 px del subtítulo y ~45 px de la tarjeta. Fix: igualar el aire sobre y bajo (32 px) o solaparla ligeramente con el borde de la tarjeta para unir ambas.
5. Fondo fuera de la tarjeta sigue plano (solo un tinte arriba); la tarjeta eleva bien pero la mitad inferior no tiene luz ni textura propia. Fix: radial sutil verde/dorado detrás del pie para cerrar la composición (opcional).

Corregido y verificado en esta ronda: tarjeta elevada #12161F con borde #1F2937 y sombra (3 niveles: fondo, tarjeta, campo), un solo eje (izquierda) dentro de la tarjeta, pie y enlace centrados fuera, «Garantía sin preguntas» en minúsculas, aire alrededor de la mascota repartido, cabe sin scroll. CTA vivo (contraste alto, 56 px, tap con translateY, valida al enviar, no disabled por defecto). En código: autoFocus, correo recordado, sugerencia de dominio, errores con solución, volver (logo, «Usar otro correo»), aria-live, reduced-motion. La rama «enviado/código» hereda .paleta-portada y no está en la captura (no puntuada visualmente).

Detalle usabilidad: h1:3 h2:3 h3:3 h4:3 h5:3 h6:3 h7:3 h8:3 h9:3 h10:3
Detalle craft: jerarquía:3 profundidad:3 identidad:3 movimiento:3 encaje:3
