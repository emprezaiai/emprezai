# VEREDICTO revisor-visual — pantalla-principal (Hoy, M0)
Fecha: 2026-10-15 17:30
Screenshot: docs/revisiones/pantalla-principal-375.png
Usabilidad: 36/40
Craft: 17/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): FIEL
Veredicto: LISTA
Top defectos: 1) jerarquía: los números de las fichas (text-precio extrabold) siguen pesando casi como el h1 de la misión al entrecerrar los ojos, y las fichas 3D saturadas suman peso a la fila (abierto desde la ronda 10, diferido como pulido) → bajar los números un escalón o subir el h1 a 28px · 2) fila de datos: ya no hay salto de línea, pero "días de racha" queda unos 41px por encima de "piezas listas" y "semana N". Las líneas finales se alinean ("de noche" con las otras dos), pero las etiquetas equivalentes no (375 y 360) → llevar "de noche" a la fila del chip de la llama (a su derecha, arriba) para que las 3 etiquetas compartan línea base · 3) las etiquetas del aviso no son paralelas: "de mañana" y "de noche" llevan preposición y "mediodía" no (Hoy.tsx:263); con whitespace-nowrap, un texto más largo se desbordaría a 360 → usar "mediodía" sin preposición en las 3 ("mañana / mediodía / noche"), o comprobar que "al mediodía" cabe a 360.

## Detalle de puntaje
Usabilidad: h1:4 h2:4 h3:3 h4:3 h5:4 h6:4 h7:4 h8:3 h9:3 h10:4
Craft: jerarquía:3 profundidad:4 identidad:3 movimiento:4 encaje:3

Capturas puntuadas (build nuevo):
- pantalla-principal-375.png
- app/16b-hoy-racha-rota-arriba.png
- app-360/17-hoy-demo-dia8-arriba.png
- Recorte: fichas/hoy-datos.png

Código: components/interna/Hoy.tsx (líneas 103-116 y 236-311), components/app/FichaViva.tsx.

## Re-revisión 13: verificación de los defectos de la ronda 12

**Defecto 1, etiqueta del aviso: cerrado en lo visible, con un resto.**
- Hoy.tsx:261-264 usa text-xs, whitespace-nowrap y BellRing de 12px.
- En todas las capturas, a 375 y a 360, "de noche" ocupa una sola línea sin campana colgando.
- La línea final de las 3 fichas queda alineada.
- Resto: "días de racha" sigue más arriba que "piezas listas" y "semana N" (defecto 2 nuevo, ahora de nivel ojo entrenado). Encaje se mantiene en 3.

**Defecto 2, movimiento: cerrado.**
- La llama titila 2 ciclos (repeat 1, 1,6s, linear, como pide 41) y se queda quieta.
- El Set `hechos` del módulo, con `clave` y useState perezoso, lanza cada gesto una sola vez por visita, así que volver a Hoy desde la barra no lo repite.
- Solo marca `hechos` si activo es true. Por eso, si la racha pasa de 0 a viva en la misma visita, el gesto sí se dispara, y eso es correcto.
- Los cubos siguen en bucle. Son el detalle firma del contrato y ya estaban aprobados; ahora son los únicos 2 bucles de la pantalla, una cantidad razonable.
- Movimiento reducido: sigue cubierto (mover = activo && !reduce && !repetido).

**Defecto 3, calendario: cerrado.**
- El "sello" (escala 1 → 1,18 → 0,94 → 1 con un pequeño y) se lee como marcar, no como sacudida de error.
- activo={enSemana > 0}: con 0/7 queda quieto (captura 375, semana 2) y con 2/7 sella (16b).
- Tiene significado. Movimiento sube de 3 a 4.

**Defecto 4, jerarquía de los números:** sin tocar, diferido por el constructor. Sigue abierto (pasa a ser el defecto 1). Jerarquía se mantiene en 3.

**Defecto 5, racha rota: cerrado.**
- Hoy.tsx:108 lleva el strong "Tu racha vuelve a empezar hoy." y la captura 16b lo muestra en ink-1 semibold.
- Es coherente con los otros mensajes de riesgo.

**Regresiones:** ninguna.
- Paleta, radios, CTA y composición son los mismos de la ronda 12.
- Sin desbordes a 360.
- La regla de carga cognitiva sigue en 8 de 8.

**Puntaje:** la usabilidad se mantiene en 36. Sigue h4 en 3 por la desalineación que queda en la fila, y h8 en 3 por la jerarquía. Craft sube de 16 a 17 por movimiento.

**Fidelidad:** FIEL, 1 de 6 fallos (densidad leve, sin cambios).

## CTA héroe vivo
**Pendiente: cumple los 4, sin cambios.**
- .boton-oro con contraste de unos 11:1.
- Responde con :active.
- Es un Link que nunca está disabled.
- h-14 a todo el ancho, en la primera vista.

## Test de fidelidad (referencia-usuario-1.jpg, contrato de composición)
- Modo: OK.
- Hue (alcance del contrato): OK.
- Display grotesk: OK.
- Radios 20/999/12: OK.
- Densidad: FALLO LEVE.
- Profundidad: OK.

Resultado: 1 de 6 → FIEL.

FICHA-ARTE comprobada en el screenshot, sin desvíos:
- Fondo #0F0D16 con radial dorado.
- Superficies #1A1622 y #231D2E; hundido #0A0910.
- Bricolage e Instrument, más Montserrat solo en el logo.
- Dorado y ámbar en la llama según su estado.
- Verde en el progreso y en las piezas.
- Turquesa solo en "AI".

---

## Historial — Re-revisión 12 (LISTA 36·16): fichas vivas y la semana como enlace
- Se cerraron el defecto 1 de la ronda 11 (la semana ya es un enlace) y el defecto 5 (la marca se anunciaba dos veces).
- Movimiento bajó de 4 a 3 por dos motivos:
  - En la primera vista había 3 bucles permanentes (2 cubos y la llama, con easeInOut).
  - Los gestos se repetían en cada regreso a Hoy, y el "tic" del calendario no tenía significado y se disparaba con 0/7.
- Seguían abiertos:
  - "aviso de noche" en 2 líneas;
  - la jerarquía de los números;
  - el insight de racha rota sin negrita.
- Todo eso se corrigió en la ronda 13, salvo la jerarquía.

## Historial — Re-revisión 11 (LISTA 36·17): cambio de cabecera a la marca
- Marca centrada a ojo, subordinada a los chips de 44px y fiel al logo original (Z fijada por la ficha).
- Montserrat 800 solo en el nombre del logo y turquesa solo en "AI".
