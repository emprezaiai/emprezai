# VEREDICTO revisor-visual — Misión del día (borrador día 8 + guiada día 2 + armando + resultado + celebración)
Fecha: 2026-10-07 23:59
Screenshot: docs/revisiones/mision-375.png
Usabilidad: 32/40
Craft: 16/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): FIEL
Veredicto: NO LISTA
Top defectos: (1) En el borrador de los días 5-29 la usuaria sigue inventando la respuesta desde cero. El nombre del negocio sale de un textarea vacío, más un ejemplo estático de otro rubro (Ana, tortas). No hay ninguna opción tocable armada con sus piezas. La referencia (mision-v2.png) y la landing prometen "5 nombres para tu negocio", así que sigue siendo bloqueante de venta (Sesión 6 / gate 61) · (2) Entre "Armando…" y el resultado el contenido todavía salta unos 170px: el título de "Armando" queda a ~375px y el de "Así queda" a ~207px (capturas 13 y 14), porque armando no reserva el espacio del CTA ni de las filas de abajo · (3) La celebración sigue con ~165px vacíos entre "Mañana · Día 3: tu oferta" y el CTA (captura 15), sin cambios desde la ronda 6 · (4) Encaje del borrador: "Tu nombre" va con un inset de 16px, la caja del textarea con 12px y el título del ejemplo con 12px. La 2ª fila de "Para inspirarte" (Oferta) queda tapada por el CTA fijo en la primera vista (mision-375 y 22-arriba) · (5) El borrador se guarda en silencio, sin ninguna señal visible de que se guardó. El mínimo de 15 caracteres solo se descubre al fallar. "Usar plantilla" en ink-3 parece deshabilitado aunque responde. "Armando cliente ideal…" no lleva el "tu"

## Detalle de puntaje
Usabilidad: h1:3 h2:3 h3:4 h4:3 h5:3 h6:3 h7:4 h8:3 h9:3 h10:3 = 32/40
Craft: jerarquía:3 profundidad:3 identidad:3 movimiento:4 encaje:3 = 16/20
Gate de carga cognitiva: 1 falla de 8, sin sobrecarga. Es la misma de siempre: la pregunta 3 de la misión guiada tiene 7 opciones.
CTA héroe vivo: cumple los 4.
- Contraste: #FFC23D sobre #0F0D16, ≈11:1.
- Respuesta al tocar: whileTap 0.98 (piezas.tsx:232).
- No arranca deshabilitado: en el borrador no se pasa `deshabilitado`; valida al tocar con sacudida, vibración y error junto al campo.
- Tamaño: 56px de alto, a todo el ancho y fijo abajo.
Test de fidelidad (public/landing/mision-v2.png): 0 de 6 fallos de estilo.
- modo oscuro ✓
- hue dorado ✓
- display Bricolage ✓
- radios 18-22 y píldora ✓
- densidad ✓
- relieve con hairline oro→verde ✓
- El contenido sigue sin coincidir: la referencia muestra 5 opciones de la IA y la app un textarea. Es un problema de claim (gate 61), no de estilo.
Anti-clon: no coincide con "Umbral". La display es Bricolage, no Archivo; el acento es un dorado saturado con 2ª nota verde, no latón.

## Re-revisión 7: verificación uno por uno de la lista de la ronda 6
1. "Armando…" centrado, con skeleton del resultado → CORREGIDO A MEDIAS.
   - Ya usa `flex flex-1 flex-col justify-center` y un skeleton de título + tarjeta (Mision.tsx:690-711).
   - Sigue saltando ~170px al pasar al resultado: armando no tiene barra de CTA y le faltan las filas de "Cambiar mis respuestas" y "Mañana…" (defecto 2).
2. Error de guardado en la nota del botón → CORREGIDO en el borrador: `role="alert"` dentro de `nota` (Mision.tsx:227-235).
   - Sigue pendiente en CierreSemana: ErrorGuardado queda al final de la lista (Mision.tsx:427).
   - En MisionGuiadaFlujo pasa lo mismo: va después del resultado (754).
3. "Usar plantilla" en neutro y explica por qué no se pone con texto → CORREGIDO.
   - Usa text-ink-1, o ink-3 si ya hay texto (269), y un aviso con role=status que dura 3.5s (303-305).
   - Queda un detalle: en ink-3 parece deshabilitado.
4. Ícono propio para el ejemplo → CORREGIDO. El ejemplo usa BookOpen en ink-3 (340) y la bombilla queda solo para el consejo.
5. Entrada escalonada de 60ms por bloque → CORREGIDO. `entrarBloque(i)` con delay i·0.06 y respeto de reduced-motion (171-175, 244/252/338/347).
6. "Es tu primera versión…" → CORREGIDO (331).
7. Contador 0/600 → CORREGIDO: tabular-nums y aria-label (332-334). Falta el mínimo de 15 caracteres, que no se ve.
8. Ctrl/Cmd+Enter guarda → CORREGIDO (284-289).
9. Borrador en localStorage → CORREGIDO. Lee en el estado inicial, escribe en el effect y limpia al guardar (157-163, 190-196, 213-217). La misión guiada también usa localStorage (466-472).
- Sin corregir de la ronda 6:
  - Vacío en la celebración (BAJA 7).
  - Inset de label y textarea (craft/encaje).
  - Lista "Para inspirarte" cortada por el CTA (h8).
  - Ejemplo que no se adapta al rubro (h10).

