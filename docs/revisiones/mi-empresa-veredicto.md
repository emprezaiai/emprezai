# VEREDICTO revisor-visual — Mi Empresa
Fecha: 2026-10-07 17:30
Screenshot: docs/revisiones/mi-empresa-375.png
Usabilidad: 31/40
Craft: 15/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): FIEL
Veredicto: NO LISTA
Top defectos: (1) hay 6 tamaños de texto en la pantalla y la jerarquía no se lee en 4 niveles · (2) la hoja de detalle se arrastra completa y en el celular eso puede bloquear el scroll del texto largo · (3) la firma de movimiento se repite en cada visita y el mosaico sigue sin un dispositivo propio · (4) los rótulos usan whitespace-nowrap sin respaldo y el de 16 caracteres desborda a 360px · (5) dos bloques entran a la vez con entrar(4) y el número héroe «7 de 30» no cuenta

## Detalle de la puntuación
USABILIDAD: 31/40 (h1:3 h2:3 h3:3 h4:3 h5:3 h6:4 h7:3 h8:3 h9:3 h10:3)
CRAFT:      15/20 (jerarquía:3 profundidad:3 identidad:3 movimiento:3 encaje:3)
COPY:       N/A (no vende)
FIDELIDAD:  FIEL (0 de 6 fallos. Mismo modo oscuro, dorado #FFC23D, Bricolage en display, radios de 18-22px, densidad de resúmenes de 1 a 3 líneas y relieve con sombra difusa. El ícono de compartir ya coincide con la referencia. Diferencias menores sin fallo: el hairline de la tarjeta héroe va de oro a verde, en la referencia es solo oro, y la barra usa píldoras en lugar de rectángulos.)

Gate de carga cognitiva: 0 de 8 fallos críticos. Al límite: la Semana 1 abierta muestra 6 tarjetas, una más que el tope de 4-5, pero están agrupadas y se pliegan.
Capturas revisadas: mi-empresa-375.png, app/19-empresa-demo-dia8-arriba.png y -final.png, app/20-empresa-demo-detalle-arriba.png y -final.png, app/06-empresa-dia1.png, app-360/19-empresa-demo-dia8-arriba.png y la referencia public/landing/mi-empresa-v2.png.
Código revisado: components/interna/Empresa.tsx, lib/ruta.ts (campo corto) y FICHA-ARTE.md. lib/cuenta.ts no se leyó entero: solo se usa a través de los imports.

## Hallazgos por severidad

### MEDIA
1. [Jerarquía, toda la pantalla] Hay 6 tamaños de texto: título del negocio (text-pregunta), «Mi Empresa» y el resumen de la tarjeta héroe (text-lg), el encabezado de semana (text-base), el cuerpo de las tarjetas (text-sm) y el label (text-xs). Al entrecerrar los ojos, «Semana 1 · Tu idea, validada» compite con el resumen de la tarjeta héroe. Archivo: Empresa.tsx:240. Fix: poner el encabezado de semana en text-lg, el mismo token title que «Mi Empresa», para quedar en 4 niveles: 28/18/14/12.
2. [Hoja de detalle] `drag="y"` está en el contenedor que tiene `overflow-y-auto` y `max-h-[85dvh]`. En pantallas táctiles, Motion fija un touch-action que se lleva el gesto vertical, así que una pieza larga (con detalle) puede quedar sin scroll interno, y el arrastre compite con la lectura. Archivo: Empresa.tsx:391-397. Fix: usar `useDragControls` con `dragListener={false}` y arrancar el arrastre solo desde el tirador o el encabezado (onPointerDown → controls.start).
3. [Tarjeta héroe y barra, identidad] El resorte con bounce .25 (:204-207) y el destello del segmento (:170-177) se disparan cada vez que se entra a la pantalla, aunque la pieza tenga días. En la captura estática, el mosaico sigue siendo tarjeta oscura con label y texto, y la firma de la ficha («el tick se enciende en verde») no tiene un tick visible. Fix: condicionar el resorte y el destello a que la pieza se haya guardado hoy (o a `?nueva=1` al volver de la misión) y encender un Check verde en la tarjeta héroe.
4. [Rótulo de las tarjetas del mosaico a 360px] `whitespace-nowrap` (:267) no tiene respaldo. «MENSAJE DE VENTA» (día 24, 16 caracteres) mide unos 134-140px en mayúsculas con tracking .06em, y el ancho útil a 360px es de 134px, así que se sale del padding de la tarjeta. Esto no está en las capturas porque el demo llega al día 8. Fix: agregar `truncate` a ese span (el truncado como respaldo, que pedía el veredicto anterior) o bajar el tracking a .04em.

### BAJA
5. [Movimiento] `entrar(4)` en «lo que viene» (:284) sigue chocando con `entrar(2 + gi)` cuando hay 3 o más semanas (:225), y «7 de 30 piezas» (:184) sigue estático, sin el conteo de número héroe de la baseline. Fix: usar `entrar(2 + grupos.length)` y animar el número de 0 a N con `animate()` de Motion.
6. [Encabezado «Semana 1»] Muestra el check de semana completa y el contador «6», pero la semana tiene 7 piezas porque la del día 7 está arriba, en la tarjeta héroe. Un usuario atento puede preguntarse si le falta una. Fix: contar las piezas de la semana completa (7) o mostrar «6 + 1 arriba».
7. [Hoja de detalle, botón cerrar] La X (items-start) queda centrada más arriba que el título «Tu competencia», en el espacio entre el label y el título. Fix: usar `self-center` en el botón, o alinearlo al centro del título.
8. [Tarjeta «Hoy · Día 8»] Ya entra en una línea, pero sigue al fondo, a casi dos pantallas, fuera de cualquier grupo. Lo compensa el botón central de la navegación, que lleva a la misión.
9. [Esqueleto de carga] Sigue el esqueleto genérico del Marco. No se verificó de nuevo. Es aceptable.

## Re-revisión 3: qué se corrigió
| # anterior | Defecto | Estado | Evidencia |
|---|---|---|---|
| 1 | Rótulo «PREGUNTAS DE…» cortado | CORREGIDO | VALIDACIÓN, COMPETENCIA, CLIENTE IDEAL y TU FRASE se leen completos a 375 y 360px. Empresa.tsx:40 usa `RUTA[].corto` (≤16 caracteres en ruta.ts:35-64). Queda el riesgo del hallazgo 4 |
| 2 | Mosaico sin identidad / sin firma | PARCIAL | Ya hay resorte con bounce .25 (:204-207) y destello verde del segmento (:170-177). Se repiten en cada visita, no hay tick visible y el mosaico no cambia en estático (hallazgo 3) |
| 3 | «minutos» huérfana / acción al fondo | CORREGIDO (texto) | 19-empresa-demo-dia8-final.png: «El nombre de tu negocio · 5 minutos» en una línea, con text-pretty (:289). La ubicación al fondo no cambió (hallazgo 8) |
| 4 | Hoja sin bloquear scroll ni cerrar arrastrando | CORREGIDO, con regresión | Bloqueo del scroll del fondo (:356-362), cierre al arrastrar más de 100px (:391-396) y tirador (:399, visible en la captura 20). Regresión posible: el arrastre compite con el scroll interno (hallazgo 2) |
| 5 | Ícono Share2 | CORREGIDO | `Share` (:10, :148). En la captura se ve la flecha hacia arriba, igual que la referencia |
| 6 | entrar(4) choca con las semanas | NO CORREGIDO | :284 (hallazgo 5) |
| 7 | 6 tamaños de texto | NO CORREGIDO | :240 sigue en text-base (hallazgo 1) |
| 8 | Esqueleto genérico | NO CORREGIDO | Aceptable |

Delta: 30/40 → 31/40 (h6 sube de 3 a 4: los rótulos ya dicen qué pieza es cada una) · 14/20 → 15/20 (identidad sube de 2 a 3: la firma de movimiento ya existe en el código). Sigue sin pasar el gate doble (≥36/40 y ≥16/20). El camino más corto a 16/20 es la jerarquía (hallazgo 1) junto con el tick y la firma condicionada (hallazgo 3).
