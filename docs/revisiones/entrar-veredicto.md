# VEREDICTO revisor-visual — entrar
Fecha: 2026-11-24 14:00
Screenshot: docs/revisiones/entrar-375.png
Usabilidad: 29/40
Craft: 14/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos:
1. Se perdió la instrucción de qué correo usar. Al quitar «Usa el correo con el que pagaste en Hotmart», en el estado inicial nada dice que el enlace solo llega si ese correo tiene una compra activa; esa condición solo aparece después de enviar («Si tiene una compra activa…», l.401). Quien se registró con otro correo espera un enlace que no llega. Fix: ponerlo como ayuda bajo el label, p. ej. «Tu correo de compra» o una línea «El correo con el que pagaste».
2. Subtítulo «Te enviamos un enlace directo a tu correo, sin contraseñas.» está en pasado (aún no se envió), parte en dos líneas con «contraseñas.» huérfana, y repite «sin contraseñas» con la línea del escudo. Fix: «Entra con un enlace a tu correo.» (1 línea) y en el escudo dejar solo «El enlace es de un solo uso».
3. Pie «Primera pieza gratis · 7 días de prueba · Garantía de 15 días» y salida «Prueba gratis» mezclan tres ideas de gratuidad/garantía. En blanco bold pesa más que el escudo y los Términos y compite con el botón. Además no pude verificar estos plazos contra FICHA-MERCADO; si no coinciden con lo que ofrece Hotmart, es una promesa falsa. Fix: dejar una sola promesa y bajarla a ink-2; confirmar los plazos en FICHA-MERCADO.
4. Profundidad: campo #11151C sobre #0B0D12 y fondo casi plano; solo el borde verde (que está activo por autoFocus) lo separa. Fix: 1px de luz interior en el campo y superficie elevada sutil en el formulario.
5. Alineación mixta: títulos y pie centrados; label «Tu correo», escudo y Términos a la izquierda; Términos en ~12px ink-3. Fix: alinear en un solo eje.

Mejoras verificadas: ya no dice «crea tu cuenta»; botón «Enviarme mi enlace de acceso» (el texto sin servidor «Guardar mi correo de acceso» sigue en código); sin RutaMini ni párrafo de Hotmart en el inicio; la pantalla cabe en una sola vista sin scroll; mascota 176px con flotado (se desactiva con reduced-motion); una sola salida «Prueba gratis». CTA vivo (contraste alto, 56px, tap con translateY, valida al enviar). No se puntuó la rama «enviado/código» (no está en la captura); por código conserva .boton-oro y campo bg-sunken, distintos del inicio.

Detalle usabilidad: h1:3 h2:3 h3:3 h4:3 h5:3 h6:2 h7:3 h8:3 h9:3 h10:3
Detalle craft: jerarquía:3 profundidad:2 identidad:3 movimiento:3 encaje:3
