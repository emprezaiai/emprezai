# VEREDICTO revisor-visual — landing (página de ventas EMPRESAI) · revisión independiente (post-corrección garantía/franjas/cifras)
Fecha: 2026-09-30 23:30
Screenshot: docs/revisiones/landing-375.png
Usabilidad: 33/40
Craft: 16/20
Copy (si vende): 16/20
Copy: 16/20
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos: (1) §6 Oferta repite 3 veces las mismas promesas (stack + anual + mensual) y el stack "12 meses… $120 · Todo incluido en ambos planes" confunde al plan mensual · (2) el chip "el Método Pieza a Pieza" es gemelo del CTA outline del plan mensual y el canto sólido "de botón de juego" se aplica a elementos inertes (sellos, fichas) → parecen tocables y no hacen nada · (3) §9 CTA final es la única sección sin ícono ni elemento en relieve y el PS va en itálica sintética · (4) molde "tarjeta oscura + ficha a la izquierda + texto" repetido en §2, §4 pasos, §4 antes/después y §8, con cabeceras que alternan izquierda/centro sin regla · (5) sin "Entrar" para quien ya compró + rótulo "Ejemplo real" sobre un demo armado

## Detalle
USABILIDAD 33/40 — h1:4 h2:4 h3:3 h4:3 h5:3 h6:4 h7:4 h8:2 h9:3 h10:3
CRAFT 16/20 — jerarquía:3 profundidad:4 identidad:3 movimiento:3 encaje:3
COPY 16/20 — idea:3 especificidad:3 emoción:3 oferta:3 acción:4 (ningún eje ≤2)
Gate doble: NO PASA. La usabilidad queda en 33/40 (mínimo 36). El craft llega justo al mínimo: 16/20. Gate de copy: PASA justo (16/20).
Gate de carga cognitiva: 1 falla, "cero elementos que parezcan interactivos y no hagan nada" (defecto 2). No es sobrecarga crítica.
Anti-clon: no coincide con "Capítulo". Tampoco con "Umbral": el fondo es violeta-tinta #0F0D16 y no pizarra, el dorado #FFC23D es saturado y no latón, y la fuente es Bricolage y no Archivo.
CTA héroe vivo: PASA en los 4 puntos.
- Contraste: #0F0D16 sobre #FFC23D da ≈12:1.
- Tiene whileTap 0.97 y hover.
- Nunca está deshabilitado: tiene guard de doble toque y estado lento a los 8 s.
- Mide 52-56px de alto y ocupa el ancho completo.
FICHA-ARTE frente a la captura: la paleta, Bricolage/Instrument, el radio de 20px y el CTA en píldora coinciden. Hay un desvío menor: la franja del hero (§1) y los sellos de la garantía usan chips CIRCULARES, y la ficha pide chips de ícono de 10-14px como en el resto de la página.
Sub-checks de copy:
- Message-match: N-A (no hay creativo de origen).
- Garantía nombrada con plazo cerca del CTA de compra: PASA. Es la sección inmediata a los planes y tiene su propio CTA. Pero la tarjeta de plan no la menciona.
Por qué baja cada punto:
- h8=2: la oferta ocupa ≈2,4 pantallas. "Nuevas rutas… día 30" ×3, documento descargable ×3, "7 días gratis" ×4 dentro de la sección; en la página va 8 veces.
- h5=3: "12 meses de misiones" + "Todo incluido en ambos planes".
- h4=3: cabeceras mixtas, chips circulares y cuadrados, CTAs de 48/52/56px.
- h3=3: sin "Entrar".
- Movimiento=3: las filas del FAQ y los puntos del carrusel no dan feedback de toque en menos de 150ms; solo hay rotación y despliegue de 200-280ms. El resto de las baseline está en código, con reduced-motion.

## ¿El relieve se ve "no plano ni repetitivo"? (pedido de la dueña)
- (a) NO PLANO: ⚠️ CUMPLE CASI TODO.
  - Tienen relieve: las fichas oro, verde y piedra con cara degradé, luz y canto (§2, §3, §4, §8, §7); las tarjetas con luz de borde y sombra; las secciones que alternan base y elevado; el demo del hero con su ficha dorada; los checks con canto.
  - Falla: §9 CTA final no tiene ningún ícono ni elemento en relieve, solo texto, botón y PS.
  - Las 2 frases de §3 flotan como texto plano antes y después de la fila de cifras.
  - Efecto secundario: el canto sólido es el lenguaje de "botón tocable" (Duolingo). Aplicado a sellos, fichas de dolor y la franja del hero, los elementos inertes parecen botones.
