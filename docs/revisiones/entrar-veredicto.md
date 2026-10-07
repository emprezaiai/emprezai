# VEREDICTO revisor-visual — entrar (login)
Fecha: 2026-10-07 18:00
Screenshot: docs/revisiones/entrar-375.png
Usabilidad: 30/40
Craft: 15/20
Copy (si vende): 14/20
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos: (1) en el error, el campo sigue dorado porque el foco tapa el color de error; además dice "incompleto" con el campo vacío · (2) sin servidor y sin la bandera, la pantalla dice "Te enviamos tu enlace" aunque no se envió nada, y la bandera de demo no exige NODE_ENV distinto de production · (3) el copy no tiene escena ni ancla emocional ("5 minutos al día" no sale en el camino de quien pagó), eje emoción = 2 · (4) quedan ~170px vacíos abajo en inicio y error a 375px · (5) los botones secundarios no responden al tocar, el formulario parpadea con sesión abierta y no hay hairline degradé

Detalle usabilidad: h1:3 h2:3 h3:3 h4:3 h5:3 h6:3 h7:3 h8:3 h9:3 h10:3
Detalle craft: jerarquía:3 profundidad:3 identidad:3 movimiento:3 encaje:3
Detalle copy: idea:3 especificidad:3 emoción:2 oferta:3 acción:3 (el eje emoción sigue en 2: se corrige aunque el total pasara)
Fidelidad: N-A. La referencia de la dueña solo cubre la composición de "Hoy" (FICHA-ARTE L6-9). Contra la ficha: fondo #0F0D16, dorado, verde, Bricolage + Instrument Sans, tarjeta de 20px y CTA, input y código en píldora coinciden. Desvíos: el error usa el tono de aviso (#FF9F43, `text-warning`) y no el de error (#FF6B6B), el borde de foco dorado del input queda fuera de la lista de usos del acento (L33) y no hay hairline degradé en el elemento clave (L42).

Gate de carga cognitiva: 1 falla de 8, no es sobrecarga. "Enviarme mi enlace" y "Reenviar" confirman un envío que hoy no ocurre (sin servidor), así que parecen hacer algo que no hacen.
CTA héroe vivo: cumple los 4. Dorado sobre #0F0D16 ≈12:1; `.boton-oro:active` con translateY (globals.css:215); solo se deshabilita mientras envía (Acceso.tsx:265) y "Entrar con el código" nunca se deshabilita; mide 56px de alto a ancho completo.
Sub-checks de copy: message-match NO VERIFICABLE (falta el dato del 34). Garantía nombrada: N/A, aquí no hay CTA de compra.

## Hallazgos por severidad

### ALTO
1. **Acceso.tsx:249-251 + 02-entrar-error.png (375 y 360). El campo con error se ve dorado, no rojo.** Al fallar, `campo.current?.focus()` vuelve a enfocar el input y `focus:border-gold` le gana a `border-warning`. Resultado: el texto naranja aparece debajo de un campo dorado, del mismo color que el "todo bien" del acento. El estado de error no queda anclado al campo. El mensaje "Ese correo parece incompleto" también sale con el campo VACÍO (la captura muestra el placeholder), y no se usa `.sacudir`. → FIX: con `errorCampo`, aplicar `border-[#FF6B6B] focus:border-[#FF6B6B]` vía token de error y sacar `focus:border-gold`, agregar `sacudir` y, si está vacío, decir "Escribe tu correo para recibir el enlace".
2. **Acceso.tsx:60-83 y 23. Fail-closed en seguridad, pero con un éxito falso.** `enviar()` siempre pasa a "Te enviamos tu enlace" después de 700ms, sin hacer ninguna petición. En producción sin servidor ni bandera, un comprador ve el éxito, espera un correo que nunca llega y su código da "No pudimos verificar" (L97). Lo mismo pasa con "Te reenviamos el enlace" (L195-206). Además, `MODO_DEMOSTRACION` depende de una sola variable pública: si alguien la pone en Vercel, se vuelve a abrir la puerta. → FIX: si `!ACCESO_REAL && !MODO_DEMOSTRACION`, no pasar a "enviado" y mostrar el estado honesto "El acceso se activa muy pronto. Escríbenos a [soporte]". Y exigir también `process.env.NODE_ENV !== 'production'` en L23 y en Marco.tsx:18.
3. **Copy, eje emoción = 2 (Acceso.tsx:216-227 y 291-299).** En el camino de quien pagó (`tienePieza`) no aparece el ancla de la ficha (L68: "hoy sabes exactamente qué hacer, y en 5 minutos ya está hecho") ni las frases obligatorias "5 minutos al día" y "pieza a pieza" (L66). "5 minutos al día" solo sale en la rama sin pieza. → FIX: chip "Mañana: tu cliente ideal · 5 min" y caption bajo el título "Tu negocio, pieza a pieza: mañana ya sabes qué hacer".

