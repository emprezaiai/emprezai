# VEREDICTO revisor-visual — Panel · Entrar al panel
Fecha: 2026-11-09 18:00
Screenshot: docs/revisiones/panel/entrar-375.png
Usabilidad: 35/40
Craft: 16/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos: 1) [paso 2 "Revisa tu correo"] No hay ayuda para el caso más común: el correo que cae en spam o en Promociones; la dueña solo ve "Reenviar en 60 s" → línea de ayuda "¿No llegó? Revisa Spam o Promociones; llega de [remitente]" bajo el botón (EntrarPanel.tsx, después de la línea 210). 2) [texto del paso 2] "Si tu@correo es el correo del panel, ya te llegaron…" hace dudar a la dueña de su propio correo (es la frase anti-enumeración pensada para extraños) → "Te mandamos un enlace y un código a tu@correo. Toca el enlace o escribe el código aquí." (la respuesta del servidor sigue siendo igual para cualquier correo) (línea 135). 3) [encabezado] Todas las pantallas del panel abren con el rayo de marca sobre el título y esta no → añadir el span .rayo-marca encima de "Entra a tu panel" para que sea coherente con el resto (línea 127). 4) [paso 1, identidad] Sin el guepardo, la primera vista queda en logo + botón dorado sobre fondo oscuro, sin ningún detalle propio más allá del botón con relieve → el rayo de marca (punto 3) o un patrón de puntos al 6% en el fondo, como en "Ruta". 5) [campo de código] maxLength 8 y validación 6-8, pero el placeholder "Solo números" no dice cuántos → "Código de 6 números" (o el largo real) en el placeholder (línea 192).
