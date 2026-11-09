// npm run test:db — Prueba las migraciones de EMPREZAI en un Postgres en memoria (PGlite) con un "auth" mínimo de Supabase.
// Cubre la máquina de estados de la membresía (C1), la suma del gasto de IA (C2), el cupo atómico (I2)
// y los permisos de piezas (I1 + IDOR). Corre sin cuentas ni internet.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { PGlite } from '@electric-sql/pglite';

const raiz = fileURLToPath(new URL('../..', import.meta.url));
const db = new PGlite();
let fallas = 0;
const ok = (cond, txt) => {
  console.log(`${cond ? 'OK ' : 'ERR'} ${txt}`);
  if (!cond) fallas++;
};

await db.exec(`
  create role anon nologin; create role authenticated nologin; create role service_role nologin bypassrls;
  create schema auth;
  create table auth.users (id uuid primary key default gen_random_uuid(), email text);
  create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
  grant usage on schema auth to anon, authenticated, service_role;
  grant execute on function auth.uid() to anon, authenticated, service_role;
  grant usage on schema public to anon, authenticated, service_role;
`);
for (const m of ['20261014000000_inicial.sql', '20261023000000_blindaje.sql', '20261103000000_cierre_tiene_acceso.sql', '20261109000000_panel.sql', '20261109000001_panel_serie.sql', '20261109000002_panel_usuarios.sql', '20261109000003_panel_usuarios_filtros.sql', '20261109000004_panel_ia_por_dia.sql', '20261109000005_panel_salud_semana.sql', '20261109000006_webhook_log_email.sql', '20261109000007_panel_comparaciones.sql', '20261109000008_panel_usuarios_orden.sql']) {
  await db.exec(readFileSync(`${raiz}/supabase/migrations/${m}`, 'utf8'));
  console.log('migración aplicada:', m);
}
await db.exec(`grant all on all tables in schema public to service_role; grant all on all sequences in schema public to service_role;`);

const dia = 86_400_000;
const iso = (ms) => new Date(ms).toISOString();
const ahora = Date.now();
let n = 0;
async function evento({ tipo, estado, eventoEn, accesoHasta = null, finPrueba = null, soloCrear = false, email = 'carla@x.com', sub = 'SUB1' }) {
  n++;
  const r = await db.query(
    `select public.apply_hotmart_event($1,$2,'h',$3,'Carla',$4,$5,'mensual',null,$6,$7,null,null,null,'P1',null,null,'USD',null,$8,$9) as r`,
    [`ev${n}`, tipo, email, sub, estado, finPrueba, accesoHasta, eventoEn, soloCrear],
  );
  return r.rows[0].r;
}
const perfil = async () => (await db.query(`select status, access_until, trial_ends_at, last_event_at, user_id from public.profiles where email='carla@x.com'`)).rows[0];
const acceso = async () => {
  const u = (await perfil()).user_id;
  return (await db.query(`select public.tiene_acceso($1) as a`, [u])).rows[0].a;
};

// 1) Empieza la prueba gratis
let r = await evento({ tipo: 'PURCHASE_APPROVED', estado: 'trialing', eventoEn: iso(ahora - 20 * dia), finPrueba: iso(ahora - 13 * dia) });
ok(r.status === 'applied' && r.needs_access, 'prueba gratis crea el perfil');
const u = (await db.query(`insert into auth.users (email) values ('carla@x.com') returning id`)).rows[0].id;
await db.query(`update public.profiles set user_id=$1 where email='carla@x.com'`, [u]);
ok((await acceso()) === false, 'prueba que terminó hace 13 días (sin aviso de cobro) YA NO da acceso');

// 2) Primer cobro aprobado → activa con fecha de fin
r = await evento({ tipo: 'PURCHASE_APPROVED', estado: 'active', eventoEn: iso(ahora - 13 * dia), accesoHasta: iso(ahora + 20 * dia) });
ok(r.status === 'applied' && (await acceso()) === true, 'cobro aprobado → activa con acceso');

// 3) Cancela: acceso hasta el fin del período pagado
r = await evento({ tipo: 'SUBSCRIPTION_CANCELLATION', estado: 'cancelled', eventoEn: iso(ahora - 5 * dia), accesoHasta: iso(ahora + 2 * dia) });
ok((await perfil()).status === 'cancelled' && (await acceso()) === true, 'cancelada mantiene acceso hasta fin del período');

