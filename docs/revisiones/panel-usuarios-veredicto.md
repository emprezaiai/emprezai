# VEREDICTO revisor-visual — Panel · Usuarios
Fecha: 2026-11-09 22:00
Screenshot: docs/revisiones/panel/usuarios-375.png
Usabilidad: 33/40
Craft: 15/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos: 1) [lista, evidencia] La captura muestra 25 filas con "Página 1 de 6": en modo captura rpc() devuelve la lista del archivo de prueba sin aplicar p_limite/p_desde, así que el render NO demuestra las 12 por página (y cualquier página muestra las mismas 25) → en modo captura recortar filas con slice(p_desde, p_desde + p_limite) en leerUsuarios (lib/servidor/panel.ts líneas 141-142 y 531-537) y volver a capturar. 2) [filas vs filtros] La fila dice "Sin acceso" y el filtro de ese mismo estado se llama "Prueba o acceso vencido" (y ahora hay otro filtro "Sin acceso hoy"): la dueña ve tres nombres para lo mismo → mismo texto en la fila y en el chip ("Vencido" en NOMBRE_ESTADO.expired de estados.ts + ETIQUETA_FILTRO de usuarios/page.tsx línea 25). 3) [lista] Sigue sin orden: no puede poner arriba a quien hace más tiempo no entra ni a quien más piezas lleva → selector "Más recientes · Hace más que no entran · Más piezas" con parámetro orden en la URL (usuarios/page.tsx + panel_usuarios).
