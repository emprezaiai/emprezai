import Link from 'next/link';
import type { ReactNode } from 'react';
import { ArrowLeft } from 'lucide-react';
import { LogoEmpresai } from './LogoEmpresai';
import { RESPONSABLE, VERSION_LEGAL } from '@/lib/legal';

// Plantilla común de las páginas legales (47): título, fecha de actualización visible y versión.
export function PaginaLegal({ titulo, resumen, children }: { titulo: string; resumen: string; children: ReactNode }) {
  return (
    <div className="min-h-dvh bg-base font-sans text-ink-1">
      <header className="mx-auto flex h-16 w-full max-w-3xl items-center justify-between px-5">
        <Link href="/" className="flex items-center gap-2 text-base font-semibold">
          <LogoEmpresai tamano={24} />
          EMPREZAI
        </Link>
        <Link href="/" className="flex min-h-11 items-center gap-2 px-2 text-sm font-medium text-ink-3 hover:text-ink-1">
          <ArrowLeft size={16} aria-hidden="true" />
          Volver
        </Link>
      </header>

      <main className="mx-auto w-full max-w-3xl px-5 pt-8 pb-16">
        <p className="text-xs font-semibold uppercase tracking-[0.08em] text-gold">Información legal</p>
        <h1 className="mt-2 font-display text-3xl font-extrabold leading-tight md:text-4xl">{titulo}</h1>
        <p className="mt-3 text-base leading-relaxed text-ink-2">{resumen}</p>
        <p className="mt-4 text-sm text-ink-3">
          Última actualización: {VERSION_LEGAL.actualizado} · Versión {VERSION_LEGAL.version}
        </p>

        <div className="mt-8 flex flex-col gap-8 text-base leading-relaxed text-ink-2 [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-ink-1 [&_li]:ml-5 [&_li]:list-disc [&_strong]:font-semibold [&_strong]:text-ink-1 [&_ul]:mt-2 [&_ul]:flex [&_ul]:flex-col [&_ul]:gap-2">
          {children}
        </div>

        <footer className="mt-12 rounded-[var(--radius-card)] border border-[var(--line)] bg-raised p-5 text-sm text-ink-2">
          ¿Dudas sobre este documento? Escríbenos a{' '}
          <a href={`mailto:${RESPONSABLE.emailContacto}`} className="font-semibold text-gold underline-offset-4 hover:underline">
            {RESPONSABLE.emailContacto}
          </a>
          . Responsable: {RESPONSABLE.nombre} · {RESPONSABLE.pais}.
        </footer>
      </main>
    </div>
  );
}
