// node tests/db/panel-fixture.mjs <salida.json>
// Genera los datos que ve el panel en las CAPTURAS del revisor: corre las MISMAS migraciones y las
// MISMAS funciones panel_* sobre un Postgres en memoria (PGlite) con 6 meses de un negocio de
// prueba. Nunca toca la base real. El panel lo lee solo con PANEL_CAPTURA=<salida.json> en local.
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { PGlite } from '@electric-sql/pglite';

const [salida = 'panel-captura.json'] = process.argv.slice(2);
const raiz = fileURLToPath(new URL('../..', import.meta.url));
const db = new PGlite();

await db.exec(`
  create role anon nologin; create role authenticated nologin; create role service_role nologin bypassrls;
  create schema auth;
  create table auth.users (id uuid primary key default gen_random_uuid(), email text);
  create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
  grant usage on schema auth to anon, authenticated, service_role;
  grant execute on function auth.uid() to anon, authenticated, service_role;
  grant usage on schema public to anon, authenticated, service_role;
`);
for (const m of ['20261014000000_inicial.sql', '20261023000000_blindaje.sql', '20261103000000_cierre_tiene_acceso.sql', '20261109000000_panel.sql', '20261109000001_panel_serie.sql', '20261109000002_panel_usuarios.sql', '20261109000003_panel_usuarios_filtros.sql']) {
  await db.exec(readFileSync(`${raiz}/supabase/migrations/${m}`, 'utf8'));
}
// El historial se siembra con fechas del pasado: el disparador (que usa now()) se apaga para sembrar.
await db.exec(`alter table public.profiles disable trigger profiles_historial_estado`);

// Azar con semilla: las capturas salen iguales cada vez.
let semilla = 20261109;
const azar = () => ((semilla = (semilla * 1103515245 + 12345) % 2147483648) / 2147483648);
const elegir = (pares) => {
  const r = azar();
  let t = 0;
  for (const [valor, peso] of pares) if (r < (t += peso)) return valor;
  return pares[pares.length - 1][0];
};

const DIA = 86_400_000;
const ahora = Date.now();
const iso = (ms) => new Date(ms).toISOString();
const fecha = (ms) => iso(ms).slice(0, 10);
const NOMBRES = ['Carlos', 'Daniela', 'Andrés', 'Valentina', 'Jorge', 'Camila', 'Luis', 'Mariana', 'Diego', 'Sofía', 'Pablo', 'Lucía', 'Felipe', 'Paula', 'Ricardo', 'Natalia'];
const APELLIDOS = ['Gómez', 'Rojas', 'Pérez', 'Castro', 'Herrera', 'Vargas', 'Morales', 'Ríos', 'Navarro', 'Ortiz'];

const nuevosPorMes = [6, 9, 11, 13, 14, 11]; // de hace 5 meses al mes actual
const inicioMesActual = Date.UTC(new Date().getUTCFullYear(), new Date().getUTCMonth(), 1);
let n = 0;
const perfiles = [];
for (let i = 0; i < 6; i++) {
  const mesInicio = Date.UTC(new Date().getUTCFullYear(), new Date().getUTCMonth() - (5 - i), 1);
  const mesFin = i === 5 ? ahora : Date.UTC(new Date().getUTCFullYear(), new Date().getUTCMonth() - (4 - i), 1);
  for (let k = 0; k < nuevosPorMes[i]; k++) {
    n++;
    const alta = mesInicio + azar() * (mesFin - mesInicio - DIA);
    const nombre = `${NOMBRES[n % NOMBRES.length]} ${APELLIDOS[(n * 7) % APELLIDOS.length]}`;
    const email = `${nombre.split(' ')[0].toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')}.${n}@correo.com`;
    perfiles.push({
      n,
      nombre,
      email,
      alta,
      source: elegir([['tiktok', 0.4], ['instagram', 0.25], ['afiliado-ana', 0.15], [null, 0.2]]),
      plan: elegir([['mensual', 0.65], ['anual', 0.35]]),
      convierte: azar() < 0.72,
    });
  }
}

const transacciones = [];
const eventos = [];
let tx = 0;
function venta(p, cuando, monto, primera) {
  tx++;
  const informado = azar() < 0.9;
  const fee = Math.round(monto * 0.099 + 45);
  const afiliado = primera && p.source === 'afiliado-ana' ? Math.round(monto * 0.5) : 0;
  transacciones.push({ id: `T${tx}`, kind: 'sale', monto, cuando, email: p.email, fee: informado ? fee : null, afiliado: informado ? afiliado : null, neto: informado ? monto - fee - afiliado : null });
}

