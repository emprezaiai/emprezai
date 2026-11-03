-- EMPREZAI — tiene_acceso ya no se llama desde el navegador (aviso del revisor de seguridad de Supabase).
-- Desde el blindaje (I1) ninguna política la usa: solo el servidor la consulta con la clave secreta.
-- Abierta a "authenticated", cualquiera con sesión podía preguntar por /rest/v1/rpc si OTRA cuenta
-- tiene acceso. Se cierra a service_role.
revoke execute on function public.tiene_acceso(uuid) from public, anon, authenticated;
grant execute on function public.tiene_acceso(uuid) to service_role;
