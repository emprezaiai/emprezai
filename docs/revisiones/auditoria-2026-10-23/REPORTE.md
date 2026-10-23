# Auditoría profunda pre-venta — EMPREZAI (2026-10-23)

Modo: --exhaustivo · Solo diagnóstico, sin cambios de código · Puntaje actual: **6/10**

## Cómo se hizo
- **Dónde se probó:** app en el servidor de desarrollo (arranca sin errores) y en la versión de producción (`npm run build` ✓, incluye la revisión de tipos ✓; `eslint` ✓).
- **Qué se recorrió a 375 px con capturas reales:**
  - Página de ventas y legales.
  - 404 y Entrar (con sus 3 estados).
  - Planes (directo y desde el recorrido).
  - Recorrido de inicio completo (13 pasos).
  - App por dentro: 45 capturas de Hoy, Ruta, Mi Empresa, Misión, celebración y Perfil.
- **Evidencia:** `docs/revisiones/auditoria-2026-10-23/`, `docs/revisiones/recorrido/` y `docs/revisiones/app/`.
- **Revisor independiente:** puntuó las 4 pantallas de venta y activación. Hoy tiene veredicto vigente de la ronda 13.
- **Código leído:**
  - La base de datos (migración).
  - El aviso de pago de Hotmart, el acceso por correo y la tarea diaria.
  - La IA, la sincronización y las páginas legales.
- **`npm audit`:** 1 vulnerabilidad crítica.

## Puntaje por pantalla (revisor-visual, contexto limpio)
| Pantalla | Usabilidad /40 | Acabado /20 | Copy /20 | Veredicto |
|---|---|---|---|---|
| Página de ventas | 34 | 17 | 17 | NO LISTA (+ bloqueo de integridad) |
| Recorrido de inicio | 34 | 16 | 18 | NO LISTA |
| Planes | 36 | 16 | 18 | LISTA (sin margen) |
| Entrar | 29 | 15 | — | NO LISTA |
| Hoy (principal) | 36 | 17 | — | LISTA (13ª, 2026-10-15) |
| Ruta / Mi Empresa / Misión / Celebración | 36 / 36 / 36 / 37 | 16 / 16 / 16 / 17 | — | LISTAS (7–15 oct; re-revisar con servicios conectados) |

## Las 6 dimensiones
| Dimensión | Estado | Lo más importante |
|---|---|---|
| 1 · Producto, retención y monetización | ⚠️ | Producto y precio bien pensados. Pero el recordatorio diario (el gatillo del hábito) no existe y hay promesas sin cumplir. No hay plan de tráfico ni de rescate de cancelaciones. |
| 2 · Diseño y verificación visual | ⚠️ | Identidad propia y fuerte. 3 de las 4 pantallas de venta quedaron bajo el mínimo. |
| 3 · UX y emoción | ✅/⚠️ | Estados completos en la app. Entrar tiene callejones sin salida y el recorrido se congela con la IA real. |
| 4 · Backend y datos | ❌ | El acceso puede quedar abierto para siempre. El tope de gasto de IA se rompe con el uso. No hay pruebas automáticas ni copias de seguridad probadas. |
| 5 · Seguridad | ⚠️ | Buena base: claves en el servidor, protección de datos por persona, aviso de pago verificado y anti-enumeración. Pero Next.js tiene una vulnerabilidad crítica, faltan cabeceras de seguridad y el navegador puede escribir piezas directo en la base. |
| 6 · IA | ⚠️ | Bien armada: servidor intermedio, salida con formato fijo, límites y respaldo. El tope de gasto falla, el modelo por defecto es el caro y no hay evaluación de calidad. |

## Hallazgos priorizados

