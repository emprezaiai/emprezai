# VEREDICTO revisor-visual — landing (página de ventas EMPRESAI) · re-revisión con "La Garantía Sin Preguntas" y el ancla corregida
Fecha: 2026-10-06 10:00
Screenshot: docs/revisiones/landing-375.png
Usabilidad: 37/40
Craft: 18/20
Copy (si vende): 19/20
Copy: 19/20
Fidelidad (si hubo referencia): N-A
Veredicto: LISTA
Top defectos: (1) INTEGRIDAD antes de publicar: "Sin Preguntas" ahora es el NOMBRE (aparece 4 veces) y "Devolución en 1 clic" es un sello; los dos dependen del flujo real de reembolso de Hotmart · (2) §7 la condición ocupa 4 líneas centradas y desparejas · (3) §1 las etiquetas de la franja del hero se parten desparejo (1 línea contra 2) · (4) la prueba sigue limitada al demo y a las vistas previas (pendiente de la Sesión 5)

## Detalle
USABILIDAD 37/40 — h1:4 h2:4 h3:4 h4:4 h5:4 h6:4 h7:4 h8:3 h9:3 h10:3
CRAFT 18/20 — jerarquía:3 profundidad:4 identidad:4 movimiento:4 encaje:3
COPY 19/20 — idea:4 especificidad:3 emoción:4 oferta:4 acción:4 (ningún eje ≤2)
Gate doble: PASA (37/40 ≥ 36 y 18/20 ≥ 16). Gate de copy: PASA (19/20).
Gate de carga cognitiva: 0 fallas. Anti-clon: no coincide con "Capítulo" ni con "Umbral". CTA héroe vivo: PASA (≈12:1 · whileTap 0.97 · nunca deshabilitado · 52-56px · ancho completo).
Sub-checks de copy:
- Message-match: N-A.
- Garantía nombrada con plazo cerca del CTA de compra: PASA. Aparece con nombre en §7, en el recap y en el PS, y con plazo y punto de inicio en el microcopy bajo los planes.

Verificado en captura y código:
- **Nombre de la garantía:** "Primera Oferta" ya no aparece en app/, components/, lib/ ni en docs/copy (grep vacío). "La Garantía Sin Preguntas" está en §7, en el recap ("7 días gratis · Garantía Sin Preguntas"), en el PS y en docs/copy/landing.md l.79.
- **Ancla:** "Mes a mes: $̶1̶2̶0̶/año · Anual: $79.99" cabe en una sola línea, sin separador colgando.
- **§7:** la condición no repite "100%" ni "sin preguntas". Los sellos son "100% de vuelta · Devolución en 1 clic · Pago protegido".

Cambios frente a la pasada anterior (37 · 18 · 18):
- Copy-oferta sube 3→4: queda obvio qué recibo (features del plan anual + "todo lo del anual"), cuánto cuesta (ancla $120 → $79.99, total anual visible, $/día) y qué me protege (garantía con nombre, plazo y punto de inicio).
- Especificidad sigue en 3: no hay prueba de terceros. Es una decisión tomada (sin testimonios reales), pero sigue limitando el eje.

