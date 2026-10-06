# VEREDICTO revisor-visual — onboarding
Fecha: 2026-10-06 19:45
Screenshot: docs/revisiones/onboarding-375.png
Usabilidad: 34/40
Craft: 17/20
Copy (si vende): 18/20
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos: (1) las etiquetas verdes de la ruta hablan en tercera persona ("Sabe qué vender", "Busca su idea", "Se queda en blanco"), cuando toda la app tutea, y ponen un check verde de logro sobre un dolor · (2) la sugerencia propia "Guía de comidas saludables…" genera "aprender comidas saludables paso a paso", que no es español natural, y el camino Excel repite "Excel" dos veces en la frase · (3) el acento dorado cubre 4-6 palabras con artículos y preposiciones ("en vez de quedarte en blanco", "la hoja en blanco") · (4) el mismo gesto, escribir una respuesta propia, se resuelve con dos componentes y dos textos distintos ("Otra cosa (escribe la tuya)" en fila con ícono y "Escribir la mía" como enlace subrayado) · (5) quedan 110-210px vacíos bajo la tarjeta en las preguntas de 3 opciones (01-punto, 05-ayuda, 07-momento) y no hay salida "Ya tengo cuenta" para quien ya pagó

---

## Re-revisión 4: qué se corrigió
| Hallazgo de la revisión 3 | Estado |
|---|---|
| 1. RutaMini estática, el rótulo no se cumple, hueco a media pantalla | CORREGIDO EN LO PRINCIPAL. Las etiquetas crecen con cada respuesta (`resumenRespuestas`), el rótulo es "Tu ruta hasta ahora" y la tarjeta va 24px bajo las opciones. Quedan abiertos: los nodos Hoy→30 son idénticos en 7 pantallas; todas las etiquetas vuelven a animarse en cada paso, así que la nueva no se distingue; las etiquetas están en tercera persona (defecto 1) |
| 2. Resultado genérico en Cursos · "sin …." | CORREGIDO para "curso/clases de X" ("aprender Excel paso a paso" con la mayúscula respetada). El punto solo aparece con el último hueco lleno (PasoEjercicio L124). Regresión nueva con "guía/e-book" (defecto 2) |
| 3. Error de "Usar esta" | CORREGIDO. Sacude el input con `border-warning`, muestra "Escribe al menos unas letras." justo debajo y usa `boton-oro`, igual que "Continuar" |
| 4. Dorado regado | CORREGIDO EN LO PRINCIPAL. Rótulos, bombillas, íconos de lista y "Escribir la mía" quedaron en ink-2/ink-3. Siguen en dorado: "DÍA 1 DE 30 · TU RUTA ESTÁ LISTA" (PasoEtiqueta L79), un rótulo en mayúsculas, y "Pieza 1 de 30" (Armando L190 / Pieza L94). Pasa como dato de misión, pero es el borde de la ficha |
| 5. "Escribir la mía" bajo la barra · texto de piezaBase | CORREGIDO. En las capturas "-final" se ve completo encima de la barra fija. piezaBase dice "la afinamos mañana en tu Día 2". `overflow-x-clip` está en el `<main>` (Onboarding.tsx L237) |

## Detalle de puntajes
USABILIDAD 34/40: h1:4 h2:3 h3:3 h4:3 h5:3 h6:4 h7:3 h8:3 h9:4 h10:4
CRAFT 17/20: jerarquía:3 profundidad:4 identidad:3 movimiento:4 encaje:3
COPY 18/20: idea:3 especificidad:3 emoción:4 oferta:4 acción:4
FIDELIDAD: N/A (la referencia de la ficha solo rige la composición de "Hoy", no el onboarding)
Falla el gate doble por usabilidad (34 < 36). Craft (17) y copy (18) pasan, sin ningún eje en 2 o menos.

