# VEREDICTO revisor-visual — paywall (pantalla de planes)
Fecha: 2026-10-06 20:15
Screenshot: docs/revisiones/paywall-375.png
Usabilidad: 35/40
Craft: 15/20
Copy (si vende): 18/20
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos: (1) subtítulo (L182-185): con las frases nuevas pasó de 2 a 3 líneas. A 375 queda "al día." solo en la tercera línea, y a 360 el "5" en negrita se separa de "minutos al día" · (2) a 360, con el plan Mensual elegido y una cita de 4 líneas (recorrido-360-nose/16-planes-mensual-arriba), el borde inferior de la tarjeta queda tapado por el degradado de .barra-inferior. Es una regresión del defecto 2 de la revisión 3, causada por la línea extra del subtítulo · (3) el esqueleto (L497-503) copia la estructura, pero no las alturas: subtítulo h-12 (48px) contra ~78px reales, ruta h-48 (192) contra ~205, planes h-20 (80) contra ~97. Eso da unos 80px de salto al hidratar, y además usa animate-pulse sin motion-safe (ignora reduced-motion) · (4) contradicción que sigue en pie: el titular dice "29 días hasta tu oferta lista" y justo debajo la ruta pone "Oferta" en el día 3. "A vender" ayuda, pero el titular sigue apuntando a la oferta y no a vender · (5) el CTA "Empezar mis 7 días gratis" nombra la prueba y no el beneficio (eje acción 3)

Detalle: USABILIDAD h1:3 h2:4 h3:4 h4:3 h5:4 h6:4 h7:3 h8:3 h9:4 h10:3 · CRAFT jerarquía:3 profundidad:3 identidad:3 movimiento:3 encaje:3 · COPY idea:4 especificidad:3 emoción:4 oferta:4 acción:3
Gate doble: 35/40 (<36) FALLA · 15/20 (<16) FALLA. Copy 18/20 pasa y ningún eje está en ≤2. Resultado: CORREGIR. El encaje bajó de 4 a 3 por la regresión a 360 que trajo el subtítulo largo.
Gate de carga cognitiva: 0 fallas de 8. La ruta tiene 5 nodos, hay 2 planes y la línea de tiempo tiene 3 pasos. Hay 1 acción primaria y ningún bloque pasa de 4 líneas.
CTA héroe vivo: pasa los 4. Texto on-gold sobre #FFC23D ≈ 11:1 · whileTap 0.98 + pulso único a los 2s (sin pulso con reduce) · disabled solo con `yendo` · h-14, ancho completo y sticky.
FICHA-ARTE: lo visible coincide (#0F0D16, #FFC23D, #3DDC97, Bricolage + Instrument Sans, tarjetas de 20px, chip de 12px, píldora). No hay desvío. No es un clon de "Umbral".
Sub-checks de copy: la garantía va con nombre y plazo ("La Garantía Sin Preguntas" · 15 días) antes del CTA (PASA). El message-match NO ES VERIFICABLE porque no hay dato del 34. "Hoja en blanco" y "5 minutos al día" ya salen en el camino con pieza: se trazan a las frases obligatorias de FICHA-AVATAR, L66 y L68.
Promesas pendientes (no cuentan como defecto, por instrucción): el aviso del día 5 y la devolución "en 1 clic" se verifican en Hotmart en la Sesión 6. El correo de soporte es provisional.

## Re-revisión 5: qué se corrigió (contra la revisión 4, 34/40 · 16/20 · 17/20)
- 1 (nodo "Lista"): CORREGIDO. Ahora dice "A vender" y lleva sr-only con el día 30. Queda una tensión de lectura entre el titular y el nodo "Oferta" del día 3 (defecto 4).
- 2 (error de pago sin cómo escribir): CORREGIDO. L410-415 tiene un mailto con asunto, dentro del aria-live. h9 sube a 4.
- 3 (esqueleto): CORREGIDO A MEDIAS. Ya tiene header de 56px con círculo de 44px, la ruta, los 2 planes y la píldora h-14, pero las alturas no calcan y el pulse ignora reduced-motion (defecto 3).
- 4 (conteo del precio tapado): CORREGIDO. El delay de 0.5s cae al final del fade de la tarjeta (0.19 + 0.4s), así que el conteo se ve.
- 5 (faltan "5 minutos" y "hoja en blanco"): CORREGIDO en el copy (emoción sube a 4), pero metió una REGRESIÓN de maquetación: 3 líneas, la negrita partida a 360 y el Mensual tapado a 360 (defectos 1 y 2).

## Fixes concretos
1. L182-185: dejar el subtítulo en ≤80 caracteres para que entre en 2 líneas a 360, por ejemplo "Adiós a la hoja en blanco: el Método Pieza a Pieza arma tu negocio contigo, **5 minutos al día**.". Además, poner `whitespace-nowrap` en el span en negrita.
2. Después del fix 1, volver a sacar la captura a 360 con el Mensual elegido y la cita de 4 líneas. Si el borde sigue tapado, bajar la ruta de `mt-6` a `mt-4` (L189).
3. L499-503: subtítulo `h-[78px]`, ruta `h-52`, planes `h-24`, y cambiar `animate-pulse` por `motion-safe:animate-pulse` en todo el esqueleto.
4. L181: alinear el titular con el nodo final, por ejemplo "Desbloquea los 29 días que faltan para salir a vender" con acento en "salir a vender". No promete ingresos.
5. L403: un CTA que hable del beneficio en 1ª persona y mantenga la prueba, por ejemplo "Seguir mi ruta gratis 7 días".
