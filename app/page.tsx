'use client';

// Página de ventas de EMPRESAI — estructura canónica de 10 secciones (19) compuesta desde el kit
// (components/landing). Todo el copy sale de docs/copy/landing.md (marcado y trazado a FICHA-AVATAR.md).
// Modelo 2 anónimo (ESTADO.md): todos los CTA llevan a /onboarding; el pago se cierra en la pantalla de planes.

import {
  BookX,
  CalendarX2,
  Coffee,
  Gift,
  Hourglass,
  Lightbulb,
  Lock,
  MessageSquareDashed,
  MessageSquareText,
  MonitorPlay,
  Moon,
  MousePointerClick,
  Puzzle,
  Search,
  ShieldCheck,
  Sprout,
  TrendingDown,
  Users,
  Wallet,
  Zap,
} from 'lucide-react';
import { Hero } from '@/components/landing/Hero';
import { Problema } from '@/components/landing/Problema';
import { Agitacion } from '@/components/landing/Agitacion';
import { Solucion } from '@/components/landing/Solucion';
import { AppPorDentro } from '@/components/landing/AppPorDentro';
import { Oferta } from '@/components/landing/Oferta';
import { Garantia } from '@/components/landing/Garantia';
import { Faq } from '@/components/landing/Faq';
import { CtaFinal } from '@/components/landing/CtaFinal';
import { FooterLegal } from '@/components/landing/FooterLegal';
import { StickyCtaMobile } from '@/components/landing/ui';
import { DemoMisionHero } from '@/components/app/DemoMisionHero';
import { LogoEmpresai } from '@/components/app/LogoEmpresai';
import { useEventoAlMontar } from '@/lib/eventos';
import { RESPONSABLE } from '@/lib/legal';

const CTA_HREF = '/onboarding';
const CTA_ANUAL = '/onboarding?plan=anual';
const CTA_MENSUAL = '/onboarding?plan=mensual';
const CTA_LABEL = 'Armar mi primera pieza gratis';
const FEATURES_ANUAL = [
  'El Método Pieza a Pieza: una misión de 5 minutos al día',
  'La IA arma cada pieza con tu negocio',
  'Todo guardado en Mi Empresa, listo para descargar',
  'Nuevas rutas cada mes después del día 30',
];
const FEATURES_MENSUAL = ['Todo lo del plan anual', 'Pagas mes a mes', 'Cancelas en 1 toque, cuando quieras'];

