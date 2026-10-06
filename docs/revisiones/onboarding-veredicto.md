# VEREDICTO revisor-visual — onboarding
Fecha: 2026-10-06 16:00
Screenshot: docs/revisiones/onboarding-375.png
Usabilidad: 30/40
Craft: 16/20
Copy (si vende): 17/20
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos: (1) la frase de la Pieza 1 une la idea y el cliente sin cuadrarlos: se contradice o se repite, y le falta el artículo ("Con mini curso…") · (2) vacío muerto en momento, etiqueta, armando y en las preguntas de avance automático · (3) la duración se contradice: "Toma 2 minutos" contra "Misión 1 · 5 min" dentro del mismo recorrido · (4) "Continuar" (Otra cosa) y "Usar esta" arrancan desactivados · (5) "Copiar frase" y "Editar" con radio 12px, distinto de la píldora de la ficha; la línea "En este celular…" queda cortada bajo la barra inferior

---

## Re-revisión: qué se corrigió
| Hallazgo anterior | Estado |
|---|---|
| A1 Etiqueta fija y falsa | CORREGIDO. Cambia según el punto de partida y la ayuda (360: "Elegiste en vez de quedarte en blanco"; 375: "vas directo al grano") |
| A2 La pieza no usa la idea | PARCIAL. La idea ahora abre la frase, pero las opciones de cliente y resultado siguen saliendo solo del área. Resultado: "…Excel para dueños de negocio, ayudo a principiantes sin experiencia a dominar una habilidad…" (se contradice) y "…para negocios locales, ayudo a dueños de pequeños negocios a conseguir clientes por redes" (se repite) |
| A3 La frase se descuadra / doble raya | CORREGIDO. Los huecos llenos fluyen en línea (`.hueco-lleno` inline + clone) y el hueco vacío muestra una sola raya punteada. Queda un detalle menor: "sin …." se ve con 4 puntos |
| M1 Duración contradictoria | PARCIAL. "Al terminar te llevas: 2 minutos" pasó a "Toma 2 minutos", pero la misión que va DENTRO del recorrido dice 5 min |
| M2 CTA principal muerto | CORREGIDO en "Esta es mi idea" y "Armar mi pieza" (llevan al hueco, lo sacuden y muestran la pista en ámbar). Se volvió a colar en "Continuar" (Otra cosa) y en "Usar esta" |
| M3 Radios mezclados | CORREGIDO en las filas elegibles (todas en píldora). Quedan los botones de la pieza en 12px |
| M4 Vacío muerto | PARCIAL. El reconocimiento ahora se llena con la ruta de nodos. Siguen vacíos la etiqueta, la carga y las preguntas |
| M5 Texto cortado por la barra fija | PERSISTE en onboarding-375.png |
| M6 Truncado en la carga | CORREGIDO (corta por palabra a 60 caracteres) |
| M7 Falta "Otra cosa" | CORREGIDO (en freno y en área) |
| m1 "te llevas: 2 minutos" | CORREGIDO |
| m2 "Propuesta de valor" como título | CORREGIDO (título "Arma tu frase de negocio" y el término queda como aclaración) |
| m3 Dos titulares compiten en la etiqueta | CORREGIDO (el primero bajó a label) |
| m4 Resorte fuera de la ficha | CORREGIDO (bounce 0.25 en todos) |
| m5 Respaldo y háptica | PARCIAL. La háptica en el reconocimiento ya está y el segundo fallo ofrece "Volver a mi frase". Sigue sin haber una pieza de respaldo genérica |
| m6 Fichas en relieve piedra | CORREGIDO (fondo dorado al 12%) |

