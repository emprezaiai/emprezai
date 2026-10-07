# VEREDICTO revisor-visual — Mi Empresa
Fecha: 2026-10-07 23:30
Screenshot: docs/revisiones/mi-empresa-375.png
Usabilidad: 35/40
Craft: 16/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): FIEL
Veredicto: NO LISTA
Top defectos: (1) «Volver a la versión base» borra con un toque la versión que escribió el usuario, sin confirmación y sin deshacer · (2) la confirmación «¿Descartar tus cambios?» aparece dentro de la hoja, debajo del campo y del detalle, sin desplazarse a la vista ni tomar el foco; con el teclado abierto, tocar el velo o la X parece no hacer nada · (3) el rótulo de la tarjeta héroe sigue abreviado: «IDEA EN 1 PÁG.» · (4) en la tarjeta Competencia del mosaico, el número queda separado de su unidad («Tú: 7» / «días al grano») · (5) el paso del texto al campo de edición y la aparición de la confirmación son cortes secos, sin transición

## Detalle de la puntuación
USABILIDAD: 35/40 (h1:3 h2:3 h3:3 h4:4 h5:4 h6:4 h7:3 h8:3 h9:4 h10:4)
CRAFT:      16/20 (jerarquía:3 profundidad:3 identidad:3 movimiento:4 encaje:3)
COPY:       N/A (no vende)
FIDELIDAD:  FIEL (0 de 6 fallos. Mismo modo oscuro, dorado #FFC23D, verde #3DDC97 para lo hecho, Bricolage en display, radios de 20px y píldoras, relieve con sombra difusa y la misma densidad)

Gate de carga cognitiva: 0 de 8 fallos.
Capturas revisadas: mi-empresa-375.png, app/06-empresa-dia1.png, app/19-empresa-demo-dia8-final.png, app/20-empresa-demo-detalle-arriba.png y -final.png, app-360/19-empresa-demo-dia8-arriba.png.
Código revisado: components/interna/Empresa.tsx (HojaPieza completa), lib/cuenta.ts (editarPieza y restaurarPieza), app/globals.css (.tarjeta-relieve, tokens de texto y radios) y FICHA-ARTE.md.

## Hallazgos por severidad

### MEDIA
1. [Hoja, «Volver a la versión base»] Empresa.tsx:612-621 y lib/cuenta.ts:257-266. Un solo toque ejecuta restaurarPieza: el contenido vuelve al original, se borran `original` y `editadaEn`, y el texto que escribió el usuario se pierde para siempre. No hay confirmación ni deshacer, y el botón está justo debajo de «Editar con mis palabras» (min-h-11), donde es fácil tocarlo por accidente. Antes era la edición la que pisaba la versión base; ahora es la vuelta a la base la que pisa la del usuario. Fix: al restaurar, guardar la versión del usuario como alternativa (`suya`) y ofrecer «Volver a mi versión», o mostrar un «Deshacer» de 5 s en el rótulo de estado.
2. [Hoja, confirmación de descarte] Empresa.tsx:552-575. El bloque se agrega en línea, después del textarea de 6 filas y del detalle, dentro de una hoja con overflow-y-auto y altura máxima de 85dvh. No hace scrollIntoView ni mueve el foco, aunque tiene role="alertdialog". Con el teclado abierto, el usuario toca el velo o la X, la hoja no se cierra y no ve por qué. Fix: cuando confirmarSalida pase a true, hacer `scrollIntoView({block:'nearest'})` y enfocar «Seguir editando», o fijar la confirmación al pie de la hoja.

### BAJA
3. [Tarjeta héroe, rótulo] «IDEA EN 1 PÁG.» sigue abreviado (viene de RUTA[].corto). Fix: «Tu idea en 1 página» (cabe con truncate).
4. [Mosaico, tarjeta Competencia, a 375] «Ellos: +10 horas. Tú: 7» / «días al grano»: el número queda al final de la línea y su unidad pasa a la siguiente. Fix: poner un espacio duro en el resumen (`7 días`) o usar text-balance en el resumen del mosaico.
5. [Hoja, modo edición] El paso del texto al campo (:517-545) y la aparición de la confirmación (:552) son cortes secos. Fix: AnimatePresence con un fundido de 200 ms (y altura en la confirmación).
6. [Jerarquía] En la pantalla conviven 28 (h1), 20 (resumen de la pieza nueva), 18 («Mi Empresa»), 16 (semana), 14 (mosaico) y 13/12 (rótulos). Los 4 niveles se leen al entrecerrar los ojos, pero son más de 3 tamaños. El resumen en text-xl (20) queda fuera del rango de title de la ficha (16-19). Fix: pasar el título «Mi Empresa» a text-base y dejar el resumen en 19px o en text-lg extrabold.
7. [h8] Siguen los dos dorados que llevan a la misma misión (el botón central y la tarjeta «Hoy · Día 8»), además del mosaico de 6. No impide el gate.

## Re-revisión 6: qué se corrigió
| # anterior | Defecto | Estado | Evidencia |
|---|---|---|---|
| 1 | El borrador se pierde al cerrar por velo, Escape, arrastre o X | CORREGIDO, CON FALLO DE VISIBILIDAD | pedirCierre (:385-388) cubre el velo (:470), Escape (:397), el arrastre (:487) y la X (:510). La confirmación no se lleva a la vista (hallazgo 2) |
| 2 | La edición sobrescribe la versión base sin deshacer, y guardar sin cambios la marca igual | CORREGIDO, CON EFECTO SECUNDARIO | cuenta.ts:248 guarda `original` la primera vez y :239 no toca la pieza si no hay cambios. Pero restaurar destruye la versión del usuario sin red (hallazgo 1) |
| 3 | Corte en la banda del tirador y rótulo a 4 px | CORREGIDO | :494 usa color-mix con 5% de blanco, igual al tope del degradé, y mb-3. En 20-empresa-demo-detalle-arriba.png ya no se ve la franja |
| 4 | No se confirma el guardado | CORREGIDO | Rótulo con role=status: «¡Tu versión quedó guardada!» o «Volviste a la versión base» durante 2,4 s (:416-420, :501) |
| 5 | El encabezado de semana compite con el resumen | CORREGIDO | :269 usa text-base semibold. El resumen de la pieza nueva domina en las capturas de 375 y 360 |
| 7 | Edición sin transición | SIN CORREGIR | Hallazgo 5 |
| 8 | «IDEA EN 1 PÁG.» | SIN CORREGIR | Hallazgo 3 |

Delta: 34/40 → 35/40.
- Sube h5 a 4: el borrador está protegido, guardar sin cambios no toca nada y el campo vacío se valida antes de guardar.
- h3 se queda en 3: la vuelta a la versión base es una acción destructiva sin confirmación ni deshacer.
- h1 se queda en 3: la confirmación de descarte puede quedar fuera de la vista.

Craft se mantiene en 16/20: desaparece el corte de la banda, pero en encaje aparece el número separado de su unidad en el mosaico, y la jerarquía todavía usa más de 3 tamaños.

Para llegar a 36/40, lo más corto es corregir el hallazgo 1, guardando la versión del usuario al restaurar con «Volver a mi versión». Eso recupera h3. Con el hallazgo 2 también sube h1.
