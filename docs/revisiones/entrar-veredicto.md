# VEREDICTO revisor-visual — entrar (login)
Fecha: 2026-11-06 16:00
Screenshot: docs/revisiones/entrar-375.png
Usabilidad: 34/40
Craft: 16/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos: (1) el soporte solo existe como enlace de correo, sin la dirección a la vista (04 "escríbenos", 03 "Escríbenos y te damos acceso", 02 "Ya pagué: escribirles"); si el celular o el computador no tiene app de correo configurada, el enlace no hace nada, y la dirección sigue siendo el Gmail provisional "emprezaiai" (legal.ts:7) · (2) el campo de correo no avisa de errores de tipeo en el dominio (gmial.com, hotmal.com): el servidor responde 200 a todos, así que quien se equivoca ve "Revisa tu correo" y espera algo que nunca llega · (3) el párrafo de 03 "Si tiene una compra activa, trae tu enlace y tu código; si no, te explica qué hacer" no dice quién "tiene" ni qué "trae" (Acceso.tsx:307-309) · (4) la voz cambia entre "Ya pagué: escribirles" (L475) y "escríbenos" en el resto · (5) quedan text-sm en "Corregir mi correo" del estado pronto (L274) y en la tarjeta demo (L380): sigue habiendo un 4º tamaño fuera de la escala

Detalle usabilidad: h1:4 h2:3 h3:3 h4:3 h5:3 h6:4 h7:3 h8:4 h9:4 h10:3
Detalle craft: jerarquía:4 profundidad:3 identidad:3 movimiento:3 encaje:3
Copy: N-A. Pantalla de acceso para quien ya pagó; no vende.
Fidelidad: N-A (no hay referencia para esta pantalla). Contra FICHA-ARTE: fondo #0F0D16 con radial dorado. El dorado solo aparece en el CTA, en "tu ruta" y en el nodo "Hoy"; la hairline dorada→verde está en la tarjeta de la ruta y el aviso usa #FF9F43. Bricolage en display, Instrument Sans en body y Montserrat solo en el logo. Píldoras de 999px y radius-card. Todo coincide. Con esta ronda la escala ya cumple los 3 niveles en los estados principales.

## Re-revisión 2026-11-06 (2ª ronda, commit 19e6c5b)

Insumos puntuados: entrar-375.png y entrar/01-inicio … 05-sin-conexion (servidor de acceso simulado). Código: components/acceso/Acceso.tsx, components/onboarding/piezas.tsx (RutaMini) y lib/legal.ts.

Gate de carga cognitiva: 0 fallas de 8.
CTA héroe vivo: cumple los 4. Dorado sobre #0F0D16 ≈12:1. `.boton-oro:active` baja 2px. Solo se deshabilita mientras envía o verifica (L537 y L340) y mide h-14 a ancho completo.

### Defectos de la ronda anterior, uno por uno
1. Escala de 5 tamaños: CERRADO en los estados principales. RutaMini pasó a text-caption (piezas.tsx:367/391/395/398/411) y el CTA a text-base. Inicio, sin-acceso, error y enviado quedan en pregunta 28, base 16 y caption 13. Los dígitos del código van a 20px (text-xl), lo cual se acepta como dato. Quedan restos de text-sm solo en el estado "pronto" y en la tarjeta demo (defecto 5).
2. Soporte en texto rojo que no se podía tocar: CERRADO A MEDIAS. Ahora "escríbenos" es un enlace mailto con asunto y cuerpo (L521-528), y los errores de reenvío y verificación mandan al enlace de abajo (L149 y L197). Pero la dirección ya no se ve en ningún estado principal y depende de que haya una app de correo. El Gmail provisional sigue a la espera del dominio (defecto 1).
3. El error seguía visible al corregir el correo: CERRADO (L502, `if (estado === 'error') setEstado('inicio')`).
4. "Reactivar mi plan" era solo texto: CERRADO. Ahora es un botón píldora de 48px con flecha dentro del aviso (L464-470), con jerarquía secundaria clara frente al dorado (02).
5. El borde del input no se veía y la frase repetía el chip: CERRADO. El borde en reposo usa ink-3 al 45% y se ve en 01, 03 y 04 (L330 y L509). La frase centrada que repetía "5 minutos" ya no está.

