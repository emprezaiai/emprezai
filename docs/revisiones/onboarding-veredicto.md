# VEREDICTO revisor-visual — onboarding
Fecha: 2026-10-23 12:00
Screenshot: docs/revisiones/onboarding-375.png
Usabilidad: 34/40
Craft: 16/20
Copy (si vende): 18/20
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos: (1) PasoArmando con la IA real: el anillo llega a 100% y marca las 4 líneas como hechas a los 4,6 s, pero sigue esperando a la IA hasta 20 s (lib/onboarding.ts L401). El anillo queda congelado, no hay mensaje ni salida, y eso rompe 50 §B2 ("nunca congelar el anillo", "ni más de 8s") · (2) la frase del camino por defecto sigue repitiendo palabras: "Manejo de redes sociales: … conseguir clientes por redes" (11-ejercicio-completo y 13-pieza) · (3) el modo "escribe la tuya" sigue en dos versiones: en PasoEjercicio el label es sr-only (L202) y hay un segundo dorado "Usar esta" (L233); PasoPregunta no tiene Cancelar · (4) siguen los vacíos al pie (01-punto unos 250px bajo "¿Ya pagaste?", 12-armando unos 300px) y "LLEVAS" queda huérfana en PromesaRecorrido (piezas.tsx L257) · (5) en el hueco vacío de 09-ejercicio-1 la raya punteada cae a su propio renglón y "a … sin …" queda flotando más arriba, a la derecha. Además, RutaMini L321 sigue animando la última etiqueta aunque el paso no haya agregado ninguna

---

## Revisión de auditoría 2026-10-23

### Qué cambió y qué rompió
| Cambio | Estado |
|---|---|
| Logo de la dueña (Marca) en la cabecera de Armando y Pieza | CORRECTO. Está centrado en h-14 y usa "EMPREZ" + "AI" turquesa, como en FICHA-ARTE §MARCA. Solo aparece en armando/pieza; en las preguntas la cabecera sigue siendo atrás + barra. Lo acepto: así la barra de avance no compite con el logo |
| Pieza 1: primero la IA (/api/ia/primera-pieza, corte a 20 s) y, si falla, la versión armada con las respuestas | El respaldo funciona: con 503 la pieza sale bien (13-pieza). **Hay una REGRESIÓN en el camino feliz con la IA conectada.** PasoArmando corre su animación fija de 4,6 s (DURACION, L13). A los 4,6 s pone `setLineaActiva(4)` (L64) y el anillo llega a 1. Pero `Promise.all([armarPrimeraPieza, espera])` (L66) sigue esperando la respuesta, que puede tardar hasta 20 s. Mientras tanto la persona ve un "100%" con todo en check, sin nada que se mueva, sin mensaje y sin salida: la cabecera ya no tiene atrás. Ninguna captura lo muestra porque la IA respondió 503 enseguida. Esto va contra 50 §B2: "Si el backend REAL tarda >6s: mantener la última línea activa con mensajes que rotan cada 2s — nunca congelar el anillo" y "ni más de 8s JAMÁS" |
| Ruta del servidor | Valida los datos con zod, limita por IP (3/h, 6/día), responde 503 si falta configuración y la clave queda en el servidor. Sin observaciones de UI |
| Defectos 1-5 de la revisión del 2026-10-07 | SIGUEN TODOS ABIERTOS, sin cambios de código (lib/onboarding.ts L241/L332-342 · piezas.tsx L257/L321 · PasoEjercicio L202/L233) |

### Estrategia (02B / 50)
- Modelo onboarding-first anónimo: valor antes del registro ("Gratis, sin crear cuenta") → reconocimiento del dolor → micro-compromisos → etiqueta de identidad ("directo al grano") → ejercicio real → armando → recompensa (pieza 1 guardada) → Día 2 bloqueado como tensión honesta → planes. Está alineado con 02B para B2C de personalización: unas 9 pantallas y el diagnóstico forma parte del producto.
- El progreso dotado (arranca en 8%) y la barra real están bien. La pausa de 400 ms al cierre y el error con Reintentar → pieza base marcada como "versión base" cumplen 50 §B. Lo que falla es solo la latencia real de la IA (defecto 1).
- Hay una inconsistencia menor de promesa: la metadata de app/onboarding/page.tsx dice "Responde 5 preguntas… en 2 minutos" y la pantalla dice "Toma unos 5 minutos". Hay que unificarlas.

### Detalle de puntajes
USABILIDAD 34/40: h1:2 h2:4 h3:3 h4:3 h5:4 h6:4 h7:3 h8:3 h9:4 h10:4
CRAFT 16/20: jerarquía:3 profundidad:4 identidad:3 movimiento:3 encaje:3
COPY 18/20: idea:3 especificidad:3 emoción:4 oferta:4 acción:4
FIDELIDAD: N/A

