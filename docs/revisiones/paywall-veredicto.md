# VEREDICTO revisor-visual — paywall (pantalla de planes)
Fecha: 2026-11-06 12:00
Screenshot: docs/revisiones/paywall-375.png
Usabilidad: 36/40
Craft: 16/20
Copy (si vende): 19/20
Fidelidad (si hubo referencia): N-A
Veredicto: LISTA
Top defectos: (1) [primer cuadro, encima del borde superior izquierdo del botón fijo] el punto dorado "Hoy" de la línea de tiempo se asoma oscurecido bajo el degradado de `.barra-inferior` (globals.css L246, que sigue en `40px`). A 375 se ve una pestaña oscura pegada al botón; antes solo pasaba a 360 y viene abierto desde la rev. 9 → que el fondo sea opaco antes: `linear-gradient(180deg, transparent, var(--surface-base) 16px)` · (2) [tarjeta Mensual] ahora las dos tarjetas usan `pt-6 pb-4` (Paywall.tsx L285-286). La mensual no tiene insignia, así que su contenido queda unos 4 px CSS más abajo del centro óptico: el radio está en el centro 1288 y la tarjeta en 1280 (px de captura) → `py-5` en las dos (la insignia va en `-top-3`, sobre el borde, y no necesita relleno extra) · (3) [primer cuadro, línea bajo el botón] el aviso "Hotmart te pide tu tarjeta" solo aparece en la línea de tiempo, debajo del pliegue. Quien toca el botón desde el primer cuadro (paywall-375) sigue encontrándose la tarjeta en Hotmart sin aviso (FICHA-AVATAR L43-44) → cambiar la línea a "Hoy $0 con tarjeta · luego $79.99 al año · cancela cuando quieras", o poner "Hoy no se cobra nada (Hotmart pide tarjeta)" en una segunda línea · (4) [primer cuadro, jerarquía] hay 7 tamaños de letra: 12 (eyebrow, nodos, $/día, "al mes"), 14 (cita, cobro), 16, 17 (botón), 18 (nombre del plan), 24 (precio) y 28 (titular). La cita en display bold de 14 y el nombre del plan a 18 compiten con el precio → el nombre del plan a `text-base` y la cita en Instrument Sans 600, para que queden 4 niveles · (5) [entrada directa, tarjeta de ruta + cola] falta la firma de FICHA-ARTE L59: el nodo "hoy" (relieve-oro con rayo) no pulsa. La leyenda deja "día." huérfano, y bajo la garantía siguen 3 sellos, 2 enlaces y una fila legal → pulso suave en el nodo hoy (scale 1→1.06, 2 s, en bucle, apagado con reduced-motion) + `whitespace-nowrap` en "cada día" (L248)

Detalle: USABILIDAD h1:4 h2:4 h3:4 h4:3 h5:4 h6:4 h7:3 h8:3 h9:4 h10:3 · CRAFT jerarquía:3 profundidad:4 identidad:3 movimiento:3 encaje:3 · COPY idea:4 especificidad:3 emoción:4 oferta:4 acción:4
Gate doble: 36/40 (≥36) PASA · 16/20 (≥16) PASA · copy 19/20 (≥16, ningún eje ≤2) PASA. Pasa justo otra vez: el encaje y la jerarquía no tienen margen, y cualquier regresión la vuelve a NO LISTA.

## Re-revisión 2026-11-06 (contexto limpio)

Insumos: paywall-375.png · recorrido/15-planes-arriba/final · 16-planes-mensual-arriba/final · 17-planes-vista-previa-arriba/final · paywall-directo-375.png · components/paywall/Paywall.tsx · app/paywall/page.tsx · components/onboarding/piezas.tsx · app/globals.css · lib/legal.ts · app/page.tsx (Oferta) · FICHA-ARTE · FICHA-AVATAR · FICHA-MERCADO.

TOP DEFECTOS de la auditoría del 2026-10-23, uno por uno:
1. Objeciones 5 y 6 → CERRADO. "Tu idea es tuya: no se usa para entrenar IA ni se comparte" y "Pagas por Hotmart: nunca vemos tu tarjeta", con chips Lucide (L394-409).
2. Aviso de tarjeta → CERRADO en la línea de tiempo: "Hotmart te pide tu tarjeta, pero hoy no se cobra nada" (L337). Queda el residuo del defecto 3 de arriba: no está en el primer cuadro.
3. Entrada directa → CERRADO. El titular dice "Desbloquea tus 30 días…" y el botón "Empezar mis 7 días gratis" (L197, L450); el lector de pantalla lee ", hoy" (L231). Lo verifica paywall-directo-375.
4. pt-6/pt-4 → la desigualdad de altura está CERRADA: las dos tarjetas miden 210 px de captura. Pero al copiar el `pt-6` a la mensual apareció el descentrado vertical (defecto 2 de arriba).
5. Rayo dorado → CERRADO a medias. El rayo está en el punto "Hoy" de la línea de tiempo (L359-363) y en el nodo hoy de la entrada directa, pero en el estado principal queda bajo el pliegue. El guepardo sigue sin aparecer en "Pieza 1 lista" (no bloquea: el paywall no es una celebración).
Menores de entonces: `checkout_iniciado` ya se registra después de `if (!base)` (L146-151) → CERRADO · la línea bajo el botón pasó a `text-sm` → CERRADO · el dibujado de la línea de tiempo va a 600 ms por tramo → CERRADO.
Siguen abiertos desde la rev. 9: el punto "Hoy" que asoma (ahora también a 375), más de 3 tamaños, la cola gris y el "día." huérfano.