- (b) NO REPETITIVO: ❌ NO CUMPLE en dos frentes.
  - Copy: §6 repite las mismas promesas en el stack, en el plan anual y en el plan mensual. En §7, "15 días" aparece 3 veces dentro de la misma tarjeta (condición, sello y piso legal).
  - Composición: la anatomía "tarjeta oscura redondeada + ficha a la izquierda + texto" se repite en 4 lugares seguidos: §2 lista, §4 pasos, §4 antes/después y §8 FAQ. El ojo lee "la misma tarjeta" a lo largo de ≈4 pantallas.

## Auditoría de escaneabilidad (mobile 375px)
| § | Sección | >4 líneas seguidas | Íconos en dolores/beneficios/pasos | "Solo titulares" | Respiro | Cajas/acordeón | Resultado | Qué corregir |
|---|---|---|---|---|---|---|---|---|
| 1 | Hero | ✅ no | ✅ franja con 3 fichas | ✅ | ✅ | — | ⚠️ | Las fichas de la franja son círculos de 24px (fuera del sistema de chips de 12px de la ficha) y su canto las hace parecer botones. Usar el chip cuadrado de 12px, sin canto. El rótulo "Ejemplo real de una misión" dice "real" sobre un demo armado: cambiarlo a "Ejemplo de una misión". |
| 2 | Problema | ✅ no | ✅ ficha piedra por pregunta | ✅ | ✅ | ✅ tarjeta-lista | ✅ | Sin kicker (las demás secciones con h2 sí lo tienen). Opcional: "TE PASA ESTO". |
| 3 | Agitación | ✅ no | ✅ 3 cifras con ícono | ✅ (sin título propio, se apoya en §2) | ✅ | ✅ fila en caja | ⚠️ | Las 2 frases sueltas son texto plano. Poner la escena de las 7 PM con una ficha (Clock/Moon piedra) o como cita con borde. Las cifras van en blanco y docs/copy/landing.md dice "número en dorado": alinear el doc o el código. |
| 4 | Solución | ✅ no (big idea en 3 líneas) | ✅ pasos con ficha y número | ✅ | ✅ | ✅ tarjetas | ⚠️ | El chip del mecanismo en píldora con borde dorado es igual al CTA secundario y no es tocable. Los pasos y el antes/después repiten el molde de §2 y §8. Pasos como línea de tiempo vertical conectada (nodos de la Ruta, firma de la ficha). |
| 5 | App por dentro | ✅ no | n/a | ✅ | ✅ | carrusel manual con puntos | ✅ | — |
| 6 | Oferta | ✅ no | ✅ checks custom | ✅ | ✅ | ✅ stack + 2 planes en cajas | ❌ | ≈2,4 pantallas con las mismas promesas 3 veces. Quitar el stack o reducirlo a 1 línea de ancla. Plan mensual compacto: "Todo lo del anual" + "Cancelas en 1 toque". Corregir "12 meses… / ambos planes". |
| 7 | Garantía | ✅ no (condición en 2 líneas) | ✅ sellos con ficha | ✅ | ✅ | ✅ caja con hairline | ⚠️ | "15 días" aparece 3 veces en la misma tarjeta. Sello 1 → "Dinero de vuelta"; piso legal → "Reembolso gestionado por Hotmart". Los sellos en baldosas con canto parecen tocables. |
| 8 | FAQ | ✅ no | ✅ ficha por objeción | ✅ | ✅ | ✅ acordeón (1.º abierto) | ⚠️ | Feedback de toque <150ms en la fila (:active con fondo o escala 0.99). Mismo molde que §2/§4. |
| 9 | CTA final + PS | ⚠️ PS de 4 líneas en itálica | ❌ ningún ícono | ✅ | ✅ | — | ❌ | Agregar el rayo dorado (relieve-oro lg) sobre el h2 o un mini-resumen de 4 piezas con checks. La itálica es sintética porque Instrument Sans no carga style italic: cargarla o quitar la itálica. |
| 10 | Footer | ✅ | n/a | ✅ | ✅ | — | ✅ | Email provisional: es una decisión ya tomada, no se puntúa. |

