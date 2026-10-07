# VEREDICTO revisor-visual — pantalla-principal (Hoy, M0)
Fecha: 2026-10-07 23:15
Screenshot: docs/revisiones/pantalla-principal-375.png
Usabilidad: 32/40
Craft: 16/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): FIEL
Veredicto: NO LISTA
Top defectos: 1) con racha 0 (16b racha rota y 16c sin piezas) la llama va en relieve dorado, encendida, al lado de "0 días de racha"; FICHA-ARTE línea 39 reserva el dorado a la racha VIVA · 2) la racha rota es un estado mudo: en 16b la racha cae a 0 sin una palabra, y el insight sigue con el texto neutro del Método · 3) en el día 1 queda vacío muerto bajo el insight (unos 145px CSS en 16c y unos 95px en 04); el estado sin piezas son tres ceros más una frase y no enseña qué viene · 4) en riesgo, la llama es un chip hueco con borde ámbar entre dos chips en relieve macizo; la fila de 3 fichas pierde peso óptico a la izquierda (pantalla-principal-375, 09) · 5) el role=status envuelve el aviso completo con el botón Reintentar dentro, y el "Listo" aparece sin la entrada animada del resto

## Detalle de puntaje
Usabilidad: h1:3 h2:4 h3:3 h4:3 h5:3 h6:4 h7:4 h8:3 h9:3 h10:2
Craft: jerarquía:3 profundidad:3 identidad:3 movimiento:4 encaje:3

Capturas puntuadas (todas del build actual):
- pantalla-principal-375.png
- 375: app/04, app/09, app/16-arriba, app/16-final, app/16b-arriba, app/16c, app/17-final
- 360: app-360/17-arriba

Código: components/interna/Hoy.tsx, components/interna/Marco.tsx, lib/borradores.ts, lib/cuenta.ts (estadoRuta), app/globals.css, components/interna/Mision.tsx (lectura del borrador).

## Gate de carga cognitiva
Falla 0 de 8:
- Hay una acción primaria por estado.
- El insight ocupa 3 líneas como máximo.
- Hay como máximo 2 filas visibles.
- "Qué sigue" se ve en el CTA y en la fila de mañana.
- La fila de mañana con candado no es enlace, pero el candado ya comunica "todavía no".

## CTA héroe vivo
**Estado pendiente: cumple los 4.**
- Contraste: .boton-oro, unos 11:1.
- Tap: :active con translateY.
- Habilitado: es un Link y nunca está disabled.
- Tamaño: h-14, ancho completo, en la primera vista.

**Estado hecho:** el CTA usa material fila-pildora con active:scale y va a un destino propio (/app/ruta).

## Test de fidelidad (referencia-usuario-1.jpg = contrato de composición)
- Modo: OK.
- Hue: OK, según el alcance del contrato (colores de la C).
- Display grotesk: OK.
- Radios 20/999/12: OK.
- Densidad: FALLO LEVE. El insight no está en la composición de la referencia.
- Profundidad: OK.

Resultado: 1 de 6 fallos → FIEL.

Valores de FICHA-ARTE comprobados en el screenshot:
- Fondo #0F0D16 con radial dorado.
- Superficies #1A1622 y #231D2E.
- Hundido #0A0910.
- ink 1/2/3.
- Bricolage + Instrument.
- Radios 20, 999 y 12.
- Llama viva dorada y llama en riesgo ámbar.

Desvío: la llama dorada con racha 0 (defecto 1).

## Re-revisión 7: verificación de lo trabajado

**[CORREGIDO] Título del día 8 en 3 líneas**
- El float ahora mide h-[1lh] (Hoy.tsx:163).
- "Hoy: crea el / nombre de tu negocio" cabe en 2 líneas a 375 y a 360.

**[CORREGIDO] Controles del estado hecho**
- La tarjeta héroe es un div sin onClick.
- El CTA "Ver lo que sigue en mi ruta" va a /app/ruta, en material de fila.
- El botón central va a la pieza.
- La fila de mañana no es enlace.
- El "· 2/30" ya no se repite.

**[CORREGIDO] Reintentar**
- Hay un único `role="status"` siempre montado (Hoy.tsx:284).
- El botón queda disabled durante 800ms, lo que bloquea el doble toque.
- Al 2º fallo aparece "Escríbenos" con mailto.
- Matiz: el live region contiene el botón (defecto 5).

**[CORREGIDO] Frase llana de la racha**
- Nuevo texto: "Tu racha de 7 días sigue si hoy armas…".
- "La llama espera" ya no está.

**[CORREGIDO] "Seguir donde lo dejé"**
- hayBorrador (lib/borradores.ts) y Mision.tsx:156/448 leen el mismo borrador, así que el flujo se retoma de verdad.
- No hay captura de este estado: se verificó solo en el código.

