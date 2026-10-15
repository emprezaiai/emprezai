# VEREDICTO revisor-visual — celebracion (ventana modal de celebración de logro, con el guepardo de la marca)
Fecha: 2026-10-15 12:00
Screenshot: docs/revisiones/celebracion-375.png
Usabilidad: 37/40
Craft: 17/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): FIEL
Veredicto: LISTA
Top defectos: 1) FICHA-ARTE.md desactualizada: la línea 26 dice "Personaje/mascota: NO por ahora" y la 48 pone como dispositivo propio solo el rayo dorado, pero la pantalla ya muestra el guepardo; 2) al cerrar la ventana, el foco del teclado sigue cayendo en el body (lleva 2 rondas sin arreglarse); 3) el check verde tapa la punta del tenis delantero del guepardo, así que el personaje no se ve igual que en la imagen de la dueña; 4) hay dos tipos de confeti a la vez (rectángulos fijos que vienen dentro del PNG y puntos animados del código) y un trozo de confeti cortado en el borde derecho de la imagen; 5) "Ver en Mi Empresa" se sigue viendo a través del velo, con otro texto que "¡Vamos por más!" y el mismo destino.

## Detalle
USABILIDAD 37/40: h1:4 h2:3 h3:4 h4:3 h5:4 h6:4 h7:4 h8:3 h9:4 h10:4
CRAFT 17/20: jerarquía:3 profundidad:3 identidad:4 movimiento:4 encaje:3

Gate de carga cognitiva: 0 fallas. Hay 1 acción principal y 1 secundaria. Los bloques de texto ocupan 3 líneas o menos. Las insignias son planas y no parecen tocables. El qué sigue es obvio. Hay que vigilar algo: la ventana ya tiene 10 bloques (marca, guepardo, check, título, subtítulo, píldora, insignias, línea, qué sigue, botones) y ocupa ~712 de 812px. No hay que agregarle nada más.

CTA héroe vivo: PASA los 4. Es dorado #FFC23D sobre la tarjeta #231D2E, con contraste muy por encima de 3:1. .boton-oro tiene :active. Nunca está deshabilitado. Mide h-14 = 56px y ocupa el ancho completo. Sin regresión.

