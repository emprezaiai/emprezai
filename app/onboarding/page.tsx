import type { Metadata } from 'next';
import { Onboarding } from '@/components/onboarding/Onboarding';
import { esPlan } from '@/lib/onboarding';

export const metadata: Metadata = {
  title: 'Arma tu primera pieza — EMPREZAI',
  description: 'Responde unas preguntas y arma tu frase de negocio en unos 5 minutos, gratis y sin crear cuenta.',
  robots: { index: false },
};

export default async function PaginaOnboarding({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const { plan } = await searchParams;
  return <Onboarding planInicial={esPlan(plan) ? plan : undefined} />;
}
