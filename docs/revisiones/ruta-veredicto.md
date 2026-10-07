# VEREDICTO revisor-visual — Ruta
Fecha: 2026-10-07 23:30
Screenshot: docs/revisiones/ruta-375.png
Usabilidad: 31/40
Craft: 16/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): FIEL
Veredicto: NO LISTA
Top defectos: (1) las píldoras de racha y piezas del encabezado ahora tienen borde y forma de botón (igual que los botones de Hoy.tsx:286), pero son <p> y no hacen nada al tocarlas; es una regresión del arreglo 4 y rompe la regla 11 · (2) cuando la pieza de hoy está lista (día 1, a 375 y a 360) hay tres caminos a Mi Empresa en la misma vista (el botón de la tarjeta, el botón central verde y la pestaña), y el botón central verde, la masa más fuerte de la pantalla, compite con la tarjeta; además hay 3 masas verdes · (3) el esqueleto de carga ("Cargando tu ruta", Marco.tsx:150-170) tiene la forma de Hoy (círculos, una tarjeta héroe y una grilla de 3), no la de Ruta (banda y nodos en zigzag) · (4) el punto ámbar de la llama se lee como un aviso de notificación, no como "racha en riesgo"; la banda de la semana no dice cuánto llevas de ella · (5) el fondo de la FICHA (brillo dorado arriba a la derecha y verde abajo a la izquierda) no se ve en Ruta: fondo-recorrido mide lo que toda la página y queda tapado por el encabezado opaco, así que el fondo visible es un color plano con puntos

## Detalle de puntuación
Usabilidad: h1:3 h2:3 h3:3 h4:3 h5:3 h6:4 h7:3 h8:3 h9:3 h10:3
Craft: jerarquía:3 profundidad:3 identidad:3 movimiento:4 encaje:3

Gate de carga cognitiva: 1 falla, no crítica.
- La falla: "cero elementos que parezcan interactivos y no hagan nada". Las píldoras del encabezado parecen botones y no hacen nada.
- Lo demás pasa:
  - Las semanas agrupan los nodos y cada uno va etiquetado.
  - Hay 1 acción primaria ("Empezar").
  - El paso siguiente es obvio.

CTA héroe vivo ("Empezar"): cumple los 4.
- Contraste: botón dorado sobre la tarjeta oscura, muy por encima de 3:1.
- Tap: .boton-oro:active.
- Nunca deshabilitado.
- Área: h-12, en la zona del pulgar.

Test de fidelidad contra public/landing/ruta-v2.png: 0 de 6 fallos = FIEL.
- Coinciden: modo, hue del dorado, clase de la display, radios, densidad y profundidad en relieve.
- La apertura con la banda arriba y las píldoras del encabezado ya replican la referencia.
- Diferencias que no son de token:
  - El trazo entra en vertical a la tapa del nodo; en la referencia entra en diagonal.
  - El CTA va dentro de la tarjeta; en la referencia es de ancho completo.

## Re-revisión 6: los 5 defectos de la ronda 5, uno por uno
1. Aire entre la banda y la píldora "HOY · 5 MIN": CORREGIDO.
   - Ruta.tsx:109 suma 28px a ARRIBA cuando el primer día de la semana es hoy.
   - En ruta-375 y en app-360/18-arriba quedan unos 30px entre el canto de la banda y la píldora.
2. Botón central en noche dentro de Ruta: CORREGIDO, solo cuando la pieza de hoy está pendiente.
   - Marco.tsx:102 usa .boton-central-quieto, y globals.css:107-127 ya usa variables --cara/--canto (también .relieve-noche).
   - En el día 8 quedan 3 masas doradas (banda, nodo y Empezar), más el rayo y el aro del botón central.
   - Residuo: con la pieza ya hecha, el botón central pasa a verde lleno con brillo y vuelve a competir (defecto 2).
3. Apertura con la banda de la semana arriba: CORREGIDO.
   - Ruta.tsx:43-54 desplaza a la sección con block:'start' si hoy cabe sobre la tarjeta y, si no, centra en hoy.
   - En el día 8 la banda queda arriba, como en la referencia. Ya no aparece "Validación" suelta.
4. Encabezado en píldoras con aviso ámbar: CORREGIDO, con una regresión.
   - Píldoras rounded-pill con border var(--line), y punto bg-warning cuando la racha está en riesgo (Ruta.tsx:75-89).
   - Regresión: ahora parecen tocables y son <p> sin acción (defecto 1).
   - El punto sin texto se confunde con una notificación (defecto 4).
