# VEREDICTO revisor-visual — Ruta
Fecha: 2026-10-07 23:59
Screenshot: docs/revisiones/ruta-375.png
Usabilidad: 36/40
Craft: 16/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): FIEL
Veredicto: LISTA
Top defectos: (1) la racha se dice dos veces a la vez: "7 días · en juego" en la píldora y "Racha de 7 en juego" en la tarjeta fija (Ruta.tsx:117 y :386); la tarjeta pierde el "Día 8 · 5 min" · (2) "Recordarme" no responde al tocarlo: el Link de la tarjeta con la pieza hecha (Ruta.tsx:393-397) no tiene active:scale ni :active · (3) el esqueleto no coincide con la pantalla real: píldoras h-9 contra h-11 reales, sin border-b en el encabezado y con fondo-recorrido en lugar de fondo-puntos-ruta (Marco.tsx:154-158), así que al cargar todo salta 8px y aparecen los puntos de golpe · (4) camino: los tramos del centro al costado todavía caen unos 80px en columna (8→9 en ruta-375; 27→28 y 29→30 en 18-final), y el nodo 11 asoma como medio círculo justo encima de la tarjeta fija · (5) los nodos hechos llevan un check genérico: el camino se sigue leyendo como "Duolingo en oscuro"

## Detalle de puntuación
Usabilidad: h1:4 h2:4 h3:4 h4:3 h5:4 h6:4 h7:3 h8:3 h9:3 h10:4
Craft: jerarquía:3 profundidad:3 identidad:3 movimiento:4 encaje:3

Pasa el gate doble justo en el límite (36/40 y 16/20). Cualquier regresión la deja fuera.

Gate de carga cognitiva: 0 fallas.
- La banda de la semana ya no tiene canto: se lee como rótulo y no como botón.
- Hay 1 acción primaria ("Empezar") y el botón central queda en noche.
- Las semanas agrupan de a 7 y en la vista entran 3 nodos.
- El paso siguiente es obvio y la guía cabe en 2 líneas.

CTA héroe vivo ("Empezar"): cumple los 4.
- Contraste: #FFC23D sobre la superficie oscura, mucho más de 3:1.
- Tap: .boton-oro:active:not(:disabled) en globals.css:230.
- Nunca deshabilitado.
- Área: h-12 (48px), en la zona del pulgar.
- El secundario "Recordarme" (con la pieza hecha) no tiene estado de tap (defecto 2).

Test de fidelidad contra public/landing/ruta-v2.png: 0 de 6 fallos = FIEL.
- Coinciden: modo oscuro, hue del dorado, display grotesk, radios, densidad y relieve inferior en los nodos.
- Diferencias que no son de token:
  - La referencia muestra el nodo hecho de ayer en la misma vista; aquí la ruta abre en el inicio de la semana y el día 7 queda arriba, fuera de vista.
  - El CTA va dentro de la tarjeta, no a ancho completo.

## Re-revisión 8: lo pedido en la ronda 7, uno por uno
1. Píldoras de 44px y X de 44px: CORREGIDO.
   - Las píldoras miden h-11 (Ruta.tsx:108 y :122).
   - Las X miden size-11 (:158 y :360).
   - Residuo: el esqueleto sigue dibujando las píldoras en h-9 (Marco.tsx:157-158).
2. Banda sin canto: CORREGIDO. Ruta.tsx:192-196 deja solo el degradado; en el screenshot no hay canto.
3. "7 días · en juego": CORREGIDO en la píldora. Residuo: la tarjeta repite "Racha de 7 en juego" (defecto 1).
4. "Recordarme" con la pieza hecha: CORREGIDO.
   - Lleva a /app/perfil#recordatorio y el botón central abre la pieza (Marco.tsx:101).
   - Residuo: no tiene estado de tap (defecto 2).
5. Nodo siguiente con "al terminar el día N" y el de mañana con "se abre mañana": CORREGIDO. Se ve en ruta-375 y en 05-dia1 (Ruta.tsx:326-329).
6. "Ir a mi día" con texto "Hoy": CORREGIDO (Ruta.tsx:129-141). Se ve en las capturas 18-final y 05-final.
7. "HOY · 5 min": CORREGIDO (:286).
8. Aviso que no se cierra con foco o puntero: CORREGIDO. Usa avisoQuieto con pointerenter/leave y focus/blur (:34, :54, :347-350) y conserva Escape.
9. Esqueleto con tarjeta fija y barra: CORREGIDO. Tiene la tarjeta fija y la barra (Marco.tsx:169-172). Residuo de encaje: defecto 3.
10. Brillo en capa fija: CORREGIDO.
    - .fondo-puntos-ruta::before con position:fixed (globals.css:344-353), sin background-attachment.
    - Ningún ancestro tiene transform, así que el fixed es real.
    - El brillo cálido se ve a la derecha, a media altura.
11. S en diagonal: PARCIAL.
    - Los tramos del costado al centro ya bajan en diagonal (28→29).
    - Los del centro al costado salen por el lado y caen casi en columna, con control en desde.x + lado*48 (Ruta.tsx:182).

