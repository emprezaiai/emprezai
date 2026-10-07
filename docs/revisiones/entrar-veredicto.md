# VEREDICTO revisor-visual — entrar (login)
Fecha: 2026-10-07 21:00
Screenshot: docs/revisiones/entrar-375.png
Usabilidad: 29/40
Craft: 14/20
Copy (si vende): 15/20
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos: (1) el estado real del comprador ("El acceso abre muy pronto", captura 23) es un callejón sin salida: no hay contacto de soporte, ni aviso prometido, ni fecha · (2) en la captura 23 quedan ~320px vacíos entre "Usar otro correo" y la ruta, y en la 01 ~120px a mitad de pantalla (el `mt-auto` movió el vacío, no lo quitó) · (3) la captura 23 sale sin pieza 1 (el origen [::1] tiene otro localStorage), así que la promesa "tu pieza 1 queda guardada" no tiene evidencia · (4) sin servidor, "Enviarme mi enlace de acceso" no envía nada y "Usar otro correo" lleva al mismo resultado: los dos prometen algo que no ocurre · (5) el borde de foco dorado del input sigue fuera de los usos del acento (FICHA L33), y `ACCESO_REAL` pasa a "enviado" sin ninguna petición (éxito falso latente)

Detalle usabilidad: h1:3 h2:3 h3:3 h4:3 h5:3 h6:3 h7:3 h8:3 h9:2 h10:3
Detalle craft: jerarquía:3 profundidad:3 identidad:3 movimiento:3 encaje:2
Detalle copy: idea:3 especificidad:3 emoción:3 oferta:3 acción:3
Fidelidad: N-A. La referencia de la dueña solo cubre "Hoy". Contra la ficha: fondo #0F0D16, dorado #FFC23D, verde #3DDC97, Bricolage + Instrument Sans, tarjeta 18-22px y píldoras: todo coincide. El error ya usa danger (#FF6B6B, FICHA L35) y la hairline dorada degradada está en RutaMini (L42). Queda un desvío: el borde de foco dorado del input (`focus:border-gold`, Acceso.tsx:294) no está en la lista de usos del acento (L33).

Gate de carga cognitiva: 2 fallas de 8, no es sobrecarga. (a) En "pronto", el "qué sigue" no es obvio: no hay ninguna acción hacia la entrada. (b) "Enviarme mi enlace de acceso" y "Usar otro correo" parecen hacer algo que, sin servidor, no hacen.
CTA héroe vivo: cumple los 4. Dorado sobre #0F0D16 ≈12:1; `.boton-oro:active` con translateY (globals.css:215); solo se deshabilita mientras envía (Acceso.tsx:309); 56px de alto a ancho completo.
Sub-checks de copy: message-match NO VERIFICABLE (falta el dato del 34). Garantía nombrada: N/A, aquí no hay CTA de compra.

## Hallazgos por severidad

### ALTO
1. **Captura 23 + Acceso.tsx:131-154. "El acceso abre muy pronto" no dice qué hacer.** Es lo que ve hoy alguien que ya pagó: no puede entrar, no tiene fecha, no tiene a quién escribir y nadie le promete avisarle. La única acción es "Usar otro correo", que con cualquier correo lleva a la misma pantalla. El estado es honesto pero no ofrece solución (h9 = 2). → FIX: "Te escribimos a {email} apenas abra (antes de X)" + botón secundario "Escríbele a soporte" (mailto: el correo del footer), y que ese correo se guarde de verdad.
2. **Captura 23 (375 y 360): ~320px vacíos entre "Usar otro correo" y RutaMini.** El `mt-auto` (L151) pega la tarjeta abajo y deja un hueco en el medio. En la 01 el hueco es de ~120px, entre el texto del candado y la ruta (L333). El problema cambió de lugar, pero sigue a la vista. → FIX: en "pronto", RutaMini con `mt-8` justo después del texto (sin `mt-auto`) más el caption de la 01. En "inicio", `mt-10` fijo, o centrar el bloque formulario+ruta en vertical.

### MEDIO
3. **Evidencia incompleta de "pronto".** La 23 se sacó por [::1], que es otro origen: localStorage está vacío, `tienePieza` da false, sale el chip "5 minutos al día" y no aparece la línea "Tu pieza 1 queda guardada" (L138-143), que es justo la tranquilidad que declaraste. → FIX: capturar "pronto" con la pieza 1 en el mismo origen (o sembrar el estado antes de capturar).
4. **Acceso.tsx:85 y 319. Los botones prometen un envío que no ocurre.** Sin servidor, el CTA dice "Enviarme mi enlace de acceso" y responde "abre muy pronto". → FIX: mientras `!ACCESO_REAL`, rotular "Guardar mi correo de acceso" y cambiar "Usar otro correo" por "Corregir mi correo".
5. **Acceso.tsx:85. Éxito falso latente.** Si alguien define `NEXT_PUBLIC_SUPABASE_URL` antes de cablear la Sesión 6, la pantalla vuelve a decir "Te enviamos tu enlace" sin ninguna petición (L80 sigue siendo un comentario). → FIX: condicionar "enviado" a la respuesta real del servidor, nunca a la existencia de la variable.

