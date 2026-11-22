# VEREDICTO revisor-visual — paywall (pantalla de planes)
Fecha: 2026-11-22 15:00
Screenshot: docs/revisiones/paywall-375.png
Usabilidad: 36/40
Craft: 16/20
Copy (si vende): 19/20
Fidelidad (si hubo referencia): N-A
Veredicto: LISTA
Top defectos: (1) [pie, tres filas de enlaces grises apiladas "Ahora no" / "¿Ya pagaste? Entra aquí" / "Reembolsos · Cancelar", Paywall.tsx L409-433] suman unos 140 px de texto gris casi igual de peso, y "Cancelar" suelto se lee ambiguo (cancelar el flujo o la suscripción) → juntar "Ahora no" y "¿Ya pagaste?" en una fila y renombrar a "Cómo cancelar" · (2) [barra fija, primer viewport] bajo el botón quedan 3 renglones (precio en 2 + legal en 1), unos 130 px fijos (~16% de 812) y el texto "Hotmart te pide tu tarjeta..." queda cortado por el degradé de la barra al primer cuadro → subir un poco el espacio del primer cuadro o acortar la línea de precio · (3) [jerarquía de letra] siguen 7 tamaños (12, 13, 14, 16, 17-18, 24, 28) contra el máximo de 3-4 de la ficha → unificar caption/ayuda/sm en 2 tamaños · (4) [nodo "Frase" en la ruta] el nodo "hoy" no pulsa (FICHA-ARTE, motion signature) → pulso suave 2.4 s con reduced-motion · (5) [insignia "Mejor valor" sobre "Anual"] la insignia sigue casi tocando el borde superior de la tarjeta y el título → 4 px más de separación.

Detalle: USABILIDAD h1:4 h2:4 h3:4 h4:3 h5:4 h6:4 h7:3 h8:3 h9:4 h10:3 · CRAFT jerarquía:3 profundidad:4 identidad:3 movimiento:3 encaje:3 · COPY idea:4 especificidad:3 emoción:4 oferta:4 acción:4

## Verificación de los 4 cambios pedidos
- (1) Barra fija: pasó de botón + precio(2) + legal(2) a botón + precio(2) + legal(1). Mide ~130 px CSS en 375x812, cerca del 16%; ya no devora el viewport. Cerrado, con residuo menor (defecto 2).
- (2) Términos/Privacidad duplicados: aparecen una sola vez (línea bajo el botón); el pie queda en "Reembolsos · Cancelar". Cerrado.
- (3) Viuda: "Hoy $0 con tarjeta · luego $79.99 al año, / se renueva solo · cancelas cuando quieras" con text-balance; dos renglones parejos, sin palabra suelta. Cerrado.
- (4) Legal a 13px y jerga: la línea se ve en 13px (L473 usa text-caption; contraste ~6:1 sobre #0F0D16, pasa AA). "se renueva solo" es lenguaje corriente. Cerrado.

## Gates
- Carga cognitiva: 1 falla de 8 (pie con tres filas de enlaces). Por debajo del umbral de 4.
- CTA héroe vivo: pasa los 4 (contraste ~11:1, whileTap 0.98, disabled solo mientras `yendo`, 56 px de alto y ancho completo).
- FICHA-ARTE: fondo, dorado #FFC23D, verde, Bricolage Grotesque + Instrument Sans y radios coinciden; no es clon de "Umbral" ni "Capítulo".
- Conversión: titular en bold con "salir a vender" en acento, hairline degradé en la garantía, chips SVG sin emojis, secciones distinguibles. PASA.
- Copy trazado a FICHA-AVATAR (objeciones tarjeta/idea/IA, cobro sorpresa); garantía con nombre y plazo (15 días) a la vista. Message-match: NO VERIFICABLE (falta dato del 34).
- Heurísticas 3 y 7 verificadas en código: X, "Ahora no", "Cancelar", pageshow que reinicia el botón (h3 = 4); plan anual por defecto, `?plan=` y flechas de teclado en el radiogroup (h7 = 3). Movimiento: stagger, conteo de montos, línea de tiempo que se dibuja, whileTap, layoutId, hoja suave, reduced-motion OK; falta el pulso del nodo hoy.

## Gate doble
Usabilidad 36/40 (justo en el umbral) PASA; craft 16/20 (justo en el umbral) PASA; copy 19/20 sin eje ≤2 PASA. LISTA sin margen: cualquier regresión en h8 o en craft la devuelve a NO LISTA.

# HISTORIAL
- 2026-11-22 (re-revisión tras cambios de barra fija y legal): 36/40 · 16/20 · 19/20 — LISTA. Cerrados: barra con demasiadas líneas, legal duplicado, viuda, legal 12px. Abiertos: pie con 3 filas de enlaces, 7 tamaños de letra, pulso del nodo hoy, insignia apretada.
- 2026-11-22 (pasada previa): 35/40 · 16/20 · 19/20 — NO LISTA (h8 bajó a 2 por barra fija pesada y legal duplicado).
- 2026-11-06 (2ª pasada, commit 19e6c5b): 36/40 · 16/20 · 19/20 — LISTA.
- 2026-11-06 (1ª pasada): 36/40 · 16/20 · 19/20 — LISTA.
- 2026-10-23: 36/40 · 16/20 · 18/20 — LISTA.
- 2026-10-06 (rev. 9): 36/40 · 16/20 · 19/20 — LISTA.
