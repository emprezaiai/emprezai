# VEREDICTO revisor-visual — landing (página de ventas EMPRESAI) · re-revisión con la garantía redactada por la dueña
Fecha: 2026-10-02 16:00
Screenshot: docs/revisiones/landing-375.png
Usabilidad: 37/40
Craft: 18/20
Copy (si vende): 18/20
Copy: 18/20
Fidelidad (si hubo referencia): N-A
Veredicto: LISTA
Top defectos: (1) el nombre "La Garantía de la Primera Oferta" ya no corresponde a su condición (ahora es incondicional y no habla de la oferta) · (2) en el ancla de §6, el separador "·" sigue colgando al final de la 1.ª línea · (3) "Devolución en 1 clic" y "sin preguntas" son claims que hay que verificar contra el flujo real de Hotmart (gate 61) · (4) "100%" aparece en la condición y en el sello de al lado

## Detalle
USABILIDAD 37/40 — h1:4 h2:4 h3:4 h4:4 h5:4 h6:4 h7:4 h8:3 h9:3 h10:3
CRAFT 18/20 — jerarquía:3 profundidad:4 identidad:4 movimiento:4 encaje:3
COPY 18/20 — idea:4 especificidad:3 emoción:4 oferta:3 acción:4 (ningún eje ≤2)
Gate doble: PASA (37/40 ≥ 36 y 18/20 ≥ 16). Gate de copy: PASA (18/20).
Gate de carga cognitiva: 0 fallas. Anti-clon: no coincide con "Capítulo" ni con "Umbral". CTA héroe vivo: PASA.
Sub-checks de copy: message-match N-A. Garantía nombrada con plazo cerca del CTA de compra: PASA. Ahora además dice desde cuándo cuenta, tanto en §7 como en el microcopy bajo los planes.

Verificado en captura y código:
- **§7:** la condición dice "15 días desde tu primer pago…". Los sellos son "100% de vuelta · Devolución en 1 clic · Sin preguntas".
- **Microcopy bajo los planes:** dice "…15 días de garantía desde tu primer pago · te avisamos antes de cobrar" y ya no repite "cancelas en 1 toque".
- **/reembolsos:** app/reembolsos/page.tsx l.11 y l.22-25 dicen lo mismo, con plazo desde `PRECIOS.diasGarantia`.
- **FICHA-ARTE.md:** la l.37 ya registra la excepción aprobada de las fichas "noche" de §2. Queda resuelto el defecto 1 de la pasada anterior.

Puntuación sin cambios frente a la pasada anterior. Se resolvieron los defectos 1, 3 y 4. Copy-oferta sigue en 3 por una razón nueva: el nombre de la garantía promete algo que su condición ya no dice (defecto 1). La condición ocupa 4 líneas centradas, en el límite del presupuesto pero dentro.