for (const p of perfiles) {
  let estado = 'trialing';
  eventos.push({ p, de: null, a: 'trialing', at: p.alta });
  const finPrueba = p.alta + 7 * DIA;
  p.trialEnds = finPrueba;
  p.accessUntil = null;
  p.firstPaid = null;
  if (finPrueba < ahora) {
    if (p.convierte) {
      estado = 'active';
      p.firstPaid = finPrueba;
      eventos.push({ p, de: 'trialing', a: 'active', at: finPrueba });
      const precio = p.plan === 'mensual' ? 999 : 7999;
      venta(p, finPrueba, precio, true);
      let cobro = finPrueba;
      let sigue = true;
      while (sigue) {
        const siguiente = cobro + (p.plan === 'mensual' ? 30 : 365) * DIA;
        const r = azar();
        if (p.plan === 'mensual' && r < 0.07) {
          const cuando = cobro + azar() * 25 * DIA;
          if (cuando < ahora) {
            estado = 'cancelled';
            eventos.push({ p, de: 'active', a: 'cancelled', at: cuando });
            p.accessUntil = siguiente;
          }
          sigue = false;
        } else if (p.plan === 'mensual' && r < 0.1 && siguiente < ahora) {
          eventos.push({ p, de: 'active', a: 'past_due', at: siguiente });
          if (siguiente + 5 * DIA < ahora) {
            estado = 'expired';
            eventos.push({ p, de: 'past_due', a: 'expired', at: siguiente + 5 * DIA });
          } else estado = 'past_due';
          sigue = false;
        } else if (siguiente < ahora) {
          cobro = siguiente;
          venta(p, cobro, precio, false);
        } else {
          p.accessUntil = siguiente + 3 * DIA;
          sigue = false;
        }
      }
      if (estado === 'active' && !p.accessUntil) p.accessUntil = cobro + 33 * DIA;
    } else {
      estado = 'expired';
      eventos.push({ p, de: 'trialing', a: 'expired', at: finPrueba + 2 * DIA });
    }
  }
  p.estado = estado;
}
// Dos reembolsos dentro de la garantía.
for (const p of perfiles.filter((x) => x.estado === 'active').slice(3, 5)) {
  const ultima = transacciones.filter((t) => t.email === p.email).at(-1);
  transacciones.push({ id: ultima.id, kind: 'refund', monto: ultima.monto, cuando: ultima.cuando + 4 * DIA, email: p.email, fee: null, afiliado: null, neto: null });
  eventos.push({ p, de: p.estado, a: 'refunded', at: ultima.cuando + 4 * DIA });
  p.estado = 'refunded';
}

for (const p of perfiles) {
  const u = (await db.query(`insert into auth.users (email) values ($1) returning id`, [p.email])).rows[0].id;
  p.userId = u;
  const r = await db.query(
    `insert into public.profiles (email, name, status, plan, user_id, trial_ends_at, first_paid_at, access_until, grace_ends_at, completed, source, created_at, momento, idea)
     values ($1,$2,$3,$4,$5,$6,$7,$8,$9,true,$10,$11,$12,$13) returning id`,
    [p.email, p.nombre, p.estado, p.firstPaid ? p.plan : null, u, iso(p.trialEnds), p.firstPaid ? iso(p.firstPaid) : null, p.accessUntil ? iso(p.accessUntil) : null,
     p.estado === 'past_due' ? iso(ahora + 3 * DIA) : null, p.source, iso(p.alta), elegir([['noche', 0.6], ['manana', 0.25], ['mediodia', 0.15]]), 'Negocio de prueba'],
  );
  p.id = r.rows[0].id;
}
// Una persona agregada a mano por la dueña (no cuenta como venta).
await db.query(`insert into auth.users (email) values ('regalo.mentora@correo.com')`);
await db.query(`insert into public.profiles (email, name, status, access_until, completed, origen_acceso, created_at) values ('regalo.mentora@correo.com','Mentora invitada','active',$1,true,'manual',$2)`, [iso(ahora + 300 * DIA), iso(ahora - 3 * DIA)]);

for (const e of eventos) {
  await db.query(`insert into public.profile_events (profile_id, from_status, to_status, at) values ($1,$2,$3,$4)`, [e.p.id, e.de, e.a, iso(e.at)]);
}
for (const t of transacciones) {
  await db.query(
    `insert into public.payment_transactions (provider, transaction_id, economic_kind, product_id, amount_minor, currency, occurred_at, raw_event_id, email, fee_minor, affiliate_minor, net_minor)
     values ('hotmart',$1,$2,'P1',$3,'USD',$4,$5,$6,$7,$8,$9)`,
    [t.id, t.kind, t.monto, iso(t.cuando), `ev-${t.id}-${t.kind}`, t.email, t.fee, t.afiliado, t.neto],
  );
}

