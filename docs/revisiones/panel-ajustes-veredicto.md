# VEREDICTO revisor-visual — panel-ajustes
Fecha: 2026-11-09 21:00
Screenshot: docs/revisiones/panel/ajustes-375.png
Usabilidad: 31/40
Craft: 14/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos: 1) [Movimiento, components/admin/FormulariosAjustes.tsx líneas 17-24, 70-79, 123/170] la barra "Quitado · Deshacer", los avisos de resultado y la fila que se quita aparecen y desaparecen de golpe (defecto de la ronda 2 sin corregir) → AnimatePresence con fundido + altura de 200 ms en filas, barra y aviso (respetando reduced-motion). 2) [Formulario de gasto, líneas 219-226] "Hasta" antes de "Desde" solo se rechaza en el servidor; el campo no lo impide → min={desde} en "Hasta" (controlado) y mensaje inline antes de enviar. 3) [Lista de gastos, líneas 173-190] los gastos de todos los meses van en una sola lista sin agrupar: con unos meses de uso crecerá sin control (regla 14) → agrupar por mes ("Noviembre · $300") con los meses anteriores plegados. 4) [Formulario "Costos fijos", líneas 150-160] el formulario de agregar está siempre abierto debajo de la lista (2 campos + botón ocupan ~300px) y alarga la pantalla aunque casi nunca se use → botón "Agregar un costo" que despliega el formulario (igual para el gasto). 5) [Placeholders, líneas 157/217/229] "Ej.: 20" / "Ej.: 150" en ink-3 dentro de un campo de fondo hundido siguen teniendo poco contraste de "vacío" frente a un valor real → placeholder en itálica o al 70% de ink-3 para que no se confunda con un dato cargado.
