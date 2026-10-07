# VEREDICTO revisor-visual — landing (página de ventas EMPRESAI) · re-revisión con el carrusel de capturas reales y el enlace a /login
Fecha: 2026-10-07 18:00
Screenshot: docs/revisiones/landing-375.png
Usabilidad: 37/40
Craft: 18/20
Copy (si vende): 19/20
Copy: 19/20
Fidelidad (si hubo referencia): N-A
Veredicto: LISTA
Top defectos: (1) INTEGRIDAD, bloquea PUBLICAR: se quitó la IA del carrusel, pero la página sigue diciendo en 8 lugares que la IA arma las piezas, y el demo del hero muestra "La IA armó tu oferta" · (2) INTEGRIDAD, bloquea PUBLICAR: "Nuevas rutas cada mes después del día 30", "te avisamos antes de cobrar", "Cancelas en 1 toque" y "Devolución en 1 clic / Sin Preguntas" todavía no están implementados · (3) §5 la captura de la misión tiene casi un tercio vacío y la captura de Hoy corta una fila bajo el botón central · (4) §7 la condición sigue en 4 líneas centradas y desparejas · (5) §1 la franja del hero sigue despareja; "¿Ya pagaste? Entra" no está en el código (el encabezado dice "Entrar")

## Detalle
USABILIDAD 37/40 — h1:4 h2:4 h3:4 h4:4 h5:4 h6:4 h7:4 h8:3 h9:3 h10:3
CRAFT 18/20 — jerarquía:3 profundidad:4 identidad:4 movimiento:4 encaje:3
COPY 19/20 — idea:4 especificidad:3 emoción:4 oferta:4 acción:4 (ningún eje ≤2)
Gate doble: PASA (37/40 ≥ 36 y 18/20 ≥ 16). Gate de copy: PASA (19/20).
Gate de carga cognitiva: 0 fallas.
Anti-clon: no coincide con "Capítulo" ni con "Umbral".
CTA héroe vivo: PASA (≈12:1 · whileTap 0.97 en ui.tsx l.202/211 · nunca deshabilitado · 52-56px · ancho completo).
Sub-checks de copy:
- Message-match: N-A.
- Garantía con nombre y plazo cerca del CTA de compra: PASA.

## Carrusel §5 con capturas reales — ¿sigue vendiendo?
- Fidelidad con FICHA-ARTE: ✅
  - Fondo #0F0D16, dorado #FFC23D solo en CTA, nodo de hoy y botón central; verde en el progreso.
  - Bricolage Grotesque y Instrument Sans; nodos y fichas en relieve; chips en píldora.
  - El marco de 250px con relación 9:19.5 coincide con las capturas de 750×1624: no se deforman ni se recortan.
- Coherencia con la promesa: ✅ con matiz
  - Las 4 capturas usan el mismo negocio de ejemplo que el demo del hero ("Mini curso de Excel"), así que la prueba es una sola historia.
  - Las capturas son de la app construida, una prueba más fuerte que las vistas previas diseñadas.
  - Matiz: ninguna captura muestra a la IA trabajando. El mecanismo que se bautiza en §4 ("la IA arma una pieza usando las anteriores") queda probado solo por el demo rotulado del hero.
  - La etiqueta "Tu pieza, armada con tus respuestas" es honesta, pero choca con el resto de la página, que dice "la IA arma".
- Legibilidad: ⚠️ al 67% de escala, el texto de cuerpo de las capturas queda a unos 9px. Los títulos y los datos héroe (7 · 7 · 0/7, "Hoy: crea el nombre de tu negocio") se leen; es aceptable para un carrusel de teléfonos.
- Defectos visibles (defecto 3):
  - Frame 1 (Hoy): la última fila "Tu idea en 1 pági…" queda cortada bajo el botón central. En el primer frame que se ve, parece un error.
  - Frame 3 (Misión): bandas vacías arriba (entre "Se arma con" y el título) y abajo (entre la pista de mañana y el CTA). Cerca del 30% del frame es aire muerto.
  - Frame 3 es del día 2, mientras los frames 1, 2 y 4 son del día 8. Es menor, pero rompe la secuencia.

