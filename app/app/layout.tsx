import type { Metadata } from 'next';
import { Marco } from '@/components/interna/Marco';

export const metadata: Metadata = {
  title: 'Tu ruta — EMPRESAI',
  robots: { index: false },
};

export default function LayoutApp({ children }: Readonly<{ children: React.ReactNode }>) {
  return <Marco>{children}</Marco>;
}
