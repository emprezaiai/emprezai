# VEREDICTO revisor-visual — Mi Empresa
Fecha: 2026-10-07 18:45
Screenshot: docs/revisiones/mi-empresa-375.png
Usabilidad: 32/40
Craft: 16/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): FIEL
Veredicto: NO LISTA
Top defectos: (1) la acción del día («Hoy · Día 8») sigue al fondo, a casi dos pantallas de scroll · (2) «Semana 1» marca semana completa pero su contador dice 6 de una semana de 7 piezas · (3) en el día 1 quedan unos 105px de vacío muerto bajo los fantasmas · (4) el resumen de la pieza nueva y el encabezado de semana pesan igual (los dos text-lg), así que la protagonista no domina · (5) encaje: el tracking del rótulo es .08em en la tarjeta héroe y .04em en el mosaico, y la X de la hoja sigue flotando entre el label y el título

## Detalle de la puntuación
USABILIDAD: 32/40 (h1:3 h2:3 h3:4 h4:3 h5:3 h6:4 h7:3 h8:3 h9:3 h10:3)
CRAFT:      16/20 (jerarquía:3 profundidad:3 identidad:3 movimiento:4 encaje:3)
COPY:       N/A (no vende)
FIDELIDAD:  FIEL (0 de 6 fallos. Mismo modo oscuro, dorado #FFC23D, Bricolage en display, radios de 18-22px y relieve con sombra difusa. La densidad es algo menor que en la referencia: más aire entre la tarjeta héroe y el mosaico por el encabezado de semana, pero es de la misma familia. Diferencias menores sin fallo: la barra usa píldoras en lugar de rectángulos y la tarjeta héroe lleva la línea «Toca para verla…».)

Gate de carga cognitiva: 0 de 8 fallos. Al límite: la Semana 1 abierta muestra 6 tarjetas, una más que el tope de 4-5, pero están agrupadas y se pliegan.
Capturas revisadas: mi-empresa-375.png, app/19-empresa-demo-dia8-arriba.png y -final.png, app/20-empresa-demo-detalle-arriba.png y -final.png, app/06-empresa-dia1.png, app-360/19-empresa-demo-dia8-arriba.png, app-360/20-empresa-demo-detalle-final.png y la referencia public/landing/mi-empresa-v2.png.
Código revisado: components/interna/Empresa.tsx, components/interna/Marco.tsx (MotionConfig reducedMotion="user" y layoutId de la navegación), lib/cuenta.ts (fecha, base, fechaLocal) y FICHA-ARTE.md.

## Hallazgos por severidad

### MEDIA
1. [Bloque «Hoy · Día 8», al final de la pantalla] En el estado del día 8, la única acción de la pantalla queda debajo de la tarjeta héroe y de las 6 tarjetas de la semana, fuera de la primera vista (19-empresa-demo-dia8-final.png). Lo compensa el botón central de la navegación, pero en la pantalla no se ve qué sigue sin hacer scroll. Archivo: Empresa.tsx:297-318. Fix: subir la tarjeta punteada «Hoy · Día N» justo debajo de la tarjeta héroe, antes de los grupos.
2. [Encabezado «Semana 1 · Tu idea, validada»] Muestra el check de semana completa junto a «6», pero la semana tiene 7 piezas porque la del día 7 está arriba, en la tarjeta héroe. Un usuario atento puede pensar que le falta una. Archivo: Empresa.tsx:257. Fix: mostrar el total de la semana, «7/7» (las piezas de la ruta de esa semana que están guardadas), en vez de g.piezas.length.
3. [Día 1, bajo el tercer fantasma] Entre «Día 4 · Tu precio» y la barra de navegación quedan unos 105px de vacío muerto (06-empresa-dia1.png). Fix: agregar debajo de los fantasmas una línea que enseñe, por ejemplo «Al día 30 aquí estará tu negocio completo: 30 piezas listas para copiar», o mostrar un 4º fantasma.
4. [Jerarquía, tarjeta héroe frente al encabezado de semana] Con el cambio a text-lg, el encabezado de semana (display bold, 18px) pesa igual o más que el resumen de la pieza nueva (body semibold, 18px). Al entrecerrar los ojos, «Semana 1 · Tu idea, validada» compite con la protagonista. Los 4 niveles existen (28/18/14/12), pero el nivel 2 tiene tres ocupantes con el mismo peso. Archivo: Empresa.tsx:230 y :254. Fix: poner el resumen de la tarjeta héroe en font-display text-xl extrabold, o bajar el encabezado de semana a font-semibold.

### BAJA
5. [Encaje] El rótulo usa tracking-[0.08em] en la tarjeta héroe (:213) y en la hoja (:425), y tracking-[0.04em] en el mosaico (:281): son variantes accidentales del mismo label. Además, la X de la hoja (items-start, :423 y :430) queda centrada en el espacio entre «DÍA 5 · LISTA» y «Tu competencia», no en el título (20-empresa-demo-detalle-arriba.png). Fix: unificar el tracking del label en .04em y alinear la X con el título (self-end, o mt-3 en el botón).
6. [Hoja de detalle, tirador] La zona de arrastre está dentro del contenedor con scroll, sin sticky. Cuando una pieza larga se desplaza hacia abajo, el tirador sale de la vista y solo quedan la X, Escape y el velo para cerrar. Fix: poner sticky top-0 en la zona del tirador, con el mismo fondo de la hoja.
7. [Identidad en estático] El tick verde y el resorte existen, pero solo el día en que se guarda la pieza. En la captura del día 8, el mosaico sigue siendo tarjeta oscura con label y texto, y el dispositivo propio de la ficha (rayo y nodos en relieve) solo aparece en el botón central. No impide el gate.
8. [Esqueleto de carga] Sigue el esqueleto genérico del Marco. No se verificó de nuevo. Es aceptable.

## Re-revisión 4: qué se corrigió
| # anterior | Defecto | Estado | Evidencia |
|---|---|---|---|
| 1 | 6 tamaños de texto, jerarquía sin 4 niveles | CORREGIDO | Empresa.tsx:254 usa text-lg. En pantalla quedan pregunta/lg/sm/xs = 4 niveles. Queda el empate dentro del nivel 2 (hallazgo 4) |
| 2 | La hoja se arrastra completa y compite con el scroll | CORREGIDO | useDragControls + dragListener={false} (:406-408) y una zona de 32px con touch-none que arranca el arrastre (:416-420). Con dragListener={false}, Motion no fija touch-action en el contenedor, así que el texto largo hace scroll normal. Queda el tirador sin sticky (hallazgo 6) |
| 3 | La firma se repite en cada visita y no hay tick | CORREGIDO | recienGuardada = fecha === fechaLocal() && !reduce (:48). El resorte (:206-208), el destello (:171-177) y el Check verde (:216-226) quedan condicionados a eso. Se ve en 06-empresa-dia1.png (tick verde en «NUEVA · DÍA 1»). En el día 8 entra con la animación normal |
| 4 | Rótulos sin respaldo a 360px | CORREGIDO | truncate + tracking .04em (:281). En app-360/19 se leen completos VALIDACIÓN, COMPETENCIA, CLIENTE IDEAL y TU FRASE. Queda la variante de tracking frente a la tarjeta héroe (hallazgo 5) |
| 5 | entrar(4) choca con las semanas y «7 de 30» no cuenta | CORREGIDO | entrar(2 + grupos.length) (:298). CuentaPiezas anima de 0 a N con animate() de Motion y respeta reduced motion (:460-476) |
| 6 (BAJA) | Contador «6» en una semana completa de 7 | NO CORREGIDO | :257 (hallazgo 2) |
| 7 (BAJA) | X de la hoja desalineada | NO CORREGIDO | :423 sigue con items-start (hallazgo 5) |
| 8 (BAJA) | «Hoy» al fondo | NO CORREGIDO | :297 (hallazgo 1) |
| extra | La hoja prometía IA | CORREGIDO | :446 dice «Versión base, armada con tus respuestas.» |

Delta: 31/40 → 32/40 (h3 sube de 3 a 4: la hoja se cierra con la X, Escape, el velo, el botón atrás y el arrastre desde el tirador, sin bloquear el scroll, y el foco vuelve al origen). 15/20 → 16/20 (movimiento sube de 3 a 4: las 7 baseline verificadas, con stagger sin choques, conteo, barras, tap, layoutId en la navegación, hoja suave y tick de celebración, más MotionConfig reducedMotion="user"). Craft ya pasa el umbral (≥16/20). Usabilidad sigue 4 puntos por debajo de 36/40. El camino más corto es subir la acción del día (hallazgo 1), corregir el contador de semana (hallazgo 2), llenar el vacío del día 1 (hallazgo 3) y unificar las variantes de label (hallazgo 5).
