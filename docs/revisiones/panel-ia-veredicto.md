# VEREDICTO revisor-visual — panel-ia
Fecha: 2026-11-09 21:00
Screenshot: docs/revisiones/panel/ia-375.png
Usabilidad: 31/40
Craft: 14/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos: 1) [Tarjeta "Gasto día por día", components/admin/Graficos.tsx GraficoGastoDia líneas 44-65] 9 barras casi iguales sin un solo valor visible (sin etiqueta, sin eje, sin promedio): solo se lee tocando; incumple "label directo sobre el dato" (17) → etiqueta sobre la barra más alta y una línea de lectura ("Promedio $0,11 por día; el más alto, el 4 nov con $0,13"). 2) [Por función, components/admin/movimiento.tsx Llenado] las 3 barras salen vacías en la captura (las de "Topes", que están arriba, sí se ven): Llenado arranca en 0% y depende de whileInView → animación CSS con el ancho final en el HTML, y recapturar. 3) [Tooltip del gráfico diario, Graficos.tsx línea 56] muestra "0,113" sin signo de moneda, a 3 decimales → dinero(v, 2) o cadaUso(). 4) [KPI "Usos de la IA 276 · Todos respondieron bien"] el porcentaje de fallos está bien resuelto, pero "Por cliente que la usa $0,019" a 3 decimales sigue siendo un número que la dueña no sabe juzgar → añadir la referencia ("de $9,99 que paga: 0,2%"). 5) [Movimiento] el gráfico diario usa gris ink-2 al 70%, el mismo tono que las barras de reparto: no hay nada que marque "hoy" ni un día disparado → día de hoy resaltado y en ámbar los días que superen 2× el promedio.
