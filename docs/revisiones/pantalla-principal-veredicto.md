# VEREDICTO revisor-visual — pantalla-principal (Hoy, M0)
Fecha: 2026-10-07 18:00
Screenshot: docs/revisiones/pantalla-principal-375.png
Usabilidad: 29/40
Craft: 16/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): FIEL
Veredicto: NO LISTA
Top defectos: 1) REGRESIÓN en el día 1 hecho: volvió el vacío muerto (unos 155px CSS entre el insight y la barra, a 375 y a 360) porque la fila bloqueada de "Mañana" está dentro de `ultimas.length > 0 &&` (Hoy.tsx:259) y al sacar la pieza de hoy, `ultimas` queda vacía · 2) las flechas doradas de las filas son un desvío de FICHA-ARTE línea 33 (el dorado va SOLO en CTA, misión, nodo, dato héroe y botón central) sin excepción anotada; en el estado hecho, el chevron dorado pesa más que el CTA secundario, y en el día 8 hay 5 superficies doradas en la vista · 3) en la tercera ficha, la fila de puntos baja la etiqueta "esta semana" unos 16px respecto de "días de racha" y "piezas listas": las 3 etiquetas no comparten línea · 4) importarPieza1SiFalta sigue ignorando el false de guardarCuenta (cuenta.ts:266-272), y Acceso.tsx:110 ignora el null de crearCuenta (rebote mudo a /login, solo en la ruta de demostración) · 5) la tarjeta héroe con tabIndex=-1 sigue siendo un enlace para el lector de pantalla y contiene el h1: se anuncia como enlace sin poder alcanzarse con Tab

## Detalle de puntaje
Usabilidad: h1:3 h2:3 h3:3 h4:3 h5:3 h6:3 h7:3 h8:2 h9:3 h10:3
Craft: jerarquía:3 profundidad:3 identidad:3 movimiento:4 encaje:3

Capturas puntuadas:
- pantalla-principal-375.png
- app/17-hoy-demo-dia8-arriba.png y app/17-hoy-demo-dia8-final.png
- app/04-hoy-dia1-hecho.png (no existen las variantes -arriba/-final que se citaron; se puntuó la única captura)
- app/09-hoy-dia2-pendiente.png
- app/16-hoy-dia2-hecho-arriba.png y app/16-hoy-dia2-hecho-final.png
- app-360/04-hoy-dia1-hecho.png

Código: components/interna/Hoy.tsx, components/interna/Marco.tsx, app/app/template.tsx, lib/cuenta.ts,
components/interna/Perfil.tsx, components/acceso/Acceso.tsx.

## Gate de carga cognitiva
Falla 0 de 8:
- El bloque de racha en riesgo baja a 2 líneas.
- Hay una sola acción primaria por estado (CTA dorado si falta la pieza, botón central verde si está hecha).
- El "qué sigue" está en el insight.
- Ningún elemento parece interactivo sin serlo.

Nota: en el día 1 hecho, el "qué sigue" solo vive en el texto. La fila de mañana, que lo hacía visible, desapareció (defecto 1).

## CTA héroe vivo
Estado pendiente (los 4 se cumplen):
- Contraste: .boton-oro con #1A1206 sobre el degradé dorado, unos 11:1.
- Tap: :active con translateY.
- Habilitado: es un Link, nunca está disabled.
- Tamaño: h-14 (56px), ancho completo, en la primera vista.

