# VEREDICTO revisor-visual — panel-ajustes
Fecha: 2026-11-10 03:00
Screenshot: docs/revisiones/panel/ajustes-375.png
Usabilidad: 35/40
Craft: 16/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos: 1) [Estados vacíos, components/admin/FormulariosAjustes.tsx líneas 146 y 204] "Aún no anotaste costos fijos." / "Aún no anotaste gastos en anuncios." no enseñan qué poner ni por qué importa (heurística 10) → "Anota lo que pagas cada mes (hosting, base de datos, dominio). Sin esto, tu ganancia real aparece más alta de lo que es." y el formulario abierto. 2) [Formulario de gasto, heurística 7 verificada en código] ningún valor sugerido a partir de lo ya cargado: al elegir TikTok no se propone el monto del mes anterior ($120) → placeholder o valor sugerido con el último gasto del canal elegido. 3) [Lista de gastos agrupada por mes] los meses anteriores siguen abiertos y la lista crecerá mes a mes → plegar los meses anteriores al actual (mostrar solo el encabezado con su total). 4) [Fila de gasto "1 nov – 9 nov · Anuncios de noviembre"] la nota repite la fecha y parte en 2 líneas → nota solo si aporta algo distinto de las fechas (o truncada a 1 línea). 5) [Botones de quitar] los tachos van en ink-3 sin borde, mientras "Agregar un costo" y "Cambiar el porcentaje" son texto con "+": tres estilos de acción secundaria en una pantalla → mismo tratamiento (texto + ícono, ink-2) para las acciones de lista.
