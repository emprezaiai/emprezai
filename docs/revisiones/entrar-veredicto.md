# VEREDICTO revisor-visual — entrar (login)
Fecha: 2026-11-07 00:30
Screenshot: docs/revisiones/entrar-375.png
Usabilidad: 36/40
Craft: 16/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: LISTA
Top defectos: (1) el soporte sigue siendo el Gmail provisional emprezaiai@gmail.com y se ve en 02, 03, 04 y en el estado pronto (legal.ts:7). Cambiarlo a soporte@<dominio> al comprar el dominio es condición para vender · (2) el envío real de correos (Resend + EMAIL_FROM) no está conectado: 03 y 04 usan un servidor simulado. Al conectar el dominio, repetir 03 con un correo real y confirmar que llegan el correo de acceso y el de "sin compra" · (3) cuando el primer toque se frena por la sugerencia, el CTA no reacciona: no vibra ni se mueve, y la única señal es la línea "¿Quisiste decir…?" (Acceso.tsx:197-202) · (4) el estado 'manual' de Copiar ("Mantén presionado para copiar") nunca vuelve a "Copiar" (L89) · (5) hay dos variantes de botón secundario en píldora: "Reactivar mi plan" usa opcion-recorrido (L557) y "Ya pagué: pedir mi acceso" del estado pronto usa bg-raised-2 con borde

Detalle usabilidad: h1:4 h2:3 h3:4 h4:3 h5:4 h6:4 h7:3 h8:4 h9:4 h10:3
Detalle craft: jerarquía:4 profundidad:3 identidad:3 movimiento:3 encaje:3
Copy: N-A. Es una pantalla de acceso para quien ya pagó; no vende.
Fidelidad: N-A (no hay referencia para esta pantalla). Contra FICHA-ARTE: fondo #0F0D16 con radial dorado. El dorado solo aparece en el CTA, en "tu ruta" y en el nodo "Hoy"; la hairline dorada→verde está en la tarjeta de la ruta y el aviso usa #FF9F43. Bricolage en display, Instrument Sans en body y Montserrat solo en el logo. Escala 28/16/13, píldoras de 999px y radius-card. Todo coincide.

## Re-revisión 2026-11-06 (5ª ronda, commit bbaa265)

Insumos puntuados: entrar-375.png y entrar/01 … 06. La 06 es el resultado de tocar el CTA directo desde el campo con "gmial.com". Código: components/acceso/Acceso.tsx, lib/legal.ts y scripts/captura-entrar.mjs (prueba de la carrera: L71-81).

Gate de carga cognitiva: 0 fallas de 8.
CTA héroe vivo: cumple los 4. Dorado ≈12:1, `.boton-oro:active`, nunca deshabilitado por defecto y 56px a ancho completo.
Gate doble: 36/40 y 16/20, CUMPLE.

### Defectos de la ronda anterior, uno por uno
1. El error de servidor no decía a quién escribir: CERRADO. 04 muestra "si sigue, escríbenos:" y debajo SoporteLinea con la dirección y el botón Copiar (L643-652).
2. Carrera blur→submit: CERRADO Y PROBADO. `sugerenciaAvisada` (useRef, L164 y L197-202) se marca solo dentro de `enviar`. La prueba de Playwright hace `.click()` directo, que produce el blur real, y obtiene 0 POST al primer toque y 1 POST al segundo. La 06 muestra la sugerencia tras el toque directo.
3. Terminaciones mal escritas: CERRADO. TERMINACIONES_MAL_ESCRITAS cubre .con, .cpm, .cm, .om, .comm, .vom, .xom y .cim. También se aplica a los nombres reales: hotmail.con pasa a hotmail.com (L63). ".co" queda intacto fuera de gmail.
4. Gmail provisional: SIGUE ABIERTO. Depende del dominio; es el top 1 y condición para vender.
5. Copiar fallaba en silencio: CERRADO. El catch selecciona la dirección con Range y muestra "Mantén presionado para copiar" (L78-90). Queda un detalle menor: ese estado no se reinicia (top 4).

### Por qué la usabilidad sube de 34 a 36
- h9 vuelve a 4: cada error dice qué pasó, qué hacer y a quién escribir, con un medio que funciona aunque no haya app de correo ni portapapeles.
- h5 sube a 4:
  - Validación al tocar, con sugerencia de dominio y freno al primer toque, probado.
  - Corrección de terminaciones sin falsos positivos en los dominios reales.
  - Filtro numérico en el código y mensajes humanos en el límite de intentos.
  - El CTA nunca nace deshabilitado.
- Se mantienen en 3 porque solo una revisión con lupa encuentra qué afinar:
  - h2: "Si tiene una compra activa" deja implícito el sujeto.
  - h4: dos variantes de botón secundario en píldora.
  - h7: falta detectar un enlace pegado.
  - h10: el Gmail provisional.

