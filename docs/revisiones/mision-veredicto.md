# VEREDICTO revisor-visual — Misión del día (borrador día 8 + guiada día 2 + armando + resultado + celebración)
Fecha: 2026-10-07 23:59
Screenshot: docs/revisiones/mision-375.png
Usabilidad: 34/40
Craft: 16/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): FIEL
Veredicto: NO LISTA
Top defectos: (1) La landing sigue vendiendo lo que la misión no hace. En app/page.tsx:142, el carrusel muestra mision-v2.png con el alt "la IA propone 5 nombres para tu negocio", pero el día 8 entrega un textarea vacío y 1 ejemplo fijo por rubro. Es un claim falso (gate 61) y además deja h6 en 3 · (2) El label "Tu nombre" del campo se lee como el nombre de la persona, no el del negocio. Sale de `Tu ${dia.corto}` (Mision.tsx:259) · (3) Entre "Armando…" y el resultado el título todavía salta unos 61px: queda en ~257px en la captura 13 y en ~196px en la 14. El skeleton tiene 4 líneas; el resultado tiene 5 líneas en text-lg, un separador y el bloque "Úsalo así" · (4) Al escribir, el mínimo de 15 letras desaparece porque "Borrador guardado" lo reemplaza. El contador marca 33/600 con la plantilla todavía sin completar. Si se completan los ___ en menos de 5s, el aviso pasa a decir "Pusimos el ejemplo" y "Deshacer" borra lo que se escribió · (5) Encaje: la tarjeta del ejemplo tiene ~20px arriba y ~32px abajo. La celebración deja ~155px vacíos bajo la semana. "Ver en Mi Empresa" (celebración) y "Ver Mi Empresa" (ya hecha) nombran distinto el mismo destino

## Detalle de puntaje
Usabilidad: h1:3 h2:3 h3:4 h4:3 h5:3 h6:3 h7:4 h8:3 h9:4 h10:4 = 34/40
Craft: jerarquía:3 profundidad:3 identidad:3 movimiento:4 encaje:3 = 16/20

Gate de carga cognitiva: 1 falla de 8, sin sobrecarga. Es la misma de siempre: la pregunta 3 de la guiada tiene 6 canales más "Otra cosa", 7 opciones.
- Borde: las píldoras verdes de "Se arma con" parecen chips tocables y no hacen nada. Hoy no cuenta como falla porque "Lo que ya armaste" cubre esa necesidad.

CTA héroe vivo: cumple los 4.
- Contraste: #FFC23D sobre #0F0D16, ≈11:1.
- Respuesta al tocar: whileTap 0.98 (piezas.tsx:232).
- No arranca deshabilitado: en el borrador valida al tocar con sacudida, vibración y error junto al campo. Solo se deshabilita durante "armando", que es el request en curso.
- Tamaño: 56px de alto, a todo el ancho, fijo abajo.

Test de fidelidad (public/landing/mision-v2.png): 0 de 6 fallos de estilo.
- modo oscuro ✓
- hue dorado ✓
- display Bricolage ✓
- radios 18-22 y píldora ✓
- densidad ✓
- relieve con hairline oro→verde ✓
- El contenido sigue sin coincidir (5 opciones de IA frente a un textarea). Es un problema de claim, no de estilo.

Anti-clon: no coincide con "Umbral" ni con "Capítulo".

## Re-revisión 8: verificación de lo pedido en la ronda 7
1. Ejemplo según el rubro, con "Usar como punto de partida" y Deshacer → CORREGIDO.
   - `ejemploPara` en lib/misiones.ts:255 da Sofía para servicios, Diego para cursos y Ana para productos. El botón llena el campo y ofrece Deshacer (Mision.tsx:351-366).
   - Sigue sin ser contenido compuesto con SUS piezas: el defecto 1 sigue en pie.
2. "Armando tu …" con la forma completa del resultado y la barra del botón → CORREGIDO A MEDIAS.
   - El posesivo ✓.
   - Hay BotonPrincipal en armando (825-830) ✓.
   - Hay 2 filas de skeleton para "Cambiar" y "Mañana" ✓.
   - El skeleton de la tarjeta mide ~130px y el resultado ~275px, así que el título salta ~61px (antes eran ~170px).
3. "Mañana" dentro de la tarjeta de la semana → CORREGIDO (SemanaEnNodos, 1047-1053). Siguen ~155px vacíos bajo la tarjeta porque el bloque se centra con justify-center.
4. Error de guardado en la nota del botón en las 3 variantes → CORREGIDO (238, 436, 832).
5. Inset único de 16px → CORREGIDO. Label, textarea y ejemplo usan p-4, y los botones fantasma compensan con -mr-2/-ml-2.
6. "Usar plantilla" sin gris → CORREGIDO: text-ink-1 fijo (273).
7. "Borrador guardado en este celular" y "Una frase basta · mínimo 15 letras" → CORREGIDO, con efecto colateral: el mínimo deja de verse en cuanto se escribe (336). Ver defecto 4.
8. "Lo que ya armaste" plegado en una fila hundida → CORREGIDO. Usa bg-sunken, radius-card, aria-expanded y animación de altura (370-401).
9. Encabezado con el nodo-rayo y el rótulo corto → CORREGIDO (99-122). Ya no repite el h1.

