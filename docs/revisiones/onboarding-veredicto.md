# VEREDICTO revisor-visual — onboarding
Fecha: 2026-10-06 21:30
Screenshot: docs/revisiones/onboarding-375.png
Usabilidad: 36/40
Craft: 17/20
Copy (si vende): 18/20
Fidelidad (si hubo referencia): N-A
Veredicto: LISTA
Top defectos: (1) la frase final del camino por defecto repite palabras de la idea: "Manejo de redes sociales: … conseguir clientes por redes" y, en el camino Excel, "Mini curso de Excel … sin cursos eternos", con un "usarlo" cuyo referente es ambiguo · (2) en 05-ayuda (360) la etiqueta "Freno: hoja en blanco" se vuelve a animar (sale capturada a media opacidad), porque `nueva = i === respuestas.length - 1` marca la última etiqueta aunque el paso no haya agregado ninguna · (3) quedan 115-205px vacíos al pie en 03-reconocimiento, 05-ayuda (360), 07-momento y 12-armando · (4) el modo "escribe la tuya" sigue en dos versiones: en la pregunta tiene label visible y no tiene Cancelar; en el ejercicio el label es solo para lector de pantalla, tiene Cancelar y muestra un segundo botón dorado ("Usar esta") junto a "Armar mi pieza". Además, en el ejercicio el texto de "Otra cosa" arranca unos 40px más a la derecha que el de las opciones de arriba · (5) el título "Elegiste avanzar" va seguido de un cuerpo que empieza con "Eso ya es avanzar", y la pieza a 360 corta "en su día a / día" entre líneas

---

## Re-revisión 5: qué se corrigió
| Hallazgo de la revisión 4 | Estado |
|---|---|
| 1. Etiquetas en tercera persona y check verde sobre el freno | CORREGIDO. Ahora dicen "Ya sabes qué vender", "Buscas tu idea" y "Tienes una idea" (`CORTO_PUNTO`, L343), y el freno sale como "Freno: hoja en blanco" en una píldora `bg-raised-2` sin check (piezas.tsx L328-332). Queda abierto: la animación de "solo la nueva" falla cuando el paso no agrega etiqueta (defecto 2) |
| 2. "aprender comidas saludables" · "Excel… aprender Excel" | CORREGIDO. `temaDeLaIdea` solo reconoce curso/cursos/clases/taller/mentoría (L322) y la opción dice "usarlo paso a paso en su día a día". Aparece un problema nuevo de menor peso: se repiten palabras de la idea en los huecos (defecto 1) |
| 3. Acento dorado de 4-6 palabras con artículos | CORREGIDO. En las capturas el acento cubre "hoja en blanco" (sin "la"), "avanzar", "directo al grano", "tu idea", "5 minutos" y "mejor" |
| 4. Dos componentes y dos textos para escribir la propia | CORREGIDO EN LO PRINCIPAL. Las dos pantallas usan la misma fila con PencilSimpleLine y el texto "Otra cosa (escribe la tuya)", y el ejercicio ya tiene Cancelar (PasoEjercicio L237-247). Lo que sigue sin igualarse es el modo de escritura (defecto 4) |
| 5. Vacío al pie · falta salida para quien ya pagó | PARCIAL. En 01-punto está "¿Ya pagaste? Recupera tu acceso" con min-h-11 (Onboarding L132-137). Es un `mailto:`, una solución provisional hasta la Sesión 5. El vacío al pie sigue en 03, 05-ayuda, 07 y 12 (defecto 3) |
| Rama muerta de error en Armando | CORREGIDO. El error ofrece siempre "Reintentar" y "Volver a mi frase" (PasoArmando L112-138), y al segundo fallo se usa piezaBase |

## Detalle de puntajes
USABILIDAD 36/40: h1:4 h2:4 h3:3 h4:3 h5:4 h6:4 h7:3 h8:3 h9:4 h10:4
CRAFT 17/20: jerarquía:3 profundidad:4 identidad:3 movimiento:4 encaje:3
COPY 18/20: idea:3 especificidad:3 emoción:4 oferta:4 acción:4
FIDELIDAD: N/A (la referencia de la ficha solo rige la composición de "Hoy", no el onboarding)
Pasa el gate doble justo en el umbral: 36 de 36 en usabilidad, 17 de 16 en craft y 18 de 16 en copy, sin ningún eje en 2 o menos. Cualquier regresión lo deja en NO LISTA.

