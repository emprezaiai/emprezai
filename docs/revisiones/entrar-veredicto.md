# VEREDICTO revisor-visual — entrar (login)
Fecha: 2026-10-07 12:00
Screenshot: docs/revisiones/entrar-375.png
Usabilidad: 27/40
Craft: 14/20
Copy (si vende): 13/20
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos: (1) la vista previa deja entrar sin verificar nada si falta una variable (fail-open) · (2) en "enviado" falta el código de 6 dígitos y la ayuda "no me llega", y el estado real sin vista previa nunca se renderizó · (3) "Revisa tu correo" significa dos cosas distintas · (4) quien llega desde los planes no sabe que debe usar el correo de su compra en Hotmart · (5) texto de obra a la vista ("próxima etapa", "simula") con borde dorado punteado fuera de la ficha

Detalle usabilidad: h1:3 h2:2 h3:3 h4:3 h5:2 h6:3 h7:3 h8:3 h9:3 h10:2
Detalle craft: jerarquía:3 profundidad:3 identidad:3 movimiento:3 encaje:2
Detalle copy: idea:3 especificidad:3 emoción:2 oferta:2 acción:3 (dos ejes en 2: hay que corregir aunque sumara 16)
Fidelidad: N-A. La referencia de la dueña (FICHA-ARTE L6-9) solo cubre la composición de la pantalla principal. Contra la ficha: fondo #0F0D16, dorado #FFC23D, verde #3DDC97, Bricolage + Instrument Sans, tarjeta de 20px y CTA en píldora coinciden. Se desvían el radio del input (12px) y el dorado usado en un borde punteado y en el anillo de foco.

Gate de carga cognitiva: 2 fallas de 8, no es sobrecarga crítica. Falla 1: quien llega desde los planes tiene que recordar con qué correo pagó. Falla 2: "Reenviar" parece hacer algo y no envía nada.
CTA héroe vivo: cumple los 4 puntos. Contraste dorado contra fondo de ~12:1, :active con translateY y 120ms (globals.css:208-218), solo se deshabilita mientras envía (Acceso.tsx:189) y mide 56px de alto a ancho completo.
Sub-checks de copy: message-match NO VERIFICABLE porque falta el dato del 34. Garantía nombrada: N/A, en esta pantalla no hay CTA de compra.

## Hallazgos por severidad

### CRÍTICO
1. **Acceso.tsx:19, 74-77 y 114; lib/cuenta.ts:145-175. La vista previa queda abierta si falta una variable.** `ACCESO_REAL` depende de que exista `NEXT_PUBLIC_SUPABASE_URL`. Si se publica sin esa variable, "Abrir el enlace (vista previa)" crea una cuenta con CUALQUIER correo que se escriba, sin comprobar el buzón ni el pago, y entra a /app. Además copia el plan desde localStorage. Resultado: la app se usa gratis y cualquiera puede entrar con un correo ajeno. Va contra "sin defaults inseguros (fail-open)" de 26 y del CLAUDE.md. → FIX: activar la vista previa solo con una bandera explícita `NEXT_PUBLIC_VISTA_PREVIA==='1'` Y `NODE_ENV!=='production'`. En producción sin servidor de correo, mostrar "El acceso se activa muy pronto" y no crear la cuenta.

### ALTO
2. **Acceso.tsx:96-147 (estado "enviado"). Falta el código de 6 dígitos y el estado real nunca se vio.** 26 L105-113 pide SIEMPRE enlace + código de 6 dígitos, con el campo de código visible en esta pantalla. Hoy L111 le encarga al usuario recordar "Ábrelo desde este celular", que es justo el fallo #1 que 26 describe: el enlace se abre en el navegador interno de Gmail. Además, con `ACCESO_REAL=true` la pantalla queda en ícono + título + 2 enlaces de texto. No tiene acción principal ni ayuda, y casi la mitad está vacía. Ese estado no se renderizó. → FIX: campo "¿Te llegó un código? Escríbelo aquí" (6 dígitos, `autocomplete="one-time-code"`) + línea "¿No te llega? Revisa Spam o Promociones" + captura del estado real.
3. **Acceso.tsx:55 frente a Acceso.tsx:109. La misma frase con dos significados.** El error de validación empieza con "Revisa tu correo:" (revisa lo que escribiste) y el título de enviado es "Revisa tu correo" (revisa tu bandeja). Quien se equivoca al escribir puede creer que ya le enviaron algo. → FIX: "Ese correo parece incompleto. Ejemplo: tu@correo.com".
4. **Acceso.tsx:154 (rama `tienePieza`, el camino que viene de los planes). No se pide el correo de la compra.** El subtítulo no dice que se use el MISMO correo con el que pagó en Hotmart. Con el webhook de la Sesión 6, un correo distinto crea una cuenta sin plan, y el usuario tiene que recordarlo solo (h5/h6). Tampoco se confirma el plan elegido. → FIX: "Usa el mismo correo con el que pagaste en Hotmart: así guardas tu pieza 1 y tu plan."
5. **Acceso.tsx:115-118 y 125 (recuadro de vista previa). Texto de obra visible y dorado fuera de la ficha.** "se conectan en la próxima etapa", "simula que abriste el enlace" y "(vista previa)" son lenguaje de quien construye, no del usuario (h2). El borde punteado dorado usa el acento fuera de la lista de FICHA-ARTE L33 y hace que la pantalla parezca a medio hacer. → FIX: si se queda mientras tanto, usar un borde neutro `--line` y el texto "Modo demostración: entra sin esperar el correo". El botón: "Entrar a mi ruta".