- h1 = 4: barra con % real, check con resorte y avance a los 300ms, frase en vivo con aria-live, etiquetas que crecen, carga con anillo + 4 líneas con los datos del usuario + esqueleto, y "Guardada en Mi Empresa 1 de 30".
- h2 = 3: el copy usa la voz del avatar ("hoja en blanco", "7 de la noche", "directo al grano"). Fallan las etiquetas en tercera persona (`CORTO_PUNTO`/`CORTO_FRENO`, lib/onboarding.ts L343-350) y la frase "aprender comidas saludables".
- h3 = 3 (código): hay atrás en cada paso, cada hueco se puede tocar, "Editar" en la pieza, el estado se retoma desde localStorage, y "Reintentar" + "Volver a mi frase" ante fallos. No hay ninguna entrada "Ya tengo cuenta" en el recorrido (grep sin resultados en Onboarding.tsx), y el modo "Escribir la mía" no se puede cancelar.
- h4 = 3: "Usar esta" y "Continuar" ya son iguales. Ahora la misma acción (escribir la propia) es una fila con ícono en PasoPregunta L59-61 y un enlace subrayado con otro texto en PasoEjercicio L239-246. Las etiquetas rompen el tuteo de la ficha ("Idioma UI: tuteo").
- h5 = 3: el CTA valida al hacer clic y salta al hueco vacío; hay maxLength, `limpiarTexto` y doble toque bloqueado. `temaDeLaIdea` (L322) acepta "guía" y "e-book", y con una sugerencia de la propia app arma una frase rota.
- h7 = 3 (código): Enter confirma en los dos inputs, la sugerencia que sale de la idea va primera, hay avance automático y se retoma el estado. No hay nada para el experto más allá de eso.
- h8 = 3: hay una sola acción primaria por pantalla. El vacío al pie en las preguntas de 3 opciones y los títulos sobre-acentuados se notan con lupa.
- h9 = 4: los avisos en ámbar dicen qué hacer y aparecen junto al campo. "No pudimos terminar tu pieza" va con "Tus respuestas están guardadas…" + Reintentar, y hay pieza base al segundo fallo. Detalle: la rama "Sigue sin funcionar…" (Armando L118) nunca se muestra, porque `intento>0` va directo a piezaBase.
- Gate de carga cognitiva: 1 falla límite. Freno y área presentan 5 opciones, y el ejercicio 4 + "Escribir la mía". No es crítico.
- CTA héroe vivo: #FFC23D sobre #0F0D16, contraste aprox. 12:1 ✓ · whileTap 0.98 ✓ · ningún paso pasa `deshabilitado` ✓ · h-14 (56px) a ancho completo ✓.
- Ficha de arte: paleta, Bricolage/Instrument, título de 28px, píldoras, tarjetas de 18-22px y resorte 0.25 coinciden. El verde de la ficha significa "progreso HECHO", y el check verde sobre "Se queda en blanco" lo usa al revés.
- Anclas de conversión: hay hairline dorada degradada en la frase y en la pieza ✓, íconos SVG Phosphor/Lucide sin emojis ✓ y secciones distinguibles ✓. Los titulares con énfasis fallan en extensión (defecto 3).
- Movimiento (código): stagger de opciones (0.055s) ✓ · conteo de % en la carga ✓ · anillo y barra de progreso que se dibujan ✓ · tap 0.98 ✓ · transición entre pasos ✓ · celebración con check verde ✓ · pulso del nodo Hoy (repeat 2) ✓ · etiquetas con resorte ✓ · `useReducedMotion` + `.sacudir` desactivado en reduced-motion ✓.
- Copy: la frase final del camino por defecto es sólida y concreta. Message-match: no verificable (sin dato del 34). Garantía: N/A (aquí no hay CTA de compra).

## Top defectos (ubicación → fix)
1. **[Etiquetas de RutaMini: 02-freno, 04-área, 07-momento; 360: 05-ayuda, 08-momento]** "Sabe qué vender", "Busca su idea", "Se queda en blanco" y "Su propio freno" están en tercera persona dentro de una app que tutea, y el check verde de logro va sobre un dolor. → Reescribir `CORTO_PUNTO`/`CORTO_FRENO` en segunda persona o como dato neutro ("Ya sabes qué vender", "Freno: hoja en blanco") y no poner check verde en la etiqueta del freno.
2. **[Ejercicio, Paso 2 en Cursos · lib/onboarding.ts L322-336]** Con "Guía de comidas saludables para mamás ocupadas", que la app sugiere, sale "aprender comidas saludables paso a paso". Con Excel, la frase repite "Excel… aprender Excel". → Limitar `temaDeLaIdea` a curso/clases/taller/mentoría y, si el tema ya está en la idea, ofrecer "usarlo en su negocio paso a paso".
3. **[Títulos con acento: 09-etiqueta (360) "Elegiste en vez de quedarte en blanco", 03-reconocimiento "la hoja en blanco"]** El dorado cubre 4-6 palabras con artículos y preposiciones, contra la regla de 1-3 palabras clave. → Dejar el `acento` en 1-3 palabras de beneficio y sin artículos: "hoja en blanco" (sin "la") y, en la etiqueta, reformular a "Elegiste **avanzar**" o un equivalente.
4. **[Escribir una respuesta propia: PasoPregunta (fila "Otra cosa (escribe la tuya)") vs PasoEjercicio ("Escribir la mía", enlace)]** El mismo gesto usa dos componentes y dos textos. → Usar en el ejercicio la misma fila con ícono PencilSimpleLine y el mismo texto "Otra cosa (escribe la tuya)", con opción de cancelar.
5. **[Pie de 01-punto, 05-ayuda, 07-momento]** Quedan 110-210px vacíos bajo la tarjeta, y nadie que ya pagó tiene salida ("Ya tengo cuenta") desde el recorrido. → En 01-punto, agregar al pie un enlace secundario "¿Ya tienes cuenta? Entrar" (min-h-11, ink-2), que llena el vacío y da la salida que falta.
