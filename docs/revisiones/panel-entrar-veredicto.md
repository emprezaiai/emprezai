# VEREDICTO revisor-visual — Panel · Entrar al panel
Fecha: 2026-11-09 20:00
Screenshot: docs/revisiones/panel/entrar-375.png
Usabilidad: 37/40
Craft: 16/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: LISTA
Top defectos: 1) [evidencia] Solo está capturado el paso 1; el paso 2 ("Revisa tu correo", guepardo, ayuda de Spam) y el estado de error (borde rojo + ícono) están verificados solo en código → capturar docs/revisiones/panel/entrar-codigo-375.png y entrar-error-375.png para dejar evidencia visual. 2) [paso 2, ayuda de Spam] "¿No llegó? Revisa las carpetas de Spam o Promociones" no dice el remitente a buscar → añadir "llega de [EMAIL_FROM]" (EntrarPanel.tsx línea 212). 3) [paso 1 a 375px] El 40% inferior queda vacío; aceptable porque deja lugar al teclado, pero el sello de confianza podría bajar al pie (mt-auto) para equilibrar sin mover el formulario.
