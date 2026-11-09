# VEREDICTO revisor-visual — panel-canales
Fecha: 2026-11-10 01:00
Screenshot: docs/revisiones/panel/canales-375.png
Usabilidad: 33/40
Craft: 16/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos: 1) [Menú de secciones, components/admin/MarcoPanel.tsx línea 52 + SelectorMes] el aviso de Inicio "Ver canales" y el menú llevan al mes actual sin conservar el elegido (heurística 6), y no hay atajo ← / → para el mes (heurística 7, verificado) → propagar ?mes y teclas de flecha. 2) [Tarjeta TikTok, app/admin/(panel)/canales/page.tsx líneas 92-126] tres métricas distintas para la misma pregunta ("vuelven $1,56 por cada $1", "Te dejarán $219" y "recuperas lo gastado en unos 7 meses") en 5 líneas de caption → quedarse con la barra gastaste/te dejarán + una sola frase ("Recuperas lo invertido en ~7 meses"). 3) [Veredictos, líneas 89-91] ahora en caption semibold: "Sin clientes nuevos" en rojo pequeño queda casi como una nota al pie, y "Se paga" no se distingue de "Sin gasto"/"Paga por venta" (mismo color y tamaño) → chip con fondo tenue del color del veredicto (rojo/verde/neutro) para que se lea de un vistazo. 4) [Tarjeta Instagram] la fila "Te dejarán $0" con riel vacío repite lo que ya dice el veredicto → ocultar esa fila cuando valor = 0. 5) [KPI "Costo por cliente $100,00" en rojo] el aviso ya explica que el promedio lo hunde Instagram, pero el KPI sigue gritando en rojo un número que no aplica a TikTok → detalle "Sin Instagram: $46,67".
