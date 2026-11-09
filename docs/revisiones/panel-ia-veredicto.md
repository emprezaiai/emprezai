# VEREDICTO revisor-visual — panel-ia
Fecha: 2026-11-10 07:00
Screenshot: docs/revisiones/panel/ia-375.png
Usabilidad: 36/40
Craft: 16/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: LISTA
Top defectos: 1) [Lectura bajo "Por función", app/admin/(panel)/ia/page.tsx] ocupa 4 líneas y termina con "(míralo en Uso)" en texto plano, sin enlace → 2 líneas ("La pieza gratis es el 41% del gasto: vale la pena si quienes la prueban terminan comprando.") + enlace "Ver en Uso →". 2) [Lista "Quiénes más la usan"] filas de 44px sin divisores: los 5 correos quedan separados por huecos grandes, y el estilo de enlace (subrayado) difiere del resto del panel (chevron) → divide-y con la línea del kit y chevron ink-3 al final de cada fila. 3) [Ayuda "Punteada: tu promedio."] sigue en estilo de leyenda técnica → "La línea punteada es tu promedio por día." 4) [Etiqueta "hoy" del gráfico, components/admin/Graficos.tsx] va arriba a la derecha, separada de su barra por la línea punteada → etiqueta pegada al tope de la barra o bajo el eje en lugar de "9 nov". 5) [KPI "Usos de la IA 276"] "Todos respondieron bien" ocupa 2 líneas a 375 → "Sin fallos".