## Juicio del titular (hero) — sin cambios en esta pasada
| Criterio | ¿Cumple? | Evidencia |
|---|---|---|
| Dolor urgente | ✅ | Gancho "¿Otra noche en blanco frente a ChatGPT?" (dolor #1 + el momento del día) |
| Deseo | ✅ | "tu negocio armado en 30 días" (deseo #2) |
| Imagen mental | ✅ | Antes→después en el H1 + "Esta noche, en 5 minutos, la IA arma tu primera pieza" |
| Detiene el scroll | ✅ | Pregunta en 2.ª persona + H1 bold con acento + demo asomando |
| Unicidad | ✅ con matiz | El mecanismo ("primera pieza") está en el subtítulo y en el CTA; el H1 solo es genérico para el mercado |

## ¿El relieve se ve "no plano ni repetitivo"? (pedido de la dueña)
- (a) NO PLANO: ✅ CUMPLE. Las 9 secciones con contenido tienen fichas en relieve:
  - Fichas "noche" en §2.
  - Fichas oro, verde y piedra en el resto.
  - El camino de nodos de §4.
  - El escudo y 3 sellos de §7.
  - El rayo de 64px del cierre.
- (b) NO REPETITIVO: ✅ CUMPLE. Cada sección tiene composición propia. No quedan repeticiones de copy dentro de un mismo bloque, y no hay acentos ni íconos repetidos en bloques contiguos.

## Auditoría de escaneabilidad (mobile 375px)
| § | Sección | >4 líneas seguidas | Íconos en dolores/beneficios/pasos | "Solo titulares" | Respiro | Cajas/acordeón | Resultado | Qué corregir |
|---|---|---|---|---|---|---|---|---|
| 1 | Hero | ✅ no | ✅ gancho con ficha + franja con 3 chips | ✅ | ✅ | — | ⚠️ | Etiquetas de la franja desparejas (defecto 3) |
| 2 | Problema | ✅ no | ✅ ficha "noche" por dolor (excepción registrada) | ✅ | ✅ | ✅ tarjeta-lista | ✅ | — |
| 3 | Agitación | ✅ no | ✅ 3 cifras con ícono | ✅ | ✅ | ✅ fila en caja | ✅ | — |
| 4 | Solución | ✅ no | ✅ nodos con ícono y número | ✅ | ✅ | camino + 2 cajas | ✅ | — |
| 5 | App por dentro | ✅ no | n/a | ✅ | ✅ | carrusel manual con puntos | ✅ | — |
| 6 | Oferta | ✅ no | ✅ checks custom | ✅ | ✅ | ✅ ancla en 1 línea + 2 planes en cajas | ✅ | — |
| 7 | Garantía | ⚠️ condición en 4 líneas centradas (en el límite) | ✅ escudo + 3 sellos | ✅ el nombre resume la condición | ✅ | ✅ caja con hairline | ⚠️ | Condición a 3 líneas (defecto 2) |
| 8 | FAQ | ✅ no | ✅ ficha por objeción | ✅ | ✅ | ✅ acordeón (1.º abierto) | ✅ | — |
| 9 | CTA final + PS | ✅ PS en 4 líneas | ✅ rayo en relieve de 64px | ✅ | ✅ | — | ✅ | — |
| 10 | Footer | ✅ | n/a | ✅ | ✅ | — | ✅ | Email provisional: decisión ya tomada |

## Top defectos (priorizados — NO bloquean el gate de pantalla; el 1 bloquea PUBLICAR)
1. **[§7 nombre + sellos, recap y PS del CTA final, /reembolsos] Integridad, gate 61.**
   - Problema: "Sin Preguntas" pasó de sello a NOMBRE y aparece 4 veces; "Devolución en 1 clic" es un sello. Si el formulario de reembolso de Hotmart pide motivo o tiene más de un paso, la garantía insignia es falsa en toda la página.
   - Fix: antes de publicar (Sesión 6), hacer una compra de prueba y pedir el reembolso como comprador; documentar los pasos reales en ESTADO.md. Si no es literal, usar "Devolución con 1 solicitud". Si Hotmart exige motivo, renombrarla "La Garantía de 15 Días" y quitar "Sin Preguntas".
2. **[§7 condición bajo el nombre]**
   - Problema: 4 líneas centradas con bordes desparejos ("…primer pago. Si / sientes que la app no es para ti, / pides la devolución en 1 clic y te / devolvemos todo.").
   - Fix: "15 días desde tu primer pago. ¿No es para ti? Pides la devolución en 1 clic y te devolvemos todo." (cabe en 3 líneas), con `text-balance`.
3. **[§1 franja bajo el CTA del hero]**
   - Problema: "7 días gratis" va en 1 línea y "15 días de garantía" y "Cancelas en 1 toque" en 2, así que las bases quedan desparejas.
   - Fix: etiquetas de 1 línea ("7 días gratis · 15 días de garantía · Cancela cuando quieras" a 12px con `whitespace-nowrap`), o las 3 en 2 líneas deliberadas.
4. **[§1 demo + §5 carrusel] Prueba (eje de especificidad).**
   - Problema: toda la prueba es el demo rotulado y las vistas previas del diseño.
   - Fix: en la Sesión 5, reemplazarlos por capturas reales. Sumar en §5 o §9 una línea de prueba propia, que el INVENTARIO DE PRUEBA DÍA-1 de la ficha ya permite: "La fundadora está armando su propio negocio con la ruta: día X de 30".

## Pendientes anotados (no puntúan)
- Verificar en Hotmart "1 clic" y "sin preguntas" (defecto 1).
- "Entrar" cuando exista /login.
- Capturas reales del carrusel (Sesión 5).
- Verificar el claim "no se usa para entrenar IA" con el proveedor.
- Email de soporte con el dominio propio.
- Configurar Hotmart a 15 días desde el primer pago (Sesión 6).