// 4) Llega "compra completa" (fin de la garantía) DESPUÉS de cancelar → no la revive
r = await evento({ tipo: 'PURCHASE_COMPLETE', estado: 'active', eventoEn: iso(ahora - 1 * dia), accesoHasta: iso(ahora + 40 * dia), soloCrear: true });
ok((await perfil()).status === 'cancelled', 'PURCHASE_COMPLETE no revive la suscripción cancelada (C1)');

// 5) Un aviso VIEJO de pago aprobado que llega tarde → no manda
r = await evento({ tipo: 'PURCHASE_APPROVED', estado: 'active', eventoEn: iso(ahora - 12 * dia), accesoHasta: iso(ahora + 60 * dia) });
ok(r.status === 'stale' && (await perfil()).status === 'cancelled', 'aviso más viejo que el último → "stale", sin cambios (C1)');

// 6) Reembolso que llega con fecha vieja → SIEMPRE quita el acceso
r = await evento({ tipo: 'PURCHASE_REFUNDED', estado: 'refunded', eventoEn: iso(ahora - 30 * dia) });
ok((await perfil()).status === 'refunded' && (await acceso()) === false, 'reembolso viejo igual quita el acceso');

// 7) Tras reembolso, un pago nuevo no resucita
r = await evento({ tipo: 'PURCHASE_APPROVED', estado: 'active', eventoEn: iso(ahora), accesoHasta: iso(ahora + 30 * dia) });
ok(r.status === 'illegal_transition', 'reembolso no se resucita');

// 8) Duplicado
const dup = await db.query(`select public.apply_hotmart_event('ev1','X','h','carla@x.com','',null,'active',null,null,null,null,null,null,null,'P1',null,null,'USD',null,null,false) as r`);
ok(dup.rows[0].r.status === 'duplicate', 'evento repetido = duplicate');

// 9) Activa sin fecha de fin = sin acceso (fail-closed)
await db.query(`insert into public.profiles (email, status, user_id) values ('sinfecha@x.com','active', null)`);
const u2 = (await db.query(`insert into auth.users (email) values ('sinfecha@x.com') returning id`)).rows[0].id;
await db.query(`update public.profiles set user_id=$1 where email='sinfecha@x.com'`, [u2]);
ok((await db.query(`select public.tiene_acceso($1) as a`, [u2])).rows[0].a === false, 'activa sin fecha de fin → sin acceso');

// 10) COMPLETE de alguien que no existía → sí crea (por si la prueba llega así)
r = await evento({ tipo: 'PURCHASE_COMPLETE', estado: 'active', eventoEn: iso(ahora), accesoHasta: iso(ahora + 30 * dia), soloCrear: true, email: 'nuevo@x.com', sub: 'SUB9' });
const nuevo = (await db.query(`select status, access_until from public.profiles where email='nuevo@x.com'`)).rows[0];
ok(r.needs_access && nuevo.status === 'active' && nuevo.access_until, 'COMPLETE de perfil nuevo lo crea con fecha de fin');

// 11) Cupo atómico
const cupos = [];
for (let i = 0; i < 4; i++) cupos.push((await db.query(`select public.tomar_cupo('k1', 2, 15) as c`)).rows[0].c);
ok(JSON.stringify(cupos) === '[true,true,false,false]', `tomar_cupo respeta el máximo: ${JSON.stringify(cupos)}`);
const largo = [];
for (let i = 0; i < 4; i++) largo.push((await db.query(`select public.tomar_cupo('k2', 10, 60, 3, 1440) as c`)).rows[0].c);
ok(JSON.stringify(largo) === '[true,true,true,false]', `tomar_cupo respeta la ventana larga: ${JSON.stringify(largo)}`);

// 12) Gasto de IA con más de 1000 filas
await db.query(`insert into public.ai_calls (kind, model, cost_usd, ok) select 'mision_opciones', 'm', 0.01, true from generate_series(1, 2500)`);
const gasto = Number((await db.query(`select public.gasto_ia_desde(now() - interval '1 day') as g`)).rows[0].g);
ok(Math.abs(gasto - 25) < 1e-6, `gasto_ia_desde suma 2500 filas = ${gasto} (C2)`);

