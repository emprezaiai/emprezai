# VEREDICTO revisor-visual — Panel · Salud
Fecha: 2026-11-10 02:00
Screenshot: docs/revisiones/panel/salud-375.png
Usabilidad: 36/40
Craft: 16/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: LISTA
Top defectos: 1) [Alertas enviadas vs tarjeta "Vencidos sin aviso"] La alerta del 7 nov "Accesos que vencieron sin aviso de Hotmart" convive con la tarjeta "0 · Ninguno" sin decir que ya se resolvió → "(ya resuelto)" o "hoy: 0" junto a la alerta cuando el contador está en cero (salud/page.tsx, bloque Alertas enviadas). 2) [Errores de la app] Sigue habiendo algo más de aire al pie de la tarjeta que arriba (min-h-11 del último "Copiar el detalle") → ajuste fino de padding inferior. 3) [tarjeta "Errores (7 días)"] El 6 va en rojo aunque hoy hubo 0; con la comparación "la semana pasada: 0" está bien, pero ámbar comunicaría "a revisar" sin alarma. Ninguno bloquea.
