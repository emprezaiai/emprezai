# VEREDICTO revisor-visual — celebracion (ventana modal de celebración de logro)
Fecha: 2026-10-14 20:00
Screenshot: docs/revisiones/celebracion-375.png
Usabilidad: 35/40
Craft: 16/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos: 1) en la fila de insignias, "Más claridad" queda unos 7px a la izquierda del eje central, mientras el check, el título, la píldora y el botón sí están centrados; 2) en el código, el efecto del modal se vuelve a ejecutar en cada render porque onCerrar es una función nueva cada vez: vuelve a vibrar, le roba el foco al usuario y vuelve a bloquear el scroll; 3) la línea de qué sigue no dice cuándo llega el aviso de mañana, y el subtítulo junto con las 3 insignias siguen siendo frases de póster; 4) la jerarquía todavía usa 6 tamaños de texto, y el check verde de 96px pesa más que el "8"; 5) no hay respaldo si la racha llega en 0, y se vería "0 días de racha".

## Detalle
USABILIDAD 35/40: h1:4 h2:3 h3:4 h4:3 h5:4 h6:4 h7:4 h8:3 h9:3 h10:3
CRAFT 16/20: jerarquía:3 profundidad:3 identidad:3 movimiento:4 encaje:3

Gate de carga cognitiva: 0 fallas. Hay 1 acción principal y 1 secundaria. Los bloques de texto ocupan 3 líneas o menos. Las insignias son planas y no parecen tocables. El qué sigue es obvio.

CTA héroe vivo: PASA los 4. Es dorado sobre la tarjeta oscura, con contraste muy por encima de 3:1. .boton-oro responde con :active (translateY 2px y la sombra se reduce). Nunca está deshabilitado. Mide h-14 = 56px y ocupa el ancho completo.

## Ronda 2: los 5 defectos, uno por uno
1. Salida animada → CORREGIDO. Celebracion mantiene un estado local `abierta` (Mision.tsx:993), onCerrar lo pasa a false (l.1026) y setCelebrar(null) se llama en onExitComplete (ModalCelebracion.tsx:100, onSalida). La salida (fade + scale 0.96) se reproduce. El Aviso que vuelve a montarse después no tiene animación de entrada y su contenido es idéntico, así que no hay salto.
2. "Mi Empresa" nombrado → CORREGIDO. Va en strong semibold ink-1 y whitespace-nowrap (Mision.tsx:1015) y se ve en las 4 capturas. El botón "¡Vamos por más!" se mantiene por contrato de la dueña.
3. Número de racha dominante + cuerpo a 14px → CORREGIDO. El número es text-[36px] font-extrabold (l.199), más grande que el h2 de 28px. "días de racha", la línea de qué sigue y "Ver mi ruta" están todos en text-sm. Quedan 6 tamaños (ver defecto 4).
4. Insignias simétricas → CORREGIDO A MEDIAS. Con flex justify-between y px-2, los márgenes quedan en 8px a cada lado y los espacios entre etiquetas son iguales (28px a 375 y ~20px a 360). Pero la etiqueta del medio ya no está sobre el eje central (defecto 1).
5. Hairline degradé dorada en la píldora → CORREGIDO. .hairline-oro (globals.css:247) usa padding-box/border-box, de dorado a verde, y es la única de la vista. El check verde genérico sigue siendo el protagonista (identidad se queda en 3).

## TOP DEFECTOS (ubicación → fix)
1. [Fila de insignias, ítem central] el centro de "Más claridad" está en x≈181px a 375 (el eje es 187.5) y en x≈173px a 360 (el eje es 180), unos 7px corrido hacia la izquierda. Todo lo de arriba y lo de abajo está centrado, y el ícono de diana queda visiblemente desalineado con el check → cambiar el ul a `grid grid-cols-[1fr_auto_1fr]`, con el primero en justify-self-start, el segundo en justify-self-center y el tercero en justify-self-end (los márgenes siguen en 8px y el del medio queda sobre el eje).
2. [ModalCelebracion.tsx:68-95] las dependencias del efecto son [abierto, onCerrar], y onCerrar es una flecha inline en Mision.tsx:1026. Cada vez que Celebracion se vuelve a renderizar (por ejemplo, cuando useCuentaActiva se actualiza al sincronizar la pieza recién guardada), el efecto se repite: vuelve a llamar a vibrar(40), le devuelve el foco al CTA aunque el usuario esté en la X y vuelve a registrar el listener → guardar onCerrar en un useRef (`const cerrar = useRef(onCerrar); cerrar.current = onCerrar;`) y dejar las dependencias en [abierto].
3. [Línea de qué sigue, h10] dice qué se abre mañana, pero no cuándo ni cómo se avisa. Además, "Tu esfuerzo te acerca a tus metas" y las 3 insignias son afirmaciones genéricas (contrato de la dueña, no se tocan) → sumar a esa línea la hora del recordatorio real, por ejemplo "Te aviso mañana a las 7 PM". Es el punto más barato para llegar a 36.
4. [Jerarquía de la ventana] hay 6 tamaños: 36 del número, 28 del título, 17 del botón, 16 del subtítulo, 14 del cuerpo y 12 de las insignias. Al entrecerrar los ojos, el primero que se lee es el check verde de 96px, no el "8" → bajar el check a size-20 (80px) con un anillo proporcional, y el subtítulo a text-[15px] o a text-sm para que quede en el mismo tamaño que el cuerpo.
5. [Píldora de racha, Mision.tsx:1011] valor: e.racha no tiene piso. Si la fecha local y la fecha guardada no coinciden, se vería "0 días de racha" justo cuando se celebra → `valor: Math.max(1, e.racha)` y elegir el texto en singular o plural sobre ese mismo valor.

## QUÉ FALTA PARA CADA 4
- h2 (3→4): la frase de póster del subtítulo (contrato). Si la dueña la mantiene, se queda en 3.
- h4 (3→4): el CTA de la ventana ("¡Vamos por más!") y el del Aviso de abajo ("Ver en Mi Empresa") llevan al mismo destino con textos distintos, y se ven al mismo tiempo a través del velo.
- h8 (3→4): defecto 4 (6 tamaños; el check compite con el dato real).
- h9 (3→4): defecto 5.
- h10 (3→4): defecto 3.
- Jerarquía (3→4): defecto 4.
- Profundidad (3→4): la tarjeta tiene superficie elevada y objetos en relieve, pero no hay un nivel hundido. Por ejemplo, la fila de insignias o la línea de qué sigue podrían ir sobre --surface-sunken (#0A0910 tintado).
- Identidad (3→4): el check verde suelto de 96px es intercambiable con cualquier app de hábitos. Usar el nodo del día en relieve con su número, o el rayo dorado de la marca.
- Encaje (3→4): defecto 1.
