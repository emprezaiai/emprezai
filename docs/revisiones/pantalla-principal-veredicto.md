# VEREDICTO revisor-visual — pantalla-principal (Hoy, M0)
Fecha: 2026-10-07 12:00
Screenshot: docs/revisiones/pantalla-principal-375.png
Usabilidad: 29/40
Craft: 15/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): FIEL
Veredicto: NO LISTA
Top defectos: 1) el día 1 en estado "hecho" deja unos 180px de vacío muerto sobre la barra · 2) dos bloques de texto gris seguidos bajo los datos (la línea M4 queda pegada al borde izquierdo y fuera del stagger, el insight lleva sangría con ícono) · 3) datos redundantes ("1 · 1 · 1/7" en la semana 1) y "0/7 esta semana" sin sustantivo · 4) unos 9 tamaños de texto y el saludo de 20px queda fuera de la escala de la ficha · 5) guardarCuenta sigue tragándose el fallo de guardado, y error.tsx manda a "Perfil" cuando la ayuda está en el chip de la cabecera

## Detalle de puntaje
Usabilidad: h1:3 h2:3 h3:3 h4:3 h5:3 h6:3 h7:3 h8:2 h9:3 h10:3
Craft: jerarquía:3 profundidad:3 identidad:3 movimiento:3 encaje:3

Capturas puntuadas: pantalla-principal-375.png, app/17-hoy-demo-dia8-arriba.png, app/17-hoy-demo-dia8-final.png,
app/04-hoy-dia1-hecho.png, app/09-hoy-dia2-pendiente.png, app/16-hoy-dia2-hecho.png, app-360/17-hoy-demo-dia8-arriba.png,
app-360/09-hoy-dia2-pendiente.png.
Código: components/interna/Hoy.tsx, components/interna/Marco.tsx, app/app/error.tsx, lib/cuenta.ts, app/globals.css.

## Gate de carga cognitiva
Falla 0 de 8. El ítem de "elementos que parecen interactivos y no hacen nada" ya pasa: la tarjeta héroe y las 3 fichas son
Link. El "qué sigue" es obvio porque el CTA aparece en la primera vista a 375 y a 360. No hay sobrecarga.

## CTA héroe vivo (los 4 se cumplen)
Contraste: #1A1206 sobre #FFC23D da unos 11:1, y el dorado contra #0F0D16 supera 3:1. Tap: .boton-oro:active con
translateY 2px en 120ms. Nunca disabled: es un Link. Mide 56px de alto y ocupa todo el ancho, en la primera vista.
Nota: hay 3 entradas al mismo destino casi juntas (la tarjeta héroe, el CTA y el rayo central). Son dos dorados
"primarios" en la primera vista y dos paradas de tabulación repetidas.

