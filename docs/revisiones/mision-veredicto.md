# VEREDICTO revisor-visual — Misión del día (borrador día 8 + guiada día 2 + armando + resultado + celebración)
Fecha: 2026-10-07 23:59
Screenshot: docs/revisiones/mision-375.png
Usabilidad: 36/40
Craft: 16/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): FIEL
Veredicto: LISTA
Top defectos: (1) Entre "Armando…" y el resultado la tarjeta todavía salta ~29px hacia arriba. "Armando tu cliente ideal…" ocupa 2 líneas por el Sparkles de 24px y "Así queda tu cliente ideal" ocupa 1 (Mision.tsx:745-748, capturas 13 y 14) · (2) En el borrador, el textarea tiene rows=5, unos 135px vacíos para "una frase basta", y hay 3 frases tranquilizadoras seguidas: el pie, "Es tu primera versión…" y la nota del botón (Mision.tsx:298, 338-344) · (3) h6: "Se arma con: Cliente ideal · Oferta" dice que la pieza usa esas piezas, pero el borrador solo ofrece 1 ejemplo fijo por rubro y nada compuesto con ellas · (4) "Hoy ya armaste" (07) y la celebración (15) llevan al mismo destino con layouts distintos: en una el CTA es fijo y no hay "Volver a Hoy", en la otra está en línea con el secundario. Además, 07 deja ~160px vacíos arriba y ~180px abajo · (5) El borrador usa 5 tamaños (28/16/14/13/12) y el radial verde de abajo a la izquierda que pide FICHA-ARTE no se percibe

## Detalle de puntaje
Usabilidad: h1:3 h2:4 h3:4 h4:3 h5:4 h6:3 h7:4 h8:3 h9:4 h10:4 = 36/40
Craft: jerarquía:3 profundidad:3 identidad:3 movimiento:4 encaje:3 = 16/20
Pasa el gate doble justo en el piso (36 y 16). No queda margen: cualquier regresión la devuelve a NO LISTA.

Gate de carga cognitiva: 1 falla de 8, sin sobrecarga. Es la de siempre: la pregunta 3 de la guiada ofrece 7 opciones (6 canales más "Otra cosa").
- Borde: las píldoras verdes de "Se arma con" se leen como etiquetas de estado (check y rótulo previo), no como chips tocables. No cuenta como falla.

CTA héroe vivo: cumple los 4.
- Contraste: #FFC23D sobre #0F0D16, ≈11:1.
- Respuesta al tocar: whileTap 0.98 (piezas.tsx:232).
- No arranca deshabilitado: en el borrador valida al tocar con sacudida, vibración y error junto al campo. Solo se deshabilita en "armando", que es el request en curso.
- Tamaño: 56px de alto, a todo el ancho, fijo abajo.

Test de fidelidad (public/landing/mision-v2.png): 0 de 6 fallos de estilo.
- modo oscuro ✓
- dorado #FFC23D ✓
- display Bricolage ✓
- radios 20 y píldora ✓
- densidad ✓
- hairline oro→verde ✓

Anti-clon: no coincide con "Umbral" ni con "Capítulo".

## Re-revisión 9: verificación de los 5 defectos de la ronda 8
1. Claim de la landing → CORREGIDO.
   - app/page.tsx:140-143 ya no usa mision-v2.png. Muestra app-hoy, app-ruta, app-mision y app-empresa, que son capturas reales, con alt fieles.
   - app-mision.png es el resultado real del día 2.
   - "5 nombres" solo queda en vista-previa-app.html, que es un artefacto de diseño fuera de /public y no es una superficie de venta.
2. Label del campo → CORREGIDO. Ahora dice "El nombre de tu negocio" (`dia.pieza`, Mision.tsx:260).
3. Armando con la estructura del resultado → CORREGIDO A MEDIAS.
   - El skeleton copia la estructura: rótulo, 5 líneas, separador, 2 líneas y min-h-[275px], que es el mismo alto que la tarjeta final (~275px).
   - Lo que queda es el título. "Armando tu cliente ideal…" parte en 2 líneas y el h1 del resultado en 1, así que la tarjeta sube ~29px al cambiar (antes eran 61px).
