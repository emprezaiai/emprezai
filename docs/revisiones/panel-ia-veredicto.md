# VEREDICTO revisor-visual — panel-ia
Fecha: 2026-11-10 01:00
Screenshot: docs/revisiones/panel/ia-375.png
Usabilidad: 32/40
Craft: 16/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos: 1) [Lista "Quiénes más la usan", app/admin/(panel)/ia/page.tsx líneas 142-153] los correos no llevan a la ficha de la persona: si alguien se pasa (ámbar), la dueña tiene que memorizar el correo e ir a buscarlo en Usuarios (heurística 6) → cada fila como enlace a /admin/usuarios/[id]. 2) [Menú de secciones, components/admin/MarcoPanel.tsx línea 52 + SelectorMes] el mes elegido se pierde al cambiar de sección y no hay atajo ← / → (heurística 7, verificado en código) → propagar ?mes y teclas de flecha. 3) [Ayuda de "Topes de gasto", línea 86] 4 líneas antes de los dos números → "Si se llega al tope, la IA se pausa y las piezas se arman igual. Para cambiarlo, pídeselo a quien te ayuda con la app." (2 líneas). 4) [KPI "Por cliente", línea 68] la etiqueta sola no dice de qué es el costo (en una pantalla con "Usos" al lado) → "IA por cliente". 5) [Gráfico diario, components/admin/Graficos.tsx línea 75] la barra de hoy va en ink-1 casi blanco, más brillante que el dato héroe dorado de la pantalla → hoy en ink-2 con borde o etiqueta "hoy", sin superar en peso al héroe.
