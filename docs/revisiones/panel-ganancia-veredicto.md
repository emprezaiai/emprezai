# VEREDICTO revisor-visual — panel-ganancia
Fecha: 2026-11-09 18:00
Screenshot: docs/revisiones/panel/ganancia-375.png
Usabilidad: 27/40
Craft: 13/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos: 1) [Barra "adónde se va cada dólar" + puntos de la cascada, app/admin/(panel)/ganancia/page.tsx líneas 14-22] los 4 costos usan grises casi idénticos (ink-2 70%/50%, ink-3 70%/45%, ink-1 30%): en el screenshot los puntos de Comisión, Afiliados, Impuestos, IA y Servidores se ven iguales, así que "El punto de color es el mismo de la barra" no se puede usar → etiquetar los tramos directamente sobre/debajo de la barra (Tufte) o usar 3 valores de luminosidad bien separados y agrupar los costos menores en "Otros". 2) [Lectura bajo el héroe, línea 68-71] bloque de 5 líneas a 375 (incumple 3-4) → partir: "Tu mayor costo: servidores (33 de cada 100 dólares)" en 1 línea y la nota del día 9 como caption aparte de 1-2 líneas. 3) [Cascada] filas en cero se pintan igual que las reales ("$0,00" en ink-2) y "Reembolsos" lleva punto ROJO con $0,00; "Real (lo informó Hotmart)" se repite 3 veces → $0,00 en ink-3, sin punto rojo cuando es 0, y la nota de procedencia una sola vez en la ayuda del título. 4) [Héroe] Inicio muestra para el mismo $61,72 "↑ 8% vs los mismos días de octubre" y aquí la comparación desapareció → reutilizar <Variacion> en la línea de margen. 5) [Movimiento] la barra apilada, que es el gráfico protagonista, aparece estática → animar el ancho de cada tramo en secuencia (stagger 60 ms, desactivado con reduced-motion).