4. Mínimo visible y Deshacer → CORREGIDO.
   - El pie dice "Guardado · mínimo 15 letras" (339).
   - El contador se pone verde cuando el texto es válido, y `valido` excluye los ___ (171, 340).
   - `origen` recuerda si se puso la plantilla o el ejemplo (169, 324).
   - Deshacer se va al primer onChange (290).
   - Nit: el contador cuenta caracteres con espacios, pero el texto dice "letras".
5. Encaje → CORREGIDO.
   - La tarjeta del ejemplo queda pareja: ~20px arriba y ~18px abajo, con -mb-3 en el botón.
   - La celebración es un solo bloque centrado con sus botones; el vacío queda repartido arriba y abajo.
   - "Ver en Mi Empresa" ya tiene el mismo nombre en 07 y en 15.

## Qué falta para que cada heurística llegue a 4
- h1 Estado: que el título de "armando" ocupe las mismas líneas que el del resultado. Por ejemplo, TituloAcento "Armando tu cliente ideal" con el Sparkles a 18px dentro del flujo de texto, o un min-h de 2 líneas en ambos títulos.
- h4 Consistencia: que "Hoy ya armaste" use la misma composición que la celebración (CTA en línea + "Volver a Hoy" + "Mañana" dentro de SemanaEnNodos) en lugar de la barra fija.
- h6 Reconocer: 2-3 nombres tocables compuestos con su oferta y su cliente ideal (plantilla interpolada con sus piezas) hasta que llegue la IA en la Sesión 6. Así "Se arma con" deja de ser solo decorativo.
- h8 Minimalista: textarea de 2 filas con auto-crecimiento (field-sizing: content), y "Es tu primera versión…" fundida con la nota del botón.

## Qué falta para que cada eje de craft llegue a 4
- Jerarquía: dejar el borrador en 3 tamaños.
  - 28 para el h1.
  - 15 para label, ejemplo y textarea.
  - 12 para consejo, hint, chips y eyebrow.
- Profundidad: el radial verde de abajo a la izquierda (8%) no se ve en ninguna captura, y el tercio inferior es un plano liso.
- Identidad: el borrador sigue leyéndose como un formulario oscuro. Llevar el rótulo dorado "PIEZA 8 · NOMBRE" sobre la tarjeta del campo, como en el resultado guiado.
- Encaje: el salto del título en "armando", el textarea sobredimensionado y el vacío de 07.

## Hallazgos por severidad
### MEDIA
1. Armando → resultado (Mision.tsx:745-748). La tarjeta salta ~29px. → FIX: el título de "armando" con la misma forma y el mismo número de líneas que el h1 del resultado.
2. Campo del borrador (Mision.tsx:298, 344). Hay ~135px vacíos y 3 frases tranquilizadoras. → FIX: rows={2} con auto-grow, y quitar la línea "Es tu primera versión…" (pasarla a la nota del botón).
3. Ejemplo del borrador. Es 1 ejemplo fijo y no usa las piezas que nombra "Se arma con". → FIX: 2-3 nombres tocables compuestos con su oferta y su cliente ideal.
### BAJA
4. "Hoy ya armaste" (07). Tiene un layout distinto al de la celebración y ~340px vacíos en total. → FIX: reutilizar el bloque en línea de la celebración.
5. Borrador. Usa 5 tamaños tipográficos y el radial verde no se ve. → FIX: dejarlo en 28/15/12 y llevar el radial verde al 8% real dentro del viewport.
6. El contador cuenta caracteres y el pie dice "letras". → FIX: decir "mínimo 15 caracteres" o contar solo letras.
