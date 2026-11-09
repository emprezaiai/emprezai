# VEREDICTO revisor-visual — panel-canales
Fecha: 2026-11-10 07:00
Screenshot: docs/revisiones/panel/canales-375.png
Usabilidad: 36/40
Craft: 16/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: LISTA
Top defectos: 1) [KPI "Costo por cliente $100,00", app/admin/(panel)/canales/page.tsx líneas 51-59] el detalle pasó a 3 líneas ("De anuncios, promedio de todos los canales") y sigue promediando un canal sin clientes; es el número más grande de la primera vista y no aplica a TikTok → detalle de 1 línea "TikTok: $46,67 · Instagram: sin clientes". 2) [Tarjeta "Llegaron por su cuenta"] la pastilla "Sin gasto" baja a su propia línea bajo el nombre, mientras las demás van a la derecha en la misma fila → pastillas en una fila propia en todas las tarjetas, o nombre que permita la pastilla a la derecha (truncar o text-base). 3) [Aviso rojo] el título ocupa 2 líneas a 375 → "Los anuncios cuestan más de lo que dejan" o "Instagram hunde tu promedio" (1 línea). 4) [Tarjeta TikTok] "cada uno costó $46,67" parte con el número solo en la segunda línea → whitespace-nowrap en "costó $46,67". 5) [KPI "Lo que deja un cliente"] el detalle de 2 líneas ("Estimado: se queda unos 10 meses, según cuántos se van cada mes") → "Estimado · se queda ~10 meses".