Gate de carga cognitiva: 0 fallas de 8. La ruta tiene 5 nodos, hay 2 planes, la línea de tiempo tiene 3 pasos y hay 1 acción primaria; ningún bloque pasa de 4 líneas.
CTA héroe vivo: pasa los 4. #1A1206 sobre #FFC23D ≈ 11:1 · whileTap 0.98 + pulso único a los 2 s · disabled solo con `yendo`, y se reinicia con `pageshow` · h-14 (56 px), ancho completo y sticky.
FICHA-ARTE: coinciden #0F0D16, #FFC23D, #3DDC97 y #998FA8, Bricolage (display) e Instrument Sans, la tarjeta de 20 px, el chip y la píldora. El titular de 28 px y el precio de 24 px caben en la escala de la ficha. La insignia dorada sólida está cubierta por la excepción de L42. No es clon de "Umbral" ni de "Capítulo".
Fechas: hoy es 6 nov → "11 de noviembre: te avisamos" (+5) y "13 de noviembre: primer cobro" (+7): VERIFICADAS. El monto cambia con el plan ($79.99 / $9.99, 15-final contra 16-final) y la línea bajo el botón cambia igual.
Coherencia con la página de ventas (app/page.tsx): $6.67/$9.99, "Se cobra $79.99 al año", ahorro de $39.89, 7 días gratis, "La Garantía Sin Preguntas", 15 días desde el primer pago y el botón "Empezar mis 7 días gratis" son IDÉNTICOS. Que la garantía cuente "desde el primer pago" es decisión de la dueña (ESTADO L70/L166), pero FICHA-MERCADO L31 lo marca como NO CONFIRMADO en Hotmart → verificar en la Sesión 6. No cuenta como defecto.
Vista previa honesta (17-arriba/final): dice "el pago todavía no está conectado, así que no se cobró nada", con el plan elegido; sin cobro simulado, con foco, Esc y salida rotulada. BIEN.
Dark patterns: ninguno. La X de 44 px y "Ahora no" son neutros, está "¿Ya pagaste? Entra aquí", el ahorro es exacto y el preseleccionado es el de mejor valor real.
Movimiento (en código): entrada escalonada de 70 ms (la ficha pide 60, diferencia menor) ✓ · los precios cuentan desde 0 ✓ · conteo de 300 ms al cambiar de plan ✓ · la línea de tiempo se dibuja a 600 ms ✓ · whileTap ✓ · layoutId del plan activo ✓ · la hoja entra suave ✓ · reduced-motion respetado ✓. Falta la firma del nodo hoy que pulsa → 3.
Copy: el titular se traza a L52, el subtítulo a L66 ("hoja en blanco", "pieza a pieza", "5 minutos al día"), los sellos a las objeciones 5 y 6 (L59-60), la línea de tiempo a L43-44 y "$0.33 al día" a la objeción 4 (L58). La especificidad se queda en 3: la promesa "29 días hasta salir a vender" no tiene prueba visible (no hay usuarios todavía; FICHA-AVATAR L71 permite el recorrido propio de la fundadora). Garantía nombrada con plazo cerca del botón: PASA. Message-match: NO VERIFICABLE (falta el dato del 34).
Nota de la captura: en paywall-directo-375.png (página completa), el botón fijo sale a mitad de la página tapando "11 de noviembre", y abajo queda un hueco. Es un artefacto del modo página completa con un elemento sticky, no un defecto de la pantalla; para futuras capturas de la entrada directa, usar desplazamiento por cuadros.

---

# HISTORIAL

