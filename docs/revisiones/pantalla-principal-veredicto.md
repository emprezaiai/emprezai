# VEREDICTO revisor-visual — pantalla-principal (Hoy, M0)
Fecha: 2026-10-14 12:00
Screenshot: docs/revisiones/pantalla-principal-375.png
Usabilidad: 36/40
Craft: 17/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): FIEL
Veredicto: LISTA
Top defectos: 1) la ficha de semana (Hoy.tsx:272-273) no es un enlace, pero usa tarjeta-relieve-base y el chip relieve-piedra con canto, el mismo material que las fichas tocables de al lado: parece un botón que no hace nada (abierto desde la ronda 9) → quitar el canto a la tarjeta y al chip (superficie plana o hundida) · 2) fila de 3 fichas: "aviso de noche" (Hoy.tsx:251-254) se parte en 2 líneas, con la campana de 11px colgando, y deja "días de racha" unos 37px por encima de "piezas listas" y "semana N" (375 y 360, todas las capturas) → acortar a "de noche" con whitespace-nowrap y alinear las 3 etiquetas a la misma línea base · 3) jerarquía: los números de las fichas (text-precio extrabold) pesan casi como el h1 de la misión al entrecerrar los ojos → bajarlos un escalón o subir el h1 a 28px · 4) el insight de racha rota (Hoy.tsx:104, captura 16b) es el único insight de riesgo sin el arranque en negrita → poner "Tu racha vuelve a empezar hoy." en strong · 5) siguen sin capturarse los avisos de la pieza 1 (inicial, fallo, fallo2), el aviso sin conexión ni el nuevo SinConexion del Marco en modo servidor → capturar esos 5 estados

## Detalle de puntaje
Usabilidad: h1:4 h2:4 h3:3 h4:3 h5:4 h6:4 h7:4 h8:3 h9:3 h10:4
Craft: jerarquía:3 profundidad:4 identidad:3 movimiento:4 encaje:3

Capturas puntuadas (build actual):
- pantalla-principal-375.png (día 8, racha en juego)
- 375: app/16-hoy-dia2-hecho-arriba, app/16b-hoy-racha-rota-arriba
- 360: app-360/09-hoy-dia2-pendiente-arriba

Código: components/interna/Hoy.tsx, components/interna/Marco.tsx, app/app/layout.tsx.

## Re-revisión 10: regresiones
- Cambio de marca: la cabecera dice "EMPREZAI" (Hoy.tsx:134) y el asunto del correo de ayuda también (Hoy.tsx:128). El título se ve centrado y no se recorta ni a 375 ni a 360. Sin regresión.
- Puerta en servidor (app/app/layout.tsx): sin sesión, redirige a /login; sin acceso, a /login?estado=sin-acceso. Es fail-closed: sin Supabase solo se entra con VISTA_PREVIA=1.
- Marco en modo servidor: muestra el esqueleto (EsqueletoApp) mientras carga y, si falla sin copia local, la pantalla SinConexion con reintentar (Marco.tsx:84-89). Suma a h1 y h9, aunque no hay captura de ese estado.
- La ventana de celebración vive fuera de Hoy y no cambia su composición.
- Hoy.tsx no tiene cambios de layout desde la ronda 9: los 5 defectos de afinado siguen abiertos tal cual.
- Ningún criterio baja.

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
- Bricolage y Instrument.
- Dorado solo en el CTA, la misión, la llama viva y el botón central.
- Verde solo en el progreso hecho.
