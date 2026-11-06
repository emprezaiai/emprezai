# VEREDICTO revisor-visual — onboarding
Fecha: 2026-11-06 16:00
Screenshot: docs/revisiones/onboarding-375.png
Usabilidad: 37/40
Craft: 18/20
Copy (si vende): 19/20
Fidelidad (si hubo referencia): N-A
Veredicto: LISTA
Top defectos: (1) En 03-reconocimiento quedan unos 100 pt de aire entre la tarjeta de la ruta y el botón principal: el bloque se centra en el alto, pero el botón fijo va aparte (PasoReconocimiento L36) · (2) "Otra cosa (escribe la tuya)" se ve distinta según la pantalla: ficha redonda a la izquierda en las preguntas (02, 04) y lápiz al final en el ejercicio (10). Es el mismo control con dos apariencias (piezas.tsx OpcionRespuesta vs PasoEjercicio L218-222) · (3) En el paso 1 del ejercicio se muestran 5 opciones (cliente de la idea + 3 + "Otra cosa") y la 5ª queda tapada por el botón fijo en la primera vista (opcionesHueco L383) · (4) En la pieza, la ficha "Pieza 1" que vuela hacia "Guardada en Mi Empresa" pasa por encima del texto "Guardada" (14-pieza-arriba). Es momentáneo (PasoPieza L148-157) · (5) El subtítulo del ejercicio dice "(tu propuesta de valor)", un término de marketing que el avatar no usa (PasoEjercicio L85)

---

## Re-revisión 2026-11-06 #2 (commit 19e6c5b, segunda ronda de correcciones)

### Estado de los TOP DEFECTOS del veredicto 2026-11-06 #1
| # | Defecto anterior | Estado | Evidencia |
|---|---|---|---|
| 1 | Frase incoherente ("redes sociales … ordenar sus ventas y cobros") y la IA cambiaba el resultado elegido | **CERRADO** | `sinRepetir` (lib/onboarding.ts L353-363) reformula en lugar de descartar: "conseguir clientes por redes" pasa a "conseguir clientes" y queda primera (10-ejercicio-2). La frase de 11 se lee coherente y sin repetir palabras. El encargo (ia-encargos L37-39) pide "Conserva el sentido EXACTO del cliente, el resultado y el dolor… no los cambies por otros". En 14-pieza: «Ayudo a negocios locales a conseguir clientes con sus redes sociales, sin contratar una agencia cara.», que respeta las 3 elecciones. (La IA de las capturas sigue simulada; en producción solo está verificado el prompt.) |
| 2 | Aire en medio de 01, 03 y 07 | **CERRADO en 01 y 07 / PARCIAL en 03** | PasoPregunta L52: contenido + pie en un bloque `justify-center` con el pie a mt-8, y 01 y 07 quedan equilibrados. En 03 el bloque se centra, pero quedan unos 100 pt bajo la tarjeta de la ruta antes del botón fijo → defecto 1 (menor) |
| 3 | Opciones del ejercicio sin borde izquierdo común | **CERRADO** | PasoEjercicio L218-222: "Otra cosa" sin ficha, con texto en px-5 y el lápiz al final. En 10-ejercicio-2-final las 5 píldoras arrancan en el mismo borde. Queda la diferencia con las preguntas → defecto 2 |
| 4 | "Tu prueba de hoy" de 5 líneas | **CERRADO** | Encargo: "UNA sola acción… máx. 140 caracteres… Sin 'luego'" + `validar texto(150)`. En 14-pieza son 3 líneas |
| 5 | RutaMini cambiaba un Set durante el render | **CERRADO** | piezas.tsx L357-359: el registro va en `useEffect` y el render solo lee (L404). Una respuesta cambiada al volver atrás se anima una vez |

### Detalle de puntajes
USABILIDAD 37/40: h1:4 h2:4 h3:4 h4:3 h5:4 h6:4 h7:3 h8:3 h9:4 h10:4
CRAFT 18/20: jerarquía:3 profundidad:4 identidad:4 movimiento:4 encaje:3
COPY 19/20: idea:3 especificidad:4 emoción:4 oferta:4 acción:4
FIDELIDAD: N/A

