# VEREDICTO revisor-visual — panel-ventas
Fecha: 2026-11-09 18:00
Screenshot: docs/revisiones/panel/ventas-375.png
Usabilidad: 27/40
Craft: 14/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos: 1) [Tarjeta héroe "Lo que entró en noviembre", app/admin/(panel)/ventas/page.tsx líneas 79-83] el gráfico debajo de $139,93 rotula en dorado OTRA cosa ("lo que quedó sin costos fijos": nov $108) y deja sin etiqueta la barra que sí corresponde al héroe; además es visualmente idéntico al de Inicio pero con otros valores (nov $62) → en Ventas graficar solo lo facturado, con etiqueta sobre cada barra, y dejar la barra "lo que quedó" exclusivamente en Inicio/Ganancia. 2) [Lista "Últimos movimientos", línea 34 leerUltimosCobros(30)] la lista ignora el selector de mes: con "Noviembre de 2026" elegido muestra cobros del 23-30 oct; al navegar a octubre se verá lo mismo → filtrar por periodo (o titular "Últimos 12 cobros, de cualquier mes") y añadir "Ver más". 3) [Tarjetas "Se fueron este mes 0,0%" + "Quién se fue y por qué"] dicen lo mismo dos veces (~300px de redundancia); la tarjeta de 0,0% ocupa todo el ancho a 375 con el lado derecho vacío → fusionar: el % como dato dentro de "Quién se fue y por qué". 4) [Lectura de "Tus clientes hoy", línea 162] "son, sobre todo, pruebas que terminaron sin pagar" es una afirmación sin número detrás → calcular y decir "18 de los 26 eran pruebas que no pagaron". 5) [Movimiento, components/admin/ui.tsx Barra] las barras de "Tus clientes hoy" aparecen ya llenas (sin dibujarse) y el cambio de filtro Todos/Solo reembolsos no tiene transición → animar width de Barra con motion (respetando reduced-motion) y fundido de la lista al filtrar.