Estado hecho: el primario es el botón central verde (64px, check oscuro sobre #3DDC97, active:scale-95). El CTA pasa a secundario piedra. Correcto.

## Test de fidelidad (referencia-usuario-1.jpg = contrato de composición · public/landing/hoy-v2.png = tour aprobado)
- Modo: OK (oscuro).
- Hue del acento: OK (#FFC23D, con #3DDC97 como 2ª nota).
- Clase tipográfica display: OK (Bricolage, grotesk).
- Radios: OK (tarjetas 20, píldoras 999, chips 12).
- Densidad: FALLO LEVE. El insight entre los datos y las filas no existe en hoy-v2. La 3ª ficha ya tiene número, como en el tour.
- Sombras y profundidad: OK (relieve con canto, cubos con halo, radial dorado, fila hundida punteada).

Resultado: 1 de 6 fallos → FIEL.

Valores de FICHA-ARTE comprobados: #0F0D16, #1A1622, #231D2E, #0A0910, ink #EFEAF5/#BDB4CB/#998FA8, Bricolage + Instrument y radios 20/999/12. Desvío vigente: las flechas doradas de las filas (defecto 2). Coinciden con el tour, pero contradicen la regla de uso del acento de la ficha, y no hay excepción anotada como sí la hay para §2 de la landing y la insignia de planes.

## Hallazgos por severidad

### ALTA
1. **Regresión del día 1 hecho.** Ubicación: Hoy.tsx:259 y 277 (capturas app/04 y app-360/04).
   - Problema: la fila "Mañana · Día 2 · 5 min" con candado se renderiza dentro de `{ultimas.length > 0 && (...)}`. Con hechaHoy en el día 1, el filtro nuevo de la línea 68 saca la pieza 1, `ultimas` queda vacía y desaparecen la lista y la fila de mañana. Queda un hueco negro de unos 310px de imagen (155px CSS) sobre la barra.
   - Por qué importa: era el TOP 1 de la revisión 2, corregido en la 3, y es el primer día que vive todo usuario.
   - FIX: condición `(ultimas.length > 0 || (e.hechaHoy && siguiente))` para renderizar el `<motion.ul>`.

### MEDIA
2. **Flechas doradas de las filas.** Ubicación: Hoy.tsx:271 (`relieve-oro`) frente a FICHA-ARTE:33.
   - Estado hecho (16): el círculo dorado de "Tu frase de negocio" es el elemento más saturado de la vista y supera al CTA secundario.
   - Día 8: hay dorado en la etiqueta, el borde del héroe, el CTA, 2 chevrons, el botón central y la pestaña. El acento deja de señalar "la acción".
   - FIX: anotar en FICHA-ARTE la excepción "chevron de fila = dorado (tour aprobado)" o pasarlos a relieve-piedra. Como mínimo, en estado hecho, que ninguna fila supere al CTA.
3. **Ficha "esta semana" desalineada.** Ubicación: Hoy.tsx:228-240.
   - Problema: la fila de puntos (h-2 + gap-2) empuja la etiqueta unos 16px por debajo de las otras dos. En el día 8 se ve a simple vista, con los tres números alineados y las etiquetas en escalera.
   - FIX: `mt-auto` en las 3 etiquetas, o reservar una fila h-2 vacía en las fichas 1 y 2, o poner los puntos en la misma línea que el "0/7".

### BAJA
4. **Fallos de guardado que siguen mudos.** Ubicación: lib/cuenta.ts:266-272 y components/acceso/Acceso.tsx:110.
   - importarPieza1SiFalta ignora el false: si no guarda, la pieza 1 no llega a Mi Empresa y nadie lo dice.
   - entrarDemostracion llama a crearCuenta sin mirar el null y hace router.replace('/app'), que rebota mudo a /login. Solo pasa en la demo.
   - FIX: importarPieza1SiFalta devuelve boolean y Hoy muestra "No pudimos traer tu primera pieza a este celular. Libera espacio y toca Reintentar". En Acceso, `if (!crearCuenta(email)) { setErrorCodigo('No pudimos guardar en este celular...'); return; }`.
5. **Tarjeta héroe fuera del orden de Tab.** Ubicación: Hoy.tsx:119-121.
   - Problema: con tabIndex=-1 sigue siendo un `<a>` con el h1 dentro. El lector la anuncia como enlace que no se alcanza con Tab.
   - FIX: hacer la tarjeta un `<div>` y dejar el CTA como único Link (el tap sobre la tarjeta puede quedar con onClick → router.push).

## Re-revisión 4: qué se corrigió
Verificado en screenshot y código contra los 5 TOP DEFECTOS y los pendientes de la revisión 3:

**[CORREGIDO] 1. Tercera ficha**
- "0/7", "1/7" y "2/7" van en text-precio con "/7" en ink-3. Los puntos vacíos son aro de 1,5px en ink-3, visibles en todas las capturas. La etiqueta dice "esta semana".
- Las 3 fichas comparten nivel numérico.
- Efecto colateral: la etiqueta queda desalineada (hallazgo 3).

**[CORREGIDO CON REGRESIÓN] 2. Pieza hecha**
- La fila ya no repite la pieza de hoy (línea 68).
- La tarjeta tiene tabIndex=-1 (con la nota del hallazgo 5).
- El CTA es secundario piedra y el único primario es el botón central verde.
- Pero el filtro dejó sin lista el día 1 hecho, y con ella la fila de mañana (hallazgo 1).

**[CORREGIDO] 3. Movimiento**
- `<MotionConfig reducedMotion="user">` envuelve toda la app (Marco.tsx:58), así que el spring del indicador activo respeta reduced-motion.
- app/app/template.tsx hace un fundido de opacidad en 200ms con easeOut, sin bloquear. La barra queda fuera del template y persiste.

**[PARCIAL] 4. Fallos de guardado**
- crearCuenta devuelve null si no guarda (cuenta.ts:180).
- Perfil muestra "Listo" solo si guardó, con aviso en role=status y aria-live (Perfil.tsx:39-44 y 74).
- Quedan importarPieza1SiFalta y la ruta de demo de Acceso (hallazgo 4).

**[CORREGIDO] 5. Racha en riesgo**
- Una sola frase de 2 líneas a 375: "La llama está en modo siesta: {pieza} la vuelve a prender."
- La ficha de racha muestra la llama apagada (aro ink-2), que es coherente con el texto.

**Pendientes de la revisión 3**
- h1 = misión: CORREGIDO (Hoy.tsx:146; el saludo pasa a `<p>`).
- Flechas doradas: aplicadas como en el tour, pero sin anotar en FICHA-ARTE (hallazgo 2).

**Movimiento (eje 4), verificado una por una en código**
- Stagger entrar(0-5): OK.
- Conteo con Cuenta: OK.
- Barra con scaleX y puntos con spring: OK.
- Tap con active:scale: OK.
- Transición entre pestañas: OK (template).
- Modales: no aplican.
- Celebración: en el flujo de misión.
- Reduced-motion: OK en Hoy y en toda la app vía MotionConfig.

**Balance:** 29/40 (antes 30) · 16/20 (antes 15) · FIEL.
- El craft pasa el gate.
- La usabilidad baja un punto por la regresión del vacío del día 1 (h8: 2).
- Sigue NO LISTA: faltan 7 puntos de usabilidad.

**Camino más corto**
- Hallazgo 1 (1 línea): devuelve h8 a 3.
- Hallazgos 2 y 3: suben h4 y h8, y el encaje.
- Hallazgos 4 y 5: suben h9 y h1.
- Para llegar a 36, además hacen falta 4s reales, que hoy no hay en ninguna heurística: lenguaje, reconocer y ayuda contextual están en 3 porque la pantalla funciona bien, pero no es ejemplar.