- h1 = 4: barra con % real, auto-avance a los 300ms con la opción marcada, frase en vivo con aria-live, etiquetas que crecen, carga con anillo + 4 líneas con los datos del usuario + esqueleto de la pieza, y "Guardada en Mi Empresa 1 de 30 piezas".
- h2 = 4: tutea en todo el recorrido, no tiene inglés crudo y usa la voz del avatar ("hoja en blanco", "7 de la noche", "directo al grano"). "(tu propuesta de valor)" aparece ya explicado antes.
- h3 = 3 (código): hay atrás en cada paso, se puede tocar cualquier hueco, hay "Editar" en la pieza, se retoma desde localStorage, existen Reintentar y "Volver a mi frase", y el ejercicio tiene Cancelar. Baja porque la salida para quien ya pagó es un `mailto:` (no recupera nada por sí sola) y porque el modo "Otra cosa" de PasoPregunta no tiene Cancelar explícito (solo se sale tocando otra opción).
- h4 = 3: la fila de escribir la propia ya es idéntica. El modo de escritura difiere entre PasoPregunta (L97-123) y PasoEjercicio (L200-248), y la fila con ícono no se alinea con las opciones sin ícono del ejercicio.
- h5 = 4: el CTA valida al hacer clic y salta al hueco vacío, hay maxLength, `limpiarTexto`, doble toque bloqueado y la gramática de la frase está corregida en los dos caminos.
- h7 = 3 (código): Enter confirma, la sugerencia que sale de la idea va primera, hay auto-avance y se retoma el estado. No hay nada más para el experto.
- h8 = 3: hay una sola primaria por pantalla, salvo en el modo de escritura del ejercicio, que suma dos botones dorados. El vacío al pie se repite en 4 pantallas.
- h9 = 4 · h10 = 4: los avisos ámbar dicen qué hacer y aparecen junto al campo. Cada hueco trae su consejo, y están "Dónde la vas a usar" y el adelanto de "Mañana · Día 2".
- Gate de carga cognitiva: 1 falla límite. Freno, área y ejercicio presentan 5 opciones. No es crítico.
- CTA héroe vivo: #FFC23D sobre #0F0D16, contraste aprox. 12:1 ✓ · whileTap 0.98 ✓ · nunca deshabilitado ✓ · h-14 a ancho completo ✓.
- Ficha de arte: paleta, Bricolage/Instrument, píldoras, tarjetas de 18-22px y relieve coinciden. El verde ya solo marca logros. Los rótulos dorados "Día 1 de 30", "Misión 1 · Día 1" y "Pieza 1 de 30" se aceptan como misión de hoy. Test anti-clon: no coincide con Capítulo ni con Umbral.
- Anclas de conversión: hay hairline dorada degradada en la frase y en la pieza ✓, íconos SVG sin emojis ✓, titulares con énfasis de 1-3 palabras ✓ y secciones distinguibles ✓.
- Movimiento (código): stagger ✓ · conteo de % ✓ · anillo y barra ✓ · tap ✓ · transición entre pasos ✓ · celebración ✓ · pulso del nodo Hoy ✓ · `useReducedMotion` ✓.
- Copy: message-match no verificable (sin dato del 34). Garantía: N/A (aquí no hay CTA de compra).

## Top defectos (ubicación → fix)
1. **[Frase de 11-ejercicio-completo y 13-pieza (375) · 12/14 (360) · lib/onboarding.ts L239/L245, `opcionesHueco`]** Salen "redes sociales … por redes" y "Mini curso … sin cursos eternos", y el "usarlo" queda ambiguo. → En `opcionesHueco`, descartar las opciones base que repiten una palabra de contenido de la idea (redes, curso) y subir la siguiente.
2. **[RutaMini en 05-ayuda (360) · piezas.tsx L321]** "Freno: hoja en blanco" se vuelve a animar en un paso que no agregó ninguna etiqueta. → Pasar desde Onboarding la clave de la etiqueta agregada en el paso anterior y animar solo esa.
3. **[Pie de 03-reconocimiento, 05-ayuda (360), 07-momento, 12-armando]** Quedan 115-205px vacíos. → En PasoPregunta, dar `mt-auto` al `pie` con `flex-1` en el contenedor y, en Armando, usar `justify-center` vertical.
4. **[Modo "escribe la tuya": PasoPregunta L97-123 vs PasoEjercicio L200-248]** Hay dos versiones (label visible o sr-only, con o sin Cancelar), dos dorados en el ejercicio y la fila con ícono no se alinea con las opciones. → Extraer un `CampoPropio` común con label visible + Continuar + Cancelar, pasar "Armar mi pieza" a secundario mientras se escribe y alinear el texto de la fila con el de las opciones.
5. **[09-etiqueta (360) · 14-pieza-arriba (360)]** El cuerpo arranca con "Eso ya es avanzar" justo después de "Elegiste avanzar", y la pieza corta "día a / día". → Abrir el cuerpo con "Ya tienes área, idea y horario…" y aplicar `text-wrap: pretty` + espacios duros en "día a día".