5. Camino en S diagonal: CORREGIDO EN LO SUSTANCIAL.
   - Los controles son ahora (desde.x + lado*48, desde.y) y (hasta.x, hasta.y - 48), en Ruta.tsx:122.
   - El codo de 90° pasó a ser un arco suave; el tramo 28→29 ya se lee como una curva continua.
   - Residuo bajo: la segunda mitad de cada tramo cae en vertical (unos 60px de puntos en columna) y no entra en diagonal como en la referencia.
   - Pendiente de la ronda 5 que sigue igual: "Idea en 1 pág." (lib/ruta.ts:41) sigue siendo una abreviatura.

## Qué tendría que pasar para que cada heurística llegue a 4
- h1 Estado del sistema (3→4):
  - Un esqueleto propio de Ruta (banda más 4 círculos en zigzag) en lugar del de Hoy.
  - Que la banda muestre el avance de la semana ("0 de 7").
  - Que el aviso de racha se lea sin la tarjeta: texto "hoy" junto a "7 días", o la llama en ámbar.
- h2 Lenguaje (3→4): eliminar la abreviatura "Idea en 1 pág." ("Tu idea, resumida") y revisar que ninguna etiqueta corta use siglas ni puntos.
- h3 Control (3→4):
  - Que el aviso de nodo bloqueado se cierre solo (unos 4s) además de con la X, y que se cierre con Escape.
  - Que el botón "Ir a mi día" tenga una etiqueta visible la primera vez.
- h4 Consistencia (3→4):
  - Que las píldoras del encabezado se comporten igual que las píldoras con borde del resto de la app, es decir, que sean tocables.
  - Que el botón central no cambie de color según la pestaña sin una regla que el usuario pueda ver.
- h5 Prevención (3→4): que los nodos bloqueados digan cuándo se abren antes de tocarlos (por ejemplo, la píldora "Mañana" sobre el nodo de mañana) para que el usuario no tenga que tocar para descubrirlo.
- h6 Reconocer (4): se mantiene.
- h7 Flexibilidad (3→4):
  - Que tocar la píldora de piezas lleve a Mi Empresa y la de racha al detalle de la racha.
  - Que un nodo hecho muestre una vista previa de la pieza con un toque largo, o atajos equivalentes.
- h8 Minimalista (3→4):
  - Con la pieza hecha, un solo camino a Mi Empresa: el botón central en noche dentro de Ruta también en ese estado, o quitar el botón de la tarjeta.
  - Ninguna píldora decorativa con forma de botón.
- h9 Errores (3→4): que Ruta tenga su propio estado de error u offline (por ejemplo, "no pudimos cargar tu ruta, reintentar") en lugar de depender solo del marco.
- h10 Ayuda (3→4): en la primera visita, una línea que enseñe la mecánica ("cada día desbloquea una pieza de tu negocio") cerca de la banda, que se pueda cerrar.

## Hallazgos por severidad

### ALTA
1. Píldoras de racha y piezas que parecen botones y no hacen nada (Ruta.tsx:75-89).
   Fix: convertirlas en Link (piezas → /app/empresa, racha → /app/perfil) con active:scale-[0.97], o quitarles el borde para que se lean como texto.
2. Estado "pieza hecha" (05-ruta-dia1): botón central verde lleno, más el chip verde de la tarjeta, más el nodo verde, y tres caminos a Mi Empresa.
   Fix: en /app/ruta usar .boton-central-quieto también cuando hecha=true, con el check en verde.

### MEDIA
3. El esqueleto de carga tiene la forma de Hoy.
   Fix: un EsqueletoRuta con una banda de 96px y 4 círculos de 64px en zigzag.
4. El punto ámbar se puede leer como notificación.
   Fix: cuando la racha está en riesgo, mostrar "7 días · hoy" en text-warning en lugar de solo el punto.
5. El fondo de la FICHA no se ve en Ruta (solo puntos sobre un color plano).
   Fix: poner el radial dorado y el verde en position:fixed (o background-attachment:fixed) en la main de Ruta.

### BAJA
6. La segunda mitad de cada tramo cae en vertical.
   Fix: el segundo control en (hasta.x - lado*40, hasta.y - 40) para que el tramo entre en diagonal, como en la referencia.
7. "Idea en 1 pág." es una abreviatura (lib/ruta.ts:41).
