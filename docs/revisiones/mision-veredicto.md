# VEREDICTO revisor-visual — Misión del día (borrador día 8 + guiada día 2 + resultado + celebración + aviso)
Fecha: 2026-10-07 23:58
Screenshot: docs/revisiones/mision-375.png
Usabilidad: 31/40
Craft: 15/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): FIEL
Veredicto: NO LISTA
Top defectos: (1) En el borrador de los días 5-29 la usuaria sigue inventando la respuesta desde cero. El ejemplo de Ana es texto estático y de otro rubro (tortas), y no hay ninguna opción tocable armada con sus propias piezas. La referencia y la landing prometen 5 nombres para elegir; eso es bloqueante de venta (Sesión 6 / gate 61) · (2) La posición del contenido salta entre fases de la misión guiada: la pregunta va centrada, "Armando…" sube arriba y deja ~500px vacíos (captura 13), y el resultado vuelve a centrarse · (3) En el borrador, el error de guardado se pinta después de "Para inspirarte", fuera de la vista y tapado por el CTA fijo · (4) El dorado se usa fuera de la ficha: "Usar plantilla" (acción secundaria) y la bombilla del ejemplo van en dorado, y la misma bombilla significa dos cosas (consejo y ejemplo) · (5) En el borrador, la tarjeta, el ejemplo y la lista entran sin stagger (segunda ronda sin corregir), y "Usar plantilla" se deshabilita sin decir por qué

## Detalle de puntaje
Usabilidad: h1:3 h2:3 h3:4 h4:3 h5:3 h6:3 h7:3 h8:3 h9:3 h10:3 = 31/40
Craft: jerarquía:3 profundidad:3 identidad:3 movimiento:3 encaje:3 = 15/20
Gate de carga cognitiva: 1 falla de 8, sin sobrecarga. La pregunta 3 tiene 7 opciones (en rejilla de 2 columnas).
CTA héroe vivo: cumple los 4. #FFC23D sobre #0F0D16 da ≈11:1. Usa whileTap 0.98 (piezas.tsx:232). No arranca deshabilitado: valida al tocar con sacudida y error junto al campo. Mide 56px, va a todo el ancho y está fijo abajo.
Test de fidelidad (public/landing/mision-v2.png): 0 de 6 fallos de estilo.
- modo ✓
- hue ✓
- display Bricolage ✓
- radios ✓
- densidad ✓
- relieve ✓
- El contenido sigue sin coincidir: la referencia muestra 5 opciones de la IA y la app un textarea. Es un problema de claim (gate 61), no de estilo.

## Re-revisión 6: verificación uno por uno de la ronda 5
1. Ejemplo resuelto en cada borrador → CORREGIDO. Hay un `ejemplo` por día en lib/misiones.ts:169-200, con la misma persona en toda la ruta, y se muestra en la sección "Así lo hizo Ana" (Mision.tsx:296-302). Queda a medias respecto del fix pedido: el ejemplo no es tocable ni sale de las piezas de la usuaria, así que reconocer sigue limitado (defecto 1).
2. Preguntas centradas en el alto → CORREGIDO. Usa `flex flex-1 flex-col justify-center` (Mision.tsx:544). El vacío ya no queda abajo: se reparte, ~85px arriba y ~125px abajo en la captura 10. Es aceptable, pero la fase "armando" no sigue el mismo patrón (defecto 2).
3. Resultado con h1 y alineación única → CORREGIDO. Tiene TituloAcento h1 "Así queda tu cliente ideal" (Mision.tsx:673), y "Cambiar mis respuestas" y "Mañana…" van los dos centrados (691 y 697; captura 14).
4. "Usar plantilla" y accesibilidad del error → CORREGIDO. El botón ya no está dentro del label (233-248). Se deshabilita con `disabled={conTexto}`, así que ya no se duplica la plantilla. El error va junto al campo con id, role=alert, aria-invalid y aria-describedby (257-268). Queda un detalle: deshabilitado no explica por qué (defecto 5).
5. Separador de la celebración → CORREGIDO. Es un `size-1 self-center rounded-full` (887) y en la captura 15 queda en la línea media.
- Arrastrados de la ronda 5: BAJA 7 "Volver a la versión base" → CORREGIDO (Empresa.tsx:619, con confirmación al salir con cambios, :381). BAJA 8 stagger en el borrador → NO CORREGIDO (solo el título tiene fade, Mision.tsx:223).