## Qué falta para que cada heurística llegue a 4
- h1 Estado: que armando no salte. El skeleton debe copiar la estructura del resultado: rótulo, 5 líneas del alto de text-lg, separador y 3 líneas de "Úsalo así". También sirve fijar un min-h igual al de la tarjeta final.
- h2 Lenguaje:
  - Label "Nombre de tu negocio" en lugar de "Tu nombre" (usar `dia.pieza` o un `label` por guía).
  - Que el aviso de Deshacer no cambie a "Pusimos el ejemplo" cuando se completó la plantilla: guardar el origen en estado.
- h3 Control: ya está en 4.
  - Riesgo menor: "Deshacer" restaura el texto anterior aunque la usuaria haya escrito después. Ocultarlo al primer onChange.
- h4 Consistencia: un solo nombre para la acción que lleva a Mi Empresa ("Ver en Mi Empresa" o "Ver Mi Empresa", no los dos).
- h5 Prevención:
  - Que el mínimo siga visible mientras se escribe, por ejemplo "Guardado · mínimo 15 letras".
  - Que el contador avise si el texto ya sirve: ink-3 mientras no alcanza y verde cuando es válido.
  - Que el contador no trate la plantilla con ___ como texto válido.
- h6 Reconocer: 3 nombres tocables compuestos con su oferta y su cliente ideal, que llenen el campo al tocarlos. Con la IA, los 5 que promete la landing.
- h7 Flexibilidad: ya está en 4.
- h8 Minimalista:
  - Textarea de 2-3 filas con auto-crecimiento: "una frase basta" y hoy son 5 filas vacías (~135px).
  - Fundir "Es tu primera versión…" con la nota del botón, que hoy son dos frases tranquilizadoras redundantes.
  - Reducir el vacío de la celebración y de "Hoy ya armaste" con un py fijo en lugar de justify-center.
- h9 Errores: ya está en 4.
- h10 Ayuda: ya está en 4.

## Qué falta para que cada eje de craft llegue a 4
- Jerarquía: en el borrador conviven 28/16/16/14/13/12px. Hay que bajar a 3 tamaños:
  - h1 a 28.
  - Cuerpo a 15: label, ejemplo y placeholder.
  - Label a 12: consejo, hint, chips y eyebrow.
- Profundidad: el radial verde de abajo a la izquierda que pide FICHA-ARTE no se percibe en ninguna captura, y el tercio inferior es un plano liso. Subirlo al 8% real o posicionarlo dentro del viewport.
- Identidad: el borrador sigue leyéndose como un formulario oscuro. Que la pieza que se arma lleve su firma: el rótulo "PIEZA 8 · NOMBRE" en dorado sobre la tarjeta del campo, como en el resultado guiado, y que el campo vuele a Mi Empresa al guardar como en la guiada.
- Movimiento: ya está en 4.
- Encaje:
  - Padding simétrico en la tarjeta del ejemplo: compensar el min-h-11 del botón con -mb-3 o con pb-1 en la tarjeta.
  - Armando sin salto.
  - Textarea a la medida de "una frase".

## Hallazgos por severidad

### ALTA
1. Landing (app/page.tsx:142) frente al borrador del día 8 (mision-375.png). El carrusel promete "la IA propone 5 nombres para tu negocio" y la app entrega un textarea y un ejemplo fijo. Es un claim falso (gate 61, ESTADO.md:151). → FIX: reemplazar la imagen por docs/revisiones/app/21-mision-demo-dia8-borrador-arriba.png con un alt fiel, hasta que exista la IA (Sesión 6).

### MEDIA
2. Label del campo (mision-375, Mision.tsx:259). "Tu nombre" es ambiguo en la pantalla del nombre del negocio. → FIX: `label: 'Nombre de tu negocio'` por guía, o usar `dia.pieza`.
3. Armando → resultado (capturas 13 y 14, Mision.tsx:745-752). El título salta ~61px. → FIX: un skeleton con la estructura y el alto del resultado, con min-h igual al de la tarjeta final.
4. Pie del campo (22-plantilla-final, Mision.tsx:336). El mínimo desaparece al escribir y el contador no distingue entre válido e inválido. → FIX: "Guardado · mínimo 15 letras" y el contador en verde cuando `valido`.

### BAJA
5. Tarjeta del ejemplo (mision-375): ~20px arriba y ~32px abajo. → FIX: `-mb-3` en el botón "Usar como punto de partida".
6. Celebración (captura 15): ~155px vacíos bajo la tarjeta de la semana. → FIX: py fijo y el bloque anclado arriba.
7. "Ver en Mi Empresa" frente a "Ver Mi Empresa" (capturas 15 y 07). → FIX: unificar.
8. Aviso de Deshacer (Mision.tsx:321). Cambia a "Pusimos el ejemplo" al completar la plantilla, y "Deshacer" borra lo que la usuaria escribió después. → FIX: guardar el origen y ocultar Deshacer al primer onChange.
