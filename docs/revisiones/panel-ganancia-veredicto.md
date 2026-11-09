# VEREDICTO revisor-visual — panel-ganancia
Fecha: 2026-11-10 07:00
Screenshot: docs/revisiones/panel/ganancia-375.png
Usabilidad: 36/40
Craft: 16/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: LISTA
Top defectos: 1) [Borde superior de "Te quedaron limpios", components/admin/ui.tsx FilaMonto] el borde grueso del total termina donde empieza la columna reservada del chevron y el divisor fino sigue hasta el borde: se ven dos líneas de largo distinto encimadas → un solo borde a ancho completo (en el contenedor, no en la fila). 2) [Chevrons de las filas tocables] van centrados en la altura de la fila (en "Impuestos" y "Servidores", que tienen nota de 2 líneas, quedan a media altura de la nota, no junto al monto) → alinear el chevron con la línea del monto (items-start + mt). 3) [Leyenda bajo la barra, app/admin/(panel)/ganancia/page.tsx líneas 77-84] los puntos de Hotmart, Impuestos e IA siguen viéndose del mismo gris a 8px → punto de 10px y grises más separados. 4) [Lectura "Tu mayor costo es servidores…"] repite el 33% de la leyenda que está justo encima → convertirla en consejo accionable o quitarla. 5) [Fila "Comisión de Hotmart"] única fila de costo sin nota → "12% · lo informó Hotmart" para un ritmo parejo.
