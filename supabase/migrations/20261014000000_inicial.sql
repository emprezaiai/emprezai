-- EMPREZAI — esquema inicial (Sesión 6). 25-BASE-DE-DATOS + 18-VENTA-HOTMART + 30-INTEGRACION-IA.
-- RLS activo en TODA tabla. Las políticas usan (select auth.uid()) (forma de alto rendimiento) y
-- la columna de la política está indexada. Las tablas operativas (pagos, webhooks, IA, límites)
-- no tienen políticas: solo el servidor (clave secreta) las toca.

-- ───────────────────────── Perfiles (uno por comprador) ─────────────────────────
-- El webhook de Hotmart crea el perfil ANTES de que exista la cuenta de acceso (modelo 2A):
-- user_id queda nulo hasta que el servidor crea el usuario de auth y lo reconcilia.
create table public.profiles (
  id                      uuid primary key default gen_random_uuid(),
  user_id                 uuid unique references auth.users (id) on delete set null,
  email                   text not null unique check (email = lower(email) and char_length(email) <= 254),
  name                    text check (char_length(name) <= 120),
  status                  text not null default 'trialing'
                            check (status in ('trialing','active','past_due','cancelled','expired','refunded','chargeback')),
  plan                    text check (plan in ('mensual','anual')),
  hotmart_subscriber_code text unique,
  anon_id                 text check (char_length(anon_id) <= 120),
  trial_ends_at           timestamptz,
  first_paid_at           timestamptz,
  access_until            timestamptz,
  grace_ends_at           timestamptz,
  -- Acceso listo: cuenta de auth creada + correo de bienvenida enviado (patrón de dos fases de 18).
  completed               boolean not null default false,
  welcome_sent_at         timestamptz,
  aviso_cobro_enviado_at  timestamptz,
  -- Lo que respondió en el recorrido de inicio (lo único que la persona puede editar de su perfil).
  idea                    text check (char_length(idea) <= 300),
  area                    text check (area in ('servicios','cursos','productos')),
  momento                 text check (momento in ('manana','mediodia','noche')),
  respuestas              jsonb not null default '{}'::jsonb check (pg_column_size(respuestas) <= 8000),
  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now()
);
create index profiles_completed_idx on public.profiles (completed, created_at) where completed = false;
create index profiles_trial_idx on public.profiles (status, trial_ends_at) where status = 'trialing';

alter table public.profiles enable row level security;

create policy "perfil: leer el propio" on public.profiles
  for select to authenticated using (user_id = (select auth.uid()));
create policy "perfil: editar el propio" on public.profiles
  for update to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));

-- La persona solo puede cambiar sus respuestas del recorrido; estado, plan y fechas de pago
-- los cambia SOLO el webhook (servidor).
revoke all on public.profiles from anon, authenticated;
grant select on public.profiles to authenticated;
grant update (name, idea, area, momento, respuestas, updated_at) on public.profiles to authenticated;

-- ¿Esta persona tiene acceso hoy? (18 §4: trialing/active siempre; cancelado hasta access_until;
-- pago atrasado durante la gracia; reembolso y contracargo, nunca.)
create or replace function public.tiene_acceso(p_user uuid)
returns boolean
language sql stable security definer set search_path = ''
as $$
  select exists (
    select 1 from public.profiles p
    where p.user_id = p_user
      and (
        p.status in ('trialing','active')
        or (p.status = 'cancelled' and p.access_until is not null and now() < p.access_until)
        or (p.status = 'past_due' and p.grace_ends_at is not null and now() < p.grace_ends_at)
      )
  );
$$;
revoke execute on function public.tiene_acceso(uuid) from public, anon;
grant execute on function public.tiene_acceso(uuid) to authenticated, service_role;

