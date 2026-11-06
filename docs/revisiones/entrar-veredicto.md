# VEREDICTO revisor-visual — entrar (login)
Fecha: 2026-11-06 22:00
Screenshot: docs/revisiones/entrar-375.png
Usabilidad: 34/40
Craft: 16/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos: (1) REGRESIÓN en 04, error de servidor: dice "si sigue, escríbenos." sin enlace ni dirección; SoporteLinea no se pinta en el estado error (Acceso.tsx:621-631) · (2) carrera blur→submit: si se toca el CTA directo desde el campo con "gmial.com", el onBlur fija la sugerencia, el submit la encuentra igual a la sugerida y ENVÍA al primer toque al dominio mal escrito (L176-182 + L579) · (3) las terminaciones mal escritas ya no se detectan fuera de gmail: hotmail.con, outlook.con, yahoo.con, hotmail.cm y live.comm salen por NOMBRES_REALES sin sugerencia (L60). ".con" es el tipeo más frecuente en teclado español, y la ronda 3 sí lo atrapaba · (4) el soporte sigue siendo el Gmail provisional emprezaiai@gmail.com (legal.ts:7); depende de comprar el dominio · (5) "Copiar" falla en silencio si no hay permiso de portapapeles: el catch vacío no avisa nada (L74-76), y justo ese caso se da en el navegador interno de Instagram/Facebook, por donde entra el tráfico de anuncios

Detalle usabilidad: h1:4 h2:3 h3:4 h4:3 h5:3 h6:4 h7:3 h8:4 h9:3 h10:3
Detalle craft: jerarquía:4 profundidad:3 identidad:3 movimiento:3 encaje:3
Copy: N-A. Es una pantalla de acceso para quien ya pagó; no vende.
Fidelidad: N-A (no hay referencia para esta pantalla). Contra FICHA-ARTE: fondo #0F0D16 con radial dorado. El dorado solo aparece en el CTA, en "tu ruta" y en el nodo "Hoy"; la hairline dorada→verde está en la tarjeta de la ruta y el aviso usa #FF9F43. Bricolage en display, Instrument Sans en body y Montserrat solo en el logo. Escala 28/16/13, píldoras de 999px y radius-card. Todo coincide.

## Re-revisión 2026-11-06 (4ª ronda, commit 355414a)

Insumos puntuados: entrar-375.png y entrar/01 … 06 (06 = "gmial.com" con la sugerencia mostrada al salir del campo). Código: components/acceso/Acceso.tsx (sugerirCorreo, distancia con transposiciones, SoporteLinea, contenedor aria-live) y lib/legal.ts.

Gate de carga cognitiva: 0 fallas de 8.
CTA héroe vivo: cumple los 4, sin cambios.

### Defectos de la ronda anterior, uno por uno
1. Gmail provisional: SIGUE ABIERTO (depende del dominio; ya está anotado como siguiente paso de configuración).
2. Falsos positivos y parpadeo de la sugerencia: CERRADO en lo que se pidió, con dos huecos nuevos.
   - Lo que funciona: NOMBRES_REALES protege hotmail.cl, live.cl, outlook.cl, ymail, mail y email; se compara solo el nombre y la distancia cuenta las transposiciones; la sugerencia ya no aparece mientras se escribe.
   - Huecos nuevos: ".con" ya no se atrapa fuera de gmail (top 3) y la sugerencia por onBlur anula el freno del primer toque (top 2).
3. Formato de soporte inconsistente y "copia" sin acción: CERRADO A MEDIAS. SoporteLinea es idéntica en 02, 03 y pronto, con un botón Copiar de 44px. Pero el estado error (04) PERDIÓ el soporte que tenía en la ronda 3 (top 1), y Copiar no tiene alternativa si falla el portapapeles (top 5).
4. Párrafo de 03: CERRADO. "Escribimos a … Si tiene una compra activa, te llegan tu enlace y tu código; si no, te explicamos qué hacer." Queda en 3 líneas, sin palabra huérfana y sin mezcla de registro.
5. Sugerencia sin movimiento y sin anuncio fiable: CERRADO. El contenedor `aria-live` queda siempre montado (L594) y la sugerencia entra con AnimatePresence en 150ms, respetando reduced-motion.

### Por qué la usabilidad baja de 35 a 34
- h9 baja de 4 a 3. Es una regresión visible en 04: el mensaje dice "escríbenos" sin decir dónde, justo en el momento en que más se necesita esa salida.
- h5 sigue en 3. La prevención mejoró en lo que se ve, pero dos caminos comunes la esquivan: tocar el CTA directo desde el campo (top 2) y escribir ".con" con hotmail, outlook o yahoo (top 3).
- h10 sigue en 3 por el Gmail provisional.

Para llegar a 36:
- Devolver SoporteLinea al error: h9 vuelve a 4 (35).
- Corregir la carrera y ".con": h5 sube a 4 (36).
- Cambiar al correo del dominio: h10 sube a 4 (37).

### Craft 16/20 (igual)
- Jerarquía 4.
- Encaje 3: la línea de soporte está unificada, pero el estado error queda sin ella y la sugerencia empuja el CTA unos 44px al aparecer.
- Profundidad, identidad y movimiento sin cambios de ancla.