- h1 = 4: el auto-avance con check, la frase en vivo, el anillo que nunca se congela (13-armando-espera: 93%, mensaje rotando + "Volver a mi frase"), el conteo de "1 de 30 piezas" y el estado de "Copiar" dan feedback en todo.
- h3 = 4 (antes 3): ahora "Editar" sirve de verdad, porque la pieza respeta lo que la persona eligió. Hay atrás en cada pregunta, Cancelar en los dos campos propios y salida durante la espera.
- h4 = 3: "Otra cosa" tiene dos apariencias según la pantalla.
- h7 = 3: hay defaults inteligentes (el cliente que sale de la idea va primero, sugerencias por área), Enter confirma y el avance es automático. No hay más atajos.
- h8 = 3: hay una sola acción primaria por pantalla. Solo un ojo entrenado nota el aire de 03 y la 5ª opción escondida en el ejercicio.
- Gate de carga cognitiva: 0 fallas duras (las 5 opciones de freno, área y ejercicio paso 1 están justo en el límite). Los bloques de texto miden ≤4 líneas y en cada pantalla está claro qué sigue.
- CTA héroe vivo (4/4): dorado #FFC23D sobre casi-negro, con un contraste aprox. 12:1 · whileTap 0.98 · nunca deshabilitado: valida al click con sacudida y nota en ámbar · h-14 a ancho completo, fijo, con safe-area (`.barra-inferior` con fundido de 16 px).
- Anclas de conversión: los títulos llevan las palabras clave en dorado ✓ · hairline-oro en la frase, la pieza y el esqueleto ✓ · íconos SVG en fichas, cero emojis ✓ · las capas se distinguen (base con degradé, relieve, hundido) ✓.
- FICHA-ARTE: en las capturas se ven el fondo #0F0D16, el dorado #FFC23D, el verde #3DDC97 para lo hecho, Bricolage + Instrument, radios de 18-22 px y píldoras, el logo EMPREZ + AI y el guepardo en la victoria. Coinciden. Anti-clon: no coincide con ningún ejemplo vetado.
- Movimiento = 4 (verificado en el código): stagger · conteo del % y de las piezas · el anillo se dibuja y la barra crece · whileTap · slide direccional · AnimatePresence en campos y mensajes · celebración con resorte + chispas + la pieza que vuela · `useReducedMotion` en todos los componentes.
- Encaje = 3: el aire de 03 y la ficha voladora que pisa el texto. Los radios, el centrado del % y el padding son correctos.
- Copy: todo se traza a FICHA-AVATAR (momento de las 7 PM con 15 min en blanco, "hoja en blanco", "directo al grano", "5 minutos", frenos = dolores, "Gratis, sin crear cuenta" = objeción de precio). Especificidad sube a 4: la frase de la pieza es coherente, nombra a quién, qué logra y qué evita, y la prueba es concreta ("Escribe hoy a 3 negocios de tu barrio…"). La idea queda en 3: el mecanismo ("misión" → "pieza") se repite, pero no lleva un nombre propio que lo bautice.

