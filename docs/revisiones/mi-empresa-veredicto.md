# VEREDICTO revisor-visual — Mi Empresa
Fecha: 2026-10-07 23:55
Screenshot: docs/revisiones/mi-empresa-375.png
Usabilidad: 36/40
Craft: 16/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): FIEL
Veredicto: LISTA
Top defectos: (1) en la hoja, si vuelves a la versión base y luego escribes y guardas una versión nueva, la versión anterior («Volver a mi versión») se pierde sin aviso · (2) la pantalla usa más de 3 tamaños de texto y el resumen de la pieza nueva (20 px) queda fuera del rango de título de la ficha (16-19 px) · (3) siguen dos accesos dorados a la misma misión: el botón central y la tarjeta «Hoy · Día 8» · (4) en la tarjeta Competencia del mosaico, «Tú:» queda al final de la línea y su valor pasa a la siguiente · (5) «Versión base» es un término de sistema; nombra el origen con palabras del usuario

## Detalle de la puntuación
USABILIDAD: 36/40 (h1:4 h2:3 h3:3 h4:4 h5:4 h6:4 h7:3 h8:3 h9:4 h10:4)
CRAFT:      16/20 (jerarquía:3 profundidad:3 identidad:3 movimiento:4 encaje:3)
COPY:       N/A (no vende)
FIDELIDAD:  FIEL (0 de 6 fallos. Mismo modo oscuro: fondo #0F0D16, dorado #FFC23D solo en CTA, misión y botón central, verde #3DDC97 para lo hecho, Bricolage en display, radios de 20px y píldoras, relieve con sombra difusa)

Gate de carga cognitiva: 0 de 8 fallos.
Capturas revisadas: mi-empresa-375.png, app/06-empresa-dia1.png, app/19-empresa-demo-dia8-final.png, app/20-empresa-demo-detalle-final.png, app-360/19-empresa-demo-dia8-arriba.png.
Código revisado: components/interna/Empresa.tsx (pantalla y HojaPieza completas), lib/cuenta.ts (editarPieza y restaurarPieza con tuVersion), lib/ruta.ts (rótulos cortos) y FICHA-ARTE.md.

## Hallazgos por severidad

### BAJA
1. [Hoja, después de volver a la base] Ruta: restaurar deja `tuVersion` = A (cuenta.ts:265). Si después el usuario toca «Editar con mis palabras», escribe B y guarda, editarPieza pone `tuVersion: undefined` (cuenta.ts:251) y A se pierde sin aviso. Es un camino secundario, pero borra texto del usuario. Fix: al guardar sobre la base con `tuVersion` presente, conservarla como alternativa o avisar: «Esto reemplaza tu versión anterior».
2. [Jerarquía] Conviven estos tamaños: 28 (h1), 20 (resumen de la pieza nueva), 18 («Mi Empresa»), 16 (semana), 14 (mosaico) y 12-13 (rótulos). El resumen en text-xl queda fuera del rango de título de la ficha. Fix: título «Mi Empresa» a text-base y resumen a 19 px.
3. [h8] Hay dos accesos dorados a la misma misión: el botón central y la tarjeta punteada «Hoy · Día 8». Fix: dejar la tarjeta en tinta neutra y el dorado solo en la flecha, o quitarla mientras el botón central muestre la misión.
4. [Mosaico, Competencia, a 375 y 360] «Ellos: +10 horas. Tú:» / «7 días al grano». El rótulo «Tú:» queda separado de su valor. Fix: espacio duro después de «Tú:» o text-balance en el resumen del mosaico.
5. [Hoja, rótulos] «Volviste a la versión base» y «Versión base, armada con tus respuestas» usan un término de sistema. Fix: «la versión que armamos con tus respuestas».

## Re-revisión 7: qué se corrigió
| # anterior | Defecto | Estado | Evidencia |
|---|---|---|---|
| 1 | Volver a la base borra la versión del usuario | CORREGIDO | cuenta.ts:265 guarda `tuVersion: p.contenido`. Empresa.tsx:899-918 muestra «Volver a mi versión» o «Volver a la versión base», nunca los dos a la vez, cada uno con mt-3 y min-h-11. volverATuVersion (:657) restaura y la base sigue disponible por `original`. Queda un caso borde (hallazgo 1) |
| 2 | La confirmación de descarte queda fuera de la vista | CORREGIDO | El bloque está dentro del modo edición, justo después del campo y su error (:784-823), antes del detalle. El efecto en :600-607 hace scrollIntoView con block nearest y enfoca «Seguir editando» |
| 3 | «IDEA EN 1 PÁG.» | CORREGIDO | ruta.ts:41 tiene `corto: 'Idea en 1 página'`. En la captura se lee «IDEA EN 1 PÁGINA», completo |
| 4 | El número queda separado de su unidad | CORREGIDO | En las capturas de 375 y 360 se lee «7 días al grano» en la misma línea. Queda «Tú:» separado (hallazgo 4) |
| 5 | Edición sin transición | CORREGIDO | Fundido de 200 ms en el modo lectura (:826-834) y en el modo edición (:745-751). La confirmación entra en 200 ms con desplazamiento de 6 px y sale con fundido, y respeta reduced-motion (:786-790) |

Delta: 35/40 → 36/40.
- h1 sube a 4: toda acción tiene respuesta visible (guardado, vuelta a la base, copia, descarga) y la confirmación ahora se ve y toma el foco.
- h2 se queda en 3: se quitó la abreviatura, pero sigue «versión base».
- h3 se queda en 3: volver a la base ya es reversible, pero guardar encima borra `tuVersion` sin aviso.

Craft se mantiene en 16/20: la vista de edición ya tiene transiciones, pero la jerarquía sigue con más de 3 tamaños y en el mosaico «Tú:» queda separado de su valor.

Pasa el gate doble (36/40 y 16/20) sin margen. Cualquier regresión en usabilidad lo baja a NO LISTA.
