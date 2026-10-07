# VEREDICTO revisor-visual — entrar (login)
Fecha: 2026-10-07 22:00
Screenshot: docs/revisiones/entrar-375.png
Usabilidad: 30/40
Craft: 15/20
Copy (si vende): 15/20
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos: (1) sin servidor, el botón "Guardar mi correo de acceso" no guarda nada (Acceso.tsx:65-91 no escribe en localStorage ni en un servidor) y el texto de debajo sigue diciendo "te llega un enlace de un solo uso" (L335); ninguna captura muestra ese estado real del inicio · (2) "El acceso abre muy pronto" no da plazo ni promete avisar, y el correo de soporte solo existe dentro del mailto: si el teléfono no tiene app de correo, el comprador se queda sin dirección · (3) en la 23 quedan ~190px vacíos abajo y en la 01 ~115px; además, en "pronto" la fila de chips lleva un solo chip y la mitad derecha queda vacía · (4) la 23 (375 y 360) se capturó a mitad de la animación: el chip "Pieza 1 lista" sale semitransparente y encogido, así que la evidencia no muestra el estado final · (5) más de 3 tamaños de texto, y en la 23 el candado significa dos cosas opuestas: verde = "pieza guardada", gris = "día bloqueado"

Detalle usabilidad: h1:3 h2:3 h3:3 h4:3 h5:3 h6:3 h7:3 h8:3 h9:3 h10:3
Detalle craft: jerarquía:3 profundidad:3 identidad:3 movimiento:3 encaje:3
Detalle copy: idea:3 especificidad:3 emoción:3 oferta:3 acción:3
Fidelidad: N-A. La referencia de la dueña solo cubre "Hoy". Contra FICHA-ARTE: fondo #0F0D16, dorado #FFC23D, verde #3DDC97, Bricolage + Instrument Sans, tarjeta 18-22px y píldoras 999px: todo coincide. El foco del input ya es neutro (`focus:border-ink-3`, L200 y L302), así que el dorado queda dentro de la lista de usos de L33. Sin desvíos visibles.

Gate de carga cognitiva: 1 falla de 8, no es sobrecarga. Falla "cero elementos que parezcan hacer algo y no lo hagan": en el estado real, "Guardar mi correo de acceso" no guarda nada.
CTA héroe vivo (inicio): cumple los 4. Dorado sobre #0F0D16 ≈12:1; `.boton-oro:active` responde; solo se deshabilita mientras envía (L317); 56px de alto a ancho completo. En "pronto" la acción es un botón secundario de 48px a ancho completo con `active:scale-[0.97]` (L148). Es aceptable: ahí la acción principal es pedir ayuda, no convertir.
Sub-checks de copy: message-match NO VERIFICABLE (falta el dato del 34). Garantía nombrada: N/A, aquí no hay CTA de compra.

## Hallazgos por severidad

### ALTO
1. **Acceso.tsx:327 + 335 + 65-91. El inicio real promete dos cosas que no pasan.** Fuera de la demo, el CTA dice "Guardar mi correo de acceso", pero `enviar()` solo cambia el estado: el correo no se escribe en localStorage ni se manda a ningún lado. Si el comprador vuelve mañana, el campo está vacío. Justo debajo, el caption dice "Sin contraseñas: te llega un enlace de un solo uso", y hoy no llega nada. Ninguna captura muestra este estado: la 01 y la 02 se tomaron en localhost con la demo y dicen "Enviarme mi enlace". → FIX: guardar el correo de verdad (localStorage + rellenar el campo al volver) y, mientras `!ACCESO_REAL`, cambiar el caption a "Cuando abra el acceso, te llegará un enlace de un solo uso"; capturar el inicio por [::1].

### MEDIO
2. **Captura 23, L135-151. "Muy pronto" sin plazo y soporte solo por mailto.** "Ya pagué: pedir mi acceso" resuelve el callejón, pero depende de que el teléfono tenga una app de correo configurada, y la dirección no aparece escrita en la pantalla. Tampoco hay una fecha ni la promesa de avisarle. → FIX: debajo del botón, "o escríbenos a {emailContacto}" en texto seleccionable, y "Abre antes del {fecha}" en el párrafo.
3. **Captura 23 (375 y 360): ~190px vacíos debajo de la tarjeta, ~115px en la 01.** El vacío ya no queda a mitad de pantalla, pero ahora queda abajo. Además, en "pronto" la fila de chips tiene solo "Pieza 1 lista" (L160) y la mitad derecha queda vacía. → FIX: centrar en vertical el contenido de "pronto" (`justify-center` en la sección flex-1) y repetir el chip "Mañana: tu cliente ideal · 5 min" igual que en el inicio.
4. **scripts/captura-app.mjs:170. La captura 23 sale a mitad de la animación.** 700ms de envío + 250ms de salida + 0,3s de retraso de RutaMini + 0,35s + 0,35s del chip suman unos 2s, pero el script espera 1300ms. El chip "Pieza 1 lista" sale semitransparente y más chico que en la 01. → FIX: `espera(2500)` antes de `capturar('23-…')`.

