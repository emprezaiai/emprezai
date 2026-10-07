# VEREDICTO revisor-visual — Misión del día (borrador día 8 + guiada día 2 + resultado + celebración + aviso)
Fecha: 2026-10-07 23:45
Screenshot: docs/revisiones/mision-375.png
Usabilidad: 30/40
Craft: 15/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): FIEL
Veredicto: NO LISTA
Top defectos: (1) el borrador de los días 5-29 (22 de los 30 días) deja a la usuaria con un campo vacío y una plantilla con ___: no le muestra ninguna opción para elegir, ni siquiera en la tarea más creativa (inventar el nombre). Además, la landing vende 5 nombres generados por la IA; eso es bloqueante de venta (Sesión 6 / gate 61) · (2) en P1/P2 siguen ~200px vacíos entre la tarjeta y la barra (captura 10) · (3) el resultado (captura 14) no tiene título ni h1: la tarjeta flota en medio de la pantalla, y la alineación se mezcla ("Cambiar mis respuestas" va centrado y "Mañana…" a la izquierda) · (4) el botón "Usar plantilla" está anidado dentro del <label>, así que el nombre accesible del campo queda "Tu nombre Usar plantilla". El error del borrador sale bajo el CTA y el campo no tiene aria-invalid. Y cuando la usuaria completa los ___, el botón se reactiva y agrega otra plantilla · (5) el "·" de la celebración sigue más alto que la línea media del texto (tercera ronda sin corregirse)

## Detalle de puntaje
Usabilidad: h1:3 h2:3 h3:3 h4:3 h5:3 h6:3 h7:3 h8:3 h9:3 h10:3 = 30/40
Craft: jerarquía:3 profundidad:3 identidad:3 movimiento:3 encaje:3 = 15/20
Gate de carga cognitiva: 1 falla de 8, sin sobrecarga. La pregunta 3 tiene 7 opciones (en rejilla de 2 columnas).
CTA héroe vivo: cumple los 4. #FFC23D sobre #0F0D16 da ≈11:1. Usa whileTap 0.98 (BotonPrincipal, piezas.tsx:232). No arranca deshabilitado: valida al tocar, sacude el campo y avisa "Completa los espacios ___". Mide 56px, va a todo el ancho y está fijo abajo.
Test de fidelidad (referencia public/landing/mision-v2.png, 0 de 6 fallos de estilo):
- modo ✓
- hue del acento ✓
- clase de la display ✓ (Bricolage, grotesk)
- radios ✓
- densidad ✓ (en el día 8 la pantalla llena hasta el CTA)
- sombras/relieve ✓
- Fuera de la rúbrica visual: el contenido no coincide. La referencia muestra 5 nombres de la IA para elegir; la app entrega un campo de texto con plantilla. Es un problema de claim (gate 61), no de estilo, y está anotado como bloqueante en ESTADO.md.

