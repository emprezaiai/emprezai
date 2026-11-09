# VEREDICTO revisor-visual — panel-inicio
Fecha: 2026-11-09 21:00
Screenshot: docs/revisiones/panel/inicio-375.png
Usabilidad: 32/40
Craft: 15/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos: 1) [Tarjeta "Ingreso mensual recurrente", captura 1440, components/admin/ui.tsx línea 70] el chevron absoluto (top-4 right-3) se monta sobre la última letra de la etiqueta ("recurrente›"): las 4 tarjetas no reservan espacio para la flecha → pr-7 en el contenido de la tarjeta con href (o chevron en flujo junto a la etiqueta). 2) [Misma tarjeta, app/admin/(panel)/page.tsx líneas 118-122] "Ingreso mensual recurrente / A precio de lista; el anual cuenta 1/12 por mes" sigue siendo vocabulario de finanzas para una dueña no técnica (defecto de la ronda 2 sin corregir) → "Lo que cobras cada mes" + "Si todos siguen pagando; el plan anual cuenta como 1/12". 3) [Gráfico "Últimos 6 meses", components/admin/Graficos.tsx línea 28] la barra de lo facturado (surface-raised-2 sobre la tarjeta) apenas se distingue del fondo y no tiene etiqueta; la leyenda sigue siendo una frase (ronda 2 sin corregir) → barra de facturado en ink-3 al 35-40% y leyenda con 2 muestras de color. 4) [Etiquetas de Dato, ui.tsx línea 148] min-h-[2lh] deja un hueco de una línea bajo las etiquetas cortas ("Se fueron este mes", "Clientes activos hoy") y el número no queda alineado con su etiqueta → reservar las 2 líneas solo en la grilla (alineando por fila con grid-rows subgrid) o acortar todas las etiquetas a 1 línea. 5) [Movimiento] cambiar de mes o de sección no tiene transición ni indicador inmediato en la flecha tocada (solo aparece el esqueleto de loading.tsx) → estado pendiente en SelectorMes (useLinkStatus/spinner inline en la flecha) y fundido corto del contenido.
