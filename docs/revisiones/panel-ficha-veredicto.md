# VEREDICTO revisor-visual — Panel · Ficha de una persona
Fecha: 2026-11-09 20:00
Screenshot: docs/revisiones/panel/ficha-375.png
Usabilidad: 32/40
Craft: 14/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos: 1) [Extender acceso a 375px] Con grid-cols-3 el texto se parte DENTRO de las píldoras: "+7 / días" y "+1 / mes" en dos renglones, mientras "+1 año" queda en uno (tres botones iguales que se ven distintos) → whitespace-nowrap en la etiqueta y ocultar el ícono por debajo de sm, o etiquetas "7 días / 1 mes / 1 año" sin el "+" (AccionesUsuario.tsx líneas 168-171). 2) [Acciones] La nota "Reenviar por correo se activa cuando conectemos tus correos. Mientras, usa 'Copiar enlace de acceso'" habla de un botón que ya no se muestra → quitar la nota o dejar "Cuando conectemos tus correos aparecerá Reenviar por correo" en una línea (AccionesUsuario.tsx línea 165). 3) [aviso ámbar] "Copiar correo" queda solo en su propia fila bajo el botón dorado, con sangría y aire de sobra; el bloque se ve desordenado → ponerlo en la misma fila del botón (flex-wrap items-center gap-3) (usuarios/[id]/page.tsx, bloque del aviso).
