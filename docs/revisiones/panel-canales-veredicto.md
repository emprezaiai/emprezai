# VEREDICTO revisor-visual — panel-canales
Fecha: 2026-11-09 18:00
Screenshot: docs/revisiones/panel/canales-375.png
Usabilidad: 27/40
Craft: 13/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos: 1) [Tarjeta Instagram, app/admin/(panel)/canales/page.tsx línea 120-121] "Sin clientes · 0 clientes nuevos · 0 siguen" y al pie "Cobrado este mes: $8,55": contradicción a simple vista (y el aviso de Inicio dice "sin ninguna compra") → si el cobro viene de renovaciones de meses anteriores, decirlo ("$8,55 de clientes que llegaron antes"), o no mostrar "Cobrado" en canales con 0 clientes. 2) [Coherencia con Inicio, lib/servidor/panel.ts líneas 423/432] aquí el canal se llama "Instagram" y en el aviso de Inicio "instagram" entre comillas → usar nombreCanal() en los avisos. 3) [Veredicto "Gratis" en "Afiliado: Ana", función veredicto línea 12] un afiliado cobra comisión: llamarlo "Gratis" engaña; y "Llegaron solos (sin código)" sigue con jerga → para afiliados "Pagas comisión" (o "Solo comisión"), y "Llegaron solos (sin enlace marcado)". 4) [KPI "Un cliente te deja en total", línea 67] "(tope 24)" y "estimado" sin explicación; "vuelve $0,0 por cada $1" en Instagram es ruido → "Se queda unos 10 meses en promedio" y ocultar la razón cuando no hubo clientes. 5) [Movimiento + período] las barras Gastaste/Te dejarán aparecen llenas, sin dibujarse, y las tarjetas internas de cada canal no entran escalonadas (solo la tarjeta contenedora) → animar width de las barras y stagger 60 ms por canal con reduced-motion.
