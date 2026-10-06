# VEREDICTO revisor-visual — onboarding
Fecha: 2026-10-06 12:00
Screenshot: docs/revisiones/onboarding-375.png
Usabilidad: 28/40
Craft: 14/20
Copy (si vende): 16/20
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos: (1) la etiqueta final es fija y miente en el camino "sin idea" · (2) la Pieza 1 no usa la idea del usuario (opciones solo por área) · (3) la frase en vivo se rompe a 360px y el hueco vacío tiene doble subrayado · (4) duración contradictoria (5 min / 2 min) · (5) CTA desactivados por defecto en idea y ejercicio

---

## Detalle de puntajes

USABILIDAD 28/40: h1:3 h2:3 h3:3 h4:2 h5:3 h6:3 h7:3 h8:2 h9:3 h10:3
CRAFT 14/20: jerarquía:3 profundidad:3 identidad:3 movimiento:3 encaje:2
COPY 16/20: idea:3 especificidad:3 emoción:3 oferta:3 acción:4
FIDELIDAD: N/A (sin referencia del usuario para esta pantalla)
Estado: CORREGIR. Falla el gate doble: usabilidad 28 < 36 y craft 14 < 16. El copy pasa justo (16, ningún eje en 2 o menos).

Gate de carga cognitiva: 0 fallas (≤4 opciones + "Escribir la mía", 1 acción primaria por paso, ≤5 campos, el siguiente paso es obvio).
CTA héroe vivo: contraste dorado sobre #0F0D16 de aprox. 12:1 ✓ · tap (whileTap 0.98 + :active translateY) ✓ · 56px de alto a ancho completo ✓ · **nunca desactivado ✗** (PasoIdea y PasoEjercicio).
Ficha de arte: paleta (#0F0D16, dorado #FFC23D, verde #3DDC97) y par Bricolage Grotesque / Instrument Sans coinciden con lo que se ve ✓. Hay 2 desvíos: los radios (ver M3) y el resorte del motion (ver m4).
50 §D: la barra fina con % animado ✓, chips de 64px con estado completo ✓, avance automático a 300ms ✓, sin "Saltar" ✓, reconocimiento cada 3-5 preguntas ✓, carga de 5s con pausa de 400ms ✓. Del gate premium falla "radios consistentes del kit".

## Hallazgos por severidad

### ALTA (bloquean)
A1. **Etiqueta fija y falsa en algunos caminos.** Archivo: `components/onboarding/PasoEtiqueta.tsx` L59-62, paso 08 (y 09 en 360). "Tus respuestas dicen que eres de los que actúan · Pocos llegan con esto claro" sale igual para todos. Quien respondió "Aún no tengo idea" y "No lo sé, ayúdame a elegir" también lee que llegó "con esto claro". Eso es adular sin evidencia, justo lo que prohíbe 50 §A5, y le quita confianza a Carlos antes de la pantalla de planes. → FIX: variar título y cuerpo según `punto`/`area`. Ejemplo para sin-idea/nose: "Elegiste en vez de quedarte en blanco: eso ya es avanzar".

A2. **La recompensa no usa la idea del usuario.** Archivos: `lib/onboarding.ts` L220-236 (`OPCIONES_EJERCICIO` solo por área) y `PasoPieza`. En 360 la idea es "Mini curso de Excel para dueños de negocio" y la Pieza 1 dice "Ayudo a principiantes sin experiencia a dominar una habilidad en 7 días…". No tiene relación con su idea, y debajo se repite "Tu idea: Mini curso de Excel…", lo que deja la incoherencia a la vista. El momento clave del recorrido se siente como una plantilla. → FIX: hasta que llegue la IA, sacar el segmento "para X" de la idea y ponerlo como primera opción de "¿A quién ayudas?". Quitar el bloque "Tu idea" de la pieza o reemplazarlo por algo que conecte las dos cosas.

A3. **La frase en vivo se descuadra.** Archivo: `components/onboarding/PasoEjercicio.tsx` L91-104. Los huecos son `<button>` (inline-block) dentro de un `<p>`. Cuando el valor es largo, el botón salta entero de línea y quedan "a", "días" y "sin" huérfanos en su propia línea (captura 360 `12-ejercicio-completo-arriba`). Además, el hueco vacío muestra "_ _ _ _ _" y encima el borde punteado de `.hueco-vacio` (globals.css L237), así que se ven dos rayas (pasos 09 y 10). → FIX: poner la clase `inline` + `box-decoration-break: clone` en los botones. En el hueco vacío, usar solo el borde punteado sobre un espaciador de nbsp, sin los guiones bajos.

### MEDIA
M1. **Duración contradictoria.** "¿Cuándo harás tu misión de **5 minutos**?" (lib L119) y "Con tu misión: **5 min** · 1 pieza" (reconocimiento) contra "Misión 1 · **2 min**" (PasoEjercicio L76), "en **2 minutos** armas" (PasoEtiqueta L62) y "Al terminar te llevas: **2 minutos**" (piezas.tsx L242). Cualquier usuario lo nota. → FIX: un solo número para la misión (5 min, que es la promesa de la ficha) y otro distinto, ya rotulado, para el recorrido ("Toma 2 minutos").

M2. **CTA muerto por defecto.** "Esta es mi idea" (PasoIdea L105) y "Armar mi pieza" (PasoEjercicio L224) arrancan desactivados al 65% (`.boton-oro:disabled`). Hay que señalar que 50 §A3 permite este patrón, pero el ancla del revisor lo prohíbe. → FIX: dejarlos activos. Al tocar sin completar, enfocar el primer hueco vacío o el campo, sacudirlo suave y mostrar la pista que ya existe.

M3. **Radios del mismo componente mezclados y distintos a la ficha.** Las opciones de pregunta usan 20px (`--radius-card`, pasos 01/02/04/07). Las opciones de idea y del ejercicio, que son el mismo patrón de fila elegible, usan 12px (`--radius-chip`, pasos 05/09/10). La FICHA-ARTE dice "filas/CTA/chips en píldora 999px". → FIX: un solo radio para toda fila elegible del recorrido (el que defina la ficha), aplicado en `opcion-recorrido`.

M4. **Vacío muerto.** Reconocimiento (paso 03): unos 300px vacíos entre el cuerpo y el CTA. Etiqueta (08): unos 180px. → FIX: subir el CTA bajo el contenido o llenar ese espacio con el mini-visual de la ruta (Día 1 → Día 30 en nodos), que además es el dispositivo de la marca.

M5. **Texto cortado por la barra fija** en la captura principal (`onboarding-375.png`): la línea "En este celular por ahora; pasa a tu cuenta al crearla." queda partida a media altura detrás del degradé de `.barra-inferior`. → FIX: que el degradé empiece opaco antes (transparent → base al 0-12%) o agregar `scroll-padding-bottom` + `pb-28` al contenido.

M6. **Truncado absurdo en la carga.** Archivo: `PasoArmando.tsx` L16-31. Aparecen "para neg…" y "dueños de pequeños negoci…", cuando la línea ya ocupa 2 renglones y hay espacio. → FIX: subir el máximo a ~60 y cortar por palabra, no por carácter.

M7. **Falta la salida "Otra cosa (escribe la tuya)"** en "¿En qué área…?" y "¿Qué te frena hoy?". Son categorías abiertas, y 50 §A2 marca esa opción como obligatoria. → FIX: agregarla como último chip, con un campo corto y "Continuar".

### MENOR
m1. "Al terminar te llevas: 2 minutos" no tiene sentido: uno no se lleva minutos (piezas.tsx L242). → "Toma 2 minutos".
m2. "Propuesta de valor" es jerga de marketing para un avatar "sin experiencia en negocios" (objeción 7) y no aparece en el léxico de la ficha. → Título visible: "Tu frase de negocio" o "Qué haces y para quién", y "propuesta de valor" como subtítulo.
m3. En la etiqueta (08) compiten dos titulares: "Tu ruta está lista para empezar" (18px bold) y el título de 28px. → bajar el primero a label.
m4. El resorte usa bounce 0.4-0.5 (OpcionRespuesta, PasoPieza L75 y L158) y la ficha fija 0.25 → ajustar.
m5. Si el reintento de la carga falla otra vez, no hay respaldo genérico (50 §B). Falta también la háptica al aparecer el reconocimiento (50 §A5).
m6. Las fichas de "Dónde la vas a usar" usan relieve piedra y no el fondo de acento al 8-12% del gate premium.

## Verificación en código (h3 / h7 / movimiento)
- h3: hay atrás en cada paso (`atras()` vuelve al anterior; en el primero, a "/"). Cada hueco se puede tocar para cambiarlo. "Editar" en la pieza vuelve al ejercicio. El estado persiste en localStorage. Si cambia el área, se vacía el ejercicio. No hay acciones destructivas.
- h7: Enter confirma "Escribir la mía", las sugerencias rellenan el campo, el avance es automático, se retoma donde quedó y hay bloqueo de doble toque.
- Movimiento: stagger ✓ · conteo (% del anillo y "1 de 30") ✓ · anillo y barras que se dibujan ✓ · tap <150ms ✓ · transición con dirección entre pasos ✓ · modales N/A · celebración (insignia con resorte + chispas + la pieza que vuela a Mi Empresa) ✓ · `useReducedMotion` en todos los componentes ✓. Se descuenta por el resorte fuera de la ficha (m4).
