# VEREDICTO revisor-visual — onboarding
Fecha: 2026-10-07 10:00
Screenshot: docs/revisiones/onboarding-375.png
Usabilidad: 36/40
Craft: 17/20
Copy (si vende): 18/20
Fidelidad (si hubo referencia): N-A
Veredicto: LISTA
Top defectos: (1) la frase del camino por defecto sigue repitiendo palabras de la idea: "Manejo de redes sociales: … conseguir clientes por redes" (11-ejercicio-completo, 13-pieza y onboarding-375), y en el camino Excel "… sin cursos eternos" · (2) RutaMini (piezas.tsx L321) sigue animando la última etiqueta aunque el paso no haya agregado ninguna · (3) siguen vacíos al pie: unos 240px en 03-reconocimiento, 300px en 12-armando y 250px en 01-punto bajo "¿Ya pagaste? Entra aquí" · (4) el modo "escribe la tuya" sigue en dos versiones: PasoPregunta tiene label visible y no tiene Cancelar; PasoEjercicio tiene label sr-only (L202), Cancelar y un segundo dorado "Usar esta" (L235) · (5) en 01-punto, el rótulo de PromesaRecorrido "TOMA UNOS 5 MINUTOS · AL TERMINAR TE LLEVAS" deja "LLEVAS" sola en la segunda línea

---

## Re-revisión 6: qué cambió y si rompió algo
| Cambio | Estado |
|---|---|
| "¿Ya pagaste?" pasó de mailto a /login ("Entra aquí") | CORRECTO. Se mantienen el mismo lugar, el mismo estilo y el mismo min-h-11 (Onboarding L132-137). /login existe (app/login/page.tsx → Acceso), habla del "correo con el que pagaste en Hotmart" y conserva "Ya pagué: pedir mi acceso" como respaldo. Con esto desaparece uno de los dos motivos que bajaban h3 |
| RutaMini con la prop `destacada` | SIN REGRESIÓN. El valor por defecto es `false`, así que las 4 llamadas del recorrido (Onboarding L150/163/172/193, PasoReconocimiento L78, PasoEtiqueta L104) siguen con `tarjeta-relieve-base`. Solo Acceso usa `destacada` |
| PromesaRecorrido | Se renderiza bien en 01-punto (relieve, CheckCustom, entrada con retardo y reduced-motion). Aparece un defecto menor nuevo: la palabra huérfana del rótulo (defecto 5) |
| FichaIcono | SIN REGRESIÓN. Las opciones (02, 04, 07) y la fila "Otra cosa" del ejercicio (10) se ven igual que antes |
| Defectos 1-4 de la revisión 5 | SIGUEN ABIERTOS, sin cambios de código (lib/onboarding.ts L239/L245 · piezas.tsx L321 · PasoEjercicio L202/L235/L246) |

## Detalle de puntajes
USABILIDAD 36/40: h1:4 h2:4 h3:3 h4:3 h5:4 h6:4 h7:3 h8:3 h9:4 h10:4
CRAFT 17/20: jerarquía:3 profundidad:4 identidad:3 movimiento:4 encaje:3
COPY 18/20: idea:3 especificidad:3 emoción:4 oferta:4 acción:4
FIDELIDAD: N/A
Sigue en el umbral exacto de usabilidad (36/36). El cambio no restó puntos, pero tampoco hay margen: cualquier regresión lo deja en NO LISTA.

- h3 = 3 (código): la salida para quien ya pagó ahora lleva a una pantalla real. Sigue en 3 porque el modo "Otra cosa" de PasoPregunta no tiene Cancelar explícito.
- h4 = 3 y h8 = 3: el modo de escritura sigue en dos versiones, en el ejercicio hay dos botones dorados y el vacío al pie se ve en 01, 03 y 12.
- Encaje = 3: hay una huérfana en el rótulo de PromesaRecorrido y vacíos al pie. Ningún desencaje es grave.
- CTA héroe vivo: dorado sobre casi-negro, con contraste aprox. 12:1 ✓ · whileTap 0.98 ✓ · nunca deshabilitado ✓ · h-14 a ancho completo ✓.
- Ficha de arte: la paleta, Bricolage/Instrument, las píldoras y el relieve no cambiaron. Anti-clon: no coincide.
- Gate de carga cognitiva: 1 falla límite (5 opciones en freno, área y ejercicio). No es crítico.

## Top defectos (ubicación → fix)
1. **[Frase en 11-ejercicio-completo y 13-pieza · lib/onboarding.ts L239/L245]** Sale "redes sociales … por redes" y, en el camino Excel, "curso … sin cursos eternos". → En `opcionesHueco`, descartar las opciones que repiten una palabra de contenido de la idea y subir la siguiente.
2. **[RutaMini · piezas.tsx L321]** `nueva = i === respuestas.length - 1` vuelve a animar la última etiqueta en pasos que no agregan ninguna. → Pasar la clave de la etiqueta agregada en el paso anterior y animar solo esa.
3. **[Pie de 01-punto, 03-reconocimiento, 12-armando]** Quedan entre 240 y 300px vacíos. → `mt-auto` al pie con `flex-1` en el contenedor, y `justify-center` vertical en Armando y Reconocimiento.
4. **[Modo "escribe la tuya": PasoPregunta vs PasoEjercicio L202-247]** Uno tiene label visible y el otro sr-only, uno tiene Cancelar y el otro no, y el ejercicio muestra dos dorados. → Extraer un `CampoPropio` común (label visible + Continuar + Cancelar) y pasar "Armar mi pieza" a secundario mientras se escribe.
5. **[Rótulo de PromesaRecorrido en 01-punto · piezas.tsx L257]** "LLEVAS" queda sola en la segunda línea. → Acortar a "5 minutos · te llevas" o aplicar `text-wrap: balance`.
