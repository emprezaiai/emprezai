# VEREDICTO revisor-visual — pantalla-principal (Hoy, M0)
Fecha: 2026-10-07 09:00
Screenshot: docs/revisiones/pantalla-principal-375.png
Usabilidad: 27/40
Craft: 12/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): NO FIEL
Veredicto: NO LISTA
Top defectos: 1) CTA principal fuera de la primera vista (asoma cortado bajo el botón central) · 2) a 360px el título de la misión se monta sobre el cubo de vidrio · 3) copy redundante y con la concordancia rota ("ya tiene frase de negocio: hoy los usa") · 4) la llama apagada (M4) pulsa y baja su contraste, contra lo que pide el 56 §M4.2 · 5) cubos sin resplandor y el saludo pesa más que la misión (desvío del tour hoy-v2)

## Detalle de puntaje
Usabilidad: h1:3 h2:2 h3:3 h4:3 h5:3 h6:3 h7:3 h8:2 h9:2 h10:3
Craft: jerarquía:2 profundidad:3 identidad:2 movimiento:3 encaje:2

Capturas puntuadas: app/17-hoy-demo-dia8-arriba.png, app/17-hoy-demo-dia8-final.png, app/04-hoy-dia1-hecho.png,
app/09-hoy-dia2-pendiente.png, app/16-hoy-dia2-hecho.png, app-360/17-hoy-demo-dia8-arriba.png, pantalla-principal-375.png.

## Gate de carga cognitiva
Falla 1 de 8 ítems: "cero elementos que parecen interactivos y no hacen nada". La tarjeta héroe tiene borde dorado y
canto, y las fichas de los 3 datos tienen relieve de "botón de juego", pero ninguna de las dos responde al toque.
"Qué sigue es obvio" pasa por poco: en la primera vista del día 8 la única acción visible es el rayo, que no tiene
etiqueta visible. No hay sobrecarga crítica.

## CTA héroe vivo
Contraste: OK (texto #1A1206 sobre #FFC23D, y el dorado sobre #0F0D16 supera 3:1 con margen). Tap: OK (.boton-oro:active,
translateY 2px en 120ms). Nunca disabled: OK. Alto 56px y ancho completo: OK. FALLA en ubicación: con 2 o más piezas
el CTA cae bajo el pliegue y en la primera vista se ve cortado detrás del botón central.

