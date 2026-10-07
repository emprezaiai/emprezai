# VEREDICTO revisor-visual — Misión del día (misión guiada día 2 + aviso + día 8 IA + celebración)
Fecha: 2026-10-07 12:00
Screenshot: docs/revisiones/mision-375.png
Usabilidad: 26/40
Craft: 14/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): FIEL
Veredicto: NO LISTA
Top defectos: (1) día 8 con lenguaje de desarrollo y sin salida útil · (2) botón principal suelto en la página (a 360px queda bajo el pliegue) + 40-65% de vacío muerto · (3) pregunta 3 con 7 opciones y sin señal visible de selección múltiple · (4) la pregunta pesa menos que el título y no sigue la escala del recorrido · (5) la celebración muestra un ícono genérico en lugar de la pieza, sin conteo ni la firma "vuela a Mi Empresa"

## Detalle de puntaje
Usabilidad: h1:3 h2:2 h3:3 h4:2 h5:3 h6:3 h7:2 h8:2 h9:3 h10:3 = 26/40
Craft: jerarquía:2 profundidad:3 identidad:3 movimiento:3 encaje:3 = 14/20
Gate de carga cognitiva: 2-3 fallas de 8 (no es sobrecarga crítica). Falla en "≤4-5 ítems por grupo" y "≤4 opciones por decisión" (pregunta 3: 6 redes + "Otra cosa" = 7). A medias en "el qué sigue es obvio": la selección múltiple no se ve y, a 360px, "Continuar" queda fuera de la vista.
Test de fidelidad (referencia public/landing/mision-v2.png, 1 de 6 fallos): modo ✓ · hue del acento ✓ · clase display ✓ (grotesk) · radios ✓ (las filas en píldora de 999px están permitidas por FICHA-ARTE §Radio) · profundidad/sombras ✓ (relieve + hairline dorada en el elemento clave) · densidad/composición ✗ (la referencia ancla el CTA abajo y agrupa las opciones en una tarjeta con hairline; la captura deja la lista suelta, el CTA dentro del contenido y la mitad inferior vacía).
Verificado en código: reduced-motion (useReducedMotion en todo el flujo, .sacudir en globals.css:268) ✓ · aria-live en "armando" y en la celebración ✓ · Enter envía "Otra cosa" ✓ · atajo para saltar entre respuestas con chips ✓ · Escape no cancela ✗ · no hay respuestas por defecto ✗.

## Hallazgos por severidad

### ALTA
1. components/interna/Mision.tsx:123-129 (día 8, captura 21) — El texto "Vista previa: la IA se conecta en la próxima etapa de construcción" está en lenguaje de desarrollo y lo ve una clienta que ya pagó. Además la pantalla es un callejón sin salida: no hay acción principal, solo "Volver a Hoy" con estilo secundario, y queda un 50% de vacío. Según el comentario de las líneas 4-6, esto aplica desde el día 5, así que la ruta se corta después del día 4. → FIX: reescribir en el mundo del usuario y dar una acción con valor (repasar o mejorar una pieza ya armada en Mi Empresa); no presentar "etapas de construcción".
2. Mision.tsx:330-339 y 369-372 (capturas 10, 11, 12-final, 13, 14 y 12 a 360px) — "Continuar" y "Guardar en Mi Empresa" quedan dentro del contenido, no anclados abajo. A 360px, en la pregunta 3, "Continuar" queda bajo el pliegue. En P1, P2, "armando", el resultado y el aviso (Mision.tsx:52-65) entre el 40% y el 65% inferior queda vacío. El recorrido de inicio ya resuelve esto con `barra-inferior sticky bottom-0 mt-auto` (components/onboarding/piezas.tsx:227), y la referencia aprobada también ancla el CTA. → FIX: reutilizar la barra-inferior sticky para Continuar/Guardar/Ver Mi Empresa, con `mt-auto` y la zona de safe-area.
3. Mision.tsx:261-281 + lib/misiones.ts:64-66 (captura 12) — La pregunta 3 ofrece 7 filas, por encima del límite de 4-5. Además, las filas sin marcar no muestran ningún indicador: lo único que dice que es de opción múltiple es la pista "Elige todas las que apliquen". Como en P1 y P2 tocar ya avanza solo, quien toque una red puede esperar que avance. → FIX: poner un círculo vacío de 24px en todas las filas cuando `multiple` es true (y un radio en las de opción única, como en la referencia), y mostrar las 6 redes como rejilla de chips en 2 columnas.

### MEDIA
4. Mision.tsx:85 vs 255 — La pregunta (h2 `text-xl`, 20px) se ve más chica que el título de la misión (h1 `text-2xl`, 24px), aunque es el objeto principal del paso. Además el recorrido de inicio usa `text-pregunta` (28px) con TituloAcento (components/onboarding/PasoPregunta.tsx:70): es el mismo componente con otra escala, una inconsistencia accidental. Hay 6 tamaños en pantalla (12/13/15/17/20/24). → FIX: durante las preguntas, compactar el encabezado (título a 18px) y usar `text-pregunta` + TituloAcento en la pregunta.
5. Mision.tsx:404-433 (captura 15) — La celebración tiene tres carencias. El héroe es un check genérico, no el artefacto real (56 §M1.2: "nunca un ícono genérico"); la pieza recién armada no aparece. "Racha de 2 días · 2 de 30 piezas" es texto fijo: no hay conteo animado (baseline #2). Y no está implementada la firma de motion de FICHA-ARTE:46-47 ("la pieza vuela a Mi Empresa y el tick se enciende en verde"). → FIX: mostrar como héroe una mini-tarjeta con la pieza (120-160px), contar la racha y las piezas de 0 al valor, y animar esa tarjeta hacia "Ver en Mi Empresa".
6. lib/misiones.ts:73 (captura 14) — Hay un error de concordancia en la pieza: "Dueños de pequeños negocios… Lo que más le duele… Dónde encontrarlo". El sujeto es plural y el resto va en singular, y eso queda guardado en Mi Empresa. → FIX: concordar según el número del sujeto (o redactar "Tu cliente: dueños de… Lo que más les duele… Dónde encontrarlos").
7. Mision.tsx:72-78 — La flecha de volver sale a /app y descarta las respuestas en curso sin aviso, porque el estado es local. → FIX: guardar el borrador de respuestas en la cuenta o pedir confirmación al salir con el paso ≥2.

### BAJA
8. Mision.tsx:256 — `items-center` centra la bombilla contra una pista de 2 líneas y no queda alineada con la primera línea (capturas 10-12). → FIX: `items-start` + `mt-0.5` en el ícono.
9. Mision.tsx:461 (captura 15) — La línea que conecta los nodos 1 y 2 (ambos hechos) sigue gris. El progreso no se "dibuja", y falta la baseline #3. → FIX: un segmento verde con largo igual al avance, animado con scaleX.
10. Mision.tsx:227-233 — Los chips de respuesta miden 44px de alto y llevan texto de 12px, así que pesan más que el chip "Se arma con" (~24px) que está justo encima: son dos estilos de chip vecinos. Con selección múltiple, `join(', ')` no tiene truncado. → FIX: `truncate max-w-full` y un prefijo del tema ("Edad:", "Dolor:").
11. Mision.tsx:172-182 — No se bloquea el doble toque durante los 300ms del avance automático. En la última pregunta, `armar()` puede programarse dos veces (y vibrar dos veces). → FIX: ignorar los toques mientras haya un temporizador activo.
12. Mision.tsx:286-317 — Escape no cierra "Otra cosa". → FIX: `onKeyDown` Escape → cancelar.
