# ESTADO — EMPRESAI
Última actualización: 2026-09-29 | Sesión actual: 1 (cliente, precio y estrategia)

⏸️ CHECKPOINT — Última acción completada (2026-10-06): landing APROBADA con "La Garantía Sin Preguntas" (37/40·18/20·19/20) / Siguiente acción exacta: OK de la dueña → Sesión 4 (/onboarding con ?plan=, primera pieza, /paywall, /login)

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

## Avatar y venta (Sesión 1 — NO cambiar sin validar)
- FICHA-AVATAR.md: COMPLETA, 17 frases VoC con fuente — aprobación del usuario: SÍ 2026-09-29
- Resumen: Carlos, 32, empleado LATAM · dolor #1 hoja en blanco frente a ChatGPT a las 7 PM · deseo #1 "hoy haz esto en 5 min" · consciencia 3 · sofisticación 4-5 → hero por identificación + mecanismo + demo, CERO promesas de ingresos
- Landing: estructura canónica de 10 secciones (19) — pendiente Sesión 3

## Estrategia de monetización (Sesión 1 — decidida por el agente 2026-09-29, informada al usuario)
- Tipo (02C): mezcla A Educación (hábito diario, rachas) + D IA generativa (costo por generación) · frecuencia DIARIA · valor: crear/ahorrar tiempo
- Modelo: 2 — onboarding-first ANÓNIMO: / → /onboarding (idea en 3-4 toques) → primera pieza generada (aha) → /paywall → checkout Hotmart → /login (magic link+OTP) → /app
  Justificación: freemium (A) regalaría IA con costo; hard paywall pierde la demo que responde la objeción "¿otro curso más?"; el modelo (Coursiv) usa quiz→paywall. Tie-breaker: nicho manda cobro, el hábito lo sostiene el loop (24).