# VEREDICTO revisor-visual — paywall (pantalla de planes)
Fecha: 2026-10-23 12:00
Screenshot: docs/revisiones/paywall-375.png
Usabilidad: 36/40
Craft: 16/20
Copy (si vende): 18/20
Fidelidad (si hubo referencia): N-A
Veredicto: LISTA
Top defectos: (1) la objeción 6 de FICHA-AVATAR ("¿Me van a robar la idea?", L60) tiene como destino el paywall y no aparece en la pantalla; la objeción 5 (L59, "¿es seguro poner mi tarjeta?") solo se cubre con "Pago seguro por Hotmart", sin "nunca vemos tus datos" → añadir un tercer sello "Tu idea es tuya" (ícono Lucide) en la fila de sellos (Paywall.tsx L381-390) y cambiar el segundo a "Pagas por Hotmart: nunca vemos tu tarjeta" · (2) la línea de tiempo y la línea bajo el botón no dicen que Hotmart pide tarjeta para el periodo gratis (FICHA-MERCADO L27: "solo con tarjeta de crédito"). Quien toca "7 días gratis" se encuentra la tarjeta en Hotmart sin aviso, que es justo la sorpresa que se queja en las reseñas (FICHA-AVATAR L43-44) → en el primer nodo poner "Hoy: empiezas gratis · Hotmart te pide tu tarjeta, hoy no se cobra nada" (50 §C4ter) · (3) entrada directa a /paywall sin la Pieza 1 (auditoria-2026-10-23/paywall-directo.png): el titular sigue diciendo "Desbloquea 29 días" y el botón "Seguir mi ruta" aunque el día 1 no está hecho (está como "hoy"). Los dos textos están fijos (L195 y L431) → con `pieza` falso, usar "Desbloquea tus 30 días hasta salir a vender" y "Empezar mis 7 días gratis". De paso, el nodo "hoy" anuncia "(día 1, bloqueado)" al lector de pantalla (L226) → ", hoy" · (4) tarjetas de plan (L280-281): la anual usa pt-6 y la mensual pt-4. Sigue sin corregirse desde la rev. 9, y en paywall-375 la anual mide ~7 px CSS más (≈105 contra 98) → usar pt-6 en las dos · (5) identidad en el estado principal: el RAYO DORADO (FICHA-ARTE L57) solo aparece en la entrada directa; con la Pieza 1 hecha, la pantalla que vende no lo tiene, y tampoco aparece el guepardo en el logro "Pieza 1 lista" → poner el rayo en el nodo "+26 / A vender" o en el punto "Hoy" de la línea de tiempo

Detalle: USABILIDAD h1:4 h2:4 h3:4 h4:3 h5:4 h6:4 h7:3 h8:3 h9:4 h10:3 · CRAFT jerarquía:3 profundidad:4 identidad:3 movimiento:3 encaje:3 · COPY idea:4 especificidad:3 emoción:4 oferta:3 acción:4
Gate doble: 36/40 (≥36) PASA · 16/20 (≥16) PASA · copy 18/20 (≥16, ningún eje ≤2) PASA. Pasa justo, sin margen: cualquier regresión la vuelve a NO LISTA. Ninguno de los 5 defectos de la rev. 9 se corrigió.

## Revisión de auditoría 2026-10-23 (contexto limpio, pre-venta)

Insumos revisados: paywall-375.png · recorrido/14-planes-arriba/final · 15-planes-mensual-final · 16-planes-vista-previa-arriba · auditoria-2026-10-23/paywall-directo.png · app/paywall/page.tsx · components/paywall/Paywall.tsx · app/globals.css · app/api/cron/diario/route.ts · lib/legal.ts · FICHA-ARTE · FICHA-AVATAR · FICHA-MERCADO · 50 §C/§D.

Gate de carga cognitiva: 0 fallas de 8. La ruta tiene 5 nodos, hay 2 planes, la línea de tiempo tiene 3 pasos y hay 1 acción primaria. Ningún bloque pasa de 4 líneas.

CTA héroe vivo: pasa los 4. on-gold sobre #FFC23D ≈ 11:1 · whileTap 0.98 + pulso único a los 2 s · disabled solo con `yendo` ("Abriendo la página de pago…"), y se reinicia con `pageshow` · h-14 (56 px), ancho completo y sticky. En paywall-375, el precio, el plan y el botón caben en el primer cuadro.

FICHA-ARTE: coinciden #0F0D16, #FFC23D, #3DDC97 y #998FA8, Bricolage (display) + Instrument Sans, tarjeta de 20 px, chip de 12 px y píldora. La insignia dorada sólida está cubierta por la excepción de L42. No es clon de "Umbral" ni de "Capítulo".

Fechas de la línea de tiempo: VERIFICADAS. Hoy es 23 oct, `diasPrueba` es 7 → "30 de octubre: primer cobro", y 7−2 → "28 de octubre: te avisamos". Coinciden con las capturas. El monto cambia con el plan ($79.99 / $9.99, 14-final contra 15-final), y la línea bajo el botón cambia igual ("luego $9.99 al mes"). La promesa del aviso SÍ se cumple en código: el cron diario manda `enviarAvisoDeCobro` cuando faltan ≤48 h, con `aviso_cobro_enviado_at` para que no salga dos veces.

