# VEREDICTO revisor-visual — Panel · Ficha de una persona
Fecha: 2026-11-09 16:00
Screenshot: docs/revisiones/panel/ficha-375.png
Usabilidad: 29/40
Craft: 14/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos: 1) [banda ámbar "Paga y no entra desde hace 87 días"] Ordena "Escríbele hoy a Camila" pero no hay cómo: ni botón, ni el correo de la cabecera es tocable/copiable; en el celular tiene que seleccionar el texto a mano → botón "Escribirle por correo" (mailto con asunto prellenado) + "Copiar correo" dentro de la banda (usuarios/[id]/page.tsx líneas 53-77 y 40). 2) [4 tarjetas de datos] Siguen pesando igual y compiten dos colores héroe a la vez (27 nov verde y 14 ago rojo) más un dato de bajo valor para la decisión ("Costo de su IA $0,17") al mismo tamaño → un solo dato héroe (la última vez que entró, a tamaño mayor) y Costo de IA como fila secundaria en Pagos. 3) [tarjeta "Última vez que entró"] "Hace 87 días · elige en la noche" es críptico para la dueña → "Hace 87 días · hacía su misión en la noche" (MOMENTO en page.tsx línea 98). 4) [Pagos] El total "5 pagos · $49,95 en total" va en gris ink-3 pequeño, por debajo de cada fila, y cada renovación dice "Venta" → total en ink-1 semibold alineado a la derecha y "Pago mensual"/"Renovación" según el plan. 5) [línea de estado bajo el correo] "Pagando  · plan mensual · llegó desde Instagram": gap-x-2 + el "·" con espacio duplica la separación tras "Pagando" → quitar el espacio inicial o el gap para que los separadores queden simétricos.
