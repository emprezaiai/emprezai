# VEREDICTO revisor-visual — Ruta
Fecha: 2026-10-07 20:15
Screenshot: docs/revisiones/ruta-375.png
Usabilidad: 30/40
Craft: 15/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): FIEL
Veredicto: NO LISTA
Top defectos: (1) en el día 8 la tarjeta fija ocupa 4 líneas: la línea pequeña "Hazla y sigues con 7 / días" se parte y deja "días" solo en la segunda línea, y el título también va en 2 líneas · (2) el camino ya no baja en S: sale en horizontal pegado bajo la etiqueta y parece un subrayado ("Nombre ····", "Plan de 7 días"); en el nodo de hoy arranca dentro del texto "Nombre". La causa es que PASO=96 hace que el nodo siguiente empiece más arriba que el final de la etiqueta anterior · (3) la banda de cada semana queda a unos 20px de la última etiqueta de la semana anterior y a unos 56px de sus propios días, así que se agrupa con lo que no le corresponde · (4) el 7/30 muestra "7" durante unos 200ms, salta a 0 y recién ahí cuenta · (5) .relieve-piedra-apagada sigue con hex sueltos en lugar de tokens

## Detalle de puntuación
Usabilidad: h1:3 h2:3 h3:3 h4:3 h5:3 h6:3 h7:3 h8:3 h9:3 h10:3
Craft: jerarquía:3 profundidad:3 identidad:3 movimiento:3 encaje:3

Gate de carga cognitiva: 0 fallas.
- La falla "una acción primaria" quedó resuelta. El nodo de hoy ya no navega: hace un pulso en la tarjeta (Ruta.tsx:208-219) y su aria-label explica dónde empezar. "Empezar" es la única acción primaria de la pantalla; el botón central es navegación global.
- En el día 8 siguen visibles 4 masas doradas: la banda, el nodo de hoy, "Empezar" y el botón central. Lo permite FICHA-ARTE (dorado en misión de hoy, nodo, CTA y central). Lo dejo anotado, pero no resta.

