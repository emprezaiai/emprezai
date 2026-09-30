# FICHA DE DIRECCIÓN DE ARTE — EMPRESAI

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
- Texto 1º/2º: #EFEAF5 / #998FA8 (grises de la C tal cual — el usuario pidió los tonos exactos de la C; si en
  celular se ven oscuros, subir a #B7AEC6 con su OK)
- Acento: #FFC23D dorado (SOLO en: CTA principal, misión de hoy, nodo "hoy", dato héroe, botón central) ·
  relieve del dorado #B8860F · 2ª nota: #3DDC97 verde (porqué: progreso HECHO — nodos completos, barras, piezas listas)
- Semánticos: éxito #3DDC97 · error #FF6B6B · aviso #FF9F43
- Display: Bricolage Grotesque (700/800) · Body: Instrument Sans (400/600/700) · Escala: display 24-28px / title 16-19px / body 13-15px / label 10.5-12px
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
