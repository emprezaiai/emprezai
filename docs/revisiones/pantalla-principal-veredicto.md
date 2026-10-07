# VEREDICTO revisor-visual — pantalla-principal (Hoy, M0)
Fecha: 2026-10-07 22:30
Screenshot: docs/revisiones/pantalla-principal-375.png
Usabilidad: 31/40
Craft: 16/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): FIEL
Veredicto: NO LISTA
Top defectos: 1) el título del día 8 sigue en 3 líneas ("Hoy: crea el / nombre de tu / negocio"): el espaciador flotante del h1 mide h-8 (32px) y la línea mide 30px (text-2xl con leading-tight), así que también acorta la segunda línea y deja un vacío a la derecha · 2) en estado hecho hay 4 controles que van a 2 destinos, los dos en Mi Empresa: la tarjeta héroe y el botón central van a la pieza, y el CTA "Ver mi negocio · 2/30" y la pestaña Mi Empresa van a /app/empresa; "qué sigue" solo aparece en la fila punteada · 3) la confirmación de Reintentar es un role=status que se monta junto con su texto y puede no anunciarse; si falla por segunda vez no ofrece salida · 4) en estado hecho, la llama de la racha va en relieve dorado, un uso que no está en la lista de dorado de FICHA-ARTE · 5) en el día 8, "7 días de racha" al lado de "0/7 esta semana" se lee como contradicción; los puntos no dicen qué semana es

## Detalle de puntaje
Usabilidad: h1:3 h2:3 h3:3 h4:3 h5:3 h6:4 h7:3 h8:3 h9:3 h10:3
Craft: jerarquía:3 profundidad:3 identidad:3 movimiento:4 encaje:3

Capturas puntuadas (todas del build actual):
- pantalla-principal-375.png
- app/04, app/09, app/16-arriba, app/16-final y app/17-final (375)
- app-360/16-arriba y app-360/17-arriba (360)

Código: components/interna/Hoy.tsx, components/interna/Marco.tsx, app/globals.css.

## Gate de carga cognitiva
Falla 0 de 8:
- Hay una acción primaria por estado.
- El insight ocupa como máximo 3 líneas.
- "Qué sigue" se ve en la fila de mañana.
- No hay elementos que parezcan interactivos y no hagan nada.

## CTA héroe vivo
Estado pendiente (los 4 se cumplen):
- Contraste: .boton-oro, unos 11:1.
- Tap: :active.
- Habilitado: es un Link y nunca está disabled.
- Tamaño: h-14, ancho completo, en la primera vista.

Estado hecho: el primario es el botón central verde y el CTA pasa a secundario. Es correcto, pero queda la redundancia del defecto 2.

## Test de fidelidad (referencia-usuario-1.jpg = contrato de composición)
- Modo: OK.
- Hue: OK (colores de la C, según el alcance del contrato).
- Display grotesk: OK.
- Radios 20/999/12: OK.
- Densidad: FALLO LEVE. El insight entre los datos y las filas no está en la composición de la referencia.
- Profundidad: OK.

Resultado: 1 de 6 fallos → FIEL.

Valores de FICHA-ARTE comprobados en el screenshot:
- Fondo #0F0D16 con radial dorado.
- Superficies #1A1622 y #231D2E.
- Hundido #0A0910 (fila de mañana).
- ink 1/2/3.
- Bricolage + Instrument.
- Radios 20, 999 y 12.

Único roce con la ficha: la llama dorada en estado hecho (defecto 4).

## Re-revisión 6: verificación de los 5 defectos de la ronda 5

**[CORREGIDO] 1. El insight desaparecía con racha en riesgo**
- Hoy.tsx:259-269 mantiene la frase del Método dentro de "La llama espera".
- En pantalla-principal-375 se lee: "el Método ya tiene tu cliente ideal y tu oferta; hoy arma el nombre de tu negocio con eso".
- En app/09: "ya tiene tu frase de negocio; hoy arma tu cliente ideal con eso".

**[PARCIAL] 2. CTA del estado hecho**
- El CTA ya tiene un destino distinto al de la tarjeta héroe: /app/empresa contra /app/empresa?pieza=N (Hoy.tsx:97-99).
- Pero ese destino es el mismo de la pestaña Mi Empresa, y la tarjeta héroe sigue yendo al mismo sitio que el botón central (Marco.tsx:100).
- Ninguno de los 4 controles lleva a "qué sigue".
- El "2/30" del CTA repite el de la barra.

