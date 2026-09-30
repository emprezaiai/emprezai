# VEREDICTO revisor-visual — landing (página de ventas EMPRESAI) · 5ª pasada
Fecha: 2026-09-30 20:00
Screenshot: docs/revisiones/landing-375.png
Usabilidad: 37/40
Craft: 18/20
Copy (si vende): 18/20
Copy: 18/20
Fidelidad (si hubo referencia): N-A
Veredicto: LISTA
Top defectos: (1) el radial dorado del hero sigue sin pintarse: el div -z-10 queda debajo del fondo del contenedor de la página (bug de stacking verificado en código) · (2) el estado "Reintentar" no dice qué pasó ni se anuncia · (3) claim "no se usa para entrenar IA" sin verificar (gate 61) · (4) ?plan= todavía no tiene quién lo consuma (verificarlo al construir el paywall) · (5) la prueba sigue siendo solo el demo y las vistas previas (reemplazar por capturas reales en la Sesión 5)

## Detalle
USABILIDAD 37/40 — h1:4 h2:4 h3:4 h4:4 h5:4 h6:3 h7:4 h8:3 h9:3 h10:4
CRAFT 18/20 — jerarquía:4 profundidad:3 identidad:3 movimiento:4 encaje:4
COPY 18/20 — idea:3 especificidad:3 emoción:4 oferta:4 acción:4 (ningún eje ≤2)
Gate doble: PASA (37/40 ≥ 36 y 18/20 ≥ 16). Gate de copy: PASA (18/20, ningún eje ≤2).
Gate de carga cognitiva: 0 fallas. Anti-clon: no coincide con "Capítulo" ni con "Umbral".
CTA héroe vivo: contraste dorado sobre #0F0D16/#231D2E muy por encima de 3:1 · whileTap 0.97 + estado de carga · nunca disabled · 52-56px de ancho completo (sticky 48px): PASA.
Sub-checks: message-match N-A · garantía nombrada con plazo cerca del CTA de compra: PASA.
Resuelto desde la 4ª pasada:
- EnlaceCta único para todos los CTA (hero, mid, final, anual, mensual y sticky), con prefetch, bloqueo de doble toque y aria-busy.
- Recuperación del estado de carga por pageshow/visibilitychange + timeout de 8s.
- text-pretty en features y stack: sin viudas en el render.
- Dolor #4 incorporado en §2.
- Mezcla del radial subida a 20%, aunque no se ve: ver defecto 1.

## Top defectos (corregir; no bloquean el gate)
1. [Hero — fondo, Hero.tsx ~l.66-75] El div del radial usa `absolute inset-0 -z-10`, pero la `<section>` no crea stacking context. Por eso el z negativo sube al contexto raíz y se pinta DEBAJO del `bg-[var(--bg)]` del contenedor de page.tsx: el radial dorado 20% y el verde 8% de la ficha no se ven en ningún screenshot (confirmado en las 5 pasadas). Es un desvío de la ficha: "fondo con profundidad". → Agregar `isolate` (o `z-0`) a la `<section>` del Hero y recapturar para confirmar el brillo arriba a la derecha.
2. [EnlaceCta — estado 'lento'] Tras 8s el botón solo dice "Reintentar": no explica qué pasó y no se anuncia a lectores de pantalla (h9). → Etiqueta "Tarda más de lo normal · Reintentar" y un `<span role="status" className="sr-only">` con el mismo texto.
3. [§8 FAQ 5] "Tu idea… no se usa para entrenar IA" es un claim de privacidad verificable. → Confirmar la política de retención/entrenamiento del proveedor de IA elegido y anotar la fuente en ESTADO.md antes de publicar (gate 61).
4. [§6 Planes → onboarding] `?plan=anual|mensual` hoy no tiene quién lo consuma (h6 queda en 3 por eso). → Al construir onboarding/paywall, leer el parámetro, persistirlo y preseleccionar ese plan; verificarlo en la revisión del paywall.
5. [Hero demo + §5 Carrusel — prueba] Toda la prueba visual es un ejemplo rotulado y vistas previas del diseño (esperado en el día 1, sin testimonios). → En la Sesión 5, reemplazar por capturas reales de la app con datos semilla, y sumar el recorrido documentado del fundador como primera prueba social.
