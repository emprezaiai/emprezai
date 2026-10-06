# VEREDICTO revisor-visual — onboarding
Fecha: 2026-10-06 18:30
Screenshot: docs/revisiones/onboarding-375.png
Usabilidad: 32/40
Craft: 16/20
Copy (si vende): 18/20
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos: (1) la ruta en miniatura es la misma tarjeta estática en 6 pantallas, dice "Cada respuesta ajusta tu ruta" pero nunca cambia, y en las preguntas de 3 opciones deja un hueco de 180-260px a media pantalla · (2) en el área Cursos, el resultado genérico ("dominar una habilidad en 7 días") deja la frase vaga; el hueco vacío sigue mostrando "sin …." con 4 puntos · (3) el error de "Usar esta" sacude la tarjeta en vez del campo, el aviso sale lejos y no dice qué falló, y el botón es gris cuando "Continuar" es dorado · (4) el dorado se usa en todos los rótulos, bombillas e íconos, aunque la ficha lo restringe · (5) "Escribir la mía" queda bajo la barra fija a 375 y la pieza base dice "la afinamos en tu primera misión" cuando el usuario ya la hizo

---

## Re-revisión 3: qué se corrigió
| Hallazgo de la revisión 2 | Estado |
|---|---|
| 1. La idea y el cliente no se cuadran / falta el artículo | CORREGIDO en el camino por defecto. "Manejo de redes sociales: ayudo a negocios locales a conseguir clientes por redes sin contratar una agencia cara." y "Mini curso de Excel: ayudo a dueños de negocio a dominar una habilidad…" ya no se contradicen ni se repiten (`clienteDeLaIdea`, `ideaEnFrase`, `opcionesHueco`). Queda abierto: el resultado sigue saliendo solo del área y no usa el tema de la idea ("una habilidad" en lugar de "Excel") |
| 2. Vacío muerto | PARCIAL. La etiqueta queda llena (resumen + ruta) y la carga tiene esqueleto. En 01-punto, 05-ayuda y 07-momento el vacío ya no queda al pie: queda a media pantalla, entre las opciones y la ruta anclada (180-260px) |
| 3. La duración se contradice | CORREGIDO ("Toma unos 5 minutos" / "Misión 1 · Día 1" / "misión de 5 minutos") |
| 4. "Continuar" y "Usar esta" desactivados | CORREGIDO, ninguno lleva `disabled`. Pero el aviso de "Usar esta" no es igual al de PasoPregunta (ver defecto 3) |
| 5. Copiar/Editar en 12px · texto cortado bajo la barra | CORREGIDO (`--radius-pill`; "En este celular por ahora…" se lee completo en 13-pieza-arriba y en onboarding-375) |
| m5. Falta una pieza de respaldo | CORREGIDO (`piezaBase` al segundo fallo). Su texto de prueba choca con el momento (defecto 5) |
| Detalle: "sin …." con 4 puntos | PERSISTE |

## Detalle de puntajes
USABILIDAD 32/40: h1:3 h2:3 h3:3 h4:3 h5:3 h6:4 h7:3 h8:3 h9:3 h10:4
CRAFT 16/20: jerarquía:3 profundidad:3 identidad:3 movimiento:4 encaje:3
COPY 18/20: idea:3 especificidad:3 emoción:4 oferta:4 acción:4
FIDELIDAD: N/A
Falla el gate doble por usabilidad (32 < 36). Craft (16) pasa justo. Copy (18) pasa, sin ningún eje en 2 o menos.

