# VEREDICTO revisor-visual — Ruta
Fecha: 2026-10-07 16:00
Screenshot: docs/revisiones/ruta-375.png
Usabilidad: 28/40
Craft: 14/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): FIEL
Veredicto: NO LISTA
Top defectos: (1) los nodos bloqueados tienen opacity-60 y la línea de puntos se ve a través de la piedra (Días 3, 4, 9, 10 y 26-29) · (2) tres disparadores dorados hacia /app/mision (nodo de hoy, "Empezar" y botón central); con la pieza ya hecha, el botón central dorado sigue llamando a la misión mientras la tarjeta manda a Mi Empresa · (3) hay dos "Hoy" con acciones distintas en la misma vista: el botón del encabezado y la pestaña de la barra · (4) los nombres de las piezas se cortan con "…", incluido el de hoy ("nombre de tu…") · (5) asoma contenido junto al botón central (día 8) y el ojo-ceja "Hoy ya armaste tu pieza" se parte en 2 líneas (día 1)

## Detalle de puntuación
Usabilidad: h1:3 h2:3 h3:3 h4:2 h5:3 h6:3 h7:3 h8:2 h9:3 h10:3
Craft: jerarquía:3 profundidad:3 identidad:3 movimiento:3 encaje:2

Gate de carga cognitiva: 1 falla (no es crítico).
- FALLA "una acción primaria": el nodo de hoy, "Empezar" y el botón central son tres disparadores dorados de la misma acción. En el estado del día 1 con la pieza hecha, el botón central dorado (que va a /app/mision) compite con la acción neutra de la tarjeta, "Mi Empresa".
- Ya no falla "elementos que parecen interactivos y no hacen nada": la racha y las piezas son texto plano.

CTA héroe vivo ("Empezar" de la tarjeta fija): contraste OK (dorado sobre superficie oscura) · tap OK (.boton-oro:active con translateY) · no está deshabilitado OK · área OK (h-12 = 48px, en la zona del pulgar; no ocupa el ancho completo como en la referencia, pero cumple el ancla).

Test de fidelidad contra public/landing/ruta-v2.png: modo OK · hue del acento OK · clase tipográfica display OK · radios OK · densidad OK (PASO 96 y ±90 se acercan a la referencia) · profundidad y sombras OK con una reserva: en la referencia la piedra es opaca, y aquí la opacidad deja ver el trazo. 0 de 6 fallos = FIEL. Diferencias que no son de token: en la referencia el CTA es de ancho completo y está separado de la tarjeta, y el halo del nodo de hoy es fijo, no un pulso.

## Re-revisión 2: qué se corrigió
Verificado defecto por defecto contra el veredicto anterior (27/40 · 13/20 · NO FIEL):
1. Acción cuádruple y dorado regado: PARCIAL. El ícono de la tarjeta ya es neutro (relieve-piedra con pieza). Siguen tres accesos dorados a /app/mision: el nodo de hoy, "Empezar" y el botón central de Marco.tsx:89-95, que no reacciona a hechaHoy.
2. Línea de puntos sobre las etiquetas: CORREGIDO en las etiquetas (fondo surface-base, Ruta.tsx:188). Aparece un defecto nuevo: el trazo se ve a través de los nodos bloqueados por `opacity-60` (Ruta.tsx:130).
3. Composición infiel: CORREGIDO. PASO 96, zigzag ±90, bloqueados en piedra con relieve. Al abrir en el día 8 se centra el día de hoy y el Día 7 hecho queda a la vista.
4. La tarjeta tapa el mapa: PARCIAL. El velo degradado tapa lo que pasa detrás de la tarjeta, pero entre la tarjeta y la barra, junto al botón central, todavía asoman restos ("…s" y un punto del trazo) en 18-ruta-demo-dia8-arriba.png a 375 y a 360.
5. Clamp roto: CORREGIDO. El título queda en 2 líneas como máximo. Ahora es el ojo-ceja "Hoy ya armaste tu pieza" el que se parte en 2 líneas (Ruta.tsx:227-228, no tiene clamp ni texto corto).
6. Ojo-ceja contradictorio: CORREGIDO ("Hoy ya armaste tu pieza" / "Mañana: tu cliente ideal").
7. CTA de 44px: CORREGIDO (h-12).
8. Reconocer vs recordar: PARCIAL. Ya se ve el nombre de la pieza, pero line-clamp-1 en 120px trunca varias: "nombre de tu…" (justo el de hoy), "preguntas de…", "respuesta a "está…", "negocio, listo par…" y "correo de…".
9. "Semana 2 de 4" duplicado: CORREGIDO.
10. Chips con apariencia de botón: CORREGIDO (texto plano).
11. Aviso que nunca se cierra: CORREGIDO (X de 32px). Aparece sin animación de entrada.
12. Llama gris sin explicación: NO CORREGIDO. La explicación es solo sr-only (Ruta.tsx:58), así que quien ve la pantalla no entiende por qué la llama de "7 días" está apagada.
13. Volver a hoy: CORREGIDO con el botón "Hoy". Problemas nuevos: se ve siempre, aunque hoy ya esté en pantalla, y su nombre choca con la pestaña "Hoy" de la barra, que lleva a otra pantalla.
14. Animaciones base: NO CORREGIDO. No hay conteo de 7/30 ni el trazo del camino se dibuja al entrar.