- Trial: 7 días gratis (= Sprint 1 completo; aha inmediato pero el valor se acumula). Usuario había propuesto 3 → se sube porque 3 días no completan la semana 1 y trials más largos convierten más (RevenueCat 2026 vía 02C). ⚠️ Verificar que el "período gratuito" de Hotmart aplica a app externa (FICHA-MERCADO §4); plan B: sin trial, pieza gratis + garantía 15 días.
- Garantía: 15 días desde el primer pago (texto de la dueña 2026-10-02).
- Pricing: US$9.99/mes (el del usuario, pasa suelo 1) | US$79.99/año mostrado como $6.67/mes (usuario había propuesto 59.99 → PIERDE margen con IA; se sube)
- Cupo por plan (fórmula 02C): 40 piezas/mes = 30 misiones + 10 "rehacer" (peor caso cubierto)
- Confianza (queja #1 del modelo): aviso por email 2 días antes de cada cobro + cancelar desde la app en 1 toque.
- Afiliados (34): 50% SOLO de la primera venta (o ≤30% recurrente). NUNCA 50% recurrente: rompe el margen.
- Día 31+: al terminar la Ruta 1 (30 días) se desbloquean nuevas rutas mensuales (ej. "Ruta 2: tus primeros 10 clientes", "Ruta 3: tu contenido que vende"). Lanzamiento con Ruta 1 construida + Ruta 2 escrita antes de que el primer usuario llegue al día 30.

## Economía unitaria (40 — ESTIMACIÓN, revisar con datos reales de ai_calls)
- Costo IA por pieza: ~US$0.03 (Sonnet 5.5 $2/$10 por M tokens; ~4k entrada con caché + ~2.5k salida). Preview del onboarding: igual, con límite por IP.
- Supuestos: Hotmart 9.9% + ~US$0.45 fijo (R$2.49 desde 21-09-2026, tactus.com.br) · impuestos/retenciones ~10% (varía por país) · infra $0.40 · email $0.05
- MENSUAL $9.99 directo: neto ~$7.55 · COGS peor caso (40 piezas) $1.65 → margen ~78% ✓ · IA 12% del precio ✓ (<20%)
- MENSUAL por afiliado 50% solo 1ª venta: margen recurrente intacto (1ª venta = CAC) ✓ · con 30% recurrente: neto ~$4.55 → margen peor caso ~64% (aceptable solo si mezcla afiliados <50%)
- ANUAL $79.99: neto ~$5.30/mes · COGS típico (~35 piezas) $1.50 → ~72% ✓ · peor caso ~69% (límite)
- ANUAL $59.99 (propuesta original): neto ~$3.97/mes → ~62% típico / 43% peor ✗ → descartado
- IA regalada en trial: ~14 piezas ≈ $0.42 por usuario en prueba → suma al CAC
- SUELO 3: a $9.99 no se paga Meta Ads → canal orgánico (TikTok) + afiliados. Revisar precio antes de la 1ª campaña pagada.

## Gamificación y retención (loop — detallar en Sesión 4/5 con 24/56)
- Loop: Gatillo (email/notificación a la hora que Carlos elige: "Día 5: hoy armamos tu nombre de marca") → Acción (misión de 5 min) → Recompensa (pieza nueva en "Mi Empresa" + racha + avanza el mapa) → Inversión (la pieza alimenta la de mañana)
- Test "si borro tu historial, ¿la app de mañana es idéntica?": NO — cada pieza usa las anteriores ✓
- Primera semana D1-D7 = Sprint 1 (idea y validación) dentro del trial; ritual diario M0 = misión del día
- "Vidas" estilo Duolingo: EN REVISIÓN — penalizar errores no encaja (no hay respuestas "incorrectas" al armar un negocio); decidir en 24. Racha con "congelador" en vez de castigo (regla NUNCA culpa).

## Dirección de Arte (Sesión 2 — CERRADA 2026-09-30, NO cambiar sin justificación)
- FICHA-ARTE.md: existe y APROBADA 2026-09-30 · Resumen: fondo #0F0D16 · dorado #FFC23D · verde #3DDC97 · Bricolage Grotesque + Instrument Sans · radio 18-22px / píldoras
- Personalidad: Enérgico + Juguetón + Cálido · REGISTRO ANTI-REPETICIÓN: esa paleta y ese par tipográfico quedan vetados para el próximo proyecto
- Ruta de diseño: MIXTA a pedido del usuario (2026-09-29): A = réplica fiel de su captura (referencia-usuario-1.jpg, Pinterest, generada por IA) + B y C = propuestas propias.
- Extracción de la referencia: docs/revisiones/referencia-usuario-1-extraccion.md
- Comparativa: direcciones-abc.html (copia en docs/revisiones/) · A Cristal Azul (Plus Jakarta Sans) · B Mapa de Juego (Nunito, violeta+ámbar) · C Tablero de Fundador (Bricolage+Instrument Sans, oscuro+dorado)
- Fuentes verificadas cargadas en navegador (4/4). Screenshots 375: docs/revisiones/direccion-*-375.jpg
- Elección del usuario (2026-09-30, 3ª vuelta): pantalla HOY = composición de la A (réplica de su captura) + pantalla RUTA = mapa de la B, AMBAS con colores/tonos de la C (bg #0F0D16, superficie #1A1622, texto2 #998FA8, dorado #FFC23D, verde #3DDC97, Bricolage Grotesque + Instrument Sans). Capturas: docs/revisiones/eleccion-hoy-A-colores-C-375.jpg + eleccion-ruta-B-colores-C-375.jpg — APROBADA 2026-09-30. Descartadas: fusión A+B+C "Tablero Dorado" (no le gustó), combinación C+B.

## Secuencia maestra de construcción (NO saltar)
- Estado: Landing CONSTRUIDA y APROBADA · Onboarding/Paywall/Login/App interna: pendientes · Ruta: / → /onboarding → /paywall → /login → /app
- Landing (app/page.tsx, kit components/landing): protagonista = promesa "Hoy, en 5 minutos, la IA arma tu primera oferta" + demo del mecanismo · CTA primario "Armar mi primera pieza gratis" → /onboarding (planes → /onboarding?plan=anual|mensual)
- Copy marcado y trazado: docs/copy/landing.md (10 variantes de titular puntuadas) · Legales: /privacidad /terminos /reembolsos /aviso-ia (datos del responsable PENDIENTES en lib/legal.ts)
- Eventos: lib/eventos.ts (landing_vista con atribución UTM/sck y marca ?qa=1), en cola local hasta conectar analítica

## Puertas de etapa
- Landing: APROBADA 2026-10-06 — usabilidad 37/40 · craft 18/20 · copy 19/20 · titular ✅ · relieve no plano/no repetitivo ✅ · escaneabilidad 8/10 ✅ · evidencia: docs/revisiones/landing-375.png (+ parte-0…7, 375x7830) · veredicto docs/revisiones/landing-veredicto.md · aprobación de la dueña: PENDIENTE

## Decisiones técnicas (NO re-discutir sin pedirlo el usuario)
- Framework: Next.js App Router (landing con SEO + rutas de servidor para la IA) — 2026-09-29
- Stack: React + TS + Tailwind v4 + shadcn/ui + Lucide + motion (51 pineado) · Supabase · Vercel · Resend · Hotmart
- Idioma UI: solo español (LATAM neutro, tuteo)
- Auth: magic link + código de 6 dígitos por email (Hotmart-first, 26); passkey ofrecida tras la primera victoria; sin contraseñas. Rate limit en endpoints de auth.
- Estado anónimo del onboarding en localStorage versionado ({v, respuestas, primeraPieza}) → migra a la cuenta al primer login (26).
- IA: Claude vía servidor (BFF), nunca en el navegador. AI_MODEL=claude-sonnet-5-5 (generación de piezas), modelo en env var. Salida estructurada. Prompt caching del sistema. max_tokens limitado. Tabla ai_calls + kill-switch de gasto (30/31). Texto síncrono con streaming.
- Proyecto: Next.js 16.3.7 + React 19.2.8 + Tailwind v4 + motion + lucide + zod + @playwright/test (capturas: scripts/captura-375.mjs, captura-segmentos.mjs, captura-tour.mjs) — scaffold 2026-09-30 en la raíz, junto al SO (tsconfig/eslint excluyen docs/ y plantillas-codigo/)
- Kit de landing copiado a components/landing y tematizado SOLO por tokens.css (+ hooks opcionales con fallback: --frame, --inverse-*, --radius-chip, --cta-relieve, --hero-mesh-*). Desvíos del kit, todos por veredicto del revisor: EnlaceCta compartido (prefetch + carga recuperable), microcopyCompra en Oferta, escala tipográfica 40/30/18/16/13/12, hero con stagger y h1/CTA visibles en SSR, dots 44px + teclado, truncado que no cuenta signos como palabras, next/image en carrusel, Link en header.
- Proveedor IA y privacidad: API de Anthropic — por defecto no entrena con datos de la API (verificar términos vigentes antes de publicar la política de privacidad, Sesión 6).
- Modelo de datos (25, RLS en TODAS por (select auth.uid()) + índice en user_id):
  profiles(id=auth.uid, nombre, hora_recordatorio, plan, estado_suscripcion) · business_profile(user_id, idea, publico, respuestas jsonb) ·
  pieces(id, user_id, route_id, day, tipo, contenido jsonb, version, created_at) · user_progress(user_id, route_id, dia_actual, racha, racha_max, congeladores, ultima_mision_at) ·
  ai_calls(id, user_id, tokens_in, tokens_out, costo, created_at) · subscriptions(user_id, hotmart_subscriber_code, status, current_period_end)
  Contenido de rutas/misiones: estático versionado en el código (no en DB) al inicio.
- Borrar mis datos: endpoint que borra business_profile + pieces + progress + cuenta (promesa "Tu idea es tuya").

## Pendientes / ⚠️
- (hecho 2026-10-06) Nombre de la garantía elegido por la dueña: "La Garantía Sin Preguntas". ⚠️ Verificar en Hotmart que la devolución sea realmente "1 clic" antes de publicar (si no, "Devolución con 1 solicitud").
- Landing, retoques no bloqueantes (hacer en la re-revisión de Sesión 5 con capturas reales + prueba propia "La fundadora va en el día X de 30"): condición de garantía en 3 líneas ("15 días desde tu primer pago. ¿No es para ti? Pides la devolución en 1 clic y te devolvemos todo.") · franja del hero con etiquetas alineadas (las 3 en 1 o 2 líneas).
- 🔴 BLOQUEA PUBLICAR: compra de prueba + reembolso real en Hotmart (Sesión 6) para confirmar "Sin preguntas" y "Devolución en 1 clic"; si no es literal → "Devolución con 1 solicitud" o renombrar a "La Garantía de 15 Días".
- (hecho 2026-10-02) Garantía definida por la dueña: 15 días desde el PRIMER PAGO, devolución del 100% en 1 clic vía Hotmart, sin preguntas — aplicada en landing, microcopy y /reembolsos. ⚠️ Configurar Hotmart con garantía de 15 días (Sesión 6).
- ⚠️ Garantía: la condición ("si la IA no te entrega tu oferta…") contradice el sello "Sin preguntas" — decidir incondicional vs condicional y alinear sellos + /reembolsos (gate 61).
- (hecho 2026-09-30) Responsable legal: persona natural (sin empresa registrada), Toronto, Canadá → PIPEDA + leyes LATAM en privacidad. ⚠️ El email de soporte es PERSONAL y queda público en el footer y los legales: reemplazar por soporte@<dominio> al comprar el dominio (Sesión 6). Recomendado confirmar impuestos con un contador en Canadá.
- ⚠️ Configurar Hotmart con garantía de 15 días ANTES de publicar la promesa (landing/legales) — Sesión 6.
- ⚠️ Claim "no se usa para entrenar IA" (FAQ 5, privacidad, aviso-ia): confirmar términos vigentes del proveedor y anotar fuente antes de publicar (gate 61).
- Landing (no bloqueante, revisor): sacar el <span role="status"> de EnlaceCta fuera del Link (hermano) — hacerlo junto con la próxima re-revisión de la landing (al montar capturas reales en Sesión 5) para no caducar el veredicto sin necesidad.
- Paywall debe LEER ?plan=anual|mensual y preseleccionarlo (Sesión 4).
- "Entrar" del header: se quitó hasta que exista /login — volver a poner loginHref en Hero (Sesión 4).
- Carrusel y demo del hero = vistas previas del diseño → reemplazar por capturas REALES con datos semilla (Sesión 5) y sumar el recorrido del fundador como prueba social.
- (hecho) FICHA-AVATAR aprobada; precio informado sin objeción (2026-09-29).
- Verificar en Sesión 6: período gratuito Hotmart para app externa · checkout real (medios de pago) · términos de datos del proveedor de IA.

## Problemas conocidos
- Garantía: decidida INCONDICIONAL (15 días, "o no es para ti") — coherente con sellos y /reembolsos (2026-10-02).
- FICHA-MODELO.md en BORRADOR (modelo: Coursiv). Falta 2ª señal de revenue (Meta Ads Library / TrustMRR) y el plano del flujo de entrada de Coursiv (Meta Ads Library y Mobbin requieren navegador; se intentará en Sesión 2 con el navegador integrado). No bloquea diseño/arquitectura.
- audit-conversion.sh: se excluyó `plantillas-codigo/` en scripts/lib-conversion.mjs (mezclaba tokens de plantilla con los del proyecto → contrastes falsos). Hallazgos restantes son FALSOS POSITIVOS sobre código del kit (cuenta clases/comentarios como copy; no detecta hairline/radial armados con strings concatenados; "animate" como voseo; ✓ en un comentario). Verificado visualmente y por el revisor. Antes: escaneaba `plantillas-codigo/` (plantillas de referencia del SO, no son la app) → sus hallazgos ahí son ruido. Al construir, juzgar solo los hallazgos en los archivos de la app.
