# VEREDICTO revisor-visual — entrar (login)
Fecha: 2026-11-06 12:00
Screenshot: docs/revisiones/entrar-375.png
Usabilidad: 32/40
Craft: 15/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos: (1) la escala tipográfica sigue en 5 tamaños: pregunta 28, boton 17, base 16, caption 13 y xs 12 en RutaMini (piezas.tsx:362/386/393/409). La ficha pide 3 niveles · (2) en el error de servidor (04) el soporte aparece como texto rojo que no se puede tocar, y es emprezaiai@gmail.com, con un "aiai" que parece error de tipeo (Acceso.tsx:515, legal.ts:7) · (3) el error no se borra cuando corriges el correo: onChange solo limpia errorCampo y `estado === 'error'` sigue mostrando el mensaje rojo mientras escribes (Acceso.tsx:495-498) · (4) en "sin-acceso" (02), "Reactivar mi plan" es solo un texto subrayado y el botón dorado sigue siendo "Enviarme mi enlace" (Acceso.tsx:452-476) · (5) el borde del campo sin foco es casi invisible: --line 8% sobre el fondo hundido queda bajo 3:1 (se nota en 03). Además, "5 minutos" sale repetido en el chip y en la frase centrada de abajo, que rompe la alineación izquierda del resto

Detalle usabilidad: h1:4 h2:3 h3:3 h4:3 h5:3 h6:4 h7:3 h8:3 h9:3 h10:3
Detalle craft: jerarquía:3 profundidad:3 identidad:3 movimiento:3 encaje:3
Copy: N-A. Es una pantalla de acceso para quien ya pagó; no vende.
Fidelidad: N-A (no hay referencia para esta pantalla). Contra FICHA-ARTE: fondo #0F0D16 con radial dorado arriba a la derecha. El dorado solo aparece en el CTA, en "tu ruta" y en el nodo "Hoy". La hairline dorada→verde está en la tarjeta de la ruta y el aviso usa #FF9F43. Display en Bricolage y body en Instrument Sans; el nombre del logo va en Montserrat con "AI" turquesa. Píldoras de 999px y tarjetas con radius-card. Todo coincide. El único desvío es la escala (defecto 1).

## Re-revisión 2026-11-06

Insumos puntuados: entrar-375.png y entrar/01-inicio, 02-sin-acceso, 03-enviado, 04-error-servidor y 05-sin-conexion (servidor simulado: 200 y 500). Código: components/acceso/Acceso.tsx, app/login/page.tsx, app/api/acceso/enviar/route.ts, app/api/acceso/verificar/route.ts, lib/servidor/accesos.ts, lib/servidor/correo.ts, lib/legal.ts, components/onboarding/piezas.tsx y app/globals.css (escala y .boton-oro).

Gate de carga cognitiva: 0 fallas de 8. Hay 1 acción primaria por estado, 1 campo por paso, ningún bloque pasa de 3 líneas y el siguiente paso se ve de inmediato.
CTA héroe vivo: cumple los 4. Dorado sobre #0F0D16 ≈12:1. `.boton-oro:active` baja 2px y aplana la sombra (globals.css:234). Solo se deshabilita mientras envía o verifica (L521 y L340) y valida al tocar. Mide h-14 (56px) a ancho completo.

### Defectos de la ronda anterior, uno por uno
1. Confirmación falsa sin compra vigente: CERRADO. `enviarAccesoSiCorresponde` (accesos.ts:77-81) manda a ese buzón `enviarSinCompraVigente`, con el texto "pausado" o "no encontramos". La respuesta sigue siendo la misma para todos los correos. El texto de 03 ("si no, te explica qué hacer") lo refleja. Si Resend o EMAIL_FROM no están configurados, `requerida()` lanza un 500 y la pantalla muestra un error honesto, no un "enviado" falso. El envío real queda sin probar de punta a punta hasta que se conecte el dominio.
2. "sin-acceso" sin salida: CERRADO. Tiene color de aviso, ícono CircleAlert, "Reactivar mi plan" hacia /paywall y un mailto con asunto y correo. Queda una mejora de jerarquía (defecto 4).
3. 500 disfrazado de "revisa tu conexión": CERRADO. Se separaron `!res.ok` y el `catch` (L146-161 y L512-517), y las capturas 04 y 05 muestran textos distintos. En verificar, un 5xx tiene su propio mensaje (L196).
4. Soporte en Gmail "emprezaiai": SIGUE ABIERTO. Ya se sabe que es provisional (legal.ts:8, `emailEsProvisional`). Ahora además aparece dentro del texto de error y no se puede tocar (defecto 2).
5. Escala y encaje: CERRADO A MEDIAS. Ya están corregidos el aviso con `--radius-card` (L448 y L456), la lista con `<li>` y CheckCustom con sangría colgante (L355-368) y "mismo correo" en semibold. Sigue abierto: hay 5 tamaños de texto y quedan unos 78px libres al final de 01. Con justify-center ese hueco ya se equilibra con el de arriba.

