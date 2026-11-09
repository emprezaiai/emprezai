# VEREDICTO revisor-visual — Panel · Usuarios
Fecha: 2026-11-09 18:00
Screenshot: docs/revisiones/panel/usuarios-375.png
Usabilidad: 30/40
Craft: 14/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos: 1) [chips de filtro] Siguen sin decir cuántas personas hay en cada estado: para saber cuántos pagan hay que tocar "Pagando" y leer el subtítulo → contador en cada chip ("Pagando 12", "En prueba 10") desde leerUsuarios (usuarios/page.tsx + ChipFiltro.tsx). 2) [botón "Dar acceso a alguien" a 1440px] El summary es flex de bloque con sm:w-auto, que en un bloque sigue ocupando todo el ancho: en computador es una barra dorada de ~740px que domina la pantalla → inline-flex en sm (usuarios/page.tsx línea 62). 3) [buscador + chip "Todos"] Una búsqueda no se puede limpiar: "Todos" conserva q en el enlace y no hay botón para borrar el texto → botón "×" dentro del campo cuando hay búsqueda y que "Todos" quite también q (enlace() en usuarios/page.tsx). 4) [estado vacío] Dice "si das acceso a alguien abajo" pero el formulario ahora está arriba → "con el botón de arriba" (usuarios/page.tsx línea 104). 5) [botón "Buscar"] Con next/form no hay señal de carga al enviar la búsqueda (los chips sí la tienen) → useFormStatus en el botón con spinner/"Buscando…".