## Re-revisión 5: verificación uno por uno de la ronda 4
1. "Editar desde Mi Empresa" sin mecanismo (ALTA 1) → CORREGIDO. La hoja de la pieza tiene "Editar con mis palabras", con su propio textarea, Guardar mi versión, Cancelar y error con solución (Empresa.tsx:473-543). Se apoya en editarPieza (lib/cuenta.ts:232) y se ve en la captura 20. Queda un detalle: al editar se pierde la versión base, porque no hay forma de "volver a la versión base".
2. Día 8 sin IA (ALTA 2) → NO CORREGIDO, fuera de alcance. Conectar la IA es la Sesión 6 y ya está anotado como bloqueante de venta. Se puntúa lo que la pantalla hace hoy: plantilla + consejo + "Para inspirarte", sin opciones reconocibles (ver defecto 1).
3. Vacío muerto (MEDIA 3) → CORREGIDO A MEDIAS. El resultado ahora va centrado con `flex-1 justify-center` ✓, pero flota sin título. La leyenda de P1/P2 entra en 1 línea ✓. El vacío de ~200px en P1/P2 sigue ✗ (captura 10).
4. Indicador doble o inconsistente (MEDIA 4) → CORREGIDO. "Paso N de 3" pasó a sr-only (Mision.tsx:535), y la barra de tramos aparece abajo en P1, P2 y P3 (capturas 10 y 12).
5. Asimetría del encabezado del campo → CORREGIDO. Medido en la captura: "Tu nombre" queda a ~16px del borde izquierdo y "Usar plantilla" a ~16px del derecho.
6. Fila de Deshacer sin animar → CORREGIDO. Usa AnimatePresence con altura animada y respeta reduced-motion (Mision.tsx:265-288).
7. Plantilla duplicada → CORREGIDO A MEDIAS. El botón se deshabilita mientras el texto contiene la plantilla (Mision.tsx:168, 241). Pero al completar los ___ el texto ya no contiene la plantilla, el botón se reactiva y un toque agrega otra con ___.
8. `key={aviso}` en el textarea → CORREGIDO. La sacudida ahora usa useAnimate sin remontar (Mision.tsx:166, 190). En el input de "Otra cosa" sigue `key={aviso}` (Mision.tsx:592); lo compensa autoFocus, así que es aceptable.
9. "·" de la celebración desalineado → NO CORREGIDO (captura 15, Mision.tsx:874).
10. `mx-4` en ErrorGuardado → CORREGIDO (Mision.tsx:140).

## Hallazgos por severidad

### ALTA
1. MisionBorrador (mision-375.png y capturas 21-22; afecta a los días 5-29). Para crear el nombre del negocio, la pantalla solo da un textarea vacío y "Nombre: ___. Lo elegí porque ___.". Eso obliga a generar desde la memoria, no a reconocer (h6/h10), en el 73% de la ruta. → FIX (sin IA): componer en lib/misiones.ts 3 ejemplos tocables a partir de las piezas ya guardadas (oferta, cliente) que llenen el campo al tocarlos. Retirar de la landing la imagen y el claim "5 nombres de la IA" hasta la Sesión 6.

### MEDIA
2. P1/P2 (captura 10, Mision.tsx:526-532). Hay ~200px vacíos entre la tarjeta de opciones y la barra inferior. → FIX: `flex flex-1 flex-col justify-center` en la sección de preguntas de opción única, igual que ya se hizo en el resultado.
3. Resultado (captura 14, Mision.tsx:653-689). La pantalla no tiene h1: la tarjeta flota con ~110px vacíos arriba. "Cambiar mis respuestas" va centrado y "Mañana, el día 3…" alineado a la izquierda. → FIX: un TituloAcento h1 sobre la tarjeta ("Tu cliente ideal, listo") y centrar la línea de "Mañana" (o alinear las dos a la izquierda).
4. Mision.tsx:237-252. El <button> está dentro del <label>, lo que es HTML inválido (un elemento etiquetable dentro de un label). El nombre accesible del textarea pasa a ser "Tu nombre Usar plantilla". El error del borrador se anuncia bajo el CTA, lejos del campo, y el textarea no tiene aria-invalid ni aria-describedby (Empresa.tsx sí los usa). → FIX: sacar el botón a un div hermano del label y enlazar el error con aria-describedby.

### BAJA
5. Captura 15, Mision.tsx:874. El "·" entre "Racha de 2 días" y "2 de 30 piezas" queda por encima de la línea media. → FIX: un span de 4px con `rounded-full bg-ink-3 self-center`.
6. Mision.tsx:241. Después de completar los ___, "Usar plantilla" se reactiva y agrega una segunda plantilla. → FIX: deshabilitarlo mientras `anterior !== null` o mientras el texto no esté vacío. También se puede renombrar a "Empezar de nuevo con la plantilla" y que reemplace con Deshacer.
7. Empresa.tsx:405-416. "Guardar mi versión" sobrescribe la pieza base sin forma de deshacer. → FIX: guardar `contenidoBase` y ofrecer "Volver a la versión base".
8. Movimiento en el borrador. Solo el título entra con fade. La tarjeta del campo y las filas de "Para inspirarte" aparecen sin stagger, mientras que la guiada sí lo tiene. → FIX: stagger de 60ms en tarjeta y filas (firma de FICHA-ARTE).
