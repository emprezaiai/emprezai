-- EMPREZAI — aviso por correo antes de cada renovación ANUAL (47/58; ley de renovación automática de
-- California: avisar entre 15 y 45 días antes en planes de 1 año o más).
-- Guarda la fecha de renovación que ya se avisó: así se avisa una vez por año, nunca dos.
alter table public.profiles
  add column if not exists aviso_renovacion_para timestamptz;
