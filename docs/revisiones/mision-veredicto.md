# VEREDICTO revisor-visual — Misión del día (guiada día 2 + celebración + aviso + borrador día 8)
Fecha: 2026-10-07 23:10
Screenshot: docs/revisiones/mision-375.png
Usabilidad: 29/40
Craft: 15/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): FIEL
Veredicto: NO LISTA
Top defectos: (1) la nota del borrador dice "la puedes mejorar cuando quieras desde Mi Empresa", pero en Mi Empresa no hay forma de editar una pieza: la hoja de la pieza solo tiene "Copiar pieza" (Empresa.tsx:440-450). Se cambió una promesa sin mecanismo por otra · (2) el día 8 sigue siendo un formulario con ___, mientras la landing vende 5 nombres generados por la IA (mision-v2.png). Está anotado como bloqueante en ESTADO.md, pero el producto entregado y el que se vende no coinciden · (3) queda vacío muerto en el resultado (captura 14, ~29% entre "Mañana, el día 3…" y el CTA) y en P1/P2 (~25% entre la tarjeta y la barra). La leyenda de la barra se parte en dos líneas y deja "Empresa" sola · (4) el indicador de progreso no es consistente: la barra de 3 tramos aparece en P1/P2, desaparece en P3 y en el resultado, y repite lo que ya dice "Paso N de 3" · (5) en el campo del borrador: el encabezado sigue desalineado (3px a la izquierda, ~15px a la derecha), `key={aviso}` sigue remontando el textarea, la fila "Deshacer" aparece y se va a los 5s sin animar y mueve todo ~50px, y tocar "Usar plantilla" dos veces duplica la plantilla

## Detalle de puntaje
Usabilidad: h1:3 h2:3 h3:2 h4:3 h5:3 h6:3 h7:3 h8:3 h9:3 h10:3 = 29/40
Craft: jerarquía:3 profundidad:3 identidad:3 movimiento:3 encaje:3 = 15/20
Gate de carga cognitiva: 1 falla de 8, sin sobrecarga. La pregunta 3 tiene 7 opciones (en rejilla de 2 columnas). El cierre del día 30 ahora va agrupado por semana: grupos de 6-7 con encabezado. Esto se verificó en el código; sigue sin captura.
CTA héroe vivo: cumple los 4. #FFC23D sobre #0F0D16 da ≈11:1. Tiene estado al tocar (`.boton-oro:active` + whileTap). "Guardar en Mi Empresa" no arranca deshabilitado: valida al tocarlo y avisa "Completa los espacios ___". Mide 56px, va a todo el ancho y está fijo abajo en P3, el resultado, el borrador, la celebración y el aviso.
Test de fidelidad (referencia public/landing/mision-v2.png, 1 de 6 fallos):
- modo ✓
- hue del acento ✓
- clase de la display ✓ (Bricolage, grotesk)
- radios ✓
- sombras/relieve ✓
- densidad ✗ (parcial): la referencia llena hasta el CTA. P1/P2 y el resultado dejan ~25-29% vacío.
- Fuera de la rúbrica visual: el contenido del día 8 no es el de la referencia (5 nombres de la IA para elegir contra un textarea con plantilla). Eso es un problema de claim (gate 61), no de estilo.
Verificado en código:
- vuelo medido con getBoundingClientRect ✓ (Mision.tsx:751-760). Destino: centro del botón − (top de la tarjeta + 28). El chip sale a top-4 y mide 28px de alto, así que aterriza sobre el botón (±2px).
- tick "En Mi Empresa" en `onAnimationComplete` ✓ (Mision.tsx:817-820). En la captura 15, a los 2.6s, el tick está encendido y no queda ningún chip perdido.
- confeti solo en cierres ✓, con 18 partículas oro/verde (Mision.tsx:770-786) y sin reduced-motion. Es una ráfaga radial en elipse, simétrica, sin gravedad ni giro: la misma mecánica de las chispas con más partículas.
- placeholder distinto de la plantilla ✓ (Mision.tsx:256)
- la plantilla se agrega al final si ya hay texto ✓, con Deshacer durante 5s ✓ (Mision.tsx:165-172, 238-275). Deshacer aparece también con el campo vacío, lo cual es aceptable.
- Aviso y celebración centrados (`centrado` / `flex-1 justify-center`) ✓ (capturas 07 y 15)
- "cuando conectemos la IA" eliminado de la UI ✓. Solo queda en comentarios de código (Mision.tsx:5-6, misiones.ts:3, 164-165).
- "mejorar desde Mi Empresa": NO EXISTE el mecanismo. Grep de editar/textarea/guardarPieza en components/interna: solo aparece en Mision.tsx. La hoja de pieza de Empresa.tsx solo copia.
- Días 7 y 30 sin captura (CierreSemana): la agrupación y el confeti solo se verificaron en el código.

