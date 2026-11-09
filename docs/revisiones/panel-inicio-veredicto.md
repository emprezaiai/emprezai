# VEREDICTO revisor-visual — panel-inicio
Fecha: 2026-11-10 01:00
Screenshot: docs/revisiones/panel/inicio-375.png
Usabilidad: 33/40
Craft: 16/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos: 1) [Menú de secciones, components/admin/MarcoPanel.tsx línea 52] los enlaces del menú no conservan ?mes: si la dueña mira octubre en Inicio y toca Ventas, vuelve sola a noviembre y tiene que recordar y renavegar (heurística 6) → propagar el mes elegido a las secciones con selector (useSearchParams en ListaSecciones). 2) [Selector de mes, components/admin/ui.tsx SelectorMes] no hay atajo para quien lo usa en el computador (heurística 7: verificado en código, no existe ningún keydown en el panel) → teclas ← / → para cambiar de mes cuando el foco no está en un campo. 3) [Avisos, ui.tsx BannerAvisos líneas 204-218] "Por qué importa" (ink-2 semibold con chevron) pesa casi igual que "Ver canales" subrayado: dos acciones del mismo nivel en cada aviso → "Por qué importa" en ink-3 regular. 4) [Tarjeta "Suscripciones al mes", app/admin/(panel)/page.tsx línea 122] "Lo que pagan tus 29 clientes cada mes" no es exacto: 10 pagan una vez al año → "Lo que suman tus 29 suscripciones por mes". 5) [Pie del gráfico] la leyenda va centrada y la lectura alineada a la izquierda justo debajo: dos alineaciones en 40px → leyenda alineada a la izquierda (o arriba del gráfico, junto al título).
