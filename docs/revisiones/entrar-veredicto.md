# VEREDICTO revisor-visual — entrar (login)
Fecha: 2026-10-07 23:30
Screenshot: docs/revisiones/entrar-375.png
Usabilidad: 31/40
Craft: 15/20
Copy (si vende): 15/20
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos: (1) quien ya pagó no puede entrar, y el estado "pronto" no le dice cómo se va a enterar de que abrió ni qué lo protege mientras tanto: falta "te avisamos a {email}" (Hotmart ya tiene ese correo) y la garantía nombrada · (2) al volver con el correo ya guardado (23b), la pantalla es idéntica a la primera visita: no reconoce que ya lo guardó y lo hace repetir el ciclo "Guardar" → "pronto" · (3) el soporte visible es un correo personal de Hotmail (adrianachacon15@hotmail.com, lib/legal.ts:7): para alguien que acaba de pagar y no puede entrar, parece poco serio · (4) siguen 6 tamaños de texto (pregunta, base, boton, sm, caption, xs); el eyebrow y los chips de RutaMini siguen en text-xs (piezas.tsx:283, 307, 328) · (5) en el inicio quedan unos 95px vacíos abajo a 375, y el candado gris del texto de privacidad (Acceso.tsx:388) significa "privado" justo encima de los candados de "día bloqueado" de la ruta

Detalle usabilidad: h1:3 h2:3 h3:3 h4:3 h5:3 h6:3 h7:3 h8:3 h9:4 h10:3
Detalle craft: jerarquía:3 profundidad:3 identidad:3 movimiento:3 encaje:3
Detalle copy: idea:3 especificidad:3 emoción:3 oferta:3 acción:3
Fidelidad: N-A (no hay referencia para esta pantalla). Contra FICHA-ARTE: fondo #0F0D16, dorado #FFC23D, verde #3DDC97, Bricolage + Instrument Sans, tarjeta 18-22px y píldoras 999px. Todo coincide en 375 y 360. Falla la escala de la ficha: el label debería ir a 10.5-12px y, con solo 3 niveles, la pantalla usa 6 tamaños.

Gate de carga cognitiva: 0 fallas de 8. En "pronto" hay 3 acciones apiladas (botón secundario, correo escrito, "Corregir"), pero solo una pesa como botón.
CTA héroe vivo (inicio): cumple los 4. Dorado sobre #0F0D16 ≈12:1; `.boton-oro` responde al toque; solo se deshabilita mientras envía (L372); 56px de alto a ancho completo.
Sub-checks de copy: message-match NO VERIFICABLE (falta el dato del 34). Garantía nombrada: no aparece. Aquí no hay CTA de compra, pero quien pagó y no puede entrar debería verla (defecto 1).

## Re-revisión 5: qué se corrigió (contra los 6 defectos de la ronda 4)
1. Correo guardado de verdad y rellenado al volver → CORREGIDO. `guardarCorreo` escribe en localStorage (L41-48, L105) y `useSyncExternalStore` lo lee al volver (L62-64). La 23b muestra el campo con "carlos.ruiz@gmail.com". Si no hay espacio, cae a "Anota tu correo de acceso" (L172-179). Caption honesto → CORREGIDO: "cuando abra el acceso, te llegará un enlace…" (L390-392), visible en entrar-375.png. Captura del inicio real → CORREGIDO (22b, entrar-375).
2. Soporte escrito en pantalla → CORREGIDO. "o escríbenos a {emailContacto}" en texto seleccionable (L193-195). Plazo y aviso → SIN CORREGIR. Que no haya fecha es legítimo (no se inventa), pero tampoco se promete avisar, y sí se podría: el comprador es de Hotmart y su correo ya se conoce (defecto 1).
3. Contenido de "pronto" centrado y ruta completa → CORREGIDO. `justify-center` (L165) y los 2 chips (L209-212). En la 23 a 375 el hueco de abajo bajó a unos 65px. Sigue habiendo unos 95px vacíos en el inicio (defecto 5).
4. Captura 23 tras la animación → CORREGIDO. Ahora espera 2500 ms (captura-app.mjs:171) y el chip "Pieza 1 lista" sale con opacidad y escala completas.
5. Ícono de guardado distinto del candado → CORREGIDO en "pronto" (`CheckCircle2`, L183). Eyebrow al tamaño del caption → SIN CORREGIR (defecto 4). El choque de candados pasó al inicio (defecto 5, severidad baja).
6. Acento sobre algo real → CORREGIDO. "quedó guardado" describe un hecho verificable, no una vaguedad.
Balance: h9 sube de 3 a 4. Errores ejemplares: el formato inválido trae un ejemplo, sin conexión dice que revises la red, el código pide copiarlo tal cual y el callejón de "pronto" tiene 2 salidas más el correo escrito. Usabilidad 31/40. Craft y copy no cambian (15/20 y 15/20). El techo actual es estructural: sin acceso real, h1 y h10 no pasan de 3 porque quien pagó se queda esperando sin plazo ni aviso.

