# VEREDICTO revisor-visual — Ruta
Fecha: 2026-10-07 22:40
Screenshot: docs/revisiones/ruta-375.png
Usabilidad: 31/40
Craft: 16/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): FIEL
Veredicto: NO LISTA
Top defectos: (1) cuando hoy es el primer día de la semana (días 1, 8, 15 y 22), la píldora "HOY · 5 MIN" queda pegada al borde inferior de la banda dorada, con 1-2px de aire, a 375 y a 360 · (2) en el día 8 hay 4 masas doradas en pantalla: la banda, el nodo, "Empezar" y el botón central, que compiten con la única acción primaria · (3) al abrir en el día 8, arriba queda la etiqueta "Validación" suelta bajo el encabezado, con su nodo oculto, y unos 200px casi vacíos a la izquierda; la referencia abre con la banda arriba · (4) el encabezado usa texto suelto en lugar de los chips con borde de la referencia, y la llama gris sin relleno no se entiende como "en riesgo" sin leer la tarjeta · (5) el camino es un codo en ángulo recto con tramos horizontales largos (Día 28→29, unos 140px) en lugar de la S diagonal de la referencia

## Detalle de puntuación
Usabilidad: h1:3 h2:3 h3:3 h4:3 h5:3 h6:4 h7:3 h8:3 h9:3 h10:3
Craft: jerarquía:3 profundidad:3 identidad:3 movimiento:4 encaje:3

Gate de carga cognitiva: 0 fallas.
- Hay una sola acción primaria ("Empezar"). El nodo de hoy solo hace pulsar la tarjeta.
- Las semanas agrupan 7-8 nodos y cada uno va etiquetado.

CTA héroe vivo ("Empezar"): cumple los 4.
- Contraste: OK.
- Tap: OK (.boton-oro:active).
- Nunca deshabilitado: OK.
- Área: OK (h-12, en la zona del pulgar).

Test de fidelidad contra public/landing/ruta-v2.png: 0 de 6 fallos = FIEL.
- Coinciden: modo, hue, clase de la display, radios y profundidad.
- Densidad: un poco menor por las etiquetas bajo cada nodo, pero dentro de la misma familia.
- Diferencias que no son de token:
  - Chips del encabezado.
  - Trazo en S diagonal en la referencia; aquí es un codo.
  - CTA de ancho completo, separado de la tarjeta.
  - Composición inicial con la banda arriba.

## Re-revisión 5: qué se corrigió
Verificado defecto por defecto contra el veredicto anterior (30/40 · 15/20):
1. Línea pequeña de la tarjeta en 1 línea: CORREGIDO.
   - Ahora dice "Racha de 7 en juego", con truncate (Ruta.tsx:293-300). Cabe en 1 línea a 375 y a 360.
   - El título sigue en 2 líneas ("El nombre de tu / negocio"), con line-clamp-2. Es aceptable y la referencia hace lo mismo.
2. Camino por el costado hasta la tapa del siguiente nodo: CORREGIDO.
   - Sale del costado a la altura del centro y baja a la tapa del siguiente (Ruta.tsx:104-113); si el siguiente es hoy, llega 40px más arriba para no tapar la píldora.
   - PASO 124. Ya no cruza ninguna etiqueta en dia1, dia8 ni final (375 y 360).
   - Residuo: la forma es un codo recto, no la S de la referencia (ver defecto 5).
3. Banda más cerca de sus días: CORREGIDO, con un efecto nuevo.
   - alto = (n-1)*PASO + ARRIBA + ABAJO. Quedan unos 66px hasta la etiqueta anterior y unos 44px hasta su primer nodo, así que la proximidad ahora agrupa bien.
   - Efecto nuevo: si ese primer nodo es hoy, la píldora (-top-8 sobre un nodo de 80px) termina a unos 4px del borde de la tarjeta y queda casi tocando la sombra de la banda.
4. 7/30 que arranca en 0: CORREGIDO.
   - Renderiza 0 de inicio cuando !reduce y anima sin delay (Ruta.tsx:322-341). Ya no hay parpadeo.
5. relieve-piedra-apagada con variables: CORREGIDO.
   - Usa --cara-1/--cara-2/--canto/--tinta (globals.css:356-358), el mismo patrón de .relieve-oro, .relieve-verde y .relieve-piedra.
   - Los hex siguen definidos dentro de cada clase de relieve y no en :root. Es consistente con el sistema, pero .relieve-noche (globals.css:107-109) todavía usa hex directos sin variables.

## Por qué el movimiento sube a 4
Las 2 condiciones del veredicto anterior se cumplen:
- El conteo ya no parpadea.
- El camino tiene una geometría que vale la pena revelar.
Verificado en el código, baseline por baseline:
- Stagger: OK (Ruta.tsx:199-201).
- Conteo: OK.
- Revelado del camino: OK (clipPath, Ruta.tsx:132-141).
- Tap: OK (active:scale-95).
- Aviso: OK (AnimatePresence).
- Pulso de hoy: OK.
- Reduce: OK en cada animación.
- Celebración: no aplica en esta pantalla.

## Hallazgos por severidad

### ALTA
1. Píldora "HOY · 5 MIN" pegada a la banda en el primer día de cada semana (ruta-375.png y app-360/18-arriba). Se ve como una etiqueta colgada de la tarjeta de la semana.
   Archivo: Ruta.tsx:21 y 100.
   Fix: sumar 28px a ARRIBA cuando estadoDe(dias[0].dia) === 'hoy'.
2. Cuatro masas doradas en la vista del día 8 (banda, nodo, Empezar y botón central). Baja la h8.
   Fix: en /app/ruta, mostrar el botón central en .relieve-noche (oscuro con ícono dorado), porque la tarjeta ya tiene "Empezar".

### MEDIA
3. Encuadre inicial.
   - scrollIntoView con block:center deja "Validación" huérfana bajo el encabezado, con dos puntos del camino sin nodo, y un hueco arriba a la izquierda.
   - Fix: al entrar, desplazar a la section de la semana actual con block:'start' (scroll-mt-20 ya existe) siempre que hoy quede visible sobre la tarjeta. Así se replica la composición de la referencia, con la banda arriba.
4. Encabezado.
   - La racha y las piezas son texto suelto; en la referencia van en chips con borde.
   - La llama gris en contorno no comunica "en riesgo" por sí sola.
   - Fix: chips rounded-pill con borde var(--line), y la llama gris con un punto ámbar (--aviso) o el texto "7 días · hoy" cuando rachaEnRiesgo.

### BAJA
5. El trazo C usa los dos controles en (p.x, desde.y). Resultado: un codo de 90° con tramos horizontales largos (Día 28→29), no la S diagonal de la referencia.
   Fix: controles (desde.x + lado*48, desde.y) y (hasta.x, hasta.y - 48).
6. "Idea en 1 pág." es una abreviatura en la etiqueta del día 7.
   Fix: "Idea en una hoja" o "Tu idea, resumida".