// 13) La persona (rol authenticated) NO puede escribir piezas directo; sí leer y borrar las suyas
await db.query(`insert into public.piezas (user_id, dia, titulo, contenido, fecha) values ($1, 1, 'Frase', 'x', current_date)`, [u2]);
await db.exec(`set role authenticated`);
await db.query(`select set_config('request.jwt.claim.sub', $1, false)`, [u2]);
let bloqueado = false;
try {
  await db.query(`insert into public.piezas (user_id, dia, titulo, contenido, fecha) values ($1, 2, 'Trampa', 'x', '2020-01-01')`, [u2]);
} catch (e) {
  bloqueado = /permission denied/.test(e.message);
}
ok(bloqueado, 'authenticated no puede INSERTAR piezas (I1)');
let bloqueadoUpd = false;
try {
  await db.query(`update public.piezas set fecha='2020-01-01' where user_id=$1`, [u2]);
} catch (e) {
  bloqueadoUpd = /permission denied/.test(e.message);
}
ok(bloqueadoUpd, 'authenticated no puede EDITAR la fecha de una pieza (I1)');
const propias = (await db.query(`select count(*)::int as c from public.piezas`)).rows[0].c;
ok(propias === 1, 'authenticated lee solo sus piezas');
await db.query(`select set_config('request.jwt.claim.sub', $1, false)`, [u]);
ok((await db.query(`select count(*)::int as c from public.piezas`)).rows[0].c === 0, 'otra persona no ve piezas ajenas (IDOR)');
let rpcBloqueada = false;
try {
  await db.query(`select public.tomar_cupo('x', 1, 1)`);
} catch (e) {
  rpcBloqueada = /permission denied/.test(e.message);
}
ok(rpcBloqueada, 'authenticated no puede llamar tomar_cupo');
let gastoBloqueado = false;
try {
  await db.query(`select public.gasto_ia_desde(now())`);
} catch (e) {
  gastoBloqueado = /permission denied/.test(e.message);
}
ok(gastoBloqueado, 'authenticated no puede leer el gasto de IA');
let accesoBloqueado = false;
try {
  await db.query(`select public.tiene_acceso($1)`, [u2]);
} catch (e) {
  accesoBloqueado = /permission denied/.test(e.message);
}
ok(accesoBloqueado, 'authenticated no puede preguntar si otra cuenta tiene acceso');
await db.query(`select set_config('request.jwt.claim.sub', $1, false)`, [u2]);
await db.query(`delete from public.piezas where user_id=$1`, [u2]);
await db.exec(`reset role`);
ok((await db.query(`select count(*)::int as c from public.piezas`)).rows[0].c === 0, 'authenticated sí puede BORRAR sus piezas (derecho a borrar)');

// 14) PANEL: el historial de estados lo escribe el disparador, en orden y sin huecos
const historial = (
  await db.query(
    `select from_status, to_status from public.profile_events e join public.profiles p on p.id=e.profile_id where p.email='carla@x.com' order by e.id`,
  )
).rows.map((r) => `${r.from_status ?? '∅'}→${r.to_status}`);
ok(
  JSON.stringify(historial) === JSON.stringify(['∅→trialing', 'trialing→active', 'active→cancelled', 'cancelled→refunded']),
  `historial de estados completo: ${historial.join(' · ')}`,
);

// 15) PANEL: los resúmenes calculan con datos reales (venta con neto informado y otra sin neto)
await db.query(`update public.payment_transactions set email='carla@x.com'`);
await db.query(
  `insert into public.payment_transactions (provider, transaction_id, economic_kind, product_id, amount_minor, currency, occurred_at, raw_event_id, email, fee_minor, affiliate_minor, net_minor)
   values ('hotmart','T-NETO','sale','P1',999,'USD',now(),'evx','carla@x.com',150,0,849),
          ('hotmart','T-SIN','sale','P1',7999,'USD',now(),'evy','nuevo@x.com',null,null,null),
          ('hotmart','T-BRL','sale','P1',4990,'BRL',now(),'evz','nuevo@x.com',null,null,null)`,
);
const ventas = (await db.query(`select public.panel_ventas(now() - interval '1 day', now() + interval '1 day') as v`)).rows[0].v;
const usd = ventas.dinero.find((m) => m.moneda === 'USD');
ok(usd && usd.ventas === 2 && Number(usd.bruto_minor) === 8998 && Number(usd.neto_minor) === 849 && usd.ventas_sin_neto === 1, 'panel_ventas suma por moneda y marca las ventas sin neto informado');
ok(ventas.dinero.some((m) => m.moneda === 'BRL'), 'panel_ventas nunca mezcla monedas (BRL aparte)');
for (const f of [
  'panel_clientes()',
  'panel_serie_mensual(6)',
  'panel_uso()',
  "panel_funnel(now() - interval '30 days', now())",
  "panel_ia(now() - interval '30 days', now())",
  "panel_canales(now() - interval '30 days', now() + interval '1 day')",
  'panel_salud()',
  "panel_pruebas_sin_pago(now() - interval '30 days', now())",
  "panel_usuarios('carla', 'todos', 10, 0)",
]) {
  let bien = true;
  try {
    await db.query(`select public.${f}`);
  } catch (e) {
    bien = false;
    console.log('   ', e.message);
  }
  ok(bien, `${f.split('(')[0]} responde`);
}
const canales = (await db.query(`select public.panel_canales(now() - interval '30 days', now() + interval '1 day') as c`)).rows[0].c;
ok(Array.isArray(canales) && canales.some((c) => c.canal === 'sin código'), 'panel_canales agrupa a quien llegó sin código de seguimiento');