## Hallazgos por severidad

### ALTA
1. El trazo se ve a través de los nodos bloqueados. Con `relieve-piedra opacity-60`, la piedra queda semitransparente y la línea de puntos se ve encima de los candados en los Días 3, 4, 9, 10, 26, 27, 28 y 29. Se nota sin buscarlo y rompe la lectura de "piedra en relieve".
   Archivos: components/interna/Ruta.tsx:130.
   Fix: quitar la opacidad y crear una variante .relieve-piedra-apagada con --cara-1/--cara-2/--tinta más oscuras (opacas).
2. Dorado triplicado hacia la misma acción, y el botón central no lee el estado del día. En el día 8 hay cuatro masas doradas: la banda de la semana, el nodo de hoy, "Empezar" y el botón central, y tres de ellas llevan a /app/mision. En el día 1 con la pieza hecha, el botón central dorado invita a una misión ya terminada mientras la tarjeta manda a Mi Empresa.
   Archivos: components/interna/Marco.tsx:89-95.
   Fix: cuando hechaHoy, el botón central pasa a relieve-verde con check (o a piedra) y lleva a la pieza de hoy.

### MEDIA
3. Dos "Hoy" con acciones distintas. El botón del encabezado centra el mapa en el día de hoy; la pestaña "Hoy" de la barra lleva a /app. Además, el botón del encabezado se ve siempre, aunque el nodo de hoy ya esté en pantalla.
   Archivos: components/interna/Ruta.tsx:66-73.
   Fix: dejar solo el ícono LocateFixed con aria-label "Ir a mi día" y mostrarlo únicamente cuando el nodo de hoy sale de vista (IntersectionObserver sobre refHoy).
4. Nombres de pieza truncados. Con line-clamp-1 en 120px se cortan "nombre de tu…", "preguntas de…", "respuesta a "está…", "negocio, listo par…" y "correo de…". La etiqueta del nodo de hoy no coincide con la tarjeta ("El nombre de tu negocio").
   Archivos: components/interna/Ruta.tsx:190 y lib/ruta.ts.
   Fix: añadir un campo `corto` de ≤16 caracteres por día en lib/ruta.ts y usarlo sin clamp.
5. Asomes junto al botón central. En el día 8 (a 375 y a 360), "…s" y un punto del trazo asoman a los lados del botón central, entre la tarjeta y la barra.
   Archivos: components/interna/Ruta.tsx:203 y app/globals.css:351-353.
   Fix: extender el velo hasta el borde inferior (sticky bottom-0 con padding-bottom igual al alto de la barra) para que el fondo base llegue debajo de la tarjeta.
6. El ojo-ceja se parte en 2 líneas. "Hoy ya armaste tu pieza" ocupa 2 líneas a 375 y a 360, y la tarjeta crece a 4 líneas de texto al lado del botón.
   Archivos: components/interna/Ruta.tsx:228.
   Fix: usar "Pieza de hoy lista", o "Día 1 · lista".

### BAJA
7. La llama gris sigue sin explicación visible (Ruta.tsx:55-58).
   Fix: cuando rachaEnRiesgo, que el ojo-ceja de la tarjeta diga "Hazla hoy y sigues con 7 días".
8. Hueco muerto bajo la banda de la semana 1 (~50px antes del Día 1, en 05-ruta-dia1-arriba), porque el primer punto está en y=72.
   Archivos: components/interna/Ruta.tsx:82.
   Fix: y = i * PASO + 44.
9. En el día 8, el encabezado corta "Día 6" a la mitad al abrir, y el verde del nodo 6 se transparenta como una mancha bajo el encabezado.
   Fix: centrar con un offset, o usar block 'nearest' con scroll-margin-top de 120px en el nodo de hoy.
10. Faltan movimientos base: el conteo de 7/30 y el dibujo del camino (pathLength de 0 a 1) en la semana actual, ambos respetando reduce. El aviso aparece de golpe.
    Archivos: components/interna/Ruta.tsx:62-64, :104 y :204.
