# VEREDICTO revisor-visual — onboarding
Fecha: 2026-11-06 12:00
Screenshot: docs/revisiones/onboarding-375.png
Usabilidad: 36/40
Craft: 18/20
Copy (si vende): 18/20
Fidelidad (si hubo referencia): N-A
Veredicto: LISTA
Top defectos: (1) La frase pierde coherencia en el camino por defecto. El filtro de palabras repetidas descarta "conseguir clientes por redes", así que para "Manejo de redes sociales" la primera opción de logro queda en "ordenar sus ventas y cobros". Además, el encargo de la IA ("mejóralas") deja que la pieza cambie el resultado elegido: en 14-pieza dice "consigan clientes cada semana" aunque la persona eligió "ordenar sus ventas y cobros" (lib/onboarding.ts L241/L351-361 · lib/servidor/ia-encargos.ts L36-38) · (2) Queda aire en medio de 3 pantallas, entre el contenido y el pie o el botón principal: unos 130-160 pt en 01-punto, 03-reconocimiento y 07-momento (PasoPregunta L100 mt-auto · PasoReconocimiento) · (3) Las opciones del ejercicio no comparten borde izquierdo: 4 píldoras sin ícono y "Otra cosa" con ficha redonda, y el texto empieza unos 40 pt más a la derecha (PasoEjercicio L194 vs L218) · (4) "Tu prueba de hoy" ocupa 5 líneas en la pieza y supera el límite de 3-4 por bloque (ia-encargos L39, máx. 220 caracteres) · (5) RutaMini cambia un Set a nivel de módulo durante el render (piezas.tsx L351/L401-402): es render impuro, en StrictMode no anima y la etiqueta no vuelve a animar si la persona vuelve atrás y cambia la respuesta

---

## Re-revisión 2026-11-06 (tras las correcciones)

### Estado de los TOP DEFECTOS del veredicto 2026-10-23
| # | Defecto anterior | Estado | Evidencia |
|---|---|---|---|
| 1 | Anillo congelado en 100% hasta 20 s mientras espera a la IA | **CERRADO** | PasoArmando L68-85: fase 1 hasta el 90% y luego fase 2 hacia el 97% en 8 s, con la línea 3 viva y mensajes que rotan cada 2 s. Lo verifiqué en 13-armando-espera (7,1 s): 93%, "Eligiendo las palabras exactas", "La IA está terminando tu frase. Unos segundos más." + "Volver a mi frase" (aparece a los 6 s, min-h-11). El corte es a los 8 s (lib/onboarding.ts L418) y el cierre llega a 100% + 400 ms solo cuando hay respuesta. Cumple 50 §B2 |
| 2 | Frase con palabras repetidas ("redes … por redes") | **CERRADO con efecto secundario** | `raices`/`repitePalabra` (L332-344) eliminan la repetición, y 11-ejercicio-completo ya no repite palabras. Pero al descartar la opción se pierde la más coherente con la idea, y la opción por defecto queda incongruente → nuevo defecto 1 |
| 3 | "Escribe la tuya" en dos versiones + doble dorado | **CERRADO** | Hay un único `CampoPropio` (piezas.tsx L246-317) con label visible, Continuar y Cancelar, y lo usan PasoPregunta L83 y PasoEjercicio L201. `BotonPrincipal secundario={escribiendo}` (L231) deja un solo dorado |
| 4 | Vacío al pie de 01/12 y "LLEVAS" huérfana | **PARCIAL** | "En 5 minutos te llevas" entra en 1 línea (text-balance) ✓. 12-armando queda centrado (justify-center) ✓. En 01, 03 y 07 el vacío no desapareció: el pie anclado con mt-auto lo pasó a la mitad de la pantalla → defecto 2 |
| 5 | Raya del hueco vacío desalineada + RutaMini que anima sin agregar etiqueta | **CERRADO / regresión menor en el código** | `.hueco-vacio` es inline con borde inferior y `box-decoration-break` (globals.css L269-275). En 09 la raya queda en la línea base y "a … sin …" sigue en el mismo renglón ✓. RutaMini ya solo anima la etiqueta nueva, pero lo hace mutando un Set global durante el render → defecto 5 |
| — | Metadata "2 minutos" vs "5 minutos" | **CERRADO** | app/onboarding/page.tsx L7: "en unos 5 minutos" |
| — | El guepardo no aparece en la primera victoria | **CERRADO** | PasoPieza L74-81: el personaje entra con rebote, check verde y chispas (14-pieza-arriba) |

