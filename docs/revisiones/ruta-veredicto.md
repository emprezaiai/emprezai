# VEREDICTO revisor-visual — Ruta
Fecha: 2026-10-07 18:30
Screenshot: docs/revisiones/ruta-375.png
Usabilidad: 29/40
Craft: 14/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): FIEL
Veredicto: NO LISTA
Top defectos: (1) al final del scroll queda un hueco muerto de unos 130px entre la tarjeta fija y la barra, porque se suman dos paddings (pb-24 del velo y pb-28 de Marco) · (2) el encabezado translúcido deja ver el nodo verde del Día 6 como una mancha borrosa, y la etiqueta "Día 6" aparece cortada al abrir en el día 8 · (3) con la misión pendiente siguen 3 disparadores dorados hacia /app/mision (nodo de hoy, "Empezar" y botón central) más la banda dorada: 4 masas doradas en la misma vista · (4) faltan movimientos base: el 7/30 no cuenta, el camino no se dibuja y el aviso aparece de golpe · (5) quedan medias lunas de puntos recortadas junto a las etiquetas (Día 9, 27 y 29), y la llama gris de la racha sigue sin explicación visible

## Detalle de puntuación
Usabilidad: h1:3 h2:3 h3:3 h4:3 h5:3 h6:3 h7:3 h8:2 h9:3 h10:3
Craft: jerarquía:3 profundidad:3 identidad:3 movimiento:2 encaje:3

Gate de carga cognitiva: 1 falla (no es crítico).
- FALLA "una acción primaria" en el estado del día 8: el nodo de hoy, "Empezar" y el botón central son tres disparadores dorados de la misma acción. FICHA-ARTE permite el dorado en los tres; lo que falla es que se repita la acción, no el color.
- En el estado del día 1 con la pieza hecha ya no falla: el botón central verde y la tarjeta neutra son coherentes entre sí.

CTA héroe vivo ("Empezar" de la tarjeta fija):
- Contraste: OK.
- Tap: OK (.boton-oro:active).
- Nunca deshabilitado: OK.
- Área táctil: OK (h-12, en la zona del pulgar).

Test de fidelidad contra public/landing/ruta-v2.png: 0 de 6 fallos = FIEL.
- Modo: OK.
- Hue del acento: OK.
- Clase tipográfica display: OK (grotesk Bricolage).
- Radios: OK.
- Densidad: OK.
- Profundidad: OK. La piedra de los bloqueados ahora es opaca, como en la referencia.
- Diferencias que no son de token: en la referencia la racha y las piezas van en chips con borde (aquí son texto suelto) y el CTA es de ancho completo y separado de la tarjeta.

## Re-revisión 3: qué se corrigió
Verificado defecto por defecto contra el veredicto anterior (28/40 · 14/20 · FIEL):
1. El trazo se veía a través de los nodos bloqueados: CORREGIDO. .relieve-piedra-apagada es opaca (globals.css:356-364) y no se ve el trazo sobre los candados en los Días 3, 4, 9, 10 ni 26-29. Queda un residuo menor: los puntos que el fondo de la etiqueta recorta a medias dejan medias lunas junto a "Día 9", "Día 27" y "Día 29".
2. Dorado triplicado y botón central que no leía el estado: PARCIAL.
   - Con la pieza hecha, el botón central pasa a verde con check y abre la pieza (Marco.tsx:95-99). Es coherente con la tarjeta.
   - Con la misión pendiente siguen tres accesos dorados a /app/mision. Fue una decisión consciente, pero sigue fallando el gate de "una acción primaria".
   - Nota técnica: el enlace usa `?pieza=${e.piezasListas}` (un conteo) en lugar del número de día de la pieza de hoy. Hoy da el mismo resultado solo porque las piezas son consecutivas.
3. Dos "Hoy" con acciones distintas: CORREGIDO. Ahora es solo el ícono LocateFixed con aria-label "Ir a mi día", y aparece solo cuando el nodo de hoy sale de la vista (IntersectionObserver en Ruta.tsx:44-50). Se ve en las capturas -final y no se ve con hoy centrado.
4. Nombres de pieza truncados: CORREGIDO. Se usa `corto` (16 caracteres o menos) sin clamp: "Nombre", "Plan de 7 días", "«Está caro»". Ya no hay "…".
5. Asomes junto al botón central y ojo-ceja en 2 líneas: CORREGIDO. No asoma nada entre la tarjeta y la barra a 375 ni a 360, y "Pieza de hoy lista" cabe en 1 línea. Efecto secundario nuevo: al final del scroll, el velo con pb-24 se suma al pb-28 del contenedor de Marco y deja unos 130px de fondo vacío bajo la tarjeta (en 18-...-final y 05-...-final).

