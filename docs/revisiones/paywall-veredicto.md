# VEREDICTO revisor-visual — paywall (pantalla de planes)
Fecha: 2026-10-06 12:00
Screenshot: docs/revisiones/paywall-375.png
Usabilidad: 31/40
Craft: 15/20
Copy (si vende): 14/20
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos: (1) la pantalla de planes nunca muestra la idea ni la frase de la Pieza 1 del usuario (headline genérico, falla el criterio D "menciona la META") · (2) el ancla de precio es débil: "AHORRAS 33%" en vez de "4 meses gratis", sin precio por día y sin responder la objeción "¿tengo que pagar ChatGPT Plus?" · (3) el fondo se lee plano porque los radiales están en 10%/7% y la ficha pide 16%/8% · (4) al cambiar de plan el precio no hace el conteo de 300ms (C3) y la vibración es suave, no media · (5) falta "Restaurar compra" (falla binaria del D, pendiente conocido) y las promesas de "1 clic / 1 toque" dependen de Hotmart y todavía no se verificaron

Detalle: USABILIDAD h1:3 h2:3 h3:3 h4:3 h5:3 h6:4 h7:3 h8:3 h9:3 h10:3 · CRAFT jerarquía:3 profundidad:3 identidad:3 movimiento:3 encaje:3 · COPY idea:3 especificidad:3 emoción:2 oferta:3 acción:3
Gate doble: 31/40 (<36) y 15/20 (<16). Copy 14/20 (<16) con el eje emoción en 2. Resultado: CORREGIR.
Gate de carga cognitiva: 1 falla de 8 (los nodos bloqueados de la ruta tienen el relieve de botón del kit, parecen tocables y no hacen nada). No es sobrecarga.
Fidelidad: la referencia del usuario (FICHA-ARTE) cubre solo la composición de la pantalla principal; esta pantalla queda fuera de ese alcance.

## Hallazgos por severidad

### ALTA (bloquean el veredicto)
1. components/paywall/Paywall.tsx L131-135 y L139-185: el estado tiene `primeraPieza.idea` y `primeraPieza.frase` (lib/onboarding.ts L39-46), pero la pantalla de planes no usa ninguno. El headline "Desbloquea los 29 días que faltan" y el subhead "tu empresa completa" se pueden intercambiar con cualquier usuario. Falla 50 §D ("menciona la META del usuario") y §C0 (resumen con sus datos literales), y por eso el eje emoción de copy queda en 2. FIX: debajo del nodo "Día 1 ✓", agregar una línea con su frase entre comillas; en el subhead, nombrar su idea ("…la IA arma «{idea}» pieza a pieza").
2. Paywall.tsx L18-21 y L211-219, ancla de precio: el badge dice "AHORRAS 33%" y el ahorro real equivale a 4 meses gratis ($79.99 contra $119.88), que según 50 §C2(4) convierte mejor. Tampoco aparece el precio por día (objeción 4 de la FICHA-AVATAR: "menos de $0.33 al día") ni la objeción 5 ("la IA ya viene incluida, no necesitas ChatGPT Plus"). FIX: cambiar el badge a "4 MESES GRATIS" y agregar a la línea de confianza "La IA ya viene incluida".
3. app/globals.css L171-176 `.fondo-recorrido`: los radiales están en dorado 0.10 y verde 0.07, y la FICHA-ARTE (línea 43) pide 16% y 8%. En el screenshot el fondo se lee como un relleno plano (eje profundidad). FIX: subir a 0.16 y 0.08. Ojo: la misma clase la usa el onboarding.

### MEDIA
4. Paywall.tsx L83-87, L249 y L337, motion del cambio de plan: el borde se desliza (bien), pero el monto del pie y de la línea de tiempo cambia de golpe, sin el conteo de 300ms en tabular-nums que pide 50 §C3. Ningún número héroe tiene conteo. Además, `vibrar(20)` es un toque suave y C2(5) pide vibración media. FIX: animar `p.monto` con conteo de 300ms (sin conteo si reduced-motion) y subir a `vibrar(35)`.
5. Paywall.tsx L307-314, salida: falta "Restaurar compra" (falla binaria de 50 §D). La omisión es deliberada y razonable porque la pantalla de entrar todavía no existe, pero sigue siendo un bloqueo de cierre. Quien ya pagó y cae aquí no tiene por dónde entrar. FIX: agregar "Ya pagué · Entrar" junto a "Ahora no" en cuanto exista /login.
6. Paywall.tsx L250, L297 y L337, promesas sin verificar: "Cancela antes en 1 toque", "pides la devolución en 1 clic" y "La Garantía Sin Preguntas". La cancelación y el reembolso pasan por Hotmart, que pide un motivo y tiene varios pasos. Si el flujo real no es de 1 toque o 1 clic, es una afirmación que no se cumple (61/C5). El aviso por correo 2 días antes figura como pendiente en ESTADO.md L141. FIX: verificar el flujo real de Hotmart en la Sesión 6 y ajustar el texto a los pasos reales antes de vender.
7. Paywall.tsx L168-171, nodo "+26": tiene borde punteado y fondo hundido, y a 375px se ve como un sello dentado más oscuro que sus hermanos en relieve. Es una variante accidental (eje encaje / h4). FIX: usar `relieve-piedra` con "+26", igual que los otros nodos.

### BAJA
8. Paywall.tsx L147-158: los nodos bloqueados usan el relieve de botón del kit (sombra inferior sólida) y no hacen nada al tocarlos (regla UX 11). FIX: aplanarlos (sin `0 2px 0`) o abrir al tocar un tooltip "Se desbloquea el Día N".
9. Paywall.tsx L297 contra L250/L337: dice "clic" en un lugar y "toque" en otro. FIX: usar "toque" en todos.
10. Paywall.tsx L181-182: el mecanismo se describe ("la IA arma cada pieza usando las anteriores") pero no se nombra (en la FICHA-AVATAR es "Método Pieza a Pieza"). Eso baja el eje idea. FIX: "…con el Método Pieza a Pieza: la IA arma cada pieza usando las anteriores."
11. Paywall.tsx L188-238: el radiogroup no responde a las flechas del teclado (patrón ARIA de radio) (h7). FIX: agregar onKeyDown con ←/→/↑/↓ para cambiar de plan.
12. Paywall.tsx L326, CTA: "Empezar mis 7 días gratis" está en 1ª persona, pero el beneficio es la prueba y no la identidad aspiracional (C2 ⭐). Es una variante a testear, no un bloqueo.

## CTA héroe vivo
[x] Contraste: #1A1206 sobre #FFC23D ≈ 11:1 · [x] :active propio + whileTap 0.98 · [x] habilitado por defecto, disabled solo mientras abre Hotmart · [x] 56px de alto, ancho completo, fijo abajo. Pasa los 4.

## Sub-checks de copy
Garantía nombrada con plazo cerca del CTA: PASA ("La Garantía Sin Preguntas · 15 días desde tu primer pago"). Message-match con el anuncio: NO VERIFICABLE (no hay dato del 34).