export default function PaginaDeVentas() {
  useEventoAlMontar('landing_vista');

  return (
    <div className="min-h-dvh bg-[var(--bg)] text-[var(--text-primary)] [font-family:var(--font-body)]">
      <Hero
        appName="EMPRESAI"
        logo={<LogoEmpresai />}
        gancho={
          <span className="inline-flex items-center gap-2 rounded-[var(--radius-chip)] bg-[color-mix(in_oklab,var(--gold)_8%,transparent)] py-1.5 pr-3 pl-1.5 text-[13px] font-semibold text-ink-1">
            <span className="relieve-noche flex size-7 items-center justify-center rounded-[var(--radius-chip)]">
              <Moon size={14} fill="currentColor" strokeWidth={0} aria-hidden="true" />
            </span>
            ¿Otra noche en blanco frente a ChatGPT?
          </span>
        }
        h1Marked="De la hoja en blanco a [acento]tu negocio armado[/acento] en 30 días"
        subtitleMarked="[b]Esta noche, en 5 minutos,[/b] la IA arma tu primera pieza. Sin cursos."
        ctaLabel={CTA_LABEL}
        ctaHref={CTA_HREF}
        socialProof={
          <ul className="grid grid-cols-3 gap-2">
            {[
              { icono: Gift, texto: '7 días gratis' },
              { icono: ShieldCheck, texto: '15 días de garantía' },
              { icono: MousePointerClick, texto: 'Cancelas en 1 toque' },
            ].map(({ icono: Icono, texto }) => (
              <li key={texto} className="flex flex-col items-center gap-1.5 text-center leading-tight">
                <span className="relieve-piedra flex size-7 items-center justify-center rounded-[var(--radius-chip)]">
                  <Icono size={13} strokeWidth={2.5} aria-hidden="true" />
                </span>
                {texto}
              </li>
            ))}
          </ul>
        }
        visual={<DemoMisionHero />}
      />

      <Problema
        titulo="¿Te suena [acento]alguna de estas noches[/acento]?"
        preguntas={[
          { icon: MessageSquareDashed, textoMarked: '«Abro ChatGPT y me quedo [b]en blanco[/b].»' },
          { icon: Lightbulb, textoMarked: '«Tengo mil ideas, pero no sé [b]cuál es el paso 1[/b].»' },
          { icon: MonitorPlay, textoMarked: '«Se me van [b]mis 2 horas libres[/b] en tutoriales.»' },
          { icon: Users, textoMarked: '«Veo a otros facturando con IA y [b]me siento un tonto[/b].»' },
          { icon: TrendingDown, textoMarked: '«Siento que [b]la IA me deja atrás[/b] y sigo atado al sueldo.»' },
        ]}
      />

      <Agitacion
        frases={[
          'Y cada noche así es [b]tiempo que no vuelve[/b]:',
          'Y otro curso no lo arregla: [b]más información no es más avance[/b].',
        ]}
        cifras={[
          { valor: 40, sufijo: 'h', etiqueta: 'al mes, sin avanzar', icon: Hourglass },
          { valor: 300, prefijo: '$', etiqueta: 'en otro curso a medias', icon: BookX },
          { valor: 12, sufijo: 'meses', etiqueta: 'más atado al sueldo', icon: CalendarX2 },
        ]}
      />

      <Solucion
        tituloMarked="No te falta información: te falta [acento]el paso de hoy[/acento]"
        mecanismo="el Método Pieza a Pieza"
        bigIdeaMarked="Cada día haces una misión de 5 minutos y la IA arma [b]una pieza de tu negocio[/b] usando las anteriores."
        pasos={[
          { icon: MessageSquareText, titulo: 'Cuenta tu idea', detalle: 'En 1 minuto, aunque sea vaga. La IA la entiende.' },
          { icon: Zap, titulo: 'Haz la misión del día', detalle: '5 minutos desde el celular: una mini lección y la IA trabaja.' },
          { icon: Puzzle, titulo: 'Suma una pieza', detalle: 'Tu oferta, tu nombre, tus textos: todo queda en Mi Empresa.' },
        ]}
        antesDespues={{
          labelAntes: 'Antes',
          antes: 'Hoja en blanco, 40 prompts guardados y ningún paso claro.',
          labelDespues: 'Día 30',
          despues: 'Oferta, nombre, precio y textos de venta listos para lanzar.',
        }}
      />

      <AppPorDentro
        tituloMarked="Tu negocio, [acento]pieza a pieza[/acento]"
        frames={[
          { label: 'Tu misión de hoy, en 5 minutos', src: '/landing/hoy-v2.png', alt: 'Vista previa: pantalla Hoy con la misión del día' },
          { label: 'Tu ruta de 30 días', src: '/landing/ruta-v2.png', alt: 'Vista previa: mapa de la ruta de 30 días' },
          { label: 'La IA armando tu pieza', src: '/landing/mision-v2.png', alt: 'Vista previa: la IA propone 5 nombres para tu negocio' },
          { label: 'Tu negocio completo', src: '/landing/mi-empresa-v2.png', alt: 'Vista previa: Mi Empresa con las piezas armadas' },
        ]}
        ctaLabel={CTA_LABEL}
        ctaHref={CTA_HREF}
      />

      <Oferta
        tituloMarked="Empieza gratis. Sigue por [acento]$0.22 al día[/acento]"
        trialDias={7}
        stack={{
          lineas: [{ resultado: 'Mes a mes', valor: '$120' }],
          totalTachado: '$120',
          nota: 'Anual: $79.99',
        }}
        anual={{
          nombre: 'Anual',
          badge: 'MEJOR PRECIO',
          precioMes: '$6.67',
          totalAnual: 'Se cobra $79.99/año',
          ahorro: '4 meses gratis',
          descomposicionDia: 'menos de $0.22 al día',
          ctaLabel: 'Empezar mis 7 días gratis',
          ctaHref: CTA_ANUAL,
          features: FEATURES_ANUAL,
        }}
        mensual={{
          nombre: 'Mensual',
          precioMes: '$9.99',
          descomposicionDia: 'menos de $0.34 al día',
          ctaLabel: 'Empezar mis 7 días gratis',
          ctaHref: CTA_MENSUAL,
          features: FEATURES_MENSUAL,
        }}
        microcopyCompra="Pagas seguro por Hotmart · 15 días de garantía desde tu primer pago · te avisamos antes de cobrar"
      />

      <Garantia
        nombre="La Garantía Sin Preguntas"
        condicionMarked="[b]15 días desde tu primer pago.[/b] Si sientes que la app no es para ti, pides la devolución en 1 clic y te devolvemos todo."
        sellos={[
          { icon: Wallet, texto: '100% de vuelta' },
          { icon: MousePointerClick, texto: 'Devolución en 1 clic' },
          { icon: ShieldCheck, texto: 'Pago protegido' },
        ]}
        cta={{ label: CTA_LABEL, href: CTA_HREF }}
      />

      <Faq
        items={[
          {
            icon: Search,
            pregunta: '¿No puedo encontrar estos prompts gratis en internet?',
            respuestaMarked:
              'Los prompts sueltos no se conectan. Aquí la IA usa [b]todo lo que ya armaste[/b] para la pieza de hoy.',
          },
          {
            icon: Wallet,
            pregunta: '¿Tengo que pagar ChatGPT Plus u otra herramienta?',
            respuestaMarked: 'No. La IA ya viene incluida en EMPRESAI: [b]no pagas nada extra[/b].',
          },
          {
            icon: BookX,
            pregunta: '¿Será otro curso que abandono a los 3 días?',
            respuestaMarked: 'No hay videos ni teoría. Son 5 minutos al día y [b]cada día te llevas algo hecho[/b].',
          },
          {
            icon: Sprout,
            pregunta: '¿Sirve si no sé nada de negocios ni de tecnología?',
            respuestaMarked: 'Sí. El día 1 solo cuentas tu idea en 1 minuto y la ruta te lleva paso a paso.',
          },
          {
            icon: Lock,
            pregunta: '¿Me pueden robar la idea?',
            respuestaMarked:
              'Tu idea es tuya: solo tú ves tu negocio, no se usa para entrenar IA y [b]la borras cuando quieras[/b].',
          },
          {
            icon: Coffee,
            pregunta: '¿Vale la pena pagar $9.99 al mes?',
            respuestaMarked: 'Es menos que dos cafés. Empiezas con [b]7 días gratis[/b] y te avisamos antes del primer cobro.',
          },
        ]}
      />

      <CtaFinal
        icono={
          <span className="relieve-oro flex size-16 items-center justify-center rounded-[var(--radius-chip)]">
            <Zap size={30} fill="currentColor" strokeWidth={0} aria-hidden="true" />
          </span>
        }
        h2Marked="Imagina tu [acento]día 30[/acento] con todo listo"
        futurePacingMarked="Abres Mi Empresa y ahí está: tu oferta, tu nombre, tu precio y tus textos. Solo falta lanzar."
        ctaLabel={CTA_LABEL}
        ctaHref={CTA_HREF}
        recap="7 días gratis · Garantía Sin Preguntas"
        psMarked="PS: EMPRESAI convierte tu idea en un negocio listo en 30 días con el Método Pieza a Pieza. Entras con 7 días gratis y la Garantía Sin Preguntas."
      />

      <FooterLegal
        appName="EMPRESAI"
        logo={<LogoEmpresai tamano={24} />}
        soporteEmail={RESPONSABLE.emailContacto}
        enlaces={[
          { label: 'Privacidad', href: '/privacidad' },
          { label: 'Términos', href: '/terminos' },
          { label: 'Reembolsos', href: '/reembolsos' },
          { label: 'Aviso de IA', href: '/aviso-ia' },
        ]}
      />

      <StickyCtaMobile labelComercial={CTA_LABEL} href={CTA_HREF} />
    </div>
  );
}