### BAJO
6. **Acceso.tsx:294. Borde de foco dorado** fuera de la lista de usos del acento (FICHA L33). → FIX: `focus:border-ink-3` o la línea al 24%.
7. **CTA "Enviarme mi enlace de acceso"**: describe el mecanismo, no el beneficio. → FIX (cuando haya servidor): "Entrar a mi ruta".
8. **Más de 3 tamaños de texto en la 01** (título, cuerpo, label, caption, eyebrow y chips). → FIX: igualar el eyebrow de RutaMini y el caption al mismo label.

## Traza del copy (FICHA-AVATAR)
- "Entra a tu ruta de 30 días": Deseo 1 (L31). OK.
- "Usa el mismo correo con el que pagaste en Hotmart: así guardas tu pieza 1 y tu plan": Objeción 5 + Deseo 2 + aversión a la pérdida. OK.
- "Tu idea es tuya: solo tú ves lo que armas": Objeción 6. OK.
- "Mañana: tu cliente ideal · 5 min": Deseo 1 (L31) + "5 minutos al día" (L66). OK.
- "Tu negocio, pieza a pieza: hoy ya sabes qué hacer, y en 5 minutos está hecho.": frase obligatoria L66 + ancla L68 (parafraseada). OK.
- "El acceso abre muy pronto / Guarda este correo": sin campo de origen. No aborda Objeción 5 ni la de confianza tras pagar.
- La escena "hoja en blanco a las 7 PM" sigue ausente, pero en un login no es obligatoria. El eje emoción sube a 3 por el ancla.

## Re-revisión 3: qué se corrigió
Verificado defecto por defecto contra el veredicto anterior (30/40 · 15/20 · 14/20):
1. Campo con error dorado y "incompleto" con el campo vacío → CORREGIDO. Con error, `border-danger` sin `focus:border-gold` (L293-295), más `sacudir` (con reduced-motion, globals.css:270) y `key={intentos}` para repetir la sacudida. En la 02 el borde es rojo y dice "Escribe tu correo para recibir el enlace.". Todos los errores usan `text-danger`.
2. Éxito falso y bandera de demo débil → CORREGIDO. Sin servidor ni demo pasa a "pronto" (L85). La demo exige la bandera más un hostname localhost/127.0.0.1 en tiempo de ejecución (L24, Marco.tsx:19-20), y `entrarDemostracion` vuelve a chequear (L107). "Reenviar" en demo dice "no se envían correos" (L238). Efecto lateral: el nuevo estado "pronto" es un callejón sin salida (hallazgo 1), y queda latente el éxito falso si se define la URL de Supabase (hallazgo 5).
3. Emoción en 2 → CORREGIDO, sube a 3. Están el chip "Mañana: tu cliente ideal · 5 min" y el caption con "pieza a pieza" + el ancla L68.
4. ~170px vacíos abajo → CORREGIDO A MEDIAS. `flex-1` + `mt-auto` mandan la ruta abajo, pero el hueco pasa a mitad de pantalla (~120px en la 01) y en "pronto" queda en ~320px (hallazgo 2).
5. Secundarios sin respuesta al toque → CORREGIDO (`active:scale-[0.97] duration-100` en L147, 215, 232 y 243).
6. Placeholder "123456" → CORREGIDO ("6 números", en sans y peso normal, L188-191; se ve en la 03).
7. Estado real sin capturar → CORREGIDO A MEDIAS. Existe la 23, pero sin la pieza 1 (hallazgo 3).
8. Destello del formulario con sesión → CORREGIDO (L112: con `cuenta !== null` se pinta un `main` vacío con aria-busy).
9. Hairline degradé → CORREGIDO (`hairline-oro` en RutaMini destacada, piezas.tsx:281; en la captura se ve el borde de dorado a verde).
10. "Continuar con Google" → JUSTIFICADO. Mostrar un botón que no hace nada violaría la regla UX 11. Se acepta su ausencia.
Balance: copy +1 (emoción de 2 a 3). Usabilidad −1: h9 baja a 2 porque el estado que ve hoy un comprador real no dice qué hacer. Craft −1: el encaje baja a 2 por el vacío de ~320px en "pronto". No pasa el gate doble (29/40 < 36, 14/20 < 16) ni el de copy (15/20 < 16).
