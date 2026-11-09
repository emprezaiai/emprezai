# VEREDICTO revisor-visual — panel-ganancia
Fecha: 2026-11-10 03:00
Screenshot: docs/revisiones/panel/ganancia-375.png
Usabilidad: 35/40
Craft: 16/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos: 1) [Filas Impuestos / IA / Servidores, components/admin/ui.tsx FilaMonto línea 252] el Link con -mx-2 px-2 hace que el divisor de esas tres filas sea 8px más ancho por cada lado que el de "Comisión de Hotmart", con las puntas redondeadas visibles en la captura; y nada indica que se pueden tocar (sin flecha, sin subrayado, solo hover en escritorio) → divisor fuera del Link (en el <div> contenedor) y un chevron ink-3 a la derecha del monto, igual que en las tarjetas tocables. 2) [Ayuda "En dólares. Todo es real, salvo lo marcado como estimado.", app/admin/(panel)/ganancia/page.tsx línea 101] sigue ocupando 2 líneas para algo que ya dice la fila estimada (ronda 5) → quitarla. 3) [Leyenda bajo la barra] los puntos de Hotmart, Impuestos e IA siguen viéndose del mismo gris a 8px → punto de 10px y separar más los dos grises intermedios. 4) [Línea "Sin devoluciones ni afiliados este mes"] queda debajo del total dorado, como una nota suelta después del resultado → ponerla antes del total (debajo de la última fila de costo). 5) [Enlace "Cambiar impuestos o costos fijos"] fuera de la tarjeta, flotando sobre un hueco de ~150px al pie → dentro de la tarjeta, bajo el total, o quitarlo ahora que las filas ya llevan a Ajustes.
