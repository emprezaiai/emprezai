# VEREDICTO revisor-visual — Panel · Uso y retención
Fecha: 2026-11-10 00:00
Screenshot: docs/revisiones/panel/uso-375.png
Usabilidad: 36/40
Craft: 16/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: LISTA
Top defectos: 1) [tarjeta "Pagan y no entran"] La flecha de la tarjeta tocable aparece abajo, junto a "verlos", y no arriba a la derecha como dice Tarjeta (top-4 right-3); revisar que el detalle no la empuje (ui.tsx, Tarjeta con href). 2) [¿Vuelven?] La lectura "que 1 de cada 5 siga a la semana ya es sano" se queda corta con un 57%: decir cuánto supera la referencia ("casi 3 veces lo sano") daría la conclusión directa (uso/page.tsx línea 104). 3) [pantalla de error compartida] error.tsx usa el mismo texto para todas las secciones; aquí sí aplica "números", pero conviene el título por sección (app/admin/(panel)/error.tsx línea 21). Ninguno bloquea.
