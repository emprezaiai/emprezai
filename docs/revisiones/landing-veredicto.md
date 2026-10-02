# VEREDICTO revisor-visual — landing (página de ventas EMPRESAI) · re-revisión tras el nuevo hero, el nuevo §2 y la poda de §3/§7
Fecha: 2026-10-02 13:00
Screenshot: docs/revisiones/landing-375.png
Usabilidad: 36/40
Craft: 17/20
Copy (si vende): 18/20
Copy: 18/20
Fidelidad (si hubo referencia): N-A
Veredicto: LISTA
Top defectos: (1) §2 dorado y halo en los 5 dolores, un desvío de FICHA-ARTE (oro = acción/beneficio, sin glow regado) · (2) §1 la píldora-gancho con borde dorado parece botón y su ficha circular sale del sistema de 12px · (3) el H1 del hero y el H2 de §4 repiten el mismo acento "tu negocio armado"; además "5 minutos por noche" contra "al día" en el resto · (4) el ícono Hourglass se repite en filas contiguas (§2 fila 3 y §3 cifra 40h) · (5) siguen sin corregir: "$79.99" huérfano, garantía ausente del microcopy de compra, "12meses" pegado

## Detalle
USABILIDAD 36/40 — h1:4 h2:4 h3:4 h4:3 h5:4 h6:4 h7:4 h8:3 h9:3 h10:3
CRAFT 17/20 — jerarquía:3 profundidad:4 identidad:3 movimiento:4 encaje:3
COPY 18/20 — idea:4 especificidad:3 emoción:4 oferta:3 acción:4 (ningún eje ≤2)

Gates:
- Gate doble: PASA, pero justo en el límite (36/40 ≥ 36 y 17/20 ≥ 16). Gate de copy: PASA (18/20).
- Gate de carga cognitiva: 1 falla, "cero elementos que parezcan interactivos y no hagan nada" (la píldora-gancho, defecto 2). No es sobrecarga crítica.
- Anti-clon: no coincide con "Capítulo" ni con "Umbral".
- CTA héroe vivo: PASA (≈12:1 · whileTap 0.97 · nunca deshabilitado · 52-56px · ancho completo).
- Sub-checks de copy: message-match N-A. La garantía va nombrada con plazo ("Si en 15 días…") en la sección pegada a los planes: PASA.

FICHA-ARTE frente a la captura (DESVÍO EVIDENTE = defecto top 1):
- La ficha pide dorado SOLO en CTA, misión, nodo "hoy", dato héroe y botón central. Dice "oro = acción/beneficio · piedra = dolor" y "sin glow regado".
- §2 pinta en dorado 5 frases de dolor, 5 íconos y el borde de la tarjeta.
- `.relieve-noche` (globals.css l.100-108) agrega un halo `0 0 18px -4px rgb(255 194 61 / .35)` en 6 fichas (las 5 de §2 + la del gancho).
- Resultado: en las 2 primeras pantallas hay unos 14 elementos dorados que compiten con el CTA, y el dolor se viste con el color del beneficio.

Qué cambió en la puntuación frente a la pasada anterior (37 · 18 · 17):
- h4 baja 4→3 por dos cosas:
  - El dorado ya no significa lo mismo en toda la página.
  - Vuelven una píldora con borde que parece botón y una ficha circular fuera del sistema.