## Qué falta para que cada heurística llegue a 4
- h1 Estado: que el guardado del borrador se vea. Por ejemplo, "Borrador guardado" en ink-3 junto al contador, unos 600ms después de dejar de escribir. Hoy la usuaria no sabe que su texto sobrevive si cierra.
- h2 Lenguaje: "Armando tu cliente ideal…" con el posesivo. Hoy dice "Armando cliente ideal…", que suena a sistema.
- h3 Control: ya está en 4.
- h4 Consistencia:
  - Un solo inset interno para todo el contenido de las tarjetas: label, textarea, nota y título del ejemplo a 16px.
  - Que "Usar plantilla" con texto no use el gris de deshabilitado: mismo color, y el aviso explica.
  - El título del encabezado ("Crea el nombre de tu negocio") repite el h1 ("¿Cómo se va a llamar tu negocio?"): dejar en el encabezado solo "Día 8 · 5 min · Nombre".
- h5 Prevención: mostrar el mínimo antes de fallar, con el contador en "0/600 · mínimo 15", o un hint "Una frase basta".
- h6 Reconocer: 3 opciones tocables compuestas con sus piezas (oferta + cliente ideal) que llenen el campo al tocarlas. Al llegar la IA, las 5 del mecanismo que promete la landing.
- h7 Flexibilidad: ya está en 4.
- h8 Minimalista:
  - Quitar el vacío de la celebración: subir "Mañana · Día N" dentro de la tarjeta de la semana o reducir el py.
  - Plegar "Para inspirarte" en una fila de resumen expandible, para que no quede media lista bajo el CTA.
  - Quitar el título duplicado del encabezado.
- h9 Errores: llevar el error de guardado a la `nota` del BotonPrincipal también en CierreSemana y en el resultado guiado. Hoy queda debajo del contenido.
- h10 Ayuda: adaptar el ejemplo a `cuenta.area` (servicios, comida, etc.) o ofrecer 2 ejemplos de rubros distintos con "Usar como punto de partida".
- Craft para 4:
  - Jerarquía: un solo título por pantalla, sin el encabezado que compite con el h1, y como máximo 3 tamaños de texto en el borrador (hoy son 16/28/15/13/12).
  - Profundidad: que el radial verde de abajo a la izquierda se note (hoy el tercio inferior es un plano casi liso) y un nivel de fondo distinto para las filas de repaso frente a la tarjeta de ejemplo.
  - Identidad: que el rayo dorado o un nodo de la ruta firme la misión (por ejemplo, el nodo del día 8 en el encabezado en lugar del texto plano). Hoy el borrador podría ser de cualquier app de formularios oscura con acento amarillo.
  - Encaje: inset único de 16px y filas de repaso con el mismo radio de tarjeta o en píldora según FICHA-ARTE; hoy usan 12px, un tercer radio en pantalla.

## Hallazgos por severidad

### ALTA
1. MisionBorrador, días 5-29 (mision-375.png y capturas 21-22, lib/misiones.ts:181). El nombre se inventa desde cero y el único apoyo es "Dulce Encargo" (tortas). La landing y la referencia prometen 5 nombres generados. → FIX: componer 3 sugerencias tocables desde `usadas` (oferta + cliente ideal) en lib/misiones.ts, y retirar o cambiar la captura del día 8 en la landing hasta que exista la IA (Sesión 6).

### MEDIA
2. Fase "armando" frente a "resultado" (capturas 13 y 14, Mision.tsx:690-751). El título salta ~170px porque armando no tiene barra inferior y su bloque es más bajo. → FIX: renderizar en armando un BotonPrincipal placeholder del mismo alto (o un pb equivalente a la barra) y 2 líneas de skeleton para "Cambiar mis respuestas" y "Mañana…".
3. Celebración (captura 15, Mision.tsx:944-948). Quedan ~165px muertos entre "Mañana · Día 3" y el CTA. → FIX: meter la línea de "Mañana" dentro de SemanaEnNodos, o cambiar `justify-center` por un py fijo y que el bloque crezca hacia el CTA.
4. Error de guardado en CierreSemana (Mision.tsx:427) y en la misión guiada (754). Sigue renderizado al final del contenido, posiblemente bajo el CTA fijo. → FIX: el mismo patrón del borrador, con el error en la `nota` del BotonPrincipal.

### BAJA
5. Inset del borrador (mision-375): label "Tu nombre" a 16px, caja del textarea a 12px, título del ejemplo a 12px. → FIX: quitar `px-1` del label y la nota, o dar `p-4` a las dos tarjetas con el textarea en `-mx-0`.
6. "Para inspirarte" (mision-375, 22-arriba): la fila "Oferta" queda bajo el CTA fijo en la primera vista. → FIX: plegar en un acordeón de 1 línea o subirla encima del ejemplo.
7. Guardado silencioso del borrador y mínimo invisible (Mision.tsx:190-196, 168). → FIX: un "Guardado" en ink-3 junto al contador y "mínimo 15" en el hint.
8. Copy de armando (Mision.tsx:702): "Armando cliente ideal…" → "Armando tu cliente ideal…".
