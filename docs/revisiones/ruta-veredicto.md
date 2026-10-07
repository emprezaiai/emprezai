# VEREDICTO revisor-visual — Ruta
Fecha: 2026-10-07 23:55
Screenshot: docs/revisiones/ruta-375.png
Usabilidad: 33/40
Craft: 16/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): FIEL
Veredicto: NO LISTA
Top defectos: (1) las píldoras del encabezado ya se pueden tocar, pero miden 36px de alto (h-9, Ruta.tsx:107 y :121) y las X de la guía y del aviso miden 32px (size-8, :156 y :350); están por debajo de los 44px de la regla 5 y del min-h-11 de las otras píldoras con borde de la app (Hoy.tsx:314, Empresa.tsx:809) · (2) la banda dorada de la semana es el elemento con más pinta de botón de la pantalla (cara dorada con canto gold-deep, el mismo material que .boton-oro) y es un div que no hace nada al tocarlo · (3) "7 días · hoy" en el chip de racha se entiende a medias (¿hoy qué?) y repite "Racha de 7 en juego" de la tarjeta · (4) con la pieza de hoy lista (día 1) siguen habiendo 3 caminos a Mi Empresa (botón de la tarjeta, botón central con check y pestaña), y la tarjeta no ofrece un siguiente paso propio · (5) los nodos bloqueados no dicen cuándo se abren hasta que los tocas, y "Ir a mi día" sigue siendo solo un ícono

## Detalle de puntuación
Usabilidad: h1:4 h2:3 h3:3 h4:3 h5:3 h6:4 h7:3 h8:3 h9:3 h10:4
Craft: jerarquía:3 profundidad:3 identidad:3 movimiento:4 encaje:3

Gate de carga cognitiva: 1 falla, no crítica.
- La falla: "cero elementos que parezcan interactivos y no hagan nada". La banda dorada de la semana tiene relieve de botón y no responde.
- Las píldoras del encabezado ya no fallan: ahora son Link con active:scale.
- Lo demás pasa:
  - Las semanas agrupan los nodos.
  - Hay 1 acción primaria ("Empezar") y el botón central queda en noche.
  - El paso siguiente es obvio.
  - La guía cabe en 2 líneas.

CTA héroe vivo ("Empezar"): cumple los 4.
- Contraste: dorado #FFC23D sobre la tarjeta oscura, muy por encima de 3:1.
- Tap: .boton-oro:active.
- Nunca deshabilitado.
- Área: h-12 (48px), en la zona del pulgar.

Test de fidelidad contra public/landing/ruta-v2.png: 0 de 6 fallos = FIEL.
- Coinciden: modo, hue del dorado, clase de la display, radios, densidad y profundidad en relieve.
- Diferencias que no son de token:
  - La referencia muestra 4 nodos y la tarjeta en una sola vista; aquí entran 3 nodos.
  - El CTA va dentro de la tarjeta; en la referencia es de ancho completo.

## Re-revisión 7: los 5 defectos de la ronda 6, uno por uno
1. Píldoras que parecían botones y no hacían nada: CORREGIDO, con un defecto nuevo.
   - Ahora son Link: racha → /app/perfil#recordatorio (el ancla existe en Perfil.tsx:78) y piezas → /app/empresa. Tienen active:scale-[0.97] y aria-label completo.
   - Defecto nuevo: miden h-9 (36px), por debajo de los 44px (defecto 1).
2. Botón central con la pieza hecha: CORREGIDO.
   - Marco.tsx:103 aplica .boton-central-quieto en /app/ruta siempre; con la pieza hecha muestra el check en verde.
   - En 05-ruta-dia1 ya no hay disco verde lleno.
   - Residuo: siguen los 3 caminos a Mi Empresa (defecto 4).
3. Esqueleto propio: CORREGIDO.
   - EsqueletoRuta (Marco.tsx:151-171): 2 píldoras, banda de 96px y 4 círculos de 64px en zigzag.
   - Residuo bajo: no trae la barra inferior ni la tarjeta fija, así que al cargar aparecen de golpe.
4. Racha en riesgo: CORREGIDO.
   - Llama con contorno, borde y texto en ámbar con "· hoy" (Ruta.tsx:107-116). Coincide con la excepción de FICHA-ARTE del 2026-10-07.
   - Residuo de lenguaje: "hoy" suelto (defecto 3).
5. Fondo de la FICHA: CORREGIDO.
   - .fondo-puntos-ruta (globals.css:336-344) suma el radial dorado y el verde con background-attachment fixed.
   - El brillo cálido se ve a media altura a la derecha en ruta-375 y en 18-final.
   - Residuo: iOS Safari ignora "fixed" y lo trata como scroll; ahí el brillo queda al 22% de una página muy alta.

Lista "para llegar a 4" de la ronda 6:
- Hechos:
  - "N de 7 listas" en la banda.
  - Aviso que se cierra a los 4 s y con Escape (Ruta.tsx:51-62).
  - Guía de primera visita que se puede cerrar y se recuerda en localStorage.
  - "Idea en 1 página" sin abreviar (lib/ruta.ts:41).
  - Segundo control de la S en (hasta.x - lado*40, hasta.y - 40), en Ruta.tsx:180.
  - Nodo de mañana con reloj (estado 'manana').