Pendientes de la ronda 7 que siguen abiertos:
- Vista previa de una pieza hecha.
- Un detalle de la racha.
- Un error propio de Ruta: solo existe app/app/error.tsx.
- Bajar a 3 tamaños de texto.
- Un área hundida permanente.
- Un detalle firma en los nodos hechos.

## Qué tendría que pasar para que cada heurística llegue a 4
- h1 Estado del sistema (4): se mantiene. Para blindarlo, que el esqueleto calce con la pantalla (píldoras h-11, border-b, fondo-puntos-ruta), así nada salta al cargar.
- h2 Lenguaje (4): se mantiene. Opcional: "Racha de 7 días", no "Racha de 7".
- h3 Control (4): se mantiene. Opcional: un "¿Cómo funciona?" para volver a abrir la guía, que hoy se cierra para siempre (localStorage, Ruta.tsx:46).
- h4 Consistencia (3→4):
  - "Recordarme" con el mismo feedback de tap que el resto de los botones (transition-transform active:scale-[0.97]).
  - El esqueleto idéntico a la pantalla real.
  - Un solo texto para la racha: la píldora dice el estado y la tarjeta dice el día.
- h5 Prevención (4): se mantiene.
- h6 Reconocer (4): se mantiene.
- h7 Flexibilidad (3→4):
  - Mantener presionado (o tocar) un nodo hecho y abrir una hoja con la vista previa de la pieza, sin salir de la Ruta.
  - Que la píldora de racha lleve a un detalle de la racha (días cumplidos y récord), no solo al recordatorio.
- h8 Minimalista (3→4):
  - Quitar la duplicación de la racha: la tarjeta vuelve a "Hoy · Día 8 · 5 min" y el riesgo vive solo en la píldora ámbar.
  - Abrir la ruta con el último nodo hecho visible arriba de "hoy", como en la referencia. Hoy, a la derecha del día 8, hay un vacío oscuro de unos 40% del ancho sin información de progreso.
- h9 Errores (3→4): un estado propio de Ruta si la cuenta guardada no se puede leer ("No pudimos abrir tu ruta. Tus piezas siguen guardadas." + Reintentar). Hoy solo existe el error.tsx compartido, correcto pero genérico.
- h10 Ayuda (4): se mantiene.

## Qué tendría que pasar para que cada eje de craft llegue a 4
- Jerarquía (3→4): siguen 4 tamaños (xs 12, sm 14, base 16, xl 20). Bajar a 3:
  - Píldoras, título de la tarjeta y meta de la banda en un solo tamaño (sm o base).
  - El nodo de hoy queda como héroe.
- Profundidad (3→4): el nivel hundido solo aparece con la guía, que se ve una vez. Dar a la Ruta un área hundida permanente, por ejemplo un canal hundido bajo el camino o el pie de "Día 30" en bg-sunken.
- Identidad (3→4): los nodos hechos son un check verde genérico. El detalle firma sería que cada nodo hecho muestre el ícono de la pieza ganada (frase, cliente, nombre…) en relieve verde. Eso hace la ruta inconfundible con Duolingo.
- Movimiento (4): se mantiene.
  - Stagger de nodos con spring bounce .25, conteo de 7/30, camino que se revela con clipPath y tap active:scale.
  - Pulso del nodo de hoy, rebote de la tarjeta al tocar hoy y avisos con AnimatePresence.
  - MotionConfig reducedMotion="user" más useReducedMotion en cada animación.
- Encaje (3→4):
  - Primer control de cada curva más horizontal (por ejemplo desde.x + lado*90, desde.y + 12), para que ningún tramo caiga en columna.
  - Velo de la tarjeta fija de 48px (hoy 28px, globals.css:386), para que el nodo de abajo no asome como medio círculo sobre el borde de la tarjeta.

## Hallazgos por severidad

### MEDIA
1. La racha se dice dos veces en la misma vista: "7 días · en juego" en la píldora (Ruta.tsx:117) y "Racha de 7 en juego" en la tarjeta (Ruta.tsx:386).
   Fix: la tarjeta muestra siempre "Hoy · Día N · 5 min" y la píldora ámbar carga el riesgo.
2. "Recordarme" no responde al toque (Ruta.tsx:395, rama hechaHoy).
   Fix: agregar transition-transform duration-150 active:scale-[0.97] al Link.

### BAJA
3. El esqueleto no calza con la pantalla: píldoras h-9, sin border-b y con fondo-recorrido (Marco.tsx:154-158).
   Fix: h-11, border-b border-[var(--line)] y fondo-puntos-ruta.
4. Los tramos del centro al costado caen en columna (Ruta.tsx:182) y el nodo de abajo asoma sobre la tarjeta (globals.css:386).
   Fix: control desde.x + lado*90 y velo de 48px.
5. Los nodos hechos llevan un check genérico.
   Fix: el ícono de la pieza en relieve verde.
