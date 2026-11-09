# VEREDICTO revisor-visual — panel-inicio
Fecha: 2026-11-10 03:00
Screenshot: docs/revisiones/panel/inicio-375.png
Usabilidad: 35/40
Craft: 16/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos: 1) [Tarjeta "Suscripciones al mes", app/admin/(panel)/page.tsx línea 122] el detalle pasó a 4 líneas ("Lo que suman al mes tus 29 clientes (el plan anual cuenta su parte de cada mes)") y estira la fila: "Clientes activos" queda con ~90px vacíos y su flecha flotando abajo → detalle de 1-2 líneas ("29 clientes · el anual cuenta 1/12") y la explicación larga en la sección Ventas. 2) [Banda de avisos a 375] los dos avisos ocupan ~600px y el dato principal ($61,73) aparece recién al final de la primera pantalla de un iPhone (~812px) → en móvil, avisos en una sola línea (título + "Ver canales"), con el "qué hacer" dentro del plegable junto al "por qué". 3) [Etiqueta "Clientes activos 38 · 29 pagando · 9 en prueba"] "activos" mezcla a quien paga con quien prueba gratis, mientras "Se fueron 0,0%" y "Suscripciones" cuentan solo a los 29 que pagan → "Clientes hoy" o "29 pagando + 9 probando". 4) [Pie del gráfico] la leyenda va centrada y la lectura alineada a la izquierda justo debajo (dos alineaciones en 40px) → leyenda alineada a la izquierda. 5) [Atajo de teclado, components/admin/AtajoMes.tsx] funciona (verificado), pero nada en pantalla lo revela salvo el aria-label → title "← → para cambiar de mes" en las flechas del selector en escritorio.