### MEDIO
4. **Acceso.tsx:114 y 289. Sigue habiendo espacio muerto abajo.** En 01 y 02 a 375px quedan ~170px vacíos bajo RutaMini (la tarjeta termina en y≈641 de 812). La corrección declarada ("la ruta en miniatura llena el espacio") no se ve en la captura. → FIX: `flex-1` en la sección de inicio y `mt-auto` en el bloque de RutaMini, o centrar el bloque en vertical.
5. **Acceso.tsx:183, 200 y 208. Los botones secundarios no responden al tocar.** "Entrar en modo demostración", "Reenviar el enlace" y "Usar otro correo" no tienen `:active` ni transición (falla la baseline tap <150ms). → FIX: `active:scale-[0.97] transition-transform duration-100` en los tres.
6. **Acceso.tsx:156. El placeholder "123456" parece un código.** Va en Bricolage bold, con tracking amplio y gris claro: Carlos puede creer que su código es 123456 o que ya está escrito. → FIX: placeholder "······" o "Ej. 482 913" en peso normal.
7. **El estado real, sin modo demostración, sigue sin renderizarse.** Todas las capturas de "enviado" tienen la bandera activa, así que la versión que verá el comprador (sin el recuadro de demostración) no tiene evidencia visual. → FIX: capturar 03 sin `NEXT_PUBLIC_VISTA_PREVIA`.

### BAJO
8. **Acceso.tsx:50-52 + lib/cuenta.ts:136-143. El formulario parpadea con sesión abierta.** `useCuenta()` devuelve `undefined` en la hidratación, se pinta el formulario y luego redirige (no corregido). → FIX: devolver `null` o un esqueleto mientras `cuenta !== null`.
9. **Falta la hairline degradé en el elemento clave** (FICHA L42). `.hairline-oro` ya existe en globals.css:232 (no corregido). → FIX: aplicarla a RutaMini o al input con foco.
10. **Falta la opción secundaria "Continuar con Google" que muestra 50 §E** (botón outline neutro). Baja la h7. → FIX: agregarla en la Sesión 6 o anotar en ESTADO.md por qué no va.

## Traza del copy (FICHA-AVATAR)
- "Entra a tu ruta de 30 días": Deseo 1 (L31). OK.
- "Usa el mismo correo con el que pagaste en Hotmart: así guardas tu pieza 1 y tu plan": Objeción 5 (L59) + Deseo 2 (L32) + aversión a la pérdida. OK.
- "Tu idea es tuya: solo tú ves lo que armas": Objeción 6 (L60). OK.
- "Mañana: tu cliente ideal": Deseo 1 + ancla L68 (parcial: falta "5 minutos"). OK parcial.
- "Enviarme mi enlace de acceso" / "Entrar con el código": en primera persona, pero describen el mecanismo, no el beneficio. Sin campo de origen.
- "¿No te llega? Revisa Spam o Promociones": ayuda funcional (26). OK.
- Escena o dolor (hoja en blanco, 7 PM) y "5 minutos al día": ausentes en la rama de quien pagó (eje 3 = 2).

## Re-revisión 2: qué se corrigió
Verificado defecto por defecto contra el veredicto anterior (27/40 · 14/20 · 13/20):
1. Fail-open → CORREGIDO a medias. La demo y `?demo=carlos` ahora exigen `NEXT_PUBLIC_VISTA_PREVIA==='1'` (Acceso.tsx:23, Marco.tsx:18, .env.example:3), y sin bandera el código da error (L96-97). Falta: la guardia de `NODE_ENV` y el éxito falso de "enviado" (nuevo hallazgo 2).
2. Código de 6 dígitos + "¿No te llega?" → CORREGIDO (L146-174, `autocomplete="one-time-code"`, `inputMode="numeric"`, solo dígitos). El estado sin demo sigue sin captura (hallazgo 7).
3. "Revisa tu correo" con doble sentido → CORREGIDO ("Ese correo parece incompleto…" / "Te enviamos tu enlace").
4. Correo de la compra en Hotmart → CORREGIDO (L220 y L224).
5. Texto de obra + dorado punteado → CORREGIDO. Borde neutro, "Modo demostración", y el botón sigue la jerarquía secundaria.
6. Radio del input + doble anillo → CORREGIDO (input y código en píldora; `:focus-visible` en `@layer base`, globals.css:161). Efecto lateral nuevo: el foco tapa el borde de error (hallazgo 1).
7. Correo cortado a mitad de palabra → CORREGIDO (`[overflow-wrap:anywhere]`; a 360px "carlos.ruiz@gmail.com" entra completo).
8. "Reenviar" sin confirmar → CORREGIDO a medias. Confirma con `role="status"` (L205), pero el envío es simulado y los secundarios siguen sin respuesta al tocar (hallazgo 5).
9. Espacio muerto → CORREGIDO solo en "enviado". En inicio y error siguen ~170px vacíos (hallazgo 4).
10. Error sin anunciar ni limpiar → CORREGIDO (`role="alert"`, foco de vuelta, se borra en onChange). Falta `sacudir` y el borde de error visible.
11. Objeción "¿me roban la idea?" → CORREGIDO ("Tu idea es tuya"). "5 minutos al día" sigue ausente en la rama de quien pagó.
12. Destello del formulario con sesión → NO CORREGIDO.
13. Hairline degradé → NO CORREGIDO.
Balance: +3 en usabilidad (h2, h5 y h10 suben a 3), +1 en craft (encaje de 2 a 3), +1 en copy (oferta de 2 a 3). No pasa el gate doble: 30/40 < 36 y 15/20 < 16, y el copy queda en 14/20 con un eje en 2.
