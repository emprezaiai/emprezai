# VEREDICTO revisor-visual — paywall (pantalla de planes)
Fecha: 2026-10-06 16:00
Screenshot: docs/revisiones/paywall-375.png
Usabilidad: 32/40
Craft: 15/20
Copy (si vende): 16/20
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos: (1) primer pliegue saturado: el subhead tiene 12 palabras en negrita blanca que compiten con el titular y la tarjeta de la ruta ocupa unos 330px; el plan elegido queda cortado por el degradé del botón y, con Mensual elegido, no se ve en el primer pliegue · (2) el titular sigue sin la META ni el deseo del usuario (falla binaria de 50 §D; la meta solo aparece en el subhead) · (3) dos promesas sin verificar todavía: "devolución en 1 clic" y "11 de octubre: te avisamos" (el correo está pendiente) · (4) a 360px la fila de salida se parte ("Ahora / no", "Recupera tu / acceso") y el enlace de recuperar acceso va a un correo provisional de Hotmail · (5) la frase del usuario se corta a media palabra ("conseguir cliente…") y su redacción de plantilla ("Con manejo de redes sociales…") suena robótica

Detalle: USABILIDAD h1:3 h2:3 h3:3 h4:3 h5:4 h6:4 h7:3 h8:3 h9:3 h10:3 · CRAFT jerarquía:3 profundidad:3 identidad:3 movimiento:3 encaje:3 · COPY idea:3 especificidad:3 emoción:3 oferta:4 acción:3
Gate doble: 32/40 (<36) y 15/20 (<16). Copy 16/20 (pasa, ningún eje ≤2). Resultado: CORREGIR.
Gate de carga cognitiva: 0 fallas de 8. Los nodos bloqueados ya son planos y hundidos, así que no parecen tocables.
CTA héroe vivo: pasa los 4. Contraste del texto oscuro sobre #FFC23D ≈ 11:1 · whileTap 0.98 · habilitado por defecto y disabled solo mientras abre Hotmart · 56px de alto y ancho completo, fijo abajo.
Sub-checks de copy: la garantía aparece con nombre y plazo junto al CTA (PASA). El message-match con el anuncio NO ES VERIFICABLE porque no hay dato del 34.
Fidelidad: la referencia de FICHA-ARTE cubre solo la composición de la pantalla principal; esta pantalla queda fuera de ese alcance.

## Re-revisión: qué se corrigió (contra el veredicto anterior, 31/40 · 15/20 · 14/20)
- 1 (idea y frase del usuario): CORREGIDO a medias. El subhead nombra «idea», la frase de la Pieza 1 va citada en la ruta y se agregó "Hecho con tus 8 respuestas". El titular sigue genérico (ver defecto 2).
- 2 (ancla de precio): CORREGIDO. "AHORRAS $39.89" es exacto (12×9.99−79.99 = 39.89, se acepta que se descarte "4 meses gratis" por integridad), hay precio por día ($0.22 / $0.33) y "La IA ya viene incluida". Queda una observación: el badge mide 12px y 50 §C2(4) pide que compita en peso con el CTA.
- 3 (fondo plano): CORREGIDO en código (globals.css L171-176: 0.16 y 0.08). Ojo: el radial verde está anclado al 110% de una página de ~1.8 pantallas y en la captura final casi no se percibe.
- 4 (conteo y vibración): CORREGIDO. `Monto` cuenta 300ms en tabular-nums en la línea de tiempo y en el pie, sin conteo si reduced-motion, y `vibrar(35)`.
- 5 (Restaurar compra): CORREGIDO a medias. "¿Ya pagaste? Recupera tu acceso" abre un mailto, que es una acción real, pero va a `adrianachacon15@hotmail.com` con `emailEsProvisional: true` (lib/legal.ts L7-8).
- 6 (promesas de 1 clic / 1 toque): CORREGIDO a medias. Se quitó "1 toque" y el pie dice "cancela cuando quieras". "1 clic" sigue en la garantía, como texto de la dueña con bloqueante anotado en la Sesión 6.
- 7 (nodo "+26" accidental): CORREGIDO. Ahora usa el mismo estilo hundido que sus hermanos.
- 8 (nodos bloqueados con relieve de botón): CORREGIDO. Son planos (borde + `bg-sunken`).
- 9 (mezcla de clic y toque): CORREGIDO dentro de esta pantalla. FICHA-AVATAR obj. 4/6 sigue diciendo "toque".
- 10 (mecanismo sin nombre): CORREGIDO. "El Método Pieza a Pieza:" con nombre propio.
- 11 (flechas del teclado): CORREGIDO. onKeyDown con roving tabindex (L246-252).
- 12 (CTA de identidad): sin cambio. Sigue como variante a testear, no es un bloqueo.

