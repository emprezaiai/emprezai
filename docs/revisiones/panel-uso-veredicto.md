# VEREDICTO revisor-visual — Panel · Uso y retención
Fecha: 2026-11-09 22:00
Screenshot: docs/revisiones/panel/uso-375.png
Usabilidad: 34/40
Craft: 16/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos: 1) [camino de venta, fila "Vieron los planes"] El ámbar pinta también el "94%", que es un paso BUENO (94% de quienes armaron su pieza vieron los planes); el número malo (22%) queda en gris en la fila de abajo → ámbar solo en la etiqueta de la fila de planes y, en ella, "→ solo 22% siguen a pagar"; el 94% en gris (uso/page.tsx líneas 162-171). 2) [selector de mes del camino de venta] Las flechas ← → no muestran carga al tocar (Usuarios ya usa EnlaceCarga) → EnlaceCarga en SelectorMes (ui.tsx líneas 29-38). 3) [tarjeta "Pagan y no entran"] La flecha de la tarjeta tocable queda pegada al texto de la última línea, a media altura, y no arriba a la derecha como en el resto del panel (Tarjeta con href la pone en top-4 right-3) → usar el href de Tarjeta en vez de una flecha dentro del detalle, para que todas las tarjetas tocables se vean iguales.