-- ───────────────────────── Piezas (las 30 de la ruta) ─────────────────────────
create table public.piezas (
  user_id     uuid not null references auth.users (id) on delete cascade,
  dia         smallint not null check (dia between 1 and 30),
  titulo      text not null check (char_length(titulo) between 1 and 120),
  contenido   text not null check (char_length(contenido) between 1 and 4000),
  resumen     text check (char_length(resumen) <= 200),
  detalle     jsonb not null default '[]'::jsonb check (pg_column_size(detalle) <= 4000),
  fecha       date not null,
  creada_en   timestamptz not null default now(),
  base        boolean not null default true,
  con_ia      boolean not null default false,
  editada_en  timestamptz,
  original    jsonb check (pg_column_size(original) <= 8000),
  tu_version  text check (char_length(tu_version) <= 4000),
  updated_at  timestamptz not null default now(),
  primary key (user_id, dia)
);

alter table public.piezas enable row level security;

-- Leer siempre lo propio (aunque se cancele, sus piezas son suyas); escribir solo con acceso vigente.
create policy "piezas: leer las propias" on public.piezas
  for select to authenticated using (user_id = (select auth.uid()));
create policy "piezas: crear con acceso" on public.piezas
  for insert to authenticated
  with check (user_id = (select auth.uid()) and public.tiene_acceso((select auth.uid())));
create policy "piezas: editar con acceso" on public.piezas
  for update to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()) and public.tiene_acceso((select auth.uid())));
create policy "piezas: borrar las propias" on public.piezas
  for delete to authenticated using (user_id = (select auth.uid()));

revoke all on public.piezas from anon, authenticated;
grant select, insert, update, delete on public.piezas to authenticated;

-- ───────────────────────── Webhook de Hotmart (18: idempotencia + log + ledger) ─────────────────────────
create table public.processed_events (
  event_id     text primary key,
  event_type   text not null,
  payload_hash text,
  processed_at timestamptz not null default now()
);

create table public.webhook_log (
  id          bigserial primary key,
  event_id    text,
  type        text,
  result      text not null check (result in ('applied','duplicate','illegal','unauthorized','rejected','ignored','error')),
  received_at timestamptz not null default now()
);
create index webhook_log_received_idx on public.webhook_log (received_at desc);
create index webhook_log_result_idx on public.webhook_log (result, received_at desc);

create table public.payment_transactions (
  provider        text not null,
  transaction_id  text not null,
  economic_kind   text not null check (economic_kind in ('sale','refund','chargeback')),
  product_id      text not null,
  offer_id        text,
  amount_minor    bigint not null,
  currency        text not null check (currency ~ '^[A-Z]{3}$'),
  occurred_at     timestamptz not null,
  raw_event_id    text not null,
  primary key (provider, transaction_id, economic_kind)
);

alter table public.processed_events enable row level security;
alter table public.webhook_log enable row level security;
alter table public.payment_transactions enable row level security;
revoke all on public.processed_events, public.webhook_log, public.payment_transactions from anon, authenticated;

-- ───────────────────────── IA: gasto y límites (30: kill-switch de presupuesto) ─────────────────────────
create table public.ai_calls (
  id            bigserial primary key,
  user_id       uuid references auth.users (id) on delete set null,
  ip_hash       text,
  kind          text not null check (kind in ('primera_pieza','mision_armar','mision_opciones')),
  model         text not null,
  input_tokens  integer not null default 0,
  output_tokens integer not null default 0,
  cost_usd      numeric(10,6) not null default 0,
  ok            boolean not null,
  created_at    timestamptz not null default now()
);
create index ai_calls_created_idx on public.ai_calls (created_at desc);
create index ai_calls_user_idx on public.ai_calls (user_id, created_at desc);
create index ai_calls_ip_idx on public.ai_calls (ip_hash, created_at desc);

-- Límite de intentos de acceso (enviar enlace / verificar código), por correo y por IP.
create table public.limite_intentos (
  id         bigserial primary key,
  clave      text not null,
  created_at timestamptz not null default now()
);
create index limite_intentos_idx on public.limite_intentos (clave, created_at desc);

-- Alertas al dueño, una sola vez por clave (ej. tope de IA del día).
create table public.alertas (
  clave      text primary key,
  created_at timestamptz not null default now()
);

alter table public.ai_calls enable row level security;
alter table public.limite_intentos enable row level security;
alter table public.alertas enable row level security;
revoke all on public.ai_calls, public.limite_intentos, public.alertas from anon, authenticated;

-- ───────────────────────── Funciones del servidor ─────────────────────────

