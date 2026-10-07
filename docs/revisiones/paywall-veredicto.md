# VEREDICTO revisor-visual — paywall (pantalla de planes)
Fecha: 2026-10-06 23:40
Screenshot: docs/revisiones/paywall-375.png
Usabilidad: 36/40
Craft: 16/20
Copy (si vende): 19/20
Fidelidad (si hubo referencia): N-A
Veredicto: LISTA
Top defectos: (1) primer cuadro, encima del botón fijo: la fila "Hoy: empiezas gratis" sigue saliendo cortada. A 375, el título ya se lee, pero "Acceso completo a tu ruta de 30 días" queda partido a la mitad de la letra. A 360, con la cita de 4 líneas, la fila entera sale lavada y cortada (recorrido-360-nose/15-planes-arriba). El fix de 28px fue solo parcial · (2) cola de la página (L376-401): hay 3 niveles de enlaces grises apilados ("Ahora no", "¿Ya pagaste?…" y la fila legal) con 2 tamaños distintos (text-sm y text-xs) y separaciones desiguales (~44px y ~51px). Es una variante accidental del mismo enlace terciario (h4 y h8 en 3) · (3) garantía (L352): usa .hairline-oro con el fondo raised plano, sin la luz superior ni la sombra de .tarjeta-relieve. Junto a las tarjetas de plan, que ahora sí tienen relieve, se ve más plana que sus vecinas (profundidad en 3) · (4) el dorado todavía aparece fuera de la lista de FICHA-ARTE L33: chip de ahorro, borde y check del plan elegido, tramo Hoy→aviso y hairline. Ya bajó (el punto del día 5 pasó a ink-3), pero el 10 % sigue algo repartido · (5) no hay prueba social real, así que especificidad queda en 3. Es una decisión válida mientras no haya testimonios

Detalle: USABILIDAD h1:4 h2:4 h3:4 h4:3 h5:4 h6:4 h7:3 h8:3 h9:4 h10:3 · CRAFT jerarquía:3 profundidad:3 identidad:3 movimiento:3 encaje:4 · COPY idea:4 especificidad:3 emoción:4 oferta:4 acción:4
Gate doble: 36/40 (≥36) PASA · 16/20 (≥16) PASA · copy 19/20 (≥16, ningún eje ≤2) PASA. Pasa justo, igual que en la revisión 6: ninguna regresión, pero tampoco hay margen.
Gate de carga cognitiva: 0 fallas de 8. La ruta tiene 5 nodos, hay 2 planes y la línea de tiempo tiene 3 pasos. Hay 1 acción primaria y ningún bloque pasa de 4 líneas.
CTA héroe vivo: pasa los 4. #1A1206 sobre #FFC23D ≈ 11:1 · whileTap 0.98 + :active · disabled solo con `yendo` · h-14 (56px), ancho completo y sticky.
FICHA-ARTE: coinciden #0F0D16, #FFC23D, #3DDC97, Bricolage + Instrument Sans, tarjeta de 20px, chip de 12px y píldora. No es clon de "Umbral" ni de "Capítulo".
Copy: el subtítulo se traza a FICHA-AVATAR L66 ("hoja en blanco", "pieza a pieza", "5 minutos al día") y el titular a L52 (sin promesa de ingresos). Garantía con nombre y plazo antes del CTA: PASA. Message-match: NO VERIFICABLE, porque falta el dato del 34.
Pendientes de publicación (no cuentan como defecto, por instrucción): el aviso del día 5 y el reembolso en 1 clic se verifican en Hotmart. El correo de soporte es provisional.

## Re-revisión 7: qué se corrigió (contra la revisión 6, 36/40 · 16/20 · 19/20)
- 1 ("pieza a pieza" partido): CORREGIDO. Va junto en la línea 2 a 375 y a 360, y el subtítulo sigue en 2 líneas.
- 2 (tarjetas de plan planas): CORREGIDO. Usan .tarjeta-relieve / .tarjeta-relieve-oro, el mismo material que la ruta. Queda la garantía plana (defecto 3, nuevo foco).
- 3 (fila Hoy lavada bajo la barra): PARCIAL. Con el tramo opaco en 28px, el título se lee a 375, pero la 2ª línea sigue cortada y a 360 la fila entera queda lavada (defecto 1).
- 4 (exceso de dorado en la línea de tiempo): CORREGIDO. Solo el punto "Hoy" queda en dorado; el del día 5 pasó a ink-3.
- 5 (enlaces legales): AGREGADOS. /terminos, /privacidad y /reembolsos existen y tienen min-h-11 (44px). Contraste de ink-3 sobre base ≈ 6:1. Suman confianza en la oferta, pero alargan la cola de enlaces grises (defecto 2).
- Regresiones: ninguna. El CTA, la vista previa (hoja inferior con Escape y foco), el esqueleto y el teclado del radiogroup siguen intactos.

## Fixes concretos (afinado; no bloquean)
1. Paywall.tsx L313: subir `mt-6` de la línea de tiempo o el `pt-6` de la barra para que el primer cuadro termine en un borde limpio y no corte texto (o subir el tramo opaco a ~40px). Validar a 360 con la cita de 4 líneas.
2. L376-401: unificar los terciarios en un solo tamaño (text-sm) y un solo ritmo, o pasar "¿Ya pagaste?" a la misma fila que los enlaces legales.
3. L352: añadir a la garantía el inset de luz superior y la sombra de .tarjeta-relieve, manteniendo la hairline degradé.
4. Cuando haya testimonios REALES, agregar 1 línea de prueba social sobre la garantía. Nunca inventarla.
