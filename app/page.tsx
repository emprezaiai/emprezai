'use client';

// Página de ventas de EMPRESAI — estructura canónica de 10 secciones (19) compuesta desde el kit
// (components/landing). Todo el copy sale de docs/copy/landing.md (marcado y trazado a FICHA-AVATAR.md).
// Modelo 2 anónimo (ESTADO.md): todos los CTA llevan a /onboarding; el pago se cierra en la pantalla de planes.

import { BookmarkX, Lightbulb, MessageSquareDashed, TrendingDown, Users } from 'lucide-react';
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
const FEATURES_BASE = [
  'Tu misión de 5 minutos, cada día',
  'La IA arma cada pieza con tu negocio',
  'Todo guardado en Mi Empresa, listo para descargar',
  'Nuevas rutas cada mes después del día 30',
];

export default function PaginaDeVentas() {
  useEventoAlMontar('landing_vista');

  return (
    <div className="min-h-dvh bg-[var(--bg)] text-[var(--text-primary)] [font-family:var(--font-body)]">
      <Hero
        appName="EMPRESAI"
        logo={<LogoEmpresai />}
        h1Marked="Hoy, en [acento]5 minutos[/acento], la IA arma tu primera oferta"
        subtitleMarked="Tu negocio en [b]30 días[/b], pieza a pieza. Sin cursos ni hoja en blanco."
        ctaLabel={CTA_LABEL}
        ctaHref={CTA_HREF}
        socialProof={<span>7 días gratis · 15 días de garantía · cancelas en 1 toque</span>}
        visual={<DemoMisionHero />}
      />

      <Problema
        titulo="¿Te suena?"
        preguntas={[
          { icon: MessageSquareDashed, textoMarked: '¿Abres ChatGPT y te quedas [b]en blanco[/b] sin saber qué escribir?' },
          { icon: Lightbulb, textoMarked: '¿Tienes mil ideas, pero no sabes [b]cuál es el paso 1[/b]?' },
          { icon: Users, textoMarked: '¿Ves a otros lanzando negocios con IA y [b]tú sigues sin empezar[/b]?' },
          { icon: BookmarkX, textoMarked: '¿Guardaste cientos de prompts de TikTok que nunca usaste?' },
          { icon: TrendingDown, textoMarked: '¿Sientes que la IA avanza y [b]te estás quedando atrás[/b]?' },
        ]}
      />

      <Agitacion
        frases={[
          'A las 7 de la noche abres ChatGPT, te quedas en blanco y cierras la laptop.',
          'Dos horas por noche así son [b]40 horas al mes[/b].',
          'En un año, eso es [acento]otro año atado al sueldo[/acento], sin haber lanzado nada.',
          'Otro curso de $300 no lo arregla: [b]más información no es más avance[/b].',
        ]}
      />

      <Solucion
        tituloMarked="No necesitas otro curso: necesitas [acento]tu negocio armado[/acento]"
        mecanismo="el Método Pieza a Pieza"
        bigIdeaMarked="No te falta información: te falta el paso de hoy. Cada día la IA arma [b]una pieza de tu negocio[/b] con las anteriores."
        pasos={[
          { titulo: 'Cuenta tu idea', detalle: 'En 1 minuto, aunque sea vaga. La IA la entiende.' },
          { titulo: 'Haz la misión del día', detalle: '5 minutos desde el celular: una mini lección y la IA trabaja.' },
          { titulo: 'Suma una pieza', detalle: 'Tu oferta, tu nombre, tus textos: todo queda en Mi Empresa.' },
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
          lineas: [
            { resultado: '12 meses de misiones diarias con IA', valor: '$120' },
            { resultado: 'Nuevas rutas después del día 30', valor: 'Incluidas' },
            { resultado: 'Tu negocio en un documento descargable', valor: 'Incluido' },
          ],
          totalTachado: '$120',
          nota: 'Todo incluido en ambos planes. Anual: $6.67/mes.',
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
          features: FEATURES_BASE,
        }}
        mensual={{
          nombre: 'Mensual',
          precioMes: '$9.99',
          descomposicionDia: 'menos de $0.34 al día',
          ctaLabel: 'Empezar mis 7 días gratis',
          ctaHref: CTA_MENSUAL,
          features: [...FEATURES_BASE, 'Cancelas en 1 toque, cuando quieras'],
        }}
        microcopyCompra="Pagas seguro por Hotmart · te avisamos antes del primer cobro · cancelas en 1 toque"
      />

      <Garantia
        nombre="La Garantía de la Primera Oferta"
        condicionMarked="Tienes 15 días de garantía: si la IA no te entrega [b]tu oferta lista para vender[/b], escribes un correo y te devolvemos todo."
        pisoLegal="Reembolso gestionado por Hotmart · 15 días"
      />

      <Faq
        items={[
          {
            pregunta: '¿No puedo encontrar estos prompts gratis en internet?',
            respuestaMarked:
              'Los prompts sueltos no se conectan. Aquí la IA usa [b]todo lo que ya armaste[/b] para la pieza de hoy.',
          },
          {
            pregunta: '¿Tengo que pagar ChatGPT Plus u otra herramienta?',
            respuestaMarked: 'No. La IA ya viene incluida en EMPRESAI: [b]no pagas nada extra[/b].',
          },
          {
            pregunta: '¿Será otro curso que abandono a los 3 días?',
            respuestaMarked: 'No hay videos ni teoría. Son 5 minutos al día y [b]cada día te llevas algo hecho[/b].',
          },
          {
            pregunta: '¿Sirve si no sé nada de negocios ni de tecnología?',
            respuestaMarked: 'Sí. El día 1 solo cuentas tu idea en 1 minuto y la ruta te lleva paso a paso.',
          },
          {
            pregunta: '¿Me pueden robar la idea?',
            respuestaMarked:
              'Tu idea es tuya: solo tú ves tu negocio, no se usa para entrenar IA y [b]la borras cuando quieras[/b].',
          },
          {
            pregunta: '¿Vale la pena pagar $9.99 al mes?',
            respuestaMarked: 'Es menos que dos cafés. Empiezas con [b]7 días gratis[/b] y te avisamos antes del primer cobro.',
          },
        ]}
      />

      <CtaFinal
        h2Marked="Imagina tu [acento]día 30[/acento] con todo listo"
        futurePacingMarked="Abres Mi Empresa y ahí está: tu oferta, tu nombre, tu precio y tus textos. Solo falta lanzar."
        ctaLabel={CTA_LABEL}
        ctaHref={CTA_HREF}
        recap="7 días gratis · Garantía de la Primera Oferta"
        psMarked="PS: EMPRESAI convierte tu idea en un negocio listo en 30 días con el Método Pieza a Pieza. Entras con 7 días gratis y la Garantía de la Primera Oferta."
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
