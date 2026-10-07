# VEREDICTO revisor-visual — Misión del día (misión guiada día 2 + aviso + día 8 IA + celebración)
Fecha: 2026-10-07 18:30
Screenshot: docs/revisiones/mision-375.png
Usabilidad: 28/40
Craft: 15/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): FIEL
Veredicto: NO LISTA
Top defectos: (1) desde el día 5 la misión no se puede completar: la ruta se detiene, la racha se rompe y "Te avisamos" no tiene ningún mecanismo detrás · (2) vacío muerto en P1/P2 (35%), en la celebración (tercio inferior) y en el aviso "ya hecha" (50%) · (3) la concordancia del retrato sigue rota ("Dueños… no le llegan") · (4) la firma de FICHA-ARTE "la pieza vuela a Mi Empresa" no está implementada · (5) desencajes: el título salta de 16 a 24px entre fases, la opción marcada se desplaza ~1.5px y hay una franja clara bajo la barra inferior

## Detalle de puntaje
Usabilidad: h1:2 h2:3 h3:3 h4:3 h5:3 h6:3 h7:3 h8:2 h9:3 h10:3 = 28/40
Craft: jerarquía:3 profundidad:3 identidad:3 movimiento:3 encaje:3 = 15/20
Gate de carga cognitiva: 0-1 fallas de 8, sin sobrecarga. La pregunta 3 sigue con 7 opciones (6 redes + "Otra cosa"), pero la rejilla de 2 columnas con círculos vacíos la vuelve fácil de recorrer, así que cuenta como media falla.
CTA héroe vivo: cumple los 4. Contraste #FFC23D sobre #0F0D16 ≈ 11:1. Tiene estado al tocar (`.boton-oro:active` + whileTap 0.98). "Continuar" nunca arranca deshabilitado: al tocarlo sin elegir avisa "Elige al menos una". Mide 56px de alto, a todo el ancho y fijo abajo.
Test de fidelidad (referencia public/landing/mision-v2.png, 1 de 6 fallos): modo ✓ · hue del acento ✓ · clase de la display ✓ (Bricolage, grotesk) · radios ✓ (píldora permitida por FICHA-ARTE §Radio) · sombras/relieve ✓ · densidad ✗. En P1 y P2 las opciones siguen sueltas, sin la tarjeta contenedora con hairline de la referencia, y queda un 35% vacío abajo. La pregunta 3 y el resultado ya anclan el CTA abajo, como la referencia.
Verificado en código: reduced-motion en todo el flujo ✓ · aria-live en "armando" y en la celebración ✓ · Enter y Escape en "Otra cosa" ✓ · borrador en sessionStorage ✓ · doble toque bloqueado con `bloqueado` + `disabled` ✓ · conteo 0→N con `animate()` ✓ · conector verde con scaleX ✓ · BotonPrincipal/barra-inferior compartidos con el recorrido ✓ · aviso "te avisamos" sin mecanismo ✗ (grep sin resultados) · la pieza no "vuela" ✗.

## Re-revisión 2: qué se corrigió
1. Lenguaje de desarrollo en el día 8 → CORREGIDO a medias. El texto ya habla en el mundo de la usuaria y hay una acción principal fija ("Repasar mis piezas") con la lista de piezas que usa la IA. Lo que sigue: la misión no se puede completar (ver ALTA 1).
2. Botón principal suelto en la página → CORREGIDO en la pregunta 3 y en el resultado (barra-inferior sticky; a 360px "Continuar" se ve sin hacer scroll). PENDIENTE en la celebración y en el aviso "ya hecha": el CTA sigue en medio del contenido y abajo queda vacío.
3. Pregunta 3 sin señal de selección múltiple → CORREGIDO. Rejilla de 2 columnas, círculo vacío de 24px en cada opción y "N elegidas" debajo del CTA.
4. Jerarquía de la pregunta → CORREGIDO. Encabezado compacto de 16px, text-pregunta de 28px y TituloAcento con 1-3 palabras en dorado. Efecto colateral: el título salta a 24px al pasar a "armando".
5. Celebración → CORREGIDO a medias. La pieza es la protagonista, el tick "En Mi Empresa" se enciende con resorte, hay chispas, el conteo va de 0 a N y el conector es verde. PENDIENTE: la pieza no "vuela" a Mi Empresa (firma de FICHA-ARTE:46-47).
6. Concordancia del retrato → NO CORREGIDO. Se cambiaron los rótulos ("Su mayor dolor / Su meta / Canales"), pero la opción de dolor sigue en singular ("no le llegan clientes nuevos") con un sujeto plural ("Dueños de pequeños negocios"). Se ve en la captura 14 y se guarda en Mi Empresa.
7. Respuestas que se pierden al salir → CORREGIDO (borrador en sessionStorage, Mision.tsx:181-206).
8. Bombilla desalineada → CORREGIDO (`items-start` + `mt-0.5`).
9. Conector gris → CORREGIDO (segmento verde con scaleX animado).
10. Chips de respuesta largos o con otro estilo → CORREGIDO a medias. `truncate` ✓ y píldora ✓, pero siguen sin el prefijo del tema ("Edad:", "Dolor:").
11. Doble toque → CORREGIDO. Queda una carrera menor: los chips de respuestas anteriores siguen activos durante los 300 ms del temporizador. Si se toca uno, `setPaso(i)` y `setPaso(paso + 1)` compiten.
12. Escape en "Otra cosa" → CORREGIDO.

