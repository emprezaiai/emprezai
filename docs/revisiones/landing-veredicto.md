# VEREDICTO revisor-visual — landing (página de ventas EMPRESAI) · 6ª pasada (confirmación)
Fecha: 2026-09-30 21:00
Screenshot: docs/revisiones/landing-375.png
Usabilidad: 37/40
Craft: 19/20
Copy (si vende): 18/20
Copy: 18/20
Fidelidad (si hubo referencia): N-A
Veredicto: LISTA
Top defectos: (1) el <span role="status"> vive dentro del <Link> y ensucia el nombre accesible del CTA · (2) claim "no se usa para entrenar IA" sin verificar (gate 61) · (3) ?plan= todavía no tiene quién lo consuma (verificarlo en el paywall) · (4) la prueba sigue siendo solo el demo y las vistas previas (capturas reales en la Sesión 5)

## Detalle
USABILIDAD 37/40 — h1:4 h2:4 h3:4 h4:4 h5:4 h6:3 h7:4 h8:3 h9:3 h10:4
CRAFT 19/20 — jerarquía:4 profundidad:4 identidad:3 movimiento:4 encaje:4
COPY 18/20 — idea:3 especificidad:3 emoción:4 oferta:4 acción:4 (ningún eje ≤2)
Gate doble: PASA (37/40 ≥ 36 y 19/20 ≥ 16). Gate de copy: PASA.
Gate de carga cognitiva: 0 fallas. Anti-clon: no coincide con "Capítulo" ni con "Umbral". CTA héroe vivo: PASA.
Sub-checks: message-match N-A · garantía nombrada con plazo cerca del CTA de compra: PASA.

Confirmado en esta pasada:
- Hero.tsx l.65: `relative isolate overflow-hidden`. En landing-375-parte-0.png ya se ve el brillo dorado arriba a la derecha que pide la ficha → profundidad sube de 3 a 4.
- ui.tsx l.155/202-204: el estado lento dice "Tarda más de lo normal · Reintentar" y se anuncia por role="status". h9 sigue en 3 por el defecto 1.

## Top defectos (no bloquean el gate)
1. [ui.tsx EnlaceCta l.202-204] El `<span role="status" className="sr-only">` está DENTRO del `<Link>`: su texto ("Abriendo…" / "La página tarda más de lo normal…") se suma al nombre accesible del botón, y el lector lee el CTA con ese texto pegado. Además, una región viva anidada en un elemento interactivo se anuncia de forma inconsistente según el lector. → Envolver el Link en un fragmento o span y poner el `role="status"` como hermano del Link, fuera de él.
2. [§8 FAQ 5] El claim "no se usa para entrenar IA" hay que confirmarlo con la política del proveedor de IA y anotar la fuente en ESTADO.md antes de publicar (gate 61).
3. [§6 Planes → onboarding] `?plan=anual|mensual`: al construir el paywall, leerlo, guardarlo y dejar ese plan preseleccionado (h6 queda en 3 hasta verificarlo).
4. [Demo del hero + §5 Carrusel] En la Sesión 5, cambiar las vistas previas por capturas reales con datos semilla y sumar el recorrido del fundador como primera prueba social.
