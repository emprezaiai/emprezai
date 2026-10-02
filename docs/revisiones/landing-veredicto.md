# VEREDICTO revisor-visual — landing (página de ventas EMPRESAI) · re-revisión independiente tras corregir 5 defectos
Fecha: 2026-10-02 10:00
Screenshot: docs/revisiones/landing-375.png
Usabilidad: 35/40
Craft: 17/20
Copy (si vende): 17/20
Copy: 17/20
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos: (1) §6 la caja de ancla se contradice: check de beneficio junto a "te costaría $120" + "Valor total: $̶1̶2̶0̶" tachado en la misma caja · (2) §7 "15 días" aparece 3 veces en la tarjeta de garantía · (3) §8 filas del FAQ y puntos del carrusel sin feedback de toque <150ms · (4) §4 la línea punteada del camino sigue por debajo del nodo 3 · (5) §1 franja y §7 sellos con fichas circulares fuera del sistema de chips de 12px de la ficha

## Detalle
USABILIDAD 35/40 — h1:4 h2:4 h3:4 h4:3 h5:3 h6:4 h7:4 h8:3 h9:3 h10:3
CRAFT 17/20 — jerarquía:3 profundidad:4 identidad:4 movimiento:3 encaje:3
COPY 17/20 — idea:4 especificidad:3 emoción:3 oferta:3 acción:4 (ningún eje ≤2)
Gate doble: NO PASA por 1 punto (35/40 < 36). El craft PASA (17/20 ≥ 16). Gate de copy: PASA (17/20).
Gate de carga cognitiva: 0 fallas.
- El chip del mecanismo ya es una etiqueta (fondo 10%, radio 12px, ícono Puzzle) y no se confunde con el CTA outline.
- Los sellos ya no tienen canto.
- Las fichas tienen canto de 2px.
Anti-clon: no coincide con "Capítulo" ni con "Umbral". CTA héroe vivo: PASA (≈12:1 · whileTap 0.97 · nunca deshabilitado · 52-56px).
FICHA-ARTE frente a la captura: la paleta, Bricolage/Instrument, el radio de 20px, el CTA en píldora y la firma de la Ruta (camino de nodos) coinciden. Desvío menor: siguen los chips circulares en §1 y §7.
Sub-checks de copy:
- Message-match: N-A.
- Garantía nombrada con plazo cerca del CTA de compra: PASA.

Qué cambió frente a la pasada anterior (33 · 16 · 16):
- h8 sube 2→3: la oferta bajó de ≈2,4 a ≈1,6 pantallas y el mensual ya no repite la lista.
- h3 sube 3→4: se acepta que "Entrar" no aparezca mientras /login no exista. Enlazar a un 404 violaría la regla UX 11. Queda pendiente anotado.
- h4 sigue en 3: chips circulares y cuadrados mezclados, CTAs de 48/52/56px y el check usado como símbolo de costo en el ancla.
- h5 sigue en 3: el ancla de precio se lee contradictoria (defecto 1).
- Identidad sube 3→4: el camino de nodos con punteado dorado y el rayo en relieve del cierre son firma propia.
- Copy-idea sube 3→4: el Método aparece en el subtítulo del hero, en la solución, en el primer bullet del plan anual y en el PS.
- Movimiento sigue en 3: sin feedback de toque en las filas del FAQ ni en los puntos (Faq.tsx l.68-75 no tiene :active ni whileTap), y el camino de §4 no se dibuja al entrar.

## ¿El relieve se ve "no plano ni repetitivo"? (pedido de la dueña)
- (a) NO PLANO: ✅ CUMPLE. Las 9 secciones con contenido tienen ícono en relieve.
  - §1: franja y ficha del demo.
  - §2 y §8: fichas piedra.
  - §3: cifras.
  - §4: nodos oro y verde con número.
  - §6: checks.
  - §7: escudo grande y sellos.
  - §9: rayo dorado de 64px.
  - Las tarjetas tienen luz de borde y sombra, y las secciones alternan base y elevado.
  - Único residuo: las 2 frases de §3 son texto plano, aceptable como puente narrativo de 2 líneas.
- (b) NO REPETITIVO: ✅ CUMPLE, con residuo. Ahora cada bloque tiene una composición distinta: tarjeta-lista (§2), fila de cifras (§3), camino vertical de nodos (§4), comparativa (antes/después), carrusel (§5), cajas de precio (§6), sello centrado (§7), acordeón (§8) y cierre centrado con ficha (§9). Residuos de copy:
  - "$120" dos veces en la caja de ancla.
  - "15 días" ×3 en la garantía.
  - "7 días gratis" ×4 en la oferta (badge + CTA por plan, aceptado por la regla del 19).

