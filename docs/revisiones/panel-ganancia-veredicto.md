# VEREDICTO revisor-visual — panel-ganancia
Fecha: 2026-11-09 23:00
Screenshot: docs/revisiones/panel/ganancia-375.png
Usabilidad: 32/40
Craft: 15/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos: 1) [Tarjeta héroe, app/admin/(panel)/ganancia/page.tsx líneas 58-89] ahora lleva ~12 líneas: número, margen (2 líneas), por cliente, barra, leyenda de 3 filas, lectura de 2 líneas y nota de 2 líneas; "Te queda 44%" repite "margen 44%" y "(el mes va en el día 9)" repite el selector de mes → quitar "Te queda" de la leyenda (ya está en el margen), quitar la nota del día 9 y dejar la lectura en 1 línea. 2) [Leyenda bajo la barra, líneas 77-84] los puntos de 8px de Hotmart, Impuestos e IA se ven del mismo gris; el % salva la lectura, pero el punto no sirve para emparejar con la barra → ordenar la leyenda en el mismo orden que los tramos de la barra (hoy va en el orden de la lista, no de la barra) y punto de 10px. 3) [Enlace "Cambiar el % de impuestos o tus costos fijos", líneas 119-125] sigue en 2 líneas display-bold compitiendo con el total dorado (ronda 3 sin corregir) → "Ajustar impuestos y costos" en peso de cuerpo. 4) [Comentario de código, líneas 12-14] describe colores que ya no existen ("ámbar, turquesa apagado") → borrar las dos líneas obsoletas. 5) [La cuenta, paso a paso] las filas apagadas en $0,00 (Reembolsos, Afiliados) ocupan lo mismo que las reales → agruparlas en una sola fila "Sin reembolsos ni afiliados este mes".