**[CORREGIDO] "semana N" bajo los puntos**
- Ya no se lee como contradicción frente a "7 días de racha".

**[CORREGIDO CON DEFECTO NUEVO] Llama en ámbar en riesgo**
- La regla está bien aplicada.
- Pero el chip pasó a hueco (borde de 1.5px) mientras los otros dos son relieve macizo (defecto 4).
- Además, con racha 0 la llama cae en la rama dorada (Hoy.tsx:214-217), porque rachaEnRiesgo exige racha > 0 (cuenta.ts:218). Eso causa el defecto 1.

**[EVIDENCIA NUEVA QUE BAJA PUNTAJE] 16b racha rota y 16c sin piezas**
- Las capturas existen, pero muestran que esos dos estados no hablan:
  - Racha rota: llama encendida en 0 y ninguna mención a la racha perdida.
  - Día 1: tres ceros, una línea de insight y vacío debajo.
- h10 baja a 2.

**Movimiento (eje 4), sin cambios: OK**
- Stagger entrar(0-5).
- Conteo con Cuenta.
- Barra con scaleX y puntos con spring.
- active:scale en todo lo tocable.
- Indicador de la barra con spring.
- MotionConfig "user" y useReducedMotion.
- Única falta: el "Listo" de Reintentar entra sin animación.

**Balance:** 32/40 (antes 31) · 16/20 · FIEL. Suben h2 (frase llana) y h7 (retomar). Baja h10 con la evidencia nueva. Sigue NO LISTA: faltan 4 puntos de usabilidad.

## Qué tendría que pasar para que cada criterio llegue a 4
- **h1 (estado):** que la llama diga la verdad en los 3 estados:
  - viva: oro
  - en riesgo: ámbar
  - en 0: piedra apagada

  Además, que el éxito de Reintentar entre con la misma animación que el resto. El role=status solo debería contener el texto, no el botón.
- **h2 (lenguaje):** ya está en 4.
- **h3 (control):** "posponer la misión" o "cambiar la hora del recordatorio" con deshacer, sin salir de Hoy. Hoy no hay acciones reversibles en la pantalla.
- **h4 (consistencia):** dos cambios:
  - la tarjeta héroe no debería compartir el material de las fichas tocables (hoy las 3 fichas son Links y la héroe, igual de elevada, no responde); quitarle el canto inferior de 2px o darle el mismo destino que el CTA, con foco;
  - el chip de la llama en riesgo en el mismo material de relieve que sus vecinos.
- **h5 (prevención):** detectar falta de conexión antes de abrir una misión que usa IA. Hoy Mision y Hoy no consultan navigator.onLine; solo lo hacen Paywall y Acceso. Mostrar en Hoy "Sin conexión: la misión de hoy necesita internet".
- **h6 (reconocer):** ya está en 4.
- **h7 (flexibilidad):** ya está en 4 (retomar el borrador verificado en el código). Falta la captura del estado "Seguir donde lo dejé" como evidencia.
- **h8 (minimalismo):** dos ajustes:
  - en estado hecho, 4 controles van a /app/ruta (CTA, ficha de racha, ficha de semana y pestaña); dar a la ficha de semana otro destino o hacerla informativa;
  - en pendiente conviven dos dorados que hacen lo mismo (CTA y botón central); aceptable por la referencia, pero el CTA debería ser el único con halo.
- **h9 (errores):** capturar el aviso de pieza 1 en sus 3 textos (inicial, fallo y fallo2) para verificarlos visualmente. Cubrir también el error de "sin conexión" (h5).
- **h10 (ayuda):** dos ajustes:
  - racha rota: un insight propio (por ejemplo, si racha === 0 y hay piezas: "Tu racha vuelve a empezar hoy: arma X y enciende la llama de nuevo");
  - día 1 sin piezas: llenar el vacío con un adelanto de la semana 1 (una fila hundida "Esta semana armas 7 piezas: frase, cliente, oferta…" hacia /app/ruta) en vez de tres ceros mudos.
- **Jerarquía:** reducir los tamaños: saludo 18, título 24, números de las fichas, CTA 17 e insight 15 son 5 escalones. Bajar el saludo a body semibold para que se lean 4 niveles nítidos.
- **Profundidad:** que el nivel hundido aparezca también en pendiente (hoy solo existe en la fila de mañana del estado hecho y en el riel de la barra).
- **Identidad:** un detalle firma en las fichas de datos. Por ejemplo, la llama viva que pulse una vez al contar, o los puntos de la semana con forma de pieza en vez de círculos genéricos.
- **Encaje:** chips de las 3 fichas con el mismo material y el mismo peso óptico, y sin vacío muerto bajo el insight en el día 1.
