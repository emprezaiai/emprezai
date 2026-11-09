# VEREDICTO revisor-visual — Panel · Salud
Fecha: 2026-11-09 16:00
Screenshot: docs/revisiones/panel/salud-375.png
Usabilidad: 29/40
Craft: 13/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos: 1) [banner ámbar + 4 tarjetas] Lectura contradictoria: el encabezado dice "Últimos 7 días" y el banner "1 aviso de pago no se aplicó", pero justo debajo las 4 tarjetas miden "hoy" y muestran cuatro 0 en verde (incluido "Fallos de Hotmart hoy 0") → que las tarjetas usen los mismos 7 días del encabezado (o que la de Hotmart muestre "1 esta semana" en ámbar) (salud/page.tsx líneas 86-123). 2) [tarjeta "Fallos de Hotmart hoy" a 375px] La etiqueta sigue en dos renglones y su 0 queda más bajo que el de "Pagaron sin acceso" (defecto de ronda 1 no resuelto en móvil) → etiqueta de un renglón ("Fallos de Hotmart") o reservar 2 líneas de etiqueta en Dato. 3) [Avisos de pago de Hotmart] "No se pudieron aplicar 1" no dice de quién ni de qué compra; el "Qué hacer" manda a revisar Usuarios en general, aunque la tarjeta de arriba ya dice que nadie quedó sin acceso → mostrar persona/fecha del aviso fallido con enlace a su ficha, y si pagaron_sin_acceso = 0 decir "Nadie quedó sin acceso; Hotmart lo reintenta". 4) [orden de bloques] El banner promete "de lo que más afecta a lo que menos" pero los errores de pantalla van antes que el pago que no se aplicó (dinero) → subir "Avisos de pago de Hotmart" por encima de "Errores de la app" cuando haya fallos. 5) [ayuda de "Errores de la app"] "Copia el detalle y pásamelo": ¿a quién? la voz "me" no es de la app → "Copia el detalle y mándaselo a quien te ayuda con la app"; y sobra aire al pie de la tarjeta (py-2 + min-h-11 del último botón) → pb-0 en el último ítem.
