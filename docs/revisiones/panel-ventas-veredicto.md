# VEREDICTO revisor-visual — panel-ventas
Fecha: 2026-11-10 05:00
Screenshot: docs/revisiones/panel/ventas-375.png
Usabilidad: 35/40
Craft: 16/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos: 1) [Tarjeta "Quién se fue y por qué", app/admin/(panel)/ventas/page.tsx línea 122] la ayuda "Separado porque se resuelve distinto: unos decidieron irse, a otros les falló el pago" se muestra aunque no haya nada que separar (todo en 0), y la tarjeta dice "0%" + "Nadie se fue este mes…" (tres frases para un cero; pedido en la ronda 6) → con todo en 0, sin ayuda: una sola línea "Nadie se fue en noviembre (0 de 27)". 2) [Tarjeta "Pruebas que pagaron 50%", línea 115] el detalle ocupa 3 líneas ("2 de 4 que terminaron (aún son pocas para sacar conclusiones)") y deja a "Suscripciones al mes" con un hueco de ~60px → "2 de 4 · aún pocas" en 1 línea. 3) [Lista "Movimientos de noviembre"] el cobro de $79,99 (plan anual) y los de $9,99 se ven iguales: no se distingue qué plan compró cada uno → añadir "Anual"/"Mensual" junto a "Cobro" en la línea secundaria. 4) [Héroe, 6 barras] "nov" solo se marca con negrita en el texto; la barra elegida ahora es igual a las demás → borde o tono ink-2 sólido en la barra del mes elegido (sin superar al dorado). 5) [Pie "1 persona tiene acceso regalado por ti: no cuentan como venta."] concordancia rota ("1 persona… no cuentan") → "no cuenta como venta" en singular.
