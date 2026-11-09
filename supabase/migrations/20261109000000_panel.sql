-- EMPREZAI — panel de administración de la dueña (21-BACKOFFICE · 36 · 40 · 31).
-- Solo agrega: tablas nuevas (todas con RLS y SIN políticas: únicamente el servidor con la clave
-- secreta las lee o escribe), columnas nuevas, un disparador de historial y funciones de resumen
-- que suman DENTRO de la base (sin el tope de filas por consulta). Nada de esto lo puede leer un
-- usuario normal, ni con la clave pública.

-- ───────────────── Quién es admin (verificado en el servidor en cada petición) ─────────────────
create table public.admins (
  email      text primary key check (email = lower(email) and char_length(email) <= 254),
  created_at timestamptz not null default now()
);

-- ───────────────── Datos que faltaban para medir de verdad ─────────────────
-- De dónde vino el cliente (sck del enlace de Hotmart) y si el acceso lo dio Hotmart o la dueña.
alter table public.profiles
  add column if not exists source text check (char_length(source) <= 60),
  add column if not exists origen_acceso text not null default 'hotmart' check (origen_acceso in ('hotmart', 'manual'));

-- Lo que Hotmart informa en cada venta: comisión de la plataforma, la del afiliado y lo que le
-- queda a la productora. Más el correo, para unir la venta con su cliente y su canal.
alter table public.payment_transactions
  add column if not exists email text check (email = lower(email) and char_length(email) <= 254),
  add column if not exists fee_minor bigint check (fee_minor >= 0),
  add column if not exists affiliate_minor bigint check (affiliate_minor >= 0),
  add column if not exists net_minor bigint;
create index if not exists payment_transactions_occurred_idx on public.payment_transactions (occurred_at desc);
create index if not exists payment_transactions_email_idx on public.payment_transactions (email);
create index if not exists profiles_source_idx on public.profiles (source);

-- Historial de estados de cada cliente: base del churn voluntario/involuntario y de la conversión
-- prueba→pago. Lo escribe un disparador, así ningún camino (webhook, cron, panel) se lo salta.
create table public.profile_events (
  id          bigserial primary key,
  profile_id  uuid not null references public.profiles (id) on delete cascade,
  from_status text,
  to_status   text not null,
  at          timestamptz not null default now()
);
create index profile_events_perfil_idx on public.profile_events (profile_id, at desc);
create index profile_events_estado_idx on public.profile_events (to_status, at desc);

create or replace function public.registrar_cambio_estado()
returns trigger language plpgsql security definer set search_path = ''
as $$
begin
  if tg_op = 'INSERT' or new.status is distinct from old.status then
    insert into public.profile_events (profile_id, from_status, to_status)
    values (new.id, case when tg_op = 'UPDATE' then old.status end, new.status);
  end if;
  return new;
end;
$$;
revoke execute on function public.registrar_cambio_estado() from public, anon, authenticated;
create trigger profiles_historial_estado
  after insert or update of status on public.profiles
  for each row execute function public.registrar_cambio_estado();

-- Eventos del camino de venta y de uso (36): antes vivían solo en el celular y se perdían.
create table public.event_log (
  id          bigserial primary key,
  nombre      text not null check (char_length(nombre) between 1 and 60),
  anon_id     text check (char_length(anon_id) <= 120),
  user_id     uuid references auth.users (id) on delete set null,
  propiedades jsonb not null default '{}'::jsonb check (pg_column_size(propiedades) <= 2000),
  qa          boolean not null default false,
  created_at  timestamptz not null default now()
);
create index event_log_nombre_idx on public.event_log (nombre, created_at desc);
create index event_log_anon_idx on public.event_log (anon_id, created_at);
create index event_log_creado_idx on public.event_log (created_at desc);

-- Errores de la app (pantallas y servidor), sin Sentry por ahora.
create table public.error_log (
  id         bigserial primary key,
  origen     text not null check (origen in ('cliente', 'servidor')),
  mensaje    text not null check (char_length(mensaje) between 1 and 300),
  ruta       text check (char_length(ruta) <= 200),
  user_id    uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now()
);
create index error_log_creado_idx on public.error_log (created_at desc);