### Verificación pendiente
- Top 2 sale de leer el código y conviene confirmarlo con una prueba. En Playwright: llenar "carla@gmial.com", hacer click directo en "Enviarme mi enlace de acceso" sin Tab ni Enter, y esperar que NO salga POST /api/acceso/enviar y que la sugerencia quede visible.
- El envío real (Resend + EMAIL_FROM) sigue sin conectar; 03 y 04 usan un servidor simulado.

## Hallazgos por severidad

### ALTO
1. **El error de servidor no tiene a quién escribir** (Acceso.tsx:621-631). → FIX: con `falla === 'servidor'`, pintar `<SoporteLinea />` debajo del mensaje y cerrar la frase con "escríbenos aquí:".

### MEDIO
2. **La sugerencia por onBlur anula el freno del primer toque** (L176-182, L579). → FIX: guardar en un `useRef` la sugerencia ya avisada dentro de `enviar`. Solo se deja pasar si `avisada.current === sugerido`; el onBlur no marca nada como avisado. Agregar la prueba de Playwright descrita arriba.
3. **Las terminaciones mal escritas no se corrigen en hotmail, outlook, yahoo, icloud ni live** (L60). → FIX: antes del `return` por NOMBRES_REALES, normalizar la terminación con un mapa {.con, .cpm, .cm, .om, .comm, .vom, .xom → .com} y sugerir si cambió. No tocar ".co" (Colombia) fuera de gmail.
4. **El soporte es un Gmail provisional** (legal.ts:7). → FIX: soporte@<dominio> al comprar el dominio (una línea).

### BAJO
5. **Copiar falla en silencio** (L74-76). → FIX: en el catch, seleccionar el `<span>` del correo con Selection/Range y mostrar "Mantén presionado para copiar" durante 3 s.

## Historial — re-revisión 2026-11-06 (3ª ronda, commit 3bf02c2): NO LISTA 35·16·N-A
Top defectos de entonces: (1) el Gmail provisional visible en 4 estados · (2) falsos positivos de la sugerencia (hotmail.cl, mail.com, ymail.com…) y el parpadeo al escribir · (3) soporte con 4 formatos y un "copia" sin acción · (4) párrafo de 03 de 4 líneas con mezcla de registro · (5) la sugerencia sin movimiento y con un aria-live que no anunciaba de forma fiable. Detalle usabilidad: h1:4 h2:3 h3:4 h4:3 h5:3 h6:4 h7:3 h8:4 h9:4 h10:3. Detalle craft: jerarquía:4 profundidad:3 identidad:3 movimiento:3 encaje:3. Estado en esta ronda: 4 y 5 cerrados; 2 cerrado con dos huecos nuevos; 3 a medias (regresión en 04); 1 abierto (depende del dominio).

## Historial — re-revisión 2026-11-06 (2ª ronda, commit 19e6c5b): NO LISTA 34·16·N-A
Top defectos de entonces: (1) el soporte solo por mailto, sin la dirección a la vista · (2) sin prevención de errores de tipeo en el dominio · (3) párrafo ambiguo en "enviado" · (4) "escribirles" en lugar de "escríbenos" · (5) restos de text-sm. Detalle usabilidad: h1:4 h2:3 h3:3 h4:3 h5:3 h6:4 h7:3 h8:4 h9:4 h10:3. Detalle craft: 4·3·3·3·3. En la 3ª ronda se cerraron 1, 3, 4 y 5; 2 quedó a medias.

## Historial — re-revisión 2026-11-06 (1ª ronda): NO LISTA 32·15·N-A
Top defectos de entonces: (1) 5 tamaños de texto · (2) el correo de soporte en texto rojo que no se podía tocar · (3) el error no se borraba al corregir el correo · (4) "Reactivar mi plan" era solo un texto · (5) el borde del input casi invisible y la frase que repetía "5 minutos". Detalle usabilidad: h1:4 h2:3 h3:3 h4:3 h5:3 h6:4 h7:3 h8:3 h9:3 h10:3. Detalle craft: 3·3·3·3·3. En la 2ª ronda se cerraron 1, 3, 4 y 5; 2 quedó a medias.

## Historial — revisión de auditoría 2026-10-23: NO LISTA 29·15·N-A
Top defectos de entonces: (1) confirmación falsa cuando no había compra vigente · (2) aviso "sin-acceso" sin salida · (3) un 500 o un 400 mostraban "Revisa tu conexión" · (4) soporte en emprezaiai@gmail.com · (5) 6 tamaños de texto, aviso con rounded-chip, viñetas escritas a mano y ~85px vacíos. Detalle usabilidad: h1:3 h2:3 h3:3 h4:3 h5:3 h6:3 h7:3 h8:3 h9:3 h10:2. Detalle craft: 3·3·3·3·3. En la 1ª ronda del 2026-11-06 se cerraron 1, 2 y 3; 5 quedó a medias.

## Historial — ronda 5 (2026-10-07): NO LISTA 31·15·15
Top defectos de entonces: espera sin aviso ni garantía en "pronto" · al volver no reconocía el correo guardado · soporte en Hotmail personal · 6 tamaños de texto · ~95px vacíos y candados con dos sentidos. Se resolvieron el 2026-10-23: reconocimiento al volver, el ícono de privacidad y el Hotmail personal (a medias).
