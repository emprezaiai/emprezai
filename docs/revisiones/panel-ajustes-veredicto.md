# VEREDICTO revisor-visual — panel-ajustes
Fecha: 2026-11-10 05:00
Screenshot: docs/revisiones/panel/ajustes-375.png
Usabilidad: 37/40
Craft: 16/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: LISTA
Top defectos: 1) [Lista de gastos agrupada por mes, components/admin/FormulariosAjustes.tsx] los meses anteriores siguen abiertos y la lista crecerá cada mes (ronda 6) → plegar los meses anteriores al actual mostrando solo el encabezado con su total. 2) [Fila "1 nov – 9 nov · Anuncios de noviembre"] la nota repite lo que ya dicen las fechas y parte la fila en 2 líneas → mostrar la nota solo si aporta algo distinto, truncada a 1 línea. 3) [Acciones secundarias] tachos en ink-3 sin borde, "+ Agregar un costo" / "+ Cambiar el porcentaje" en texto ink-1 y "Guardar" con borde: tres estilos de acción secundaria en una pantalla → mismo tratamiento para las acciones de lista (texto + ícono). 4) [Placeholder "La última vez: $120,00", línea 263] la sugerencia es buena, pero como placeholder desaparece al escribir y no se puede aceptar con un toque → chip "Usar $120" bajo el campo que lo rellena. 5) [Tarjeta "Impuestos"] el 10% grande en ink-1 compite en peso con el título de la pantalla; es un dato de configuración, no el héroe del negocio → text-3xl en vez de 4xl.
