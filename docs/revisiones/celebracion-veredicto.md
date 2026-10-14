# VEREDICTO revisor-visual — celebracion (ventana modal de celebración de logro)
Fecha: 2026-10-14 18:00
Screenshot: docs/revisiones/celebracion-375.png
Usabilidad: 34/40
Craft: 15/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos: 1) al cerrar, la ventana desaparece de golpe (no hay animación de salida) y el aviso de abajo se vuelve a montar; 2) "¡Vamos por más!" sigue sin decir adónde lleva, y "más" choca con que la siguiente misión está cerrada hasta mañana; 3) la píldora de racha no se impone como dato principal: el "8" se ve más chico que el título y la pantalla usa 7 tamaños de texto; 4) en la fila de insignias, los márgenes izquierdo y derecho no son iguales y los espacios entre etiquetas tampoco, sobre todo a 360; 5) el centro sigue siendo un check verde genérico y no hay ninguna hairline degradé.

## Detalle
USABILIDAD 34/40: h1:4 h2:3 h3:4 h4:3 h5:4 h6:3 h7:4 h8:3 h9:3 h10:3
CRAFT 15/20: jerarquía:3 profundidad:3 identidad:3 movimiento:3 encaje:3

Gate de carga cognitiva: 0 fallas. Las insignias ya son una fila plana en ink-3, sin relieve y sin canto: no parecen tocables. Hay 1 acción principal, los bloques de texto ocupan 2 líneas o menos y el qué sigue se entiende.

CTA héroe vivo: PASA los 4. Es dorado sobre #1A1622, con contraste de sobra. .boton-oro responde con :active. Nunca está deshabilitado. Mide h-14 = 56px y ocupa el ancho completo.

## Ronda 1: los 5 defectos, uno por uno
1. Insignias que parecían botones → CORREGIDO. Ahora son una fila plana (ModalCelebracion.tsx:204-217), sin fondo ni canto. El texto de la dueña se mantiene.
2. Rayo en lugar de llama, y confeti y exclamaciones fuera de la ficha → CORREGIDO. LlamaRellena (Flame fill) va dentro de relieve-oro (Mision.tsx:984, ModalCelebracion.tsx:194). La EXCEPCIÓN del 2026-10-14 está anotada en FICHA-ARTE.md:40. El confeti cambia de escala con hito: 12 piezas a 110px en los días normales y 22 piezas a 150px en el cierre de semana.
3. Faltaba decir qué sigue mañana → CORREGIDO. La línea "{pieza} ya está en Mi Empresa. Mañana se abre el día N: …" se ve a 375 y a 360. Queda abierto que el botón no nombre su destino (ver defecto 2).
4. La racha no era el dato principal y no contaba → CORREGIDO A MEDIAS. El número va en font-display text-precio, cuenta de 0 al valor (Conteo, l.35-59) y respeta "reducir movimiento". El texto dice "días de racha" y ya no "actualizada". Pero el "8" se ve más chico que el título "¡Excelente, Carlos!", así que el dato no domina.
5. Encaje de las insignias a 360 → CORREGIDO A MEDIAS. "Más resultados" ya no se parte (whitespace-nowrap). Pero a 360 queda a ~2px del final del separador por la derecha, mientras "Más enfoque" arranca a ~8px por la izquierda. El espacio entre "enfoque" y "Más claridad" es ~26px y entre "claridad" y "Más resultados" es ~20px.
Menores: tocar el velo ya cierra (l.106). La X tiene active:scale-95 y "Ver mi ruta" tiene active:scale-[0.97]. El anillo hace repeat:1 y termina con opacity 0, así que ya no deja la mancha detrás del check. → los 3 CORREGIDOS.

## TOP DEFECTOS (ubicación → fix)
1. [Ventana completa, al cerrar con X, velo o Escape] onCerrar hace setCelebrar(null) y Mision devuelve otro árbol (Mision.tsx:41). Eso desmonta el AnimatePresence junto con la ventana: la salida (exit scale 0.96 + fade) nunca se reproduce, la ventana desaparece de golpe y el Aviso de abajo se vuelve a montar → dejar Celebracion montado con un estado local `abierto` que pase a false, y llamar setCelebrar(null) en onExitComplete del AnimatePresence.
2. [CTA "¡Vamos por más!"] lleva a /app/empresa?pieza=N, pero el texto promete "más" el mismo día en que la siguiente misión está cerrada. Por eso el destino depende de leer la línea de arriba. El texto lo pidió la dueña, así que no se cambia → en la línea de "siguiente", hacer que "Mi Empresa" sea el ancla visual (semibold ink-1). Opcional: un microtexto de 12px bajo el botón, "Abre tu pieza en Mi Empresa".
3. [Píldora de racha vs título] el "8" (text-precio) se ve más chico que el h2 (text-pregunta). Hay 7 tamaños de texto: título, 16 del subtítulo, número, 16 semibold, 12 de las insignias, caption, botón. El dato real no es el principal → subir el número a un tamaño display igual o mayor que el título, y juntar "días de racha", la línea de qué sigue y "Ver mi ruta" en un solo tamaño de cuerpo de 14px.
4. [Fila de insignias, a 375 y a 360] cada grid-cols-3 está centrado en su columna y las etiquetas tienen anchos muy distintos. Por eso los márgenes laterales quedan desiguales (~2px vs ~8px a 360) y los espacios entre etiquetas también (~26 vs ~20px) → usar flex justify-between (o justify-evenly) sobre el ancho del separador en lugar de grid-cols-3, o px-1 en la lista con las etiquetas a 11px.
5. [Insignia central + píldora] el check verde de 96px sigue siendo el protagonista genérico de cualquier app de hábitos. La píldora usa un borde sólido al 40% y la pantalla no tiene ninguna hairline degradé → poner la hairline degradé dorada (padding-box/border-box) solo en la píldora de racha. Opcional: el nodo del día en relieve que pasa a verde con el número del día, en lugar del check suelto.

## QUÉ FALTA PARA CADA 4
- h2 (3→4): "Tu esfuerzo te acerca a tus metas" es una frase de póster. Si la dueña la mantiene, se queda en 3.
- h4 (3→4): el CTA de la ventana ("¡Vamos por más!" → /app/empresa?pieza=N) y el del aviso de abajo ("Ver en Mi Empresa" → /app/empresa) llevan al mismo lugar con textos distintos. Hay que alinear el destino o el texto.
- h6 (3→4): defecto 2.
- h8 (3→4): las 3 insignias son afirmaciones genéricas (contrato de la dueña). Si se mantienen, que no compitan con el dato real.
- h9 (3→4): no hay respaldo si e.racha llega en 0 justo después de completar (mostraría "0 días de racha"). Usar max(1, racha).
- h10 (3→4): sumar la hora del recordatorio de mañana a la línea de qué sigue.
- Jerarquía (3→4): defecto 3.
- Profundidad (3→4): la hairline degradé de la píldora (defecto 5).
- Identidad (3→4): defecto 5.
- Movimiento (3→4): defecto 1 (la salida suave del modal). El resto de las baseline que aplican está presente: stagger de entrada, conteo, spring de entrada, tap, confeti según hito y reducir movimiento.
- Encaje (3→4): defecto 4.