### 🔴 Crítico (bloquean vender)
| # | Hallazgo | Dónde | Mejora propuesta |
|---|---|---|---|
| C1 | **El acceso puede quedar abierto para siempre.** Hotmart manda "compra completa" cuando vence la garantía (día 15). Ese aviso vuelve "activa" una suscripción ya cancelada, y "activa" no tiene fecha de fin. Además, "prueba gratis" y "activa" nunca vencen solas si se pierde el aviso de cobro o de cancelación. | `lib/servidor/hotmart.ts` (estadoPorEvento), `supabase/migrations/…_inicial.sql` (apply_hotmart_event, tiene_acceso), `lib/membresia.ts` | "Compra completa" solo se anota en el libro de pagos y no cambia el estado. Se ignoran avisos más viejos que el último aplicado. Prueba y activa llevan fecha de fin (próximo cobro + gracia). Revisión semanal contra Hotmart. |
| C2 | **El tope de gasto de IA deja de funcionar con el uso.** Suma el gasto trayendo filas, y la base devuelve máximo 1000 por consulta. Pasadas ~1000 llamadas en el mes, el tope cuenta de menos y no frena. | `lib/servidor/ia.ts` (gastoDesde) | Sumar dentro de la base con una función que devuelve el total (sin límite de filas). |
| C3 | **Next.js 16.3.7 tiene una vulnerabilidad crítica** (ejecución remota en el optimizador de imágenes, envenenamiento de caché, SSRF). | `package.json` | Subir a 16.4.3, que es un parche, y re-verificar todo. |
| C4 | **Promesas que la app todavía no cumple** (regla 61). (a) "A esa hora te recordaremos tu misión": no existe el correo diario. (b) "Cancelas en 1 toque": no hay botón de suscripción en la app. (c) "Nuevas rutas cada mes": no existe la Ruta 2. (d) "La IA arma": falta conectar la IA. (e) "Devolución en 1 clic / Sin preguntas" y "15 días desde tu primer pago": falta verificarlas en Hotmart. | `lib/onboarding.ts:131`, `app/page.tsx`, `components/paywall/Paywall.tsx`, `components/interna/Perfil.tsx`, cron | Correo diario a la hora elegida (en la tarea programada). Botón "Gestionar mi suscripción" hacia Hotmart. Ruta 2 escrita. Compra de prueba con reembolso. Lo que no se pueda cumplir, se quita del texto. |
| C5 | **Nada está conectado de punta a punta:** GitHub, base de datos, IA, publicación, correos y Hotmart. Falta probar con cuentas reales el código del correo, el aviso de prueba gratis y el aviso de pago. | — | Seguir el orden de conexión ya acordado y hacer una compra de prueba completa. |

### 🟠 Importante
| # | Hallazgo | Dónde | Mejora propuesta |
|---|---|---|---|
| I1 | El navegador puede escribir piezas directo en la base con la clave pública. Así salta las reglas del servidor: la fecha, para que la racha no se reescriba, y la marca "hecha con IA". | migración: grants de `piezas` | Que solo el servidor escriba, después de validar sesión y acceso. La persona solo lee. |
| I2 | Los límites de intentos (código de acceso, IA sin cuenta) cuentan y después anotan en dos pasos. Muchas peticiones al mismo tiempo pasan el límite. | `lib/servidor/limites.ts`, `dentroDelLimiteIA` | Contar y anotar en un solo paso dentro de la base. |
| I3 | Faltan las cabeceras de seguridad (CSP, bloqueo de marcos, nosniff, referrer, permisos) y la página anuncia "x-powered-by: Next.js". | `next.config.ts` | Agregar `headers()` y `poweredByHeader: false`. |
| I4 | El aviso de Hotmart se acepta aunque no traiga el producto. La contraseña de Hotmart (hottok) sirve para todos tus productos. | `app/api/webhooks/hotmart/route.ts` | Exigir el producto y que coincida. |
| I5 | **Entrar 29/40.** (a) Dice "te enviamos el enlace" aunque ese correo no tenga compra, y quien pagó con otro correo espera para siempre. (b) El aviso "sin acceso" no tiene salida. (c) Un error del servidor se muestra como "revisa tu conexión". (d) El soporte es un Gmail que parece mal escrito ("emprezaiai"). | `components/acceso/Acceso.tsx`, `lib/servidor/accesos.ts`, `lib/legal.ts` | Correo de "no encontramos tu compra" solo a ese buzón. Aviso con salida para contactar y reactivar. Separar el error del servidor del de conexión. soporte@tudominio. |
| I6 | **Página de ventas 34/40.** (a) La oferta no coincide con la pantalla de planes: "MEJOR PRECIO / 4 meses gratis" frente a "Mejor valor · ahorras $39.89". (b) El plan mensual tiene 3 beneficios. (c) Hay tres desencajes viejos. (d) Conviven dos materiales de ficha. (e) El título tiene 12 palabras y no nombra el método. | `app/page.tsx`, `components/landing/*` | Misma insignia y ahorro en los dos lados. 4 beneficios. Fichas iguales en toda la página. Título más corto con el método. |
| I7 | **Recorrido 34/40.** (a) Con la IA real, "Armando tu pieza" llega al 100% y se queda congelado hasta 20 s, sin salida. (b) La frase repite palabras ("redes… por redes"). (c) Hay dos versiones de "Escribe la tuya". (d) Queda espacio vacío al pie. (e) Promete 2 min en un lugar y 5 en otro. | `components/onboarding/PasoArmando.tsx`, `lib/onboarding.ts` | Anillo en meseta hasta que responda la IA, corte a 8 s y botón "Volver". Filtrar palabras repetidas. Campo propio único. Unificar el tiempo. |
| I8 | **Perfil para clientes reales.** (a) Sigue diciendo "Vista previa: el pago… se conectan en la próxima etapa". (b) Dice "solo tú la ves", que es absoluto y va contra tu propia regla de privacidad. (c) La política de privacidad promete "Borrar mi cuenta", pero el botón borra piezas y respuestas y deja el correo, el nombre y la cuenta. | `components/interna/Perfil.tsx`, `app/privacidad/page.tsx`, `app/api/cuenta/route.ts` | Textos reales según el modo. "No se usa para entrenar IA ni se comparte". Borrado completo de la cuenta o el texto alineado. |
| I9 | **Costo de la IA.** El modelo por defecto es el más caro (Opus, $4/$20), y las cuentas de margen se hicieron con Sonnet ($2/$10). Con 40 piezas al mes, el plan anual ($6.67/mes) puede pasar del 20% del precio. Además se permiten 4000 tokens de salida. | `lib/servidor/ia.ts`, `.env.example` | Sonnet por defecto (y uno más barato para las 3 opciones), salida ~1200, y medir el costo real en las primeras ventas. |
| I10 | No hay medición real. Los eventos quedan en la memoria del navegador, así que no se verá dónde se cae la gente (página → recorrido → planes → pago → primer día). El evento de pago se anota también en la vista previa. | `lib/eventos.ts` | Conectar la herramienta de medición y un panel simple de ventas y activación (36/21/60). |
| I11 | No hay ninguna prueba automática: ni del aviso de pago, ni de los estados de la suscripción, ni de que una persona no pueda ver lo de otra, ni del camino completo. | — | Pruebas automáticas de esas 4 cosas antes de vender. |
| I12 | No hay plan para conseguir clientes ni para retener ingresos: contenido, afiliados, rescate de pagos fallidos, recuperar a quien cancela. La ficha de la app modelo sigue en borrador. | — (34/35/58) | Usar /adquisicion y /retener-ingresos después de conectar los pagos. |
| I13 | No hay evaluación de la calidad de lo que escribe la IA (ejemplos fijos + juez) ni registro del tiempo de respuesta. | `lib/servidor/ia*.ts` | 20 casos de prueba por tipo de pieza, puntuados antes de publicar. |
| I14 | **Planes.** (a) No avisa que Hotmart pide la tarjeta para los 7 días gratis (la sorpresa que más odian en las reseñas). (b) Falta el sello "Tu idea es tuya". (c) Al entrar directo dice "29 días" aunque no hizo el día 1. | `components/paywall/Paywall.tsx` | Línea "Hotmart te pide tu tarjeta; hoy no se cobra nada". Sello de privacidad. Textos según haya pieza o no. |
| I15 | Copias de seguridad: el plan gratis de la base de datos no permite volver a cualquier momento, y nunca se probó restaurar. | — | Exportación diaria automática o plan pago, y un ensayo de restauración. |

