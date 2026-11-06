# VEREDICTO revisor-visual — landing (página de ventas EMPREZAI) · re-revisión tras la 2ª ronda de correcciones (commit 19e6c5b)
Fecha: 2026-11-06 18:00
Screenshot: docs/revisiones/landing-375.png
Usabilidad: 36/40
Craft: 18/20
Copy (si vende): 18/20
Copy: 18/20
Fidelidad (si hubo referencia): N-A
Veredicto: LISTA
Top defectos: (1) Integridad 61 bloquea PUBLICAR, no el gate de pantalla: Hotmart, el período gratis, el aviso por correo, la cancelación, "Sin Preguntas", "no entrena IA" y el gmail del pie siguen sin conectar ni verificar; además, la nueva FAQ "¿Y después del día 30?" vuelve a insinuar rutas nuevas que no existen · (2) §6 la tarjeta Anual sigue sin decir qué recibe la persona del mes 2 al 12; la respuesta solo está en la FAQ 5 de 6, plegada · (3) §8 el FAQ volvió a 6 preguntas (el gate pide 4-5) · (4) §2, §3 y antes/después de §4 tienen fichas 3D no interactivas que se ven tocables · (5) §6 los CTA de los planes usan otro verbo para el mismo destino, y la landing dice "/mes" mientras el paywall dice "al mes"

## Revisión 2026-11-06 (2ª ronda, commit 19e6c5b)

### Puntajes
USABILIDAD 36/40: h1:4 h2:4 h3:4 h4:3 h5:4 h6:4 h7:3 h8:3 h9:3 h10:4
CRAFT 18/20: jerarquía:3 profundidad:4 identidad:4 movimiento:4 encaje:3
COPY 18/20: idea:4 especificidad:3 emoción:4 oferta:3 acción:4 (ningún eje ≤2)
Gate doble: PASA. Usabilidad 36/40 (mínimo 36), craft 18/20 (mínimo 16) y copy 18/20 (mínimo 16, ningún eje ≤2).
La usabilidad pasa por el mínimo exacto: cualquier regresión la deja fuera.
LA PANTALLA ESTÁ LISTA, PERO NO SE PUEDE PUBLICAR: el gate de integridad 61 (TOP 1) sigue bloqueando la publicación hasta que Hotmart y Resend estén conectados y verificados.

### Gate de carga cognitiva: 2 fallas (no es sobrecarga crítica)
- Falla: el FAQ tiene 6 ítems y el tope es 4-5. Es una regresión de esta ronda: se agregó "¿Y después del día 30?" sin fusionar otra pregunta.
- Falla: hay fichas .ficha-3d no interactivas que se ven tocables, en §2, §3 y antes/después de §4.
- Pasan: 1 sola acción primaria, ≤4 opciones por decisión, 0 campos y el "qué sigue" es obvio.

### CTA héroe vivo: PASA
- Contraste: unos 11.6:1.
- Respuesta al toque: whileTap 0.97, spinner y "Reintentar" a los 8 s.
- Nunca está deshabilitado. Mide 52 y 56px, a ancho completo.

### Anclas de conversión: PASAN
- H1 en bold con el acento.
- 2 hairlines degradé.
- Chips SVG, sin emojis.
- Checkmarks custom.
- Fondos alternados.

### Test anti-clon: no coincide con "Capítulo" ni con "Umbral"

### Fidelidad con FICHA-ARTE: coincide
Paleta, Bricolage e Instrument Sans, radios de 20px y píldora, y radial del hero al 16%.

### Estado de los TOP DEFECTOS de la 1ª ronda del 2026-11-06
1. Anual sin valor del mes 2 al 12 — CERRADO EN PARTE.
   - Hecho: se agregó la FAQ "¿Y después del día 30?" (page.tsx l.223-227).
   - Abierto: la tarjeta Anual sigue sin decirlo (TOP 2). Además, la respuesta dice "cada ruta nueva que agreguemos", lo que vuelve a insinuar el claim retirado (TOP 1).
2. Desencaje del stack en §6 — CERRADO. Ahora son 2 líneas centradas dentro del padding: "Mes a mes: ~~$119.88~~/año" y "Anual: $79.99". Sin nowrap y sin ahorro repetido.
3. Captura de Hoy en §5 — CERRADO. app-hoy-v2.png termina en la tarjeta de racha y ninguna fila queda bajo el botón central.
4. Integridad 61 — SIGUE ABIERTO, sin cambios (TOP 1).
5. Acento "día 30" partido y tamaños 12/13 — CERRADO. "día 30" queda en una sola línea y la tarjeta anual va toda a 13px (Oferta.tsx l.177).

### TOP DEFECTOS (ordenados por impacto)
1. **[Microcopy de §6, FAQ 2, 5 y 6, franja del hero, §7, recap y PS de §9, pie] Integridad 61: bloquea PUBLICAR, no el gate de pantalla.**
   - Problema: siguen sin conectar ni verificar Hotmart, el período gratis de 7 días para una app externa (ESTADO l.69), "te avisamos antes de cobrar" (Resend sin conectar), "Cancelas cuando quieras" y "Sin permanencia", "Sin Preguntas", "Sin explicaciones" y "100% de vuelta" (falta la compra de prueba) y "no se usa para entrenar IA". El soporte es un gmail personal. Además, la FAQ 5 dice "cada ruta nueva que agreguemos" y no existe ninguna Ruta 2.
   - Fix: hacer la Sesión 6 completa antes de publicar (Hotmart, Resend, compra de prueba con reembolso, soporte@dominio). En la FAQ 5, dejar solo lo que existe: "lo editas, lo copias y lo descargas cuando quieras".