- h1 = 3: la barra de % y la carga (anillo, 4 líneas y esqueleto) informan bien. La ruta promete "Cada respuesta ajusta tu ruta", pero `RutaMini` no recibe estado (piezas.tsx L274): lo que muestra no cambia nunca.
- h4 = 3: la misma acción (confirmar el texto propio) es "Continuar" dorado en PasoPregunta L116-123 y "Usar esta" gris en PasoEjercicio L216-229, y cada una avisa el error de forma distinta.
- h5 = 3: el error de raíz (idea contra cliente) queda evitado en el camino por defecto. Si el usuario elige otro cliente, la frase puede quedar casi repetida ("…para negocios locales: ayudo a dueños de pequeños negocios…"), pero ya no se contradice.
- h8 = 3: hay una sola acción primaria y la jerarquía está limpia. La ruta idéntica repetida en 6 pantallas funciona como papel tapiz, y hay huecos a media pantalla en las preguntas de 3 opciones.
- h9 = 3: los avisos en ámbar sí llegan. El de "Usar esta" dice "Te falta completar el hueco marcado" cuando el problema real es que escribiste menos de 3 letras.
- Gate de carga cognitiva: 1 falla límite. Freno, área y los huecos del ejercicio tienen 5 opciones si se cuenta la vía de "Otra cosa/Escribir la mía". No es crítico.
- CTA héroe vivo: dorado #FFC23D sobre #0F0D16, contraste aprox. 12:1 ✓ · whileTap 0.98 ✓ · ningún paso pasa `deshabilitado` a BotonPrincipal ✓ · 56px a ancho completo ✓.
- Ficha de arte: paleta, par Bricolage/Instrument, display de 28px, píldoras y resorte 0.25 coinciden. El desvío es el uso del acento: la ficha dice "SOLO en CTA, misión de hoy, nodo hoy, dato héroe", y en pantalla aparece en todos los rótulos en mayúsculas, bombillas, íconos de "Dónde la vas a usar" y en "Escribir la mía".
- Código h3/h7: hay atrás en cada paso, cada hueco se puede tocar, "Editar" vuelve al ejercicio y el estado se retoma desde localStorage. Enter confirma, las sugerencias rellenan el campo y el avance es automático a los 300ms.
- Movimiento: stagger ✓ · conteo (anillo %, "1 de 30") ✓ · anillo y barra que se dibujan ✓ · tap ✓ · transición con dirección ✓ · celebración ✓ · pulso del nodo Hoy (repeat 2) ✓ · `.sacudir` y `useReducedMotion` respetan reduced-motion ✓.
- Copy: el reconocimiento usa la escena literal de la ficha (7 PM, 15 min en blanco). La oferta del recorrido queda clara y con un solo número de tiempo. Message-match: no verificable (sin dato del 34). Garantía: N/A (aquí no hay CTA de compra).

## Top defectos (ubicación → fix)
1. **[Ruta en miniatura: 01/02/04/05-ayuda/07-momento/03/08]** `RutaMini` es estática y siempre igual, el rótulo "Cada respuesta ajusta tu ruta" no se cumple, y en las preguntas de 3 opciones queda un hueco de 180-260px entre las opciones y la ruta. → Pasarle las respuestas y nombrar lo que se desbloquea (ej. "Día 2 · tu cliente ideal", "a las 7 PM") para que cambie paso a paso, o cambiar el rótulo y subir la tarjeta 24px bajo las opciones.
2. **[Ejercicio, área Cursos + frase en vivo]** `lib/onboarding.ts` L244: "dominar una habilidad en 7 días" deja vaga "Mini curso de Excel: ayudo a dueños de negocio a dominar una habilidad…". Además, el hueco vacío muestra "sin …." → Extraer el tema de la idea (lo que va antes de "para") como 1ª opción de resultado ("dominar Excel en 7 días"), y no agregar "." cuando el último hueco está vacío (PasoEjercicio L121-123).
3. **[Ejercicio → "Usar esta"]** PasoEjercicio L218-226: el error sacude la tarjeta de la frase y el aviso sale bajo el CTA con un texto que no describe el error. El botón es gris, pero el equivalente en PasoPregunta es dorado. → Sacudir el input con `border-warning`, poner "Escribe al menos unas letras" justo debajo y unificar el estilo con "Continuar".
4. **[Acento dorado en todas las pantallas]** Los rótulos en mayúsculas de RutaMini, PromesaRecorrido y "Dónde la vas a usar", las bombillas, los íconos de lista y "Escribir la mía" van en `text-gold`, contra lo que dice FICHA-ARTE ("SOLO en CTA/misión de hoy/nodo hoy/dato héroe"). → Pasar esos rótulos e íconos a `text-ink-3`/`ink-2` y dejar el oro solo en la palabra acento del título, el nodo Hoy, los huecos llenos y el CTA.
5. **[Ejercicio 375 arriba + pieza base]** "Escribir la mía" queda tapada por la barra fija (se ve un fantasma en 09/10-arriba). `piezaBase` dice "la afinamos con tus respuestas en tu primera misión" justo cuando la misión 1 acaba de terminar. → Dar al contenido un `pb` igual al alto de la barra, y cambiar el texto a "Es una versión base: la afinamos mañana en tu Día 2".
