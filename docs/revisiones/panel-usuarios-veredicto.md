# VEREDICTO revisor-visual — Panel · Usuarios
Fecha: 2026-11-10 00:00
Screenshot: docs/revisiones/panel/usuarios-375.png
Usabilidad: 35/40
Craft: 16/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos: 1) [chips "Ordenar"] Lucen idénticos a los chips de filtro (misma píldora con borde, mismo estado activo): en pantalla hay dos chips "activos" iguales ("Todos 65" y "Más recientes") que hacen cosas distintas (uno filtra, otro ordena) → orden como control segmentado sin borde (fondo hundido con el activo elevado) o como texto con subrayado, distinto de los filtros (usuarios/page.tsx, bloque Ordenar). 2) [fila "Ordenar:" a 375px] Se parte: "Hace más que no entran" baja a una segunda fila que arranca bajo la etiqueta, y la fila se ve desordenada → etiqueta encima de las opciones, o textos cortos en una sola fila ("Recientes · Sin entrar · Más piezas"). 3) [pantalla de error compartida] app/admin/(panel)/error.tsx dice "No pudimos cargar estos números" también en Usuarios y en la ficha, donde no hay números → "No pudimos cargar esta sección" (o el título según la ruta) (error.tsx línea 21).
