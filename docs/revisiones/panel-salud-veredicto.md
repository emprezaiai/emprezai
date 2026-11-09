# VEREDICTO revisor-visual — Panel · Salud
Fecha: 2026-11-09 20:00
Screenshot: docs/revisiones/panel/salud-375.png
Usabilidad: 32/40
Craft: 15/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos: 1) ["Darle acceso" del aviso fallido] Lleva a /admin/usuarios?agregar=1 con el formulario VACÍO: la dueña tiene que tocar "Copiar correo", ir, pegar y escribir el nombre (memoria entre pantallas) → pasar &email= (y nombre si el aviso lo trae) y usarlo como defaultValue en FormAgregarUsuario (salud/page.tsx línea 108 + AccionesUsuario.tsx línea 78). 2) [Qué hacer de Hotmart] "Si en un día la persona sigue sin acceso…" no dice cómo saberlo → si el correo ya existe como usuario, enlace "Ver su ficha" con su estado; si no existe, "Todavía no tiene cuenta: dale acceso" (salud/page.tsx, bloque fallidos). 3) ["Errores de la semana 6"] Sin comparación con la semana anterior (pedido en ronda 2, sigue pendiente): no se sabe si el error de Mi Empresa es nuevo → "vs semana pasada" en el detalle de la tarjeta (salud/page.tsx línea 208). 4) [tarjetas de arriba] "Vencidos sin aviso" y "Errores de la semana" son de una línea pero reservan dos: queda un hueco antes del número → mismo ajuste de Dato (ui.tsx línea 148) que en Uso.
