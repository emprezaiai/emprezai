-- EMPREZAI — blindaje del dinero (auditoría 2026-10-23, hallazgos C1 · C2 · I1 · I2).
-- Solo agrega o reemplaza (no borra datos): columna nueva, funciones nuevas o reemplazadas y
-- permisos más estrictos sobre piezas.

-- ───────────────── C1 · Todo acceso tiene fecha de fin y los avisos viejos no mandan ─────────────────
-- last_event_at = fecha (de Hotmart) del último aviso aplicado: uno más viejo que llegue tarde ya no
-- puede devolver el perfil a un estado anterior (ej. reactivar una suscripción cancelada).
alter table public.profiles add column if not exists last_event_at timestamptz;
-- Para la revisión diaria de accesos que vencieron sin aviso de Hotmart (cron).
create index if not exists profiles_vencimiento_idx on public.profiles (status, access_until) where status = 'active';

-- Prueba: hasta el fin de la prueba + 2 días (el cobro puede tardar). Activa: hasta access_until
-- (próximo cobro + gracia, lo fija el aviso de pago). Sin fecha de fin = sin acceso (fail-closed).
create or replace function public.tiene_acceso(p_user uuid)
returns boolean
language sql stable security definer set search_path = ''
as $$
  select exists (
    select 1 from public.profiles p
    where p.user_id = p_user
      and (
        (p.status = 'trialing' and p.trial_ends_at is not null and now() < p.trial_ends_at + interval '2 days')
        or (p.status in ('active','cancelled') and p.access_until is not null and now() < p.access_until)
        or (p.status = 'past_due' and p.grace_ends_at is not null and now() < p.grace_ends_at)
      )
  );
$$;

drop function if exists public.apply_hotmart_event(text,text,text,text,text,text,text,text,text,timestamptz,timestamptz,timestamptz,text,text,text,text,bigint,text,timestamptz);

create or replace function public.apply_hotmart_event(
  p_event_id        text,
  p_event_type      text,
  p_payload_hash    text,
  p_email           text,
  p_name            text,
  p_subscriber_code text,
  p_new_status      text,
  p_plan            text,
  p_anon_id         text,
  p_trial_ends_at   timestamptz,
  p_access_until    timestamptz,
  p_grace_ends_at   timestamptz,
  p_transaction_id  text,
  p_economic_kind   text,
  p_product_id      text,
  p_offer_id        text,
  p_amount_minor    bigint,
  p_currency        text,
  p_occurred_at     timestamptz,
  -- Fecha del aviso en Hotmart (creation_date): ordena los avisos aunque lleguen desordenados.
  p_event_at        timestamptz,
  -- true para PURCHASE_COMPLETE (llega al vencer la garantía): solo puede CREAR un perfil que no
  -- existía; nunca cambia el estado de uno existente (no revive una suscripción cancelada).
  p_solo_crear      boolean
) returns jsonb
language plpgsql security definer set search_path = ''
as $$
declare
  v_id      uuid;
  v_current text;
  v_last    timestamptz;
  v_evento  timestamptz := coalesce(p_event_at, now());