- h1 = 2 (verificado en el código): justo la espera más importante del embudo, la que le antecede al aha, puede quedar congelada en "100%" hasta unos 15 s. Es exactamente el "¿se colgó?" que la pista prohíbe, y un usuario lo nota sin buscarlo. El resto del feedback del recorrido es ejemplar, pero eso no compensa este punto.
- h3 = 3: durante esa espera no hay cancelar ni volver (la escala de latencia pide progreso + cancelar a partir de 3 s). Además "Otra cosa" en PasoPregunta sigue sin Cancelar. Lo dejo en 3 para no contar dos veces el defecto 1.
- h4 = 3 y h8 = 3: los dos modos de escritura siguen distintos, hay un segundo dorado en el ejercicio y sigue el aire muerto en 01 y 12.
- Movimiento = 3 (antes 4): las baseline siguen (stagger, conteo del %, anillo y barra que se dibujan, whileTap 0.98, slide entre pasos, celebración con resorte y chispas, reduced-motion en todos los componentes), pero el anillo congelado incumple una regla dura de motion de 50 §B2.
- Identidad = 3: el rayo, los nodos en relieve y ahora el logo están bien. El guepardo, que según la ficha aparece "cuando la persona GANA", no está en la pieza 1, que es la primera victoria de todo el embudo.
- Encaje = 3: la huérfana "LLEVAS", la raya del hueco desalineada en 09 y los vacíos al pie.
- CTA héroe vivo: dorado sobre casi-negro, con contraste aprox. 12:1 ✓ · whileTap 0.98 ✓ · nunca deshabilitado: "Esta es mi idea" y "Armar mi pieza" validan al click con hint ✓ · h-14 a ancho completo y sticky ✓.
- Ficha de arte: en las capturas se ven #0F0D16, el dorado #FFC23D, el verde de lo hecho, Bricolage + Instrument, las píldoras y tarjetas de 18-22px y el relieve. Coinciden. Anti-clon: no coincide con ningún ejemplo.
- Gate de carga cognitiva: 1 falla límite (5 opciones en freno, área y ejercicio). No es crítico.
- Copy: cada pieza se puede trazar a FICHA-AVATAR: "hoja en blanco" + "7 de la noche" (MOMENTO DEL DÍA / ancla emocional), "directo al grano" (frase obligatoria), "5 minutos" (frase obligatoria), los frenos = dolores 1-2 y la objeción 7 ("sin experiencia") se responde con "cuéntame tu idea en una línea". Le quita puntos la frase con palabras repetidas (especificidad).

### Top defectos (ubicación → fix)
1. **[PasoArmando L13/L52-66 + lib/onboarding.ts L401]** Con la IA real, el anillo y las líneas terminan a los 4,6 s y la pantalla queda congelada hasta 20 s, sin salida. → Bajar el corte a 8 s. Mientras la promesa siga abierta, dejar el anillo en meseta en un 90% y la línea 3 activa con mensajes que rotan cada 2 s. Recién con la respuesta, completar al 100% + 400 ms. A partir de 6 s, mostrar "Volver a mi frase".
2. **[Frase en 11-ejercicio-completo y 13-pieza · lib/onboarding.ts L241/opcionesHueco L332]** Sale "redes sociales … por redes" (y en el camino Excel, "curso … sin cursos eternos"). → En `opcionesHueco`, descartar las opciones que repiten una palabra de contenido de la idea y subir la siguiente.
3. **[Modo "escribe la tuya": PasoPregunta vs PasoEjercicio L202-247]** Uno tiene label visible y el otro sr-only, uno tiene Cancelar y el otro no, y el ejercicio muestra dos dorados. → Extraer un `CampoPropio` común (label visible + Continuar + Cancelar) y pasar "Armar mi pieza" a secundario mientras se escribe.
4. **[Pie de 01-punto y 12-armando · rótulo de PromesaRecorrido, piezas.tsx L257]** Entre 250 y 300px vacíos, y "LLEVAS" sola en la segunda línea. → `justify-center` vertical en Armando y en el contenido de la 1ª pregunta, y acortar el rótulo a "5 minutos · te llevas" o usar `text-wrap: balance`.
5. **[Tarjeta "Tu frase" en 09/10-ejercicio · PasoEjercicio L117-122]** La raya punteada del hueco vacío cae a su propio renglón y el texto siguiente flota por encima de ella. → Dar al `hueco-vacio` un ancho mínimo inline (`inline-block min-w-[6ch]` con borde inferior alineado a la línea base) en lugar de un NBSP con el subrayado separado. De paso, en RutaMini L321 animar solo la etiqueta agregada en el paso actual.

---

## Historial — Re-revisión 6 (2026-10-07): LISTA 36·17·18
| Cambio | Estado |
|---|---|
| "¿Ya pagaste?" pasó de mailto a /login ("Entra aquí") | CORRECTO. Se mantienen el mismo lugar, el mismo estilo y el mismo min-h-11 (Onboarding L132-137). /login existe |
| RutaMini con la prop `destacada` | SIN REGRESIÓN |
| PromesaRecorrido | Se renderiza bien; tiene el defecto menor de la palabra huérfana |
| FichaIcono | SIN REGRESIÓN |

Detalle de entonces: USABILIDAD h1:4 h2:4 h3:3 h4:3 h5:4 h6:4 h7:3 h8:3 h9:4 h10:4 · CRAFT jerarquía:3 profundidad:4 identidad:3 movimiento:4 encaje:3 · COPY idea:3 especificidad:3 emoción:4 oferta:4 acción:4.