// Piezas: la actividad cae con los días (hábito real), y la gente con acceso sigue armando.
for (const p of perfiles) {
  let dia = 1;
  const vence = p.estado === 'active' || p.estado === 'trialing' || p.estado === 'cancelled' || p.estado === 'past_due' ? ahora : p.accessUntil ?? p.trialEnds + 2 * DIA;
  for (let t = p.alta; t < Math.min(vence, ahora) && dia <= 30; t += DIA) {
    const constancia = p.convierte ? 0.78 : 0.45;
    if (azar() < constancia - Math.min(0.35, (t - p.alta) / DIA / 90)) {
      await db.query(`insert into public.piezas (user_id, dia, titulo, contenido, fecha, creada_en, con_ia) values ($1,$2,'Pieza','x',$3,$4,true)`, [p.userId, dia, fecha(t), iso(t + 20 * 3600_000)]);
      await db.query(`insert into public.ai_calls (user_id, kind, model, input_tokens, output_tokens, cost_usd, ok, created_at) values ($1,'mision_armar','claude-sonnet-5-5',900,600,$2,true,$3)`, [p.userId, 0.0042 + azar() * 0.002, iso(t + 20 * 3600_000)]);
      if (azar() < 0.6) await db.query(`insert into public.ai_calls (user_id, kind, model, input_tokens, output_tokens, cost_usd, ok, created_at) values ($1,'mision_opciones','claude-haiku-5-5',500,300,0.0003,true,$2)`, [p.userId, iso(t + 20 * 3600_000)]);
      dia++;
    }
  }
}
// Camino de venta (anónimo) y pieza 1 sin cuenta, en los dos últimos meses.
async function camino(desde, hasta, personas) {
  for (let i = 0; i < personas; i++) {
    const anon = `anon-${desde}-${i}`;
    const t = desde + azar() * (hasta - desde);
    const pasos = ['landing_vista'];
    if (azar() < 0.36) pasos.push('onboarding_iniciado');
    if (pasos.length === 2 && azar() < 0.68) pasos.push('resultado_visto');
    if (pasos.length === 3 && azar() < 0.9) pasos.push('paywall_visto');
    if (pasos.length === 4 && azar() < 0.26) pasos.push('checkout_iniciado');
    for (const [j, nombre] of pasos.entries()) {
      await db.query(`insert into public.event_log (nombre, anon_id, created_at) values ($1,$2,$3)`, [nombre, anon, iso(t + j * 60_000)]);
    }
    if (pasos.includes('resultado_visto')) {
      await db.query(`insert into public.ai_calls (ip_hash, kind, model, input_tokens, output_tokens, cost_usd, ok, created_at) values ('h','primera_pieza','claude-sonnet-5-5',114,140,0.0036,true,$1)`, [iso(t)]);
    }
  }
}
await camino(Date.UTC(new Date().getUTCFullYear(), new Date().getUTCMonth() - 1, 1), inicioMesActual, 520);
await camino(inicioMesActual, ahora, 410);
await db.query(`insert into public.event_log (nombre, anon_id, qa) values ('landing_vista','qa-1',true)`);

// Salud: avisos de Hotmart recibidos (uno falló) y algunos errores de pantalla.
for (let i = 0; i < 40; i++) await db.query(`insert into public.webhook_log (event_id, type, result, received_at) values ($1,'PURCHASE_APPROVED','applied',$2)`, [`w${i}`, iso(ahora - azar() * 6 * DIA)]);
await db.query(`insert into public.webhook_log (event_id, type, result, received_at) values ('w-dup','PURCHASE_APPROVED','duplicate',$1)`, [iso(ahora - 2 * DIA)]);
await db.query(`insert into public.webhook_log (event_id, type, result, received_at) values ('w-err','PURCHASE_APPROVED','error',$1)`, [iso(ahora - 3 * DIA)]);
for (const [mensaje, ruta, veces] of [['TypeError: No se pudo leer la pieza guardada', '/app/empresa', 4], ['ia/mision: IaNoDisponible', 'ia/mision', 2]]) {
  for (let i = 0; i < veces; i++) {
    await db.query(`insert into public.error_log (origen, mensaje, ruta, user_id, created_at) values ($1,$2,$3,$4,$5)`, [ruta.startsWith('/') ? 'cliente' : 'servidor', mensaje, ruta, perfiles[i].userId, iso(ahora - azar() * 5 * DIA)]);
  }
}
await db.query(`insert into public.alertas (clave, created_at) values ('accesos-vencidos-${fecha(ahora - 2 * DIA)}', $1)`, [iso(ahora - 2 * DIA)]);

