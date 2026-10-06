import type { Metadata } from 'next';
import { Paywall } from '@/components/paywall/Paywall';
import { esPlan } from '@/lib/onboarding';

export const metadata: Metadata = {
  title: 'Elige tu plan — EMPRESAI',
  description: '7 días gratis para armar tu negocio pieza a pieza con IA.',
  robots: { index: false },
};

export default async function PaginaPlanes({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const { plan } = await searchParams;
  return <Paywall planInicial={esPlan(plan) ? plan : undefined} />;
}
