# VEREDICTO revisor-visual — paywall (pantalla de planes)
Fecha: 2026-10-06 23:59
Screenshot: docs/revisiones/paywall-375.png
Usabilidad: 36/40
Craft: 16/20
Copy (si vende): 19/20
Fidelidad (si hubo referencia): N-A
Veredicto: LISTA
Top defectos: (1) a 360 px, con la cita de 4 líneas, un borde del punto dorado de "Hoy" asoma en la esquina superior izquierda del botón fijo (recorrido-360-nose/15-planes-arriba y 16-planes-mensual-arriba, ~x25 y717 en CSS). El texto de la fila queda tapado, pero el punto cae en el tramo semitransparente de .barra-inferior (0-40 px) y se ve como una mancha. Solo se nota buscándolo → empezar el tramo opaco antes (`transparent, var(--surface-base) 24px`) o subir pt-6 a pt-8 en la barra para que el punto quede del todo dentro de la zona opaca · (2) tarjetas de plan (Paywall.tsx L266-268): la anual usa pt-6 y la mensual pt-4, así que la anual queda ~6 px más alta y el bloque de texto no ocupa la misma posición en las dos → usar pt-6 en ambas (o mt-2 solo en el texto de la anual con min-h igual), para que las dos tarjetas midan lo mismo · (3) jerarquía tipográfica: hay más de 3 tamaños en el primer cuadro (titular, precio, nombre del plan en text-lg, subtítulo en text-base, cobro en text-sm, caption y xs) → bajar el subtítulo y el cobro a un mismo tamaño de cuerpo y dejar xs solo para las etiquetas · (4) cola de la página (L367-403): debajo de la garantía quedan 4 filas grises (sellos, "Ahora no", "¿Ya pagaste?" y la fila legal), unos 180 px de baja prioridad antes del botón → pasar "¿Ya pagaste? Recupera tu acceso" a la fila legal o juntarlo con "Ahora no" en una sola fila · (5) identidad: el dispositivo ownable de la ficha (el RAYO DORADO, FICHA-ARTE L45) no aparece en esta pantalla, que es la que vende. Con la Pieza 1 hecha, el identificador visual lo cargan solo los nodos en relieve → mostrar el rayo en el nodo "+26 / A vender" o en la insignia del día de hoy de la línea de tiempo

Detalle: USABILIDAD h1:4 h2:4 h3:4 h4:3 h5:4 h6:4 h7:3 h8:3 h9:4 h10:3 · CRAFT jerarquía:3 profundidad:4 identidad:3 movimiento:3 encaje:3 · COPY idea:4 especificidad:3 emoción:4 oferta:4 acción:4
Gate doble: 36/40 (≥36) PASA · 16/20 (≥16) PASA · copy 19/20 (≥16, ningún eje ≤2) PASA. Pasa justo, sin margen: cualquier regresión de craft la vuelve a NO LISTA.
Gate de carga cognitiva: 0 fallas de 8. La ruta tiene 5 nodos, hay 2 planes y la línea de tiempo tiene 3 pasos. Hay 1 acción primaria y ningún bloque pasa de 4 líneas.
CTA héroe vivo: pasa los 4. #1A1206 sobre #FFC23D ≈ 11:1 · whileTap 0.98 · disabled solo mientras `yendo` · h-14 (56 px), ancho completo y sticky.
FICHA-ARTE: coinciden #0F0D16, #FFC23D, #3DDC97, Bricolage + Instrument Sans, tarjeta de 20 px, chip de 12 px y píldora. La insignia dorada sólida queda cubierta por la excepción de L38. No es clon de "Umbral" ni de "Capítulo".
Copy: sin cambios desde la revisión 8. El subtítulo se traza a FICHA-AVATAR L66, el titular a L52 y "ahorras $39.89" al miedo de L26. El dato es exacto: 12×9.99 = 119.88 − 79.99 = 39.89. La garantía tiene nombre y plazo antes del CTA: PASA. Message-match: NO VERIFICABLE, porque falta el dato del 34.
Pendientes de publicación (no cuentan como defecto, por instrucción): el aviso del día 5 y el reembolso en 1 clic se verifican en Hotmart (Sesión 6). No hay prueba social porque no hay usuarios. El correo de soporte es provisional.

## Re-revisión 9: qué se corrigió (contra la revisión 8, 36/40 · 15/20 · 19/20)
- Defecto 1 (la insignia pegada a "Anual"): CORREGIDO. La anual usa pt-6 (L267) y la insignia tiene whitespace-nowrap (L285). Ahora hay ~12 px entre la insignia y "Anual", tanto a 375 como a 360. Encaje deja de caer por esto; lo que queda es menor (defectos 1 y 2 de arriba).
- Defecto 2 (el corte sobre el botón): CORREGIDO a 375. La fila "Hoy: empiezas gratis" se ve entera y el subtexto queda limpio bajo el tramo opaco de 40 px. A 360 el texto queda tapado del todo, pero asoma un borde del punto dorado (defecto 1 residual, solo se ve buscándolo).
- Defecto 3 (los enlaces terciarios): CORREGIDO. "Ahora no", "¿Ya pagaste?" y la fila legal van todos en text-sm, con min-h-11 y un solo ritmo de 44 px. Ya no hay variante accidental. Queda una cola larga (defecto 4).
- Defecto 4 (la garantía plana): CORREGIDO. Ahora usa .hairline-oro + .relieve-tarjeta (luz superior, canto y sombra), así que la garantía ya está al nivel de las tarjetas. Profundidad sube de 3 a 4.
- Defecto 5 (el dorado fuera de la ficha): RESUELTO por documentación. La excepción quedó en FICHA-ARTE L38, con la etiqueta elegida por la dueña.
- Sin regresiones: el radiogroup con flechas, el layoutId del plan activo, el conteo de montos, la línea de tiempo dinámica ($79.99 / $9.99), la hoja de vista previa ("Elegiste el plan Mensual") y el botón con el precio dinámico siguen intactos. El subrayado de "¿Ya pagaste?" en 15-planes-mensual-final es el :hover del puntero de la captura.
