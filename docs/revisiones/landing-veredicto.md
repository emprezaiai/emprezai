# VEREDICTO revisor-visual — landing (página de ventas EMPRESAI) · re-revisión independiente tras la 2.ª tanda de correcciones
Fecha: 2026-10-02 11:00
Screenshot: docs/revisiones/landing-375.png
Usabilidad: 37/40
Craft: 18/20
Copy (si vende): 17/20
Copy: 17/20
Fidelidad (si hubo referencia): N-A
Veredicto: LISTA
Top defectos: (1) §6 en el ancla, "$79.99" queda huérfano en una 2.ª línea centrada · (2) §6 el microcopy bajo los planes no nombra la garantía · (3) §3 las 2 frases puente son el único texto plano sin tratamiento · (4) §3 el sufijo de "12meses" queda pegado al número · (5) pendientes de integridad/operación ya anotados (Entrar, capturas reales, claim de IA, email)

## Detalle
USABILIDAD 37/40 — h1:4 h2:4 h3:4 h4:4 h5:4 h6:4 h7:4 h8:3 h9:3 h10:3
CRAFT 18/20 — jerarquía:3 profundidad:4 identidad:4 movimiento:4 encaje:3
COPY 17/20 — idea:4 especificidad:3 emoción:3 oferta:3 acción:4 (ningún eje ≤2)
Gate doble: PASA (37/40 ≥ 36 y 18/20 ≥ 16). Gate de copy: PASA (17/20, ningún eje ≤2).
Gate de carga cognitiva: 0 fallas. Anti-clon: no coincide con "Capítulo" ni con "Umbral". CTA héroe vivo: PASA (≈12:1 · whileTap 0.97 · nunca deshabilitado · 52-56px).
FICHA-ARTE frente a la captura: la paleta, Bricolage/Instrument, el radio de 20px, el CTA en píldora y los chips de ícono de 12px coinciden en toda la página (franja del hero y sellos incluidos). La firma de la Ruta (camino de nodos) está visible en §4.
Sub-checks de copy:
- Message-match: N-A.
- Garantía nombrada con plazo cerca del CTA de compra: PASA.

Qué se verificó en código y captura:
- **Ancla:** es una línea única. Oferta.tsx l.121 la renderiza sin check y sin "Valor total" cuando el stack tiene 1 línea.
- **Garantía:** "15 días" queda solo en la condición. Los sellos son "Dinero de vuelta · Solo un correo · Sin preguntas" y el piso legal dice "Reembolso gestionado por Hotmart".
- **Toque:** las filas del FAQ tienen `active:scale-[0.99]` de 100ms (Faq.tsx l.74) y los puntos del carrusel `active:scale-125` de 100ms (AppPorDentro.tsx l.150).
- **Camino:** cada paso pinta su segmento, que se dibuja al entrar con `scaleY` 0→1 en 600ms y queda estático con reduced-motion (Solucion.tsx l.98-103). Nada cuelga bajo el nodo 3.
- **Chips:** los de la franja del hero y los sellos tienen radio de 12px.

Qué cambió en la puntuación frente a la pasada anterior (35 · 17 · 17):
- h4 sube 3→4: cero variantes accidentales de chips y ya no hay check usado para un costo.
- h5 sube 3→4: el ancla ya no se contradice.
- Movimiento sube 3→4: las 7 baseline aplicables están en código con reduced-motion.

Por qué h8 queda en 3: la página mide 7672px. "7 días gratis" aparece 4 veces en la oferta (badge y CTA por plan, aceptado por la regla del 19), y hay 4 CTAs con la misma etiqueta. No molesta, pero un ojo entrenado lo nota.

## ¿El relieve se ve "no plano ni repetitivo"? (pedido de la dueña)
- (a) NO PLANO: ✅ CUMPLE. Las 9 secciones con contenido tienen fichas en relieve.
  - Fichas de color: oro (acción), verde (logro) y piedra (dolor).
  - Superficies: tarjetas con luz de borde y sombra; secciones que alternan base y elevado.
  - Elementos destacados: el rayo de 64px en el cierre y los nodos del camino.
  - Residuo menor: las 2 frases puente de §3 (defecto 3).
