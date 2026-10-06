import type { Metadata } from 'next';
import { Onboarding } from '@/components/onboarding/Onboarding';
import { esPlan } from '@/lib/onboarding';

export const metadata: Metadata = {
  title: 'Arma tu primera pieza — EMPRESAI',
  description: 'Responde 5 preguntas y arma tu propuesta de valor en 2 minutos.',
  robots: { index: false },
};

export default async function PaginaOnboarding({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const { plan } = await searchParams;
  return <Onboarding planInicial={esPlan(plan) ? plan : undefined} />;
}
