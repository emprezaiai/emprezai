# VEREDICTO revisor-visual — panel-ia
Fecha: 2026-11-09 23:00
Screenshot: docs/revisiones/panel/ia-375.png
Usabilidad: 31/40
Craft: 15/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos: 1) [Topes "Hoy: $0,15" vs "Gasto día por día: el día más caro $0,12", app/admin/(panel)/ia/page.tsx líneas 84 y 111-112] dos cifras de la misma pantalla se contradicen: si hoy van $0,15, hoy es el día más caro, y la barra blanca de "9 nov" marca ~$0,11; hoy_usd (supabase/migrations/20261109000004_panel_ia_por_dia.sql línea 10) no usa los mismos límites que por_dia (línea 26: least(p_hasta, now())) → calcular "Hoy" desde el último elemento de por_dia (o el mismo filtro de fechas en ambos) para que coincidan siempre. 2) [Resumen "el día más caro $0,12"] dice cuánto pero no CUÁNDO, y la barra blanca de hoy no tiene leyenda → "el día más caro fue el 4 nov ($0,12)" y "Blanca: hoy" en la ayuda. 3) [KPI "Por cliente que la usa $0,019"] sigue sin referencia para juzgarlo (ronda 3 sin corregir) → detalle "de $9,99 que paga cada uno: 0,2%". 4) [Ayuda del gráfico, línea 109] "Un día en ámbar gastó más del doble" describe un estado que hoy no existe en el gráfico → mostrar esa frase solo si hay algún día en ámbar. 5) [Gráfico, components/admin/Graficos.tsx línea 61] la leyenda "Línea punteada: tu promedio" va en un atributo title (invisible en el celular); hoy la salva la ayuda, así que el title sobra → quitarlo y dejar la explicación visible.
