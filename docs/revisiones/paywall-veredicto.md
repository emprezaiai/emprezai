# VEREDICTO revisor-visual — paywall (pantalla de planes)
Fecha: 2026-10-23 12:00
Screenshot: docs/revisiones/paywall-375.png
Usabilidad: 36/40
Craft: 16/20
Copy (si vende): 18/20
Fidelidad (si hubo referencia): N-A
Veredicto: LISTA
Top defectos: (1) objeción 6 de FICHA-AVATAR ("¿Me van a robar la idea?", L60) tiene como destino el paywall y no aparece en la pantalla; la objeción 5 (L59, "¿es seguro poner mi tarjeta?") solo se cubre con "Pago seguro por Hotmart", sin "nunca vemos tus datos" → añadir un tercer sello "Tu idea es tuya" (ícono Lucide) en la fila de sellos (Paywall.tsx L381-390) y cambiar el segundo a "Pagas por Hotmart: nunca vemos tu tarjeta" · (2) la línea de tiempo y la línea bajo el botón no dicen que Hotmart pide tarjeta para el periodo gratis (FICHA-MERCADO L27: "solo con tarjeta de crédito"). Quien toca "7 días gratis" se encuentra la tarjeta en Hotmart sin aviso, que es justo la sorpresa que se queja en las reseñas (FICHA-AVATAR L43-44) → en el primer nodo poner "Hoy: empiezas gratis · Hotmart te pide tu tarjeta, hoy no se cobra nada" (50 §C4ter) · (3) entrada directa a /paywall sin la Pieza 1 (auditoria-2026-10-23/paywall-directo.png): el titular sigue diciendo "Desbloquea 29 días" y el botón "Seguir mi ruta" aunque el día 1 no está hecho (está como "hoy"). Los dos textos están fijos (L195 y L431) → con `pieza` falso, usar "Desbloquea tus 30 días hasta salir a vender" y "Empezar mis 7 días gratis". De paso, el nodo "hoy" anuncia "(día 1, bloqueado)" al lector de pantalla (L226) → ", hoy" · (4) tarjetas de plan (L280-281): la anual usa pt-6 y la mensual pt-4. Sigue sin corregirse desde la rev. 9, y en paywall-375 la anual mide ~7 px CSS más (≈105 contra 98) → usar pt-6 en las dos · (5) identidad en el estado principal: el RAYO DORADO (FICHA-ARTE L57) solo aparece en la entrada directa; con la Pieza 1 hecha, la pantalla que vende no lo tiene, y tampoco aparece el guepardo en el logro "Pieza 1 lista" → poner el rayo en el nodo "+26 / A vender" o en el punto "Hoy" de la línea de tiempo

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
