# VEREDICTO revisor-visual — panel-ia
Fecha: 2026-11-09 18:00
Screenshot: docs/revisiones/panel/ia-375.png
Usabilidad: 28/40
Craft: 13/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos: 1) [Tarjeta "Topes de gasto", app/admin/(panel)/ia/page.tsx línea 69] "Si quieres cambiar los topes, pídemelo": la voz es la del desarrollador/agente, no la del panel; la dueña no sabe a quién se refiere ni puede hacerlo desde aquí → "Para cambiar los topes, escríbele a quien mantiene tu app" (o un control en Ajustes). 2) [Por función, "Opciones de cada misión", línea 113] "$0,000 cada uno" a 3 decimales: parece gratis o un error → mostrar "menos de $0,001 cada uno" cuando redondea a 0. 3) [KPI "La pieza gratis costó $0,39" + fila "Pieza 1 gratis $0,39"] el mismo dato dos veces en la misma pantalla (defecto de la ronda 1 sin corregir) → quitar el KPI y en su lugar poner "Hoy $0,14" o el costo por uso promedio. 4) [Pantalla completa] sigue sin tendencia: no se ve si el gasto sube día a día (pedido en la ronda 1) → mini-barras por día del mes con GraficoBarrasDia en el héroe o bajo "Topes". 5) [Movimiento, components/admin/ui.tsx Barra] las barras de topes y de función aparecen llenas y estáticas; es la pantalla sin un solo gráfico animado → animar width de Barra (spring, reduced-motion) para cumplir la baseline 3.
