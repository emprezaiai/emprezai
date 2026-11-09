# VEREDICTO revisor-visual — panel-canales
Fecha: 2026-11-09 21:00
Screenshot: docs/revisiones/panel/canales-375.png
Usabilidad: 30/40
Craft: 14/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos: 1) [Barras "Gastaste / Te dejarán" de Instagram y TikTok, components/admin/movimiento.tsx Llenado] en la captura salen vacías (solo el riel): el gráfico que justifica el veredicto de cada canal no se ve; Llenado arranca en 0% desde el servidor y solo crece con whileInView → animación CSS que ya trae el ancho final en el HTML, y recapturar. 2) [Tarjeta Instagram, app/admin/(panel)/canales/page.tsx líneas 89-100] el veredicto "Sin clientes nuevos" en text-xl ocupa más de media fila y aplasta la columna izquierda a 1-2 palabras por línea ("0 clientes / nuevos · 0 / siguen") → veredicto como chip debajo del nombre (o en su propia fila) y el detalle a ancho completo. 3) [Línea "vuelven $0,00 por cada $1", línea 99] se sigue mostrando en el canal sin clientes (pedido en la ronda 2): es ruido → ocultar la razón cuando clientes = 0. 4) [KPI "Un cliente te deja en total", línea 61-69] a ancho completo, el min-h de 2 líneas de la etiqueta deja un hueco vacío entre etiqueta y número; y "estimado" sigue sin explicar → etiqueta de 1 línea sin reserva en tarjetas col-span-2 y "estimado según quién se fue el mes pasado". 5) [Estado vacío, línea 81] "agrega ?sck=tiktok… al final de tu enlace de Hotmart" es una instrucción técnica para la dueña → "Pide a quien te ayuda con la app un enlace distinto para cada lugar donde publicas" o enlace a una guía paso a paso.
