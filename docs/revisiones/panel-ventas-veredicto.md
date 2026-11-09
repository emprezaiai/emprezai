# VEREDICTO revisor-visual — panel-ventas
Fecha: 2026-11-10 01:00
Screenshot: docs/revisiones/panel/ventas-375.png
Usabilidad: 32/40
Craft: 16/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos: 1) [Lista "Movimientos de noviembre", app/admin/(panel)/ventas/page.tsx línea 62] se trae hasta 50 cobros y se cortan en 12 sin avisar: en un mes real con más ventas, el título promete "Movimientos de noviembre" y faltan filas sin que la dueña lo sepa → "Mostrando 12 de 37 · Ver todos" (paginar o expandir). 2) [Menú de secciones, components/admin/MarcoPanel.tsx línea 52] al cambiar de sección se pierde el mes elegido (heurística 6) y no hay atajo de teclado ← / → para el mes (heurística 7, verificado: no hay keydown en el panel) → propagar ?mes en el menú y teclas de flecha en SelectorMes. 3) [Tarjeta "Pruebas que pagaron 50%", línea 115] ya no se pinta verde con 4 pruebas, pero tampoco avisa que la muestra es chica (ronda 4) → "2 de 4 que terminaron · aún pocas para sacar conclusiones" por debajo de 10. 4) [Gráfico de 6 meses del héroe, línea 90] el mes elegido sigue en VERDE (la ficha reserva el verde al progreso hecho) y los demás en gris: el color no significa "bien" aquí → mes elegido en ink-1 (o dorado tenue, porque es el dato héroe). 5) [Lectura de "Tus clientes hoy", línea 169] el enlace "Verlos" está al final de una frase larga en caption → convertirlo en acción clara: "Ver los 26 y escribirles" en su propia línea.
