# VEREDICTO revisor-visual — Misión del día (guiada día 2 + celebración + aviso + borrador día 8)
Fecha: 2026-10-07 20:45
Screenshot: docs/revisiones/mision-375.png
Usabilidad: 28/40
Craft: 15/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): FIEL
Veredicto: NO LISTA
Top defectos: (1) el día 8 que vende la landing (mision-v2.png: "La IA usó…", 5 nombres generados) se entrega como un formulario con ___, y la pantalla dice "cuando conectemos la IA", un texto que habla del avance del desarrollo y no del mundo de la usuaria · (2) sigue el vacío muerto: ~33% bajo la tarjeta en P1/P2, ~38% entre la semana y el CTA en "Hoy ya armaste tu pieza" y ~30% en la celebración · (3) la pieza que "vuela" no llega a Mi Empresa: se desplaza un valor fijo (y:380px), se apaga en el vacío ~140px por encima del botón y el tick se enciende antes del vuelo · (4) "Usar plantilla" borra lo que la usuaria ya escribió sin pedir confirmación y sin deshacer; además el placeholder es idéntico a la plantilla, así que al tocar el botón casi no cambia nada · (5) el cierre del día 30 lista las 29 piezas en una sola tarjeta y los cierres de semana no tienen el confetti que pide FICHA-ARTE

## Detalle de puntaje
Usabilidad: h1:3 h2:3 h3:2 h4:3 h5:3 h6:3 h7:3 h8:2 h9:3 h10:3 = 28/40
Craft: jerarquía:3 profundidad:3 identidad:3 movimiento:3 encaje:3 = 15/20
Gate de carga cognitiva: 1 falla de 8, sin sobrecarga. La pregunta 3 tiene 7 opciones (en rejilla, se recorre bien) y el cierre del día 30 junta 29 ítems en una sola lista (CierreSemana, Mision.tsx:282 con `dia.dia === 30 ? cuenta.piezas`). Esto último se verificó en el código; no hay captura.
CTA héroe vivo: cumple los 4 en todos los estados. #FFC23D sobre #0F0D16 da ≈11:1. Tiene estado al tocar (`.boton-oro:active` translateY(2px) + whileTap). "Guardar en Mi Empresa" nunca arranca deshabilitado: al tocarlo valida y avisa "Completa los espacios ___". Mide 56px, va a todo el ancho y está fijo abajo en la pregunta 3, el resultado, el borrador, la celebración y el aviso.
Test de fidelidad (referencia public/landing/mision-v2.png, 1 de 6 fallos):
- modo ✓
- hue del acento ✓
- clase de la display ✓ (Bricolage, grotesk)
- radios ✓ (la píldora en las opciones está permitida por FICHA-ARTE §Radio)
- sombras/relieve ✓
- densidad ✗ (parcial): las opciones ya van en una tarjeta con hairline, como la referencia, pero P1/P2 dejan un tercio vacío y sin barra inferior, mientras que la referencia llena hasta el CTA.
Verificado en código:
- reduced-motion: chispas, vuelo, stagger y `.sacudir` ✓
- aria-live en "armando" y en la celebración ✓
- error de guardado con `role="alert"` y sin celebración falsa ✓ (lib/cuenta.ts:220-226 devuelve null)
- chips de respuestas con `disabled={bloqueado}` ✓
- borde de 2px en los dos estados de `.opcion-recorrido` ✓ (globals.css:184/196)
- encabezado compacto de 16px en todas las fases ✓
- GUIAS_BORRADOR cubre 5-6, 8-13, 15-20 y 22-29, y los cierres van en 7, 14, 21 y 30 ✓
- "te avisamos" eliminado de Mision.tsx ✓
- `base: true` se guarda, pero nada lo consume todavía: "la IA la afinará" sigue siendo una promesa sin mecanismo

## Re-revisión 3: qué se corrigió
1. Ruta frenada en el día 5 y "te avisamos" sin mecanismo → CORREGIDO. Del día 5 al 29 hay un borrador guiado que sí guarda la pieza (validación de ___ al tocar el botón). Los días 7, 14, 21 y 30 cierran la semana. Se quitó la promesa del aviso. Problema nuevo: la nota "cuando conectemos la IA, aquí te la arma en segundos" (Mision.tsx:253) es una promesa con fecha abierta, en lenguaje de desarrollo, y deja a la vista que el mecanismo que vende la landing para el día 8 todavía no existe (ver ALTA 1).
2. Vacío muerto y CTA suelto en la celebración y el aviso → CORREGIDO A MEDIAS. El CTA ya va en la barra inferior (mt-auto) en todos los estados y P1/P2 agrupan las opciones en una tarjeta con hairline ✓. Pero el bloque no se centró: el hueco solo cambió de lugar, ahora entre el contenido y el botón (capturas 07, 10, 11 y 15).
3. Concordancia del retrato → CORREGIDO. Los dolores ya no llevan pronombre ("faltan clientes nuevos"), y la captura 14 concuerda.
4. Firma "la pieza vuela a Mi Empresa" → CORREGIDO A MEDIAS. Hay un chip "Pieza N" que se mueve, pero con un desplazamiento fijo (Mision.tsx:746, `y: [0, 0, 380, 420]`) que no apunta al botón: a 375×812 se apaga unos 140px antes de llegar, y en pantallas más altas queda todavía más lejos. Además el tick "En Mi Empresa" se enciende a los 0.9s, antes de que salga el vuelo (1.1s), al revés de lo que pide FICHA-ARTE:46-47 (primero vuela y al aterrizar se enciende el tick). En la captura 15 el chip queda congelado a media opacidad en el vacío y parece un elemento perdido.
5. Desencajes (salto del título, borde que se corre al marcar, franja bajo la barra) → CORREGIDO. El encabezado mide 16px en todo el flujo, el borde es de 2px en los dos estados y la barra llega al borde (capturas 12, 14 y 21).
Otros del veredicto anterior:
- carrera de los chips durante el avance de 300 ms → CORREGIDO
- viuda en el título del día 8 → CORREGIDO (al ser compacto, entra en una línea)
- prefijo de tema en los chips de respuesta ("Edad:", "Dolor:") → NO CORREGIDO