// Ajustes de la dueña: costos fijos y gasto en anuncios por canal.
await db.exec(`
  insert into public.costos_fijos (nombre, monto_usd) values ('Vercel Pro', 20), ('Supabase Pro', 25), ('Dominio', 1.25);
`);
const desdeMes = fecha(inicioMesActual);
const desdeAnt = fecha(Date.UTC(new Date().getUTCFullYear(), new Date().getUTCMonth() - 1, 1));
const hastaAnt = fecha(inicioMesActual - DIA);
await db.query(`insert into public.acquisition_spend (canal, monto_usd, desde, hasta, nota) values
  ('tiktok', 140, $1, $2, 'Anuncios de noviembre'), ('instagram', 160, $1, $2, 'Prueba de anuncios'),
  ('tiktok', 120, $3, $4, null), ('instagram', 70, $3, $4, null)`, [desdeMes, fecha(ahora), desdeAnt, hastaAnt]);

// ── Las salidas, con las MISMAS funciones que usa el panel ──
const r = async (sql, params = []) => (await db.query(`select ${sql} as v`, params)).rows[0].v;
const mes = [iso(inicioMesActual), iso(Date.UTC(new Date().getUTCFullYear(), new Date().getUTCMonth() + 1, 1))];
const ant = [iso(Date.UTC(new Date().getUTCFullYear(), new Date().getUTCMonth() - 1, 1)), iso(inicioMesActual)];
// Los mismos días del mes anterior (lo que compara el inicio del panel).
const antParcial = [ant[0], iso(Math.min(Date.UTC(new Date().getUTCFullYear(), new Date().getUTCMonth() - 1, new Date().getUTCDate() + 1), inicioMesActual))];
const ajustes = {
  impuestosPct: Number((await db.query(`select valor from public.panel_ajustes where clave='impuestos_pct'`)).rows[0].valor),
  costos: (await db.query(`select id, nombre, monto_usd::float as monto_usd, activo from public.costos_fijos order by id`)).rows,
  gastos: (await db.query(`select id, canal, monto_usd::float as monto_usd, desde::text, hasta::text, nota from public.acquisition_spend order by desde desc`)).rows,
};
const datos = {
  ventas_mes: await r(`public.panel_ventas($1, $2)`, mes),
  ventas_mes_anterior: await r(`public.panel_ventas($1, $2)`, antParcial),
  ventas_mes_anterior_completo: await r(`public.panel_ventas($1, $2)`, ant),
  panel_clientes: await r(`public.panel_clientes()`),
  panel_serie_mensual: await r(`public.panel_serie_mensual(6)`),
  ia_mes: await r(`public.panel_ia($1, $2)`, mes),
  ia_mes_anterior: await r(`public.panel_ia($1, $2)`, antParcial),
  panel_salud: await r(`public.panel_salud()`),
  canales_mes: await r(`public.panel_canales($1, $2)`, mes),
  canales_mes_anterior: await r(`public.panel_canales($1, $2)`, ant),
  panel_uso: await r(`public.panel_uso()`),
  funnel_mes: await r(`public.panel_funnel($1, $2)`, mes),
  funnel_mes_anterior: await r(`public.panel_funnel($1, $2)`, ant),
  ajustes,
  pruebas_sin_pago_mes: await r(`public.panel_pruebas_sin_pago($1, $2)`, mes),
  usuarios: await r(`public.panel_usuarios('', 'todos', 25, 0)`),
  ultimos_cobros: (await db.query(`select economic_kind as tipo, amount_minor::int as monto_minor, currency as moneda, occurred_at as en, email from public.payment_transactions order by occurred_at desc limit 12`)).rows,
};
// La ficha de captura: alguien que paga, con historial y pagos.
const pagando = (await db.query(`select id from public.profiles where status='active' and plan='mensual' and origen_acceso='hotmart' order by created_at limit 1`)).rows[0].id;
datos.ficha = await r(`public.panel_ficha($1)`, [pagando]);
datos.ficha_id = pagando;
writeFileSync(salida, JSON.stringify(datos, null, 1));
console.log(`listo: ${perfiles.length} clientes de prueba, ${transacciones.length} movimientos → ${salida}`);