## Hallazgos por severidad

### ALTO
1. **"Pronto" (captura 23, L176-179): espera sin aviso ni protección.** "Estamos terminando de abrir la entrada a la app" deja a quien pagó sin saber cómo se va a enterar ni qué pasa si tarda. La ficha da el material: Obj. 4, "te avisamos" / "garantía". → FIX: "Te avisamos a {email} el día que abra. Y si no te sirve, te cubre la garantía de {N} días de Hotmart." Solo si la dueña se compromete a avisar a los compradores de Hotmart. Si no, al menos la garantía con nombre y plazo.

### MEDIO
2. **Inicio al volver (23b): no reconoce el estado.** Con `correoGuardado` presente, la pantalla repite título, CTA "Guardar mi correo de acceso" y caption de primera visita. El usuario vuelve a apretar y cae otra vez en "pronto". → FIX: si `correoGuardado && !ACCESO_REAL`, abrir directo en "pronto" o poner sobre el campo "Ya guardaste este correo: el acceso aún no abre".
3. **"o escríbenos a adrianachacon15@hotmail.com" (L194, lib/legal.ts:7).** Un Hotmail personal con número, como única vía de soporte de un producto pago, resta confianza justo en el momento de mayor ansiedad. → FIX: una dirección del dominio (soporte@…) o, como mínimo, un alias neutro.

### BAJO
4. **Escala tipográfica: 6 tamaños, la ficha pide 3 niveles.** text-pregunta, base, boton, sm (label y "Corregir"), caption y xs (eyebrow, días y chips de RutaMini, piezas.tsx:283/307/328). Viene sin tocar desde la revisión 3. → FIX: label y "Corregir" a caption, y el xs de RutaMini a caption.
5. **Inicio a 375: unos 95px vacíos bajo el texto de la ruta, y candados con dos sentidos.** El `LockKeyhole` gris de privacidad (L388) queda sobre los candados de "día bloqueado". → FIX: `justify-center` también en la sección del inicio (L319) y `ShieldCheck` para "Tu idea es tuya".

## Traza del copy (FICHA-AVATAR)
- "Entra a tu ruta de 30 días": Deseo 1. OK.
- "Usa el mismo correo con el que pagaste en Hotmart: así guardas tu pieza 1 y tu plan": Obj. 5 + aversión a la pérdida. OK. Ojo: hoy la pieza no pasa a ninguna cuenta; "pronto" lo aclara ("queda guardada en este celular").
- "Sin contraseñas… Tu idea es tuya: solo tú ves lo que armas": Obj. 6, frase literal. OK.
- "Tu negocio, pieza a pieza: hoy ya sabes qué hacer, y en 5 minutos está hecho": frase obligatoria + ancla emocional (L66, L68). OK.
- "Tu correo de acceso quedó guardado": hecho verificable. No sale de ningún campo, pero es estado del sistema, no venta.
- "Ya pagué: pedir mi acceso" y "Estamos terminando de abrir…": sin campo de origen. Para cerrar la traza, conectar con Obj. 4 (aviso + garantía, defecto 1).
