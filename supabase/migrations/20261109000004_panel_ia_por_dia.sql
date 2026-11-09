-- IA del panel: suma la serie DÍA POR DÍA del gasto (para ver la tendencia del mes). Misma firma:
-- los permisos (solo service_role) se conservan.
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
