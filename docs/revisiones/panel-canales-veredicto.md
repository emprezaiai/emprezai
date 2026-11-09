# VEREDICTO revisor-visual — panel-canales
Fecha: 2026-11-09 23:00
Screenshot: docs/revisiones/panel/canales-375.png
Usabilidad: 32/40
Craft: 15/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos: 1) [KPI "Un cliente te deja en total", ancho completo, components/admin/ui.tsx línea 148] el min-h-[2lh] de la etiqueta sigue dejando una línea vacía entre la etiqueta y $72,90 (pedido en la ronda 3) → reservar las 2 líneas solo cuando la tarjeta comparte fila (prop alinear) o etiqueta sin min-h en col-span-2. 2) [Aviso rojo + tarjeta TikTok, app/admin/(panel)/canales/page.tsx líneas 71-75] el aviso dice "cada cliente de anuncios te cuesta más de lo que deja ($100 vs $72,90)", pero TikTok, el único canal con clientes, cuesta $46,67 por cliente y deja $219 contra $140: el promedio lo hunde Instagram con 0 clientes, y la dueña podría cortar también TikTok → que el aviso nombre al culpable ("Instagram: $160 sin clientes nuevos; TikTok sí se paga") en vez del promedio general. 3) [Veredicto "Gana poco" de TikTok en ámbar] junto a una barra verde "Te dejarán $219 > $140": color de alerta para un canal que recupera la inversión → "Se paga (1,6×)" en neutro/verde tenue, y ámbar solo por debajo de 1×. 4) [Fila de nombre + veredicto, líneas 88-91] el veredicto en text-lg extrabold pesa más que el nombre del canal (text-base) → mismo tamaño, veredicto en peso semibold. 5) [Movimiento] los canales entran escalonados y las barras crecen; falta transición al cambiar de mes → fundido corto del contenido (reduced-motion).