## Hallazgos por severidad

### ALTA
1. Mision.tsx:44 y 109-163 + lib/cuenta.ts:206 (captura 21) — Del día 5 en adelante no hay forma de guardar la pieza. Como `diaActual = piezasListas + 1`, una clienta real queda detenida en el día 5, su racha se rompe al día siguiente sin ningún aviso, y 26 de los 30 días de la ruta que pagó no se pueden hacer. Además, "Te avisamos apenas esté lista" promete un aviso que no existe: un grep en lib/, components/ y app/ no encuentra ningún mecanismo. Y la referencia de la landing (mision-v2.png) vende el día 8 funcionando, con 5 nombres generados. → FIX: implementar la misión con IA (o una misión guiada de respaldo para los días 5 y siguientes que sí guarde la pieza) antes de vender. Mientras tanto, congelar la racha en los días bloqueados y no prometer un aviso sin mecanismo.
2. Celebración (captura 15) y Aviso (Mision.tsx:49-65, captura 07) — Hay vacío muerto: el tercio inferior en la celebración y la mitad inferior en "Hoy ya armaste tu pieza". El CTA va dentro del contenido y no en la barra inferior, a diferencia del resultado y de la pregunta 3: es el mismo flujo con dos ubicaciones para el botón. En P1 y P2 (capturas 10-11) también queda un 35% vacío bajo las opciones. → FIX: usar `mt-auto` + barra-inferior para el CTA de la celebración y del aviso, y centrar el bloque en el alto disponible. En P1/P2, agrupar las opciones en una tarjeta con hairline, como la referencia.

### MEDIA
3. lib/misiones.ts:61 y 80 (captura 14) — "Dueños de pequeños negocios… Su mayor dolor: no le llegan clientes nuevos": la concordancia sigue rota en la pieza que se guarda. El día 3 (línea 116) da por hecho que el sujeto es plural ("que quieren"), así que se rompe si la respuesta del cliente está en singular. → FIX: redactar las opciones de dolor sin pronombre ("Faltan clientes nuevos", "No saber cuánto gana") o conjugar le/les según el número del sujeto.
4. Mision.tsx:543-562 (captura 15) — Falta la firma de motion de FICHA-ARTE ("al guardar una pieza, vuela a 'Mi Empresa' y el tick se enciende en verde"): la tarjeta aparece en su lugar y no viaja a ningún lado. → FIX: después de que se encienda el tick, animar la tarjeta hacia el CTA "Ver en Mi Empresa" (translate + scale, o un layoutId compartido) y que el tick se encienda al aterrizar.
5. Mision.tsx:281 (capturas 12→13) — Dentro del mismo flujo, el título de la misión pasa de 16px (preguntas) a 24px (armando y resultado). El encabezado "salta" justo cuando se arma la pieza. → FIX: mantener el encabezado compacto durante todo el flujo guiado; el protagonista del resultado es la pieza, no el título.

### BAJA
6. globals.css:184 vs 196 (captura 12) — La opción no marcada tiene borde de 1px y la marcada de 2px, así que al marcar, el texto y el círculo se desplazan ~1.5px ("Instagram" y "WhatsApp" quedan corridos respecto a "Facebook" y "TikTok"). → FIX: un borde de 2px en ambos estados (transparente/rgba en el no marcado), o marcar con un inset box-shadow.
7. Barra inferior (capturas 12, 14 y 21) — Debajo de `.barra-inferior` asoma una franja de unos 32px con el fondo radial más claro, y se ve un corte horizontal bajo el CTA. → FIX: que la barra llegue al borde de la ventana (quitar el padding inferior del contenedor padre o extender el degradé con `pb` + safe-area).
8. Mision.tsx:117 (captura 21) — "Crea el nombre de tu / negocio" deja una viuda en el título de 24px. → FIX: `text-balance` en el título del encabezado.
9. Mision.tsx:296 — Los chips de respuestas anteriores no tienen prefijo de tema, y con selección múltiple el truncado oculta qué pregunta fue. → FIX: un prefijo corto ("Edad:", "Dolor:", "Redes:").
10. Mision.tsx:291 — Los chips de respuestas no se bloquean durante el temporizador de 300 ms (carrera entre `setPaso`). → FIX: `disabled={bloqueado}` en esos chips.