- Pendientes:
  - Etiqueta visible en "Ir a mi día".
  - Nodos bloqueados que anticipen cuándo se abren.
  - Vista previa de una pieza hecha.
  - Error propio de Ruta: hoy solo existe el error.tsx compartido.

## Qué tendría que pasar para que cada heurística llegue a 4
- h1 Estado del sistema (4): se mantiene. Para blindarlo, que el esqueleto incluya la barra inferior y la tarjeta fija, así no aparecen de golpe al cargar.
- h2 Lenguaje (3→4):
  - Cambiar "7 días · hoy" por "7 días · en juego", o por "7 días" en ámbar a secas, porque la tarjeta ya lo explica.
  - Revisar "HOY · 5 MIN": "5 min" en minúscula se lee como palabra y no como sigla.
- h3 Control (3→4):
  - "Ir a mi día" con etiqueta visible ("Hoy") junto al ícono, al menos la primera vez.
  - X de 44px en la guía y en el aviso.
  - Que el aviso no se cierre a los 4 s mientras tiene el foco o el puntero encima.
- h4 Consistencia (3→4):
  - Píldoras del encabezado con el mismo alto táctil que el resto de las píldoras de la app (min-h-11).
  - Que la banda dorada responda como lo que parece (defecto 2).
- h5 Prevención (3→4): que el nodo siguiente a hoy diga, bajo su etiqueta, cuándo se abre ("al terminar el día 8"), sin tener que tocarlo para descubrirlo.
- h6 Reconocer (4): se mantiene.
- h7 Flexibilidad (3→4):
  - Mostrar una vista previa de la pieza al mantener presionado un nodo hecho, o en una hoja.
  - Que la píldora de racha lleve a un detalle de la racha (días cumplidos, récord) y no solo al recordatorio.
- h8 Minimalista (3→4): con la pieza hecha, un solo camino a Mi Empresa. Que el botón de la tarjeta haga otra cosa ("Recordarme mañana" → /app/perfil#recordatorio), porque el botón central ya abre la pieza.
- h9 Errores (3→4): un estado propio de Ruta si la cuenta guardada no se puede leer ("No pudimos abrir tu ruta. Reintentar"), en lugar de solo el error.tsx compartido.
- h10 Ayuda (4): se mantiene.

## Qué tendría que pasar para que cada eje de craft llegue a 4
- Jerarquía (3→4): hoy hay 4 tamaños de texto (xl, base, sm y xs). Bajar a 3, con las píldoras del encabezado y el título de la tarjeta en el mismo tamaño, y que el nodo de hoy siga siendo el héroe.
- Profundidad (3→4):
  - El nivel hundido solo aparece en la primera visita (la guía).
  - Dar a la Ruta un área hundida permanente (por ejemplo, el canal del camino o el pie de "Día 30"), y que el brillo funcione también en iOS con un pseudo-elemento position:fixed en lugar de background-attachment.
- Identidad (3→4): hoy el camino de nodos se lee como "Duolingo en oscuro". Hace falta un detalle firma propio en el camino, por ejemplo que cada nodo hecho muestre la pieza que ganaste, en miniatura o con su ícono, en lugar del check genérico.
- Movimiento (4): se mantiene (stagger, conteo, camino que se revela, tap, pulso del nodo de hoy, avisos con AnimatePresence, MotionConfig reducedMotion="user").
- Encaje (3→4):
  - Áreas táctiles de 44px en las píldoras y en las X.
  - Que el primer tramo de cada S entre en diagonal: todavía caen unos 50px de puntos en columna entre el día 8 y el día 9.

## Hallazgos por severidad

### ALTA
1. Áreas táctiles por debajo de 44px: las píldoras miden h-9 (Ruta.tsx:107 y :121) y las X miden size-8 (:156 y :350).
   Fix: min-h-11 en las píldoras y size-11 en las X. El tamaño visual puede quedar igual con padding.
2. La banda dorada tiene relieve de botón y no hace nada (Ruta.tsx:190-204).
   Fix: convertirla en un botón que abra una hoja con las 7 piezas de la semana y su estado, o quitarle el canto (shadow 0 4px 0 gold-deep) para que se lea como rótulo.

### MEDIA
3. "7 días · hoy" se entiende a medias.
   Fix: "7 días · en juego".
4. Con la pieza hecha hay 3 caminos a Mi Empresa.
   Fix: el botón de la tarjeta pasa a "Recordarme mañana".
5. Los nodos bloqueados no anticipan cuándo se abren, y "Ir a mi día" no tiene texto.
   Fix: una línea "al terminar el día N" bajo el nodo siguiente, y la etiqueta "Hoy" en el botón.

### BAJA
6. En iOS el brillo de fondo no queda fijo (background-attachment: fixed no funciona en Safari móvil).
7. El esqueleto no trae la barra inferior ni la tarjeta fija, así que al cargar aparecen de golpe.
