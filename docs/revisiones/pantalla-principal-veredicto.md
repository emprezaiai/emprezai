# VEREDICTO revisor-visual — pantalla-principal (Hoy, M0)
Fecha: 2026-10-15 10:00
Screenshot: docs/revisiones/pantalla-principal-375.png
Usabilidad: 36/40
Craft: 17/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): FIEL
Veredicto: LISTA
Top defectos: 1) la ficha de semana (Hoy.tsx:275-276) no es un enlace, pero usa tarjeta-relieve-base y el chip relieve-piedra con canto, el mismo material que las fichas tocables de al lado: parece un botón que no hace nada (abierto desde la ronda 9) → quitar el canto a la tarjeta y al chip (superficie plana o hundida) · 2) fila de 3 fichas: "aviso de noche" (Hoy.tsx:254-257) se parte en 2 líneas, con la campana de 11px colgando, y deja "días de racha" unos 37px por encima de "piezas listas" y "semana N" (375 y 360, todas las capturas) → acortar a "de noche" con whitespace-nowrap y alinear las 3 etiquetas a la misma línea base · 3) jerarquía: los números de las fichas (text-precio extrabold) pesan casi como el h1 de la misión al entrecerrar los ojos → bajarlos un escalón o subir el h1 a 28px · 4) el insight de racha rota (Hoy.tsx:104, captura app-360/16b) sigue siendo el único insight de riesgo sin el arranque en negrita → poner "Tu racha vuelve a empezar hoy." en strong · 5) NUEVO, accesibilidad de la marca (Marca.tsx:41-44): NombreMarca es texto visible y no está oculto a lectores de pantalla, y además se añade un sr-only "EMPREZAI", así que el lector anuncia el nombre dos veces → borrar el sr-only o marcar NombreMarca con aria-hidden dentro de Marca · Siguen sin capturarse los avisos de la pieza 1 (inicial, fallo, fallo2), el aviso sin conexión y el SinConexion del Marco en modo servidor.

## Detalle de puntaje
Usabilidad: h1:4 h2:4 h3:3 h4:3 h5:4 h6:4 h7:4 h8:3 h9:3 h10:4
Craft: jerarquía:3 profundidad:4 identidad:3 movimiento:4 encaje:3

Capturas puntuadas (build actual):
- pantalla-principal-375.png (día 8, racha en juego)
- 360: app-360/16-hoy-dia2-hecho-arriba, app-360/16b-hoy-racha-rota-arriba

Código: components/interna/Hoy.tsx, components/app/Marca.tsx.

## Re-revisión 11: regresiones (cambio de cabecera a la marca)
- Centrado: a 375 el bloque de la marca queda unos 2,5px a la izquierda del eje, y a 360 unos 3px. No se nota a simple vista. Sin regresión.
- Tamaño frente a los chips de 44px:
  - El isotipo mide 24px de cuadro y el nombre tiene unos 11-12px de altura de mayúscula.
  - La marca queda subordinada a los chips sin perderse y la altura de la cabecera no cambia (h-16).
  - Sin recorte ni salto de línea a 360, gracias a whitespace-nowrap.
- Fidelidad al logo original (docs/marca/logo-horizontal-original.png):
  - El isotipo es el original, con el cuadro verde, el borde con halo verde-dorado y el rayo con circuito.
  - El nombre va en grotesca geométrica extrabold de mayúsculas, con "AI" en turquesa, como el original.
  - El original dice "EMPRESAI" con S. La ficha (línea MARCA 2026-10-14) fija la Z como decisión de la dueña, así que no cuenta como desvío.
  - A 24px el halo casi no se ve; es aceptable a ese tamaño.
- FICHA-ARTE: Montserrat 800 solo aparece en el nombre del logo, como autoriza la excepción de la ficha, y el turquesa se usa solo en "AI". El turquesa no se cuela en ningún otro elemento de Hoy.
- El resto de Hoy.tsx no cambia de composición desde la ronda 10: los defectos 1-4 siguen abiertos tal cual.
- Ningún criterio baja ni sube.

## Gate de carga cognitiva
Falla 1 de 8 (no crítico): "cero elementos que parezcan interactivos y no hagan nada" (la ficha de semana, defecto 1).

## CTA héroe vivo
**Pendiente: cumple los 4.**
- .boton-oro con contraste de unos 11:1.
- Responde con :active.
- Es un Link que nunca está disabled.
- h-14 a todo el ancho, en la primera vista.

**Hecho:** fila-pildora con active:scale-[0.98], h-14.

## Test de fidelidad (referencia-usuario-1.jpg, contrato de composición)
- Modo: OK.
- Hue (alcance del contrato): OK.
- Display grotesk: OK.
- Radios 20/999/12: OK.
- Densidad: FALLO LEVE (el panel de insight no está en la referencia).
- Profundidad: OK.

Resultado: 1 de 6 → FIEL.

FICHA-ARTE comprobada en el screenshot, sin desvíos:
- Fondo #0F0D16 con radial dorado.
- Superficies #1A1622 y #231D2E; hundido #0A0910.
- Bricolage e Instrument, más Montserrat solo en el logo.
- Dorado solo en el CTA, la misión, la llama viva y el botón central.
- Verde solo en el progreso hecho.
- Turquesa #2cf8c8 solo en "AI".