-- Lo que la dueña anota en Ajustes (estimaciones marcadas como tales en el panel).
create table public.panel_ajustes (
  clave          text primary key check (clave in ('impuestos_pct')),
  valor          numeric not null check (valor >= 0 and valor <= 60),
  actualizado_en timestamptz not null default now()
);
insert into public.panel_ajustes (clave, valor) values ('impuestos_pct', 10) on conflict do nothing;

create table public.costos_fijos (
  id         bigserial primary key,
  nombre     text not null check (char_length(nombre) between 1 and 60),
  monto_usd  numeric(10, 2) not null check (monto_usd >= 0),
  activo     boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.acquisition_spend (
  id         bigserial primary key,
  canal      text not null check (char_length(canal) between 1 and 60),
  monto_usd  numeric(12, 2) not null check (monto_usd >= 0),
  desde      date not null,
  hasta      date not null,
  nota       text check (char_length(nota) <= 200),
  created_at timestamptz not null default now(),
  check (hasta >= desde)
);

-- Registro de cada acción de la dueña en el panel (quién, qué, cuándo).
create table public.admin_auditoria (
  id          bigserial primary key,
  admin_email text not null,
  accion      text not null check (char_length(accion) <= 60),
  detalle     jsonb not null default '{}'::jsonb check (pg_column_size(detalle) <= 4000),
  created_at  timestamptz not null default now()
);
create index admin_auditoria_creado_idx on public.admin_auditoria (created_at desc);

alter table public.admins enable row level security;
alter table public.profile_events enable row level security;
alter table public.event_log enable row level security;
alter table public.error_log enable row level security;
alter table public.panel_ajustes enable row level security;
alter table public.costos_fijos enable row level security;
alter table public.acquisition_spend enable row level security;
alter table public.admin_auditoria enable row level security;
revoke all on public.admins, public.profile_events, public.event_log, public.error_log, public.panel_ajustes,
  public.costos_fijos, public.acquisition_spend, public.admin_auditoria from anon, authenticated;

-- ───────────────── Resúmenes del panel (suman dentro de la base) ─────────────────

-- VENTAS en un período: dinero por moneda (nunca se suman monedas distintas) + movimientos de clientes.
create or replace function public.panel_ventas(p_desde timestamptz, p_hasta timestamptz)
returns jsonb language sql stable security definer set search_path = ''
as $$
  select jsonb_build_object(
    'dinero', coalesce((
      select jsonb_agg(m order by m->>'moneda') from (
        select jsonb_build_object(
          'moneda', currency,
          'ventas', count(*) filter (where economic_kind = 'sale'),
          'bruto_minor', coalesce(sum(amount_minor) filter (where economic_kind = 'sale'), 0),
          'comision_minor', coalesce(sum(fee_minor) filter (where economic_kind = 'sale'), 0),
          'afiliados_minor', coalesce(sum(affiliate_minor) filter (where economic_kind = 'sale'), 0),
          'neto_minor', coalesce(sum(net_minor) filter (where economic_kind = 'sale'), 0),
          'ventas_sin_neto', count(*) filter (where economic_kind = 'sale' and net_minor is null),
          'reembolsos', count(*) filter (where economic_kind = 'refund'),
          'reembolsos_minor', coalesce(sum(amount_minor) filter (where economic_kind = 'refund'), 0),
          'contracargos', count(*) filter (where economic_kind = 'chargeback'),
          'contracargos_minor', coalesce(sum(amount_minor) filter (where economic_kind = 'chargeback'), 0)
        ) as m
        from public.payment_transactions
        where occurred_at >= p_desde and occurred_at < p_hasta
        group by currency
      ) t
    ), '[]'::jsonb),
    'pruebas_iniciadas', (select count(*) from public.profile_events e join public.profiles p on p.id = e.profile_id
                          where e.to_status = 'trialing' and e.at >= p_desde and e.at < p_hasta and p.origen_acceso = 'hotmart'),
    'pruebas_a_pago', (select count(*) from public.profile_events e join public.profiles p on p.id = e.profile_id
                       where e.from_status = 'trialing' and e.to_status = 'active' and e.at >= p_desde and e.at < p_hasta and p.origen_acceso = 'hotmart'),
    'compras_directas', (select count(*) from public.profile_events e join public.profiles p on p.id = e.profile_id
                         where e.from_status is null and e.to_status = 'active' and e.at >= p_desde and e.at < p_hasta and p.origen_acceso = 'hotmart'),
    'cancelaciones_voluntarias', (select count(*) from public.profile_events where to_status = 'cancelled' and at >= p_desde and at < p_hasta),
    'cobros_fallidos', (select count(*) from public.profile_events where to_status = 'past_due' and at >= p_desde and at < p_hasta),
    'perdidos_por_pago', (select count(*) from public.profile_events where to_status = 'expired' and from_status = 'past_due' and at >= p_desde and at < p_hasta),
    'reembolsados', (select count(*) from public.profile_events where to_status in ('refunded', 'chargeback') and at >= p_desde and at < p_hasta),
    'pagando_al_inicio', (select count(distinct e.profile_id) from public.profile_events e
                          where e.at < p_desde and e.to_status = 'active'
                            and not exists (select 1 from public.profile_events x where x.profile_id = e.profile_id and x.at < p_desde and x.at > e.at))
  );
$$;

-- CLIENTES HOY: cuántos hay en cada estado y plan (con acceso vigente según la misma regla de la app).
create or replace function public.panel_clientes()
returns jsonb language sql stable security definer set search_path = ''
as $$
  select jsonb_build_object(
    'por_estado', coalesce((select jsonb_object_agg(status, n) from (select status, count(*) n from public.profiles group by status) t), '{}'::jsonb),
    'activos_mensual', (select count(*) from public.profiles where status in ('active', 'cancelled') and plan = 'mensual' and origen_acceso = 'hotmart' and access_until > now()),
    'activos_anual', (select count(*) from public.profiles where status in ('active', 'cancelled') and plan = 'anual' and origen_acceso = 'hotmart' and access_until > now()),
    'activos_sin_plan', (select count(*) from public.profiles where status in ('active', 'cancelled') and plan is null and origen_acceso = 'hotmart' and access_until > now()),
    'en_prueba', (select count(*) from public.profiles where status = 'trialing' and trial_ends_at + interval '2 days' > now()),
    'manuales', (select count(*) from public.profiles where origen_acceso = 'manual' and access_until > now()),
    'total', (select count(*) from public.profiles),
    'con_cuenta', (select count(*) from public.profiles where user_id is not null)
  );
$$;

-- Ingresos y costo de IA por mes (para el gráfico de 6 meses).
create or replace function public.panel_serie_mensual(p_meses integer)
returns jsonb language sql stable security definer set search_path = ''
as $$
  with meses as (
    select generate_series(date_trunc('month', now()) - make_interval(months => p_meses - 1), date_trunc('month', now()), interval '1 month') as mes
  )
  select coalesce(jsonb_agg(jsonb_build_object(
    'mes', to_char(m.mes, 'YYYY-MM'),
    'dinero', coalesce((
      select jsonb_agg(jsonb_build_object('moneda', currency, 'bruto_minor', bruto, 'neto_minor', neto, 'ventas_sin_neto', sin_neto, 'reembolsos_minor', reemb))
      from (
        select currency,
               coalesce(sum(amount_minor) filter (where economic_kind = 'sale'), 0) bruto,
               coalesce(sum(net_minor) filter (where economic_kind = 'sale'), 0) neto,
               count(*) filter (where economic_kind = 'sale' and net_minor is null) sin_neto,
               coalesce(sum(amount_minor) filter (where economic_kind in ('refund', 'chargeback')), 0) reemb
        from public.payment_transactions
        where occurred_at >= m.mes and occurred_at < m.mes + interval '1 month'
        group by currency
      ) t), '[]'::jsonb),
    'ia_usd', (select coalesce(sum(cost_usd), 0) from public.ai_calls where created_at >= m.mes and created_at < m.mes + interval '1 month')
  ) order by m.mes), '[]'::jsonb)
  from meses m;
$$;

-- USO: activos, activación, retención D1/D7/D30 (por días con pieza), dónde se quedan y fantasmas.
create or replace function public.panel_uso()
returns jsonb language sql stable security definer set search_path = ''
as $$
  with actividad as (
    select distinct user_id, fecha from public.piezas
  ),
  inicio as (
    select user_id, min(fecha) as d0 from actividad group by user_id
  ),
  ret as (
    select
      count(*) filter (where i.d0 <= current_date - 1) as base_d1,
      count(*) filter (where i.d0 <= current_date - 1 and exists (select 1 from actividad a where a.user_id = i.user_id and a.fecha = i.d0 + 1)) as d1,
      count(*) filter (where i.d0 <= current_date - 7) as base_d7,
      count(*) filter (where i.d0 <= current_date - 7 and exists (select 1 from actividad a where a.user_id = i.user_id and a.fecha = i.d0 + 7)) as d7,
      count(*) filter (where i.d0 <= current_date - 30) as base_d30,
      count(*) filter (where i.d0 <= current_date - 30 and exists (select 1 from actividad a where a.user_id = i.user_id and a.fecha = i.d0 + 30)) as d30
    from inicio i
  )
  select jsonb_build_object(
    'activos_hoy', (select count(distinct user_id) from actividad where fecha = current_date),
    'activos_7', (select count(distinct user_id) from actividad where fecha > current_date - 7),
    'activos_30', (select count(distinct user_id) from actividad where fecha > current_date - 30),
    'con_piezas', (select count(*) from inicio),
    'activados', (select count(distinct p.user_id) from public.piezas p join inicio i on i.user_id = p.user_id
                  where p.dia >= 2 and p.fecha <= i.d0 + 7),
    'base_activacion', (select count(*) from inicio where d0 <= current_date - 7)
                       + (select count(distinct p.user_id) from public.piezas p join inicio i on i.user_id = p.user_id
                          where i.d0 > current_date - 7 and p.dia >= 2),
    'retencion', (select jsonb_build_object('base_d1', base_d1, 'd1', d1, 'base_d7', base_d7, 'd7', d7, 'base_d30', base_d30, 'd30', d30) from ret),
    'piezas_por_dia', coalesce((
      select jsonb_agg(jsonb_build_object('fecha', d::date, 'piezas', (select count(*) from public.piezas where fecha = d::date)) order by d)
      from generate_series(current_date - 29, current_date, interval '1 day') d), '[]'::jsonb),
    'dia_maximo', coalesce((
      select jsonb_object_agg(dia_max, n) from (
        select dia_max, count(*) n from (select user_id, max(dia) dia_max from public.piezas group by user_id) x group by dia_max
      ) t), '{}'::jsonb),
    'fantasmas', (select count(*) from public.profiles pr
                  where pr.status = 'active' and pr.access_until > now() and pr.user_id is not null
                    and pr.first_paid_at < now() - interval '14 days'
                    and not exists (select 1 from public.piezas pz where pz.user_id = pr.user_id and pz.creada_en > now() - interval '14 days'))
  );
$$;

-- CAMINO DE VENTA: personas distintas (id anónimo) en cada paso, sin las sesiones de prueba.
create or replace function public.panel_funnel(p_desde timestamptz, p_hasta timestamptz)
returns jsonb language sql stable security definer set search_path = ''
as $$
  select jsonb_build_object(
    'pasos', coalesce((
      select jsonb_object_agg(nombre, n) from (
        select nombre, count(distinct coalesce(anon_id, user_id::text)) n
        from public.event_log
        where not qa and created_at >= p_desde and created_at < p_hasta
        group by nombre
      ) t), '{}'::jsonb),
    'pruebas_o_compras', (select count(*) from public.profile_events e join public.profiles p on p.id = e.profile_id
                          where e.from_status is null and e.to_status in ('trialing', 'active') and p.origen_acceso = 'hotmart'
                            and e.at >= p_desde and e.at < p_hasta),
    'sin_eventos', not exists (select 1 from public.event_log where not qa)
  );
$$;

-- IA: costo real por función, por usuario (los que más gastan) y fallos.
create or replace function public.panel_ia(p_desde timestamptz, p_hasta timestamptz)
returns jsonb language sql stable security definer set search_path = ''
as $$
  select jsonb_build_object(
    'total_usd', (select coalesce(sum(cost_usd), 0) from public.ai_calls where created_at >= p_desde and created_at < p_hasta),
    'llamadas', (select count(*) from public.ai_calls where created_at >= p_desde and created_at < p_hasta),
    'fallos', (select count(*) from public.ai_calls where not ok and created_at >= p_desde and created_at < p_hasta),
    'hoy_usd', (select coalesce(sum(cost_usd), 0) from public.ai_calls where created_at >= date_trunc('day', now())),
    'por_funcion', coalesce((
      select jsonb_agg(jsonb_build_object('tipo', kind, 'usd', usd, 'llamadas', n, 'fallos', f) order by usd desc) from (
        select kind, sum(cost_usd) usd, count(*) n, count(*) filter (where not ok) f
        from public.ai_calls where created_at >= p_desde and created_at < p_hasta group by kind
      ) t), '[]'::jsonb),
    'usuarios_con_ia', (select count(distinct user_id) from public.ai_calls where user_id is not null and created_at >= p_desde and created_at < p_hasta),
    'top_usuarios', coalesce((
      select jsonb_agg(jsonb_build_object('email', coalesce(pr.email, 'cuenta sin perfil'), 'usd', t.usd, 'llamadas', t.n) order by t.usd desc) from (
        select user_id, sum(cost_usd) usd, count(*) n
        from public.ai_calls where user_id is not null and created_at >= p_desde and created_at < p_hasta
        group by user_id order by sum(cost_usd) desc limit 5
      ) t left join public.profiles pr on pr.user_id = t.user_id), '[]'::jsonb),
    'anonima_usd', (select coalesce(sum(cost_usd), 0) from public.ai_calls where user_id is null and created_at >= p_desde and created_at < p_hasta)
  );
$$;

-- CANALES: clientes, dinero neto (o bruto si Hotmart no informó el neto) y gasto por canal.
create or replace function public.panel_canales(p_desde timestamptz, p_hasta timestamptz)
returns jsonb language sql stable security definer set search_path = ''
as $$
  with clientes as (
    select coalesce(nullif(p.source, ''), 'sin código') as canal, p.email, p.status, p.origen_acceso
    from public.profiles p
    where p.origen_acceso = 'hotmart'
      and exists (select 1 from public.profile_events e where e.profile_id = p.id and e.from_status is null and e.at >= p_desde and e.at < p_hasta)
  ),
  dinero as (
    select coalesce(nullif(pr.source, ''), 'sin código') as canal, t.currency,
           sum(coalesce(t.net_minor, t.amount_minor)) filter (where t.economic_kind = 'sale') as neto,
           sum(t.amount_minor) filter (where t.economic_kind in ('refund', 'chargeback')) as devuelto
    from public.payment_transactions t
    join public.profiles pr on pr.email = t.email
    where t.occurred_at >= p_desde and t.occurred_at < p_hasta
    group by 1, 2
  ),
  gasto as (
    select canal, sum(monto_usd * greatest(0, (least(hasta, (p_hasta - interval '1 day')::date) - greatest(desde, p_desde::date) + 1))::numeric
                                / (hasta - desde + 1)) as usd
    from public.acquisition_spend
    where desde < p_hasta::date and hasta >= p_desde::date
    group by canal
  ),
  canales as (
    select canal from clientes union select canal from dinero union select canal from gasto
  )
  select coalesce(jsonb_agg(jsonb_build_object(
    'canal', c.canal,
    'clientes', (select count(*) from clientes x where x.canal = c.canal),
    'siguen', (select count(*) from clientes x where x.canal = c.canal and x.status in ('trialing', 'active')),
    'dinero', coalesce((select jsonb_agg(jsonb_build_object('moneda', d.currency, 'neto_minor', coalesce(d.neto, 0), 'devuelto_minor', coalesce(d.devuelto, 0)))
                        from dinero d where d.canal = c.canal), '[]'::jsonb),
    'gasto_usd', coalesce((select g.usd from gasto g where g.canal = c.canal), 0)
  ) order by c.canal), '[]'::jsonb)
  from canales c;
$$;

-- SALUD: avisos de Hotmart, errores agrupados y accesos que vencieron sin aviso.
create or replace function public.panel_salud()
returns jsonb language sql stable security definer set search_path = ''
as $$
  select jsonb_build_object(
    'webhook_ultimo', (select max(received_at) from public.webhook_log where result in ('applied', 'duplicate', 'ignored')),
    'webhook_7d', coalesce((select jsonb_object_agg(result, n) from (
        select result, count(*) n from public.webhook_log where received_at > now() - interval '7 days' group by result) t), '{}'::jsonb),
    'webhook_errores_24h', (select count(*) from public.webhook_log where result in ('error', 'unauthorized') and received_at > now() - interval '24 hours'),
    'errores_7d', coalesce((select jsonb_agg(jsonb_build_object('mensaje', mensaje, 'ruta', ruta, 'origen', origen, 'veces', n, 'personas', u, 'ultima', ult) order by n desc) from (
        select mensaje, ruta, origen, count(*) n, count(distinct user_id) u, max(created_at) ult
        from public.error_log where created_at > now() - interval '7 days'
        group by mensaje, ruta, origen order by count(*) desc limit 10) t), '[]'::jsonb),
    'errores_hoy', (select count(*) from public.error_log where created_at > date_trunc('day', now())),
    'vencidos_sin_aviso', (select count(*) from public.profiles
                           where origen_acceso = 'hotmart' and status = 'active' and access_until is not null and access_until < now()),
    'pagaron_sin_acceso', (select count(*) from public.profiles
                           where status in ('trialing', 'active') and completed = false and created_at < now() - interval '1 hour'),
    'alertas', coalesce((select jsonb_agg(jsonb_build_object('clave', clave, 'en', created_at) order by created_at desc) from (
        select clave, created_at from public.alertas order by created_at desc limit 10) t), '[]'::jsonb)
  );
$$;

revoke execute on function public.panel_ventas(timestamptz, timestamptz) from public, anon, authenticated;
revoke execute on function public.panel_clientes() from public, anon, authenticated;
revoke execute on function public.panel_serie_mensual(integer) from public, anon, authenticated;
revoke execute on function public.panel_uso() from public, anon, authenticated;
revoke execute on function public.panel_funnel(timestamptz, timestamptz) from public, anon, authenticated;
revoke execute on function public.panel_ia(timestamptz, timestamptz) from public, anon, authenticated;
revoke execute on function public.panel_canales(timestamptz, timestamptz) from public, anon, authenticated;
revoke execute on function public.panel_salud() from public, anon, authenticated;
grant execute on function public.panel_ventas(timestamptz, timestamptz) to service_role;
grant execute on function public.panel_clientes() to service_role;
grant execute on function public.panel_serie_mensual(integer) to service_role;
grant execute on function public.panel_uso() to service_role;
grant execute on function public.panel_funnel(timestamptz, timestamptz) to service_role;
grant execute on function public.panel_ia(timestamptz, timestamptz) to service_role;
grant execute on function public.panel_canales(timestamptz, timestamptz) to service_role;
grant execute on function public.panel_salud() to service_role;
