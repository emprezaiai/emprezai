# VEREDICTO revisor-visual — Ruta
Fecha: 2026-10-07 12:00
Screenshot: docs/revisiones/ruta-375.png
Usabilidad: 27/40
Craft: 13/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): NO FIEL
Veredicto: NO LISTA
Top defectos: (1) cuatro elementos dorados con la misma acción y sin una acción primaria clara: nodo de hoy, chip del rayo, "Empezar" y botón central · (2) la línea de puntos atraviesa las etiquetas "Día N" y la tarjeta fija tapa nodos · (3) composición infiel a ruta-v2.png: menos densidad, nodos bloqueados planos y sin nodo hecho a la vista · (4) "Empezar" mide 44px y line-clamp-2 roto (título a 3 líneas) · (5) los nodos solo dicen "Día N", sin el nombre de la pieza

## Detalle de puntuación
Usabilidad: h1:3 h2:3 h3:3 h4:3 h5:3 h6:2 h7:2 h8:2 h9:3 h10:3
Craft: jerarquía:2 profundidad:3 identidad:3 movimiento:3 encaje:2

Gate de carga cognitiva: 2 fallas (no es crítico).
- FALLA "una acción primaria": hay 4 accesos dorados a /app/mision en la misma vista.
- FALLA "cero elementos que parecen interactivos y no hacen nada": los chips de racha y de piezas tienen relieve de botón y son <span> sin acción.

CTA héroe vivo ("Empezar" de la tarjeta fija): contraste OK · tap OK (no hay estado :active propio en el Link, solo boton-oro) · no está deshabilitado OK · área FALLA (h-11 = 44px, no ocupa el ancho completo; la referencia lo tiene a ancho completo).

Test de fidelidad contra public/landing/ruta-v2.png: modo OK · hue del acento OK · clase tipográfica display OK · radios OK · DENSIDAD FALLA · PROFUNDIDAD/SOMBRAS FALLA → 2 de 6 = NO FIEL.

## Hallazgos por severidad

### ALTA
1. Acción primaria cuádruple y dorado regado. En la misma vista (18-ruta-demo-dia8-arriba.png) aparecen el nodo de hoy, el chip del rayo de la tarjeta, el botón "Empezar" y el botón central del rayo, los cuatro dorados y los cuatro hacia /app/mision. A eso se suman la banda de semana en dorado sólido y la pestaña activa: 6 masas doradas, así que la regla 60-30-10 y la de "dorado SOLO en…" de FICHA-ARTE quedan diluidas.
   Archivos: components/interna/Ruta.tsx:153-156, :198-203 y :212-220; components/interna/Marco.tsx:84-90.
   Fix: el chip de la tarjeta pasa a ícono neutro (pieza del día, como el lápiz de la referencia) y "Empezar" queda como única acción dorada de la tarjeta.
2. La línea de puntos atraviesa las etiquetas. El trazo SVG une los centros de los nodos y pasa justo por donde está la etiqueta "Día N": se ven puntos encima de "Día 9", "Día 10", "Día 29" y "Día 11". Se nota sin buscarlo.
   Archivos: components/interna/Ruta.tsx:69-73, :91 y :174-176.
   Fix: cortar el trazo para que salga y llegue al borde del nodo, no al centro, o mover la etiqueta al costado contrario a la curva con fondo base.
