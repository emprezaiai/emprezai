# VEREDICTO revisor-visual — Panel · Usuarios
Fecha: 2026-11-10 02:00
Screenshot: docs/revisiones/panel/usuarios-375.png
Usabilidad: 36/40
Craft: 16/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: LISTA
Top defectos: 1) [selector de orden a 375px] El select nativo se estira a lo ancho de la tarjeta: el ícono ↕ y "Más recientes" quedan al centro y la flecha ▾ pegada al borde derecho, separados por ~90px; se lee como una barra y no como el control compacto que se buscaba → w-auto en el select (o justify-start con el texto junto a la flecha) (components/admin/OrdenUsuarios.tsx líneas 14 y 23). 2) [selector de orden] "Ordenando…" solo existe como cambio de ícono (spinner de 14px), sin texto visible → mostrar "Ordenando…" junto al spinner mientras dura la transición (OrdenUsuarios.tsx línea 15). 3) [etiqueta del orden] "Ordenar la lista por" está solo para lectores de pantalla; con el ícono basta, pero una etiqueta visible corta ("Orden:") en ink-3 lo hace evidente para la dueña. Ninguno bloquea.
