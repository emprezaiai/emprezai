# VEREDICTO revisor-visual — Panel · Uso y retención
Fecha: 2026-11-09 16:00
Screenshot: docs/revisiones/panel/uso-375.png
Usabilidad: 29/40
Craft: 13/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos: 1) [lectura al pie de "El camino de venta"] Manda a arreglar el lugar equivocado: dice que la gente se pierde en "fueron a pagar a hotmart", pero la caída (100 → 22) ocurre EN la pantalla de planes; la dueña va a culpar a Hotmart. Además "hotmart" sale en minúscula por el toLowerCase() → nombrar el paso de origen ("entre ver los planes e ir a pagar: solo sigue el 22% → mejora la pantalla de planes") sin pasar a minúsculas (uso/page.tsx línea 168) y marcar en ámbar la fila "Vieron los planes". 2) [2ª fila de tarjetas a 375px] "Terminaron los 30 días" se parte en dos renglones y su "19" queda ~25px más abajo que el "10" de al lado → etiqueta corta ("Terminaron la ruta") o reservar 2 líneas de etiqueta en Dato (ui.tsx) para alinear los números. 3) [tarjeta "Dónde se quedan"] Es la única sin lectura: el dato importante (48% se queda en la semana 1, y casi nadie está en 2-3) no se dice → Lectura "La mitad se queda en la semana 1: revisa los días 2 a 7" como en ¿Vuelven?. 4) [barras de "Dónde se quedan" y del camino de venta] Las barras de progreso son estáticas (Barra en ui.tsx no anima) mientras el gráfico sí crece → animar el ancho de 0 al valor con stagger de 60ms y reduced-motion. 5) [todo el panel] Entrada (movimiento.tsx) renderiza en el servidor con opacity:0: en un celular lento el contenido ya llegado queda invisible hasta que carga el JS → animar solo transform o usar initial={false} en la primera carga del servidor.
