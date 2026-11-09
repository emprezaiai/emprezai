// Puerta del panel: se verifica EN EL SERVIDOR que quien entra es la dueña (sesión válida + correo en
// public.admins) antes de pintar cualquier cosa. Para cualquier otra persona el panel no existe (404).

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { MarcoPanel } from '@/components/admin/MarcoPanel';
import { adminActual } from '@/lib/servidor/admin';
import { modoCaptura } from '@/lib/servidor/panel';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Panel — EMPREZAI',
  robots: { index: false, follow: false },
};

export default async function LayoutPanel({ children }: { children: React.ReactNode }) {
  const admin = modoCaptura ? { email: 'captura local (datos de prueba)', userId: '' } : await adminActual();
  if (!admin) notFound();
  return <MarcoPanel email={admin.email}>{children}</MarcoPanel>;
}
