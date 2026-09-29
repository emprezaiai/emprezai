# ESTADO — EMPRESAI
Última actualización: 2026-09-29 | Sesión actual: 0 → B2 (reporte de validación presentado)

⏸️ CHECKPOINT — Última acción completada: Constitución APROBADA (2026-09-29) + Plan Maestro presentado / Siguiente acción exacta: OK del usuario → Sesión 1 (FICHA-AVATAR, FICHA-MERCADO, FICHA-MODELO completa, precio con 40, modelo 02C, arquitectura)

## Qué es esta app (3 líneas máximo)
App web tipo Duolingo que guía a emprendedores principiantes LATAM a lanzar su negocio/producto digital con IA en 30 días, 5 min/día.
Mapa de 30 niveles (4 sprints semanales), rachas, vidas; cada misión entrega un entregable real de su negocio.
Monetización: suscripción (mensual + anual) con prueba corta. Venta por Hotmart.

## Fuente del usuario
- PDF original: `docs/proyecto/Cliente Ideal app EMPRESAI.pdf` (texto: `docs/proyecto/cliente-ideal.txt`)
- Contiene: idea, 4 sprints, precio propuesto por el usuario (US$9.99/mes, US$59.99/año, trial 3 días con Sprint 1),
  avatar "Carlos El Estancado" (32 años, empleado, dolores/deseos/objeciones en sus palabras), competencia
  (Bizplanr, Primer, Headway/Blinkist), 6 razones de compra, propuesta de valor, estrategia TikTok/Reels.
  → Es la materia prima de FICHA-AVATAR.md (Sesión 1). NO es el bloque "RESUMEN FINAL" del curso: se valida.

## Promesa central (borrador del usuario)
"Lanza tu empresa o producto digital con IA en 30 días, dedicando solo 5 minutos al día."

## Reporte de validación (B1/B2 — 2026-09-29)
- Veredicto: ✅ Viable con UN ajuste clave (IA ejecuta dentro de la app en vez de "copia y pega en ChatGPT")
- App modelo afuera: **Coursiv** (coursiv.io) — reto de IA de 28 días en micro-sesiones diarias, 800k+ usuarios
  (declarado), Trustpilot 4.5 con 100k+ reseñas, ~$19.95 primeras 4 semanas → ~$39.95 cada 4 semanas.
  Ya existe en español, pero enseña HERRAMIENTAS de IA (genérico), no te lleva a lanzar TU negocio.
  Fuentes: nibble-app.com/blog/coursiv-pricing · nexreview.com/coursiv-review · support.coursiv.io/es (consultadas 2026-09-29)
- Lo que odian de Coursiv (oportunidad): cobros de renovación sin aviso, cancelación difícil, soporte con
  respuestas automáticas (BBB + Trustpilot, 2026-09-29) → nuestro ángulo de confianza: aviso antes de cobrar + cancelar en 1 toque.
- Otros: Headway/Blinkist (consumo pasivo), Primer (sin IA), Bizplanr (PDF de un solo uso) — del PDF del usuario.
- Pago en español confirmado: Hotmart marketplace lleno de cursos/kits "emprende con IA" y "100 prompts"
  (ej. "Lanza tu negocio con IA en 7 días", "DominIA", "Emprende con IA") → la gente YA paga; el formato curso/PDF es lo que el avatar odia.
- Brecha LATAM: no se encontró app gamificada en español cuyo resultado sea "tu negocio armado" (búsquedas 2026-09-29).
- Riesgo detectado (gates 01): "prompts para copiar" = objeción #1 del propio avatar ("¿no están gratis?") + trampa
  generador del 01. Solución propuesta: la IA corre DENTRO de la app con el perfil del negocio del usuario y cada día
  suma una pieza a "Mi Empresa" (expediente acumulativo) → pasa gate IA real + retención por acumulación.
- Precio: el del usuario (9.99) queda como propuesta; se valida en Sesión 1 con 40-UNIT-ECONOMICS (ahora hay costo de IA por usuario)
  y con Coursiv como techo de referencia (~$40/4 semanas).

## Constitución del Producto (B3 — APROBADA por el usuario 2026-09-29)
- Ajuste aprobado por el usuario (2026-09-29): la IA ejecuta cada misión DENTRO de la app con el perfil del negocio; el prompt queda como extra copiable.
1. Usuario: empleado 25-40 LATAM ("Carlos El Estancado"), quiere negocio propio; usa la app en tiempos muertos (bus, almuerzo, antes de dormir) desde el celular.
2. Problema: parálisis por exceso de info + hoja en blanco frente a ChatGPT; evita otro curso caro que no termina.
3. Promesa: "Esta app ayuda a emprendedores principiantes con poco tiempo a lanzar su negocio digital en 30 días sin cursos largos ni la hoja en blanco, mediante misiones de 5 minutos donde la IA arma cada pieza de SU negocio."
4. Momento aha (<60s, antes del paywall): cuenta su idea en 3-4 toques → la IA le devuelve su primera pieza personalizada (su oferta en una frase + a quién venderle).
4b. Mecanismo: "Método Pieza a Pieza" — cada día la IA arma una pieza nueva usando TODO lo que ya armó (las piezas se encadenan). Elimina la causa del fracaso anterior (prompts sueltos/teoría que no conectan). Falsable: Coursiv/cursos/packs de prompts no pueden afirmarlo.
5. Flujos: (a) onboarding: idea → primera pieza → paywall; (b) misión diaria: mapa → lección 2 min → IA arma la pieza → guarda en "Mi Empresa" → racha; (c) "Mi Empresa": ver/editar/copiar/exportar todo lo armado.
6. NUNCA: prometer ingresos garantizados ni inventar cifras/testimonios · cobrar sin aviso previo · dificultar cancelar · usar culpa/amenaza para la racha · compartir o usar la idea de negocio del usuario para otra cosa · inventar datos de mercado en las piezas.

## Privacidad de la idea = argumento de venta (pedido del usuario 2026-09-29)
- El usuario detectó un miedo real del avatar: "¿me roban la idea?". Se suma como OBJECIÓN #5 a FICHA-AVATAR.
- Se convierte en garantía visible: "Tu idea es tuya" → solo el dueño ve sus piezas (RLS), borrar todo en 1 toque,
  proveedor de IA vía API sin uso para entrenamiento (verificar términos del proveedor elegido en Sesión 1/6),
  declarado en política de privacidad (gate de seguridad). Aparece en landing (FAQ + bloque confianza), onboarding (junto al campo de la idea) y paywall.
- Copy: NUNCA decir "nadie más la ve" en sentido absoluto: el texto se procesa en el proveedor de IA → decir "no se usa para entrenar IA ni se comparte".

## Decisiones técnicas (NO re-discutir sin pedirlo el usuario)
- (pendiente Sesión 1)

## Pendientes / ⚠️
- Ninguno aún.

## Problemas conocidos
- FICHA-MODELO.md en BORRADOR (modelo: Coursiv). Falta 2ª señal de revenue (Meta Ads Library / TrustMRR) y el plano del flujo de entrada de Coursiv; se termina en Sesión 1 (pendiente).