### Detalle de puntajes
USABILIDAD 36/40: h1:4 h2:4 h3:3 h4:3 h5:4 h6:4 h7:3 h8:3 h9:4 h10:4
CRAFT 18/20: jerarquía:3 profundidad:4 identidad:4 movimiento:4 encaje:3
COPY 18/20: idea:3 especificidad:3 emoción:4 oferta:4 acción:4
FIDELIDAD: N/A

- h1 = 4: todo el feedback del recorrido está resuelto. Elegir una opción avanza a los 300 ms con check, la frase se arma en vivo, el anillo tiene mesetas y nunca se congela, la espera larga tiene mensaje + salida, "Copiar" responde con estado y el error dice qué pasó y deja Reintentar.
- h3 = 3: hay atrás en cada pregunta, Cancelar en los dos campos propios, "Volver a mi frase" durante la espera y "Editar" en la pieza. Pero "Editar" lleva a los huecos y no a la frase que escribió la IA: si la IA cambió el resultado elegido (defecto 1), la persona no puede corregir el texto final sin volver a generarlo, y eso gasta 1 de las 3 llamadas por hora.
- h4 = 3: el campo propio ya es uno solo. Queda la lista mixta del ejercicio (píldoras sin ícono + una con ficha).
- h7 = 3: hay defaults inteligentes (el cliente que sale de la idea va primero, sugerencias por área), Enter confirma y el avance es automático. No hay más atajos.
- h8 = 3: hay una sola acción primaria por pantalla, pero se nota el aire en medio de 01, 03 y 07.
- Gate de carga cognitiva: 1 falla (bloque de 5 líneas en "Tu prueba de hoy"). En freno, área y paso 1 del ejercicio hay 5 opciones, que es el límite. No es sobrecarga crítica.
- CTA héroe vivo (4/4): dorado #FFC23D sobre casi-negro, con un contraste aprox. 12:1 · whileTap 0.98 · nunca deshabilitado: valida al click con sacudida y nota en ámbar · h-14 a ancho completo y sticky con safe-area.
- Anclas de conversión: los títulos llevan 1-3 palabras clave en dorado ("tu idea", "te frena", "hoja en blanco", "directo al grano", "frase de negocio", "pieza 1") ✓ · hairline-oro en la tarjeta de la frase, la pieza y el esqueleto ✓ · íconos Phosphor/Lucide en fichas, cero emojis ✓ · las capas se distinguen (base con degradé, tarjetas en relieve, input hundido) ✓.
- FICHA-ARTE: en las capturas se ven el fondo #0F0D16, el dorado #FFC23D, el verde #3DDC97 para lo hecho, Bricolage en los títulos e Instrument en el cuerpo, píldoras y tarjetas de 18-22 px, el logo EMPREZ + AI turquesa y el guepardo en la victoria. Coinciden. Anti-clon: no coincide con ninguno de los ejemplos vetados.
- Movimiento = 4 (verificado en el código, una por una): stagger en opciones y tarjetas · conteo del % y de "1 de 30 piezas" · el anillo se dibuja y la barra de piezas crece · whileTap y active:scale · slide direccional entre pasos · AnimatePresence en campos y mensajes · celebración con resorte, chispas y la pieza que "vuela" · `useReducedMotion` en todos los componentes.
- Copy: todo se traza a FICHA-AVATAR. "15 min en blanco", "7 de la noche" y "hoja en blanco" salen de MOMENTO DEL DÍA / ancla emocional; "directo al grano" y "5 minutos" son frases obligatorias; los frenos corresponden a los dolores; "Gratis, sin crear cuenta" responde a la objeción de precio. Especificidad = 3 por la incoherencia del logro por defecto y porque la pieza cambia la elección de la persona.

