# VEREDICTO revisor-visual — entrar (login)
Fecha: 2026-10-23 12:00
Screenshot: docs/revisiones/entrar-375.png
Usabilidad: 29/40
Craft: 15/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos: (1) si el correo no tiene una compra vigente, el servidor no manda nada (accesos.ts:78) y la pantalla igual dice "Te enviamos tu enlace": quien pagó con otro correo, o tiene la suscripción vencida, espera un correo que nunca llega · (2) el aviso "sin-acceso" (Acceso.tsx:428) dice "escríbenos" pero no da enlace ni dirección, no ofrece renovar y debajo sigue el mismo CTA que lleva al callejón del defecto 1 · (3) un 500 o un 400 del servidor caen en el catch y muestran "Revisa tu conexión" (L143, L150, L468), aunque la red funcione · (4) el soporte es emprezaiai@gmail.com (lib/legal.ts:7): un Gmail gratuito con "aiai" que parece error de tipeo, y es la única salida para quien pagó y no puede entrar · (5) siguen 6 tamaños de texto (la ficha pide 3 niveles); además, los avisos usan rounded-chip mientras las tarjetas usan radius-card, las viñetas son "·" escritas a mano sin sangría colgante y quedan ~85px vacíos abajo a 375

Detalle usabilidad: h1:3 h2:3 h3:3 h4:3 h5:3 h6:3 h7:3 h8:3 h9:3 h10:2
Detalle craft: jerarquía:3 profundidad:3 identidad:3 movimiento:3 encaje:3
Copy: N-A. Es una pantalla de acceso de quien ya pagó y no vende. En la ronda anterior se le dio 15/20; ahora se deja fuera para que no infle ni frene el gate.
Fidelidad: N-A (no hay referencia). Contra FICHA-ARTE: fondo #0F0D16, dorado #FFC23D solo en CTA, acento del título y nodo "Hoy", verde #3DDC97 en logro y borde de la ruta, Bricolage display + Instrument Sans body, píldoras 999px y tarjeta 18-22px. Coincide. El desvío es la escala: label 10.5-12px y 3 niveles en la ficha, 6 tamaños en la pantalla.

## Revisión de auditoría 2026-10-23

Insumos puntuados: entrar-375.png (inicio con pieza), app/01, 02-entrar-error, 03-entrar-revisa-correo-arriba/final, 22b, 23-entrar-sin-servidor, 23b-entrar-real-vuelve, auditoria-2026-10-23/login-sin-acceso y login-vencido. Código: app/login/page.tsx, components/acceso/Acceso.tsx, app/api/acceso/enviar/route.ts, app/api/acceso/verificar/route.ts, lib/servidor/accesos.ts, lib/legal.ts, app/globals.css (.boton-oro).

Gate de carga cognitiva: 0 fallas de 8. En "enviado" hay 1 primario, la tarjeta de ayuda y 2 terciarios; la tarjeta "Modo demostración" solo existe en localhost con bandera.
CTA héroe vivo, inicio y enviado: cumple los 4. Dorado sobre #0F0D16 ≈12:1. `.boton-oro:active` hace translateY(2px) y aplana la sombra (globals.css:234). Solo se deshabilita mientras envía o verifica (L473, L329) y valida al tocar con un mensaje. Mide 56px a ancho completo.

### Qué cambió desde la ronda 5
- Acceso real con enlace y código de 6-8 dígitos, `autoComplete="one-time-code"`, filtro de solo números, límites 429 con texto humano y "Revisando…" inline. Es un avance real: h1 y h7 dejan de estar atados al callejón de "pronto".
- La tarjeta "¿Compraste y no te llega?" ataca el caso más frecuente (correo distinto o spam). Bien ubicada, aunque la viñeta "·" sin sangría colgante se ve hecha a mano en la 03.
- Avisos por URL: "enlace-vencido" está bien resuelto (qué pasó, qué hacer y en cuánto llega). "sin-acceso" no (defecto 2).
- Logo nuevo visible y alineado. "Ya guardaste este correo" sobre el campo (23b) corrige el defecto 2 de la ronda 5. El ShieldCheck de privacidad corrige el choque de candados.
- Soporte: el Hotmail personal pasó a emprezaiai@gmail.com. Mejora a medias (defecto 4).

### Por qué la usabilidad baja de 31 a 29
El acceso real abrió dos callejones nuevos que la versión "pronto" no tenía. Sin compra vigente, la pantalla confirma un envío que no ocurre. Y el aviso "sin-acceso" no lleva a ninguna parte. Por eso h10 baja a 2 (la persona afectada lo nota sin buscarlo) y h9 baja de 4 a 3 (el error de servidor se disfraza de error de red).

## Hallazgos por severidad

### ALTO
1. **Confirmación falsa cuando no hay compra vigente** (accesos.ts:76-78 + Acceso.tsx:144-148). Mantener la misma respuesta para todos los correos está bien. Lo que falla es que nadie recibe nada: ni quien pagó con otro correo, ni quien tiene la suscripción vencida. → FIX: cuando no hay compra vigente, mandar a ESE correo un aviso "No encontramos una compra activa con este correo: revisa el correo de tu comprobante de Hotmart o responde este mensaje". Solo lo ve quien tiene acceso a ese buzón, así que la anti-enumeración se mantiene.
2. **El aviso "sin-acceso" no tiene salida** (Acceso.tsx:424-430, login-sin-acceso.png). Dice "escríbenos" sin enlace ni dirección. No ofrece renovar. Usa el mismo gris neutro, sin ícono, que un aviso informativo. → FIX: color de aviso #FF9F43 con ícono, un enlace mailto a soporte con el correo en el asunto y un enlace "Reactivar mi plan" al checkout de Hotmart. Si la persona tiene sesión, rellenar el campo con su correo.

### MEDIO
3. **El error de servidor dice "revisa tu conexión"** (L143 `throw`, L150, L468). Con un 500 o un 400, el mensaje culpa a la red del usuario. → FIX: separar `!res.ok`: "No pudimos enviar el enlace ahora. Intenta en un minuto o escríbenos a {soporte}". El texto de red queda solo para el `catch` de fetch.
4. **El soporte es emprezaiai@gmail.com** (lib/legal.ts:7). Un correo gratuito, con "aiai" que parece error de tipeo, como única vía para quien ya pagó. → FIX: soporte@ del dominio propio (ya se necesita para Resend). Si no se puede, verificar que el alias se escribe bien.

### BAJO
5. **La escala tipográfica y el encaje no cambian.** Siguen 6 tamaños (text-pregunta, base, boton, sm para label y "Corregir", caption, xs en el eyebrow y los chips de RutaMini). El aviso usa `--radius-chip` y las tarjetas `--radius-card` en la misma vista. Las viñetas "·" escritas a mano no tienen sangría colgante. Quedan ~85px vacíos bajo el texto de la ruta en entrar-375. → FIX: label y terciarios a caption, el xs de RutaMini a caption, el aviso a `--radius-card`, la lista con `<li>` y marcador SVG del kit (checkmark custom) y `pl` colgante. "MISMO" en mayúsculas pasa a semibold.

## Historial — ronda 5 (2026-10-07): NO LISTA 31·15·15
Top defectos de entonces: espera sin aviso ni garantía en "pronto" · al volver no reconocía el correo guardado · soporte en Hotmail personal · 6 tamaños de texto · ~95px vacíos y candados con dos sentidos. Resueltos en esta ronda: reconocimiento al volver (23b), el ícono de privacidad y el Hotmail personal (a medias). Siguen: escala tipográfica y vacío inferior. La garantía con nombre sigue sin aparecer en ningún estado de acceso.