### Por qué la usabilidad sube de 32 a 34
- h8 pasa a 4: en inicio queda un primario, una tarjeta de motivación y un terciario, sin repeticiones.
- h9 pasa a 4: cada error dice qué pasó y qué hacer, no se queda pegado y ofrece una salida que se puede tocar.

No llega a 36 por tres huecos que una persona real sí encuentra:
- h10 y h3 en 3: quien no tiene app de correo toca "escríbenos" y no pasa nada, y la dirección no se ve en ninguna parte (defecto 1).
- h5 en 3: un error de tipeo en el dominio termina en una espera muda, porque la respuesta es igual para todos (defecto 2).
- h2 en 3: el párrafo de "Revisa tu correo" es ambiguo (defecto 3).

### Por qué el craft sube de 15 a 16
- Jerarquía pasa a 4: al entrecerrar los ojos se ven en orden titular, CTA, cuerpo y label, con 3 tamaños.
- Los demás ejes no cambian de ancla. En encaje queda a la vista que la banda inferior de la tarjeta tiene un solo chip y deja la mitad derecha vacía, y que siguen restos de text-sm.

### Pendiente fuera de la pantalla
El envío real de correos (Resend + EMAIL_FROM) no está conectado; las capturas usan un servidor simulado. El recorrido completo (llega el enlace, llega el código, llega el aviso de "sin compra") no se ha verificado. Hay que repetir la captura de 03 con un correo real cuando se conecte el dominio.

## Hallazgos por severidad

### MEDIO
1. **El soporte depende de mailto y del Gmail provisional** (Acceso.tsx:371, 472, 523; legal.ts:7). → FIX: junto al enlace, mostrar la dirección con `select-all` (como ya hace el estado "pronto" en L269) o un botón "Copiar correo de soporte". Al comprar el dominio, cambiar a soporte@.
2. **No hay prevención de errores de tipeo en el dominio** (Acceso.tsx:92-101). → FIX: antes de enviar, comparar el dominio con los más comunes (gmail, hotmail, outlook, yahoo, icloud) y ofrecer "¿Quisiste decir carla@gmail.com?" con un toque para corregir.

### BAJO
3. **Párrafo ambiguo en "enviado"** (L307-309). → FIX: "Si ese correo tiene una compra activa, te llegan tu enlace y tu código. Si no, te explicamos qué hacer."
4. **Voz inconsistente** (L475). → FIX: "Ya pagué: escríbenos".
5. **Restos de text-sm** (L274 y L380). → FIX: pasar a text-caption.

## Historial — re-revisión 2026-11-06 (1ª ronda): NO LISTA 32·15·N-A
Top defectos de entonces: (1) 5 tamaños de texto (RutaMini en text-xs) · (2) el correo de soporte en texto rojo que no se podía tocar · (3) el error no se borraba al corregir el correo · (4) "Reactivar mi plan" era solo un texto subrayado · (5) el borde del input casi invisible y la frase centrada que repetía "5 minutos". Detalle usabilidad: h1:4 h2:3 h3:3 h4:3 h5:3 h6:4 h7:3 h8:3 h9:3 h10:3. Detalle craft: jerarquía:3 profundidad:3 identidad:3 movimiento:3 encaje:3. Estado en esta ronda: 1, 3, 4 y 5 cerrados; 2 a medias.

## Historial — revisión de auditoría 2026-10-23: NO LISTA 29·15·N-A
Top defectos de entonces: (1) confirmación falsa cuando no había compra vigente · (2) aviso "sin-acceso" sin salida · (3) un 500 o un 400 mostraban "Revisa tu conexión" · (4) soporte en emprezaiai@gmail.com · (5) 6 tamaños de texto, aviso con rounded-chip, viñetas "·" escritas a mano y ~85px vacíos. Detalle usabilidad: h1:3 h2:3 h3:3 h4:3 h5:3 h6:3 h7:3 h8:3 h9:3 h10:2. Detalle craft: 3·3·3·3·3. En la 1ª ronda del 2026-11-06 se cerraron 1, 2 y 3; 5 quedó a medias.

## Historial — ronda 5 (2026-10-07): NO LISTA 31·15·15
Top defectos de entonces: espera sin aviso ni garantía en "pronto" · al volver no reconocía el correo guardado · soporte en Hotmail personal · 6 tamaños de texto · ~95px vacíos y candados con dos sentidos. Se resolvieron el 2026-10-23: reconocimiento al volver, el ícono de privacidad y el Hotmail personal (a medias).
