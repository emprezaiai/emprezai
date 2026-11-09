# VEREDICTO revisor-visual — panel-canales
Fecha: 2026-11-10 03:00
Screenshot: docs/revisiones/panel/canales-375.png
Usabilidad: 35/40
Craft: 15/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos: 1) [Tarjeta "Llegaron por su cuenta", app/admin/(panel)/canales/page.tsx líneas 14 y 94] "Sin gasto" no lleva fondo pero sí px-2.5: al bajar de línea (el nombre es largo) queda corrido 10px a la derecha del borde del texto, flotando sin alinearse con nada → sin padding cuando no hay fondo/borde (o pill con borde como "Paga por venta"), y gap-y-1 en la fila. 2) [Tarjeta Instagram, líneas 106-115] la fila "Te dejarán $0" con el riel vacío sigue ahí (ronda 5): repite el veredicto "Sin clientes nuevos" → ocultar la fila cuando valor = 0. 3) [Aviso rojo, líneas 71-75] 4 líneas de texto denso en ink-1 sin jerarquía interna; el "qué hacer" ("baja el gasto en Instagram") va al medio → título de 1 línea ("Instagram hunde tu promedio") + "Baja el gasto ahí primero; TikTok sí se paga." 4) [KPI "Costo por cliente $100,00"] promedia un canal con 0 clientes; el número que la dueña necesita es el de los canales que traen gente → detalle "TikTok: $46,67". 5) [Nota final "Una suscripción casi nunca se paga en el primer mes…"] 3 líneas al pie que contradicen en tono al aviso rojo de arriba → moverla dentro del aviso como segunda frase, o quitarla.
