# VEREDICTO revisor-visual — paywall (pantalla de planes)
Fecha: 2026-10-06 19:30
Screenshot: docs/revisiones/paywall-375.png
Usabilidad: 34/40
Craft: 16/20
Copy (si vende): 17/20
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos: (1) ruta: el nodo final dice "Lista" (el detalle solo está en sr-only) y el titular promete "29 días hasta tu oferta lista" mientras la ruta pone "Oferta" en el día 3, así que se lee como una contradicción · (2) error de pago (L402): "Escríbenos y te ayudamos" no trae enlace ni correo, el usuario no tiene cómo escribir desde ahí · (3) el esqueleto de carga (L475-486) no calca la pantalla (no tiene X, la ruta mide h-32 contra ~200px reales y falta la barra del botón), así que todo salta al hidratar · (4) el precio cuenta de 0 a su valor desde el montaje, sin delay, mientras la tarjeta todavía entra (delay 0.19s + fade de 0.4s): el conteo pasa casi invisible · (5) en el camino principal (con pieza) faltan las frases obligatorias de la ficha "5 minutos al día" y "hoja en blanco", que solo salen cuando no hay pieza

Detalle: USABILIDAD h1:3 h2:4 h3:4 h4:3 h5:4 h6:4 h7:3 h8:3 h9:3 h10:3 · CRAFT jerarquía:3 profundidad:3 identidad:3 movimiento:3 encaje:4 · COPY idea:4 especificidad:3 emoción:3 oferta:4 acción:3
Gate doble: 34/40 (<36) FALLA · 16/20 PASA. Copy 17/20 pasa y ningún eje está en ≤2. Resultado: CORREGIR la usabilidad (h1, h9 y h10 suben con los fixes 1-3).
Gate de carga cognitiva: 0 fallas de 8.
CTA héroe vivo: pasa los 4. Texto oscuro sobre #FFC23D ≈ 11:1 · whileTap 0.98 + pulso único 1→1.02→1 a los 2s (sin pulso con reduce) · habilitado por defecto y disabled solo con `yendo` · h-14 (56px), ancho completo y sticky abajo.
Binarios de 50 §D: pasan los 6. El gate premium también pasa (titular con acento en "tu oferta lista", hairline-oro en la garantía, fondo radial, radios del kit, check custom y chips SVG en la fila de confianza).
FICHA-ARTE: lo visible coincide con la ficha (#0F0D16, #FFC23D, #3DDC97, Bricolage + Instrument Sans, tarjetas de 20px, chips de 12px, píldora). No hay desvío. Tampoco es un clon de "Umbral": el oro es caléndula y no latón, la base tira a violeta y no a pizarra, y la display es Bricolage y no Archivo.
Sub-checks de copy: la garantía va con nombre y plazo ("La Garantía Sin Preguntas" · 15 días) justo antes del CTA (PASA). El message-match NO ES VERIFICABLE porque no hay dato del 34. La fila de confianza se traza a la objeción 5 de la ficha (PASA).
Promesas pendientes (no cuentan como defecto, por instrucción): el aviso del 11 de octubre y la "devolución en 1 clic" se verifican en Hotmart en la Sesión 6. Hoy el botón abre la vista previa honesta y no cobra.

## Re-revisión 4: qué se corrigió (contra la revisión 3, 32/40 · 15/20 · 17/20)
- 1 (subtítulo con la idea en 7 palabras): CORREGIDO. Ocupa 2 líneas, "una pieza al día" va en semibold (4 palabras) y la idea solo aparece en la cita.
- 2 (Mensual cortado a 360): CORREGIDO. En recorrido-360-nose/16-planes-mensual-arriba el plan elegido se ve completo sobre el botón, con borde y "$0.33 al día", incluso con una cita de 4 líneas.
- 3 (confianza en 2 líneas): CORREGIDO. Va en una línea a 375 y a 360, con íconos en ink-3.
- 4 (movimiento y badge): CORREGIDO A MEDIAS. El badge pasó a 13px/800 y el pulso del CTA está bien. El conteo existe, pero arranca al montar y queda tapado por la entrada de la tarjeta (defecto 4).
- 5 (`new URL` sin try/catch y nowrap): CORREGIDO. Hay try/catch con mensaje en el aria-live, y "Pieza 1 lista · 8 respuestas" sin nowrap. El mensaje de error todavía no ofrece cómo escribir (defecto 2).
- 7 de la revisión 3 ("Lista" ambiguo): SIN CAMBIO (defecto 1).
- 8 de la revisión 3 (falta "hoja en blanco"): SIN CAMBIO (defecto 5).

## Fixes concretos
1. Paywall.tsx L215-217: cambiar "Lista" por "A vender" (o "Día 30"). Así el titular y la ruta dejan de contradecirse.
2. Paywall.tsx L402: convertir "Escríbenos" en `<a href="mailto:…?subject=No pude abrir el pago">` dentro del mismo mensaje.
3. Paywall.tsx L475-486: el esqueleto debe calcar el layout. Lleva header de 56px con un círculo de 44px, el título, la ruta de ~200px, 2 planes h-20 y la barra inferior con una píldora h-14.
4. Paywall.tsx L41: con `desde === 0`, agregar `delay: 0.5` (después del stagger de la tarjeta), así el conteo se ve.
5. Paywall.tsx L176-179 o la figcaption: meter "5 minutos" en el camino con pieza, por ejemplo "…una pieza al día, en 5 minutos". Si cabe, nombrar la hoja en blanco: "Se acabó la hoja en blanco".
