# VEREDICTO revisor-visual — pantalla-principal (Hoy, M0)
Fecha: 2026-10-07 16:00
Screenshot: docs/revisiones/pantalla-principal-375.png
Usabilidad: 30/40
Craft: 15/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): FIEL
Veredicto: NO LISTA
Top defectos: 1) la tercera ficha ("piezas de la semana") tiene puntos vacíos #231D2E sobre #1A1622 (contraste de 1,1:1) y no lleva número: el día 8 se ve vacía y rompe el ritmo de las 3 fichas · 2) con la pieza de hoy hecha hay 4 accesos al mismo destino (tarjeta, CTA dorado, botón central verde y la 1ª fila, que repite la pieza de la tarjeta) y dos "primarios" de distinto color · 3) en Marco no hay MotionConfig reducedMotion="user" ni transición entre pestañas (pendiente de la ronda anterior) · 4) crearCuenta, importarPieza1SiFalta y Perfil ignoran el false de guardarCuenta: si falla el guardado al entrar, se vuelve a /login sin aviso, y Perfil dice "Listo" aunque no haya guardado · 5) en los días pendientes con racha en riesgo, M4 + insight suman 4 líneas, justo en el límite del gate

## Detalle de puntaje
Usabilidad: h1:3 h2:3 h3:3 h4:3 h5:3 h6:3 h7:3 h8:3 h9:3 h10:3
Craft: jerarquía:3 profundidad:3 identidad:3 movimiento:3 encaje:3

Capturas puntuadas: pantalla-principal-375.png, app/17-hoy-demo-dia8-arriba.png, app/17-hoy-demo-dia8-final.png,
app/04-hoy-dia1-hecho-arriba.png, app/04-hoy-dia1-hecho-final.png, app/09-hoy-dia2-pendiente.png,
app/16-hoy-dia2-hecho-arriba.png, app/16-hoy-dia2-hecho-final.png, app-360/17-hoy-demo-dia8-arriba.png.
Código: components/interna/Hoy.tsx, components/interna/Marco.tsx, app/app/error.tsx, lib/cuenta.ts, app/globals.css
(+ grep de guardarCuenta/guardarPieza en Mision.tsx y Perfil.tsx).

## Gate de carga cognitiva
Falla 0 de 8. Queda en el límite el ítem "texto por bloque en 3-4 líneas": en el día 8 y el día 2 pendiente, M4 + insight
suman exactamente 4 líneas a 375 y a 360. El CTA está en la primera vista. Ningún elemento parece interactivo sin
serlo (la fila bloqueada de mañana lleva a /app/ruta).

## CTA héroe vivo (los 4 se cumplen)
Contraste: #1A1206 sobre el degradé #FFD978→#FFC23D da unos 11:1, y el dorado contra #0F0D16 supera 3:1. Tap:
.boton-oro:active con translateY 2px en 120ms. Nunca disabled: es un Link. Mide 56px (h-14) y ocupa todo el ancho,
en la primera vista. Nota: en el estado "hecho", el CTA dorado y el botón central verde llevan al mismo sitio y
compiten como primarios (hallazgo 2).

