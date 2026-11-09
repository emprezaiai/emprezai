-- EMPREZAI — la serie mensual del panel también separa el bruto de las ventas que llegaron SIN el
-- reparto de Hotmart, para estimar su comisión mes a mes (marcada como estimada en el panel).
create or replace function public.panel_serie_mensual(p_meses integer)
returns jsonb language sql stable security definer set search_path = ''
as $$
  with meses as (
    select generate_series(date_trunc('month', now()) - make_interval(months => p_meses - 1), date_trunc('month', now()), interval '1 month') as mes
  )
  select coalesce(jsonb_agg(jsonb_build_object(
    'mes', to_char(m.mes, 'YYYY-MM'),
    'dinero', coalesce((
      select jsonb_agg(jsonb_build_object('moneda', currency, 'bruto_minor', bruto, 'neto_minor', neto, 'afiliados_minor', afil,
                                          'ventas_sin_neto', sin_neto, 'bruto_sin_neto_minor', bruto_sin_neto, 'reembolsos_minor', reemb))
      from (
        select currency,
               coalesce(sum(amount_minor) filter (where economic_kind = 'sale'), 0) bruto,
               coalesce(sum(net_minor) filter (where economic_kind = 'sale'), 0) neto,
               coalesce(sum(affiliate_minor) filter (where economic_kind = 'sale'), 0) afil,
               count(*) filter (where economic_kind = 'sale' and net_minor is null) sin_neto,
               coalesce(sum(amount_minor) filter (where economic_kind = 'sale' and net_minor is null), 0) bruto_sin_neto,
               coalesce(sum(amount_minor) filter (where economic_kind in ('refund', 'chargeback')), 0) reemb
        from public.payment_transactions
        where occurred_at >= m.mes and occurred_at < m.mes + interval '1 month'
        group by currency
      ) t), '[]'::jsonb),
    'ia_usd', (select coalesce(sum(cost_usd), 0) from public.ai_calls where created_at >= m.mes and created_at < m.mes + interval '1 month')
  ) order by m.mes), '[]'::jsonb)
  from meses m;
$$;
revoke execute on function public.panel_serie_mensual(integer) from public, anon, authenticated;
grant execute on function public.panel_serie_mensual(integer) to service_role;

-- Lo mismo en el resumen de ventas del período.
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
          'bruto_sin_neto_minor', coalesce(sum(amount_minor) filter (where economic_kind = 'sale' and net_minor is null), 0),
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
revoke execute on function public.panel_ventas(timestamptz, timestamptz) from public, anon, authenticated;
grant execute on function public.panel_ventas(timestamptz, timestamptz) to service_role;
