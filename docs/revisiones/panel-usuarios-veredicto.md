# VEREDICTO revisor-visual — Panel · Usuarios
Fecha: 2026-11-09 20:00
Screenshot: docs/revisiones/panel/usuarios-375.png
Usabilidad: 32/40
Craft: 15/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos: 1) [lista a 375px] 25 filas por página = unos 2.600px de scroll seguido sin agrupar (falla el gate "≤4-5 ítems antes de agrupar"); la dueña no tiene forma de ordenar por "última vez que entró" o "piezas" → POR_PAGINA 10-12 en móvil o subtítulos por estado dentro de la lista, más un orden "Más recientes / Hace más que no entran" (usuarios/page.tsx + leerUsuarios en lib/servidor/panel.ts). 2) [chips principales] "Pagaron sin acceso 0" ocupa uno de los 5 lugares visibles estando en cero, mientras "Pagan y no entran" (el que pide acción hoy) queda escondido en "Más filtros" → poner "Pagan y no entran" entre los principales y atenuar o mover a "Más filtros" el chip que esté en 0 (PRINCIPALES en usuarios/page.tsx línea 30). 3) [paginación "Siguiente"/"Anterior"] Sin señal de carga al tocar (los chips y el buscador sí la tienen) → mismo indicador useLinkStatus de ChipFiltro.tsx en los enlaces de página (usuarios/page.tsx líneas 135-155).
