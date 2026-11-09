# VEREDICTO revisor-visual — Panel · Salud
Fecha: 2026-11-10 00:00
Screenshot: docs/revisiones/panel/salud-375.png
Usabilidad: 35/40
Craft: 16/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos: 1) [banner + 2 tarjetas rojas] El mismo problema se cuenta dos veces: el banner dice "1 pagó y no tiene acceso · 1 aviso de pago no se aplicó" y arriba hay dos tarjetas rojas con 1 ("Pagaron sin acceso" y "Pagos fallidos"), pero es UNA sola compradora (rocío) por UN solo aviso; la dueña lee dos problemas → en el banner unir las dos razones cuando la persona sin acceso viene del aviso fallido ("1 compra no se aplicó y esa persona no tiene acceso"), y en la tarjeta "Pagos fallidos" bajar a ámbar o decir "es el mismo de la izquierda" (salud/page.tsx, razones y tarjetas). 2) [Qué hacer] Dice "la app vuelve a intentarlo sola", pero antes (y en la ayuda del bloque) el que reintenta es Hotmart: dos versiones de quién reintenta → decir solo lo verificado contra el webhook real ("Hotmart vuelve a mandar el aviso") (salud/page.tsx, bloque fallidos). 3) [tarjeta "Errores (7 días)"] El 6 en rojo con "La semana pasada: 0" no dice cuántos fueron hoy (el dato que estaba antes se perdió) → "La semana pasada: 0 · hoy: 0".
