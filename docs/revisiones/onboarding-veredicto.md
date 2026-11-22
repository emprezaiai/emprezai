# VEREDICTO revisor-visual — onboarding (paso «tu idea», re-revisión del aviso legal)
Fecha: 2026-11-22 12:00
Screenshot: docs/revisiones/onboarding-idea-375.png
Usabilidad: 36/40
Craft: 17/20
Copy (si vende): 18/20
Fidelidad (si hubo referencia): N-A
Veredicto: LISTA
Top defectos: (1) Bajo el botón "Esta es mi idea", el aviso legal ocupa 4 líneas de unos 12 px y pesa casi lo mismo que la nota "Tu idea es tuya" de arriba. Hay dos avisos de privacidad en la misma vista (PasoIdea L98-103 y AvisoAntesDeEnviar). Fix: acortar a 2-3 líneas ("Al continuar, tu idea se envía a un servicio de IA (Anthropic, EE. UU.) y aceptas los Términos y la Política de Privacidad.") y mover "No escribas contraseñas ni datos bancarios" a la nota junto al campo · (2) Los enlaces "Términos" y "Política de Privacidad" van dentro del párrafo y miden unos 14-16 px de alto, muy por debajo de los 44 px táctiles. Fix: padding vertical en los enlaces o py-2 inline-block · (3) "Solo tú la ves" (junto al campo) y "se envían a un servicio de IA" (bajo el botón) se leen en tensión sin la aclaración de que el servicio no guarda ni entrena con la idea. Fix: unificar el mensaje en un solo lugar · (4) En la vista de 375x812 el aviso llega casi al borde inferior (unos 15 px de margen bajo la última línea). Con el teclado abierto o con la nota roja "Escribe al menos…" el botón y el aviso quedan apretados. Fix: reducir a 2-3 líneas · (5) En esta pantalla no aparece ningún dispositivo propio (guepardo/rayo/hairline degradé), y se ve algo más genérica que el resto del recorrido. Fix opcional: usar la hairline dorada en el campo enfocado.

---

## Resultado de la verificación pedida
- ¿Empuja el botón fuera de la zona del pulgar? NO. El botón queda en y≈682 de 812 (tercio inferior), h≈56 px, ancho completo. El aviso va debajo y todo cabe en la primera vista sin scroll.
- ¿Compite con la acción principal? NO. Va en gris (ink-3) sin relieve ni color, el dorado sigue siendo solo del botón. Es legible (aprox. 6:1 sobre #0F0D16).
- ¿Satura? Parcialmente. Cumple, pero está en el límite de 4 líneas por bloque y duplica el tema de privacidad con la nota del campo (defectos 1 y 3).

## Detalle de puntajes
USABILIDAD 36/40: h1:4 h2:4 h3:4 h4:3 h5:4 h6:4 h7:3 h8:3 h9:3 h10:4
CRAFT 17/20: jerarquía:3 profundidad:4 identidad:3 movimiento:4 encaje:3
COPY 18/20: idea:3 especificidad:3 emoción:4 oferta:4 acción:4
FIDELIDAD: N/A

- h3 = 4: hay flecha atrás visible; el código no deja a nadie atrapado (el botón valida al click, no se deshabilita).
- h5 = 4: el botón está vivo y valida al click con sacudida y nota; el campo tiene límite de 120 caracteres con contador.
- h8 = 3: una sola acción primaria; el pie de página con 2 bloques de privacidad es el único ruido nuevo.
- h9 = 3: el error de campo vacío se ve solo al pulsar (no estaba en el screenshot). La nota existe en el código (L123).
- h10 = 4: las sugerencias por área enseñan qué escribir.
- Gate de carga cognitiva: 0 fallas (3 sugerencias, 1 campo, 1 acción primaria, texto del aviso en el límite de 4 líneas).
- CTA héroe vivo 4/4: dorado sobre casi-negro, contraste aprox. 12:1 · whileTap · nunca deshabilitado · alto de unos 56 px a ancho completo.
- FICHA-ARTE: se ven #0F0D16, dorado #FFC23D, verde #3DDC97 (candado), Bricolage + Instrument, píldoras. Coinciden. No es clon de los ejemplos vetados.
- Movimiento 4: stagger de entrada, whileTap en sugerencias, sacudida en error, useReducedMotion (verificado en PasoIdea.tsx). No verificado: el componente AvisoAntesDeEnviar (no se leyó su código).
- Copy: "Tu idea es tuya" traza a la objeción 6 de la ficha de avatar. El aviso legal es obligación legal y no se traza a ningún campo de la ficha. Es correcto, pero resta un poco de tono cálido.