### BAJO
5. **Jerarquía y semántica de íconos.** Hay más de 3 tamaños: text-pregunta, base, boton, sm, caption y el eyebrow xs (es el defecto 8 de la revisión 3, sin tocar). En la 23, el `LockKeyhole` verde (L142) significa "guardado" y, a pocos píxeles, el mismo candado gris significa "bloqueado" en los días 2-5. → FIX: `CheckCircle2` o `ShieldCheck` para "Tu pieza 1 queda guardada", y el eyebrow de RutaMini al mismo tamaño que el caption.
6. **"El acceso abre muy pronto": "muy pronto" va en dorado.** El acento resalta una vaguedad, no un beneficio. → FIX: resaltar el plazo concreto cuando exista ("abre el 15 de octubre").

## Traza del copy (FICHA-AVATAR)
- "Entra a tu ruta de 30 días": Deseo 1. OK.
- "Usa el mismo correo con el que pagaste en Hotmart: así guardas tu pieza 1 y tu plan": Objeción 5 (pago por Hotmart) + aversión a la pérdida. OK.
- "Tu idea es tuya: solo tú ves lo que armas": Objeción 6, frase literal. OK.
- "Mañana: tu cliente ideal · 5 min" y "Tu negocio, pieza a pieza…": frases obligatorias de L66. OK.
- "Tu pieza 1 queda guardada en este celular": aversión a la pérdida, igual que en el inicio. OK.
- "Ya pagué: pedir mi acceso": primera persona y orientado a la acción, pero no sale de ningún campo de la ficha (la ansiedad post-pago no está en Objeciones).
- "El acceso abre muy pronto / Estamos terminando de activar…": sigue sin campo de origen y sin dato concreto. La especificidad se queda en 3.

## Re-revisión 4: qué se corrigió
Verificado defecto por defecto contra el veredicto anterior (29/40 · 14/20 · 15/20):
1. "El acceso abre muy pronto" como callejón sin salida → CORREGIDO. Tiene "Ya pagué: pedir mi acceso" (mailto a soporte con el correo de compra en el cuerpo, L146-151) y "Corregir mi correo" (vuelve al inicio con el correo conservado, L152-158). Quedan sin resolver el plazo, la promesa de aviso y la dirección visible (hallazgo 2). h9 sube de 2 a 3.
2. ~320px vacíos a mitad de pantalla → CORREGIDO A MEDIAS. RutaMini va con `mt-8` (L159) en "pronto" y `mt-10` en el inicio (L341), y el hueco del medio desapareció. El vacío pasó abajo: ~190px en la 23 y ~115px en la 01 (hallazgo 3). Encaje sube de 2 a 3.
3. "Pronto" sin la pieza 1 en la captura → CORREGIDO. El script siembra `primeraPieza` en el origen [::1] (captura-app.mjs:153-165) y la 23 muestra "Tu pieza 1 queda guardada…". Se tomó a mitad de la animación (hallazgo 4).
4. Botones que prometen un envío que no ocurre → CORREGIDO A MEDIAS. "Usar otro correo" pasó a "Corregir mi correo" en "pronto". El CTA cambia a "Guardar mi correo de acceso" cuando no hay demo (L327), pero no guarda nada y el caption L335 sigue prometiendo el enlace. El defecto cambió de forma, pero sigue ahí (hallazgo 1), y no hay captura de ese rótulo.
5. Éxito falso latente + foco dorado → CORREGIDO. `ACCESO_REAL = false as boolean` está fijo (L24) y ya no depende de una variable de entorno. "enviado" solo se alcanza con ACCESO_REAL o con la demo restringida a localhost/127.0.0.1 (L26, L87, L109). El foco es `focus:border-ink-3` en los dos inputs (L200, L302).
Balance: usabilidad +1 (h9 de 2 a 3) → 30/40; craft +1 (encaje de 2 a 3) → 15/20; copy sin cambios, 15/20. No pasa el gate doble (30/40 < 36, 15/20 < 16) ni el de copy (15/20 < 16).
