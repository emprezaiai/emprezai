# FICHA DE DIRECCIÓN DE ARTE — EMPREZAI

## Referencia del usuario (CONTRATO — ver 16, protocolo obligatorio)
- ¿Hay imagen(es) de referencia del usuario?: SÍ → docs/revisiones/referencia-usuario-1.jpg (Pinterest, generada por IA)
- Extracción (histograma de píxeles en navegador): docs/revisiones/referencia-usuario-1-extraccion.md
- ALCANCE DEL CONTRATO (decisión del usuario 2026-09-30): de la referencia se toma SOLO la COMPOSICIÓN de la
  pantalla principal (Opción A): cabecera con 2 chips circulares + título centrado · saludo · tarjeta héroe con
  cubos de vidrio · 3 datos · filas en píldora con flecha en círculo · CTA en píldora · barra inferior con
  BOTÓN CENTRAL CIRCULAR elevado. Sus COLORES (azul/vidrio claro) NO se usan: los reemplazan los de la Opción C.
- Prohibiciones anti-IA que la referencia LEVANTA: "cubos de vidrio con resplandor" en la tarjeta héroe
  (detalle firma de la referencia) — SOLO ahí; en el resto, sin glass sobre contenido y sin glow regado.

## Identidad derivada (fusión elegida por el usuario)
- Pantalla "Hoy" = composición de la A (su referencia) · Pantalla "Ruta" = mapa de juego de la B
  (Duolingo: camino de nodos en relieve) · COLORES Y TONOS = Opción C "Tablero de Fundador" (Linear × Coursiv)
- Líderes: Duolingo → camino de nodos, relieve inferior en botones/nodos, racha · Linear → oscuro con
  tinte, hairlines, sobriedad · Coursiv → reto diario de N días · referencia del usuario → orden de la home
- Combinación tipográfica: fila "IA creativa" del 29 (Bricolage Grotesque SOLO display + Instrument Sans body) · validada: SÍ
- Arquetipo: el Mentor-Compañero de juego · Mundo del sujeto: el tablero de un fundador que se arma pieza a pieza

## Personalidad compilada
- 3 adjetivos: Enérgico (dominante) + Juguetón + Cálido
- Compilación (tabla del 11): spring bounce 0.25 · stiffness ~380 · duración base 220-280ms ·
  exclamaciones máx 1/pantalla · celebración nivel 2 (check con punch + overlay con rebote; confetti SOLO al
  cerrar semana y día 30) · radio tendencial 18-22px · color emocional medio (dorado protagónico en CTA/dato)
- Personaje/mascota: NO por ahora — la emoción la carga el RAYO DORADO (forma de marca). Revisar en Sesión 4-5 (árbol del 11).

## Brand kit final (va a globals.css/@theme al crear el proyecto — Sesión 3)
- Fondo: #0F0D16 · Superficie: #1A1622 · Superficie elevada: #231D2E · Hundido: #0A0910 · Línea: rgb(255 255 255 / .08)
- Texto 1º/2º/3º: #EFEAF5 / #BDB4CB / #998FA8 — #998FA8 (tono exacto de la C) para labels y texto de apoyo;
  #BDB4CB para PÁRRAFOS de lectura larga (landing, legales): mismo neutro, más claro por legibilidad — el usuario
  pidió grises más claros sobre fondo oscuro (2026-09-30). Tokens: --ink-1/2/3 (app) · --text-primary/secondary/tertiary (landing)
- Acento: #FFC23D dorado (SOLO en: CTA principal, misión de hoy, nodo "hoy", dato héroe, botón central) ·
  relieve del dorado #B8860F · 2ª nota: #3DDC97 verde (porqué: progreso HECHO — nodos completos, barras, piezas listas)
