# VEREDICTO revisor-visual — pantalla-principal (Hoy, M0)
Fecha: 2026-10-07 23:58
Screenshot: docs/revisiones/pantalla-principal-375.png
Usabilidad: 36/40
Craft: 17/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): FIEL
Veredicto: LISTA
Top defectos: 1) la ficha de semana (Hoy.tsx:272) ya no es un enlace, pero sigue usando el mismo material de relieve que sus vecinas tocables (tarjeta-relieve-base con canto 0 2px 0, y el chip relieve-piedra con canto): parece un botón que no hace nada → quitarle el canto a la tarjeta y al chip (superficie plana o hundida), así se lee como dato y no como control · 2) fila de 3 fichas: el micro-label "aviso de noche" se parte en 2 líneas, con la campana de 11px colgando a media altura, y empuja "días de racha" unos 37px por encima de "piezas listas" y "semana N" (capturas 375 y 360) → acortar a "19:00" o "de noche" en 1 línea con whitespace-nowrap, y alinear las 3 etiquetas a la misma línea base · 3) jerarquía: los números de las fichas (text-precio, extrabold) pesan casi como el título de la misión al entrecerrar los ojos → bajarlos un escalón (text-2xl→xl) o subir el h1 a 28px · 4) el insight de racha rota (Hoy.tsx:104) es el único insight de riesgo sin arranque en negrita → poner "Tu racha vuelve a empezar hoy." en strong, como el de racha en juego · 5) Hoy no tiene ninguna acción reversible con deshacer, y faltan capturas del aviso de pieza 1 (inicial, fallo, fallo2) y del aviso sin conexión → capturar esos 4 estados; si se quiere un 4 en h3, agregar "recordármelo hoy" con toast "Deshacer"

## Detalle de puntaje
Usabilidad: h1:4 h2:4 h3:3 h4:3 h5:4 h6:4 h7:4 h8:3 h9:3 h10:4
Craft: jerarquía:3 profundidad:4 identidad:3 movimiento:4 encaje:3

Capturas puntuadas (todas del build actual):
- pantalla-principal-375.png
- 375: app/04, app/16-arriba, app/16b-arriba, app/16c-arriba, app/17-final, app/17b-arriba
- 360: app-360/09-arriba

Código: components/interna/Hoy.tsx, components/interna/Marco.tsx (esqueleto de carga EsqueletoApp), lib/borradores.ts (avanceBorrador), app/globals.css (tarjeta-relieve, tarjeta-relieve-base, relieve-piedra-apagada).

## Gate de carga cognitiva
Falla 1 de 8 (no crítico):
- Falla el ítem "cero elementos que parezcan interactivos y no hagan nada": la ficha de semana tiene el relieve de las fichas tocables (defecto 1).
- Hay una acción primaria por estado.
- El insight ocupa 4 líneas como máximo.
- Las filas visibles son 1 o 2.
- "Qué sigue" se entiende en el CTA, en la fila de mañana y en la fila de la semana del día 1.

## CTA héroe vivo
**Estado pendiente: cumple los 4.**
- Contraste: .boton-oro, unos 11:1.
- Tap: :active.
- Habilitado: es un Link y nunca está disabled.
- Tamaño: h-14, ancho completo, en la primera vista.

**Estado hecho:** fila-pildora con active:scale-[0.98], h-14.

## Test de fidelidad (referencia-usuario-1.jpg = contrato de composición, colores de la C)
- Modo: OK.
- Hue: OK, según el alcance del contrato.
- Display grotesk: OK.
- Radios 20/999/12: OK.
- Densidad: FALLO LEVE. El panel de insight no aparece en la referencia.
- Profundidad: OK.

Resultado: 1 de 6 fallos → FIEL.

Valores de FICHA-ARTE comprobados en el screenshot:
- Fondo #0F0D16 con radial dorado.
- Superficies #1A1622 y #231D2E.
- Hundido #0A0910 en el insight.
- ink 1/2/3.
- Bricolage + Instrument.
- Radios 20, 999 y 12.
- Verde solo en progreso hecho: con 0 piezas la barra no tiene punto y el chip de piezas está apagado (16c).
- Llama: oro viva, ámbar en juego, piedra apagada en 0.

Sin desvíos.

## Re-revisión 9: los 5 defectos de la ronda 8, uno por uno

**1. [CORREGIDO] Latido de la llama**
- Hoy.tsx:241-243 pasa de initial={false} a initial={{ scale: 1 }}, con los keyframes [1, 1.15, 1] y un delay de 0.95s.
- Motion ahora anima al montar.
- Solo late con la racha viva; con reduced-motion no se anima.

**2. [CORREGIDO] Verde con 0 piezas**
- Hoy.tsx:261: con 0 piezas el chip usa relieve-piedra-apagada.
- Hoy.tsx:201: el ancho es piezas/30 sin mínimo, así que la barra no pinta nada.
- Se ve en 16c.

**3. [CORREGIDO] Avance del borrador en la tarjeta**
- Hoy.tsx:184-188 muestra "Ya respondiste N de 3: te falta poco" o "Tu borrador te espera, tal como lo dejaste".
- Se ve en 17b.
- Matiz: avanceBorrador usa Math.max(paso, respuestas), así que podría mostrar "3 de 3: te falta poco".

**4. [CORREGIDO] Un único anunciador**
- Hoy.tsx:319: un solo role=status aria-live=polite, siempre montado, en sr-only, que solo cambia de texto (Listo, fallo, fallo2, sin conexión).
- Las versiones visibles ya no llevan role.

**5. [CORREGIDO CON MATIZ] Fichas de semana y de racha**
- La ficha de semana pasó a ser un div informativo, sin destino duplicado.
- La ficha de racha lleva el micro-label "aviso de {momento}".
- Matices: la ficha de semana todavía parece tocable (defecto 1) y el micro-label se parte en 2 líneas (defecto 2).

**Balance:** 36/40 (antes 35) · 17/20 (igual) · FIEL.
- Sube h1: los 3 puntos pedidos están hechos y la carga tiene esqueleto.
- Pasa el gate doble (≥36 y ≥16) → LISTA.
- Los defectos de la lista quedan como afinado: ninguno baja un criterio a 2.
