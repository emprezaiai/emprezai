-- PANEL, comparaciones y caminos que faltaban:
--  · panel_uso: piezas de los 30 días anteriores (para decir si 308 es bueno o malo).
--  · panel_salud: errores de la semana anterior y, en cada aviso fallido, si el comprador ya tiene acceso.
--  · panel_usuarios: filtro 'inactivo' (sin acceso hoy) para que el número de Ventas lleve a su lista.
-- Mismas firmas: los permisos (solo service_role) se conservan.
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
    'piezas_30_anterior', (select count(*) from public.piezas where fecha between current_date - 59 and current_date - 30),
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
    'errores_7d_total', (select count(*) from public.error_log where created_at > now() - interval '7 days'),
    'errores_7d_anterior', (select count(*) from public.error_log where created_at > now() - interval '14 days' and created_at <= now() - interval '7 days'),
    'webhook_fallidos', coalesce((select jsonb_agg(jsonb_build_object('tipo', t.type, 'resultado', t.result, 'en', t.received_at, 'email', t.email, 'perfil_id', pr.id,
          'con_acceso', coalesce(pr.status in ('trialing', 'active') and pr.completed and (pr.access_until is null or pr.access_until > now()), false)) order by t.received_at desc) from (
        select type, result, received_at, email from public.webhook_log
        where result in ('error', 'unauthorized') and received_at > now() - interval '7 days'
        order by received_at desc limit 5) t left join public.profiles pr on lower(pr.email) = lower(t.email)), '[]'::jsonb),
    'vencidos_sin_aviso', (select count(*) from public.profiles
                           where origen_acceso = 'hotmart' and status = 'active' and access_until is not null and access_until < now()),
    'pagaron_sin_acceso', (select count(*) from public.profiles
                           where status in ('trialing', 'active') and completed = false and created_at < now() - interval '1 hour'),
    'alertas', coalesce((select jsonb_agg(jsonb_build_object('clave', clave, 'en', created_at) order by created_at desc) from (
        select clave, created_at from public.alertas order by created_at desc limit 10) t), '[]'::jsonb)
  );
$$;

create or replace function public.panel_usuarios(p_buscar text, p_estado text, p_limite integer, p_desde integer)
returns jsonb language sql stable security definer set search_path = ''
as $$
  with filtrados as (
    select p.*
    from public.profiles p
    where (coalesce(p_buscar, '') = '' or p.email ilike '%' || p_buscar || '%' or coalesce(p.name, '') ilike '%' || p_buscar || '%')
      and (
        coalesce(p_estado, 'todos') = 'todos'
        or (p_estado = 'activo' and (
              (p.status = 'trialing' and p.trial_ends_at + interval '2 days' > now())
              or (p.status in ('active', 'cancelled') and p.access_until > now())
              or (p.status = 'past_due' and p.grace_ends_at > now())))
        or (p_estado = 'inactivo' and not (
              (p.status = 'trialing' and coalesce(p.trial_ends_at + interval '2 days' > now(), false))
              or (p.status in ('active', 'cancelled') and coalesce(p.access_until > now(), false))
              or (p.status = 'past_due' and coalesce(p.grace_ends_at > now(), false))))
        or (p_estado = 'sin-acceso' and p.status in ('trialing', 'active') and p.completed = false)
        or (p_estado = 'vencido' and p.status = 'active' and p.origen_acceso = 'hotmart' and p.access_until < now())
        or (p_estado = 'manual' and p.origen_acceso = 'manual')
        or (p_estado = 'fantasma' and p.status = 'active' and p.origen_acceso = 'hotmart' and p.access_until > now()
            and p.first_paid_at < now() - interval '14 days' and p.user_id is not null
            and not exists (select 1 from public.piezas pz where pz.user_id = p.user_id and pz.creada_en > now() - interval '14 days'))
        or (p_estado = 'active' and p.status = 'active' and p.origen_acceso = 'hotmart')
        or (p_estado not in ('activo', 'inactivo', 'sin-acceso', 'vencido', 'manual', 'fantasma', 'active') and p.status = p_estado)
      )
  )
  select jsonb_build_object(
    'total', (select count(*) from filtrados),
    'filas', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', f.id, 'email', f.email, 'nombre', f.name, 'estado', f.status, 'plan', f.plan, 'origen', f.origen_acceso,
        'canal', f.source, 'alta', f.created_at, 'acceso_hasta', coalesce(f.access_until, case when f.status = 'trialing' then f.trial_ends_at end),
        'tiene_cuenta', f.user_id is not null, 'acceso_enviado', f.completed,
        'piezas', (select count(*) from public.piezas pz where pz.user_id = f.user_id),
        'ultima_actividad', (select max(pz.creada_en) from public.piezas pz where pz.user_id = f.user_id)
      ) order by f.created_at desc)
      from (select * from filtrados order by created_at desc limit p_limite offset p_desde) f
    ), '[]'::jsonb)
  );
$$;

create or replace function public.panel_usuarios_conteos(p_buscar text)
returns jsonb language sql stable security definer set search_path = ''
as $$
  select jsonb_object_agg(f, (public.panel_usuarios(p_buscar, f, 1, 0) ->> 'total')::int)
  from unnest(array['todos', 'activo', 'trialing', 'active', 'sin-acceso', 'fantasma', 'cancelled', 'past_due', 'expired', 'refunded', 'vencido', 'manual', 'inactivo']) as f;
$$;
