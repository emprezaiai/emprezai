# VEREDICTO revisor-visual — paywall (pantalla de planes)
Fecha: 2026-10-06 18:00
Screenshot: docs/revisiones/paywall-375.png
Usabilidad: 32/40
Craft: 15/20
Copy (si vende): 17/20
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos: (1) subtítulo: la idea va en negrita blanca (7 palabras), con "Manejo" en mayúscula a mitad de frase ("la IA arma Manejo de redes sociales… contigo"), y se repite tal cual 100px más abajo en la cita · (2) a 360px el plan Mensual elegido queda cortado por el degradé del botón (se pierden el borde inferior y "$0.33 al día") · (3) la fila de confianza sigue con el tercer ítem solo en otra línea ("Tu idea es tuya") · (4) movimiento y badge sin cambios: el $6.67 no cuenta al entrar, el CTA no tiene pulso único y "AHORRAS $39.89" sigue en 12px · (5) `new URL(base)` sin try/catch (L136), y la línea verde con `whitespace-nowrap` desborda a 320px

Detalle: USABILIDAD h1:3 h2:3 h3:3 h4:3 h5:4 h6:4 h7:3 h8:3 h9:3 h10:3 · CRAFT jerarquía:3 profundidad:3 identidad:3 movimiento:3 encaje:3 · COPY idea:4 especificidad:3 emoción:3 oferta:4 acción:3
Gate doble: 32/40 (<36) y 15/20 (<16). Copy 17/20 (pasa, ningún eje ≤2). Resultado: CORREGIR.
Gate de carga cognitiva: 0 fallas de 8.
CTA héroe vivo: pasa los 4. Texto oscuro sobre #FFC23D ≈ 11:1 · whileTap 0.98 · habilitado por defecto y disabled solo mientras abre Hotmart · h-14 (56px), ancho completo, fijo abajo.
Binarios de 50 §D (paywall): pasan los 6. Titular con meta, inversión visible ("con tus 8 respuestas"), $/mes en tabular-nums + total anual, anual preseleccionado con borde 2px + badge, CTA en 1ª persona con fecha de cobro en la línea de tiempo, X de 44px + "Ahora no" + recuperar acceso. Gate premium: pasa (titular con acento, hairline en la garantía, fondo radial, radios del kit, check custom). Esta pantalla no tiene lista de beneficios con chips.
FICHA-ARTE: lo que se ve coincide con la ficha (#0F0D16 / #FFC23D / #3DDC97, Bricolage + Instrument Sans, tarjetas de 20px, píldora en el CTA y chips de 12px). No hay desvío.
Sub-checks de copy: la garantía aparece con nombre ("La Garantía Sin Preguntas") y plazo (15 días) justo antes del CTA (PASA). El message-match NO ES VERIFICABLE porque no hay dato del 34.
Promesas pendientes (no cuentan como defecto, por instrucción): "te avisamos el 11 de octubre" y "devolución en 1 clic" dependen de la Sesión 6. Hoy el botón abre una vista previa honesta y no cobra, así que el texto no promete nada imposible MIENTRAS el checkout siga apagado. No se activa `NEXT_PUBLIC_HOTMART_CHECKOUT_*` sin el correo del día 5 y el reembolso verificados.

## Re-revisión 3: qué se corrigió (contra la revisión 2, 32/40 · 15/20 · 16/20)
- 1 (primer pliegue saturado): CORREGIDO a medias. "Con tus 8 respuestas" pasó a la línea verde y los 2 planes, con el elegido (anual o mensual), se ven completos sobre el botón a 375×812. Sin embargo, la negrita del subtítulo sigue en 7 palabras (50 §C1 pide 2-4), la idea ahora sale dos veces en el pliegue y a 360px el plan Mensual elegido se corta.
- 2 (titular sin meta): CORREGIDO. "Desbloquea los 29 días hasta tu oferta lista" nombra el deseo 5 de la ficha, con acento en la meta. Eso sube el eje idea a 4. Queda una observación menor: la ruta muestra "Oferta" en el día 3 y "Lista" en el día 30, así que "29 días hasta tu oferta" puede leerse como una contradicción.
- 3 (promesas sin verificar): sigue como bloqueante de la Sesión 6, por instrucción. Ver arriba.
- 4 (fila de salida a 360px): CORREGIDO. Los enlaces van en columna y con nowrap, sin partirse. El correo provisional queda como bloqueante anotado.
- 5 (frase cortada y redacción robótica): CORREGIDO en la cita, que ahora va completa y con la forma "[Idea]: ayudo a…". La redacción robótica se mudó al subtítulo (ver defecto 1).
- 6 (badge de 12px): SIN CAMBIO.
- 7 (fila de confianza en 2 líneas): SIN CAMBIO.
- 8 (`new URL` sin try/catch): SIN CAMBIO.
- 9 (conteo del número héroe al entrar y pulso del CTA): SIN CAMBIO.

## Hallazgos por severidad

### ALTA (bloquean el veredicto)
1. Paywall.tsx L172-180, subtítulo: "la IA arma <b>Manejo de redes sociales para negocios locales</b> contigo". Tiene 7 palabras en semibold blanco (la regla es 2-4), una mayúscula a mitad de frase y un sentido ambiguo (parece que la IA hará el manejo de redes). Además repite la idea literal que abre la cita de la ruta. Ocupa 3 líneas y por eso el pliegue a 360px no alcanza. FIX: "Con el Método Pieza a Pieza, la IA arma tu negocio contigo, **una pieza al día**." Deja la idea solo en la cita.
2. Captura recorrido-360-nose/16-planes-mensual-arriba: con Mensual elegido a 360×812, el degradé de `.barra-inferior` tapa el borde dorado inferior y "$0.33 al día". El plan elegido queda mutilado en el ancho del avatar (Android de gama media). FIX: con el subtítulo a 2 líneas (fix 1), más mt-6→mt-4 entre la ruta y los planes, entran completos. Hay que verificarlo de nuevo a 360.

### MEDIA
3. Paywall.tsx L358-371, fila de confianza: 3 ítems en 2 líneas con "Tu idea es tuya" solo y centrado. Se ve a 375 y a 360, y 50 §C2(9) pide una sola línea. FIX: dejar 2 ítems ("La IA ya viene incluida" y "Pago seguro por Hotmart").
4. Movimiento (Paywall.tsx L297 y L391): el $6.67 aparece estático al entrar (baseline 2) y el CTA no tiene el pulso único de C3. El badge "AHORRAS $39.89" sigue en text-xs (12px), así que no compite en peso con el CTA (C2(4)). FIX: animar el precio del plan elegido de 0 a su valor en 400ms tras el stagger (sin conteo con reduce), agregar un pulso 1→1.02→1 de 600ms una sola vez a ~2s, y subir el badge a 13-14px/800. Con esto y el defecto 3, encaje y movimiento llegan a 4 y craft pasa de 16.

### BAJA
5. Paywall.tsx L136: `new URL(base)` lanza una excepción no capturada si la variable del checkout viene mal formada, y el usuario se queda sin feedback (h9). FIX: try/catch que muestre en el aria-live "No pudimos abrir la página de pago. Intenta de nuevo o escríbenos."
6. Paywall.tsx L166: la línea "PIEZA 1 GUARDADA · CON TUS 8 RESPUESTAS" tiene `whitespace-nowrap` y mide ~300px. A 320px (288px útiles) desborda y aparece scroll horizontal. FIX: quitar nowrap o acortar a "Pieza 1 lista · 8 respuestas".
7. Ruta: la etiqueta "Lista" sola es ambigua (el detalle solo está en sr-only) y choca con "Oferta" en el día 3. FIX: "Día 30" o "A vender".
8. Emoción: el paywall no usa el dolor #1 literal de la ficha ("hoja en blanco"). La pérdida se apoya solo en los candados. No bloquea, pero deja el eje en 3.