- Semánticos: éxito #3DDC97 · error #FF6B6B · aviso #FF9F43
- Display: Bricolage Grotesque (700/800) · Body: Instrument Sans (400/600/700) · Escala: display 24-28px / title 16-19px / body 13-15px / label 10.5-12px
- EXCEPCIÓN APROBADA por la dueña (2026-10-02): en §2 de la landing los dolores usan fichas "noche" (cara oscura, ícono ENCENDIDO en dorado, sin halo) para que no se vean apagados; la frase clave del dolor va en blanco bold (el dorado de texto sigue reservado a acción/beneficio). Fuera de §2, dolor = piedra.
- EXCEPCIÓN (2026-10-06, etiqueta elegida por la dueña): en la pantalla de planes, la insignia "Mejor valor · ahorras $39.89" va en dorado sólido (es el dato héroe de la oferta, regla 50 §C2: el ahorro compite en peso con el CTA). Solo esa insignia; el resto del dorado sigue la lista de arriba.
- EXCEPCIÓN (2026-10-07, del tour aprobado por la dueña): la llama de la RACHA viva va en relieve dorado (ficha de racha en Hoy y su chip en Ruta) — es el dato héroe del hábito; en riesgo pasa a ámbar de aviso. Las flechas de filas y los íconos de los otros datos siguen en piedra/verde.
- EXCEPCIÓN (2026-10-14, pedido explícito de la dueña): la CELEBRACIÓN DIARIA (ventana modal al terminar la misión) lleva confeti TODOS los días (más abundante en cierres de semana y día 30) y dos exclamaciones ("¡Excelente, [Nombre]!" + "¡Vamos por más!"). Solo en esa ventana; el resto de la app sigue con 1 exclamación por pantalla.
- MARCA (2026-10-14, isotipo entregado por la dueña, con la S cambiada por Z): isotipo = chip oscuro con borde degradé dorado→verde y halo verde, "E" clara con rayo verde y traza de circuito (components/app/Marca.tsx, favicon app/icon.svg). Nombre "EMPREZ" claro + "AI" verde en Montserrat 800 (--font-marca): es la ÚNICA tercera familia y se usa SOLO en el nombre del logo, nunca en texto de interfaz. Va en: cabecera y pie de la página de ventas, recorrido de inicio, Entrar, cabecera de Hoy, páginas legales, 404 y correos.
- Material en relieve (app/globals.css): .relieve-oro (acción) · .relieve-verde (logro) · .relieve-piedra (dolor/neutro) · .relieve-noche (dolores de §2) · .tarjeta-relieve / -base / -oro / .tarjeta-dolor · .fondo-puntos
- Extensiones de la landing (components/landing/tokens.css): CTA final sobre #231D2E · chips 12px · relieve del CTA 0 4px 0 #B8860F
- Radio: tarjetas 18-22px · filas/CTA/chips en píldora 999px · chips de ícono 10-14px · Profundidad: superficie con
  degradé sutil + luz en borde superior + sombra negra difusa; hairline dorada degradada SOLO en el elemento clave
- Espaciado base: escala 4·8·12·16·24·32·48·64
- Fondo con profundidad: radial dorado arriba-derecha (16%) + radial verde abajo-izquierda (8%); en "Ruta" + patrón de puntos 6%
- Dispositivo ownable: EL RAYO DORADO (misión del día) + nodos en relieve (sombra inferior sólida, estilo juego)
- Motion signature: easing spring (bounce .25) · stagger 60ms · firma: el nodo "hoy" pulsa suave; al guardar una
  pieza, vuela a "Mi Empresa" y el tick se enciende en verde

## Trazabilidad y vetos
- Ruta de diseño: MIXTA a pedido del usuario (réplica de su captura + 2 propuestas propias)
- Protocolo A/B/C: elegida = Hoy(A)+Ruta(B) con colores de C · descartadas: A completa (azul/vidrio claro),
  B completa (crema/violeta), C completa (mosaico), combinación C+B, fusión "Tablero Dorado" (no le gustó) ·
  comparativa: direcciones-abc.html (copia en docs/revisiones/) · capturas: docs/revisiones/direccion-*-375.jpg, eleccion-*-375.jpg
- Tour de la app: vista-previa-app.html (copia en docs/revisiones/) · vistas: Hoy (M0), Ruta, inicio (pregunta),
  misión con IA (mecanismo), Mi Empresa, planes · APROBADO por el usuario 2026-09-30 ("me encanta sigue")
- Registro anti-repetición: paleta #0F0D16/#FFC23D/#3DDC97 + par Bricolage Grotesque/Instrument Sans → vetados para el próximo proyecto del SO
- Modo oscuro DERIVADO por: elección explícita del usuario (colores de la C) + momento de uso nocturno del avatar (7 PM)

## Idioma UI: español LATAM neutro (tuteo) · Fecha de cierre: 2026-09-30 · Aprobada por el usuario: SÍ