## Juicio del titular (hero) — sin cambios en esta pasada
| Criterio | ¿Cumple? | Evidencia |
|---|---|---|
| Dolor urgente | ✅ | Gancho "¿Otra noche en blanco frente a ChatGPT?" (dolor #1 + el momento del día) |
| Deseo | ✅ | "tu negocio armado en 30 días" (deseo #2) |
| Imagen mental | ✅ | Antes→después en el H1 + "Esta noche, en 5 minutos, la IA arma tu primera pieza" |
| Detiene el scroll | ✅ | Pregunta en 2.ª persona + H1 bold con acento + demo asomando |
| Unicidad | ✅ con matiz | El mecanismo ("primera pieza") vive en el subtítulo y en el CTA; el H1 solo es genérico para el mercado |

## ¿El relieve se ve "no plano ni repetitivo"? (pedido de la dueña)
- (a) NO PLANO: ✅ CUMPLE. Las 9 secciones con contenido tienen fichas en relieve: noche en §2, oro, verde y piedra en el resto, el camino de nodos y el rayo del cierre. La garantía conserva su escudo grande y 3 sellos con ficha oro.
- (b) NO REPETITIVO: ✅ CUMPLE. Cada sección tiene composición propia y sin acentos ni íconos repetidos en bloques contiguos. Residuo menor: "100%" ×2 dentro de la misma tarjeta de garantía (defecto 4).

## Auditoría de escaneabilidad (mobile 375px)
| § | Sección | >4 líneas seguidas | Íconos en dolores/beneficios/pasos | "Solo titulares" | Respiro | Cajas/acordeón | Resultado | Qué corregir |
|---|---|---|---|---|---|---|---|---|
| 1 | Hero | ✅ no | ✅ gancho con ficha + franja con 3 chips | ✅ | ✅ | — | ✅ | — |
| 2 | Problema | ✅ no | ✅ ficha "noche" por dolor (excepción registrada en la ficha) | ✅ | ✅ | ✅ tarjeta-lista | ✅ | — |
| 3 | Agitación | ✅ no | ✅ 3 cifras con ícono | ✅ | ✅ | ✅ fila en caja | ✅ | — |
| 4 | Solución | ✅ no | ✅ nodos con ícono y número | ✅ | ✅ | camino + 2 cajas | ✅ | — |
| 5 | App por dentro | ✅ no | n/a | ✅ | ✅ | carrusel manual con puntos | ✅ | — |
| 6 | Oferta | ✅ no | ✅ checks custom | ✅ | ✅ | ✅ ancla + 2 planes en cajas | ⚠️ | "·" colgando en el ancla (defecto 2) |
| 7 | Garantía | ✅ condición en 4 líneas, al límite | ✅ escudo + 3 sellos | ⚠️ el titular ("…Primera Oferta") no resume lo que dice la caja | ✅ | ✅ caja con hairline | ⚠️ | Nombre desalineado con la condición (defecto 1); "100%" ×2 (defecto 4) |
| 8 | FAQ | ✅ no | ✅ ficha por objeción | ✅ | ✅ | ✅ acordeón (1.º abierto) | ✅ | — |
| 9 | CTA final + PS | ✅ PS en 4 líneas | ✅ rayo en relieve de 64px | ✅ | ✅ | — | ✅ | — |
| 10 | Footer | ✅ | n/a | ✅ | ✅ | — | ✅ | Email provisional: decisión ya tomada |

## Top defectos (priorizados — NO bloquean el gate)
1. **[§7 nombre de la garantía + recap del CTA final + PS + /reembolsos]**
   - Problema: "La Garantía de la Primera Oferta" nació de la condición vieja ("si no tienes tu oferta lista"). Ahora la garantía es incondicional ("si sientes que la app no es para ti"), así que el nombre promete un resultado que la condición ya no menciona.
   - Riesgo: quien solo lee titulares cree que la devolución depende de su oferta.
   - Fix: renombrarla con lo que sí garantiza, por ejemplo "La Garantía Sin Preguntas" o "Garantía de 15 Días Sin Preguntas". Aplicarlo en page.tsx l.180, l.237 y l.238, en app/reembolsos/page.tsx l.11 y l.22, y en docs/copy/landing.md. Es una decisión de nombre: proponérsela a la dueña con 2 opciones.
2. **[§6 línea de ancla bajo el título de la oferta]**
   - Problema: sigue "Mes a mes: $̶1̶2̶0̶ al año ·" con el separador colgando al final de la línea 1.
   - Fix: quitar el "·" y poner `block` en "Con el anual: $79.99" (2 líneas deliberadas), o acortar a "Mes a mes: $̶1̶2̶0̶/año · Anual: $79.99".
3. **[§7 sellos "Devolución en 1 clic" y "Sin preguntas"]**
   - Problema: son claims operativos de Hotmart. Si el formulario de reembolso pide motivo o tiene más de un paso, la promesa es falsa (gate 61, integridad).
   - Fix: verificar el flujo real del comprador en Hotmart antes de publicar. Si no es literal, "Devolución con 1 solicitud".
4. **[§7 condición + sello 1]**
   - Problema: "Hotmart te regresa el 100%" y el sello "100% de vuelta" están pegados.
   - Fix: sello 1 → "Pago protegido por Hotmart" (ícono ShieldCheck), o condición → "…y Hotmart te devuelve todo".

## Pendientes anotados (no puntúan)
- "Entrar" cuando exista /login.
- Capturas reales del carrusel (Sesión 5).
- Verificar el claim "no se usa para entrenar IA" con el proveedor.
- Email de soporte con el dominio propio.
- Configurar Hotmart a 15 días contados desde el primer pago (Sesión 6).