### Top defectos (ubicación → fix)
1. **[03-reconocimiento, entre la tarjeta "Así avanzas" y "Tiene sentido, sigamos" · PasoReconocimiento L36]** Quedan unos 100 pt de aire. → Cambiar a `justify-evenly` o agrandar la comparativa (fichas de 48 px, dato en text-lg) para que el bloque ocupe unos ⅘ del alto.
2. **["Otra cosa (escribe la tuya)" en 02/04 vs 10 · piezas.tsx OpcionRespuesta + PasoEjercicio L218-222]** El mismo control tiene dos apariencias. → Extraer `OpcionOtra` con el lápiz al final y usarla también en PasoPregunta, o dejar la ficha en ambos sitios.
3. **[Ejercicio paso 1, onboarding-375 · lib/onboarding.ts L383]** Son 5 opciones y la 5ª queda tapada por el botón fijo. → Cuando hay `propia`, devolver `[propia, ...base.slice(0, 2)]`: 3 opciones + "Otra cosa", todo en la primera vista.
4. **[Tarjeta "Guardada en Mi Empresa", 14-pieza-arriba · PasoPieza L148-157]** La ficha "Pieza 1" pasa por encima de la palabra "Guardada" mientras vuela. → Hacer que aterrice en el centro del check (`top-1/2 left-4 -translate-y-1/2`) y desvanecerla antes de que cruce el texto (opacity 0 desde times 0.7).
5. **[Subtítulo del ejercicio · PasoEjercicio L85]** "(tu propuesta de valor)" es jerga de marketing. → Cambiar por "Qué haces y para quién, en una frase que puedas decir en 5 segundos." (eco de "5 minutos" / "directo al grano").

---

## Historial — Re-revisión 2026-11-06 #1: LISTA 36·18·18
Top defectos de entonces: (1) frase incoherente en el camino por defecto ("redes sociales … ordenar sus ventas y cobros") y una IA ("mejóralas") que cambiaba el resultado elegido · (2) 130-160 pt de aire en medio de 01, 03 y 07 · (3) opciones del ejercicio sin borde izquierdo común · (4) "Tu prueba de hoy" de 5 líneas · (5) RutaMini cambiaba un Set de módulo durante el render.
Detalle de entonces: USABILIDAD h1:4 h2:4 h3:3 h4:3 h5:4 h6:4 h7:3 h8:3 h9:4 h10:4 · CRAFT jerarquía:3 profundidad:4 identidad:4 movimiento:4 encaje:3 · COPY idea:3 especificidad:3 emoción:4 oferta:4 acción:4.
En esa ronda se cerraron: el anillo congelado (fase 2 con mensajes rotando, salida a los 6 s, corte a 8 s), el campo propio unificado (`CampoPropio`), la huérfana "LLEVAS", la raya del hueco vacío, la metadata "5 minutos" y el guepardo en la pieza 1.

## Historial — Revisión de auditoría 2026-10-23: NO LISTA 34·16·18
Top defectos de entonces: (1) PasoArmando con la IA real: el anillo llegaba a 100% a los 4,6 s y quedaba congelado hasta 20 s, sin mensaje ni salida (rompía 50 §B2) · (2) la frase repetía palabras ("redes sociales … por redes") · (3) el modo "escribe la tuya" estaba en dos versiones, con doble dorado, y PasoPregunta no tenía Cancelar · (4) vacíos al pie en 01 y 12 + "LLEVAS" huérfana · (5) raya del hueco vacío desalineada y RutaMini animando sin etiqueta nueva.
Detalle de entonces: USABILIDAD h1:2 h2:4 h3:3 h4:3 h5:4 h6:4 h7:3 h8:3 h9:4 h10:4 · CRAFT jerarquía:3 profundidad:4 identidad:3 movimiento:3 encaje:3 · COPY idea:3 especificidad:3 emoción:4 oferta:4 acción:4.

## Historial — Re-revisión 6 (2026-10-07): LISTA 36·17·18
| Cambio | Estado |
|---|---|
| "¿Ya pagaste?" pasó de mailto a /login ("Entra aquí") | CORRECTO. Se mantienen el mismo lugar, el mismo estilo y el mismo min-h-11. /login existe |
| RutaMini con la prop `destacada` | SIN REGRESIÓN |
| PromesaRecorrido | Se renderizaba bien; tenía el defecto menor de la palabra huérfana |
| FichaIcono | SIN REGRESIÓN |

Detalle de entonces: USABILIDAD h1:4 h2:4 h3:3 h4:3 h5:4 h6:4 h7:3 h8:3 h9:4 h10:4 · CRAFT jerarquía:3 profundidad:4 identidad:3 movimiento:4 encaje:3 · COPY idea:3 especificidad:3 emoción:4 oferta:4 acción:4.
