-- Borrado REAL de la cuenta (47: derecho de eliminación — LGPD, Ley 1581, LFPDPPP, PIPEDA).
-- Antes, "Borrar mis datos" solo vaciaba las piezas y la idea; el correo, el nombre y el registro de
-- uso quedaban guardados aunque la Política de Privacidad prometía borrarlos. Esta función borra, en un
-- solo paso y sin dejar nada a medias, todo lo que identifica a la persona:
--   · sus piezas, su perfil (correo, nombre, idea, respuestas) y el historial de estados del perfil;
--   · sus usos de IA, sus errores y sus eventos de visita (por cuenta y por el código anónimo del celular);
--   · el correo guardado en los avisos fallidos de Hotmart y en el registro de acciones del panel.
-- Se CONSERVAN los cobros (payment_transactions): no llevan correo ni nombre y son registros contables
-- que la ley exige guardar. La cuenta de acceso (auth.users) la borra el servidor justo después.
-- Es idempotente: si algo falla a medias, se puede volver a llamar.

create or replace function public.borrar_cuenta(p_user uuid)
returns void language plpgsql security definer set search_path = ''
as $$
declare
  v_perfil uuid;
  v_email  text;
  v_anon   text;
begin
  if p_user is null then
    raise exception 'borrar_cuenta: falta el usuario';
  end if;

  select id, email, anon_id into v_perfil, v_email, v_anon from public.profiles where user_id = p_user;

  delete from public.piezas    where user_id = p_user;
  delete from public.ai_calls  where user_id = p_user;
  delete from public.error_log where user_id = p_user;
  delete from public.event_log where user_id = p_user or (v_anon is not null and anon_id = v_anon);

  if v_email is not null then
    update public.webhook_log set email = null where email = v_email;
    update public.admin_auditoria set detalle = detalle - 'email' where detalle ->> 'email' = v_email;
  end if;

  -- El historial de estados (profile_events) se borra solo junto con el perfil.
  if v_perfil is not null then
    delete from public.profiles where id = v_perfil;
  end if;
end;
$$;

revoke execute on function public.borrar_cuenta(uuid) from public, anon, authenticated;
grant execute on function public.borrar_cuenta(uuid) to service_role;