- (b) NO REPETITIVO: ✅ CUMPLE. Cada bloque tiene composición propia: tarjeta-lista (§2), fila de cifras (§3), camino de nodos (§4), comparativa (antes/después), carrusel (§5), ancla en línea + 2 cajas de precio (§6), sello centrado (§7), acordeón (§8) y cierre centrado con ficha (§9). La repetición de copy en la oferta y la garantía ya se corrigió.

## Auditoría de escaneabilidad (mobile 375px)
| § | Sección | >4 líneas seguidas | Íconos en dolores/beneficios/pasos | "Solo titulares" | Respiro | Cajas/acordeón | Resultado | Qué corregir |
|---|---|---|---|---|---|---|---|---|
| 1 | Hero | ✅ no | ✅ franja con 3 chips de 12px | ✅ | ✅ | — | ✅ | — |
| 2 | Problema | ✅ no | ✅ ficha piedra por pregunta | ✅ | ✅ | ✅ tarjeta-lista | ✅ | — |
| 3 | Agitación | ✅ no | ✅ 3 cifras con ícono | ✅ | ✅ | ✅ fila en caja | ⚠️ | Frases puente en texto plano (defecto 3) y sufijo "meses" pegado (defecto 4) |
| 4 | Solución | ✅ no | ✅ nodos con ícono y número | ✅ | ✅ | camino + 2 cajas | ✅ | — |
| 5 | App por dentro | ✅ no | n/a | ✅ | ✅ | carrusel manual con puntos | ✅ | — |
| 6 | Oferta | ✅ no | ✅ checks custom | ✅ | ✅ | ✅ ancla + 2 planes en cajas | ⚠️ | "$79.99" huérfano en el ancla (defecto 1) y garantía ausente del bloque de compra (defecto 2) |
| 7 | Garantía | ✅ no (condición en 2 líneas) | ✅ escudo + 3 sellos | ✅ | ✅ | ✅ caja con hairline | ✅ | — |
| 8 | FAQ | ✅ no | ✅ ficha por objeción | ✅ | ✅ | ✅ acordeón (1.º abierto) | ✅ | — |
| 9 | CTA final + PS | ✅ PS en 4 líneas, sin itálica | ✅ rayo en relieve de 64px | ✅ | ✅ | — | ✅ | — |
| 10 | Footer | ✅ | n/a | ✅ | ✅ | — | ✅ | Email provisional: decisión ya tomada, no se puntúa |

## Top defectos (priorizados — NO bloquean el gate; afinado)
1. **[§6 línea de ancla, bajo el título de la oferta]**
   - Problema: "Mes a mes: $̶1̶2̶0̶ al año · Con el anual:" ocupa la línea 1 y "$79.99" queda solo y centrado en la línea 2.
   - Fix: envolver "Con el anual: $79.99" en `whitespace-nowrap`, o acortar a "Mes a mes: $̶1̶2̶0̶/año · Anual: $79.99".
2. **[§6 microcopy bajo los planes]**
   - Problema: el bloque de compra no nombra la garantía. Solo aparece en la sección siguiente, y por eso copy-oferta=3.
   - Fix: sumar "· Garantía de la Primera Oferta, 15 días" al final del microcopy.
3. **[§3 frases puente: "A las 7 de la noche…" y "Y otro curso no lo arregla…"]**
   - Problema: son el único texto de la página sin tratamiento.
   - Fix: la escena de las 7 PM como cita con borde izquierdo piedra y una ficha Moon de 36px.
4. **[§3 cifra "12meses"]**
   - Problema: el sufijo `ml-0.5` queda pegado al número.
   - Fix: `ml-1` en el sufijo (también vale para "40h").
5. **[Pendientes anotados, fuera de esta pantalla]**
   - "Entrar" en el header cuando exista /login.
   - Capturas reales del carrusel (Sesión 5).
   - Verificar con el proveedor el claim "no se usa para entrenar IA".
   - Email de soporte con el dominio propio.
