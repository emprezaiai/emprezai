-- USUARIOS: orden elegible (más recientes · hace más que no entran · más piezas). Se reemplaza la
-- función por una con p_orden opcional (por defecto 'recientes'), así las llamadas de 4 argumentos
-- (como panel_usuarios_conteos) siguen funcionando igual.
drop function if exists public.panel_usuarios(text, text, integer, integer);
create or replace function public.panel_usuarios(p_buscar text, p_estado text, p_limite integer, p_desde integer, p_orden text default 'recientes')
returns jsonb language sql stable security definer set search_path = ''
as $$
  with filtrados as (
    select p.*,
      (select count(*) from public.piezas pz where pz.user_id = p.user_id) as n_piezas,
      (select max(pz.creada_en) from public.piezas pz where pz.user_id = p.user_id) as ultima
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
        'piezas', f.n_piezas,
        'ultima_actividad', f.ultima
      ) order by f.orden_n)
      from (
        select x.*, row_number() over () as orden_n from (
          select * from filtrados
          order by
            case when p_orden = 'inactivos' then coalesce(ultima, created_at) end asc nulls first,
            case when p_orden = 'piezas' then n_piezas end desc nulls last,
            created_at desc
          limit p_limite offset p_desde
        ) x
      ) f
    ), '[]'::jsonb)
  );
$$;
revoke execute on function public.panel_usuarios(text, text, integer, integer, text) from public, anon, authenticated;
grant execute on function public.panel_usuarios(text, text, integer, integer, text) to service_role;

-- IA: quiénes más la usan traen el id de su ficha (para tocar el correo y abrirla).
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
      select jsonb_agg(jsonb_build_object('id', pr.id, 'email', coalesce(pr.email, 'cuenta sin perfil'), 'usd', t.usd, 'llamadas', t.n) order by t.usd desc) from (
        select user_id, sum(cost_usd) usd, count(*) n
        from public.ai_calls where user_id is not null and created_at >= p_desde and created_at < p_hasta
        group by user_id order by sum(cost_usd) desc limit 5
      ) t left join public.profiles pr on pr.user_id = t.user_id), '[]'::jsonb),
    'anonima_usd', (select coalesce(sum(cost_usd), 0) from public.ai_calls where user_id is null and created_at >= p_desde and created_at < p_hasta),
    'por_dia', coalesce((
      select jsonb_agg(jsonb_build_object('fecha', to_char(d.dia, 'YYYY-MM-DD'), 'usd', coalesce(x.usd, 0)) order by d.dia)
      from generate_series(date_trunc('day', p_desde), least(p_hasta, now()) - interval '1 second', interval '1 day') as d(dia)
      left join (
        select date_trunc('day', created_at) as dia, sum(cost_usd) as usd
        from public.ai_calls where created_at >= p_desde and created_at < p_hasta group by 1
      ) x on x.dia = d.dia), '[]'::jsonb)
  );
$$;