FICHA-ARTE: la paleta visible coincide (#231D2E, dorado, verde #3DDC97, tinta #EFEAF5/#BDB4CB/#998FA8). Las fuentes son Bricolage en display e Instrument Sans en el cuerpo, y Montserrat 800 solo en el nombre EMPREZAI (MARCA 2026-10-14). "AI" va en turquesa #2cf8c8, como en el logo original. Las 2 exclamaciones y el confeti diario están cubiertos por la EXCEPCIÓN del 2026-10-14. EL DESVÍO: la ficha sigue diciendo que no hay mascota (l.26) y su l.24 todavía dice "confetti SOLO al cerrar semana" (ver el defecto 1).

## TEST DE FIDELIDAD (contra docs/marca/personaje-original.png)
1. Mismo modo (oscuro): OK.
2. Acento: el verde #3DDC97 (~154°) frente al turquesa de la referencia (~166°), dentro de ±25°. El dorado del CTA coincide. OK.
3. Display grotesk bold, igual que en la referencia: OK.
4. Radios: tarjeta ~20px y CTA en píldora, igual que en la referencia: OK.
5. Densidad: la referencia es horizontal (personaje a la izquierda y tarjeta a la derecha). Aquí se apila en vertical, que es una extensión válida para 375px: OK.
6. Sombras y profundidad: la referencia usa un borde turquesa que brilla (glow) en la tarjeta y en el check. Aquí se usa relieve, sin glow: 1 FALLO.
→ 1 de 6 fallos = FIEL. El personaje es el original recortado, con la misma pose, colores y sudadera con la "E": se reconoce al instante. Solo cambia por el check que le tapa el tenis (defecto 3).

## Ronda 4: los 5 defectos, uno por uno
1. Momento real de mañana → CORREGIDO. Ahora dice "Mañana se abre el día 9: tu mensaje principal. Tu momento: en la noche." (Mision.tsx:1027). El momento queda como sugerencia y el Aviso usa el mismo verbo (l.1005).
2. Jerarquía (check frente a "8") → RESUELTO DE OTRA FORMA. El check bajó a size-10 (40px) y el héroe ahora es el guepardo, que en una celebración es correcto. Siguen siendo ~6 tamaños de texto (28/36/15/15 marca/14/12) → la jerarquía se queda en 3.
3. Foco al cerrar → NO CORREGIDO. ModalCelebracion.tsx:74-101 no guarda ni devuelve el foco.
4. Espacios entre insignias → NO CORREGIDO. Sigue `grid-cols-[1fr_auto_1fr]` (l.216): a 375 quedan ~35 y ~22px. Se acepta como está; sostiene el encaje en 3.
5. CTA duplicado a través del velo → NO CORREGIDO. "Ver en Mi Empresa" se sigue viendo abajo en las 3 capturas.

## Regresiones
Ninguna en la funcionalidad. El confeti y el guepardo se apagan con reduce (l.144, l.163-165) y la imagen es decorativa (alt="" + aria-hidden). Lo nuevo y menor: Marca.tsx:43-44 deja visibles "EMPREZ"+"AI" y además un sr-only "EMPREZAI", así que el lector de pantalla dice el nombre dos veces. Fix: aria-hidden en NombreMarca dentro de Marca.

## TOP DEFECTOS (ubicación → fix)
1. [FICHA-ARTE.md l.24, 26 y 48] la ficha dice que no hay mascota y que el confeti es solo semanal, pero la pantalla tiene guepardo y confeti diario → registrar "PERSONAJE (2026-10-14, de la dueña): docs/marca/personaje-original.png → public/marca/personaje.png; aparece al ganar o avanzar; dispositivo propio junto con el rayo dorado" y quitar la contradicción de la l.24.
2. [ModalCelebracion.tsx:74-101, cierre] el foco cae en el body al cerrar con X, Escape o el velo → guardar `document.activeElement` al abrir y devolverle el foco en onExitComplete (o mandarlo al CTA del Aviso).
3. [Zona del personaje, l.169-171: check en `right-0 bottom-3`] el disco verde tapa la punta del tenis delantero, así que el personaje queda alterado frente a la referencia → moverlo a `-right-3 bottom-0` (sobre la estela, fuera del cuerpo) o arriba a la derecha, en el hueco junto al puño.
4. [public/marca/personaje.png + confeti de l.144-159] hay rectángulos de confeti fijos dentro del PNG más puntos redondos animados (dos lenguajes), y un trozo cortado en el borde derecho de la imagen (~y 175 del PNG) → limpiar el confeti del PNG (o al menos el trozo cortado) y que el confeti animado use rectángulos dorados y verdes como en la referencia.
5. [Velo inferior, Mision.tsx:1003-1008 frente a 1035] "Ver en Mi Empresa" y "¡Vamos por más!" se ven a la vez y van a Mi Empresa → renderizar el Aviso recién en onSalida, o esconder su CTA mientras la ventana está abierta.

## QUÉ FALTA PARA CADA 4
- h2 (3→4): las frases de póster de la dueña ("Tu esfuerzo te acerca a tus metas", las insignias). Es un contrato suyo y se queda en 3.
- h4 (3→4): defecto 5.
- h8 (3→4): bajar a ≤5 tamaños de texto (subtítulo y qué sigue en 14px).
- Jerarquía (3→4): lo mismo que h8.
- Profundidad (3→4): falta un nivel hundido (#0A0910) para la fila de insignias o la línea de qué sigue.
- Encaje (3→4): defectos 3 y 4 + espacios iguales entre insignias.