-- Id de la cuenta de auth por correo (para reconciliar un perfil que ya tenía cuenta).
create or replace function public.auth_user_id_por_email(p_email text)
returns uuid
language sql stable security definer set search_path = ''
as $$
  select id from auth.users where lower(email) = lower(p_email) limit 1;
$$;
revoke execute on function public.auth_user_id_por_email(text) from public, anon, authenticated;
grant execute on function public.auth_user_id_por_email(text) to service_role;

-- Aplica un evento de Hotmart de forma ATÓMICA: idempotencia + ledger + transición legal de la
-- membresía (18 §3-4). Un refund/chargeback nunca se "resucita" con un evento viejo reentregado.
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
  p_occurred_at     timestamptz
) returns jsonb
language plpgsql security definer set search_path = ''
as $$
declare
  v_id      uuid;
  v_current text;
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

  -- (c) Perfil actual: primero por código de suscriptor, luego por correo.
  select id, status into v_id, v_current from public.profiles
  where (p_subscriber_code is not null and hotmart_subscriber_code = p_subscriber_code)
  limit 1;
  if v_id is null then
    select id, status into v_id, v_current from public.profiles where email = lower(p_email) limit 1;
  end if;

  -- (d) Transición legal.
  if v_current in ('refunded','chargeback') and p_new_status in ('active','trialing') then
    return jsonb_build_object('status', 'illegal_transition', 'from', v_current);
  end if;

  -- Un evento que no da acceso no crea perfiles nuevos.
  if v_id is null and p_new_status not in ('trialing','active') then
    return jsonb_build_object('status', 'applied', 'new_status', p_new_status, 'needs_access', false);
  end if;

  if v_id is null then
    insert into public.profiles (email, name, status, plan, hotmart_subscriber_code, anon_id,
                                 trial_ends_at, first_paid_at)
    values (lower(p_email), nullif(p_name, ''), p_new_status, p_plan, p_subscriber_code, p_anon_id,
            p_trial_ends_at, case when p_new_status = 'active' then now() end)
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
      access_until            = case when p_new_status = 'cancelled' then coalesce(p_access_until, access_until, now()) else access_until end,
      grace_ends_at           = case when p_new_status = 'past_due' then coalesce(p_grace_ends_at, now() + interval '5 days') else grace_ends_at end,
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
revoke execute on function public.apply_hotmart_event(text,text,text,text,text,text,text,text,text,timestamptz,timestamptz,timestamptz,text,text,text,text,bigint,text,timestamptz)
  from public, anon, authenticated;
grant execute on function public.apply_hotmart_event(text,text,text,text,text,text,text,text,text,timestamptz,timestamptz,timestamptz,text,text,text,text,bigint,text,timestamptz)
  to service_role;

-- Cambio de plan nativo (SWITCH_PLAN): no toca el estado, solo el plan. Idempotente por evento.
create or replace function public.apply_hotmart_switch_plan(
  p_event_id text, p_payload_hash text, p_subscriber_code text, p_email text, p_plan text
) returns jsonb
language plpgsql security definer set search_path = ''
as $$
begin
  begin
    insert into public.processed_events (event_id, event_type, payload_hash)
    values (p_event_id, 'SWITCH_PLAN', p_payload_hash);
  exception when unique_violation then
    return jsonb_build_object('status', 'duplicate');
  end;
  update public.profiles set plan = coalesce(p_plan, plan), updated_at = now()
  where (p_subscriber_code is not null and hotmart_subscriber_code = p_subscriber_code)
     or (p_subscriber_code is null and email = lower(p_email));
  return jsonb_build_object('status', 'applied');
end;
$$;
revoke execute on function public.apply_hotmart_switch_plan(text,text,text,text,text) from public, anon, authenticated;
grant execute on function public.apply_hotmart_switch_plan(text,text,text,text,text) to service_role;

-- updated_at automático.
create or replace function public.tocar_updated_at()
returns trigger language plpgsql set search_path = '' as $$
begin
  new.updated_at := now();
  return new;
end;
$$;
create trigger profiles_updated_at before update on public.profiles
  for each row execute function public.tocar_updated_at();
create trigger piezas_updated_at before update on public.piezas
  for each row execute function public.tocar_updated_at();