## Claims que la app HOY no cumple (verificado en código y en ESTADO.md)
| Claim | Dónde | Estado real |
|---|---|---|
| "la IA arma tu primera pieza" | Subtítulo del hero | ❌ La pieza se compone con lib/onboarding.ts → armarPrimeraPieza, sin IA (ESTADO l.153) |
| "La IA usó: Tu idea · Tu cliente ideal" / "La IA armó tu oferta" | Demo del hero (DemoMisionHero) | ❌ Es el mismo tipo de claim que se quitó del carrusel; sigue en el primer viewport |
| "la IA arma una pieza de tu negocio usando las anteriores" | Big idea de §4 | ❌ Los días 5-30 son borradores guiados con plantilla (ESTADO l.159) |
| "La IA la entiende" / "la IA trabaja" | Pasos 1 y 2 de §4 | ❌ Ídem |
| "La IA arma cada pieza con tu negocio" | Plan anual | ❌ Ídem |
| "La IA ya viene incluida" / "Aquí la IA usa todo lo que ya armaste" | Preguntas frecuentes | ❌ Ídem |
| "no se usa para entrenar IA" | Preguntas frecuentes | ⚠️ Falta verificarlo con el proveedor (ESTADO l.133) |
| "Nuevas rutas cada mes después del día 30" | Plan anual | ❌ No hay Ruta 2 en el código (grep vacío); solo está planificada (ESTADO l.71) |
| "te avisamos antes de cobrar" / "antes del primer cobro" | Microcopy de la oferta y preguntas frecuentes | ❌ Hoy no se envía ningún correo (ESTADO l.156) |
| "Cancelas en 1 toque" | Franja del hero y plan mensual | ❌ Depende de Hotmart (ESTADO l.156) |
| "Devolución en 1 clic" / "Sin Preguntas" | §7, recap y PS | ❌ Falta verificarlo en Hotmart (ESTADO l.144) |
| "listo para descargar" | Plan anual | ✅ Empresa.tsx y Perfil.tsx tienen descarga |
| "la borras cuando quieras" | Preguntas frecuentes | ✅ Perfil → "Borrar mis datos" con confirmación |

Conclusión: quitar la IA del carrusel no resolvió el bloqueo de publicación, porque la misma promesa sigue en el hero (texto y demo) y en otros 6 lugares. O todos estos claims quedan como 🔴 BLOQUEA PUBLICAR hasta la Sesión 6, o se reescriben. Mantener un solo criterio para toda la página.

## Top defectos (priorizados — NO bloquean el gate de pantalla; el 1 y el 2 bloquean PUBLICAR)
1. **[§1 subtítulo y demo, §4, plan anual, preguntas frecuentes] Integridad, gate 61: claims de IA que la app hoy no hace.**
   - Problema: el criterio que sacó la IA del carrusel no se aplicó al resto de la página.
   - Fix: ampliar el 🔴 de ESTADO l.152 a la lista de arriba y publicar solo con la IA real conectada (Sesión 6). Si se publica antes, reescribir los 8 claims para que digan "la ruta arma" o "armada con tus respuestas".
2. **[Plan anual, microcopy de la oferta, franja del hero, §7] Integridad, gate 61: promesas sin implementar.**
   - Problema: "Nuevas rutas cada mes", "te avisamos antes de cobrar", "Cancelas en 1 toque" y "Devolución en 1 clic / Sin Preguntas" todavía no existen.
   - Fix: antes de publicar, escribir la Ruta 2, enviar el correo de aviso con Resend y verificar cancelación y reembolso en Hotmart con una compra de prueba. Si algo no se cumple, sacar ese claim.
3. **[§5 carrusel, frames 1 y 3]**
   - Problema: la fila "Tu idea en 1 pági…" queda cortada bajo el botón central, y la captura de la misión del día 2 tiene cerca de un 30% de aire muerto.
   - Fix: recapturar Hoy con un scroll en el que ninguna fila quede bajo la barra, y Misión en un estado lleno (por ejemplo, el borrador del día 8 con su pista), para que las 4 sean del mismo día.
4. **[§7 condición bajo el nombre] (sin corregir desde la pasada anterior)**
   - Problema: 4 líneas centradas con los bordes desparejos.
   - Fix: "15 días desde tu primer pago. ¿No es para ti? Pides la devolución en 1 clic y te devolvemos todo." con `text-balance`, para que quepa en 3 líneas.
5. **[§1 franja bajo el CTA y encabezado] (sin corregir desde la pasada anterior)**
   - Problema: "7 días gratis" va en 1 línea y las otras dos etiquetas en 2. Además, el enlace "¿Ya pagaste? Entra" que se describió no existe: page.tsx no pasa `loginLabel`, así que el encabezado muestra "Entrar".
   - Fix: etiquetas de 1 línea con `whitespace-nowrap` a 12px. Si la dueña elige "¿Ya pagaste? Entra", pasar `loginLabel="¿Ya pagaste? Entra"` en app/page.tsx.

## Pendientes anotados (no puntúan)
- Defectos 1 y 2: hay que resolverlos en la Sesión 6 antes de publicar.
- Email de soporte con dominio propio.
- Configurar Hotmart con garantía de 15 días desde el primer pago.
- Prueba de terceros: el eje de especificidad sigue en 3 sin testimonios reales.