3. Composición infiel a la referencia aprobada. En ruta-v2.png caben un nodo hecho, hoy (con halo), uno bloqueado y el regalo en ~280px; además los bloqueados son piedra en relieve. En la app, PASO=104 y ZIGZAG ±64 estiran 4 nodos a ~400px, y los bloqueados son agujeros hundidos y planos (bg-sunken sobre la base #0F0D16, casi invisibles). Al abrir en el día 8 no se ve ningún nodo hecho: el scroll arranca en la banda de la semana 2 y los días 1-7 quedan arriba, fuera de vista.
   Archivos: components/interna/Ruta.tsx:17-18, :34 y :117.
   Fix: PASO de unos 80 y zigzag de unos ±90; bloqueados con .relieve-piedra atenuado; hacer scroll al nodo de hoy dejando visible el nodo hecho anterior.
4. La tarjeta fija tapa el mapa. bottom-24 deja la tarjeta encima de los nodos: "Día 12" (en el día 8) y "Día 5" (en el día 1) asoman entre la tarjeta y la barra inferior, y "Día 11" queda pegado al borde superior de la tarjeta.
   Archivos: components/interna/Ruta.tsx:188.
   Fix: degradado de fondo base detrás de la tarjeta (máscara de 24px arriba y abajo), o añadir padding-bottom al mapa igual a la altura de la tarjeta más la barra.

### MEDIA
5. Clamp roto. En el día 1 con la misión hecha, "Hoy ya armaste tu pieza" se parte en 3 líneas. La clase `line-clamp-2 block` choca: `block` anula el display:-webkit-box del clamp.
   Archivos: components/interna/Ruta.tsx:208.
   Fix: quitar `block`.
6. Ojo-ceja contradictorio en ese mismo estado. "Mañana · Día 2" va encima de "Hoy ya armaste tu pieza".
   Archivos: components/interna/Ruta.tsx:206 y :209.
   Fix: ojo-ceja "Día 1 · lista" y título "Mañana se abre: <pieza del día 2>".
7. CTA de 44px. El botón "Empezar" mide h-11 (44px), por debajo del ancla de 48px, y no ocupa el ancho completo como en la referencia.
   Archivos: components/interna/Ruta.tsx:214.
   Fix: h-12 mínimo.
8. Reconocer en vez de recordar. Los nodos hechos y los bloqueados solo dicen "Día N". Para ver una pieza ya hecha o lo que viene, hay que tocar nodo por nodo o recordar qué día tocaba qué. El valor de la ruta, que es ver el plan de 30 piezas, no se ve.
   Archivos: components/interna/Ruta.tsx:174-176.
   Fix: etiqueta en 2 líneas: "Día 9" y debajo el nombre corto de la pieza en caption ink-3.
9. "Semana 2 de 4" aparece dos veces en la misma vista: en el encabezado y en el ojo-ceja de la banda.
   Archivos: components/interna/Ruta.tsx:60 y :83.
   Fix: en el encabezado, chip de perfil o "Día 8 de 30", como en la referencia (chip "Carlos").
10. Chips que parecen botones. Los chips de racha y de piezas tienen relieve de botón (tarjeta-relieve) y no hacen nada.
    Archivos: components/interna/Ruta.tsx:48 y :53.
    Fix: o los vuelves acción (racha lleva a Perfil, piezas a Mi Empresa) o les quitas el relieve.

### BAJA
11. El aviso de los nodos bloqueados nunca se limpia. Queda fijo encima de la tarjeta y sigue tapando mapa.
    Archivos: components/interna/Ruta.tsx:161-166 y :189.
    Fix: timeout de 4s o una X para cerrarlo.
12. Llama gris sin explicación. Con 7 días de racha, la llama sale gris y en contorno (racha en riesgo) y nada dice qué significa.
    Archivos: components/interna/Ruta.tsx:49.
    Fix: microcopy "Hazla hoy para no perder tu racha" en la tarjeta cuando la racha está en riesgo.
13. No hay forma de volver a hoy. Tras hacer scroll a la semana 4 no existe un "volver a hoy" (h7).
    Fix: botón flotante pequeño "Hoy" cuando el nodo de hoy sale de vista (IntersectionObserver).
14. Faltan animaciones base. No hay conteo de 7/30 ni dibujo del camino al entrar.
    Archivos: components/interna/Ruta.tsx:55-57 y :91.
    Fix: pathLength de 0 a 1 en la semana actual y conteo en los chips, ambos respetando reduce.
