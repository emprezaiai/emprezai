# VEREDICTO revisor-visual — panel-inicio
Fecha: 2026-11-10 05:00
Screenshot: docs/revisiones/panel/inicio-375.png
Usabilidad: 37/40
Craft: 16/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: LISTA
Top defectos: 1) [Avisos, components/admin/ui.tsx línea 231] solo se muestra 1 aviso y el resto se pliega aunque sea de gravedad alta (calcularAvisos ordena por gravedad, pero con 2 avisos "alta" el segundo queda escondido) → mostrar siempre todos los de gravedad alta y plegar solo los de gravedad media. 2) [Pie del gráfico "Últimos 6 meses"] la leyenda va centrada y la lectura alineada a la izquierda justo debajo (dos alineaciones en 40px) → leyenda alineada a la izquierda. 3) [Atajo de teclado, captura 1440] "← → del teclado" queda pegado a la flecha deshabilitada, en ink-3 de 12px, y se lee como parte del selector → moverlo debajo del mes ("Usa ← → para cambiar de mes") o a un title de las flechas. 4) [Tarjetas "Gasto en IA" y "Se fueron"] el detalle ocupa 2 líneas a 375 mientras las de arriba ocupan 1-2; la flecha queda a alturas distintas entre filas → detalle ≤1 línea ("0,7% de lo facturado", "0 cancelaron · 0 fallaron"). 5) [Etiqueta "Se fueron 0,0%"] sin el "este mes" ya no dice de qué período es cuando se mira un mes pasado → "Se fueron en nov".
