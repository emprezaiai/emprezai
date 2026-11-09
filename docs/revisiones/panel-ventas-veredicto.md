# VEREDICTO revisor-visual — panel-ventas
Fecha: 2026-11-10 03:00
Screenshot: docs/revisiones/panel/ventas-375.png
Usabilidad: 34/40
Craft: 16/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos: 1) [Enlace "Verlos" de "Tus clientes hoy", app/admin/(panel)/ventas/page.tsx líneas 167-174] es la única salida a los 26 que ya no tienen acceso (el grupo con más potencial de recuperación) y es una palabra subrayada al final de una frase en caption, con ~20px de alto (menos de los 44px mínimos) → botón secundario de ancho completo "Ver los 26 y escribirles". 2) [Lista de movimientos, línea 35 y 235] por encima de 50 cobros en el mes, los más viejos quedan inalcanzables (solo se avisa "se muestran los 50 más recientes") → paginar ("Ver más") en vez de un tope fijo. 3) [Tarjeta "Suscripciones al mes", línea 106] el detalle de 3 líneas ("Lo que suman al mes tus 29 clientes (19 mensual · 10 anual)") alarga la fila → "19 mensual · 10 anual" y nada más (el título ya dice qué es). 4) [Ayuda de "Quién se fue y por qué", línea 122] explica por qué se separa algo que hoy está en 0 → mostrar la ayuda solo cuando haya casos que separar. 5) [Barra de noviembre en el héroe, línea 90] la barra elegida va en ink-1 casi blanco, más brillante que el número dorado del héroe → ink-2 sólido con el mes en negrita (ya lo está), sin competir con el dorado.
