# VEREDICTO revisor-visual — Panel · Salud
Fecha: 2026-11-09 22:00
Screenshot: docs/revisiones/panel/salud-375.png
Usabilidad: 32/40
Craft: 14/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos: 1) [tarjeta "Pagaron sin acceso" vs aviso fallido] Contradicción a la vista: la tarjeta dice "0 · Todos recibieron su acceso" y unos centímetros más abajo rocio.prueba@ejemplo.com compró el 6 nov y aparece "Todavía sin acceso" (no cuenta porque su aviso falló y no existe como usuaria) → sumar a pagaron_sin_acceso los avisos de compra fallidos sin perfil con acceso, y que la tarjeta diga "1 · compró y no tiene acceso" con enlace al aviso (salud/page.tsx líneas 66 y 167-182). 2) [bloque del aviso fallido] Espaciado roto a 375px: "Copiar correo" solo en una fila, ~40px vacíos y "Darle acceso aquí" en otra, con sangría distinta a la del correo → una sola fila "Darle acceso aquí · Copiar correo" (flex-wrap gap-x-4) alineada con el texto del aviso (salud/page.tsx líneas 117-129). 3) ["Qué hacer" de Hotmart] Repite lo que ya hacen los botones ("copia su correo y dale acceso tú"), y "si en un día sigue sin acceso" ya se ve en el estado de la fila → acortarlo a una línea que diga solo lo que los botones no dicen (qué pasa si Hotmart lo reintenta después, verificado contra el comportamiento real del webhook). 4) [tarjeta "Errores (7 días)"] "Más que la semana pasada (0)" se lee raro → "La semana pasada: 0".
