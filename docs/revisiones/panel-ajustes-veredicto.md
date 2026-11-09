# VEREDICTO revisor-visual — panel-ajustes
Fecha: 2026-11-10 01:00
Screenshot: docs/revisiones/panel/ajustes-375.png
Usabilidad: 33/40
Craft: 15/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos: 1) [Tarjeta "Impuestos y retenciones", components/admin/FormulariosAjustes.tsx líneas 95-118 + app/admin/(panel)/ajustes/page.tsx línea 24] sigue con 3 líneas de ayuda antes del 10% y con el campo + Guardar siempre abiertos, mientras las otras dos secciones ya son plegables (ronda 4 sin corregir): dos patrones distintos en la misma pantalla → ayuda en 1-2 líneas y "Cambiar el porcentaje" plegable igual que "Agregar un costo". 2) [Abrir "Agregar un costo" / "Anotar un gasto", líneas 150-166 y 208-252] el <details> se abre de golpe y empuja la lista sin transición → apertura suave (grid-template-rows 0fr→1fr, 200 ms, motion-reduce:transition-none). 3) [Resultado al guardar] el aviso dice "Guardado: impuestos estimados en 12%" pero no cuánto cambia la ganancia, que es para lo que existe esta pantalla → "Guardado. Tu ganancia de noviembre pasa a $X" con enlace a Ganancia. 4) [Etiqueta "Impuestos y retenciones"] "retenciones" es vocabulario contable → "Impuestos (lo que le toca al fisco)". 5) [Atajos, heurística 7 verificada en código] ningún formulario tiene valor sugerido a partir de lo ya cargado (p. ej., el monto del gasto del mismo canal el mes anterior) → precargar el monto del último gasto del canal elegido como sugerencia.
