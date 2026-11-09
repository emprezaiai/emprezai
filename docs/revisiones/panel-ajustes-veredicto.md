# VEREDICTO revisor-visual — panel-ajustes
Fecha: 2026-11-09 18:00
Screenshot: docs/revisiones/panel/ajustes-375.png
Usabilidad: 27/40
Craft: 12/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos: 1) [Tres botones dorados, components/admin/FormulariosAjustes.tsx BotonGuardar línea 27-38] "Guardar", "Agregar" y "Guardar gasto" son los tres .boton-oro: desvío de FICHA-ARTE (dorado SOLO en el CTA principal) y 3 acciones primarias en una pantalla; además con 3 anchos distintos (en línea, ancho completo, ancho de contenido) → un solo estilo secundario (borde/superficie elevada) para los tres y ancho completo consistente en móvil. 2) [Select "Dónde pusiste el anuncio", ajustes/page.tsx línea 16 + FormulariosAjustes.tsx línea 169] arranca en "Afiliado: Ana" porque toma el primer canal de las ventas: un afiliado no tiene gasto en anuncios, el valor por defecto induce a un error → excluir afiliado-* de la lista y ordenar con los canales de pago (TikTok, Instagram…) primero. 3) [Campos de monto, líneas 157 y 217] placeholders "20" y "150" se ven como valores ya cargados (mismo tamaño, gris claro) y el de Nota se corta ("hoja en blar") a 375 → placeholder "Ej.: 20" y una nota más corta ("Ej.: video de la hoja en blanco"). 4) [Mensaje tras guardar gasto, app/admin/(panel)/acciones.ts línea 305] `Gasto de "${canal}" guardado.` devuelve el código crudo ("tiktok") → nombreCanal(canal). 5) [Movimiento] la barra "Quitado · Deshacer" y los avisos de resultado aparecen de golpe y la fila borrada desaparece sin transición → AnimatePresence (fundido + altura 200 ms, reduced-motion) en filas y aviso.
