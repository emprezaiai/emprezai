'use client';

// Portada de EMPREZAI: el personaje como protagonista, titular corto y un solo botón.
// Paleta propia de esta pantalla (pedido de la dueña): fondo #0B0D12, bordes #1F242D, verde #22C55E, amarillo #FACC15.

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { Marca } from '@/components/app/Marca';
import { EnlaceCta } from './ui';

export function HeroPortada({ ctaHref, loginHref }: { ctaHref: string; loginHref: string }) {
  const reduce = useReducedMotion();
  const entrar = (i: number) => ({
    initial: { opacity: 0, y: reduce ? 0 : 14 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, delay: reduce ? 0 : i * 0.06, ease: [0.16, 1, 0.3, 1] as const },
  });

  return (
    <section id="hero" className="relative isolate overflow-hidden bg-[var(--portada-fondo)]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(480px 380px at 50% 78%, rgb(34 197 94 / 0.14) 0%, transparent 70%), radial-gradient(360px 260px at 90% 0%, rgb(250 204 21 / 0.07) 0%, transparent 70%)',
        }}
      />
      <div className="mx-auto w-full max-w-[560px] px-5 pb-8">
        <header className="flex h-16 items-center justify-between">
          <Link href="/" aria-label="EMPREZAI, inicio" className="flex min-h-11 items-center gap-2">
            <Marca tamano="md" />
          </Link>
          <Link
            href={ctaHref}
            className="inline-flex h-11 items-center gap-1.5 rounded-full border border-[var(--portada-verde)] bg-[var(--portada-campo)] px-4 text-[14px] font-semibold text-ink-1 transition-colors duration-150 hover:bg-raised"
          >
            Probar gratis
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </header>

        <div className="flex flex-col items-center pt-6 text-center">
          <motion.p
            {...entrar(0)}
            className="rounded-full border border-[var(--line)] px-5 py-3 text-xs leading-normal font-semibold tracking-[0.14em] text-ink-1 uppercase"
          >
            Para emprendedores
            <br />
            cansados de la teoría
          </motion.p>

          <motion.h1
            {...entrar(1)}
            className="mt-6 text-3xl leading-[1.15] font-extrabold tracking-[-0.01em] text-ink-1 [font-family:var(--font-display)] sm:text-5xl"
          >
            Tu idea merece
            <br />
            <span className="text-[var(--portada-amarillo)]">convertirse<br className="sm:hidden" /> en realidad.</span>
          </motion.h1>

          <motion.p {...entrar(2)} className="mt-4 max-w-[34ch] text-base leading-relaxed text-ink-2">
            Deja de darle vueltas. Empieza a construir.
          </motion.p>

          <motion.div {...entrar(3)} className="mt-6 w-full">
            <EnlaceCta
              href={ctaHref}
              className="boton-portada flex h-14 w-full items-center justify-center gap-2 rounded-full px-6 text-[length:17px] [touch-action:manipulation]"
            >
              Materializar mi idea hoy
              <ArrowRight size={20} strokeWidth={2.6} aria-hidden="true" />
            </EnlaceCta>
          </motion.div>

          <motion.div {...entrar(4)} className="mt-3 flex flex-col items-center gap-1 text-caption text-ink-2">
            <p>
              <strong className="font-semibold text-ink-1">5 minutos al día</strong> · <strong className="font-semibold text-ink-1">Empieza gratis</strong>
            </p>
            <p className="max-w-[30ch] text-balance">
              Cada día la IA arma <strong className="font-semibold text-ink-1">una pieza de tu negocio</strong>.
            </p>
            <p className="text-ink-2">Prueba de 7 días · Garantía de 15 días · Cancelas cuando quieras</p>
          </motion.div>

          <motion.div {...entrar(5)} className="relative mt-4 aspect-square w-full max-w-60">
            <Image
              src="/images/jaguar-hero.webp"
              style={reduce ? undefined : { animation: 'personaje-flota 3.2s ease-in-out infinite' }}
              alt="El guepardo de EMPREZAI, sentado y feliz, con una idea sobre su cabeza"
              fill
              priority
              sizes="240px"
              className="object-contain [mask-image:radial-gradient(closest-side,#000_72%,transparent_100%)]"
            />
          </motion.div>

          <motion.p {...entrar(6)} className="mt-1 text-caption text-ink-3">
            ¿Ya tienes cuenta?{' '}
            <Link href={loginHref} className="inline-flex min-h-11 items-center font-semibold text-ink-1 underline underline-offset-4">
              Entrar
            </Link>
          </motion.p>
        </div>
      </div>
    </section>
  );
}