### MEDIO
6. **Acceso.tsx:173 y globals.css:161-164. El input no encaja.** El input usa `--radius-chip` (12px), entre un CTA en píldora (L190) y una tarjeta de 20px: son tres radios apilados. La ficha (L41) reserva 10-14px para los chips de ícono, y las filas y campos van en píldora o en 18-22px. Además, `:focus-visible` está fuera de una capa (unlayered) y le gana a `focus:outline-none`. El resultado es un DOBLE anillo dorado, el contorno de 2px más el borde dorado (se ve en 01-entrar.png). → FIX: radio 999px o 20px en el input, y mover `:focus-visible` a `@layer base`.
7. **Acceso.tsx:111. El correo se corta a mitad de palabra.** `break-all` corta "carlos.rui|z@gmail.com" a 360px (app-360/03). → FIX: el correo en su propia línea con `[overflow-wrap:anywhere]` y `<wbr/>` antes de la @.
8. **Acceso.tsx:132-146. "Reenviar" no envía nada y los botones secundarios no responden al tocar.** "Reenviar" solo reinicia la cuenta atrás: no envía ni confirma nada ("Te reenviamos el enlace"). Los dos botones de texto no tienen estado :active, así que el tap <150ms falla para los secundarios. → FIX: toast o línea `aria-live` "Listo, te lo reenviamos" + `active:scale-[0.97] transition-transform duration-100`.
9. **Acceso.tsx:87 y 96. Espacio muerto abajo.** Quedan ~190px vacíos en 01 y ~230px en 03 a 375px, lo que choca con la regla "cero vacío muerto". → FIX: en "enviado", centrar el bloque en vertical (`flex-1 justify-center`). En inicio, anclar abajo la línea de privacidad (hallazgo 11).
10. **Acceso.tsx:169 y 177-181. El error no se anuncia ni se limpia.** El error de campo no tiene `role="alert"` y el foco no vuelve al input, así que el lector de pantalla no lo anuncia. Tampoco se borra en `onChange` y sigue visible mientras el usuario corrige. No usa `.sacudir` (globals.css:268), que ya existe. → FIX: `setErrorCampo('')` en onChange, `role="alert"`, `inputRef.focus()` y la clase `sacudir` al fallar.

### BAJO
11. **Acceso.tsx:204-207. Falta responder una objeción del avatar.** No aparece la objeción 6 de FICHA-AVATAR L60 ("¿Me van a robar la idea?") justo cuando se pide el correo, ni las frases obligatorias de L66 ("5 minutos al día", "pieza a pieza"). → FIX: caption "Tu idea es tuya: solo tú ves tu negocio" y el chip "Mañana: tu cliente ideal · 5 min".
12. **Acceso.tsx:41-43. Destello del formulario con sesión abierta.** Mientras `cuenta` es undefined se pinta el formulario y luego redirige: quien ya tiene sesión ve el formulario un instante. → FIX: mostrar un esqueleto o nada mientras `cuenta !== null`.
13. **No hay hairline degradé en ninguna parte de la vista**, aunque la ficha (L42) la pone en el elemento clave. → FIX: hairline dorada degradada de 1px en el input con foco o en el borde superior de RutaMini.

## Traza del copy (FICHA-AVATAR)
- "Entra a tu ruta de 30 días" → Deseo 1 (L31), con el mapa de 30 días. OK.
- "Así guardas tu pieza 1 y la ves desde cualquier celular" → Deseo 2 (L32) y dispositivo Android (L9). Aversión a la pérdida. OK.
- "Enviarme mi enlace de acceso" → en primera persona, pero describe el mecanismo y no el beneficio. Sin campo de origen.
- "Mañana: tu cliente ideal" → Deseo 1 y ancla L68. OK.
- "Usa el correo con el que compraste en Hotmart" → Objeción 5 (L59). OK.
- Recuadro de vista previa → sin campo de origen.
- Dolor o escena (hoja en blanco, 7 PM): ausente (eje 3 = 2).
- Confirmación del plan o la prueba recién pagados: ausente (eje 4 = 2).
