# VEREDICTO revisor-visual — entrar (login)
Fecha: 2026-11-06 19:00
Screenshot: docs/revisiones/entrar-375.png
Usabilidad: 35/40
Craft: 16/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos: (1) el soporte, única salida para quien pagó y no entra, ahora se ve en 02, 03, 04 y en el estado pronto, y es emprezaiai@gmail.com, un Gmail con "aiai" que parece error de tipeo (legal.ts:7). Se corrige al comprar el dominio · (2) la sugerencia de dominio da falsos positivos con dominios reales: hotmail.cl, live.cl, outlook.cl (Chile), mail.com, ymail.com y email.com quedan a distancia ≤2 de uno de la lista y reciben un "¿Quisiste decir…@hotmail.com/gmail.com?" equivocado. Además parpadea al escribir: con "gmail.co" ya sugiere, antes de la "m" (Acceso.tsx:33, 50-55, 111) · (3) el soporte se presenta de 4 formas distintas ("o copia el correo:", "Soporte:", "escríbenos a", "o escríbenos a"), y "copia" promete una acción que no existe, porque solo hay texto con select-all (L302, 410, 515, 583) · (4) en 03, el párrafo ocupa 4 líneas con "hacer." huérfana y mezcla registro: "Le escribimos" y "te llegan" (L340-343) · (5) la sugerencia aparece de golpe, sin animación, y su aria-live se monta junto con el contenido, así que un lector de pantalla puede no anunciarla (L556-571)

Detalle usabilidad: h1:4 h2:3 h3:4 h4:3 h5:3 h6:4 h7:3 h8:4 h9:4 h10:3
Detalle craft: jerarquía:4 profundidad:3 identidad:3 movimiento:3 encaje:3
Copy: N-A. Es una pantalla de acceso para quien ya pagó; no vende.
Fidelidad: N-A (no hay referencia para esta pantalla). Contra FICHA-ARTE: fondo #0F0D16 con radial dorado. El dorado solo aparece en el CTA, en "tu ruta" y en el nodo "Hoy"; la hairline dorada→verde está en la tarjeta de la ruta y el aviso usa #FF9F43. Bricolage en display, Instrument Sans en body y Montserrat solo en el logo. Escala de 3 niveles (28/16/13), píldoras de 999px y radius-card. Todo coincide.

## Re-revisión 2026-11-06 (3ª ronda, commit 3bf02c2)

Insumos puntuados: entrar-375.png y entrar/01-inicio … 05-sin-conexion, más 06-sugerencia-dominio ("gmial.com"). Código: components/acceso/Acceso.tsx y lib/legal.ts.

Gate de carga cognitiva: 0 fallas de 8.
CTA héroe vivo: cumple los 4, sin cambios respecto de la ronda anterior.

### Defectos de la ronda anterior, uno por uno
1. El soporte dependía solo de mailto: CERRADO en lo que toca a la pantalla. `CorreoSoporte` muestra la dirección con select-all en 02 (L515), 03 (L410) y 04 (L583), y el estado pronto ya la mostraba (L302). Sigue abierto el Gmail provisional, que ahora se ve en más lugares (pasa a ser el top 1, por configuración externa).
2. No se prevenían errores de tipeo en el dominio: CERRADO A MEDIAS. La sugerencia funciona (06: "¿Quisiste decir carla.mendez@gmail.com?" con un toque para corregir, 44px, y no bloquea el envío). Pero la lista y el umbral generan falsos positivos con dominios reales (top 2).
3. El párrafo de "enviado" era ambiguo: CERRADO. Ahora dice "Si ese correo tiene una compra activa, te llegan tu enlace y tu código. Si no, te explicamos qué hacer." Queda una mezcla menor de registro y una línea huérfana (top 4).
4. La voz no coincidía ("escribirles"): CERRADO. Ahora dice "Ya pagué: escríbenos" (L511).
5. Quedaban restos de text-sm: CERRADO. "Corregir mi correo" (L307) y la tarjeta demo (L416) ya están en text-caption.

### Por qué la usabilidad sube de 34 a 35
h3 pasa a 4: todas las salidas están a la vista (logo al inicio, "Usar otro correo", "Corregir mi correo", reactivar o escribir) y el soporte ya no depende de que haya una app de correo.

No llega a 36 por dos ejes:
- h5 se queda en 3. La prevención es buena, pero quien escribe un dominio real como hotmail.cl ve una corrección equivocada, y quien escribe gmail.com ve sugerencias mientras tipea. Con la duda, se elige el ancla menor.
- h10 se queda en 3. Toda la ayuda desemboca en un Gmail provisional con "aiai".

Para pasar el gate:
- Corregir la lista de dominios: h5 sube a 4 y el total llega a 36/40.
- Cambiar al correo del dominio: h10 sube a 4.

