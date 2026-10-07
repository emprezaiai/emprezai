# VEREDICTO revisor-visual — Mi Empresa
Fecha: 2026-10-07 16:00
Screenshot: docs/revisiones/mi-empresa-375.png
Usabilidad: 30/40
Craft: 14/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): FIEL
Veredicto: NO LISTA
Top defectos: (1) el rótulo «PREGUNTAS DE…» se corta en la primera tarjeta del mosaico · (2) el mosaico no tiene identidad propia y falta la firma de movimiento de la ficha · (3) en «Hoy · Día 8», «minutos» queda sola en la segunda línea y la acción del día queda al fondo · (4) la hoja de detalle no bloquea el scroll del fondo ni se cierra arrastrando · (5) el ícono de compartir no es el de la referencia

## Detalle de la puntuación
USABILIDAD: 30/40 (h1:3 h2:3 h3:3 h4:3 h5:3 h6:3 h7:3 h8:3 h9:3 h10:3)
CRAFT:      14/20 (jerarquía:3 profundidad:3 identidad:2 movimiento:3 encaje:3)
COPY:       N/A (no vende)
FIDELIDAD:  FIEL (0 de 6 fallos. Mismo modo oscuro, dorado #FFC23D, Bricolage en display, radios de 18-22px, densidad de resúmenes de 1 a 3 líneas y relieve con sombra difusa. Solo cambia un detalle menor: el ícono de compartir.)

Gate de carga cognitiva: 0 de 8 fallos críticos. Al límite: la Semana 1 abierta muestra 6 tarjetas, una más que el tope de 4-5, pero están agrupadas y se pliegan.
Capturas revisadas: mi-empresa-375.png, app/19-empresa-demo-dia8-arriba.png y -final.png, app/20-empresa-demo-detalle-arriba.png y -final.png (la ruta 20-empresa-demo-detalle.png no existe), app/06-empresa-dia1.png y app-360/19-empresa-demo-dia8-arriba.png.
Código revisado: components/interna/Empresa.tsx, lib/cuenta.ts y lib/misiones.ts (campo resumen), y FICHA-ARTE.md.

## Hallazgos por severidad

### MEDIA
1. [Mosaico, fila 1, tarjeta izquierda] El rótulo dice «PREGUNTAS DE…», cortado con puntos suspensivos, a 375 y a 360px. Las filas ya se alinean, pero ahora el rótulo no dice qué pieza es. Archivos: Empresa.tsx:40 (`rotulo`) y :255 (`line-clamp-1`). Fix: agregar un rótulo corto de 16 caracteres o menos por día en RUTA («Validación», «Competencia»), usarlo en la tarjeta y dejar el truncado solo como respaldo.
2. [Mosaico completo] Las tarjetas son oscuras, con label en mayúsculas y texto; no tienen ningún dispositivo propio. Lo único con identidad es el rayo del botón central, que es de la navegación y no de esta pantalla. Sigue faltando la firma de la ficha: «al guardar una pieza, vuela a Mi Empresa y el tick se enciende en verde». La tarjeta «Nueva» tampoco tiene ningún énfasis animado. Fix: cuando la pieza es de hoy, la tarjeta héroe entra con un spring (bounce .25) y su segmento de la barra se enciende en verde con un pulso.
3. [Final del scroll, tarjeta «Hoy · Día 8»] «minutos» sigue sola en la segunda línea (defecto 12 del veredicto anterior, sin corregir). Archivo: Empresa.tsx:279. Además, la acción del día queda dos pantallas abajo y fuera del grupo de su semana, sin encabezado. Fix: agregar `text-pretty` y acortar a «{pieza} · 5 minutos».
4. [Hoja de detalle] El botón atrás, Escape, el velo y la trampa de foco funcionan. Falta bloquear el scroll del fondo y cerrar arrastrando hacia abajo, que es lo que el usuario intenta primero en una hoja así. Archivo: Empresa.tsx:362-373. Fix: poner `document.body.style.overflow='hidden'` en un useEffect con limpieza, y `drag="y"` con cierre cuando el desplazamiento pase de 100px.

### BAJA
5. [Botón de compartir, arriba a la derecha] Sigue `Share2` (nodos) y la referencia usa la flecha hacia arriba. Archivo: Empresa.tsx:10 y :148. Fix: usar `Share` de Lucide.
6. [Movimiento] `entrar(4)` en «lo que viene» (:274) choca con `entrar(2 + gi)` cuando hay 3 o más semanas (:213), y dos bloques entran a la vez. Fix: usar `entrar(2 + grupos.length)`.
7. [Jerarquía] Hay 6 tamaños de texto en pantalla: título del negocio, «Mi Empresa», la tarjeta héroe a 18px, el encabezado de semana a 16px, el cuerpo de las tarjetas a 14px y el label a 12px. Fix: unificar el encabezado de semana con «Mi Empresa» (mismo token title).
8. [Esqueleto de carga] Sigue el esqueleto genérico del Marco, con la forma de «Hoy». Es aceptable.

## Re-revisión 2: qué se corrigió
| # anterior | Defecto | Estado | Evidencia |
|---|---|---|---|
| 1 | Mosaico cortado a media palabra | CORREGIDO | Resúmenes completos en el screenshot; `resumenDe` (:32-38) usa el resumen guardado, luego la 1ª frase y, si no, corta por palabra |
| 2 | Cuerpo en Bricolage | CORREGIDO | :204 y :392 en sans `font-semibold`; en la captura de la hoja el cuerpo va en Instrument Sans |
| 3 | Día 1 vacío y mudo | CORREGIDO | 06-empresa-dia1.png: 3 fantasmas hundidos con candado (Día 2, 3 y 4) |
| 4 | Error falso al cancelar compartir | CORREGIDO | :118 ignora AbortError |
| 5 | Lista plana sin grupos | CORREGIDO | Grupos por semana con encabezado, contador y plegado (:124-268) |
| 6 | Rótulo de 2 líneas que desalineaba la fila | PARCIAL | La fila ya se alinea, pero ahora se lee «PREGUNTAS DE…» (hallazgo 1) |
| 7 | revokeObjectURL inmediato | CORREGIDO | :103 a los 2 s; texto neutro en :104 |
| 8 | Hoja sin atrás ni foco | PARCIAL | pushState + popstate, trampa de foco, foco devuelto y Escape funcionan; falta el bloqueo de scroll del fondo (hallazgo 4) |
| 9 | Aviso permanente que empujaba el layout | CORREGIDO | Toast fijo que se va a los 4 s (:69-73, :298-310) |
| 10 | «¡Copiada!» permanente | CORREGIDO | Vuelve a su estado a los 2.4 s (:346-350) |
| 11 | Mosaico sin escalonar | PARCIAL | Ya entra tarjeta por tarjeta (:244-248); la firma de la ficha y el énfasis de la pieza nueva siguen ausentes (hallazgo 2) |
| 12 | «minutos» huérfana | NO CORREGIDO | 19-empresa-demo-dia8-final.png |
| 13 | Ícono Share2 | NO CORREGIDO | Empresa.tsx:148 |
| 14 | Esqueleto genérico | NO CORREGIDO | Aceptable |

Delta: 27/40 → 30/40 (h8, h9 y h10 suben de 2 a 3) · 13/20 → 14/20 (encaje sube de 2 a 3). Sigue sin pasar el gate doble (≥36/40 y ≥16/20).
