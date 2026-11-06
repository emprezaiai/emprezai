# VEREDICTO revisor-visual — landing (página de ventas EMPREZAI) · re-revisión tras las correcciones del 2026-11-06
Fecha: 2026-11-06 12:00
Screenshot: docs/revisiones/landing-375.png
Usabilidad: 35/40
Craft: 17/20
Copy (si vende): 18/20
Copy: 18/20
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos: (1) §6 el plan Anual cobra 12 meses por una ruta de 30 días y, sin el claim "Nuevas rutas", ya no dice qué recibe la persona del mes 2 al 12; ninguna FAQ lo responde · (2) §6 la tarjeta del stack se ve desencajada: la línea 1 tiene whitespace-nowrap, se sale del padding y toca el borde derecho; la línea 2 empieza con "·"; el ahorro se repite · (3) §5 captura 1 (Hoy): la fila "Tu idea en 1 pági…" sigue cortada bajo el botón central (4ª revisión seguida) · (4) Integridad 61 bloquea PUBLICAR: Hotmart, el período gratis, el aviso por correo, la cancelación, "Sin Preguntas", "no entrena IA" y el gmail del pie siguen sin verificar · (5) §9 el acento "día 30" queda partido en dos líneas y la tarjeta anual mezcla 12px y 13px

## Revisión 2026-11-06

### Puntajes
USABILIDAD 35/40: h1:4 h2:4 h3:4 h4:3 h5:4 h6:4 h7:3 h8:3 h9:3 h10:3
CRAFT 17/20: jerarquía:3 profundidad:4 identidad:4 movimiento:4 encaje:2
COPY 18/20: idea:4 especificidad:3 emoción:4 oferta:3 acción:4 (ningún eje ≤2)
Gate doble: NO PASA. La usabilidad da 35/40 y el mínimo es 36. El craft (17/20) y el copy (18/20) sí pasan.
Aparte del gate, el bloqueo de integridad 61 impide PUBLICAR hasta que estén conectados Hotmart y Resend.

### Gate de carga cognitiva: 1 falla (no es sobrecarga crítica)
- Sigue fallando: hay fichas en relieve (.ficha-3d) que parecen tocables y no hacen nada. Están en los dolores de §2, en los 3 chips de cifras de §3 y en los chips de antes/después de §4.
- Ya pasan: la franja del hero y los sellos de §7, que ahora son íconos planos. El FAQ bajó a 5 preguntas.
- También pasan: 1 sola acción primaria, ≤4 opciones por decisión, 0 campos y el "qué sigue" se entiende.

### CTA héroe vivo: PASA
- Contraste: #0F0D16 sobre #FFC23D da unos 11.6:1.
- Respuesta al toque: whileTap 0.97, spinner y "Reintentar" a los 8 s (ui.tsx l.181-224).
- Nunca está deshabilitado. Mide 52px en el hero y 56px en el CTA final, a ancho completo.

### Anclas de conversión: PASAN
- H1 en bold con el acento en "Tu negocio armado".
- 2 hairlines degradé: plan anual y garantía.
- Íconos en chips SVG Lucide, sin emojis.
- Checkmarks custom.
- Fondos alternados entre base y elevado.

### Test anti-clon: no coincide con "Capítulo" ni con "Umbral"

### Fidelidad con FICHA-ARTE: coincide
- Paleta #0F0D16, #1A1622, #231D2E, #FFC23D y #3DDC97.
- Bricolage en display, Instrument Sans en el cuerpo y Montserrat solo en el nombre de la marca.
- Radios: tarjetas de 20px y chips de texto en píldora de 999px.
- Radial dorado del hero al 16% (tokens.css l.53).
- El gesto "encender" ya no deja halo permanente (FichaViva.tsx l.48-58).

### Estado de los TOP DEFECTOS del 2026-10-23
1. Integridad 61 — CERRADO EN PARTE.
   - Cerrado: la IA real existe en el código (/api/ia/primera-pieza en lib/onboarding.ts l.425 y /api/ia/mision) y se declaró verificada en producción. Se quitó "Nuevas rutas cada mes".
   - Siguen abiertos (ver TOP 4): "Pagas seguro por Hotmart", "7 días gratis" (ESTADO l.69: no se verificó que el período gratis de Hotmart aplique a una app externa), "te avisamos antes de cobrar" en el microcopy y en FAQ 2 (el aviso está en el cron, pero Resend no está conectado), "Cancelas cuando quieras" y "Sin permanencia", "Sin Preguntas", "Sin explicaciones" y "100% de vuelta" (falta la compra de prueba con reembolso), "no se usa para entrenar IA" (ESTADO l.147) y el gmail personal del pie.
2. Coherencia de la oferta con el paywall — CERRADO EN PARTE.
   - Cerrado: "MEJOR VALOR" + "Ahorras $39.89" coincide con el paywall, y el plan mensual tiene 4 beneficios.
   - Abierto: el stack sigue siendo una sola línea y ahora se ve mal (TOP 2).
3. Tres desencajes arrastrados — CERRADO EN PARTE.
   - Cerrado: la franja del hero va en 1 línea y la condición de §7 en 3 líneas.
   - Abierto: la captura de Hoy (TOP 3).