### Craft 16/20 (igual)
- Jerarquía 4.
- Encaje 3: la banda inferior de la tarjeta de la ruta tiene un solo chip y deja la mitad derecha vacía; la sugerencia empuja el CTA unos 44px al aparecer.
- Profundidad, identidad y movimiento sin cambios de ancla.

### Condiciones del LISTA (fuera del puntaje de la pantalla)
El LISTA vale para la pantalla tal como se ve y funciona con el servidor simulado. Antes de vender:
- (a) cambiar `RESPONSABLE.emailContacto` a soporte@<dominio>;
- (b) conectar Resend y repetir la captura 03 con un correo real, verificando que llegan tanto el correo de acceso como el de "sin compra".

Si (b) falla, la pantalla vuelve a revisión.

## Hallazgos por severidad

### MEDIO (configuración, condición para vender)
1. **Soporte en Gmail provisional** (legal.ts:7). → FIX: soporte@<dominio> (una línea).
2. **Envío real sin verificar de punta a punta.** → FIX: al conectar el dominio, repetir 03 y 04 con el servidor real.

### BAJO
3. **El primer toque frenado no da señal en el CTA** (L197-202). → FIX: llamar `vibrar(30)` y mover la sugerencia al foco o darle un pulso de 150ms al aparecer.
4. **"Mantén presionado para copiar" nunca se reinicia** (L89). → FIX: `setTimeout(() => setCopiado('no'), 4000)`.
5. **Dos variantes de botón secundario en píldora** (L557 frente al estado pronto). → FIX: usar opcion-recorrido también en "Ya pagué: pedir mi acceso".

## Historial — re-revisión 2026-11-06 (4ª ronda, commit 355414a): NO LISTA 34·16·N-A
Top defectos de entonces: (1) REGRESIÓN: el error de servidor no tenía soporte · (2) la carrera blur→submit enviaba al primer toque · (3) .con sin detectar fuera de gmail · (4) Gmail provisional · (5) Copiar fallaba en silencio. Detalle usabilidad: h1:4 h2:3 h3:4 h4:3 h5:3 h6:4 h7:3 h8:4 h9:3 h10:3. Detalle craft: jerarquía:4 profundidad:3 identidad:3 movimiento:3 encaje:3. Estado en esta ronda: 1, 2, 3 y 5 cerrados; 4 abierto (depende del dominio).

## Historial — re-revisión 2026-11-06 (3ª ronda, commit 3bf02c2): NO LISTA 35·16·N-A
Top defectos de entonces: (1) Gmail provisional visible en 4 estados · (2) falsos positivos y parpadeo de la sugerencia · (3) soporte con 4 formatos y un "copia" sin acción · (4) párrafo de 03 de 4 líneas con mezcla de registro · (5) sugerencia sin movimiento y con un aria-live poco fiable. Detalle usabilidad: h1:4 h2:3 h3:4 h4:3 h5:3 h6:4 h7:3 h8:4 h9:4 h10:3. Detalle craft: 4·3·3·3·3.

## Historial — re-revisión 2026-11-06 (2ª ronda, commit 19e6c5b): NO LISTA 34·16·N-A
Top defectos de entonces: (1) soporte solo por mailto · (2) sin prevención de errores de tipeo en el dominio · (3) párrafo ambiguo en "enviado" · (4) "escribirles" · (5) restos de text-sm. Detalle usabilidad: h1:4 h2:3 h3:3 h4:3 h5:3 h6:4 h7:3 h8:4 h9:4 h10:3. Detalle craft: 4·3·3·3·3.

## Historial — re-revisión 2026-11-06 (1ª ronda): NO LISTA 32·15·N-A
Top defectos de entonces: (1) 5 tamaños de texto · (2) soporte en texto rojo que no se podía tocar · (3) el error no se borraba al corregir · (4) "Reactivar mi plan" era solo un texto · (5) borde del input casi invisible y la frase repetida. Detalle usabilidad: h1:4 h2:3 h3:3 h4:3 h5:3 h6:4 h7:3 h8:3 h9:3 h10:3. Detalle craft: 3·3·3·3·3.

## Historial — revisión de auditoría 2026-10-23: NO LISTA 29·15·N-A
Top defectos de entonces: (1) confirmación falsa sin compra vigente · (2) aviso "sin-acceso" sin salida · (3) un 500 o un 400 mostraban "Revisa tu conexión" · (4) soporte en emprezaiai@gmail.com · (5) 6 tamaños de texto, aviso con rounded-chip, viñetas escritas a mano y ~85px vacíos. Detalle usabilidad: h1:3 h2:3 h3:3 h4:3 h5:3 h6:3 h7:3 h8:3 h9:3 h10:2. Detalle craft: 3·3·3·3·3.

## Historial — ronda 5 (2026-10-07): NO LISTA 31·15·15
Top defectos de entonces: espera sin aviso ni garantía en "pronto" · al volver no reconocía el correo guardado · soporte en Hotmail personal · 6 tamaños de texto · ~95px vacíos y candados con dos sentidos.
