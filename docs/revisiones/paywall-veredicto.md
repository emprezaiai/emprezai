# VEREDICTO revisor-visual — paywall (pantalla de planes)
Fecha: 2026-11-24 12:00
Screenshot: docs/revisiones/paywall-375.png
Usabilidad: 36/40
Craft: 16/20
Copy (si vende): 19/20
Fidelidad (si hubo referencia): N-A
Veredicto: LISTA
Top defectos: (1) [línea de tiempo, nodo 2 "29 de noviembre: te avisamos", Paywall.tsx L336] "Te escribimos antes de cualquier cobro" promete un aviso en TODO cobro, pero el código solo avisa antes del primer cobro de la prueba y de la renovación anual (cron/diario L87-107); con plan mensual las renovaciones no se avisan → cambiar a "Te escribimos antes de tu primer cobro" (o avisar también en mensual) · (2) [barra fija, línea bajo el botón, L469] la línea nueva parte la frase "se renueva / solo" entre renglones, y el paréntesis repite lo que ya dice la línea de tiempo → partir antes de "se renueva" (envolver "se renueva solo (te avisamos antes)" en whitespace-nowrap o dejar text-pretty) · (3) [pie, L409-433] siguen tres filas de enlaces grises apiladas ("Ahora no" / "¿Ya pagaste? Entra aquí" / "Reembolsos · Cómo cancelar"), unos 140 px de gris del mismo peso → juntar "Ahora no" y "¿Ya pagaste?" en una sola fila · (4) [insignia "Mejor valor · ahorras $39.89" sobre "Anual", L302] la insignia sigue montada sobre el borde y casi pegada al título "Anual" → 4 px más de padding-top en la tarjeta anual · (5) [nodo "Frase" de la ruta y jerarquía de letra] el nodo hoy no pulsa (motion signature de la ficha) y siguen ~7 tamaños de letra contra 3-4 → pulso 2.4 s con reduced-motion y unificar caption/ayuda/sm en 2 tamaños.

Detalle: USABILIDAD h1:4 h2:4 h3:4 h4:3 h5:4 h6:4 h7:3 h8:3 h9:4 h10:3 · CRAFT jerarquía:3 profundidad:4 identidad:3 movimiento:3 encaje:3 · COPY idea:4 especificidad:3 emoción:4 oferta:4 acción:4

## Verificación del cambio pedido
- Línea bajo el botón con plan anual: "Hoy $0 con tarjeta · luego $79.99 al año, se renueva solo (te avisamos antes) · cancelas cuando quieras". Se ve en las dos capturas, 2 renglones + legal 1; la barra fija no creció (sigue en ~130 px CSS). Con plan mensual el paréntesis no aparece (L469, condicional a 'al año').
- La promesa "(te avisamos antes)" está respaldada en código: enviarAvisoRenovacionAnual en el cron diario, una vez por renovación, entre 15 y 30 días antes (migración aviso_renovacion_para). Claim verificado.
- Sin regresión en h8 ni en craft: no se sumó ningún renglón ni elemento nuevo. Residuo: corte de frase "se renueva / solo" (defecto 2).

## Gates
- Carga cognitiva: 1 falla de 8 (pie con tres filas de enlaces). Por debajo del umbral de 4.
- CTA héroe vivo: pasa los 4 (contraste ~11:1 oscuro sobre dorado, whileTap 0.98, disabled solo mientras `yendo`, 56 px de alto y ancho completo).
- FICHA-ARTE: fondo #0F0D16, dorado #FFC23D, verde #3DDC97, Bricolage Grotesque + Instrument Sans, radios del kit: coinciden con lo visible. No es clon de "Umbral" ni "Capítulo".
- Conversión: titular bold con "salir a vender" en acento, hairline degradé en la garantía, chips SVG sin emojis, secciones distinguibles. PASA.
- Copy trazado a FICHA-AVATAR (objeciones tarjeta/idea/IA, miedo al cobro sorpresa); garantía con nombre y plazo (15 días) a la vista. Message-match: NO VERIFICABLE (falta dato del 34). Especificidad se mantiene en 3 por la promesa sobredimensionada "antes de cualquier cobro" (defecto 1).
- Heurísticas 3 y 7 verificadas en código: X, "Ahora no", "Cómo cancelar", pageshow que reinicia el botón (h3 = 4); anual por defecto, `?plan=`, flechas en el radiogroup (h7 = 3). Movimiento: stagger, conteo de montos, línea de tiempo que se dibuja, whileTap, layoutId, hoja suave, reduced-motion OK; falta pulso del nodo hoy.

## Gate doble
Usabilidad 36/40 PASA (justo en el umbral); craft 16/20 PASA (justo en el umbral); copy 19/20 sin eje ≤2 PASA. LISTA sin margen.

# HISTORIAL
- 2026-11-24 (re-revisión tras aviso de renovación anual en la línea bajo el botón): 36/40 · 16/20 · 19/20 — LISTA. Cambio verificado y respaldado en código. Nuevo: "antes de cualquier cobro" no se cumple en mensual; corte "se renueva / solo". Abiertos: pie con 3 filas, insignia apretada, pulso del nodo hoy, tamaños de letra.
- 2026-11-22 (re-revisión tras cambios de barra fija y legal): 36/40 · 16/20 · 19/20 — LISTA.
- 2026-11-22 (pasada previa): 35/40 · 16/20 · 19/20 — NO LISTA (h8 bajó a 2 por barra fija pesada y legal duplicado).
- 2026-11-06 (2ª pasada, commit 19e6c5b): 36/40 · 16/20 · 19/20 — LISTA.
- 2026-11-06 (1ª pasada): 36/40 · 16/20 · 19/20 — LISTA.
- 2026-10-23: 36/40 · 16/20 · 18/20 — LISTA.
- 2026-10-06 (rev. 9): 36/40 · 16/20 · 19/20 — LISTA.
