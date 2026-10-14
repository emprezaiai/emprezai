import Link from 'next/link';
import { LogoEmpresai } from '@/components/app/LogoEmpresai';

// 404 en el idioma y el estilo de la app: siempre con una salida clara (nunca un callejón sin salida).
export default function NoEncontrada() {
  return (
    <main
      className="flex min-h-dvh flex-col items-center justify-center px-5 text-center font-sans text-ink-1"
      style={{
        background:
          'radial-gradient(420px 320px at 100% 0%, color-mix(in oklab, var(--gold) 16%, transparent), transparent 70%), ' +
          'radial-gradient(360px 300px at 0% 100%, color-mix(in oklab, var(--green) 8%, transparent), transparent 70%), ' +
          'var(--surface-base)',
      }}
    >
      <LogoEmpresai tamano={32} />
      <h1 className="mt-8 font-display text-3xl font-extrabold leading-tight">Esta página todavía no existe</h1>
      <p className="mt-3 max-w-sm text-base leading-relaxed text-ink-2">
        Puede que el enlace esté mal escrito o que esta parte de EMPREZAI aún se esté construyendo.
      </p>
      <Link
        href="/"
        className="mt-8 flex h-12 items-center justify-center rounded-full bg-gold px-8 text-base font-semibold text-on-gold shadow-[0_4px_0_var(--gold-deep)] active:translate-y-0.5"
      >
        Volver al inicio
      </Link>
    </main>
  );
}