### Por qué la usabilidad sube de 29 a 32
h10 pasa de 2 a 3 porque desaparecen los callejones: ahora todo estado de acceso tiene una salida. h1 sube a 4: "Enviando…" con spinner, "Revisando…", la cuenta atrás para reenviar y role=status, así que nunca parece colgado. h6 sube a 4: el correo guardado vuelve escrito, hay pista de dónde encontrar el correo correcto (el comprobante) y el código usa one-time-code. h9 se queda en 3 aunque ahora explique qué pasó y qué hacer: el contacto no se puede tocar y el mensaje se queda pegado mientras corriges.

### Por qué el craft se queda en 15
Ningún eje cambió de ancla. Jerarquía: 5 tamaños donde la ficha pide 3. Movimiento: stagger de 60ms, pulso del nodo "Hoy", slide entre estados con AnimatePresence, tap en todos los secundarios y reduced-motion respetado. No aplican el conteo, los modales ni la celebración. Encaje: se arreglaron los radios y las viñetas, pero siguen la frase centrada bajo un bloque alineado a la izquierda, el chip que repite el dato y el borde del input casi invisible.

## Hallazgos por severidad

### MEDIO
1. **Escala tipográfica de 5 tamaños** (piezas.tsx:362, 386, 390, 393 y 409 en text-xs; Acceso.tsx con caption, base, boton y pregunta). → FIX: RutaMini pasa de text-xs a text-caption y text-boton a text-base. Quedan 3 tamaños: pregunta, base y caption.
2. **El soporte del error no se puede tocar y parece un error de tipeo** (Acceso.tsx:515 y 149, 197; legal.ts:7). → FIX: el `{RESPONSABLE.emailContacto}` del mensaje pasa a ser un `<a href="mailto:…">` subrayado con el correo en el asunto. Al comprar el dominio, cambiar a soporte@ (ya está planeado en el siguiente paso de configuración).
3. **El error se queda visible al corregir el correo** (Acceso.tsx:495-498). → FIX: en onChange, `if (estado === 'error') setEstado('inicio')`.

### BAJO
4. **En "sin-acceso" la salida principal no es la principal** (Acceso.tsx:452-476). Quien llega con la suscripción vencida ve el botón dorado "Enviarme mi enlace", que solo le traerá un correo de "acceso pausado", mientras que "Reactivar mi plan" es un texto subrayado. → FIX: en ese estado, "Reactivar mi plan" pasa a ser un botón píldora de 48px dentro del aviso, o el botón dorado cambia a "Reactivar mi plan" y el envío del enlace baja a terciario.
5. **El borde del input no se ve y hay ruido al final** (Acceso.tsx:503 y 329, Acceso.tsx:561-563). → FIX: el borde de reposo pasa a `color-mix(ink-3 45%)` para llegar a 3:1 de contraste no textual. Quitar la frase centrada "Tu negocio, pieza a pieza…", que repite el chip "5 minutos al día", o alinearla a la izquierda.

## Historial — revisión de auditoría 2026-10-23: NO LISTA 29·15·N-A
Top defectos de entonces: (1) si el correo no tenía compra vigente, el servidor no mandaba nada y la pantalla igual decía "Te enviamos tu enlace" · (2) el aviso "sin-acceso" decía "escríbenos" sin enlace, sin dirección y sin opción de renovar · (3) un 500 o un 400 mostraban "Revisa tu conexión" · (4) el soporte era emprezaiai@gmail.com · (5) 6 tamaños de texto, aviso con rounded-chip, viñetas "·" escritas a mano y ~85px vacíos. Detalle usabilidad: h1:3 h2:3 h3:3 h4:3 h5:3 h6:3 h7:3 h8:3 h9:3 h10:2. Detalle craft: jerarquía:3 profundidad:3 identidad:3 movimiento:3 encaje:3. Estado en esta ronda: 1, 2 y 3 cerrados; 4 abierto (provisional); 5 a medias.

## Historial — ronda 5 (2026-10-07): NO LISTA 31·15·15
Top defectos de entonces: espera sin aviso ni garantía en "pronto" · al volver no reconocía el correo guardado · soporte en Hotmail personal · 6 tamaños de texto · ~95px vacíos y candados con dos sentidos. Se resolvieron en la ronda del 2026-10-23: reconocimiento al volver, el ícono de privacidad y el Hotmail personal (a medias).
