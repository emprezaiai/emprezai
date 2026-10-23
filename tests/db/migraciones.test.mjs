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
for (const m of ['20261014000000_inicial.sql', '20261023000000_blindaje.sql']) {
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
await db.query(`select set_config('request.jwt.claim.sub', $1, false)`, [u2]);
await db.query(`delete from public.piezas where user_id=$1`, [u2]);
await db.exec(`reset role`);
ok((await db.query(`select count(*)::int as c from public.piezas`)).rows[0].c === 0, 'authenticated sí puede BORRAR sus piezas (derecho a borrar)');

console.log(fallas ? `\n${fallas} FALLA(S)` : '\nTODO OK');
process.exit(fallas ? 1 : 0);
