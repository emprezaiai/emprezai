# VEREDICTO revisor-visual — celebracion (ventana modal de celebración de logro)
Fecha: 2026-10-14 21:30
Screenshot: docs/revisiones/celebracion-375.png
Usabilidad: 36/40
Craft: 16/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: LISTA
Top defectos: 1) la frase "Mañana en la noche se abre el día 9" no es cierta: en el código, el día siguiente se abre al cambiar la fecha (a medianoche), no a la hora elegida, y el aviso de abajo dice solo "Mañana se abre"; 2) la jerarquía sigue con 6 tamaños de texto y el check verde de 80px se lee antes que el "8"; 3) al cerrar la ventana, el foco del teclado no vuelve a ningún elemento y cae en el body; 4) con la nueva grilla, la etiqueta del medio queda centrada, pero los espacios entre etiquetas son distintos (unos 35 y 22px a 375, unos 27 y 14px a 360); 5) los dos botones que llevan a Mi Empresa tienen textos distintos ("¡Vamos por más!" y "Ver en Mi Empresa") y se ven al mismo tiempo a través del velo.

## Detalle
USABILIDAD 36/40: h1:4 h2:3 h3:4 h4:3 h5:4 h6:4 h7:4 h8:3 h9:4 h10:3
CRAFT 16/20: jerarquía:3 profundidad:3 identidad:3 movimiento:4 encaje:3

Gate de carga cognitiva: 0 fallas. Hay 1 acción principal y 1 secundaria. Los bloques de texto ocupan 3 líneas o menos. Las insignias son planas y no parecen tocables. El qué sigue es obvio.

CTA héroe vivo: PASA los 4. Es dorado sobre la tarjeta #231D2E, con contraste muy por encima de 3:1. .boton-oro responde con :active. Nunca está deshabilitado. Mide h-14 = 56px y ocupa el ancho completo.

FICHA-ARTE: la paleta visible coincide con la ficha (#1A1622/#231D2E, dorado #FFC23D, verde #3DDC97, tinta #EFEAF5/#BDB4CB/#998FA8). Las fuentes son Bricolage en display y Instrument Sans en el cuerpo. Las 2 exclamaciones y el confeti diario están cubiertos por la EXCEPCIÓN del 2026-10-14. Las etiquetas #998FA8 sobre #231D2E dan 5.3:1 (AA).

## Ronda 3: los 5 defectos, uno por uno
1. Insignia del medio centrada → CORREGIDO. Se usa `grid grid-cols-[1fr_auto_1fr]` con start/center/end (ModalCelebracion.tsx:210-217). "Más claridad" queda centrada en x≈187.5 a 375 y en x≈180 a 360, sobre el mismo eje que el check, el título, la píldora y el botón. Como efecto secundario, los espacios entre etiquetas ya no son iguales (ver el defecto 4).
2. Efecto de apertura estable → CORREGIDO. onCerrar se guarda en `cerrar` (useRef), que se actualiza en su propio efecto (l.67-70), y el efecto principal depende solo de [abierto] (l.99). Escape usa cerrar.current(). Ya no se repite la vibración, ni el robo del foco, ni el bloqueo del scroll.
3. Momento real de mañana → CORREGIDO A MEDIAS. Mision.tsx:1000 arma "Mañana en la mañana/al mediodía/en la noche" a partir de cuenta.momento y no promete ningún aviso (está bien). Pero estadoRuta (lib/cuenta.ts:221) abre el día siguiente según fechaLocal, es decir, en cuanto cambia la fecha, y no a la hora elegida. Decir "se abre en la noche" es inexacto (defecto 1).
4. Check de 80px y subtítulo a 15px → CORREGIDO. El disco es size-20 = 80px (l.165) y el contenedor size-24 solo sostiene el anillo. El subtítulo usa text-ayuda = 0.9375rem = 15px. Siguen siendo 6 tamaños (36/28/17/15/14/12) y el check verde todavía gana al entrecerrar los ojos.
5. Racha mínima 1 → CORREGIDO. `const racha = Math.max(1, e.racha)` (l.999), con "día" o "días" según ese valor (l.1014).

## TOP DEFECTOS (ubicación → fix)
1. [Línea de qué sigue, Mision.tsx:1000/1019] "Mañana en la noche se abre el día 9" es falso: el día 9 se puede hacer desde las 00:00, y quien entre de mañana lo encontrará abierto. Además, el Aviso de abajo (l.1005) dice "Mañana se abre…" sin hora → `Mañana se abre el día 9: tu mensaje principal. Tu momento: en la noche.` (el momento como sugerencia, no como hora de apertura), y usar el mismo verbo en el Aviso.
2. [Jerarquía: check vs. píldora] hay 6 tamaños, y el disco verde saturado de 80px es lo primero que se ve, antes que el dato real ("8 días de racha") → unificar el subtítulo y el cuerpo en 14px (text-sm) para quedar en 5, y bajar el check a size-16 (64px), o quitarle saturación al anillo para que el "8" de 36px pase a ser el héroe.
3. [ModalCelebracion.tsx:72-99, cierre] al cerrar con X, Escape o el velo, el elemento que tenía el foco se desmonta y el foco cae en el body, así que quien usa teclado o lector pierde su posición → guardar `document.activeElement` al abrir y, en onExitComplete, devolverle el foco, o mandarlo al CTA del Aviso.
4. [Fila de insignias] la grilla 1fr_auto_1fr centra la etiqueta del medio, pero los espacios entre etiquetas quedan distintos: ~35 y 22px a 375, ~27 y 14px a 360. Los íconos quedan separados por 106 y 100px → probar `grid-cols-3` con las 3 etiquetas centradas en su columna y px-0 (a 360, "Más resultados" de ~86px cabe en una columna de ~100px). Si no cabe, se acepta como está.
5. [Velo inferior, Mision.tsx:1005-1007 vs 1027] "¡Vamos por más!" y "Ver en Mi Empresa" llevan a /app/empresa con textos distintos y se ven a la vez → que el Aviso de abajo no tenga un CTA visible mientras la ventana está abierta (renderizarlo después de onSalida), o igualar su verbo.

## QUÉ FALTA PARA CADA 4
- h2 (3→4): las frases de póster del contrato de la dueña ("Tu esfuerzo te acerca a tus metas", las 3 insignias). Si se mantienen, se queda en 3.
- h4 (3→4): defecto 5.
- h8 (3→4): defecto 2.
- h10 (3→4): defecto 1.
- Jerarquía (3→4): defecto 2.
- Profundidad (3→4): falta un nivel hundido. La fila de insignias o la línea de qué sigue podrían ir sobre #0A0910 tintado.
- Identidad (3→4): un check verde suelto es intercambiable con cualquier app de hábitos. Mejor el nodo del día en relieve con su número, o el rayo dorado de la marca.
- Encaje (3→4): defecto 4.