## Re-revisión 4: qué se corrigió
1. Promesa de IA con fecha en el borrador (ALTA 1) → CORREGIDO A MEDIAS. Se quitó "cuando conectemos la IA" y la IA real quedó como bloqueante en ESTADO.md (gate 61) ✓. Problema nuevo: la nota que la reemplaza ("la puedes mejorar cuando quieras desde Mi Empresa", Mision.tsx:276) promete una función que no existe, porque Mi Empresa no permite editar. Además, el día 8 que vende la landing sigue sin entregarse.
2. Vacío muerto (ALTA 2) → CORREGIDO A MEDIAS. El aviso (07) y la celebración (15) ahora centran el bloque y se leen como composición intencional ✓. P1/P2 tienen barra de progreso fija abajo ✓, aunque sigue un ~25% vacío entre la tarjeta y la barra. El resultado (14) conserva ~29% de vacío.
3. Firma del vuelo y orden del tick (MEDIA 3) → CORREGIDO. El destino se mide sobre el botón real y el tick se enciende al aterrizar. El vuelo en sí no se pudo ver en una captura estática; queda verificado en el código.
4. "Usar plantilla" que pisaba lo escrito (MEDIA 4) → CORREGIDO. El placeholder es distinto, la plantilla se agrega al final y hay Deshacer de 5s (captura 22). Quedan dos detalles: un doble toque duplica la plantilla, y la fila de Deshacer desplaza el contenido sin animar.
5. Día 30 con 29 ítems sin agrupar y cierres sin confeti (MEDIA 5) → CORREGIDO EN CÓDIGO, SIN CAPTURA. Hay encabezados por semana y confeti en los cierres. No se agregaron filas plegables y los días 7/30 siguen sin capturarse.
Bajas anteriores:
- 6 (asimetría del encabezado del campo) → NO CORREGIDO (capturas 21-22)
- 7 (`mx-4` en ErrorGuardado, Mision.tsx:140) → NO CORREGIDO
- 8 (`key={aviso}` en el textarea, Mision.tsx:250) → NO CORREGIDO
- 9 (prefijo de tema en los chips de respuestas) → NO CORREGIDO
- 10 (celebración sin encabezado) → sin cambio; es aceptable

## Hallazgos por severidad

### ALTA
1. Mision.tsx:276 + Empresa.tsx:440-450 (capturas 21-22). "La puedes mejorar cuando quieras desde Mi Empresa" no tiene mecanismo: la hoja de la pieza solo copia. La usuaria guarda una versión floja creyendo que podrá rehacerla y no puede (h3). → FIX: agregar "Editar" en la hoja de la pieza de Empresa.tsx (textarea con el contenido + guardarPieza que sobrescribe ese día), o cambiar la nota a "Revísala antes de guardar: queda como tu pieza de hoy".
2. Día 8 (capturas 21-22 contra mision-v2.png). La landing vende "La IA usó…" con 5 nombres para elegir, y la app entrega una plantilla con ___. → FIX: conectar la IA en los días 5-29 antes de publicar, o retirar de la landing la imagen y el claim del día 8 (gate 61).

### MEDIA
3. Resultado (captura 14) y P1/P2 (capturas 10-11). En el resultado hay ~235px vacíos entre "Mañana, el día 3 (tu oferta) usa esta pieza." y el CTA. En P1/P2 hay ~200px vacíos entre la tarjeta y la barra, y la leyenda se parte en 2 líneas con "Empresa" sola. → FIX: en el resultado, `flex-1 justify-center` igual que en la celebración. Acortar la leyenda a "Toca una opción y seguimos" para que entre en 1 línea.
4. Mision.tsx:522-524 y 675-684 (capturas 10-12). El progreso se muestra dos veces ("Paso N de 3" arriba y la barra abajo) y la barra desaparece en P3 y en el resultado. → FIX: un solo indicador constante. Por ejemplo, poner la barra de 3 tramos sobre el CTA también en P3 y quitar "Paso N de 3", o eliminar la barra y dejar solo la leyenda.

### BAJA
5. Mision.tsx:234-247 (capturas 21-22). "Tu nombre" queda a 3px del borde izquierdo y "Usar plantilla" a ~15px del derecho. → FIX: `-mr-2` en el botón, o `px-1` en ambos lados sin el `px-3` interno.
6. Mision.tsx:261-275. La fila "Pusimos la plantilla · Deshacer" entra y sale sin animación y empuja ~50px el contenido de abajo a los 5s, justo mientras la usuaria escribe. → FIX: AnimatePresence con altura animada, o reservar la línea dentro del área de la nota.
7. Mision.tsx:240. Un segundo toque en "Usar plantilla" vuelve a agregar la plantilla. → FIX: ocultar o deshabilitar el botón si el texto ya contiene la plantilla.
8. Mision.tsx:250. `key={aviso}` remonta el textarea en cada intento fallido y se pierde el foco. → FIX: reiniciar la sacudida con una clase, sin cambiar el key.
9. Captura 15. El "·" entre "Racha de 2 días" y "2 de 30 piezas" queda por encima de la línea media del texto. → FIX: separador con `self-center` o un span de 4px con `rounded-full`.
10. Mision.tsx:140. `mx-4` dentro de `Pantalla` deja el error con 32px de margen lateral. → FIX: quitar `mx-4` en ese contexto.
