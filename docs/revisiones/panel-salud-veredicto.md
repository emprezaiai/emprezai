# VEREDICTO revisor-visual — Panel · Salud
Fecha: 2026-11-09 18:00
Screenshot: docs/revisiones/panel/salud-375.png
Usabilidad: 30/40
Craft: 14/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos: 1) [aviso fallido "Aviso de una compra · 6 nov, 11:36"] No dice quién compró: el "Qué hacer" manda a la dueña a buscar en Hotmart por fecha y volver a darle acceso a mano (tiene que recordar el dato de una pantalla y llevarlo a otra) → mostrar el correo del comprador del aviso (está en el payload del aviso) con "Darle acceso" que abra el formulario ya con ese correo (salud/page.tsx líneas 95-114 + webhook_fallidos en lib/servidor/panel.ts). 2) [caja negra del aviso fallido] Fondo hundido con radio de campo: a 375px parece un campo de texto o un botón y no hace nada → quitar el fondo hundido y dejarlo como fila con ícono de alerta, o hacerlo tocable de verdad (ver punto 1). 3) [tarjeta "Pagos que no se aplicaron"] "Último aviso bien: 9 nov, 11:36" suena raro y no explica el 1 de arriba → "Fallo: 6 nov · el último que entró bien: 9 nov". 4) [Errores de la app] Sigue sobrando aire al pie de la tarjeta (min-h-11 del último "Copiar el detalle" + padding de la tarjeta) → pb-0 en la tarjeta o min-h-10 en el último botón. 5) [encabezado "Últimos 7 días"] Sin forma de ver la semana anterior para saber si el error de Mi Empresa es nuevo o viene de antes (regla UX 13) → flechas de semana o "vs semana pasada" en "Errores de la semana".