### Top defectos (ubicación → fix)
1. **[Ejercicio paso 2 (10-ejercicio-2) y pieza (14-pieza) · lib/onboarding.ts L241/L351-361 · lib/servidor/ia-encargos.ts L36-38]** En el camino por defecto la frase queda incoherente: "redes sociales … ordenar sus ventas y cobros". Además, la IA reemplaza el resultado que eligió la persona. → En vez de descartar la opción que repite palabras, reescribirla (una variante sin la palabra repetida, p. ej. "conseguir clientes cada semana") y ordenar por afinidad con la idea. En el encargo, cambiar "mejóralas" por "conserva el sentido exacto de cliente, resultado y dolor elegidos; solo pule la redacción".
2. **[Mitad de 01-punto, 03-reconocimiento y 07-momento · PasoPregunta L100 / PasoReconocimiento]** Quedan 130-160 pt vacíos entre las opciones y el pie o el botón principal. → Agrupar contenido + pie en un bloque con `flex-1 justify-center gap-8` y quitar el `mt-auto` del pie, o pegar la tarjeta de la ruta a `mt-8` del contenido.
3. **[Lista de opciones del ejercicio (09/10) · PasoEjercicio L194 vs L218]** El texto de "Otra cosa" arranca unos 40 pt más a la derecha que el de las otras 4 píldoras. → Quitarle la ficha redonda a "Otra cosa" y poner el lápiz como ícono de 18 px al final, o dar a todas la misma ficha.
4. **[Tarjeta de la pieza, "Tu prueba de hoy" (14-pieza) · ia-encargos L39 + validar texto(230)]** Son 5 líneas de cuerpo dentro de la tarjeta de la victoria. → Bajar el máximo de "prueba" a 140 caracteres (texto(150)) y pedir 1 sola acción sin "Luego…".
5. **[RutaMini · piezas.tsx L351/L401-402]** `etiquetasVistas` es un Set global que se modifica durante el render. Es impuro: con StrictMode o con un re-render concurrente las etiquetas nuevas no animan. → Calcular `nueva` comparando contra las respuestas del paso anterior (prop `previas`) o registrar las vistas en un `useEffect`.

---

## Historial — Revisión de auditoría 2026-10-23: NO LISTA 34·16·18
Top defectos de entonces: (1) PasoArmando con la IA real: el anillo llegaba a 100% y marcaba las 4 líneas como hechas a los 4,6 s, pero seguía esperando a la IA hasta 20 s (lib/onboarding.ts L401). El anillo quedaba congelado, sin mensaje ni salida, y eso rompía 50 §B2 · (2) la frase del camino por defecto repetía palabras: "Manejo de redes sociales: … conseguir clientes por redes" · (3) el modo "escribe la tuya" estaba en dos versiones (label sr-only y un segundo dorado "Usar esta" en PasoEjercicio), y PasoPregunta no tenía Cancelar · (4) vacíos al pie (01-punto unos 250 px, 12-armando unos 300 px) y "LLEVAS" huérfana en PromesaRecorrido · (5) en el hueco vacío de 09 la raya punteada caía a su propio renglón y el texto flotaba por encima de ella. Además, RutaMini L321 animaba la última etiqueta aunque el paso no hubiera agregado ninguna.

| Cambio (2026-10-23) | Estado |
|---|---|
| Logo de la dueña (Marca) en la cabecera de Armando y Pieza | CORRECTO |
| Pieza 1: primero la IA (/api/ia/primera-pieza, corte a 20 s) y, si falla, la versión armada con las respuestas | El respaldo funcionaba; había una REGRESIÓN en el camino feliz: el anillo se congelaba en 100% |
| Ruta del servidor | Valida con zod, limita por IP (3/h, 6/día), responde 503 sin configuración y la clave queda en el servidor |
| Defectos 1-5 de la revisión del 2026-10-07 | Seguían todos abiertos |

Detalle de entonces: USABILIDAD h1:2 h2:4 h3:3 h4:3 h5:4 h6:4 h7:3 h8:3 h9:4 h10:4 · CRAFT jerarquía:3 profundidad:4 identidad:3 movimiento:3 encaje:3 · COPY idea:3 especificidad:3 emoción:4 oferta:4 acción:4.

## Historial — Re-revisión 6 (2026-10-07): LISTA 36·17·18
| Cambio | Estado |
|---|---|
| "¿Ya pagaste?" pasó de mailto a /login ("Entra aquí") | CORRECTO. Se mantienen el mismo lugar, el mismo estilo y el mismo min-h-11 (Onboarding L132-137). /login existe |
| RutaMini con la prop `destacada` | SIN REGRESIÓN |
| PromesaRecorrido | Se renderizaba bien; tenía el defecto menor de la palabra huérfana |
| FichaIcono | SIN REGRESIÓN |

Detalle de entonces: USABILIDAD h1:4 h2:4 h3:3 h4:3 h5:4 h6:4 h7:3 h8:3 h9:4 h10:4 · CRAFT jerarquía:3 profundidad:4 identidad:3 movimiento:4 encaje:3 · COPY idea:3 especificidad:3 emoción:4 oferta:4 acción:4.
