# VEREDICTO revisor-visual — pantalla-principal (Hoy, M0)
Fecha: 2026-10-07 21:00
Screenshot: docs/revisiones/pantalla-principal-375.png
Usabilidad: 30/40
Craft: 16/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): FIEL
Veredicto: NO LISTA
Top defectos: 1) el insight del Método desaparece justo en el estado más frecuente: con la pieza pendiente y racha > 0, rachaEnRiesgo (cuenta.ts:214) es verdadero, y Hoy.tsx:251 reemplaza la frase del Método ("ya tiene X: hoy arma Y") por "modo siesta"; el usuario que vuelve cada día nunca ve la prueba del loop · 2) en estado hecho, la tarjeta héroe (onClick), el CTA "Ver mi pieza de hoy" y el botón central verde llevan al mismo destino: tres caminos a lo mismo y ninguno a "qué sigue" · 3) en la tarjeta héroe, el pr-24 del h1 aplica en todas las líneas, así que "Hoy: crea el / nombre de tu / negocio" ocupa 3 líneas y deja un vacío a la derecha bajo los cubos (día 8) · 4) app/16-hoy-dia2-hecho-arriba y -final (375 y 360) son de un build anterior (chevron dorado, etiquetas en escalera): la evidencia no coincide con el código · 5) en la tercera ficha, el aria-label de los puntos está en un span sin rol (el lector lo ignora) y el -mt-1 deja 4px entre número y puntos frente a 8px en el resto; además, un Reintentar exitoso hace desaparecer el aviso sin confirmar nada

## Detalle de puntaje
Usabilidad: h1:3 h2:3 h3:3 h4:3 h5:3 h6:3 h7:3 h8:3 h9:3 h10:3
Craft: jerarquía:3 profundidad:3 identidad:3 movimiento:4 encaje:3

Capturas puntuadas:
- pantalla-principal-375.png
- app/04-hoy-dia1-hecho.png y app-360/04-hoy-dia1-hecho.png
- app/09-hoy-dia2-pendiente.png
- app/16-hoy-dia2-hecho.png (la versión vigente; las -arriba y -final están desactualizadas, ver defecto 4)
- app/17-hoy-demo-dia8-final.png

Código: components/interna/Hoy.tsx, components/interna/Marco.tsx, lib/cuenta.ts, components/acceso/Acceso.tsx, app/globals.css.

## Gate de carga cognitiva
Falla 0 de 8:
- Hay una sola acción primaria por estado.
- El "qué sigue" se ve: en el estado hecho, por la fila de mañana con candado.
- El insight cabe en 2 líneas.
- No hay elementos interactivos que no hagan nada.

## CTA héroe vivo
Estado pendiente (los 4 se cumplen):
- Contraste: .boton-oro, unos 11:1.
- Tap: :active.
- Habilitado: es un Link, nunca está disabled.
- Tamaño: h-14, ancho completo, en la primera vista.

Estado hecho: el primario es el botón central verde y el CTA pasa a secundario piedra. Correcto, pero redundante (defecto 2).

## Test de fidelidad (referencia-usuario-1.jpg = contrato de composición)
- Modo: OK.
- Hue del acento: OK.
- Clase tipográfica display: OK (grotesk).
- Radios: OK (20/999/12).
- Densidad: FALLO LEVE. El insight entre los datos y las filas no está en la composición del tour.
- Sombras y profundidad: OK.

Resultado: 1 de 6 fallos → FIEL.

Valores de FICHA-ARTE comprobados en el screenshot: fondo #0F0D16 con radial dorado, superficies #1A1622/#231D2E, hundido #0A0910 (fila de mañana), ink 1/2/3, Bricolage + Instrument y radios 20/999/12.

El dorado del día 8 queda en la etiqueta y el borde de la misión, el CTA, el botón central y la pestaña activa. Todo está dentro de la lista de la ficha. Ya no hay desvío.

## Re-revisión 5: qué se corrigió
Verificación uno por uno de los hallazgos de la ronda 4:

**[CORREGIDO] 1. Fila "Mañana" en el día 1 hecho**
- La condición pasó a `(ultimas.length > 0 || (e.hechaHoy && siguiente))` (Hoy.tsx:280).
- En app/04 y app-360/04 aparece "Tu cliente ideal · Mañana · Día 2 · 5 min" con candado. El vacío muerto bajó a unos 75px CSS, lo que es aceptable.

**[CORREGIDO] 2. Flechas de las filas**
- Ahora son relieve-piedra (Hoy.tsx:292). Así se ven en las capturas 375, 16 y 17.
- En el estado hecho ninguna fila supera al CTA.

**[CORREGIDO] 3. Etiquetas de las 3 fichas**
- Las 3 llevan mt-auto y comparten línea en 375 y en 360 (04, 09, 17 y la pantalla principal).

**[CORREGIDO] 4. Fallos de guardado**
- importarPieza1SiFalta devuelve el boolean de guardarCuenta (cuenta.ts:286-307).
- Hoy muestra un aviso role=status con qué pasó, qué hacer y el botón Reintentar (min-h-11). Si vuelve a fallar, cambia a "Sigue sin entrar: libera espacio...".
- Acceso.tsx:133-136 corta y explica si crearCuenta devuelve null.
- Queda pendiente: no hay confirmación de éxito (defecto 5).

**[CORREGIDO] 5. Tarjeta héroe**
- Ahora es un div con onClick → router.push (Hoy.tsx:123-128). Ya no es un enlace fantasma para el lector de pantalla.
- El CTA queda como único Link alcanzable con Tab.

**Movimiento (eje 4), sin cambios: OK**
- Stagger entrar(0-5).
- Conteo con Cuenta.
- Barra con scaleX y puntos con spring.
- Tap con active:scale.
- Transición entre pestañas en el template.
- Indicador de la barra con spring.
- Reduced-motion: useReducedMotion en Hoy y MotionConfig reducedMotion="user" en el Marco.

**Balance:** 30/40 (antes 29) · 16/20 · FIEL. Los 5 defectos de la ronda 4 están cerrados y h8 vuelve a 3. Sigue NO LISTA: faltan 6 puntos de usabilidad.

Ya no quedan defectos que bajen un criterio a 2. La brecha está en que ningún criterio llega a 4. Dónde se puede ganar:
- h6 y h10 (reconocer y ayuda): devolver el insight del Método en el estado pendiente con racha (defecto 1).
- h8 (minimalismo): dar al CTA del estado hecho un destino propio (defecto 2).
- h1 y h9 (estado y errores): confirmar el éxito de Reintentar y el anuncio accesible de la semana (defecto 5).
- Encaje: corregir el pr-24 del héroe y el -mt-1 de los puntos (defectos 3 y 5).