## Detalle de puntajes
USABILIDAD 30/40: h1:3 h2:3 h3:3 h4:3 h5:2 h6:4 h7:3 h8:2 h9:3 h10:4
CRAFT 16/20: jerarquía:3 profundidad:3 identidad:3 movimiento:4 encaje:3
COPY 17/20: idea:3 especificidad:3 emoción:4 oferta:3 acción:4
FIDELIDAD: N/A
Falla el gate doble por usabilidad (30 < 36). Craft (16) y copy (17, ningún eje en 2 o menos) pasan.

- h5 = 2: con las opciones por defecto (1ª sugerencia + 1er cliente), el sistema arma una frase que se contradice. El error no se evita de raíz.
- h8 = 2: vacío muerto visible en 5 pantallas.
- Gate de carga cognitiva: 0 fallas.
- CTA héroe vivo: contraste dorado sobre #0F0D16 de aprox. 12:1 ✓ · whileTap 0.98 ✓ · 56px a ancho completo ✓ · nunca desactivado por defecto ✓ (BotonPrincipal `deshabilitado=false`, no se usa en el recorrido).
- Ficha de arte: paleta, par Bricolage/Instrument, filas y CTA en píldora, y resorte 0.25 coinciden. El único desvío son los botones Copiar/Editar en 12px.
- Copy: el reconocimiento usa la escena literal de la ficha (7 PM, 15 min en blanco, ChatGPT). Usa "directo al grano" y "5 minutos al día" del léxico. Message-match: no verificable (sin dato del 34). Garantía nombrada: N/A (aquí no hay CTA de compra).
- Código h3/h7: hay atrás en cada paso, cada hueco se puede tocar, "Editar" vuelve al ejercicio, el estado se guarda en localStorage y se retoma, Enter confirma y hay bloqueo de doble toque.
- Movimiento: stagger ✓ · conteo (% del anillo, "1 de 30") ✓ · anillo y barra que se dibujan ✓ · tap ✓ · transición con dirección ✓ · celebración (insignia + chispas + la pieza que vuela) ✓ · sacudida con reduced-motion ✓ · `useReducedMotion` en todos ✓.

## Top defectos (ubicación → fix)
1. **[Ejercicio "Tu frase" + Pieza 1]** `lib/onboarding.ts` L236-252 y L298-304: la idea y el cliente no se cuadran, y "Con mini curso…" no lleva artículo. → Extraer el "para X" de la idea como 1ª opción de "¿A quién ayudas?" (y quitarlo del tramo "Con…"), anteponer "mi" ("Con mi mini curso de Excel") y meter el tema en el resultado ("dominar Excel en 7 días").
2. **[Vacío muerto]** 07-momento (~45% inferior vacío), 02/04, 08-etiqueta (~190px sobre el CTA), 12-armando (~300px bajo la lista). → Anclar con `mt-auto` la ruta de nodos Hoy→30 (dispositivo de la marca) o el resumen de respuestas al pie de las preguntas; en la carga, mostrar una vista previa borrosa de la pieza; en la etiqueta, subir el CTA.
3. **[Duración]** `piezas.tsx` L257 dice "Toma 2 minutos" y `PasoEjercicio.tsx` L81 / `PasoEtiqueta.tsx` L86 dicen "Misión 1 · 5 min" / "en 5 minutos". → Un solo número: "Toma unos 5 minutos" en la promesa, o rotular la misión del recorrido como express.
4. **[Otra cosa → Continuar / Usar esta]** `PasoPregunta.tsx` L109 y `PasoEjercicio.tsx` L219 arrancan desactivados (el dorado al 65%). → Dejarlos activos; si hay menos de 3 letras, sacudir el campo y mostrar la pista en ámbar, igual que en PasoIdea.
5. **[Pieza: botones y barra]** "Copiar frase"/"Editar" usan `--radius-chip` 12px, pero la ficha pide píldora en botones y filas. Además, la línea "En este celular por ahora…" queda partida bajo `.barra-inferior` (degradé opaco a 16px). → Pasarlos a `--radius-pill` y agregar `pb` al contenido para que la última línea no quede cortada a media altura.
