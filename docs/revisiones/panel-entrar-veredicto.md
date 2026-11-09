# VEREDICTO revisor-visual — Panel · Entrar al panel
Fecha: 2026-11-09 16:00
Screenshot: docs/revisiones/panel/entrar-375.png
Usabilidad: 33/40
Craft: 15/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos: 1) [guepardo junto al logo] Desvío de FICHA-ARTE: el personaje está definido para aparecer "cuando la persona GANA o AVANZA"; aquí es decoración de un login, flotando en bucle infinito (EntrarPanel.tsx líneas 113-115) y pegado a la derecha sin relación con el título → quitarlo del estado inicial y mostrarlo en el paso "Revisa tu correo" o al entrar con éxito, sin bucle. 2) [cambio de paso correo → código] No hay transición: ambas ramas son <Entrada indice={2}> en la misma posición, React reutiliza el nodo y el formulario se reemplaza de golpe, igual que el título → key distinta por paso (key={paso}) o AnimatePresence para que el paso 2 entre con su desplazamiento. 3) [mensaje de error 503] "Escríbeme y lo activamos": la app no tiene un "yo"; la dueña no sabe a quién escribir → "Todavía no está conectado el envío de correos. Avísale a quien te ayuda con la app." 4) [composición a 375px] ~45% superior de la pantalla vacío y el bloque centrado deja el formulario lejos del pulgar → alinear arriba con pt-16 a 24 en móvil (justify-start sm:justify-center). 5) [errores del campo] El texto rojo aparece sin ícono y sin borde rojo en el campo (aria-invalid sin estilo visible) → borde danger en el input cuando aria-invalid y CircleAlert de 16px junto al mensaje, como en el resto del panel.