## Test de fidelidad (referencia-usuario-1.jpg = contrato de composición · public/landing/hoy-v2.png = tour aprobado)
- Modo: OK (oscuro)
- Hue del acento: OK (#FFC23D, más #3DDC97 como 2ª nota)
- Clase tipográfica display: OK (Bricolage, grotesk)
- Radios: OK (tarjetas 20 · píldoras 999 · chips 12)
- Densidad: FALLO LEVE. El insight de 2-4 líneas entre los datos y las filas no existe en hoy-v2, y la 3ª ficha de
  hoy-v2 trae número ("34 min en total"), mientras que aquí es una fila de puntos casi invisible.
- Sombras/profundidad: OK. Relieve con canto, cubos con halo, radial dorado y fila hundida con borde punteado.
Resultado: 1 de 6 fallos → FIEL.
Valores de FICHA-ARTE comprobados en screenshot y código: #0F0D16 / #1A1622 / #231D2E / #0A0910, tinta
#EFEAF5 / #BDB4CB / #998FA8, Bricolage + Instrument, radios 20/999/12. La escala ahora cumple la ficha: label 12,
body 15, title 17-18 y display 24. Desvío vigente: las flechas de las filas son piedra y en el tour aprobado eran
doradas (sin anotar en FICHA-ARTE).

## Hallazgos por severidad

### ALTA
1. Hoy.tsx:211-227, la tercera ficha. Los puntos vacíos usan bg-raised-2 (#231D2E) sobre la tarjeta (#1A1622 con un
   velo blanco del 5%), con un contraste aproximado de 1,1:1. Un indicador gráfico con significado necesita ≥3:1.
   En el día 8, que es la captura convencional, la ficha se ve vacía: ícono, nada y "piezas de la semana". Las otras
   dos fichas llevan un número display de 24px y esta un punto de 8px, así que el ritmo de las 3 se rompe a simple vista.
   FIX: puntos vacíos como aro de 1,5px en ink-3 (#998FA8) sin relleno, y "2/7" en text-precio a la izquierda de la
   fila (o arriba), para que las 3 fichas compartan el nivel numérico.

### MEDIA
2. Estado "hecho" (04 y 16). Tarjeta héroe (Hoy.tsx:116), CTA "Ver mi pieza de hoy" (174), botón central verde
   (Marco.tsx:95) y la 1ª fila ("Tu cliente ideal · Día 2 · lista", que es la misma pieza de la tarjeta) llevan
   todos a /app/empresa?pieza=N. Son 4 entradas y 4 paradas de tabulación al mismo sitio, con dos "primarios" de
   color distinto (dorado y verde) en la misma vista.
   FIX: con hechaHoy, sacar de `ultimas` la pieza de hoy (mostrar la anterior + la de mañana bloqueada), quitar el
   foco a la tarjeta (tabIndex={-1} + aria-hidden en el Link) y dejar el CTA como secundario (estilo piedra) o
   cambiarlo por la acción de mañana ("Avisarme mañana a las 19:00").
3. Marco.tsx:130-136 (pendiente de la ronda anterior). El layoutId con spring del indicador activo no respeta
   reduced-motion: no hay MotionConfig en app/app/layout.tsx. Tampoco hay transición entre pestañas (no hay
   template.tsx). FIX: <MotionConfig reducedMotion="user"> en el layout de /app y fade de 200ms en
   app/app/template.tsx.
4. lib/cuenta.ts:179 y 272, Perfil.tsx:39. guardarCuenta ya devuelve boolean y Mision lo usa bien, pero:
   - crearCuenta devuelve la cuenta aunque no se haya guardado. Marco lee null y manda a /login sin decir nada:
     un bucle mudo.
   - importarPieza1SiFalta ignora el fallo.
   - Perfil muestra "Listo: tu misión será…" aunque no haya guardado, que es un falso éxito.
   FIX: crearCuenta debe devolver null si falla, el login debe mostrar "No pudimos guardar en este celular. Libera
   espacio o sal del modo incógnito y toca Reintentar", y Perfil debe mostrar "Listo" solo si guardó.

### BAJA
5. Hoy.tsx:232-242. Con la racha en riesgo, el bloque en negrita + insight ocupa 4 líneas (día 8 y día 2
   pendiente), en el límite del gate y en el punto donde la densidad se separa de hoy-v2.
   FIX: cuando rachaEnRiesgo, reemplazar el insight por una sola frase: "La llama está en modo siesta: tu
   {pieza de hoy} la vuelve a prender." (máx 2 líneas).
6. Hoy.tsx:111 (pendiente de la ronda anterior). El h1 sigue siendo "Buenos días" y la misión no es un encabezado.
   FIX: saludo a <p> y título de la misión a <h1>.
7. Hoy.tsx:257 (pendiente). Las flechas de las filas son piedra y en el tour aprobado eran doradas. Anotar la
   decisión en FICHA-ARTE o volver al dorado.

## Re-revisión 3: qué se corrigió
Verificado en screenshot y código, contra los 5 TOP DEFECTOS de la revisión 2:
- [CORREGIDO] 1. Vacío muerto del día 1 hecho. Debajo de la pieza aparece la fila hundida y punteada "Tu cliente
  ideal · Mañana · Día 2 · 5 min" con candado (Hoy.tsx:263-278). Ya no queda hueco sobre la barra a 375 ni a 360.
  El subtítulo dice "Ya está guardada en Mi Empresa".
- [CORREGIDO] 2. La línea M4 está dentro del insight, en negrita ink-1 al inicio, bajo el mismo ícono y la misma
  sangría, dentro de entrar(4). Ya no hay dos bloques desalineados ni aparición fuera del stagger.
  Queda: 4 líneas en total (hallazgo 5).
- [PARCIAL] 3. La etiqueta ya dice "piezas de la semana" y el número se cambió por 7 puntos con spring escalonado.
  Desaparece el "1 · 1 · 1/7", pero los puntos vacíos son casi invisibles (1,1:1) y la ficha pierde el nivel
  numérico que tienen las otras dos (hallazgo 1). Racha = piezas sigue repitiéndose en la semana 1 ("1 · 1",
  "2 · 2"), algo aceptable porque son conceptos distintos.
- [CORREGIDO] 4. Escala tipográfica: fecha 12, saludo 18 bold, cuerpo 15, CTA 17 y display 24 para la misión y los
  números. Cumple la ficha (24-28 / 16-19 / 13-15 / 10.5-12) y en la vista entrecerrada el héroe es la misión.
- [CORREGIDO] 5. guardarCuenta devuelve boolean y guardarPieza devuelve null si falla. Mision.tsx (184, 294 y 438)
  muestra <ErrorGuardado>. error.tsx tiene "Escribir a soporte" (mailto) + Reintentar + Ir al inicio.
  Quedan sin cubrir crearCuenta, importarPieza1SiFalta y Perfil (hallazgo 4).
- [CORREGIDO] Extra: el botón central pasa a verde con check y abre la pieza cuando está hecha (Marco.tsx:82-99).
  Ya no llama a una misión terminada. Agrega una entrada más al mismo destino (hallazgo 2).
Movimiento (eje 4) verificado en código:
- stagger entrar(0-5): OK
- conteo con Cuenta: OK
- barra con scaleX y puntos con spring: OK
- tap con active:scale y translateY: OK
- cubos flotando con reduce: OK
- transición entre pestañas: FALTA (solo se mueve el indicador)
- modales: no aplican
- celebración: fuera de esta pantalla
- reduced-motion: OK en Hoy, FALTA en el indicador de la barra
Balance: 30/40 (antes 29) · 15/20 (igual) · FIEL. Sigue NO LISTA: faltan 6 puntos de usabilidad y 1 de craft.
El camino más corto:
- hallazgo 1: sube encaje y jerarquía
- hallazgo 3: sube movimiento a 4 y cierra el gate de craft
- hallazgos 2 y 5: suben h8 y h4
- hallazgo 4: sube h1 y h9
