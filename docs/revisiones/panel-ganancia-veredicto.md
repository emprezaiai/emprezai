# VEREDICTO revisor-visual — panel-ganancia
Fecha: 2026-11-10 05:00
Screenshot: docs/revisiones/panel/ganancia-375.png
Usabilidad: 36/40
Craft: 15/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos: 1) [Columna de montos de "La cuenta, paso a paso", components/admin/ui.tsx FilaMonto] el chevron nuevo de las filas tocables empuja sus montos ~36px a la izquierda: $139,93, −$17,01 y $61,73 terminan en el borde, pero −$13,99, −$0,95 y −$46,25 terminan antes; en una cascada de dinero la columna de cifras queda dentada, y el chevron va centrado en la fila, no alineado con el monto → reservar el ancho del chevron en TODAS las filas (span vacío de 16px en las no tocables y en el total) para que los montos alineen a la derecha, y chevron alineado a la línea base del monto. 2) [Leyenda bajo la barra, app/admin/(panel)/ganancia/page.tsx líneas 77-84] los puntos de Hotmart, Impuestos e IA siguen viéndose del mismo gris a 8px (pedido en rondas 5 y 6) → punto de 10px y separar más los grises intermedios. 3) [Enlace "Cambiar impuestos o costos fijos"] fuera de la tarjeta, flotando al pie, ahora redundante con las filas que ya llevan a Ajustes → quitarlo o moverlo dentro de la tarjeta bajo el total. 4) [Fila "Comisión de Hotmart"] es el único costo sin nota ni enlace, entre filas que sí los tienen → nota "12% · lo informó Hotmart" para que el ritmo de la lista sea parejo. 5) [Lectura "Tu mayor costo es servidores…"] repite el 33% que la leyenda ya muestra justo encima → convertirla en consejo ("Con 15 clientes más, los servidores bajarían a 1 de cada 5 dólares") o quitarla.
