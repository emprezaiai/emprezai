import type { Metadata } from 'next';
import { Acceso } from '@/components/acceso/Acceso';

export const metadata: Metadata = {
  title: 'Entrar — EMPRESAI',
  description: 'Entra a tu ruta de 30 días con un enlace de acceso, sin contraseñas.',
  robots: { index: false },
};

export default function PaginaEntrar() {
  return <Acceso />;
}