begin
  -- (a) Idempotencia técnica: el mismo evento reentregado no hace nada.
  begin
    insert into public.processed_events (event_id, event_type, payload_hash)
    values (p_event_id, p_event_type, p_payload_hash);
  exception when unique_violation then
    return jsonb_build_object('status', 'duplicate');
  end;

  -- (b) Ledger económico (dedupe distinto: APPROVED y COMPLETE de la misma compra cuentan una vez).
  if p_transaction_id is not null and p_economic_kind is not null and p_amount_minor is not null then
    insert into public.payment_transactions
      (provider, transaction_id, economic_kind, product_id, offer_id, amount_minor, currency, occurred_at, raw_event_id)
    values
      ('hotmart', p_transaction_id, p_economic_kind, p_product_id, p_offer_id, p_amount_minor, upper(p_currency),
       coalesce(p_occurred_at, now()), p_event_id)
    on conflict do nothing;
  end if;

  -- (c) Perfil actual: primero por código de suscriptor, luego por correo. Se bloquea la fila para
  --     que dos avisos simultáneos de la misma persona se apliquen uno detrás del otro.
  select id, status, last_event_at into v_id, v_current, v_last from public.profiles
  where (p_subscriber_code is not null and hotmart_subscriber_code = p_subscriber_code)
  limit 1
  for update;
  if v_id is null then
    select id, status, last_event_at into v_id, v_current, v_last from public.profiles
    where email = lower(p_email) limit 1
    for update;
  end if;

  -- (d) Transición legal: un reembolso o contracargo nunca se "resucita".
  if v_current in ('refunded','chargeback') and p_new_status in ('active','trialing') then
    return jsonb_build_object('status', 'illegal_transition', 'from', v_current);
  end if;

  -- (e) "Compra completa" sobre un perfil que ya existe: queda en el libro de pagos, no cambia nada más.
  if v_id is not null and p_solo_crear then
    return jsonb_build_object('status', 'applied', 'new_status', v_current, 'needs_access', false);
  end if;

  -- (f) Aviso más viejo que el último aplicado: no manda (salvo reembolso/contracargo, que siempre
  --     quitan el acceso aunque lleguen tarde).
  if v_id is not null and v_last is not null and v_evento < v_last
     and p_new_status not in ('refunded','chargeback') then
    return jsonb_build_object('status', 'stale', 'needs_access', false);
  end if;

  -- Un evento que no da acceso no crea perfiles nuevos.
  if v_id is null and p_new_status not in ('trialing','active') then
    return jsonb_build_object('status', 'applied', 'new_status', p_new_status, 'needs_access', false);
  end if;

  if v_id is null then
    insert into public.profiles (email, name, status, plan, hotmart_subscriber_code, anon_id,
                                 trial_ends_at, first_paid_at, access_until, last_event_at)
    values (lower(p_email), nullif(p_name, ''), p_new_status, p_plan, p_subscriber_code, p_anon_id,
            p_trial_ends_at, case when p_new_status = 'active' then now() end,
            case when p_new_status = 'active' then p_access_until end, v_evento)
    returning id into v_id;
  else
    update public.profiles set
      status                  = p_new_status,
      name                    = coalesce(nullif(p_name, ''), name),
      plan                    = coalesce(p_plan, plan),
      hotmart_subscriber_code = coalesce(p_subscriber_code, hotmart_subscriber_code),
      anon_id                 = coalesce(anon_id, p_anon_id),
      trial_ends_at           = coalesce(p_trial_ends_at, trial_ends_at),
      first_paid_at           = coalesce(first_paid_at, case when p_new_status = 'active' then now() end),
      access_until            = case
                                  when p_new_status = 'active' then coalesce(p_access_until, access_until)
                                  when p_new_status = 'cancelled' then coalesce(p_access_until, access_until, now())
                                  else access_until
                                end,
      grace_ends_at           = case when p_new_status = 'past_due' then coalesce(p_grace_ends_at, now() + interval '5 days') else grace_ends_at end,
      last_event_at           = greatest(coalesce(last_event_at, v_evento), v_evento),
      updated_at              = now()
    where id = v_id;
  end if;

  return jsonb_build_object(
    'status', 'applied',
    'new_status', p_new_status,
    'needs_access', p_new_status in ('trialing','active')
  );
end;
$$;
revoke execute on function public.apply_hotmart_event(text,text,text,text,text,text,text,text,text,timestamptz,timestamptz,timestamptz,text,text,text,text,bigint,text,timestamptz,timestamptz,boolean)
  from public, anon, authenticated;
grant execute on function public.apply_hotmart_event(text,text,text,text,text,text,text,text,text,timestamptz,timestamptz,timestamptz,text,text,text,text,bigint,text,timestamptz,timestamptz,boolean)
  to service_role;

-- ───────────────── C2 · El gasto de IA se suma DENTRO de la base (sin tope de filas) ─────────────────
create or replace function public.gasto_ia_desde(p_desde timestamptz)
returns numeric
language sql stable security definer set search_path = ''
as $$
  select coalesce(sum(cost_usd), 0) from public.ai_calls where created_at >= p_desde;
$$;
revoke execute on function public.gasto_ia_desde(timestamptz) from public, anon, authenticated;
grant execute on function public.gasto_ia_desde(timestamptz) to service_role;

-- ───────────────── I2 · Límite de intentos ATÓMICO (contar y anotar en un solo paso) ─────────────────
-- Un candado por clave serializa las peticiones simultáneas: ráfagas en paralelo ya no pasan el límite.
create or replace function public.tomar_cupo(
  p_clave             text,
  p_maximo            integer,
  p_ventana_min       integer,
  p_maximo_largo      integer default null,
  p_ventana_larga_min integer default null
) returns boolean
language plpgsql security definer set search_path = ''
as $$
declare
  v_cuenta integer;
begin
  perform pg_advisory_xact_lock(hashtextextended(p_clave, 0));
  select count(*) into v_cuenta from public.limite_intentos
  where clave = p_clave and created_at >= now() - make_interval(mins => p_ventana_min);
  if v_cuenta >= p_maximo then
    return false;
  end if;
  if p_maximo_largo is not null and p_ventana_larga_min is not null then
    select count(*) into v_cuenta from public.limite_intentos
    where clave = p_clave and created_at >= now() - make_interval(mins => p_ventana_larga_min);
    if v_cuenta >= p_maximo_largo then
      return false;
    end if;
  end if;
  insert into public.limite_intentos (clave) values (p_clave);
  return true;
end;
$$;
revoke execute on function public.tomar_cupo(text,integer,integer,integer,integer) from public, anon, authenticated;
grant execute on function public.tomar_cupo(text,integer,integer,integer,integer) to service_role;

-- ───────────────── I1 · Las piezas solo las escribe el servidor ─────────────────
-- Antes la persona podía escribir piezas directo con la clave pública (saltando la regla de fechas
-- que protege la racha). Ahora: leer y borrar lo propio sí; crear y editar solo vía /api/piezas.
drop policy if exists "piezas: crear con acceso" on public.piezas;
drop policy if exists "piezas: editar con acceso" on public.piezas;
revoke insert, update on public.piezas from authenticated;
