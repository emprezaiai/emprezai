-- SALUD: el aviso de Hotmart que falla guarda el correo del comprador, para que la dueña sepa A QUIÉN
-- darle acceso sin buscar en Hotmart. Solo se llena en los fallos (en los éxitos ya está en profiles).
-- La tabla sigue con RLS y sin políticas: solo el servidor (service_role) la lee.
alter table public.webhook_log
  add column if not exists email text check (email is null or char_length(email) <= 320);

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
    'webhook_fallidos', coalesce((select jsonb_agg(jsonb_build_object('tipo', type, 'resultado', result, 'en', received_at, 'email', email) order by received_at desc) from (
        select type, result, received_at, email from public.webhook_log
        where result in ('error', 'unauthorized') and received_at > now() - interval '7 days'
        order by received_at desc limit 5) t), '[]'::jsonb),
    'vencidos_sin_aviso', (select count(*) from public.profiles
                           where origen_acceso = 'hotmart' and status = 'active' and access_until is not null and access_until < now()),
    'pagaron_sin_acceso', (select count(*) from public.profiles
                           where status in ('trialing', 'active') and completed = false and created_at < now() - interval '1 hour'),
    'alertas', coalesce((select jsonb_agg(jsonb_build_object('clave', clave, 'en', created_at) order by created_at desc) from (
        select clave, created_at from public.alertas order by created_at desc limit 10) t), '[]'::jsonb)
  );
$$;

-- CONTEOS por filtro de Usuarios (para mostrar cuántas personas hay en cada chip). Reusa la MISMA
-- lógica de filtros de panel_usuarios, así el número del chip y la lista nunca se contradicen.
create or replace function public.panel_usuarios_conteos(p_buscar text)
returns jsonb language sql stable security definer set search_path = ''
as $$
  select jsonb_object_agg(f, (public.panel_usuarios(p_buscar, f, 1, 0) ->> 'total')::int)
  from unnest(array['todos', 'activo', 'trialing', 'active', 'sin-acceso', 'fantasma', 'cancelled', 'past_due', 'expired', 'refunded', 'vencido', 'manual']) as f;
$$;
revoke execute on function public.panel_usuarios_conteos(text) from public, anon, authenticated;
grant execute on function public.panel_usuarios_conteos(text) to service_role;
