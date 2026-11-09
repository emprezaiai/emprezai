-- EMPREZAI — filtros del panel: "Pagando" ya no incluye a quienes la dueña agregó a mano (acceso
-- regalado) y se suma "fantasma" (pagan y llevan 14 días sin armar piezas, para escribirles).
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
        or (p_estado = 'sin-acceso' and p.status in ('trialing', 'active') and p.completed = false)
        or (p_estado = 'vencido' and p.status = 'active' and p.origen_acceso = 'hotmart' and p.access_until < now())
        or (p_estado = 'manual' and p.origen_acceso = 'manual')
        or (p_estado = 'fantasma' and p.status = 'active' and p.origen_acceso = 'hotmart' and p.access_until > now()
            and p.first_paid_at < now() - interval '14 days' and p.user_id is not null
            and not exists (select 1 from public.piezas pz where pz.user_id = p.user_id and pz.creada_en > now() - interval '14 days'))
        or (p_estado = 'active' and p.status = 'active' and p.origen_acceso = 'hotmart')
        or (p_estado not in ('activo', 'sin-acceso', 'vencido', 'manual', 'fantasma', 'active') and p.status = p_estado)
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
revoke execute on function public.panel_usuarios(text, text, integer, integer) from public, anon, authenticated;
grant execute on function public.panel_usuarios(text, text, integer, integer) to service_role;