## Qué falta para que cada heurística llegue a 4
- h1 Estado: "Armando…" debe ocupar el mismo contenedor centrado que la pregunta y el resultado, con un skeleton que tenga la forma del resultado (h1 + tarjeta). Así la pantalla no salta y no queda vacía.
- h2 Lenguaje: "versión base" no dice nada a la usuaria. Cambiarlo por "tu primera versión: la mejoras cuando quieras en Mi Empresa".
- h3 Control: ya está en 4. Hay volver, Deshacer la plantilla, cambiar respuestas con chips, borrador persistido, Escape que cancela y versión base recuperable.
- h4 Consistencia: un solo patrón de layout para las 3 fases (centrado). Una bombilla solo para "consejo" y otro ícono para el ejemplo.
- h5 Prevención: un contador o tope visible de 600 caracteres, y un hint en "Usar plantilla" deshabilitado ("Borra tu texto para usarla"), o que la reemplace con Deshacer.
- h6 Reconocer: 3 opciones tocables compuestas con sus piezas (oferta + cliente), que llenen el campo al tocarlas. Al llegar la IA, las 5 del mecanismo prometido.
- h7 Flexibilidad: Ctrl/Cmd+Enter para guardar en el textarea. Que el campo guarde lo último escrito en localStorage, no solo en sessionStorage, para que no se pierda al cerrar la pestaña.
- h8 Minimalista: quitar el vacío de la fase "armando" y de la celebración (~165px entre "Mañana · Día 3" y el CTA). Que la lista "Para inspirarte" no quede cortada por el CTA en la primera vista (plegarla en un acordeón de 1 línea).
- h9 Errores: que el error de guardado se vea donde está el CTA (en su `nota` o arriba del campo), no al final del contenido.
- h10 Ayuda: que el ejemplo se adapte al rubro de la usuaria (cuenta.area) o que ofrezca 2 ejemplos de rubros distintos, con un "Usar como punto de partida".
- Craft para 4: en movimiento, stagger de 60ms en tarjeta, ejemplo y filas del borrador. En identidad, devolver el dorado solo a la acción y el dato. En encaje, label "Tu nombre" y textarea con el mismo inset izquierdo (hoy 16px contra 12px).

## Hallazgos por severidad

### ALTA
1. MisionBorrador, días 5-29 (mision-375.png y capturas 21-22). Para crear el nombre, la usuaria solo tiene un textarea vacío más un ejemplo de tortas. Sigue generando desde la memoria. → FIX (sin IA): en lib/misiones.ts, componer 3 sugerencias tocables a partir de `usadas` (oferta, cliente). Retirar de la landing el claim de "5 nombres de la IA" hasta la Sesión 6.

### MEDIA
2. Fase "armando" (captura 13, Mision.tsx:652). Usa `mt-8` arriba y deja ~500px vacíos, mientras la pregunta (544) y el resultado (671) van centrados. Al pasar de una fase a otra, el contenido salta. → FIX: `flex flex-1 flex-col justify-center px-4 py-6` y un skeleton con la forma del resultado.
3. ErrorGuardado del borrador (Mision.tsx:319). Se renderiza después de "Para inspirarte", por debajo del pliegue y bajo el CTA fijo, así que la usuaria toca y "no pasa nada" visible. → FIX: pasarlo a la `nota` de BotonPrincipal o subirlo arriba de la tarjeta del campo, con scrollIntoView.
4. Dorado fuera de la ficha (Mision.tsx:244 y 298). "Usar plantilla" y la bombilla del ejemplo van en text-gold, y FICHA-ARTE reserva el dorado para CTA, misión, nodo, dato héroe y botón central. → FIX: "Usar plantilla" en text-ink-1 con ícono ink-3, y un ícono distinto (BookOpen o Quote) en ink-3 para el ejemplo.

### BAJA
5. Movimiento del borrador (Mision.tsx:231-318). La tarjeta del campo, el ejemplo y las filas aparecen sin stagger. → FIX: un motion.div por bloque con delay de 0.06·i.
6. "Usar plantilla" deshabilitado (Mision.tsx:238). Queda gris y no explica por qué. → FIX: un title/hint "Borra tu texto para usar la plantilla", o que reemplace con Deshacer.
7. Celebración (captura 15). Quedan ~165px vacíos entre "Mañana · Día 3: tu oferta" y el CTA. → FIX: subir la línea de "Mañana" dentro de la tarjeta de la semana, o reducir el py del contenedor centrado.