2. **[§6, tarjeta Anual, lista de beneficios] No dice qué recibe la persona del mes 2 al 12.**
   - Problema: la tarjeta sigue sin decirlo, y la respuesta solo está en la FAQ 5 de 6, plegada y muy abajo.
   - Fix: reemplazar "Tu racha diaria para no soltarlo" por "Después del día 30: editas y descargas tu negocio cuando quieras", o algo equivalente que sea real.
3. **[§8 FAQ] 6 preguntas, sobre el tope de 4-5.**
   - Fix: fusionar "¿Será otro curso que abandono a los 3 días?" con "¿Sirve si no sé nada de negocios ni de tecnología?" en una sola respuesta: 5 minutos al día, sin teoría, paso a paso.
4. **[§2 dolores, §3 chips de cifras, §4 chips de antes/después] Fichas 3D no interactivas que se ven tocables.**
   - Fix: el mismo criterio que ya se aplicó en la franja y los sellos: ícono plano en el acento, o canto de 1px sin brillo.
5. **[§6, CTA de ambos planes + sufijo de precio] Inconsistencias de texto con el resto de la página y el paywall.**
   - Problema: los planes dicen "Empezar mis 7 días gratis" y el resto de la página dice "Armar mi primera pieza gratis", aunque los dos van a /onboarding. La landing dice "/mes" y el paywall "al mes".
   - Fix: unificar el verbo (o dejar anotado que la diferencia es intencional) y usar "al mes" en los dos lados.

### Otros (no top)
- Especificidad: sigue sin prueba real, como un testimonio o el recorrido de la fundadora con fecha.
- El stack sigue siendo de una línea, no de componentes con $. Ya no se ve mal, pero no es el stack de 19 §6.

---

## Historial — revisión 2026-11-06, 1ª ronda (NO LISTA 35·17·18)

USABILIDAD 35/40: h1:4 h2:4 h3:4 h4:3 h5:4 h6:4 h7:3 h8:3 h9:3 h10:3
CRAFT 17/20: jerarquía:3 profundidad:4 identidad:4 movimiento:4 encaje:2
COPY 18/20: idea:4 especificidad:3 emoción:4 oferta:3 acción:4

Top defectos de entonces:
1. El Anual no dice qué recibe la persona del mes 2 al 12.
2. La tarjeta del stack, con nowrap, tocaba el borde.
3. La captura de Hoy tenía una fila cortada (4ª revisión).
4. Integridad 61.
5. "día 30" partido en dos líneas y la tarjeta anual mezclaba 12 y 13px.

Estado en la 2ª ronda: el 2, el 3 y el 5 se cerraron. El 1 se cerró en parte. El 4 sigue abierto.

## Historial — revisión 2026-10-23 (NO LISTA 34·17·17, auditoría pre-venta con el logo de la dueña y FichaViva)

USABILIDAD 34/40: h1:4 h2:3 h3:4 h4:3 h5:4 h6:4 h7:3 h8:3 h9:3 h10:3
CRAFT 17/20: jerarquía:3 profundidad:4 identidad:3 movimiento:4 encaje:3
COPY 17/20: idea:3 especificidad:3 emoción:4 oferta:3 acción:4

Top defectos de entonces:
1. Integridad 61: 8 claims de IA y 4 promesas operativas sin implementar.
2. §6: oferta incoherente con el paywall; mensual con 3 beneficios; stack de una línea.
3. Tres desencajes arrastrados: la franja del hero, la condición de §7 y la captura de Hoy.
4. Dos materiales de ficha y dos radios de chip de texto.
5. H1 de 12 palabras sin el mecanismo; título de §4 de 10 palabras.

Estado al 2026-11-06: el 2, el 3, el 4 y el 5 se cerraron. El 1 se cerró en parte: la IA ya es real, pero Hotmart y Resend siguen pendientes.

## Historial — revisión 2026-10-07 (LISTA 37·18·19, re-revisión con el carrusel de capturas reales y el enlace a /login)

USABILIDAD 37/40: h1:4 h2:4 h3:4 h4:4 h5:4 h6:4 h7:4 h8:3 h9:3 h10:3
CRAFT 18/20: jerarquía:3 profundidad:4 identidad:4 movimiento:4 encaje:3
COPY 19/20: idea:4 especificidad:3 emoción:4 oferta:4 acción:4

Top defectos de entonces:
1. Integridad 61: claims de IA en 8 lugares.
2. Integridad 61: "Nuevas rutas", "te avisamos antes de cobrar", "Cancelas en 1 toque" y "Devolución en 1 clic" sin implementar.
3. §5: la captura de Hoy corta una fila y la captura de Misión tiene cerca de un 30% de aire.
4. §7: la condición va en 4 líneas.
5. §1: franja despareja; "¿Ya pagaste? Entra" no está en el código.