Hallazgos anteriores de severidad baja:
- Llama gris sin explicación: NO CORREGIDO (sigue solo en sr-only).
- Hueco bajo la banda de la semana 1: NO CORREGIDO (y = i*PASO + 72; quedan unos 55px).
- "Día 6" cortado y mancha verde bajo el encabezado: NO CORREGIDO.
- Conteo del 7/30 y dibujo del camino: NO CORREGIDO.

## Por qué el movimiento baja a 2
Verificado en el código, baseline por baseline:
- Stagger de entrada: OK (Ruta.tsx:165-167).
- Tap: OK (active:scale-95).
- Transición de tabs: OK (layoutId en Marco).
- Firma de pulso en el nodo de hoy, con reduce: OK.
- Conteo del número héroe: FALTA. El 7/30 es estático (Ruta.tsx:71-73).
- Dibujo del trazo: FALTA. El path es estático (Ruta.tsx:117).
- Aparición suave del aviso: FALTA. Entra de golpe (Ruta.tsx:218).
- Reduce-motion: el botón de ubicar anima scale 0.8 sin consultar reduce (Ruta.tsx:80).

Son 3 de las 6 baseline aplicables que faltan en la pantalla cuyo dato héroe y gráfico principal son justamente el número y el camino.

## Hallazgos por severidad

### ALTA
1. Hueco muerto bajo la tarjeta fija al final del scroll. Al llegar al Día 30 quedan unos 130px de fondo vacío entre la tarjeta y la barra, a 375 y a 360. Se nota sin buscarlo.
   Archivos: Ruta.tsx:216 (pb-24) + Marco.tsx:71 (pb-28).
   Fix: quitar el pb-28 del contenedor cuando la pantalla tiene tarjeta fija (o darle -mb-28 al velo), de modo que el padding inferior se aplique una sola vez.
2. Encabezado translúcido. Al abrir en el día 8, el nodo verde del Día 6 se ve como una mancha borrosa bajo la racha, y "Día 6" sale cortado por arriba.
   Archivos: Ruta.tsx:62 y :34.
   Fix: fondo opaco var(--surface-base) con hairline inferior, y scroll-margin-top de unos 120px en el nodo de hoy (o centrar con un offset).

### MEDIA
3. Tres disparadores dorados de la misma acción en el día 8 (gate de una acción primaria).
   Fix: el nodo de hoy conserva el dorado y el pulso, pero su toque centra la tarjeta fija en vez de navegar; o, si la referencia exige el central, mantener solo "Empezar" + central.
4. Faltan movimientos base: el conteo del 7/30, el dibujo del camino de la semana actual y la entrada del aviso.
   Archivos: Ruta.tsx:71-73, :117, :218.
   Fix: useCountUp con reduce; motion.path con pathLength de 0 a 1 en 600ms solo en semanaActual; AnimatePresence en el aviso (y de 8 a 0, 200ms).

### BAJA
5. Medias lunas de puntos recortadas junto a "Día 9", "Día 27" y "Día 29" (el fondo de la etiqueta corta un punto a la mitad).
   Fix: cortar el trazo por segmentos de borde de nodo a borde de etiqueta, o enmascarar con un rect de radio completo y padding de 6px.
6. La llama gris de la racha sigue sin explicación visible (Ruta.tsx:64-67).
   Fix: cuando rachaEnRiesgo, que el ojo-ceja de la tarjeta diga "Hazla hoy y sigues con 7 días".
7. Hueco de unos 55px entre la banda de la semana 1 y el Día 1 (Ruta.tsx:95).
   Fix: y = i * PASO + 44.
8. .relieve-piedra-apagada usa hex sueltos (#2c2638, #1f1a29, #7d7390, #120f19) en lugar de tokens.
   Fix: declararlos como --piedra-apagada-* en :root.