**[NO CORREGIDO] 3. Espacio para los cubos solo en la primera línea**
- Se cambió el pr-24 por un float `h-8 w-24` (Hoy.tsx:157).
- h-8 mide 32px y la línea mide 30px (24px × 1.25), así que el float invade la segunda línea y la acorta.
- Cálculo en el día 8: "nombre de tu negocio" mide unos 258px CSS. El ancho útil es unos 309px, pero la segunda línea solo deja unos 213px, así que "negocio" baja a una tercera línea.
- Se ve en pantalla-principal-375, app/17-final y app-360/17-arriba.

**[CORREGIDO] 4. Capturas desactualizadas**
- app/16-arriba, app/16-final y app-360/16-arriba muestran la flecha piedra y las etiquetas alineadas.
- Coinciden con el código.

**[CORREGIDO] 5. Puntos, ritmo y Reintentar**
- Los puntos llevan `role="img"` con aria-label (Hoy.tsx:239).
- El -mt-1 ya no está y el ritmo es gap-2 (8px) en las 3 fichas.
- Reintentar confirma con "Listo: tu pieza 1 ya está en Mi Empresa" durante 2,4s.
- Queda un matiz: ese aviso es un live region que se monta junto con su contenido (defecto 3 del top).

**Movimiento (eje 4), sin cambios: OK**
- Stagger entrar(0-5).
- Conteo con Cuenta.
- Barra con scaleX y puntos con spring.
- Tap con active:scale.
- Transición entre pestañas en el template.
- Indicador de la barra con spring.
- Reduced-motion con useReducedMotion y MotionConfig "user".

**Balance:** 31/40 (antes 30) · 16/20 · FIEL. h6 sube a 4. Sigue NO LISTA: faltan 5 puntos de usabilidad.

## Qué tendría que pasar para que cada criterio llegue a 4
- **h1 (estado):** un único contenedor `role="status"` siempre montado (vacío) en el que se escriben el fallo, el reintento y el éxito. Que el éxito aparezca con la misma entrada animada que el resto.
- **h2 (lenguaje):** que "La llama espera" diga qué está en juego en lenguaje llano, por ejemplo "Tu racha de 7 días sigue viva si hoy…". Así nadie tiene que interpretar la metáfora.
- **h3 (control):** este criterio se gana fuera de esta pantalla. Hoy no tiene acciones destructivas. Para un 4, Hoy tendría que ofrecer "posponer la misión" o "cambiar el recordatorio" con deshacer, sin salir de la pantalla.
- **h4 (consistencia):** que la tarjeta héroe sea un elemento con rol y foco, igual que las demás tarjetas tocables (hoy es un div con onClick y las otras son Links). Que el CTA secundario del estado hecho use el mismo material que las filas píldora.
- **h5 (prevención):** bloquear el doble toque en Reintentar (deshabilitarlo mientras corre) e impedir que el CTA lleve a una misión que no se puede empezar sin conexión cuando la misión usa IA.
- **h6 (reconocer):** ya está en 4.
- **h7 (flexibilidad):** un default para el experto, como "Seguir donde lo dejé" (retomar la misión a medias) o un acceso directo para abrir la última pieza. Hoy no existe ninguno en el código.
- **h8 (minimalismo):** en estado hecho, cada control debe tener un destino distinto. Quitar el CTA "Ver mi negocio" (duplica la pestaña) o convertirlo en "qué sigue" (la misión de mañana en /app/ruta), y quitar el "· 2/30" repetido.
- **h9 (errores):** tras el segundo fallo, ofrecer una salida ("Escríbenos" con el mailto de ayuda) además de "libera espacio".
- **h10 (ayuda):** dejar como evidencia el estado de día 1 pendiente sin piezas (el texto "Hoy empieza tu Método…") y un estado de racha rota. Hoy solo existen en el código y no se pueden verificar.
- **Encaje (craft):** la altura del float igual a 1 línea (`h-[1lh]` o h-7).
- **Jerarquía, profundidad e identidad:** para llegar a 4 necesitan un detalle firma propio en las fichas de datos (hoy son tres tarjetas genéricas iguales). Por ejemplo, la llama o el rayo animados con el material en relieve y una lectura de 4 niveles nítida también en estado hecho.
