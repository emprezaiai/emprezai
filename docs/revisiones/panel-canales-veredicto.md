# VEREDICTO revisor-visual — panel-canales
Fecha: 2026-11-10 05:00
Screenshot: docs/revisiones/panel/canales-375.png
Usabilidad: 35/40
Craft: 15/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos: 1) [Título del aviso rojo "Los anuncios te cuestan más de lo que dejan", app/admin/(panel)/canales/page.tsx línea 75] en la captura sale casi invisible: texto oscuro sobre el fondo rojo oscuro (contraste muy por debajo de 4.5:1); es el mensaje más importante de la pantalla y no se lee. El <strong> no declara color y algo en esa cascada lo oscurece → poner text-ink-1 explícito en el <strong>, verificar el color computado en el navegador y recapturar. 2) [Tarjeta "Llegaron por su cuenta"] "Sin gasto" ahora alinea bien, pero en ink-3 sin borde parece texto deshabilitado frente a las otras pastillas → borde de 1px como "Paga por venta" para que las 4 etiquetas sean del mismo sistema. 3) [Nota final "Una suscripción casi nunca se paga en el primer mes…"] 3 líneas al pie que matizan el aviso rojo de arriba, lejos de él (pedido en la ronda 6) → moverla al aviso como última línea corta o quitarla. 4) [KPI "Costo por cliente $100,00"] promedia Instagram, que no trajo clientes; el aviso ya lo explica, pero el número sigue siendo el más grande de la primera vista → detalle "TikTok: $46,67 · Instagram: sin clientes". 5) [Tarjeta TikTok] "cada uno costó $46,67" parte en 2 líneas con el número solo en la segunda → $46,67 con whitespace-nowrap junto a "cada uno costó".
