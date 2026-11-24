# VEREDICTO revisor-visual — entrar
Fecha: 2026-11-24 13:00
Screenshot: docs/revisiones/entrar-375.png
Usabilidad: 28/40
Craft: 14/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos:
1. Ruta contradictoria para quien NO compró (Acceso.tsx l.724-730): la pantalla pide el correo de Hotmart, pero más abajo dice «Tu primera pieza es gratis y no pide tarjeta» y «¿Aún no armas tu pieza 1? Empieza gratis aquí». Hay dos mensajes distintos para dos públicos y no queda claro cuál soy yo. Fix: poner junto al botón una sola línea «¿Aún no compraste? Prueba gratis» y quitar el aviso suelto de «gratis».
2. Subtítulo «Te enviamos un enlace a tu correo para entrar.» está en pasado, como si ya se hubiera enviado, y no dice que solo funciona si hay compra activa (eso solo se aclara después de enviar). Fix: «Te enviamos un enlace al correo de tu compra para entrar.» y bajar la línea «correo con el que pagaste en Hotmart» al label o a un texto de ayuda pegado al campo.
3. Variante de paleta visible: .boton-portada (#FACC15) y el campo de correo no coinciden con .boton-oro (#FFC23D) ni con el campo de código (bg-sunken) de la misma pantalla en el estado «enviado». La excepción ya está anotada en FICHA-ARTE (2026-11-24) y es aceptable, pero tras enviar, el usuario ve dos amarillos distintos. Fix: usar .boton-portada y el campo portada también en el estado «enviado».
4. Carga de texto: sigue habiendo 5 bloques de texto antes del bloque «Lo que te espera adentro» (subtítulo, línea Hotmart, privacidad, términos y la tarjeta RutaMini). La tarjeta RutaMini compite con el CTA bajo el pliegue. Fix: retirar RutaMini de esta pantalla o dejar solo su título.
5. Profundidad: el campo #11151C sobre #0B0D12 y el fondo casi plano apenas se separan. Fix: dar al campo un borde interior de luz 1px y a la zona del formulario una superficie elevada sutil.

Corregido desde la revisión anterior (verificado en screenshot y código): ya no dice «crea tu cuenta»; el botón dice «Enviarme mi enlace de acceso» (l.682, con la rama sin servidor aún «Guardar mi correo de acceso»); la mascota baja a 176px con flotado (animación se desactiva con reduced-motion) y el campo y el botón entran en el pliegue; el H1 usa token; excepción de paleta anotada en la ficha.

Pendiente menor: alineación mixta (títulos centrados; label, escudo y Términos a la izquierda); Términos en ~12px ink-3.
CTA vivo: cumple los 4 anclajes (contraste alto, 56px, tap definido, no disabled por defecto).

Detalle usabilidad: h1:3 h2:3 h3:3 h4:2 h5:3 h6:3 h7:3 h8:3 h9:3 h10:2
Detalle craft: jerarquía:3 profundidad:2 identidad:3 movimiento:3 encaje:3