## Test de fidelidad (contrato de composición referencia-usuario-1.jpg + tour aprobado public/landing/hoy-v2.png)
Las 7 piezas de la composición están todas: 2 chips circulares y título centrado · saludo · tarjeta héroe con cubos ·
3 datos · filas en píldora con flecha en círculo · CTA en píldora · botón central elevado.
- Modo: OK (oscuro, Opción C)
- Hue del acento: OK (#FFC23D)
- Clase tipográfica display: OK (Bricolage, grotesk)
- Radios: OK (tarjetas 20px · píldoras 999px · chips 12px)
- Densidad: FALLO. hoy-v2 mostraba el CTA en la primera vista con 6 bloques. Ahora hay 8 bloques (se sumaron la línea
  de racha y el insight de 3 líneas) y el CTA quedó bajo el pliegue.
- Sombras/profundidad: FALLO. La ficha levanta la restricción solo para los "cubos de vidrio CON RESPLANDOR". Los cubos
  de .cubo-vidrio no tienen halo, y la tarjeta perdió el brillo radial interior que tenía hoy-v2. Ahora se ven
  como cuadrados grises con un punto.
Resultado: 2 de 6 fallos → NO FIEL.

## Hallazgos por severidad

### ALTA
1. components/interna/Hoy.tsx:241-261. El CTA "Empezar la misión de hoy" se pinta al final, después de las filas en
   píldora (l.219). En el día 8 queda fuera de los 812px y asoma cortado detrás del botón central
   (17-hoy-demo-dia8-arriba.png); a 360px ni siquiera asoma. Además rompe el orden M0 del propio comentario de la
   l.6 (dato → acción → racha → insight).
   FIX: mover el bloque del CTA justo debajo de la tarjeta héroe (l.163) y dejar las píldoras y el insight debajo.
2. components/interna/Hoy.tsx:112 y l.132. Los cubos son absolutos (h-32 w-32, right-2) y el h2 usa max-w-[70%]. A 360px
   el título "Hoy: crea el nombre" se monta sobre el cubo verde (app-360/17-hoy-demo-dia8-arriba.png).
   FIX: h2 con max-w-[calc(100%-8.5rem)], o cubos de size-12/size-10 por debajo de 380px.
3. components/interna/Hoy.tsx:62 y l.76. La regex que quita "Tu/Tus/El/La" deja frases que suenan a máquina ("usa
   cliente ideal y oferta") y el "los" fijo rompe la concordancia en el día 2: "ya tiene frase de negocio: hoy los usa"
   (09-hoy-dia2-pendiente.png).
   FIX: conservar los posesivos ("tu cliente ideal y tu oferta") y usar "lo/la" o "los" según la cantidad.

### MEDIA
4. components/interna/Hoy.tsx:169-176. La llama apagada (M4) se anima en bucle con opacity 0.5→0.75. Eso contradice
   el 56 §M4.2 ("sin animación de llama viva") y, al 50% de opacidad, el gris #998FA8 sobre #1A1622 queda por debajo
   de 4.5:1 (56 §M4.4).
   FIX: quitar animate y opacity, y dejar el stroke 1.5 en ink-3 estático.
5. components/interna/Hoy.tsx:135-141 + l.206-216. Se repite la misma información en 3 lugares. Pendiente: el
   subtítulo "usa X y Y" y el insight "ya tiene X y Y". Hecho: "Mañana · Día 3: tu oferta" y "Mañana el Método usa lo
   de hoy para tu oferta". Encima, la línea de racha suma un tercer bloque de texto.
   FIX: el subtítulo de la tarjeta queda solo con "5 minutos" y la línea de racha se integra bajo la ficha de racha.
6. components/interna/Hoy.tsx:208. El copy de M4 es la fila "Mentor sereno", pero la ficha compila Enérgico + Juguetón.
   FIX: usar la fila coach o cómplice del 56 §M4.3 ("7 días no se dejan morir hoy. Una pieza y sigue.").
7. app/globals.css:301-308 (.cubo-vidrio) + Hoy.tsx:110. Sin resplandor, el detalle firma del contrato no se ve.
   FIX: agregar un halo de color al cubo (0 0 28px rgb(61 220 151/.35) y su versión dorada) y un radial dorado dentro
   de la tarjeta, como en hoy-v2.
8. Hoy.tsx:103 contra l.132. Jerarquía invertida: el saludo genérico "Buenos días" (28px) pesa más que la misión de
   hoy (20px), que es el objeto principal. Hay unos 8 tamaños de texto en pantalla (13/28/12/20/14/24/15/16/17).
   FIX: bajar el saludo a 20px y subir el título de la misión a 24px, para que el héroe sea la misión.
9. app/app/ no tiene error.tsx. useCuentaActiva lanza un error (Marco.tsx:19) y no hay Error Boundary, así que un
   localStorage corrupto o ausente termina en la pantalla de error genérica. Además, guardarCuenta
   (lib/cuenta.ts:81-83) traga el fallo de almacenamiento sin avisar al usuario.
   FIX: crear app/app/error.tsx con qué pasó y qué hacer, y mostrar un aviso visible cuando no se pueda guardar.

### BAJA
10. lib/cuenta.ts:208. "min en total" = piezas × 5: el número no se mide, se inventa.
    FIX: guardar la duración real de cada misión, o cambiar el dato por uno verdadero ("semana 2 de 5").
11. Hoy.tsx:83-89. El chip izquierdo dice aria-label "Ajustes" con ícono de controles, pero lleva a /app/perfil, que es
    el mismo destino que la pestaña Perfil, con otro nombre y otro ícono.
    FIX: llevarlo a /app/perfil#ajustes y nombrarlo igual que la sección de destino.
12. Hoy.tsx:107 y l.167-204. La tarjeta héroe y las 3 fichas de datos parecen tocables y no hacen nada.
    FIX: la tarjeta héroe enlaza a /app/mision; la ficha de racha y la de piezas enlazan a Ruta y Mi Empresa.
13. Marco.tsx:79 (grid de 5 columnas iguales). La etiqueta "Mi Empresa" queda pegada al aro del botón central (más
    todavía a 360px), mientras que "Ruta" respira. El desbalance óptico se ve.
    FIX: etiqueta "Empresa", o columnas 1fr 1fr auto 1fr 1fr con gap.
14. 04-hoy-dia1-hecho.png: queda un hueco muerto de unos 180px entre el CTA y la barra.
    FIX: en el estado "hecho" con 1 pieza, mostrar la vista previa de la pieza de mañana (bloqueada) para llenar con valor.
15. Hoy.tsx:206-210. La línea de racha no entra en el stagger (aparece de golpe, sin entrar(n)), y su borde izquierdo
    no coincide con el del insight, que lleva ícono.
    FIX: envolverla en motion con entrar(2) y alinearla con la misma sangría del insight.
