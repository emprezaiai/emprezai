# VEREDICTO revisor-visual — Mi Empresa
Fecha: 2026-10-07 12:00
Screenshot: docs/revisiones/mi-empresa-375.png
Usabilidad: 27/40
Craft: 13/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): FIEL
Veredicto: NO LISTA
Top defectos: (1) el mosaico es un muro de texto cortado a mitad de palabra · (2) los párrafos usan la fuente de títulos, contra lo que dice FICHA-ARTE · (3) el día 1 deja un tercio de la pantalla vacío y sin decir nada · (4) cancelar la hoja de compartir muestra un error falso · (5) la lista no se agrupa por semana y a 30 piezas no se puede recorrer

## Detalle de la puntuación
USABILIDAD: 27/40 (h1:3 h2:3 h3:3 h4:3 h5:3 h6:3 h7:3 h8:2 h9:2 h10:2)
CRAFT:      13/20 (jerarquía:3 profundidad:3 identidad:2 movimiento:3 encaje:2)
COPY:       N/A (no vende)
FIDELIDAD:  FIEL (1 de 6 fallos: densidad. La referencia usa resúmenes de 1 a 3 líneas; aquí cada tarjeta va a 4 líneas cortadas con puntos suspensivos)

Gate de carga cognitiva: 1 de 8 fallos. Agrupar en bloques de 4-5 ítems no se cumple: con 30 piezas el mosaico tiene 29 tarjetas iguales, sin grupos ni filtros. No es sobrecarga crítica.
Comprobaciones de código: h3, h7 y movimiento verificados en components/interna/Empresa.tsx, components/interna/Marco.tsx, lib/cuenta.ts y app/globals.css.

## Hallazgos por severidad

### ALTA
1. [Mosaico, las 6 tarjetas] Todas cortan con «…» a mitad de palabra: «Tu…», «3)…», «sueño n…», «su d…». Se ve sin buscarlo. La referencia aprobada muestra resúmenes completos y cortos. Archivo: components/interna/Empresa.tsx:173 (`line-clamp-4` sobre `p.contenido`). Fix: agregar a PiezaGuardada un campo `resumen` de 60 caracteres o menos, armado por pieza («$19 · pago único», «3 cursos analizados: todos duran +10 h»), y usar line-clamp-3 solo como respaldo.
2. [Tarjeta héroe y hoja de detalle] Desvío de FICHA-ARTE: la ficha dice «Bricolage Grotesque SOLO display», pero los párrafos de 4 líneas van en Bricolage bold. Archivos: Empresa.tsx:159 (`font-display text-lg font-bold`) y Empresa.tsx:264 (`font-display text-lg leading-snug font-bold`). Fix: en los dos lugares, cuerpo en Instrument Sans 600 a 17px (`font-sans font-semibold`). Bricolage queda solo para títulos.
3. [Día 1, debajo de «Mañana · Día 2»] Unos 270px de pantalla quedan vacíos y no dicen nada (06-empresa-dia1.png). Es la primera visita a la pestaña y no muestra qué se va a armar. Archivo: Empresa.tsx:183-204. Fix: cuando haya menos de 4 piezas, mostrar como fantasmas hundidos (bg-sunken, candado) las 3-4 piezas que siguen de SEMANAS[n], con su nombre y su día.

### MEDIA
4. [Chip de compartir] Si el usuario cierra la hoja nativa sin compartir, `navigator.share` rechaza con AbortError, el `catch` lo trata como fallo y muestra «No se pudo compartir». Es un error falso. Archivo: Empresa.tsx:76-77. Fix: `catch (err) { if ((err as DOMException).name === 'AbortError') return; ... }`.
5. [Mosaico a 30 piezas] El mosaico es plano y va de la pieza más nueva a la más vieja, sin grupos. A 30 tarjetas no se puede recorrer (regla UX 14 y gate de carga). Archivo: Empresa.tsx:164-178. Fix: agrupar por semana con un encabezado de label («Semana 1 · Tu idea, validada») y plegar las semanas cerradas.
6. [Fila 1 del mosaico] «PREGUNTAS DE VALIDACIÓN» ocupa 2 líneas y baja el texto 16px respecto de «COMPETENCIA», así que los textos de la fila no arrancan a la misma altura. El encaje se rompe a la vista. Archivo: Empresa.tsx:32 (`rotulo`) y :172. Fix: rótulos cortos de 18 caracteres o menos («Validación») o `line-clamp-1` en el rótulo.
7. [Descargar] `URL.revokeObjectURL` corre en la misma línea que `a.click()`, y en Safari/Firefox eso puede cancelar la descarga. Aun así se muestra «Descargamos tu negocio», sin saber si funcionó. Archivo: Empresa.tsx:62-64. Fix: `setTimeout(() => URL.revokeObjectURL(url), 1000)` y un texto neutro («Tu archivo se está descargando»).
8. [Hoja de detalle] El botón atrás de Android no cierra la hoja: no hay entrada en el historial y `?pieza=N` sigue en la URL, así que al recargar se vuelve a abrir. Tampoco atrapa el foco, no lo devuelve al cerrar ni bloquea el scroll de fondo. Archivo: Empresa.tsx:41-44, 207, 218-223. Fix: abrir con `router.push('?pieza=N')`, cerrar con `router.back()`, y agregar un focus trap y `overflow:hidden` en el body mientras la hoja está abierta.

### BAJA
9. [Avisos] Una vez puesto, `aviso` nunca se borra. Además, al aparecer entre el progreso y las tarjetas empuja el layout. Archivo: Empresa.tsx:133-135. Fix: borrarlo con `setTimeout` a los 4 s y mostrarlo como toast fijo sobre la barra.
10. [Botón «Copiar pieza»] «¡Copiada!» se queda para siempre. Archivo: Empresa.tsx:228. Fix: volver a `'no'` a los 2 s.
11. [Movimiento] Las 6 tarjetas del mosaico entran como un solo bloque (`entrar(2)` en el `ul`, :164), sin escalonarse una por una. Tampoco está la firma de la ficha («la pieza vuela a Mi Empresa y el tick se enciende en verde») ni un énfasis animado en la pieza recién llegada. Fix: variantes con `staggerChildren: 0.06` en el `ul` y un pulso verde en «Día N» cuando la pieza es de hoy.
12. [Tarjeta «Hoy · Día 8»] La palabra «minutos» queda sola en la segunda línea. Archivo: Empresa.tsx:198. Fix: `text-pretty` en el texto.
13. [Chip de compartir] Fidelidad menor: la referencia usa el ícono de compartir con flecha hacia arriba y el código usa `Share2` (nodos). Archivo: Empresa.tsx:99. Fix: usar `Share` de Lucide.
14. [Esqueleto de carga] El esqueleto del Marco tiene la forma de «Hoy» (3 columnas), no la del mosaico. Archivo: Marco.tsx:135-155. Fix: aceptable como esqueleto global; si se busca precisión, un esqueleto propio con 1 tarjeta grande y una grilla de 2 columnas.
