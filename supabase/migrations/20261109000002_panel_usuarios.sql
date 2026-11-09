-- EMPREZAI — panel: lista y ficha de usuarios (sumando DENTRO de la base: piezas e IA por persona
-- sin traer miles de filas) y las pruebas que terminaron sin pago (para la conversión prueba→pago).

-- Pruebas que vencieron sin convertirse, en el período.
create or replace function public.panel_pruebas_sin_pago(p_desde timestamptz, p_hasta timestamptz)
returns integer language sql stable security definer set search_path = ''
as $$
  select count(*)::integer from public.profile_events
  where from_status = 'trialing' and to_status = 'expired' and at >= p_desde and at < p_hasta;
$$;

-- Lista de usuarios con búsqueda por correo o nombre y filtro por estado. 'sin-acceso' = pagaron y
-- no recibieron el acceso; 'vencido' = acceso vencido sin aviso de Hotmart; 'activo' = con acceso hoy.
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
        or (p_estado = 'vencido' and p.status = 'active' and p.access_until < now())
        or (p_estado = 'manual' and p.origen_acceso = 'manual')
        or p.status = p_estado
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

-- Ficha de una persona: datos, historial de estados, pagos, piezas y costo de IA.
create or replace function public.panel_ficha(p_id uuid)
returns jsonb language sql stable security definer set search_path = ''
as $$
  select case when p.id is null then null else jsonb_build_object(
    'id', p.id, 'email', p.email, 'nombre', p.name, 'estado', p.status, 'plan', p.plan, 'origen', p.origen_acceso,
    'canal', p.source, 'alta', p.created_at, 'acceso_hasta', p.access_until, 'prueba_hasta', p.trial_ends_at,
    'gracia_hasta', p.grace_ends_at, 'primer_pago', p.first_paid_at, 'tiene_cuenta', p.user_id is not null,
    'acceso_enviado', p.completed, 'idea', p.idea, 'momento', p.momento,
    'historial', coalesce((select jsonb_agg(jsonb_build_object('de', e.from_status, 'a', e.to_status, 'en', e.at) order by e.at desc)
                           from public.profile_events e where e.profile_id = p.id), '[]'::jsonb),
    'pagos', coalesce((select jsonb_agg(jsonb_build_object('tipo', t.economic_kind, 'monto_minor', t.amount_minor, 'moneda', t.currency, 'en', t.occurred_at) order by t.occurred_at desc)
                       from public.payment_transactions t where t.email = p.email), '[]'::jsonb),
    'piezas', (select count(*) from public.piezas pz where pz.user_id = p.user_id),
    'dia_maximo', (select max(dia) from public.piezas pz where pz.user_id = p.user_id),
    'ultima_actividad', (select max(pz.creada_en) from public.piezas pz where pz.user_id = p.user_id),
    'ia_usd', (select coalesce(sum(cost_usd), 0) from public.ai_calls a where a.user_id = p.user_id)
  ) end
  from (select 1) uno left join public.profiles p on p.id = p_id;
$$;

revoke execute on function public.panel_pruebas_sin_pago(timestamptz, timestamptz) from public, anon, authenticated;
revoke execute on function public.panel_usuarios(text, text, integer, integer) from public, anon, authenticated;
revoke execute on function public.panel_ficha(uuid) from public, anon, authenticated;
grant execute on function public.panel_pruebas_sin_pago(timestamptz, timestamptz) to service_role;
grant execute on function public.panel_usuarios(text, text, integer, integer) to service_role;
grant execute on function public.panel_ficha(uuid) to service_role;
