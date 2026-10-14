# VEREDICTO revisor-visual — celebracion (ventana modal de celebración de logro)
Fecha: 2026-10-14 12:00
Screenshot: docs/revisiones/celebracion-375.png
Usabilidad: 28/40
Craft: 14/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos: 1) Las 3 insignias de la base parecen botones (fichas en relieve) y no hacen nada; 2) la racha usa el rayo en vez de la llama y hay 2 desvíos más de la FICHA-ARTE; 3) "¡Vamos por más!" no anticipa adónde lleva y la ventana tapa el aviso de qué sigue mañana; 4) la racha, el único dato real, no es el dato héroe ni cuenta; 5) "Más resultados" queda apretado a 375 y se parte en 2 líneas a 360.

## Detalle
USABILIDAD 28/40: h1:3 h2:3 h3:3 h4:2 h5:3 h6:3 h7:3 h8:2 h9:3 h10:3
CRAFT 14/20: jerarquía:3 profundidad:3 identidad:3 movimiento:3 encaje:2

Gate de carga cognitiva: 1 falla ("cero elementos que parezcan interactivos y no hagan nada": las 3 insignias con relieve-piedra y canto sólido, el mismo material de los botones y nodos tapables de la app). No es sobrecarga crítica.

CTA héroe vivo: PASA los 4 (dorado sobre #1A1622, contraste de sobra · .boton-oro:active translateY 2px en 120ms · nunca deshabilitado · h-14 = 56px a ancho completo).

## TOP DEFECTOS (ubicación → fix)
1. [Base, 3 insignias "Más enfoque | Más claridad | Más resultados"] se ven tapables (ficha en relieve con canto, como botones y nodos) y no hacen nada. Además son afirmaciones genéricas que no salen de ningún dato → quitar el relieve y el fondo hundido: una sola fila de texto ink-3 de 12px con 3 íconos SVG en línea y sin canto (se mantiene el texto de la dueña), o cambiarlas por el dato real del día (nombre de la pieza armada).
2. [Píldora de racha + confeti + exclamaciones] desvíos de la FICHA-ARTE. La racha va con la llama en relieve dorado en Hoy (Hoy.tsx:245) y en Ruta (Ruta.tsx:113); aquí va con Zap delineado, y el rayo es la misión del día. Además sale confeti en cada día, cuando la ficha lo limita al cierre de semana y al día 30, y hay 2 exclamaciones cuando la ficha permite 1 por pantalla → usar Flame relleno dentro del relieve-oro para la racha. Para confeti y exclamaciones, o se anotan como EXCEPCIÓN fechada y aprobada por la dueña en FICHA-ARTE.md (las pidió ella), o el confeti queda solo con hito=true.
3. [Subtítulo + CTA "¡Vamos por más!"] el botón lleva a Mi Empresa (/app/empresa?pieza=N), pero su texto promete "más" justo cuando la siguiente misión está cerrada hasta mañana. La ventana tapa el aviso de abajo, que es lo único que dice qué sigue → subtítulo concreto: "Tu {pieza} ya está en Mi Empresa. Mañana se abre el día {N+1}: {pieza}." (se mantiene el texto del botón que pidió la dueña).
4. [Píldora "Racha actualizada: 8 días"] el único dato real de la ventana está en texto de 16px, tiene el mismo peso que el subtítulo y no cuenta. "Actualizada" suena a sistema → texto "8 días seguidos", con el número en display y animado con el componente Conteo que ya existe en Mision.tsx (~l.950).
5. [Insignia "Más resultados"] a 375 el texto queda a ~5px de los bordes de la ficha (px-1). A 360 se parte en 2 líneas mientras las otras quedan en 1, así que las bases no alinean. Ficha e ícono anidados usan el mismo radio (--radius-chip) → si se mantienen las fichas: whitespace-nowrap + px-2 + text-[11px], y radio interior = exterior − padding. Con el fix 1 desaparece.

Menores (no bloquean): tocar el velo no cierra la ventana (solo X o Escape). La X y "Ver mi ruta" no responden al tocarlas (solo hover en la X). El anillo verde en reposo deja un disco tenue detrás del check que se lee como mancha.

## QUÉ FALTA PARA CADA 4
- h1 (3→4): que la ventana diga qué pasó con el resultado ("tu {pieza} ya está en Mi Empresa"), no solo "completaste".
- h2 (3→4): sacar "Racha actualizada" y la frase de póster "Tu esfuerzo te acerca a tus metas": lenguaje del emprendedor y específico del día.
- h3 (3→4): cerrar también al tocar el velo y al deslizar hacia abajo. La X debe responder al toque.
- h4 (2→4): llama para la racha (igual que Hoy y Ruta) y las excepciones de confeti y exclamaciones anotadas en la ficha, o eliminadas.
- h5 (3→4): sin riesgo real de error. Para el 4, ningún elemento ambiguo: que el botón y el subtítulo dejen claro el destino.
- h6 (3→4): el botón o el subtítulo deben anticipar el destino (Mi Empresa), para no depender de recordar el aviso de abajo.
- h7 (3→4): ya hay foco en la acción, Escape y trampa de foco. Falta cerrar tocando el velo y que la celebración no se repita al volver al mismo día (verificar que no se monte otra vez).
- h8 (2→4): menos decoración. Check + título + dato héroe de racha + 1 frase concreta + botón. Las 3 insignias sin relieve o fuera.
- h9 (3→4): sin errores en esta ventana. Para el 4, prever qué pasa si la racha no cargó (que no muestre "0 días" tras completar).
- h10 (3→4): sembrar el gatillo de mañana dentro de la ventana (día y pieza que se abre, hora del recordatorio).
- Jerarquía (3→4): el dato héroe (racha) en display. Hoy compiten 5 tamaños de texto (título, 16, 16 bold, 14, 12) y 2 dorados (píldora y botón).
- Profundidad (3→4): ya hay velo, tarjeta elevada y fichas hundidas. Para el 4, la hairline dorada degradada SOLO en la píldora de racha (el elemento clave, según la ficha) y quitar el disco tenue del anillo en reposo.
- Identidad (3→4): el centro es un check verde genérico, intercambiable con cualquier app de hábitos. El dispositivo propio (rayo/nodo en relieve) debería ser el protagonista: por ejemplo, el nodo del día que pasa a verde.
- Movimiento (3→4): falta el conteo del número de racha. Faltan la respuesta al toque de la X y del enlace secundario. El confeti debe ir según la ficha (diario sutil, hito grande).
- Encaje (2→4): textos de las insignias sin pegarse a los bordes a 375 y sin partirse a 360, radios anidados concéntricos, y el anillo de fondo centrado e invisible en reposo.