Dark patterns (50 §C5): ninguno. La X de 44 px está visible desde el primer cuadro y "Ahora no" es neutro, sin culpa. "¿Ya pagaste? Entra aquí" sirve de restaurar compra. El total anual se ve a 14 px y el mensual es un precio real que se puede comprar. No hay urgencia falsa y el precio está en esta pantalla. El plan preseleccionado es el de mejor valor real, y su ahorro ($39.89 = 119.88 − 79.99) es exacto. Hay un solo matiz, que no es dark pattern pero va como defecto 2: no se avisa que hace falta tarjeta.

Salida a Hotmart / vista previa honesta: BIEN. Sin variables, `CHECKOUT[plan]` vale undefined y abre una hoja que dice "el pago todavía no está conectado, así que no se cobró nada" con el plan elegido (16-arriba: "Mensual"). No simula ningún cobro. La hoja toma el foco, se cierra con Esc y tocando fuera, y su salida "Seguir a crear mi cuenta (vista previa)" está rotulada. Con variables, la URL lleva `showOnlyTrial=1`, `sck` (recortado a 120) y `src` (id anónimo); si la URL es inválida, sale el error "No pudimos abrir… Escríbenos". Un menor: `checkout_iniciado` se registra ANTES de comprobar si hay checkout (L145), así que las vistas previas ensucian el embudo → registrarlo después de `if (!base)` o marcarlo con `vista_previa: true`. Tampoco hay ayuda tipo "Completa tus datos y elige el periodo gratis" (50 §C4ter); con `showOnlyTrial=1` puede sobrar, y se verifica en el checkout real (Sesión 6).

50 §D (paywall): headline con la meta ("salir a vender") PASA · inversión visible ("Pieza 1 lista · 8 respuestas" + la frase del usuario) PASA · $/mes en tabular-nums + total anual PASA · recomendado preseleccionado con borde de 2 px + insignia PASA · botón en 1ª persona ("Seguir mi ruta") + línea de reversibilidad PASA · salida X + "Ahora no" + restaurar PASA. Gate premium de 6: énfasis en el titular · hairline degradé (garantía) · chips SVG (sellos con Lucide; no hay lista de beneficios) · check propio en el radio · fondo radial · radios del kit → PASA los 6. Menor según §C5 ("precio crítico mínimo 14px"): la línea "Hoy $0 · luego $79.99 al año" bajo el botón va a 13 px (text-caption) → subirla a text-sm.

Movimiento (en código): entrada escalonada de 70 ms ✓ · los montos cuentan desde 0 (y 300 ms al cambiar de plan) ✓ · la línea de tiempo se dibuja con scaleY ✓ · tap ✓ · el plan activo se desliza con layoutId ✓ · la hoja entra suave ✓ · no hay celebración en esta pantalla (no corresponde) · reduced-motion respetado en todo ✓. Se queda en 3 porque el dibujado dura 300 ms por tramo (50 §C4 pide 600 ms) y la firma de la ficha (el nodo "hoy" que pulsa) no está.

Copy: el subtítulo se traza a FICHA-AVATAR L66, el titular a L52, "ahorras" al miedo de L26 y la línea de tiempo a las quejas de cobro sorpresa (L43-44). Baja a 18 por la objeción 6 y la objeción 5 incompleta (defecto 1, eje oferta 4→3). La garantía tiene nombre y plazo antes del botón: PASA. Message-match: NO VERIFICABLE, porque falta el dato del 34.

Siguen abiertos de la rev. 9 (no bloquean): a 360 px asoma el punto "Hoy" en el tramo semitransparente de `.barra-inferior` (globals L246, todavía `40px`) · más de 3 tamaños en el primer cuadro · cola de 4 filas grises bajo la garantía · un "día." huérfano en la leyenda de la ruta de la entrada directa.

Pendientes de publicación (no se cuentan como defecto): "devolución en 1 clic" y que el periodo gratis aplique a una app externa se verifican con una compra de prueba en Hotmart (ESTADO L157, Sesión 6). Si no son literales, el texto pasa a "con 1 solicitud". El correo de soporte es provisional.

## Re-revisión 9 (2026-10-06): 36/40 · 16/20 · 19/20 — LISTA
Defectos de entonces: (1) el punto "Hoy" asoma a 360 px en la barra semitransparente · (2) pt-6/pt-4 desiguales en las tarjetas de plan · (3) más de 3 tamaños tipográficos · (4) cola de 4 filas grises · (5) falta el rayo dorado. Corregidos en la rev. 9 contra la rev. 8: la insignia pegada a "Anual", el corte sobre el botón a 375, los enlaces terciarios desiguales, la garantía plana y el dorado documentado en la ficha.
