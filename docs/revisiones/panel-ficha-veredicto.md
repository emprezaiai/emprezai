# VEREDICTO revisor-visual — Panel · Ficha de una persona
Fecha: 2026-11-09 18:00
Screenshot: docs/revisiones/panel/ficha-375.png
Usabilidad: 31/40
Craft: 14/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos: 1) [Acciones vs aviso ámbar] La pantalla pide "Escríbele hoy a Camila", pero el único botón dorado es "Copiar enlace de acceso", que no es lo que hay que hacer con alguien que ya tiene acceso y no entra; "Escribirle por correo" es un enlace subrayado pequeño → cuando es "paga y no entra", el botón principal es "Escribirle por correo" (con asunto y saludo prellenados en el mailto) y "Copiar enlace" pasa a secundario (usuarios/[id]/page.tsx líneas 37-44 + AccionesUsuario.tsx línea 149). 2) [Extender acceso a 375px] Los tres botones se parten en 2+1 y "+1 año" queda solo en la segunda fila → fila de 3 segmentos iguales (grid-cols-3) o tamaños más compactos (AccionesUsuario.tsx línea 161). 3) [tarjeta héroe] Se dejó de animar todo número: "Hace 87 días" es texto fijo y las cifras de la lista (30 piezas, $0,17) no cuentan → Cuenta en los días ("Hace <Cuenta valor={87}/> días"). 4) [botón desactivado "Reenviar acceso por correo"] Al 50% de opacidad y ocupando una fila completa para algo que no se puede usar → ocultarlo mientras no haya correos conectados y dejar solo la nota en una línea. 5) [mailto] "Escribirle por correo" abre un correo en blanco → asunto y primer renglón prellenados ("Camila, ¿cómo vas con tu empresa?"), para que la dueña solo tenga que enviar.
