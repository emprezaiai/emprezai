# VEREDICTO revisor-visual — landing (página de ventas EMPREZAI) · auditoría pre-venta con logo de la dueña y FichaViva
Fecha: 2026-10-23 12:00
Screenshot: docs/revisiones/landing-375.png
Usabilidad: 34/40
Craft: 17/20
Copy (si vende): 17/20
Copy: 17/20
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos: (1) INTEGRIDAD gate 61, bloquea PUBLICAR: la IA no está conectada y la página promete en 8 lugares que "la IA arma"; además "Nuevas rutas cada mes", "te avisamos antes de cobrar", "Cancelas en 1 toque" y "Devolución en 1 clic / Sin Preguntas" siguen sin existir · (2) §6 Oferta incoherente con la pantalla de planes: "MEJOR PRECIO" + "4 meses gratis" aquí, "Mejor valor · ahorras $39.89" allá; el plan mensual tiene 3 beneficios y el "stack" es una sola línea · (3) tres desencajes arrastrados desde 2 revisiones: franja del hero despareja ("Cancelas en 1 / toque"), condición de §7 en 4 líneas centradas, captura 1 del carrusel con la fila cortada bajo el botón central · (4) dos materiales de ficha de ícono y dos radios de chip de texto en la misma página (FichaViva 3D solo en §2 y §4; gancho y chip del mecanismo a 12px contra píldoras de 999px) · (5) el h1 tiene 12 palabras y no nombra el mecanismo; el título de §4 tiene 10

## Revisión de auditoría 2026-10-23

### Puntajes
USABILIDAD 34/40: h1:4 h2:3 h3:4 h4:3 h5:4 h6:4 h7:3 h8:3 h9:3 h10:3
CRAFT 17/20: jerarquía:3 profundidad:4 identidad:3 movimiento:4 encaje:3
COPY 17/20: idea:3 especificidad:3 emoción:4 oferta:3 acción:4 (ningún eje ≤2)
Gate doble: NO PASA. La usabilidad da 34/40 y el mínimo es 36. El craft (17/20) sí pasa. El copy (17/20) pasa su gate.
Además, aunque la pantalla pasara el gate, el bloqueo de integridad 61 impide PUBLICAR.

### Gate de carga cognitiva: 2 fallas (no llega a sobrecarga crítica)
- Falla: FAQ con 6 ítems. El tope del gate es 4-5; el kit permite 4-6.
- Falla: fichas en relieve que parecen tocables y no hacen nada. Pasa con las FichaViva de §2 y §4, los sellos de §7 (cajas tintadas con ficha dorada) y las fichas de la franja del hero. La propia FICHA-ARTE l.51 lo reconoce: "Una ficha con relieve se ve tocable".
- Pasan: 1 sola acción primaria (todos los CTA van a /onboarding), ≤4 opciones por decisión, 0 campos y el "qué sigue" se entiende.

### CTA héroe vivo: PASA
- Contraste: #FFC23D sobre #0F0D16 da unos 11.6:1, y el texto #0F0D16 sobre el dorado también.
- Respuesta al toque: whileTap scale 0.97 (ui.tsx l.211), spinner y "Reintentar" a los 8 s (ui.tsx l.181-224).
- Nunca está deshabilitado. Mide 52px en el hero y 56px en el CTA final, a ancho completo en mobile.

### Anclas de conversión: PASAN
- Titular en bold con acento en "tu negocio armado".
- 2 hairlines degradé: plan anual y garantía.
- Íconos en chips SVG (Lucide), sin emojis.
- Checkmarks custom.
- Fondos alternados base y elevado: Hero, §2-3 elevada, §4 base, §5 elevada, §6 base, §7 elevada, §8 base, §9 #231D2E.

### Test anti-clon: no coincide con "Capítulo" ni con "Umbral"

### Estructura canónica (19/55): las 10 secciones en orden
Hero, Problema, Agitación, Solución, App por dentro, Oferta, Garantía, FAQ, CTA final y Footer.
- Hay un desvío respecto a 19 §6: el "stack de valor" es una sola línea ("Mes a mes: ~~$120~~/año · Anual: $79.99"). El kit pide componentes con $ por componente y el total tachado.
- Prueba social en frío (19): la franja usa la garantía, que es el nivel 2º. No está el nivel 3º, el recorrido de la fundadora con fecha, aunque ESTADO l.156 lo dejó pendiente.