CTA héroe vivo ("Empezar" de la tarjeta fija):
- Contraste: OK (texto oscuro sobre #FFC23D).
- Tap: OK (.boton-oro:active).
- Nunca deshabilitado: OK.
- Área táctil: OK (h-12, en la zona del pulgar).

Test de fidelidad contra public/landing/ruta-v2.png: 0 de 6 fallos = FIEL.
- Modo: OK.
- Hue del acento: OK.
- Clase tipográfica display: OK (grotesk Bricolage).
- Radios: OK.
- Densidad: OK.
- Profundidad: OK.
- Diferencias que no son de token:
  - En la referencia el trazo une los costados de los nodos con una S clara. Aquí sale en horizontal desde la base de la etiqueta.
  - La racha y las piezas van en chips con borde en la referencia; aquí son texto suelto.
  - En la referencia el CTA es de ancho completo y está separado de la tarjeta.

## Re-revisión 4: qué se corrigió
Verificado defecto por defecto contra el veredicto anterior (29/40 · 14/20 · FIEL):
1. Hueco muerto bajo la tarjeta fija al final del scroll: CORREGIDO.
   - Marco ya no suma pb-28 en /app/ruta (Marco.tsx:73-76).
   - En 18-...-final y 05-...-final quedan unos 40px entre "Negocio listo" y la tarjeta, a 375 y a 360. Es aire razonable, no vacío muerto.
2. Encabezado translúcido: CORREGIDO.
   - Fondo opaco var(--surface-base) con border-b (Ruta.tsx:64), y scrollMarginTop 120 en el nodo.
   - Ya no hay mancha borrosa y "Día 6" se lee entero.
   - Residuo menor: al abrir en el día 8, el nodo del Día 6 queda cortado a la mitad por el encabezado. El corte es limpio.
3. Tres disparadores dorados de la misma acción: CORREGIDO.
   - El nodo de hoy pulsa la tarjeta y vibra, sin navegar.
   - El central usa el día máximo de las piezas (Marco.tsx:100), no un conteo.
4. Movimientos base que faltaban: CORREGIDO, con un fallo.
   - El camino de la semana actual se revela de arriba abajo (clipPath, Ruta.tsx:125-133).
   - El aviso entra y sale con AnimatePresence (Ruta.tsx:253-271).
   - El botón de ubicar respeta reduce (Ruta.tsx:82).
   - FALLO: el 7/30 (CuentaRuta, Ruta.tsx:315-331) arranca con textContent = valor y anima desde 0 con delay 0.2. El número final se ve primero, salta a 0 y luego cuenta.
5. Medias lunas y llama sin explicación: CORREGIDO, con efectos secundarios.
   - Ya no hay medias lunas, y la llama gris se explica en la tarjeta ("Hazla y sigues con 7 días").
   - Efecto nuevo: esa línea se parte en 2 líneas a 375 y a 360 ("días" queda solo).
   - Efecto nuevo: el camino por tramos sale pegado a la base de cada etiqueta y se lee como subrayado punteado.
   - Efecto nuevo: en el nodo de hoy (80px), desde.y = a.y + 70 cae dentro de la línea "Nombre" (la etiqueta va de a.y+44 a a.y+76), así que el trazo SÍ pasa bajo ese texto.

Hallazgos anteriores de severidad baja:
- Hueco bajo la banda de la semana 1: NO CORREGIDO (y = i*PASO + 72; quedan unos 56px).
- Hex sueltos en .relieve-piedra-apagada (globals.css:356-364): NO CORREGIDO.

## Por qué el movimiento sube a 3 (no a 4)
Verificado en el código, baseline por baseline:
- Stagger de entrada: OK (Ruta.tsx:192-194).
- Conteo del número héroe: OK, pero con parpadeo inicial.
- Revelado del camino: OK (clipPath; no es pathLength, pero se lee como trazo que se dibuja).
- Tap: OK (active:scale-95).
- Tabs: OK (layoutId).
- Aviso suave: OK.
- Firma del pulso con reduce: OK.
- MotionConfig reducedMotion="user": OK.
- Celebración: no aplica en esta pantalla.
- Falta para el 4: que el conteo no parpadee y que el camino tenga una geometría que valga la pena dibujar (hoy es un subrayado horizontal).

## Hallazgos por severidad

### ALTA
1. Tarjeta fija de 4 líneas en el día 8, a 375 y a 360. "Hazla y sigues con 7 / días" deja "días" solo en la segunda línea, y "El nombre de tu / negocio" también va en 2 líneas. La tarjeta crece a unos 100px y tapa la ruta.
   Archivo: Ruta.tsx:286-296.
   Fix: acortar a "Racha de 7 en juego" (22 caracteres o menos) con whitespace-nowrap + truncate.
2. Geometría del camino. hasta.y = p.y - 34 = a.y + 62 queda más ARRIBA que desde.y = a.y + 70. Por eso la curva Q no puede bajar: corre en horizontal al ras de la etiqueta ("Plan de 7 días" queda subrayado, y "Nombre ····" parece una línea guía) y en el nodo de hoy arranca dentro del texto.
   Archivo: Ruta.tsx:19 y 97-106.
   Fix: subir PASO a ~124 y usar desde.y = a.y + tam/2 + 42 según el tamaño del nodo, con una cúbica C de controles verticales para que vuelva la S de la referencia.

### MEDIA
3. Proximidad de la banda de semana. Queda a unos 20px de la última etiqueta de la semana anterior (alto = n*PASO + 24 no cubre la etiqueta del último nodo: 648 + 68 > 696) y a unos 56px de sus propios días.
   Fix: alto = (n-1)*PASO + 72 + 76 e y = i*PASO + 48, para que la banda quede pegada a su semana.
4. Parpadeo del contador 7/30.
   Archivo: Ruta.tsx:315-331.
   Fix: renderizar 0 de inicio cuando !reduce (o fijar textContent='0' antes de animar) y quitar el delay.

### BAJA
5. .relieve-piedra-apagada usa #2c2638, #1f1a29, #7d7390 y #120f19 directos.
   Fix: declararlos como --piedra-apagada-* en :root (regla 17).
6. Al abrir en el día 8, el nodo del Día 6 queda medio cortado bajo el encabezado.
   Fix: ajustar el scroll inicial para que la banda de la semana actual quede arriba y el corte caiga en un espacio entre nodos.
