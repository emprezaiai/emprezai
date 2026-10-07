# VEREDICTO revisor-visual — paywall (pantalla de planes)
Fecha: 2026-10-06 23:55
Screenshot: docs/revisiones/paywall-375.png
Usabilidad: 36/40
Craft: 15/20
Copy (si vende): 19/20
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos: (1) insignia del plan Anual (Paywall.tsx L283): con el texto nuevo, la insignia mide unos 236px y ahora cubre la columna del título. Antes empezaba a la derecha de "Anual"; ahora queda encima de "ual". Su mitad inferior (16px) entra en el pt-4 de la tarjeta y deja solo unos 5-7px hasta "Anual", tanto a 375 como a 360. El relleno superior efectivo de la tarjeta Anual ya no coincide con el inferior ni con el de la tarjeta Mensual. Es un desencaje nuevo y baja encaje de 4 a 3 → dar a la tarjeta anual pt-6 (o mt-2 al bloque de texto) y agregar whitespace-nowrap a la insignia · (2) primer cuadro, encima del botón fijo: la fila "Hoy: empiezas gratis" sigue cortada. A 375, "Acceso completo a tu ruta de 30 días" sale partido a la mitad de la letra; a 360, con la cita de 4 líneas, la fila entera queda lavada (sin cambio desde la revisión 7) → mover el corte a un borde limpio (mt-6 → ajustar o subir el tramo opaco de .barra-inferior a ~40px) · (3) cola de la página (L376-401): hay 3 niveles de enlaces grises (text-sm, text-sm y text-xs) con separaciones de ~44px y ~51px. Es una variante accidental del enlace terciario → unificar en text-sm con un solo ritmo, o llevar "¿Ya pagaste?" a la fila legal · (4) garantía (L352): .hairline-oro sobre un fondo raised plano, sin la luz ni la sombra de .tarjeta-relieve. Se ve más plana que las tarjetas de plan → sumarle el inset y la sombra de .tarjeta-relieve · (5) el dorado sigue fuera de la lista de FICHA-ARTE L33 (insignia, borde del plan elegido, tramo Hoy y hairline). Al alargarse, la insignia ahora tiene casi el doble de área dorada → aceptable si la dueña la aprueba como excepción en la ficha; si no, bajar la insignia a texto on-gold sobre gold-deep/oro al 20 %

Detalle: USABILIDAD h1:4 h2:4 h3:4 h4:3 h5:4 h6:4 h7:3 h8:3 h9:4 h10:3 · CRAFT jerarquía:3 profundidad:3 identidad:3 movimiento:3 encaje:3 · COPY idea:4 especificidad:3 emoción:4 oferta:4 acción:4
Gate doble: 36/40 (≥36) PASA · 15/20 (≥16) NO PASA · copy 19/20 (≥16, ningún eje ≤2) PASA. La revisión 7 pasaba justo, sin margen. La insignia nueva le quita el único 4 de craft que tenía (encaje).
Gate de carga cognitiva: 0 fallas de 8. La ruta tiene 5 nodos, hay 2 planes y la línea de tiempo tiene 3 pasos. Hay 1 acción primaria y ningún bloque pasa de 4 líneas.
CTA héroe vivo: pasa los 4. #1A1206 sobre #FFC23D ≈ 11:1 · whileTap 0.98 + :active · disabled solo con `yendo` · h-14 (56px), ancho completo y sticky.
FICHA-ARTE: coinciden #0F0D16, #FFC23D, #3DDC97, Bricolage + Instrument Sans, tarjeta de 20px, chip de 12px y píldora. No es clon de "Umbral" ni de "Capítulo".
Copy: el subtítulo se traza a FICHA-AVATAR L66, el titular a L52 y "ahorras $39.89" al miedo de L26 ("gastar mis ahorros"). El dato es exacto: 12×9.99 = 119.88 − 79.99 = 39.89. "Mejor valor" es una comparación que el número de al lado respalda, no un adjetivo vacío. Garantía con nombre y plazo antes del CTA: PASA. Message-match: NO VERIFICABLE, porque falta el dato del 34.
Pendientes de publicación (no cuentan como defecto, por instrucción): el aviso del día 5 y el reembolso en 1 clic se verifican en Hotmart. No hay prueba social porque no hay usuarios. El correo de soporte es provisional.

## Re-revisión 8: qué cambió (contra la revisión 7, 36/40 · 16/20 · 19/20)
- Cambio único: la insignia pasó de "Ahorras $39.89" a "Mejor valor · ahorras $39.89" (L285).
- ¿Cabe a 360? SÍ, en 1 línea: ~236px de ancho, 16px de margen a la derecha y ~73px a la izquierda (recorrido-360-nose/15 y 16). Por cálculo, también cabría a 320 (tarjeta de ~288px), pero no tiene whitespace-nowrap, así que el ajuste depende del ancho y no está garantizado.
- Regresión de encaje: al ensancharse, la insignia invade la columna del título "Anual" y le deja ~5-7px de aire (defecto 1). Encaje baja de 4 a 3 y craft queda en 15/20 → NO LISTA.
- Sin otras regresiones: los montos, el estado activo con layoutId, el radiogroup con flechas, la hoja de vista previa ("Elegiste el plan Mensual"), el botón fijo con el precio dinámico y la línea de tiempo dinámica ($79.99 / $9.99) siguen intactos.
- El subrayado de "¿Ya pagaste?" en 15-planes-mensual-final es el :hover que dejó el puntero de la captura. No es un defecto.

## Fixes concretos (en orden; el 1 basta para volver a ≥16/20)
1. Paywall.tsx L266/L283: si id==='anual', usar pt-6 en la tarjeta (o mt-2 en el span del nombre) para que haya ≥10px entre la insignia y "Anual"; agregar whitespace-nowrap a la insignia. Validar a 360 y a 320.
2. L313 / .barra-inferior: ajustar el corte para que la fila "Hoy" no quede partida. Validar a 360 con la cita de 4 líneas.
3. L376-401: unificar los enlaces terciarios en un solo tamaño y un solo ritmo.
4. L352: darle a la garantía el relieve de .tarjeta-relieve, manteniendo la hairline degradé.
