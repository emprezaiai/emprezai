# VEREDICTO revisor-visual — Panel · Ficha de una persona
Fecha: 2026-11-09 22:00
Screenshot: docs/revisiones/panel/ficha-375.png
Usabilidad: 35/40
Craft: 15/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos: 1) [Acciones + Historial] La tarjeta promete "Cada acción queda registrada con fecha y hora", pero en la ficha no se ve ese registro: el Historial solo muestra cambios de estado, así que la dueña no sabe si ya le extendió el acceso o le copió el enlace ayer → sumar al Historial las acciones del panel sobre esta persona ("Le extendiste 1 mes · 9 nov, 18:02") desde la tabla de auditoría, o quitar la frase (usuarios/[id]/page.tsx líneas 129-152 + panel_ficha). 2) [tarjeta Acciones] Sobran unos 60px de aire bajo "Quitar acceso" (min-h-11 + mt-4 + padding de la tarjeta): la tarjeta se ve medio vacía al pie → quitar el margen inferior del último bloque o bajar el p-4 inferior (AccionesUsuario.tsx, bloque conAcceso). 3) [Pagos] Con el acceso vigente hasta el 27 nov, no dice cuándo es el próximo cobro ni si la renovación está activa → fila final "Próxima renovación: 25 nov" (o "Canceló: no se renueva") arriba del total.
