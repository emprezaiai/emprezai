# VEREDICTO revisor-visual — paywall (pantalla de planes)
Fecha: 2026-10-06 21:10
Screenshot: docs/revisiones/paywall-375.png
Usabilidad: 36/40
Craft: 16/20
Copy (si vende): 19/20
Fidelidad (si hubo referencia): N-A
Veredicto: LISTA
Top defectos: (1) subtítulo (L183): la frase del mecanismo se parte entre líneas a 375 y a 360 ("pieza a / pieza,") · (2) las tarjetas de plan (L266) usan bg-raised plano, mientras la ruta y las opciones del onboarding usan relieve. La misma "opción elegible" se ve distinta (h4 y profundidad en 3) · (3) a 375 en el primer cuadro, la fila "Hoy: empiezas gratis" asoma a medias bajo el degradado de .barra-inferior: el punto dorado y el texto quedan lavados, como si estuvieran cortados · (4) el dorado se usa en más lugares de los que fija FICHA-ARTE ("SOLO en CTA, misión de hoy, nodo hoy, dato héroe"): titular, chip, borde del plan, check, 2 puntos de la línea de tiempo y hairline. El CTA sigue resaltando, pero el 10 % se diluye · (5) el paywall no tiene prueba social real, así que especificidad queda en 3

Detalle: USABILIDAD h1:4 h2:4 h3:4 h4:3 h5:4 h6:4 h7:3 h8:3 h9:4 h10:3 · CRAFT jerarquía:3 profundidad:3 identidad:3 movimiento:3 encaje:4 · COPY idea:4 especificidad:3 emoción:4 oferta:4 acción:4
Gate doble: 36/40 (≥36) PASA · 16/20 (≥16) PASA · copy 19/20 (≥16, ningún eje ≤2) PASA. Pasa justo: cualquier regresión la vuelve a dejar NO LISTA.
Gate de carga cognitiva: 0 fallas de 8. La ruta tiene 5 nodos, hay 2 planes y la línea de tiempo tiene 3 pasos. Hay 1 acción primaria y ningún bloque pasa de 4 líneas.
CTA héroe vivo: pasa los 4. on-gold #1A1206 sobre #FFC23D ≈ 11:1 · whileTap 0.98 + :active translateY(2px) · disabled solo con `yendo` · h-14 (56px), ancho completo y sticky.
FICHA-ARTE: coinciden #0F0D16, #1A1622, #0A0910, #FFC23D, #3DDC97, Bricolage + Instrument Sans, tarjeta de 20px, chip de 12px y píldora. No es clon de "Umbral" ni de "Capítulo". El único desvío leve es el reparto del dorado (defecto 4).
Contraste verificado: ink-3 #998FA8 sobre #1A1622 ≈ 5.8:1 (AA).
Sub-checks de copy: garantía con nombre y plazo ("La Garantía Sin Preguntas" · 15 días) antes del CTA: PASA. Message-match: NO VERIFICABLE, porque falta el dato del 34. El subtítulo se traza a FICHA-AVATAR L66 ("hoja en blanco", "5 minutos al día", "tu negocio, pieza a pieza") y el titular a L35 ("oferta lista para vender", sin prometer ingresos).
Promesas pendientes (no cuentan como defecto, por instrucción): el aviso del día 5 y la devolución "en 1 clic" se verifican en Hotmart en la Sesión 6. El correo de soporte es provisional.

## Re-revisión 6: qué se corrigió (contra la revisión 5, 35/40 · 15/20 · 18/20)
- 1 (subtítulo de 3 líneas y negrita partida): CORREGIDO. Ocupa 2 líneas a 375 y a 360, y "5 minutos al día" ya no se separa. Queda el corte de "pieza a pieza" (defecto 1, menor).
- 2 (Mensual tapado a 360): CORREGIDO. En recorrido-360-nose/16-planes-mensual-arriba, con la cita de 4 líneas, la tarjeta Mensual se ve entera sobre el botón. El encaje sube de 3 a 4.
- 3 (esqueleto): CORREGIDO. Medido a 375, cada bloque queda a ≤4px de su posición real: título 84-148 contra ~90-148, subtítulo 156-212 contra ~156-208, ruta 228-436 contra 228-432 y planes 452/560 contra 450/558. Ahora usa motion-safe:animate-pulse. h1 sube a 4. Con citas de 4 líneas la ruta crece ~19px; es aceptable.
- 4 (titular contra el nodo "Oferta"): CORREGIDO. "Desbloquea 29 días hasta salir a vender" coincide con el nodo final "A vender" y la cuenta cierra (1 + 3 + 26 = 30).
- 5 (CTA que nombra la prueba): CORREGIDO. "Seguir mi ruta: 7 días gratis" está en 1ª persona, sigue el progreso ya hecho y mantiene la prueba. Acción sube a 4.

## Fixes concretos (afinado; no bloquean)
1. L183: envolver "pieza a pieza" en `<span className="whitespace-nowrap">` y volver a sacar la captura a 360 para confirmar que siguen siendo 2 líneas.
2. L266: dar a las tarjetas de plan el mismo tratamiento de relieve que `.opcion`/`.tarjeta-relieve`, con el gradiente superior y el inset de 1px.
3. globals.css L225: llevar el tramo opaco de `.barra-inferior` de 16px a 28-32px para que la fila que asoma no quede a medias.
4. L340: dejar en ink-3 los puntos de la línea de tiempo que no son "hoy", para que el dorado quede en la acción y el dato.
5. Cuando haya testimonios REALES, agregar 1 línea de prueba social sobre la garantía. Nunca inventarla.
