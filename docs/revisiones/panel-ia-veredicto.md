# VEREDICTO revisor-visual — panel-ia
Fecha: 2026-11-10 03:00
Screenshot: docs/revisiones/panel/ia-375.png
Usabilidad: 34/40
Craft: 16/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos: 1) [Lista "Quiénes más la usan", app/admin/(panel)/ia/page.tsx línea 166] los correos ya son enlaces a la ficha, pero en el celular no se nota (solo hover:underline, que no existe al tocar) y cada enlace mide ~20px de alto, muy por debajo de los 44px → fila completa tocable (min-h-11) con chevron ink-3 al final, como las tarjetas. 2) [KPI "IA por cliente", línea 72] el detalle ocupa 3 líneas ("De unos $8,84 que paga cada uno al mes (0,2%)") y deja a "Usos de la IA" con un hueco abajo → "0,2% de lo que paga ($8,84)". 3) [Gráfico diario, components/admin/Graficos.tsx línea 75] la barra de hoy (lavanda clara) es casi igual a las demás: "la barra clara, hoy" obliga a comparar tonos → etiqueta "hoy" debajo de la última barra en vez de solo color. 4) [Ayuda de "Gasto día por día"] dos frases de ayuda + una línea de resumen antes del gráfico → fusionar: "Promedio $0,11 por día (línea punteada) · el más caro, el 4 nov ($0,12)". 5) [Por función] "Pieza 1 gratis (antes de pagar)" cuesta casi tanto como la función principal y no se dice si eso está bien → lectura de 1 línea ("La pieza gratis es el 41% del gasto: es lo que convierte").
