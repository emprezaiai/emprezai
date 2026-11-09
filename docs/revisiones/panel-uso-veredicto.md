# VEREDICTO revisor-visual — Panel · Uso y retención
Fecha: 2026-11-09 18:00
Screenshot: docs/revisiones/panel/uso-375.png
Usabilidad: 29/40
Craft: 13/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos: 1) [barras de "Dónde se quedan" y "El camino de venta"] En el render salen VACÍAS (solo el riel gris): Llenado (movimiento.tsx) empieza en width 0% desde el servidor y solo crece con whileInView + JS; sin JS, con JS lento o en captura de página completa, la dueña no ve ninguna barra. La clase CSS .panel-crecer (scaleX, sin JS) ya existe en globals.css y no se usa → Barra con ancho final en el HTML + .panel-crecer. 2) [camino de venta] La lectura ya dice "mejora primero la pantalla de planes", pero la fila pintada en ámbar sigue siendo "Fueron a pagar a Hotmart": el ojo va a Hotmart y el texto dice otra cosa → ámbar en "Vieron los planes" (peor.i - 1) o en las dos filas del tramo (uso/page.tsx líneas 162-171). 3) [tarjeta ¿Vuelven?] Con la etiqueta de 2 líneas reservada, las tres etiquetas de una línea dejan un hueco de ~30px antes de los porcentajes → reservar 2 líneas solo en la cuadrícula de 2 columnas, no en esta fila de 3 (prop en Dato, ui.tsx línea 148). 4) [tarjeta "Pagan y no entran"] El enlace "Ver los 10 y escribirles" se parte en dos líneas y es el único tocable de las 4 tarjetas, pero no responde al toque → que la tarjeta entera sea tocable con el href de Tarjeta (ya existe) y el texto en una línea ("Verlos y escribirles"). 5) [encabezado] Cada tarjeta mide un período distinto (hoy, 30 días, desde siempre, mes elegido) y solo el camino de venta tiene selector → etiqueta de período visible en cada tarjeta ("últimos 30 días", "desde el inicio").