## Test de fidelidad (referencia-usuario-1.jpg = contrato de composición · public/landing/hoy-v2.png = tour aprobado)
- Modo: OK (oscuro)
- Hue del acento: OK (#FFC23D, más #3DDC97 como 2ª nota)
- Clase tipográfica display: OK (Bricolage, grotesk)
- Radios: OK (tarjetas 20px · píldoras 999px · chips 12px, igual que en la ficha)
- Densidad: FALLO LEVE. Entre los datos y las filas hay dos bloques de texto (línea M4 + insight) que no existen ni
  en la referencia ni en hoy-v2: suman 4-5 líneas de gris. El CTA sí quedó en la primera vista.
- Sombras/profundidad: OK. Los cubos tienen halo (.cubo-verde/.cubo-oro) y la tarjeta lleva el radial dorado (.heroe-hoy::before).
Resultado: 1 de 6 fallos → FIEL.
Valores de FICHA-ARTE comprobados en el screenshot: fondo #0F0D16, superficie #1A1622, tinta #EFEAF5/#BDB4CB/#998FA8,
Bricolage + Instrument y radios 20/999/12 coinciden. Desvío menor: el saludo mide 20px (text-xl) y la ficha fija
display en 24-28 y title en 16-19, así que queda en tierra de nadie.

## Hallazgos por severidad

### ALTA
1. 04-hoy-dia1-hecho.png (y la versión a 360). Entre la píldora "Tu frase de negocio" y la barra quedan unos 180px vacíos.
   Es el defecto 14 de la revisión anterior y sigue sin corregirse. Es justo la pantalla que la persona ve después de su
   primera victoria.
   FIX: con 1 sola pieza, mostrar debajo la pieza de mañana bloqueada (Día 2 · "se abre mañana") o la semana 1 en 7 nodos.

### MEDIA
2. Hoy.tsx:223-233. La línea M4 es un <p> sin motion: aparece de golpe, fuera del stagger, y queda pegada al borde
   izquierdo. El insight de abajo va sangrado detrás del ícono Sparkles. Son dos bloques grises seguidos y desalineados:
   4-5 líneas de texto entre los datos y la lista (defecto 15 de la revisión anterior, sin corregir).
   FIX: cuando rachaEnRiesgo, unir M4 e insight en un solo bloque con un ícono (la llama en ink-2), envuelto en entrar(4).
3. Hoy.tsx:182-221. En la semana 1, si no hubo cortes, racha = piezas = semana: el usuario ve "1 · 1 · 1/7" o
   "2 · 2 · 2/7", el mismo dato 3 veces. El día 8, el héroe numérico es "0/7" con la etiqueta "esta semana", que no dice
   de qué (¿piezas, días?) y empieza la semana con un cero.
   FIX: la etiqueta pasa a "piezas de la semana" y el número se cambia por 7 puntos de progreso (llenos/vacíos), así no
   repite el dato de piezas.
4. Tipografía. Hay unos 9 tamaños en pantalla: 14 (fecha), 20 (saludo), 12 (eyebrow/labels), 24 (misión/números),
   17 (CTA), 16 (filas, "/7"), 13 (M4), 15 (insight), 18 (marca). El máximo es 3-4. El saludo de 20px está fuera de la
   escala de la ficha (24-28 / 16-19).
   FIX: saludo a 18px semibold, M4/insight/subtítulo a 15, eyebrow/labels/sub-fila a 12; la misión y los números
   quedan como único display (24).
5. lib/cuenta.ts:78-87. guardarCuenta sigue tragándose el fallo de almacenamiento: la persona termina su misión, la ve
   "lista" y la pierde al recargar sin ningún aviso (la otra mitad del defecto 9).
   FIX: que devuelva boolean y mostrar un aviso visible: "No pudimos guardar en este celular. Libera espacio y toca
   Reintentar."
6. app/app/error.tsx:13. El texto dice "escríbenos desde Perfil", pero ahora la ayuda está en el chip de la cabecera
   de Hoy (mailto). Son dos caminos distintos para lo mismo.
   FIX: poner en error.tsx un enlace directo "Escribir a soporte" con el mismo mailto.

### BAJA
7. Marco.tsx:126-131. El indicador de la pestaña activa (layoutId con spring) no respeta prefers-reduced-motion: no hay
   MotionConfig reducedMotion="user". Tampoco hay transición entre pestañas (no hay template.tsx ni AnimatePresence),
   solo se mueve la pastilla. FIX: <MotionConfig reducedMotion="user"> en el layout de /app y un fade de 200ms en template.tsx.
8. Hoy.tsx:116-177. La tarjeta héroe y el CTA son dos Link al mismo destino, uno debajo del otro: dos paradas de
   tabulación iguales. FIX: tabIndex={-1} y aria-hidden en el Link de la tarjeta, o convertir la tarjeta en un div con
   onClick sin foco.
9. Hoy.tsx:111. El h1 es el saludo genérico ("Buenos días") y la misión, que es el objeto principal, no es un
   encabezado. FIX: el saludo pasa a <p> y el título de la misión a <h1>.
10. Hoy.tsx:248. Las flechas de las filas en píldora pasaron de dorado (hoy-v2) a piedra. Es coherente con dejar el
    dorado solo para la acción, pero es un desvío del tour aprobado: confirmarlo con la dueña o anotarlo en FICHA-ARTE.

## Re-revisión 2: qué se corrigió
Verificado en screenshot y código, contra los 15 defectos de la revisión 1:
- [CORREGIDO] 1. El CTA va justo debajo de la tarjeta héroe (Hoy.tsx:173) y se ve completo en la primera vista a 375 y a 360.
- [CORREGIDO] 2. Los cubos ahora son size-12/size-11 dentro de una caja de 28 y el título lleva pr-24. A 360 ya no se
  monta sobre los cubos.
- [CORREGIDO] 3. El insight conserva los posesivos y cierra con "con eso", sin pronombre que concordar ("ya tiene tu
  frase de negocio: hoy arma tu cliente ideal con eso"). Se lee natural.
- [CORREGIDO] 4. La llama apagada es estática, con borde y trazo en ink-2 (#BDB4CB) y sin opacidad: el contraste es
  correcto.
- [CORREGIDO] 5. El subtítulo dice solo "5 minutos, desde el celular". [SIGUE] la línea de racha no se integró a la ficha:
  ahora es un bloque aparte junto al insight (hallazgo 2).
- [CORREGIDO] 6. El copy de M4 ("modo siesta… la vuelve a prender") es cómplice-juguetón, alineado con la ficha.
- [CORREGIDO] 7. Los cubos tienen halo de color y la tarjeta lleva el radial dorado. El detalle firma ya se ve.
- [CORREGIDO] 8. El saludo bajó a 20px y la misión subió a 24px: el héroe es la misión. [SIGUE] hay demasiados tamaños
  (hallazgo 4).
- [PARCIAL] 9. Ya existe app/app/error.tsx con qué pasó y qué hacer. guardarCuenta sigue tragándose el fallo (hallazgo 5).
- [CORREGIDO] 10. "min en total" se cambió por un dato real: piezas de la semana N/7. Trae su propio problema de
  etiqueta y redundancia (hallazgo 3).
- [CORREGIDO] 11. El chip izquierdo ahora es "Ayuda" (mailto) y ya no duplica Perfil.
- [CORREGIDO] 12. La tarjeta héroe y las 3 fichas son Link con active:scale.
- [CORREGIDO] 13. La grilla de la barra es 1fr 1fr 88px 1fr 1fr y "Mi Empresa" ya respira respecto del aro.
- [SIN CORREGIR] 14. El día 1 "hecho" sigue con el vacío muerto (hallazgo 1).
- [SIN CORREGIR] 15. La línea de racha sigue fuera del stagger y desalineada del insight (hallazgo 2).
Movimiento (eje 4) verificado en código: stagger entrar(0-5) OK · conteo con Cuenta OK · barra que crece con scaleX OK ·
tap con active:scale y translateY OK · transición entre pestañas solo con el indicador · modales no aplican en esta
pantalla · celebración fuera de esta pantalla · reduced-motion OK en Hoy, falta en el indicador de la barra.
Balance: 29/40 (antes 27) · 15/20 (antes 12) · FIEL (antes NO FIEL). Sigue NO LISTA: faltan 7 puntos de usabilidad y
1 de craft. El camino más corto es cerrar los hallazgos 1, 2 y 3 (suben h8 y encaje) y el 4 (sube jerarquía).