## Top defectos (priorizados)
1. **[§6 Oferta: stack + tarjetas Anual/Mensual]** La sección dice lo mismo 3 veces.
   - "Nuevas rutas… día 30" ×3, el documento descargable ×3, "7 días gratis" ×4.
   - Ocupa ≈2,4 pantallas.
   - El stack "12 meses de misiones diarias con IA · $120" junto a "Todo incluido en ambos planes" hace creer al del plan mensual que recibe 12 meses.
   - El mecanismo bautizado no aparece en la oferta.
   - Por eso h8=2, h5=3 y copy-oferta=3.
   - Fix: el stack pasa a una sola línea de ancla bajo el título ("Mes a mes serían $120 al año — el anual: $79.99"). La tarjeta Mensual muestra "Todo lo del plan anual" + "Cancelas en 1 toque, cuando quieras". El plan Anual nombra "Método Pieza a Pieza" en su primer bullet.
2. **[§4 chip "el Método Pieza a Pieza" + §7 sellos + §1 franja del hero]** Hay elementos que parecen interactivos y no hacen nada (gate cognitivo).
   - El chip del mecanismo es una píldora con borde dorado, idéntica al CTA outline "Empezar mis 7 días gratis" del plan mensual.
   - Los sellos y las fichas inertes llevan el canto sólido de botón (`0 3px 0 var(--canto)`).
   - Fix: el chip del mecanismo pasa a etiqueta: fondo acento 10%, radio 12px, sin borde en píldora, con un ícono Puzzle. El canto sólido se reserva para lo tocable (CTA, nodos); lo inerte queda con luz superior + sombra difusa, sin canto.
3. **[§9 CTA final]** Es la única sección sin ícono ni elemento en relieve, y rompe el pedido (a) de la dueña. Además el PS va en itálica falsa porque la fuente no carga la variante italic.
   - Fix: poner una ficha `relieve-oro` lg con el rayo (Zap) sobre "Imagina tu día 30", o 4 mini-fichas "oferta · nombre · precio · textos" con check verde. PS sin itálica, o cargar `style: ['normal','italic']` en Instrument_Sans.
4. **[Cabeceras de sección + molde de tarjeta]** El ritmo es repetitivo (pedido b) y las cabeceras no siguen una regla de alineación.
   - Cabeceras a la izquierda en §2, §4 y §8; centradas en §5, §6, §7 y §9.
   - Kicker solo en 4 de 7 secciones.
   - La misma tarjeta "ficha + texto" en §2, §4 (pasos y antes/después) y §8.
   - Fix: una regla única (izquierda para las secciones de lista, centro solo para hero, oferta, garantía y CTA final). Rediseñar los pasos de §4 como camino vertical de 3 nodos conectados, con la firma de la Ruta de la ficha.
5. **[Header del hero + rótulo del demo]** No hay "Entrar" para quien ya compró y vuelve por "/" (h3=3). "Ejemplo real de una misión" afirma "real" sobre un demo armado.
   - Fix: pasar `loginHref` (enlace terciario de 13px a la derecha) y cambiar el rótulo a "Ejemplo de una misión".

## Defectos secundarios
- Las cifras de §3 van en text-primary, pero el doc de copy dice "número en dorado". Hay que alinear uno de los dos.
- "12meses": el sufijo con ml-0.5 queda casi pegado al número. Usar un espacio fino (ml-1).
- En la tarjeta Anual se apilan 3 líneas pequeñas casi del mismo tamaño (13 / 12 / 16px dorado): "menos de $0.22 al día", "Se cobra $79.99/año", "4 meses gratis". Fundir "Se cobra $79.99/año · menos de $0.22 al día" en una sola línea.
- La garantía de 15 días no aparece dentro de las tarjetas de plan. Sumar al microcopy de compra: "· Garantía de la Primera Oferta, 15 días".
