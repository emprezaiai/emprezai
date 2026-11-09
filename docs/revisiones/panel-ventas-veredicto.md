# VEREDICTO revisor-visual — panel-ventas
Fecha: 2026-11-09 23:00
Screenshot: docs/revisiones/panel/ventas-375.png
Usabilidad: 30/40
Craft: 15/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos: 1) [Tarjeta "Entra cada mes $256,47" justo debajo de "Lo que entró en noviembre $139,93", app/admin/(panel)/ventas/page.tsx líneas 66 y 98-103] el renombre dejó dos etiquetas casi iguales ("entró" / "entra") con números distintos y, a diferencia de Inicio, aquí no hay aclaración ("19 mensual · 10 anual"): la dueña lee una contradicción → misma etiqueta y mismo detalle que Inicio ("Si todos siguen pagando…"), o "Cobrarías cada mes si nadie cancela". 2) [Lectura "26 ya no tienen acceso…", línea 163-167] al quitar "Verlos" el grupo más grande de la tarjeta (26 personas, potencial de recuperación) ya no lleva a ninguna parte → enlace a /admin/usuarios?estado=sin-acceso con el texto "Ver los 26" (el filtro existe en FILTROS_USUARIOS; si su conteo difiere, alinear la consulta, no quitar el camino). 3) [Chips "Todos / Solo reembolsos", líneas 173-190] siguen siendo Link sin estado de carga, mientras ChipFiltro (components/admin/ChipFiltro.tsx) ya muestra spinner al tocar → usar ChipFiltro con la cuenta de cada filtro. 4) [Gráfico de 6 meses del héroe] el mes elegido va en VERDE (la ficha reserva el verde a progreso hecho) y no hay variación mes contra mes en la barra → mes elegido en ink-1 o dorado tenue. 5) [Tarjeta "Pruebas que pasaron a pago 50%"] con 4 pruebas ya no se pinta verde, pero tampoco dice que la muestra es chica → detalle "2 de 4 (aún pocas para sacar conclusiones)".