## Hallazgos por severidad

### ALTA (bloquean el veredicto)
1. Paywall.tsx L172-182 y L186-238, primer pliegue (14-planes-arriba / 15-planes-mensual-arriba): el subhead pone en negrita blanca la idea (7 palabras) y "Hecho con tus 8 respuestas" (5 palabras). Son 12 palabras que compiten con el titular, y 50 §C1 pide 2-4 palabras en semibold. La tarjeta de la ruta (nodos + cita + Método) ocupa ~330px y empuja los planos: el anual queda cortado por el degradé del botón. Si el plan inicial es Mensual (?plan=mensual), el plan elegido NO se ve en el primer pliegue (falla de 50 §C: "deben verse… plan seleccionado"). Además hay más de 3 tamaños tipográficos en la vista (pregunta, base, lg, precio, ayuda, caption, sm, xs). Esto pesa en el eje jerarquía y en h8. FIX: pasar "Hecho con tus 8 respuestas" a la línea verde superior ("Tu pieza 1 ya está guardada · con tus 8 respuestas") y dejar en semibold solo la idea; sacar la línea del Método de la tarjeta (o fundirla con la cita) para que los 2 planes entren sobre el botón a 375×812.
2. Paywall.tsx L171, titular: "Desbloquea los 29 días que faltan" vende la pérdida, pero no nombra la meta ni el deseo tangible de la ficha (deseo 2: "estructura de mi empresa armada en 30 días"; deseo 5: oferta lista para vender). Falla el binario de 50 §D ("menciona la META del usuario"; en el subhead no cuenta). Eso deja el eje idea en 3. FIX: algo como "Faltan 29 días para tu oferta lista para vender", con acento en "lista para vender" o en "29 días", y que salga del proceso de 10 variantes del 52.

### MEDIA
3. Paywall.tsx L315 y L357-358, promesas: "11 de octubre: te avisamos / Te escribimos antes de cualquier cobro" depende de un correo que hoy no existe (ESTADO pendiente), y "pides la devolución en 1 clic" depende de Hotmart. Son claims del 61/C5. FIX: dejarlos como bloqueante duro de la Sesión 6. Sin el correo programado y sin el flujo de reembolso verificado, no se activa `NEXT_PUBLIC_HOTMART_CHECKOUT_*`. Si el reembolso no es de 1 clic, ajustar el texto con la dueña.
4. Paywall.tsx L378-394, fila de salida a 360px (recorrido-360-nose/15-planes-final): "Ahora / no" y "¿Ya pagaste? Recupera tu / acceso" se parten en 2 líneas y el punto separador queda flotando. Es el ancho del avatar (Android gama media). Además el mailto apunta a un correo provisional. FIX: `whitespace-nowrap` en ambos enlaces y apilarlos en columna bajo 380px (o acortar a "¿Ya pagaste? Entra"); poner el correo del dominio propio antes de publicar.
5. Paywall.tsx L228, cita de la frase: `line-clamp-3` corta la frase del usuario a media palabra ("conseguir cliente…"). Lo que más debería dar pena perder se ve mutilado. Además, la plantilla de la Pieza 1 produce "Con manejo de redes sociales para negocios locales, ayudo a…", que es una construcción sin artículo y suena a máquina. FIX: mostrar la frase completa (line-clamp-4 o ninguno) y corregir la plantilla del generador ("Con mi servicio de…" / "Con «{idea}», ayudo…").

### BAJA
6. Paywall.tsx L283, badge: "AHORRAS $39.89" mide 12px. 50 §C2(4) pide que el ahorro sea el elemento más ruidoso después del CTA. FIX: subirlo a 13-14px/800, o repetir "Ahorras $39.89 al año" en verde bajo "Se cobra $79.99 al año".
7. Paywall.tsx L363-376, fila de confianza: 3 ítems se reparten en 2 líneas con el tercero huérfano y centrado. 50 §C2(9) pide una sola línea. FIX: dejar 2 ítems ("La IA ya viene incluida" y "Pago seguro por Hotmart"), porque "Tu idea es tuya" ya se dijo en el onboarding.
8. Paywall.tsx L136: `new URL(base)` lanza una excepción no capturada si la variable de entorno del checkout viene mal formada, y el usuario se queda sin feedback (h9). FIX: try/catch que muestre "No pudimos abrir la página de pago. Intenta de nuevo o escríbenos."
9. Movimiento: no hay conteo de número héroe al entrar (solo al cambiar de plan) y no hay pulso único del CTA (opcional en C3). Por eso no llega a 4.