### Craft 16/20 (igual)
- Jerarquía 4: 3 tamaños y 4 niveles nítidos.
- Encaje 3: el párrafo de 03 deja "hacer." sola en la 4ª línea, el soporte tiene 4 formatos y la sugerencia entra sin animación.
- Profundidad, identidad y movimiento sin cambios.

### Pendiente fuera de la pantalla
El envío real (Resend + EMAIL_FROM) sigue sin conectar y las capturas 03 y 04 usan un servidor simulado. Cuando se conecte el dominio, repetir 03 con un correo real y verificar que lleguen los dos correos: el de acceso y el de "sin compra".

## Hallazgos por severidad

### MEDIO
1. **El correo de soporte es un Gmail provisional, visible en 4 estados** (legal.ts:7). → FIX: soporte@<dominio> en `RESPONSABLE.emailContacto` en cuanto se compre el dominio. Es un cambio de una línea y propaga a todos los estados.
2. **Falsos positivos y parpadeo de la sugerencia** (Acceso.tsx:33, 50-55, 111). → FIX:
   - Agregar una lista de dominios válidos que nunca se corrigen: hotmail.cl, live.cl, outlook.cl, outlook.es, hotmail.com.ar, hotmail.com.mx, yahoo.com.mx, yahoo.com.ar, live.com.mx, mail.com, ymail.com, email.com, me.com, protonmail.com.
   - Comparar solo la parte antes del primer punto, con distancia ≤1 si tiene 5 letras o menos y ≤2 si tiene más.
   - Calcular la sugerencia al salir del campo (onBlur) o al tocar el CTA, no en cada tecla.

### BAJO
3. **Formato de soporte inconsistente y un "copia" sin acción** (L302, 410, 515, 583). → FIX: un solo componente "Soporte: emprezaiai@… [Copiar]" con navigator.clipboard y "Copiado" durante 2 s, idéntico en los 4 estados.
4. **Párrafo de 4 líneas con mezcla de registro** (L340-343). → FIX: "Escribimos a {email}. Si tiene una compra activa, te llegan tu enlace y tu código; si no, te explicamos qué hacer." (o `text-balance`).
5. **La sugerencia aparece sin movimiento y el anuncio no es confiable** (L556-571). → FIX: dejar montado un contenedor `aria-live="polite"` fijo y animar la sugerencia dentro con fade + y 4px en 150ms (con reduced-motion respetado).

## Historial — re-revisión 2026-11-06 (2ª ronda, commit 19e6c5b): NO LISTA 34·16·N-A
Top defectos de entonces: (1) el soporte solo por mailto, sin la dirección a la vista · (2) sin prevención de errores de tipeo en el dominio · (3) párrafo ambiguo en "enviado" · (4) "escribirles" en lugar de "escríbenos" · (5) restos de text-sm. Detalle usabilidad: h1:4 h2:3 h3:3 h4:3 h5:3 h6:4 h7:3 h8:4 h9:4 h10:3. Detalle craft: jerarquía:4 profundidad:3 identidad:3 movimiento:3 encaje:3. Estado en esta ronda: 1, 3, 4 y 5 cerrados; 2 a medias.

## Historial — re-revisión 2026-11-06 (1ª ronda): NO LISTA 32·15·N-A
Top defectos de entonces: (1) 5 tamaños de texto (RutaMini en text-xs) · (2) el correo de soporte en texto rojo que no se podía tocar · (3) el error no se borraba al corregir el correo · (4) "Reactivar mi plan" era solo un texto subrayado · (5) el borde del input casi invisible y la frase que repetía "5 minutos". Detalle usabilidad: h1:4 h2:3 h3:3 h4:3 h5:3 h6:4 h7:3 h8:3 h9:3 h10:3. Detalle craft: 3·3·3·3·3. En la 2ª ronda se cerraron 1, 3, 4 y 5; 2 quedó a medias.

## Historial — revisión de auditoría 2026-10-23: NO LISTA 29·15·N-A
Top defectos de entonces: (1) confirmación falsa cuando no había compra vigente · (2) aviso "sin-acceso" sin salida · (3) un 500 o un 400 mostraban "Revisa tu conexión" · (4) soporte en emprezaiai@gmail.com · (5) 6 tamaños de texto, aviso con rounded-chip, viñetas "·" escritas a mano y ~85px vacíos. Detalle usabilidad: h1:3 h2:3 h3:3 h4:3 h5:3 h6:3 h7:3 h8:3 h9:3 h10:2. Detalle craft: 3·3·3·3·3. En la 1ª ronda del 2026-11-06 se cerraron 1, 2 y 3; 5 quedó a medias.

## Historial — ronda 5 (2026-10-07): NO LISTA 31·15·15
Top defectos de entonces: espera sin aviso ni garantía en "pronto" · al volver no reconocía el correo guardado · soporte en Hotmail personal · 6 tamaños de texto · ~95px vacíos y candados con dos sentidos. Se resolvieron el 2026-10-23: reconocimiento al volver, el ícono de privacidad y el Hotmail personal (a medias).