## Hallazgos por severidad

### ALTA
1. Borrador del día 8 (capturas 21-22, Mision.tsx:253). La referencia de la landing (mision-v2.png) vende el día 8 con "La IA usó: Tu oferta · Tu cliente ideal" y 5 nombres generados para elegir. La app entrega un textarea con "Nombre: ___. Lo elegí porque ___." y explica "cuando conectemos la IA…". Quien compró por esa imagen se encuentra con otro producto, y la nota habla del avance del desarrollo, no del mundo de la usuaria. → FIX: antes de vender, conectar la IA en los días 8 y siguientes, o retirar de la landing la imagen y el claim del día 8 con IA (gate 61 de claims). Mientras tanto, cambiar la nota por algo sin fecha, como "Escríbelo a tu manera; luego lo puedes rehacer".
2. Aviso "Hoy ya armaste tu pieza" (captura 07), celebración (captura 15) y P1/P2 (capturas 10-11). Sigue habiendo un hueco vacío de 30-38% del alto de la pantalla, solo que ahora está entre el contenido y el CTA. → FIX: centrar el bloque en el alto disponible (contenedor `flex-1 flex flex-col justify-center`) o llenarlo con valor: en el aviso, la tarjeta de la pieza de mañana con lo que va a usar; en P1/P2, una barra inferior con el progreso de 3 pasos.

### MEDIA
3. Mision.tsx:742-751 (captura 15). El vuelo no tiene destino real y el tick se enciende antes que el vuelo. → FIX: medir el botón con un ref (getBoundingClientRect) para calcular el desplazamiento, o usar un `layoutId` compartido con un destino en la barra. Encender el tick en `onAnimationComplete` del vuelo.
4. Mision.tsx:231-234 y 248 (capturas 21→22). "Usar plantilla" hace `setTexto(guia.plantilla)` sin mirar lo que ya hay: sobrescribe lo escrito sin confirmar ni ofrecer deshacer (h3). Además el placeholder es la misma plantilla, así que tocar el botón solo cambia el texto de gris a blanco y parece que no hizo nada. → FIX: placeholder distinto (un ejemplo real, como "Ej.: Celda Clara, porque…"). Si ya hay texto, insertar la plantilla al final o mostrar "Plantilla puesta · Deshacer" durante 5 s.
5. Mision.tsx:282 y 316-330 (solo en código, sin captura). El cierre del día 30 lista las 29 piezas en una sola tarjeta, muy por encima de 4-5 ítems por grupo. Los cierres de semana y el día 30 celebran solo con chispas, sin el confetti que FICHA-ARTE:24 reserva para esos hitos. → FIX: en el día 30, agrupar por semana (4 filas plegables con "6 piezas"); en los cierres, añadir confetti respetando reduced-motion. Y capturar el día 7 y el día 30 para la próxima revisión.

### BAJA
6. Captura 21. El rótulo "Tu nombre" queda a ~3px del borde izquierdo del textarea y "Usar plantilla" a ~15px del borde derecho: el encabezado del campo no está alineado de forma simétrica con el textarea. → FIX: `px-1` en los dos lados y quitar el `px-3` del botón, o compensarlo con `-mr-2`.
7. Mision.tsx:140 dentro de `Pantalla` (px-4). El error de guardado lleva `mx-4` además del padding del contenedor, así que queda con 32px de margen lateral en vez de 16. → FIX: quitar `mx-4` cuando se renderiza dentro de `Pantalla`.
8. Mision.tsx:242. `key={aviso}` vuelve a montar el textarea en cada intento fallido: pierde el foco y la posición del cursor justo cuando hay que corregir. → FIX: reiniciar la sacudida con una clase o un `animate` en lugar de cambiar el `key`.
9. Mision.tsx:473 (captura 12). Los chips de respuestas siguen sin el prefijo del tema. → FIX: "Edad: 30-45", "Dolor: faltan clientes".
10. Celebración (captura 15). Es el único estado sin el encabezado con flecha de volver; la salida es el enlace de texto "Volver a Hoy". Es aceptable, pero no es igual al resto del flujo. → FIX opcional: mantener el EncabezadoMision sin título.
