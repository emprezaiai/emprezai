# VEREDICTO revisor-visual — panel-ganancia
Fecha: 2026-11-10 01:00
Screenshot: docs/revisiones/panel/ganancia-375.png
Usabilidad: 33/40
Craft: 16/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos: 1) [Menú de secciones, components/admin/MarcoPanel.tsx línea 52 + SelectorMes en components/admin/ui.tsx] llegar a Ganancia desde el menú vuelve al mes actual aunque se estuviera mirando otro (heurística 6), y no hay atajo ← / → para el mes (heurística 7, verificado en código) → propagar ?mes y teclas de flecha. 2) [La cuenta, paso a paso, app/admin/(panel)/ganancia/page.tsx líneas 104 y 111] "Reembolsos y contracargos $0,00" y "Afiliados $0,00" siguen ocupando dos filas completas (ronda 4) → una sola fila apagada "Sin reembolsos ni afiliados este mes", y la palabra "contracargos" (jerga de pagos) cambiada por "devoluciones del banco". 3) [Leyenda bajo la barra, líneas 77-84] los puntos de Hotmart, Impuestos e IA siguen viéndose del mismo gris a 8px: la leyenda se lee por el texto, no por el color → punto de 10px y separar más los dos grises intermedios (o un borde de 1px ink-1 en el punto del costo mayor). 4) [Filas de costos] cada costo tiene su sección para actuar (IA → /admin/ia, Servidores → Ajustes) pero las filas no llevan a ningún lado → enlace discreto en "IA" e "Impuestos/Servidores" hacia su sección. 5) [Ayuda "En dólares. Todo es real, salvo lo marcado como estimado."] ocupa 2 líneas para algo que ya dice cada fila estimada → quitarla.
