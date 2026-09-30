# VEREDICTO revisor-visual — landing (página de ventas EMPRESAI) · 8ª pasada (post-elevación, correcciones)
Fecha: 2026-10-01 00:30
Screenshot: docs/revisiones/landing-375.png
Usabilidad: 38/40
Craft: 19/20
Copy (si vende): 17/20
Copy: 17/20
Fidelidad (si hubo referencia): N-A
Veredicto: LISTA
Top defectos: (1) la garantía se contradice: la condición dice "si la IA no te entrega tu oferta…" y el sello dice "Sin preguntas" · (2) la franja del hero y los sellos de la garantía se parten 2+1 con un huérfano centrado · (3) las etiquetas de las cifras de §3 no alinean (3 líneas contra 2) y el "12" queda sin unidad · (4) el email de soporte personal sigue visible (pendiente de decisión de la dueña) · (5) pendientes de integridad: claim "no se usa para entrenar IA" y consumo de ?plan=

## Detalle
USABILIDAD 38/40 — h1:4 h2:4 h3:4 h4:4 h5:4 h6:3 h7:4 h8:3 h9:4 h10:4
CRAFT 19/20 — jerarquía:4 profundidad:4 identidad:4 movimiento:4 encaje:3
COPY 17/20 — idea:3 especificidad:3 emoción:4 oferta:3 acción:4 (ningún eje ≤2)
Gate doble: PASA (38/40 ≥ 36 y 19/20 ≥ 16). Gate de copy: PASA (17/20).
Gate de carga cognitiva: 0 fallas. Anti-clon: no coincide con "Capítulo" ni con "Umbral". CTA héroe vivo: PASA.
Sub-checks: message-match N-A · garantía nombrada con plazo cerca del CTA de compra: PASA (con la contradicción del defecto 1).
Confirmado en código y captura:
- §2 es una sola tarjeta-lista con hairlines.
- §3 muestra las cifras en una fila de 3 columnas. El SSR trae el valor final y la cuenta escribe directo al DOM (Agitacion.tsx l.36-59).
- Se quitó el CTA post-§4.
- Checks del stack y de los planes en dorado 14%; franja del hero en piedra; sellos en oro. El verde queda confinado a paso 3, Día 30, demo y check del antes/después: vuelve el 60-30-10 de la ficha.
- Cifras en text-primary.
- h8 sube de 2 a 3 e identidad de 3 a 4 (paleta de la ficha restituida y material propio).

## ¿El relieve se ve "no plano ni repetitivo"?
- NO PLANO: ✅ CUMPLE. Fichas oro, verde y piedra con cara degradé, luz y canto; tarjetas con luz de borde.
- NO REPETITIVO: ✅ CUMPLE. Ahora hay composiciones distintas: tarjeta-lista (§2), fila de cifras (§3), tarjetas con número (§4), comparativa (antes/después), carrusel, cajas de precio, chips en fila (garantía) y acordeón (FAQ).
- Residuo aceptable: pasos (3) y FAQ (6) comparten la anatomía "ficha + texto", justificada por su función.

## Auditoría de escaneabilidad (PROMPT-LANDING)
| § | Sección | >4 líneas seguidas | Íconos en dolores/beneficios/pasos | "Solo titulares" | Respiro | Cajas/acordeón | Resultado | Qué corregir |
|---|---|---|---|---|---|---|---|---|
| 1 | Hero | ✅ no | ✅ franja con 3 fichas piedra | ✅ | ✅ | — | ⚠️ | La franja se parte 2+1 ("Cancelas en 1 toque" huérfana y centrada): 3 ítems en una fila (etiquetas cortas: "7 días gratis · 15 días garantía · Cancelas fácil") o lista vertical alineada |
| 2 | Problema | ✅ no | ✅ ficha piedra por fila | ✅ | ✅ | ✅ tarjeta-lista | ✅ | — |
| 3 | Agitación | ✅ no | ✅ 3 cifras con ícono | ✅ | ✅ | ✅ fila en caja | ⚠️ | La etiqueta de la col. 1 ocupa 3 líneas y las otras 2; el "12" no tiene unidad visible → etiquetas ≤2 líneas ("al mes, sin avanzar" · "en otro curso" · "más de sueldo") y "12 meses" con sufijo chico |
| 4 | Solución | ✅ no | ✅ pasos con ficha + número | ✅ | ✅ | ✅ tarjetas | ✅ | — |
| 5 | App por dentro | ✅ no | n/a | ✅ | ✅ | carrusel manual | ✅ | — |
| 6 | Oferta | ✅ no | ✅ checks dorados en relieve | ✅ | ✅ | ✅ stack + 2 planes en cajas | ✅ | — |
| 7 | Garantía | ✅ no (condición de 2 líneas) | ✅ chips-sello | ✅ | ✅ | ✅ caja | ⚠️ | "Sin preguntas" contradice la condición (defecto 1); los chips se parten 2+1 → 3 en una fila o 2 chips |
| 8 | FAQ | ✅ no | ✅ ficha por objeción | ✅ | ✅ | ✅ acordeón | ✅ | — |
| 9 | CTA final + PS | ✅ no (PS de 4 líneas, al límite) | n/a | ✅ | ✅ | — | ✅ | — |
| 10 | Footer | ✅ | n/a | ✅ | ✅ | — | ⚠️ | Email de soporte personal (defecto 4, decisión de la dueña) |

## Top defectos (priorizados; no bloquean el gate)
1. [§7 Garantía — copy/integridad] La condición "Si la IA no te entrega tu oferta lista para vender, te devolvemos todo" es CONDICIONAL, y el sello "Sin preguntas" promete lo contrario. Una garantía que se contradice genera disputas de reembolso y es un claim revisable en el gate 61 (baja copy-oferta a 3). → Elegir una: garantía incondicional de 15 días ("Si no te sirve, te devolvemos todo" + "Sin preguntas"), o mantener la condición y cambiar el sello por "Vía Hotmart". Alinear /reembolsos con la opción elegida.
2. [§1 franja del hero + §7 sellos — encaje] Los dos grupos de 3 chips se parten 2+1 con el tercero huérfano y centrado. → Acortar las etiquetas para que entren 3 en una fila a 335px, o apilar en columna alineada a la izquierda.
3. [§3 fila de cifras — encaje] Las etiquetas de 12px ocupan 3 líneas en la col. 1 y 2 en las demás (bases desalineadas); "12" se lee sin unidad. → Etiquetas de ≤2 líneas y sufijo "meses" chico junto al número (como "h" en "40h").
4. [Footer — email de contacto] Se sigue mostrando "adrianachacon15@hotmail.com". La decisión corresponde a la dueña y está avisada; queda como riesgo de confianza y de privacidad. → Reemplazarlo por soporte@<dominio> al comprar el dominio (pendiente en ESTADO.md).
5. [Integridad pendiente] El claim de la FAQ 5 "no se usa para entrenar IA" hay que verificarlo con el proveedor (gate 61). `?plan=anual|mensual` debe consumirlo el paywall (h6 = 3 hasta verificarlo).

## Defectos secundarios
- La prueba visual sigue siendo el demo y las vistas previas: reemplazarlas por capturas reales en la Sesión 5.
