# VEREDICTO revisor-visual — panel-ventas
Fecha: 2026-11-09 21:00
Screenshot: docs/revisiones/panel/ventas-375.png
Usabilidad: 31/40
Craft: 14/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos: 1) [Tarjeta "Tus clientes hoy", components/admin/movimiento.tsx Llenado líneas 51-62] en la captura las 4 barras salen VACÍAS (solo el riel): Llenado arranca en width 0% desde el servidor y solo crece con whileInView, así que fuera de pantalla, sin JS o en un teléfono lento no muestra el dato → animar con CSS (scaleX desde 0 con animation-fill both, como .panel-crecer) para que el HTML ya traiga el ancho final, y recapturar. 2) [Lectura "26 ya no tienen acceso… Verlos", app/admin/(panel)/ventas/page.tsx línea 166] el enlace va a ?estado=expired (solo vencidos), pero el texto cuenta también cancelaciones y reembolsos: la lista que se abre no tendrá 26 → usar ?estado=sin-acceso, que ya existe en FILTROS_USUARIOS. 3) [Tarjeta "Ingreso mensual recurrente", línea 98] jerga financiera sin traducir (igual que en Inicio) → "Lo que cobras cada mes". 4) [Tarjeta "Pruebas que pasaron a pago 50%", línea 110] se pinta en VERDE de éxito con solo 4 pruebas terminadas: una muestra tan chica no permite celebrar → color neutro y nota "pocas pruebas aún para sacar conclusiones" por debajo de ~10. 5) [Gráfico de 6 meses del héroe] las barras de los meses sin elegir (neutra al 55%) tienen poco contraste contra el riel y "nov" en verde no explica por qué verde (verde = progreso hecho en la ficha) → mes elegido en ink-1/dorado tenue y riel más oscuro.
