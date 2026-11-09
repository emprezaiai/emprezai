# VEREDICTO revisor-visual — panel-ia
Fecha: 2026-11-10 05:00
Screenshot: docs/revisiones/panel/ia-375.png
Usabilidad: 35/40
Craft: 16/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos: 1) [Barra de hoy en "Gasto día por día", components/admin/Graficos.tsx línea 75] ahora va en VERDE: en la ficha y en todo el panel el verde significa "bien / progreso hecho", y en un gráfico de COSTO la barra más alta del día se lee como algo positivo → hoy en ink-2 sólido con la etiqueta "hoy" bajo la barra (texto, no color). 2) [KPI "IA por cliente", app/admin/(panel)/ia/page.tsx línea 72] "0,2% de lo que paga uno" suena a traducción → "0,2% de lo que te paga cada cliente". 3) [Por función] "Pieza 1 gratis (antes de pagar)" es el 41% del gasto y no se interpreta (pedido en la ronda 6) → una lectura de 1 línea: "La pieza gratis es el 41% del gasto: es la que convierte a quien prueba". 4) [Ayuda "Punteada: tu promedio · verde: hoy"] estilo telegráfico de leyenda técnica → "La línea punteada es tu promedio diario." (y la etiqueta "hoy" en el eje). 5) [Lista "Quiénes más la usan"] con filas de 44px y sin divisores, los 5 correos quedan separados por huecos grandes que parecen vacío → divide-y con la línea del kit, o py-3 con el correo y el costo alineados a la misma línea base.
