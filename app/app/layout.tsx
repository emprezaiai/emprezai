import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { connection } from 'next/server';
import { Marco } from '@/components/interna/Marco';
import { revisarAcceso } from '@/lib/servidor/sesion';

export const metadata: Metadata = {
  title: 'Tu ruta — EMPREZAI',
  robots: { index: false },
};

// La puerta de la app se decide EN SERVIDOR (09/26): sin sesión → Entrar; sin suscripción vigente →
// Entrar con el aviso. Sin Supabase conectado solo existe la versión de prueba local (fail-closed:
// en producción NEXT_PUBLIC_VISTA_PREVIA no está, así que nadie entra).
export default async function LayoutApp({ children }: Readonly<{ children: React.ReactNode }>) {
  // Siempre en cada petición (nunca prerenderizado): la puerta depende de la sesión de quien entra.
  await connection();
  const acceso = await revisarAcceso();
  if (acceso.estado === 'sin-servicio') {
    if (process.env.NEXT_PUBLIC_VISTA_PREVIA !== '1') redirect('/login');
    return <Marco modo="local">{children}</Marco>;
  }
  if (acceso.estado === 'sin-sesion') redirect('/login');
  if (acceso.estado === 'sin-acceso') redirect('/login?estado=sin-acceso');
  return <Marco modo="servidor">{children}</Marco>;
}
