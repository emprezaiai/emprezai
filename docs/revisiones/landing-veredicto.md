# VEREDICTO revisor-visual — landing (página de ventas EMPRESAI) · re-revisión tras corregir hero, §2, §4 y §6
Fecha: 2026-10-02 14:30
Screenshot: docs/revisiones/landing-375.png
Usabilidad: 37/40
Craft: 18/20
Copy (si vende): 18/20
Copy: 18/20
Fidelidad (si hubo referencia): N-A
Veredicto: LISTA
Top defectos: (1) los íconos dorados en los dolores de §2 (pedido de la dueña) contradicen "piedra = dolor" de FICHA-ARTE: anotar la excepción en la ficha · (2) en el ancla de §6, el separador "·" queda colgando al final de la 1.ª línea · (3) la relación entre la prueba de 7 días y la garantía de 15 días es ambigua (¿desde cuándo cuentan los 15 días?) · (4) "cancelas en 1 toque" aparece 3 veces (franja del hero, microcopy, plan mensual)

## Detalle
USABILIDAD 37/40 — h1:4 h2:4 h3:4 h4:4 h5:4 h6:4 h7:4 h8:3 h9:3 h10:3
CRAFT 18/20 — jerarquía:3 profundidad:4 identidad:4 movimiento:4 encaje:3
COPY 18/20 — idea:4 especificidad:3 emoción:4 oferta:3 acción:4 (ningún eje ≤2)
Gate doble: PASA (37/40 ≥ 36 y 18/20 ≥ 16). Gate de copy: PASA (18/20).
Gate de carga cognitiva: 0 fallas. El gancho perdió el borde y quedó como etiqueta de 12px con fondo al 8%, igual que el chip del mecanismo: ya no parece botón.
Anti-clon: no coincide con "Capítulo" ni con "Umbral". CTA héroe vivo: PASA (≈12:1 · whileTap 0.97 · nunca deshabilitado · 52-56px · ancho completo).
Sub-checks de copy: message-match N-A. Garantía nombrada con plazo cerca del CTA de compra: PASA, ahora también en el microcopy bajo los planes ("15 días de garantía").

Verificado en código y captura:
- **Halo:** `.relieve-noche` ya no tiene halo (globals.css l.100-107) y `.tarjeta-dolor` tiene borde blanco al 8%.
- **Frases de dolor:** la frase clave va en blanco bold y el resto en gris de lectura.
- **Ícono de la fila 3 de §2:** ahora es MonitorPlay, ya no repite el Hourglass de §3.
- **§4:** el H2 es "No te falta información: te falta *el paso de hoy*" y no repite el acento del H1.
- **Promesa unificada:** el subtítulo, la Big Idea, los pasos y el plan dicen "5 minutos" y "cada día", sin choque con "por noche".
- **Oferta y cifras:** "$79.99" ya no queda huérfano y "12 meses" tiene el sufijo separado.

Cambios de puntuación frente a la pasada anterior (36 · 17 · 18):
- h4 sube 3→4: el dorado vuelve a ser coherente (solo 5 íconos pequeños sin halo, como decisión explícita de la dueña) y desaparece la píldora con borde.
- Identidad sube 3→4: no queda glow regado fuera de la tarjeta héroe del demo.
- h8 sigue en 3: la página mide ≈7800px, tiene 4 CTAs con la misma etiqueta + el sticky, y hay repeticiones menores de micro-promesas (defecto 4).
- Copy-oferta sigue en 3: no queda claro desde cuándo cuentan los 15 días (defecto 3).

## Juicio del titular (hero)
| Criterio | ¿Cumple? | Evidencia |
|---|---|---|
| Dolor urgente | ✅ | Gancho "¿Otra noche en blanco frente a ChatGPT?": dolor #1 + el momento del día de la ficha. |
| Deseo | ✅ | "tu negocio armado en 30 días": deseo #2 casi literal. |
| Imagen mental | ✅ | "De la hoja en blanco a tu negocio armado" es el antes→después, y el subtítulo agrega la escena concreta: "Esta noche, en 5 minutos, la IA arma tu primera pieza". |
| Detiene el scroll | ✅ | Pregunta en 2.ª persona + H1 bold con 3 palabras en acento + demo asomando en el primer viewport. |
| Unicidad (sofisticación 4-5) | ✅ con matiz | El H1 solo sigue siendo genérico para el mercado ("negocio en N días"). La diferencia la cargan el subtítulo ("primera pieza", "esta noche, 5 minutos") y el CTA "Armar mi primera pieza gratis": el mecanismo está en el primer viewport. |

## ¿El relieve se ve "no plano ni repetitivo"? (pedido de la dueña)
- (a) NO PLANO: ✅ CUMPLE.
  - §2 tiene fichas "noche" con canto, ícono encendido y frases de dolor en Bricolage de 18px con la frase clave en blanco bold. Se lee con impacto y sin apagarse.
  - El resto conserva las fichas oro, verde y piedra, el camino de nodos y el rayo de 64px del cierre.
