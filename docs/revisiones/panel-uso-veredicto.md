# VEREDICTO revisor-visual — Panel · Uso y retención
Fecha: 2026-11-09 20:00
Screenshot: docs/revisiones/panel/uso-375.png
Usabilidad: 31/40
Craft: 15/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos: 1) [encabezado "HOY Y ÚLTIMOS 30 DÍAS"] No es cierto para toda la pantalla: ¿Vuelven? mide desde el inicio, "Llegaron al día 30" es acumulado y el camino de venta es el mes elegido → quitar el período global (cada tarjeta ya dice el suyo en la ayuda) o poner "Cada tarjeta indica su período" (uso/page.tsx, Encabezado). 2) [tarjeta "Pagan y no entran"] "tócala para escribirles" promete escribir, pero lleva a la lista filtrada → "tócala para verlos" (o que la lista filtrada muestre el botón de escribir en cada fila). 3) [4 tarjetas de arriba] Reservar 2 líneas de etiqueta en todas deja ~25px de aire muerto entre "Activos hoy"/"Activación" y su número → reservar solo cuando alguna etiqueta de la fila se parte, o etiquetas de una línea ("Llegaron al día 30" ya lo es: con eso ninguna lo necesita) (Dato en ui.tsx línea 148). 4) [Piezas armadas] Sigue sin comparación (pedido en ronda 1): 308 piezas no dice si es bueno o malo → "↑/↓ x% vs los 30 días anteriores" junto al total.
