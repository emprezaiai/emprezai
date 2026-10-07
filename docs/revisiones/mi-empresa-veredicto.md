# VEREDICTO revisor-visual — Mi Empresa
Fecha: 2026-10-07 21:00
Screenshot: docs/revisiones/mi-empresa-375.png
Usabilidad: 34/40
Craft: 16/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): FIEL
Veredicto: NO LISTA
Top defectos: (1) al editar una pieza, tocar fuera de la hoja, arrastrarla o pulsar Escape cierra todo y borra lo escrito sin avisar · (2) «Guardar mi versión» reemplaza la versión base para siempre: no hay deshacer ni forma de volver a la original, y si guardas sin cambiar nada igual queda marcada como «tu versión» · (3) el tirador fijo de la hoja tiene un fondo liso que tapa la luz superior de la tarjeta; queda una franja más oscura con un corte visible justo encima de «DÍA 5 · LISTA», que queda pegado a 4px · (4) al guardar la edición, la única señal es el cambio de rótulo a «tu versión»: no hay un «Guardada» visible · (5) jerarquía: en pantalla conviven 5 tamaños de texto (28/20/18/14/12) y el encabezado de semana (18 bold) sigue muy cerca del resumen de la pieza nueva (20 extrabold)

## Detalle de la puntuación
USABILIDAD: 34/40 (h1:3 h2:3 h3:3 h4:4 h5:3 h6:4 h7:3 h8:3 h9:4 h10:4)
CRAFT:      16/20 (jerarquía:3 profundidad:3 identidad:3 movimiento:4 encaje:3)
COPY:       N/A (no vende)
FIDELIDAD:  FIEL (0 de 6 fallos. Mismo modo oscuro, dorado #FFC23D, Bricolage en display, radios de 18-22px y píldoras, relieve con sombra difusa y la misma densidad)

Gate de carga cognitiva: 0 de 8 fallos. Queda al límite la Semana 1 abierta, con 6 tarjetas agrupadas que se pliegan.
Capturas revisadas: mi-empresa-375.png, app/06-empresa-dia1.png, app/19-empresa-demo-dia8-final.png, app/20-empresa-demo-detalle-arriba.png y -final.png, app-360/06-empresa-dia1-final.png y app-360/19-empresa-demo-dia8-arriba.png.
Código revisado: components/interna/Empresa.tsx, lib/cuenta.ts (editarPieza, guardarCuenta y el evento de suscripción), app/globals.css (.tarjeta-relieve, .hairline-oro, .relieve-tarjeta) y FICHA-ARTE.md.

## Hallazgos por severidad

### MEDIA
1. [Hoja de una pieza, modo edición] El velo (onClick={onCerrar}, Empresa.tsx:428), Escape (:372), el arrastre del tirador (:444-446) y la X cierran la hoja con la edición a medias. `borrador` vive dentro de HojaPieza, así que lo escrito se pierde sin aviso. En un celular, tocar el velo por accidente es fácil. Fix: si `editando && borrador !== pieza.contenido`, pedir confirmación («¿Descartar tus cambios?») o conservar el borrador en el estado del padre o en sessionStorage.
2. [Hoja, «Guardar mi versión»] editarPieza (lib/cuenta.ts:236) sobrescribe `contenido` y pone `base: false`. La versión armada con las respuestas se pierde y no hay deshacer ni un «volver a la versión base». Además, si se guarda sin cambiar el texto, igual se fija `editadaEn` y el rótulo pasa a «tu versión». Fix: guardar `original` la primera vez que se edita y ofrecer «Volver a la versión base». Si `texto === p.contenido`, no tocar nada y solo cerrar el modo edición.

### BAJA
3. [Hoja, zona del tirador] La banda fija (:452) usa `bg-raised` liso. La hoja es `.tarjeta-relieve`, con un degradé blanco del 5% arriba, así que la banda queda más oscura que el cuerpo de la hoja y se ve un corte horizontal justo encima de «DÍA 5 · LISTA» (20-empresa-demo-detalle-arriba.png, y≈975 en la captura). Con mb-1, el rótulo queda a 4px de ese corte. Fix: quitar el fondo liso de la hoja y ponerle a la banda el mismo degradé (o pasar el degradé a un pseudo-elemento fijo), y subir a mb-2 o mb-3.
4. [Hoja, después de guardar] guardarEdicion (:405-416) cierra el modo edición sin confirmar nada, mientras que copiar sí dice «¡Copiada!». Fix: mostrar «Guardada» durante 2 s en el botón o en el rótulo, con el mismo patrón de `copiado`.
5. [Jerarquía] En la pantalla hay 28 (h1), 20 (resumen de la pieza nueva), 18 (título «Mi Empresa» y encabezado de semana), 14 y 12. La protagonista ya domina por el peso, pero 20 frente a 18 no se distingue bien al entrecerrar los ojos. Fix: bajar el encabezado de semana a text-base semibold, o subir el resumen de la pieza nueva a text-2xl.
6. [Identidad en estático] El mosaico sigue siendo tarjeta oscura con rótulo y texto. El rayo y los nodos en relieve solo se ven en el botón central. No impide el gate.
7. [Movimiento, modo edición] El cambio entre el texto y el campo de edición (:473-501) es un corte seco, sin transición. Fix: AnimatePresence con un fundido de 200ms.
8. [Rótulo de la tarjeta héroe] «IDEA EN 1 PÁG.» es una abreviatura. Mejor «Idea en 1 página» o «Tu idea en 1 página».

## Re-revisión 5: qué se corrigió
| # anterior | Defecto | Estado | Evidencia |
|---|---|---|---|
| 1 | «Hoy · Día 8» al fondo | CORREGIDO | Empresa.tsx:234-247: la tarjeta va justo debajo de la pieza nueva. Se ve en la primera vista a 375 y a 360 |
| 2 | Contador «6» en una semana completa | CORREGIDO | :273 cuenta las piezas guardadas de la semana sobre el total de la ruta. En pantalla dice «7/7» |
| 3 | Vacío muerto bajo los fantasmas en el día 1 | CORREGIDO | :325-330 agrega una línea con ícono de pieza: «Al día 30 aquí estará tu negocio completo…» (06-empresa-dia1.png, también a 360) |
| 4 | El resumen de la pieza nueva empata con el encabezado de semana | CORREGIDO A MEDIAS | :230 usa font-display text-xl extrabold y ya domina, pero queda la cercanía 20/18 (hallazgo 5) |
| 5 | Tracking de rótulo desigual y X desalineada | CORREGIDO | El tracking es .04em en la tarjeta héroe (:213), en el mosaico (:298) y en la hoja (:458). La X (:468, mt-2) ya queda a la altura del título |
| 6 | El tirador de la hoja no se queda fijo | CORREGIDO, CON EFECTO SECUNDARIO | :452 tiene sticky -top-4, pero su fondo liso crea el corte de la franja (hallazgo 3) |
| nuevo | Editar con mis palabras | IMPLEMENTADO CON FALLOS | Cancelar, validación de vacío y error de guardado con solución están bien. La fecha se conserva (lib/cuenta.ts:236 no toca `fecha`), así que la racha no se mueve. La cuenta se actualiza por el evento (:90). Fallan la pérdida silenciosa del borrador y la sobrescritura sin deshacer (hallazgos 1 y 2) |

Delta: 32/40 → 34/40.
- Suben 1 punto cada uno: h4 a 4 (sin variantes accidentales y el contador ya es coherente), h9 a 4 (los errores de edición, copia y compartir dicen qué pasó y qué hacer) y h10 a 4 (el día 1 enseña lo que viene).
- Baja 1 punto: h3, de 4 a 3, porque la edición sobrescribe sin deshacer y la hoja se cierra con el borrador a medias.
- Se mantienen h5 en 3, ahora por el borrador que se pierde, y h8 en 3 por los dos dorados que llevan a la misma misión (el botón central y la tarjeta «Hoy») y el mosaico de 6.

Craft se queda en 16/20: se corrigieron el tracking y la X, pero aparece el corte de la banda del tirador.

Para llegar a 36/40, lo más corto es proteger el borrador (hallazgo 1) y guardar la versión original con «Volver a la versión base» (hallazgo 2). Eso recupera h3 y h5.