### Sub-checks de copy
- Message-match: N-A, no hay creativo de anuncio cargado.
- Garantía con nombre y plazo cerca del CTA de compra: PASA. "La Garantía Sin Preguntas" está en §7, justo bajo los planes, y el microcopy de los planes dice "15 días de garantía desde tu primer pago".

### Fidelidad con FICHA-ARTE
- Coinciden: paleta #0F0D16, #1A1622, #FFC23D y #3DDC97; Bricolage en los títulos e Instrument Sans en el cuerpo; Montserrat solo en el nombre de la marca; tarjetas de 20px.
- Desvíos menores:
  - Los chips de texto (el gancho del hero y "EL MÉTODO PIEZA A PIEZA") usan --radius-chip 12px. La ficha pide 999px para chips en píldora; 10-14px es solo para chips de ícono.
  - El radial dorado del hero está al 26% (tokens.css l.53). La ficha dice 16%.
  - El gesto "encender" de los dolores de §2 deja un halo permanente: drop-shadow 3px al 45% sobre el span animado (FichaViva.tsx l.54). La EXCEPCIÓN de la ficha (l.41) dice "sin halo". La regla `.ficha-3d.relieve-noche svg { filter:none }` no lo anula, porque el filtro va en el span y no en el svg.

### Lo que cambió desde el 2026-10-07
- Logo de la dueña en la cabecera y el pie: se lee bien. El "AI" turquesa (#2cf8c8) suma un tercer tono en la primera vista, pero es la marca y está aprobada en la ficha (l.45).
- FichaViva en §2 y §4:
  - Gestos con significado, se hacen 1 vez al entrar en pantalla y respetan reduced-motion (FichaViva.tsx l.91-103).
  - El problema: la página queda con DOS materiales de ficha de ícono. Las de §2 y §4 son 3D con brillo; las de agitación, antes/después, FAQ, franja y garantía son IconChip plano. Eso baja h4.
- El guepardo, el dispositivo propio más fuerte de la marca, no aparece en la página de ventas. Eso baja identidad a 3.

### Defectos arrastrados sin corregir (3ª revisión seguida)
- Franja del hero: "7 días gratis" va en 1 línea, y "15 días de garantía" y "Cancelas en 1 / toque" van en 2, esta última con una palabra huérfana.
- §7: la condición de la garantía sigue en 4 líneas centradas y desparejas.
- §5, captura 1 (Hoy): la fila "Tu idea en 1 pági…" queda cortada bajo el botón central.

### Integridad 61: claims que la app HOY no cumple (bloquea PUBLICAR, no puntúa en el gate de pantalla)
| Claim | Dónde | Estado real |
|---|---|---|
| "la IA arma tu primera pieza" | Subtítulo del hero | No. La pieza 1 se compone sin IA (lib/onboarding.ts, ESTADO l.167) |
| "La IA usó: Tu idea · Tu cliente ideal" / "La IA armó tu oferta" | Demo del hero | No. Está en el primer viewport |
| "la IA arma una pieza… usando las anteriores" / "La IA la entiende" / "la IA trabaja" | §4, Big Idea y pasos 1-2 | No. Los días 5-30 son borradores con plantilla (ESTADO l.173) |
| "La IA arma cada pieza con tu negocio" | Plan anual | No |
| "Aquí la IA usa todo lo que ya armaste" / "La IA ya viene incluida" | FAQ 1 y 2 | No |
| "no se usa para entrenar IA" | FAQ 5 | Sin verificar con el proveedor (ESTADO l.143) |
| "Nuevas rutas cada mes después del día 30" | Plan anual | No. No hay Ruta 2 (ESTADO l.166) |
| "te avisamos antes de cobrar" / "antes del primer cobro" | Microcopy de la oferta y FAQ 6 | No. No hay correo de aviso (ESTADO l.130) |
| "Cancelas en 1 toque" | Franja del hero y plan mensual | Sin verificar en Hotmart |
| "Devolución en 1 clic" / "Sin Preguntas" | §7, recap y PS | Sin verificar en Hotmart (ESTADO l.157) |
| "listo para descargar" · "la borras cuando quieras" | Plan anual y FAQ 5 | Sí, ya existen |

Además: el correo de soporte público en el pie es personal (gmail), ESTADO l.160.

### TOP DEFECTOS (ordenados por impacto)
1. **[Hero subtítulo y demo, §4, plan anual, FAQ 1-2 y 6, franja, §7, PS] Integridad 61.**
   - Problema: 8 claims de IA y 4 promesas operativas que la app todavía no cumple.
   - Fix: publicar solo después de la Sesión 6. Para eso hay que conectar la IA real, enviar el correo de aviso el día 5, hacer una compra de prueba con reembolso en Hotmart y escribir la Ruta 2 o quitar el claim. Si se publica antes, reescribir a "armada con tus respuestas" y sacar las 4 promesas.
2. **[§6 Oferta, badge del plan anual, plan mensual y stack] Oferta incoherente con la pantalla de planes y delgada.**
   - Problema: "MEJOR PRECIO" + "4 meses gratis" no coincide con "Mejor valor · ahorras $39.89" del paywall (Paywall.tsx l.301). Además el mensual tiene 3 beneficios y el stack es una línea.
   - Fix: usar el mismo badge y el mismo ahorro en la landing y en el paywall. Llevar el mensual a 4 beneficios ("Tu ruta de 30 días con racha y recordatorio"). Convertir el stack en 3 componentes con $ y el total tachado.
3. **[§1 franja · §7 condición · §5 captura 1] Tres desencajes arrastrados.**
   - Fix: etiquetas de 1 línea con whitespace-nowrap a 12px ("Cancelas cuando quieras"). Condición en 3 líneas: "15 días desde tu primer pago. ¿No es para ti? Pides la devolución y te devolvemos todo." Recapturar Hoy con un scroll donde ninguna fila quede bajo la barra.
4. **[§1 gancho, chip del mecanismo de §4, fichas de §3/§6/§7/§8] Dos materiales de ficha y dos radios de chip de texto en la misma página.** Además, fichas en relieve que parecen botones.
   - Fix: rounded-full en los chips de texto. Aplicar .ficha-3d a todas las fichas de ícono, o a ninguna. Quitar el relieve de los sellos de §7 y de la franja (ícono plano en el acento), para que no parezcan botones.
5. **[Hero h1 y título de §4] Fuera de presupuesto, y el mecanismo no está bautizado en el hero.**
   - Problema: el h1 tiene 12 de 10 palabras y el título de §4, 10 de 8.
   - Fix: h1 "Tu negocio armado en 30 días, pieza a pieza" (8 palabras, con el mecanismo) y §4 "Te falta [acento]el paso de hoy[/acento]".

### Otros (no top, para la próxima pasada)
- Poner el guepardo en el CTA final (§9) en lugar del rayo solo: es el momento del "día 30 con todo listo".
- El kicker "EL MECANISMO" es jerga de copywriter visible para el usuario → "CÓMO FUNCIONA".
- FAQ: bajar a 5 preguntas, fusionando la 2 con la 6 (las dos son de precio).
- En la tarjeta anual, "Se cobra $79.99/año" (12px) y "menos de $0.22 al día" (13px) son dos tamaños casi iguales: unificar en 13px.

---

## Historial — revisión 2026-10-07 (LISTA 37·18·19, re-revisión con el carrusel de capturas reales y el enlace a /login)

USABILIDAD 37/40: h1:4 h2:4 h3:4 h4:4 h5:4 h6:4 h7:4 h8:3 h9:3 h10:3
CRAFT 18/20: jerarquía:3 profundidad:4 identidad:4 movimiento:4 encaje:3
COPY 19/20: idea:4 especificidad:3 emoción:4 oferta:4 acción:4

Top defectos de entonces:
1. Integridad 61: claims de IA en 8 lugares.
2. Integridad 61: "Nuevas rutas", "te avisamos antes de cobrar", "Cancelas en 1 toque" y "Devolución en 1 clic" sin implementar.
3. §5: la captura de Hoy corta una fila y la captura de Misión tiene cerca de un 30% de aire.
4. §7: la condición va en 4 líneas.
5. §1: franja despareja; "¿Ya pagaste? Entra" no está en el código.

Estado al 2026-10-23: el 1, el 2, la captura de Hoy del 3, el 4 y la franja del 5 siguen igual. Es el 3º veredicto seguido que los reporta.
