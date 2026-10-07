# VEREDICTO revisor-visual — pantalla-principal (Hoy, M0)
Fecha: 2026-10-07 23:50
Screenshot: docs/revisiones/pantalla-principal-375.png
Usabilidad: 35/40
Craft: 17/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): FIEL
Veredicto: NO LISTA
Top defectos: 1) el latido de la llama viva no ocurre: Hoy.tsx:234 usa initial={false} con keyframes en animate; Motion monta el elemento ya en el valor final y se salta la animación. Hoy solo se monta con la cuenta cargada (Marco.tsx:56), así que la llama nunca late · 2) en 16c (día 1, 0 piezas) la ficha de piezas lleva el chip verde en relieve encendido con "0 piezas listas", al lado de la llama apagada; la barra de 0/30 también pinta un punto verde (Hoy.tsx:194, mínimo 3%). FICHA-ARTE línea 34 reserva el verde para el progreso HECHO · 3) el estado "Seguir donde lo dejé" (17b) solo cambia el texto del CTA; la tarjeta héroe sigue diciendo "5 minutos, desde el celular" y no dice hasta dónde llegó · 4) los avisos vivos se montan ya con su contenido: el role=status de "Listo" (Hoy.tsx:343) reemplaza al del aviso, que se desmonta, y el de "Sin conexión" (Hoy.tsx:354) aparece condicionalmente; muchos lectores de pantalla no anuncian una región que nace con texto · 5) en el estado hecho, 3 controles siguen yendo a /app/ruta (CTA, ficha de semana, pestaña), y la ficha de racha repite el destino de la campana (/app/perfil#recordatorio)

## Detalle de puntaje
Usabilidad: h1:3 h2:4 h3:3 h4:3 h5:4 h6:4 h7:4 h8:3 h9:3 h10:4
Craft: jerarquía:3 profundidad:4 identidad:3 movimiento:4 encaje:3

Capturas puntuadas (todas del build actual):
- pantalla-principal-375.png
- 375: app/04, app/09-arriba, app/16-final, app/16b-arriba, app/16c, app/17-final, app/17b-arriba
- 360: app-360/16b-arriba

Código: components/interna/Hoy.tsx, components/interna/Marco.tsx, app/globals.css. Grep en components/interna: ninguna misión hace fetch ni llama a una API.

## Gate de carga cognitiva
Falla 0 de 8:
- Hay una acción primaria por estado.
- El insight ocupa 4 líneas como máximo (día 8), dentro del límite.
- Las filas visibles son 1 o 2.
- "Qué sigue" se ve en el CTA, en la fila de mañana (hecho) y en la fila de la semana (día 1).
- La tarjeta héroe ya no tiene canto y no parece tocable.

## CTA héroe vivo
**Estado pendiente: cumple los 4.**
- Contraste: .boton-oro, unos 11:1.
- Tap: :active.
- Habilitado: es un Link y nunca está disabled.
- Tamaño: h-14, ancho completo, en la primera vista.

**Estado hecho:** el CTA usa fila-pildora con active:scale-[0.98].

## Test de fidelidad (referencia-usuario-1.jpg = contrato de composición)
- Modo: OK.
- Hue: OK, según el alcance del contrato (colores de la C).
- Display grotesk: OK.
- Radios 20/999/12: OK.
- Densidad: FALLO LEVE. El panel de insight no está en la composición de la referencia.
- Profundidad: OK.

Resultado: 1 de 6 fallos → FIEL.

Valores de FICHA-ARTE comprobados en el screenshot:
- Fondo #0F0D16 con radial dorado.
- Superficies #1A1622 y #231D2E.
- Hundido #0A0910 en el insight, en todos los estados.
- ink 1/2/3.
- Bricolage + Instrument.
- Radios 20, 999 y 12.
- Llama: oro viva (04, 16), ámbar en juego (09, 17, 17b), piedra apagada en 0 (16b, 16c).

Desvío: el verde encendido en 0 (defecto 2).

## Re-revisión 8: verificación de lo trabajado

**[CORREGIDO] Llama en 3 estados**
- Hoy.tsx:231 aplica relieve-piedra-apagada / relieve-ambar / relieve-oro.
- Los tres comparten el material de relieve (globals.css:83-99 y 390).
- Visible en las capturas 16c, 16b, 09 y 04.

**[NO FUNCIONA] Latido al contar**
- El código existe, pero initial={false} anula la animación de montaje (defecto 1).

**[CORREGIDO] Racha rota**
- Tiene insight propio: "Tu racha vuelve a empezar hoy: arma tu oferta y enciende la llama de nuevo." (16b).
- Matiz: es el único insight de riesgo sin arranque en negrita.

**[CORREGIDO] Día 1 sin piezas**
- La fila "Esta semana: 7 piezas de 5 min" lleva a /app/ruta (16c).
- Ya no queda vacío muerto bajo el insight.

**[CORREGIDO CON MATIZ] role=status y "Listo"**
- El role=status contiene solo el texto (Hoy.tsx:308).
- "Listo" entra con opacidad e y.
- Matiz: la región se monta ya con el contenido (defecto 4).

**[CORREGIDO] Tarjeta héroe sin canto**
- .heroe-hoy elimina la sombra 0 2px 0 (globals.css:370).

**[CORREGIDO] Aviso sin conexión**
- Usa useSyncExternalStore sobre online/offline.
- El texto es honesto: las misiones no usan la red (grep sin fetch).

**[CORREGIDO] Ficha de racha**
- Lleva a /app/perfil#recordatorio, con un aria-label que lo explica.
- Matiz: duplica el destino de la campana y nada visible indica a dónde lleva.

**[CORREGIDO] Saludo un nivel abajo**
- text-base semibold.

**[CORREGIDO] Insight en panel hundido en todos los estados**

**[CORREGIDO] Captura de "Seguir donde lo dejé" (17b)**
- Matiz: solo cambia el CTA (defecto 3).

**Balance:** 35/40 (antes 32) · 17/20 (antes 16) · FIEL.
- Suben h5 (aviso de conexión honesto) y h10 (racha rota y día 1 enseñan).
- Sube profundidad (3 niveles en todos los estados).
- Sigue NO LISTA: falta 1 punto de usabilidad.

## Qué tendría que pasar para que cada criterio llegue a 4
- **h1 (estado):** tres cambios:
  - En "Seguir donde lo dejé", la tarjeta héroe dice el avance real del borrador (por ejemplo, "Vas en la pregunta 2 de 3") en vez de "5 minutos, desde el celular".
  - La barra no pinta verde con 0/30 (riel vacío o punto en piedra).
  - Un único contenedor role=status siempre montado, que solo cambie su texto (aviso de pieza 1, "Listo" y "Sin conexión").
- **h2 (lenguaje):** ya está en 4.
- **h3 (control):** una acción reversible en Hoy con deshacer, sin salir de la pantalla. Por ejemplo, "Recordármelo a las 21:00" desde la ficha de racha, con un toast "Deshacer". Hoy no hay ninguna.
- **h4 (consistencia):** dos cambios:
  - El chip de piezas sigue la misma regla que la llama: relieve-piedra-apagada con 0 piezas, verde desde 1.
  - Los insights de riesgo y de racha rota con la misma forma (arranque en negrita en los dos).
- **h5 (prevención):** ya está en 4.
- **h6 (reconocer):** ya está en 4.
- **h7 (flexibilidad):** ya está en 4.
- **h8 (minimalismo):** dos cambios:
  - En el estado hecho, la ficha de semana va a un destino propio o pasa a ser informativa (hoy 3 caminos llevan a la Ruta).
  - La ficha de racha muestra a dónde lleva (micro-label "recordatorio 19:00") o deja de repetir el destino de la campana.
- **h9 (errores):** capturar el aviso de pieza 1 en sus 3 textos (inicial, fallo y fallo2) y el aviso sin conexión, para verificarlos visualmente. Hoy solo están verificados en el código.
- **h10 (ayuda):** ya está en 4.
- **Jerarquía:** los números de las fichas (text-precio) pesan casi como el título de la misión al entrecerrar los ojos. Hay que bajarlos un escalón o subir el título a 28px para que héroe > dato > cuerpo > label se lean nítidos, con máximo 3 tamaños más el label.
- **Profundidad:** ya está en 4.
- **Identidad:** dos cambios:
  - Que el latido de la llama funcione de verdad: quitar initial={false} o disparar el latido con useEffect/animate al terminar Cuenta.
  - Los puntos de la semana con forma de pieza o en relieve, en vez de círculos genéricos.
- **Movimiento:** ya está en 4 en las baseline. El latido roto cuenta en identidad.
- **Encaje:** la fila de 3 fichas con el mismo peso óptico en cada estado: hoy en 16c la izquierda está apagada, el centro encendido en verde y la derecha en piedra.