- (b) NO REPETITIVO: ✅ CUMPLE.
  - Cada sección tiene composición propia: tarjeta-lista, fila de cifras, camino de nodos, comparativa, carrusel, ancla + 2 cajas de precio, sello centrado, acordeón y cierre centrado con ficha.
  - Ya no se repiten acentos entre titulares ni íconos en bloques contiguos.
  - Residuo menor: "cancelas en 1 toque" ×3 (defecto 4).

## Auditoría de escaneabilidad (mobile 375px)
| § | Sección | >4 líneas seguidas | Íconos en dolores/beneficios/pasos | "Solo titulares" | Respiro | Cajas/acordeón | Resultado | Qué corregir |
|---|---|---|---|---|---|---|---|---|
| 1 | Hero | ✅ no (H1 en 4 líneas a 40px, subtítulo en 2) | ✅ gancho con ficha + franja con 3 chips | ✅ | ✅ | — | ✅ | — |
| 2 | Problema | ✅ no (cada dolor en 2-3 líneas) | ✅ ficha por dolor, sin repetir ícono | ✅ | ✅ | ✅ tarjeta-lista | ✅ | Anotar en FICHA-ARTE la excepción del ícono dorado (defecto 1) |
| 3 | Agitación | ✅ no | ✅ 3 cifras con ícono | ✅ | ✅ | ✅ fila en caja | ✅ | — |
| 4 | Solución | ✅ no (Big Idea en 3 líneas) | ✅ nodos con ícono y número | ✅ | ✅ | camino + 2 cajas | ✅ | — |
| 5 | App por dentro | ✅ no | n/a | ✅ | ✅ | carrusel manual con puntos | ✅ | — |
| 6 | Oferta | ✅ no | ✅ checks custom | ✅ | ✅ | ✅ ancla + 2 planes en cajas | ⚠️ | "·" colgando en el ancla (defecto 2) |
| 7 | Garantía | ✅ no (condición en 2 líneas) | ✅ escudo + 3 sellos | ✅ | ✅ | ✅ caja con hairline | ⚠️ | Aclarar desde cuándo cuentan los 15 días (defecto 3) |
| 8 | FAQ | ✅ no | ✅ ficha por objeción | ✅ | ✅ | ✅ acordeón (1.º abierto) | ✅ | — |
| 9 | CTA final + PS | ✅ PS en 4 líneas | ✅ rayo en relieve de 64px | ✅ | ✅ | — | ✅ | — |
| 10 | Footer | ✅ | n/a | ✅ | ✅ | — | ✅ | Email provisional: decisión ya tomada |

## Top defectos (priorizados — NO bloquean el gate)
1. **[FICHA-ARTE.md frente a §2]**
   - Problema: la ficha dice "oro = acción/beneficio · piedra = dolor", y §2 muestra 5 íconos dorados en los dolores por pedido explícito de la dueña. La pantalla y la ficha se contradicen, y el próximo revisor o agente lo marcará como desvío.
   - Fix: agregar en el brand kit de FICHA-ARTE.md "Excepción aprobada por la dueña 2026-10-02: fichas 'noche' de §2 (cara oscura, ícono dorado, sin halo) para los dolores de la landing".
2. **[§6 línea de ancla bajo el título de la oferta]**
   - Problema: la 1.ª línea termina en "Mes a mes: $̶1̶2̶0̶ al año ·" y el separador queda colgando.
   - Fix: quitar el "·" y partir en 2 líneas deliberadas (`block` en "Con el anual: $79.99"), o acortar a "Mes a mes: $̶1̶2̶0̶/año · Anual: $79.99" en una sola línea.
3. **[§7 condición + microcopy de §6]**
   - Problema: con 7 días de prueba gratis, "Si en 15 días no tienes tu oferta lista…" no aclara si los 15 días cuentan desde que empiezas o desde el primer cobro.
   - Fix: "15 días desde tu primer cobro" (o lo que esté configurado en Hotmart), igual en la condición, el microcopy y /reembolsos. Verificarlo antes de publicar (gate 61).
4. **[Franja del hero + microcopy de §6 + plan mensual]**
   - Problema: "cancelas en 1 toque" se repite 3 veces.
   - Fix: quitarlo del microcopy de compra (ya está en el plan y en el hero), o cambiar la franja del hero a "Sin tarjeta para empezar" si eso es cierto en el onboarding.

## Pendientes anotados (no puntúan)
- "Entrar" cuando exista /login.
- Capturas reales del carrusel (Sesión 5).
- Verificar el claim "no se usa para entrenar IA" con el proveedor.
- Email de soporte con el dominio propio.
- Plazo de reembolso de Hotmart en 15 días (Sesión 6).