const lista = (await db.query("select public.panel_usuarios('carla@x', 'todos', 10, 0) as l")).rows[0].l;
ok(lista.total === 1 && lista.filas[0].email === 'carla@x.com', 'panel_usuarios busca por correo');
const ficha = (await db.query('select public.panel_ficha($1) as f', [lista.filas[0].id])).rows[0].f;
ok(ficha && ficha.historial.length === 4, 'panel_ficha trae el historial completo');
ok((await db.query("select public.panel_ficha('00000000-0000-0000-0000-000000000000') as f")).rows[0].f === null, 'panel_ficha de un id inexistente devuelve null');

await db.query("insert into public.profiles (email, status, access_until, origen_acceso) values ('regalo@x.com','active', now() + interval '30 days','manual')");
const pagandoFiltro = (await db.query("select public.panel_usuarios('', 'active', 50, 0) as l")).rows[0].l;
ok(!pagandoFiltro.filas.some((f) => f.email === 'regalo@x.com'), 'el filtro Pagando excluye el acceso regalado a mano');
const manualFiltro = (await db.query("select public.panel_usuarios('', 'manual', 50, 0) as l")).rows[0].l;
ok(manualFiltro.filas.some((f) => f.email === 'regalo@x.com'), 'el filtro Agregados a mano lo muestra');
ok((await db.query("select public.panel_usuarios('', 'fantasma', 50, 0) as l")).rows[0].l.total >= 0, 'el filtro fantasma responde');
const conteos = (await db.query("select public.panel_usuarios_conteos('') as c")).rows[0].c;
ok(conteos.manual === manualFiltro.total && conteos.active === pagandoFiltro.total, 'los conteos de los chips coinciden con la lista de cada filtro');
ok(conteos.activo + conteos.inactivo === conteos.todos, 'con acceso hoy + sin acceso hoy = todos');
const porPiezas = (await db.query("select public.panel_usuarios('', 'todos', 50, 0, 'piezas') as l")).rows[0].l.filas.map((f) => f.piezas);
ok(porPiezas.every((n, i) => i === 0 || porPiezas[i - 1] >= n), 'el orden por piezas ordena de más a menos');

// 16) PANEL: un usuario normal no lee NADA del panel (tablas ni resúmenes)
await db.exec(`set role authenticated`);
await db.query(`select set_config('request.jwt.claim.sub', $1, false)`, [u]);
for (const t of ['admins', 'profile_events', 'event_log', 'error_log', 'panel_ajustes', 'costos_fijos', 'acquisition_spend', 'admin_auditoria']) {
  let bloqueada = false;
  try {
    await db.query(`select * from public.${t} limit 1`);
  } catch (e) {
    bloqueada = /permission denied/.test(e.message);
  }
  ok(bloqueada, `authenticated no lee ${t}`);
}
let resumenBloqueado = false;
try {
  await db.query(`select public.panel_ventas(now() - interval '1 day', now())`);
} catch (e) {
  resumenBloqueado = /permission denied/.test(e.message);
}
ok(resumenBloqueado, 'authenticated no puede pedir los resúmenes del panel');
await db.exec(`reset role`);

console.log(fallas ? `\n${fallas} FALLA(S)` : '\nTODO OK');
process.exit(fallas ? 1 : 0);
