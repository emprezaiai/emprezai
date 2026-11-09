# VEREDICTO revisor-visual — panel-ajustes
Fecha: 2026-11-09 23:00
Screenshot: docs/revisiones/panel/ajustes-375.png
Usabilidad: 32/40
Craft: 15/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos: 1) [Quitar una fila, components/admin/FormulariosAjustes.tsx líneas 123/179 y 130-138/184-200] el aviso y la barra "Deshacer" ya entran animados, pero la fila quitada desaparece de golpe y la lista salta; abrir "Agregar un costo"/"Anotar un gasto" (<details>) tampoco tiene transición → AnimatePresence en las filas (fundido + altura 200 ms) y apertura suave del formulario (grid-rows 0fr→1fr), con reduced-motion. 2) [Botón de quitar, línea 83] mientras se borra no hay indicio en la fila tocada (solo se deshabilitan todos los botones) → spinner en el ícono de la fila que se está quitando. 3) [Lista de gastos agrupada por mes, línea 186] el encabezado "NOVIEMBRE DE 2026" no dice el total del mes, que es justo lo que se compara con Canales ($300) → "Noviembre de 2026 · $300,00". 4) [Campo "Nombre del canal" con "Otro…", línea 229] "Igual que lo pusiste al final de tu enlace de Hotmart" sigue siendo una instrucción técnica para la dueña → "Escríbelo igual que en el enlace que te dieron para ese lugar (ej.: pinterest)". 5) [Tarjeta "Impuestos y retenciones"] la ayuda ocupa 3 líneas antes del número 10%, y "Cambiar el porcentaje" con campo + botón está siempre abierto, a diferencia de las otras dos secciones (plegables) → ayuda en 1-2 líneas y mismo patrón plegable "Cambiar el porcentaje".