## Auditoría de escaneabilidad (mobile 375px)
| § | Sección | >4 líneas seguidas | Íconos en dolores/beneficios/pasos | "Solo titulares" | Respiro | Cajas/acordeón | Resultado | Qué corregir |
|---|---|---|---|---|---|---|---|---|
| 1 | Hero | ✅ no | ✅ franja con 3 fichas | ✅ | ✅ | — | ⚠️ | Las fichas de la franja son círculos: pasarlas al chip de 12px de la ficha (`rounded-[var(--radius-chip)]`) |
| 2 | Problema | ✅ no | ✅ ficha piedra por pregunta | ✅ (kicker "EL PROBLEMA") | ✅ | ✅ tarjeta-lista | ✅ | — |
| 3 | Agitación | ✅ no | ✅ 3 cifras con ícono | ✅ | ✅ | ✅ fila en caja | ✅ | Opcional: la escena de las 7 PM como cita con borde para no dejarla en texto plano |
| 4 | Solución | ✅ no (big idea en 3 líneas) | ✅ nodos con ícono y número | ✅ | ✅ | camino de nodos + 2 cajas | ⚠️ | La línea punteada pasa el centro del nodo 3: terminarla en el nodo (segmentos entre nodos, o bottom igual al alto del último li menos 22px) |
| 5 | App por dentro | ✅ no | n/a | ✅ (ahora a la izquierda) | ✅ | carrusel manual con puntos | ✅ | — |
| 6 | Oferta | ✅ no | ✅ checks custom | ✅ | ✅ | ✅ ancla + 2 planes en cajas | ⚠️ | La caja de ancla se contradice (defecto 1) |
| 7 | Garantía | ✅ no (condición en 2 líneas) | ✅ escudo + sellos | ✅ | ✅ | ✅ caja con hairline | ⚠️ | "15 días" ×3 (defecto 2); sellos circulares (defecto 5) |
| 8 | FAQ | ✅ no | ✅ ficha por objeción | ✅ | ✅ | ✅ acordeón (1.º abierto) | ⚠️ | Feedback de toque <150ms en la fila (defecto 3) |
| 9 | CTA final + PS | ✅ PS en 4 líneas, ya sin itálica | ✅ rayo en relieve de 64px | ✅ | ✅ | — | ✅ | — |
| 10 | Footer | ✅ | n/a | ✅ | ✅ | — | ✅ | Email provisional: decisión ya tomada, no se puntúa |

## Top defectos (priorizados — corregir los 3 primeros alcanza para pasar el gate)
1. **[§6 caja de ancla, sobre los planes]**
   - Problema: se lee "✓ Mes a mes, un año completo te costaría $120" y, debajo, "Valor total: $̶1̶2̶0̶". El mismo número aparece afirmado y tachado en la misma caja. El check (símbolo de beneficio) acompaña un costo. Por eso h4=3, h5=3 y copy-oferta=3.
   - Fix: en el caso de 1 sola línea, que Oferta.tsx no pinte CheckCustom ni "Valor total". Dejar una línea sin check: "Mes a mes: $̶1̶2̶0̶ al año · Con el anual: **$79.99**".
2. **[§7 tarjeta de garantía]**
   - Problema: "15 días" se lee 3 veces (condición, sello 1 y piso legal).
   - Fix: el sello 1 pasa a "Dinero de vuelta" (ícono Wallet o BadgeDollarSign) y el piso legal a "Reembolso gestionado por Hotmart".
3. **[§8 filas del FAQ + puntos del carrusel §5]**
   - Problema: no hay respuesta táctil inmediata. Solo hay rotación y despliegue de 200-280ms.
   - Fix: en el botón de fila, `active:scale-[0.99] active:bg-white/[0.03] transition-transform duration-100`. En el punto activo, escala 1.25 al tocar.
4. **[§4 camino de nodos]**
   - Problema: el punteado sigue por debajo del nodo 3 y queda colgando.
   - Fix: pintar 2 segmentos entre los centros de los nodos (o calcular `bottom` con la altura del último paso). Para el eje de movimiento: dibujar el trazo al entrar (`scaleY` 0→1 con origin-top, 600ms, reduced-motion = estático).
5. **[§1 franja del hero + §7 sellos]**
   - Problema: las fichas son circulares (`rounded-full`) y la ficha pide chips de ícono de 10-14px como en el resto de la página.
   - Fix: usar `rounded-[var(--radius-chip)]` en las dos.

## Pendientes anotados (no puntúan)
- "Entrar" en el header: incorporarlo cuando exista /login.
- Capturas reales del carrusel en la Sesión 5.
- Verificar el claim "no se usa para entrenar IA" con el proveedor.
- Email de soporte con el dominio propio.
