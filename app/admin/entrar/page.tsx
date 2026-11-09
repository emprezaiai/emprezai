import type { Metadata } from 'next';
import { EntrarPanel } from '@/components/admin/EntrarPanel';

export const metadata: Metadata = {
  title: 'Entrar al panel — EMPREZAI',
  robots: { index: false, follow: false },
};

export default function PaginaEntrarPanel() {
  return <EntrarPanel />;
}