### 🟢 Pulido
| # | Hallazgo | Dónde | Mejora propuesta |
|---|---|---|---|
| P1 | La página 404 usa el título de la página de ventas. | `app/not-found.tsx` | Título propio. |
| P2 | Sin protección de error en la raíz: si falla la página de ventas o el recorrido, puede salir la pantalla blanca de Next. | `app/` | `global-error.tsx` y `error.tsx` con salida. |
| P3 | Hoy: los números de las fichas pesan casi como el título de la misión, y "días de racha" queda más arriba que las otras dos etiquetas. | `components/interna/Hoy.tsx` | Un escalón menos y etiquetas en la misma línea. |
| P4 | Planes: tarjetas con aire distinto (pt-6 / pt-4), una línea de 13 px y sin el rayo dorado de la marca. | `Paywall.tsx` | Ajustar. |
| P5 | Página de ventas: el brillo del hero está al 26% (la ficha dice 16%), los dolores quedan con un halo fijo (la ficha dice sin halo) y el guepardo no aparece. | `tokens.css`, `FichaViva.tsx` | Ajustar a la ficha y llevar el guepardo a la página y a la pieza 1. |
| P6 | Pedir el enlace responde más rápido si el correo no existe, y eso revela por el tiempo si existe. | `/api/acceso/enviar` | Tiempo de respuesta parejo. |
| P7 | Las rutas de la IA y del acceso no revisan de qué sitio viene la petición, y la IA sin cuenta no tiene filtro anti-robots. | `app/api/*` | Revisar el origen y agregar protección anti-robots en la IA sin cuenta. |
| P8 | Aviso de pago: la ventana de 7 días rechaza reintentos de Hotmart más viejos. Hotmart lo sigue intentando; se registra. | webhook | Anotarlo en el manual de la dueña. |

## Las 3 mejoras de mayor impacto para llegar a 10/10
1. **Blindar el dinero:** C1 + C2 + C3 + I1 + I2 + I4. Que nadie se quede con acceso sin pagar, que la IA nunca gaste de más y que la base no se pueda tocar desde el navegador.
2. **Conectar los servicios y cumplir cada promesa:** C4 + C5 + I8 + I9. IA real, recordatorio diario, botón de suscripción, Ruta 2 y compra de prueba completa en Hotmart.
3. **Subir las 3 pantallas de venta que no pasan:** I5 + I6 + I7 + I14. Entrar, página de ventas y recorrido, y que la página y los planes digan lo mismo.