- Identidad baja 4→3: el halo regado es la receta anti-IA que la ficha veta fuera de la tarjeta héroe.
- Emoción sube 3→4: los dolores en voz literal del avatar, entre comillas, más la escena "¿Otra noche en blanco frente a ChatGPT?" trazan 1:1 a FICHA-AVATAR (dolores #1, #2, #4, #5, identidad y momento del día).
- Profundidad se mantiene en 4: el patrón de puntos del hero y el radial dorado se ven en la captura.

Hallazgos en código:
- El H1 tiene 11 palabras y supera el `warnCopy('Hero → h1', …, 10)` (Hero.tsx l.56). La excepción está documentada, pero el aviso queda en la consola de desarrollo: subir el tope a 11 en la llamada o dejarlo anotado.
- Quitar "Reembolso gestionado por Hotmart" no rompe ningún gate: la garantía conserva nombre y plazo, y "Pagas seguro por Hotmart" sigue bajo los planes.

## Juicio del titular (hero)
| Criterio | ¿Cumple? | Evidencia / qué falta |
|---|---|---|
| Dolor urgente | ✅ | El gancho "¿Otra noche en blanco frente a ChatGPT?" es el dolor #1 + el MOMENTO DEL DÍA de la ficha, en pregunta. |
| Deseo | ✅ | "tu negocio armado en 30 días" es el deseo #2 casi literal ("la estructura de mi empresa armada en 30 días"). |
| Imagen mental | ⚠️ | El antes→después "hoja en blanco → negocio armado" se entiende en una línea. Pero "negocio armado" es abstracto: el H1 anterior daba algo que se ve ("tu primera oferta, hoy, en 5 minutos"). La victoria concreta de esta noche ya no está en el hero. |
| Detiene el scroll | ✅ | Gancho en píldora + H1 bold de 4 líneas con 3 palabras en acento + demo asomando. La pregunta en 2.ª persona funciona para tráfico frío de TikTok. |
| Unicidad (sofisticación 4-5) | ⚠️ | "negocio … en 30 días" es casi la variante #3 de la propia tabla 4U (Único = 1) y se parece a la competencia de la ficha ("Lanza tu negocio con IA en 7 días"). La diferencia la carga solo "cada pieza" en el subtítulo. Fix: subtítulo "Esta noche, en 5 minutos, la IA arma tu primera pieza. Sin cursos." (12 palabras). Recupera la victoria inmediata y el mecanismo. |

Veredicto del titular: es mejor GANCHO que el anterior (más dolor y más escena) y peor PROMESA ÚNICA (más genérica, menos inmediata). Con el subtítulo propuesto se queda con las dos ventajas.

## ¿El relieve se ve "no plano ni repetitivo"? (pedido de la dueña)
- (a) NO PLANO: ✅ CUMPLE.
  - §2 ya no se ve apagado: tarjeta con brillo, fichas oscuras con ícono encendido, frases en Bricolage de 18px.
  - El resto conserva las fichas oro, verde y piedra, el camino de nodos y el rayo del cierre.
  - El costo: el "encendido" se logró con el color y el halo del beneficio (defecto 1). El mismo volumen se consigue con relieve-piedra + ícono en text-primary + frase clave en blanco 700.
- (b) NO REPETITIVO: ⚠️ CUMPLE CON RESIDUOS NUEVOS.
  - Las composiciones siguen siendo distintas por sección.
  - El acento "tu negocio armado" se repite literal en el H1 y en el H2 de §4.
  - El Hourglass aparece en dos filas seguidas (§2 y §3).
  - "otro curso / sin cursos" aparece 3 veces en 3 pantallas (subtítulo, remate de §3, H2 de §4).

## Auditoría de escaneabilidad (mobile 375px)
| § | Sección | >4 líneas seguidas | Íconos en dolores/beneficios/pasos | "Solo titulares" | Respiro | Cajas/acordeón | Resultado | Qué corregir |
|---|---|---|---|---|---|---|---|---|
| 1 | Hero | ✅ no (H1 en 4 líneas a 40px, subtítulo en 2) | ✅ gancho con ficha + franja con 3 chips | ✅ | ✅ | — | ⚠️ | Píldora-gancho sin borde, o enlazada a #problema; ficha luna con radio de 12px (defecto 2) |
| 2 | Problema | ✅ no (cada dolor en 2-3 líneas) | ✅ ficha por dolor | ✅ | ✅ | ✅ tarjeta-lista | ❌ | Dorado y halo en los dolores, desvío de la ficha (defecto 1); Hourglass repetido con §3 (defecto 4) |
| 3 | Agitación | ✅ no | ✅ 3 cifras con ícono | ✅ (la frase puente presenta las cifras) | ✅ | ✅ fila en caja | ⚠️ | "12meses" pegado: `ml-1` en el sufijo |
| 4 | Solución | ✅ no | ✅ nodos con ícono y número | ✅ | ✅ | camino + 2 cajas | ⚠️ | El H2 repite el acento del H1 (defecto 3) |
| 5 | App por dentro | ✅ no | n/a | ✅ | ✅ | carrusel manual con puntos | ✅ | — |
| 6 | Oferta | ✅ no | ✅ checks custom | ✅ | ✅ | ✅ ancla + 2 planes en cajas | ⚠️ | "$79.99" huérfano en el ancla; sumar la garantía al microcopy de compra |
| 7 | Garantía | ✅ no (condición en 2 líneas) | ✅ escudo + 3 sellos | ✅ | ✅ | ✅ caja con hairline | ✅ | — |
| 8 | FAQ | ✅ no | ✅ ficha por objeción | ✅ | ✅ | ✅ acordeón (1.º abierto) | ✅ | — |
| 9 | CTA final + PS | ✅ PS en 4 líneas | ✅ rayo en relieve de 64px | ✅ | ✅ | — | ✅ | — |
| 10 | Footer | ✅ | n/a | ✅ | ✅ | — | ✅ | Email provisional: decisión ya tomada |

## Top defectos (priorizados)
1. **[§2 Problema: frases, fichas y tarjeta]** Desvío evidente de FICHA-ARTE.
   - Problema: 5 frases de dolor en `[acento]` dorado, íconos dorados con halo (`.relieve-noche`) y borde dorado en `.tarjeta-dolor`. El dolor se viste del color del beneficio, el CTA pierde protagonismo y vuelve el glow que la ficha veta.
   - Fix: en page.tsx l.100-104, cambiar `[acento]` por `[b]` en blanco 700. Fichas en `relieve-piedra` sin halo, con ícono en text-primary. Borde de la tarjeta en blanco al 7%. El dorado queda solo en el título "alguna de estas noches".
2. **[§1 píldora-gancho sobre el H1]** Parece interactiva y no hace nada (gate cognitivo).
   - Problema: es una píldora con borde dorado al 30%, el formato típico de "badge anuncio" tocable. Su ficha luna es `rounded-full`, fuera del sistema de 12px que se acaba de unificar.
   - Fix: quitar el borde y dejar solo el fondo al 8% con la ficha de 12px, o volverla un enlace real a `#problema`, con whileTap.
3. **[H1 del hero + H2 de §4 + subtítulo]** Repetición y promesa inconsistente.
   - Problema: el acento "tu negocio armado" aparece literal en los dos titulares. "5 minutos por noche" choca con "5 minutos al día" del plan y de los pasos.
   - Fix: §4 H2 → "No te falta información: te falta [el paso de hoy]" (la Big Idea sube a título; el párrafo empieza en "Cada día la IA arma…"). Subtítulo del hero → "Esta noche, en 5 minutos, la IA arma tu primera pieza. Sin cursos." Unificar "al día" en el resto.
4. **[§2 fila 3 + §3 cifra 40h]**
   - Problema: el mismo ícono Hourglass aparece en dos bloques contiguos.
   - Fix: en §2 usar `MonitorPlay` o `Clock4` ("tutoriales").
5. **[Arrastrados de la pasada anterior, siguen visibles]**
   - §6: "$79.99" solo en la 2.ª línea del ancla → `whitespace-nowrap` en "Con el anual: $79.99".
   - §6: el microcopy de compra no nombra la garantía → sumar "· Garantía de la Primera Oferta, 15 días".
   - §3: "12meses" pegado → `ml-1`.

## Pendientes anotados (no puntúan)
- "Entrar" cuando exista /login.
- Capturas reales del carrusel (Sesión 5).
- Verificar el claim "no se usa para entrenar IA" con el proveedor.
- Email de soporte con el dominio propio.