4. Dos materiales y dos radios — CERRADO.
   - IconChip ahora usa .ficha-3d en toda la página.
   - Los chips de texto van en rounded-full.
   - Los sellos y la franja son planos.
5. H1 y título de §4 — CERRADO. El h1 tiene 9 palabras y nombra el método; §4 dice "Te falta el paso de hoy".

Además se cerró lo de "Otros": el guepardo aparece en §9, el kicker dice "CÓMO FUNCIONA" y el FAQ tiene 5 preguntas. Sigue abierto lo de los tamaños 12/13px en la tarjeta anual.

### TOP DEFECTOS (ordenados por impacto)
1. **[§6 Oferta, tarjeta Anual + §8 FAQ] Falta qué recibe la persona del mes 2 al 12.**
   - Problema: el plan Anual cobra $79.99 por 12 meses, pero la ruta dura 30 días ("La misma ruta de 30 días" en el mensual). Al quitar "Nuevas rutas", la página no dice qué recibe la persona del mes 2 al 12, y es la primera objeción de quien compara los planes.
   - Fix: agregar una feature y una FAQ "¿Y después del día 30?" con lo que la app hace HOY después del día 30 (editar y regenerar piezas con IA, descargar, la racha). Si eso no alcanza, construir la Ruta 2 antes de empujar el plan anual.
2. **[§6, tarjeta del stack sobre los planes] Desencaje visible y dato repetido.**
   - Problema: "12 meses en el plan mensual: $119.88/año" tiene whitespace-nowrap (Oferta.tsx l.126), así que se sale del padding y toca el borde derecho. La línea 2 empieza con "·". El ahorro aparece dos veces.
   - Fix: pasar 2 líneas a stack.lineas para usar la rama de filas con el $ a la derecha ("Mensual × 12 → ~~$119.88~~" y "Anual → $79.99"). La otra opción es quitar la tarjeta y dejar el ahorro solo en el plan.
3. **[§5 carrusel, captura 1 "Tu misión de hoy"] Fila cortada (4ª revisión seguida).**
   - Problema: la fila "Tu idea en 1 pági…" queda cortada bajo el botón central.
   - Fix: recapturar public/landing/app-hoy.png con un scroll donde la última fila visible termine sobre la barra, o recortar la imagen antes de esa fila.
4. **[Microcopy de §6, FAQ 2 y 5, franja del hero, §7, recap y PS de §9, pie] Integridad 61: bloquea PUBLICAR, no el gate de pantalla.**
   - Problema: la página ya promete Hotmart, el período gratis de 7 días, el aviso antes de cobrar, cancelar cuando quieras, la devolución sin preguntas y "no entrena IA", pero nada de eso está conectado ni verificado. El soporte del pie es un gmail personal.
   - Fix: conectar Hotmart y Resend, hacer una compra de prueba con reembolso, verificar los términos del proveedor de IA y poner soporte@dominio. Si se publica antes, sacar esas promesas.
5. **[§9 h2 "Imagina tu día 30 con todo listo" + tarjeta Anual] Acento partido y dos tamaños casi iguales.**
   - Problema: el acento "día / 30" queda partido en dos líneas. "$0.22 al día" va a 13px y "Se cobra $79.99 al año" a 12px.
   - Fix: whitespace-nowrap en el span del acento (en MarkedCopy o con un no-break en el copy) y los dos textos a 13px.

### Otros (no top)
- Fichas no interactivas en relieve en §2, §3 y antes/después de §4. Se ven tocables: bajar el canto a 1px o dejar los íconos planos en esas tres zonas (el mismo criterio que ya se aplicó en la franja y los sellos).
- Los CTA de los planes dicen "Empezar mis 7 días gratis" y el resto dice "Armar mi primera pieza gratis". Las dos acciones van a /onboarding: alinear el verbo o confirmar que la diferencia es intencional.
- La landing dice "/mes" y el paywall "al mes". Unificar.
- Especificidad: falta una prueba real, como un testimonio o el recorrido de la fundadora con fecha (pendiente en ESTADO).

---

## Historial — revisión 2026-10-23 (NO LISTA 34·17·17, auditoría pre-venta con el logo de la dueña y FichaViva)

USABILIDAD 34/40: h1:4 h2:3 h3:4 h4:3 h5:4 h6:4 h7:3 h8:3 h9:3 h10:3
CRAFT 17/20: jerarquía:3 profundidad:4 identidad:3 movimiento:4 encaje:3
COPY 17/20: idea:3 especificidad:3 emoción:4 oferta:3 acción:4

Top defectos de entonces:
1. Integridad 61: 8 claims de IA y 4 promesas operativas sin implementar.
2. §6: oferta incoherente con el paywall ("MEJOR PRECIO / 4 meses gratis" contra "Mejor valor · ahorras $39.89"), mensual con 3 beneficios y stack de una línea.
3. Tres desencajes arrastrados: la franja del hero, la condición de §7 en 4 líneas y la captura de Hoy cortada.
4. Dos materiales de ficha y dos radios de chip de texto; fichas en relieve que parecen botones.
5. H1 de 12 palabras sin el mecanismo; título de §4 de 10 palabras.

Estado al 2026-11-06: el 4 y el 5 se cerraron. El 1, el 2 y el 3 se cerraron en parte (ver arriba).

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
