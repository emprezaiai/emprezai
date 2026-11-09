// SALUD (21): ¿funciona todo? El estado general cuenta TODO lo que hay que revisar (incluidos errores
// repetidos y avisos de Hotmart fallidos de la semana). Los errores se muestran en palabras simples y
// el detalle técnico se copia con un botón para pasárselo a quien lo arregla.

import Link from 'next/link';
import { CircleAlert, CircleCheck } from 'lucide-react';
import { BotonCopiar } from '@/components/admin/BotonCopiar';
import { Entrada } from '@/components/admin/movimiento';
import { Dato, Encabezado, SinDatos, Tarjeta, TituloTarjeta } from '@/components/admin/ui';
import { entero, fechaHora } from '@/lib/panel-formato';
import { leerSalud } from '@/lib/servidor/panel';

const RESULTADO: Record<string, string> = {
  applied: 'Se aplicaron bien',
  duplicate: 'Llegaron repetidos (sin efecto)',
  ignored: 'No cambiaban nada',
  illegal: 'Rechazados: la persona ya tenía un reembolso',
  rejected: 'Rechazados: de otro producto o muy viejos',
  unauthorized: 'Con la clave equivocada',
  error: 'No se pudieron aplicar',
};

const TIPO_AVISO: Record<string, string> = {
  PURCHASE_APPROVED: 'una compra',
  PURCHASE_COMPLETE: 'una compra',
  PURCHASE_CANCELED: 'una cancelación',
  PURCHASE_REFUNDED: 'un reembolso',
  PURCHASE_CHARGEBACK: 'un contracargo',
  PURCHASE_DELAYED: 'un pago atrasado',
  SUBSCRIPTION_CANCELLATION: 'una cancelación de suscripción',
  SWITCH_PLAN: 'un cambio de plan',
};

const ALERTA: [string, string][] = [
  ['ia-tope', 'La IA se pausó por llegar al tope de gasto'],
  ['accesos-vencidos', 'Accesos que vencieron sin aviso de Hotmart'],
];

const LUGAR: Record<string, string> = {
  '/app': 'Hoy',
  '/app/empresa': 'Mi Empresa',
  '/app/ruta': 'la Ruta',
  '/app/mision': 'la misión del día',
  '/app/perfil': 'el Perfil',
  'ia/mision': 'las misiones con IA',
  'ia/primera-pieza': 'la pieza 1 gratis',
  'acceso/enviar': 'el envío del enlace para entrar',
  'acceso/verificar': 'el código para entrar',
  piezas: 'el guardado de piezas',
  eventos: 'el registro de visitas',
};

/** El error en palabras de la dueña (el detalle técnico queda para copiar). */
function enSimple(mensaje: string, ruta: string | null, origen: string): string {
  const donde = (ruta && LUGAR[ruta]) || (ruta?.startsWith('/admin') ? 'el panel' : null);
  if (/IaNoDisponible/.test(mensaje)) return `La IA no respondió en ${donde ?? 'la app'} (la pieza se armó con las respuestas, sin IA)`;
  if (/FaltaConfiguracion|no-configurado/.test(mensaje)) return `Falta una configuración en ${donde ?? 'la app'}`;
  if (origen === 'cliente') return `Una pantalla no cargó bien${donde ? ` en ${donde}` : ''}`;
  return `Algo falló en el servidor${donde ? ` (${donde})` : ''}`;
}

export default async function SaludPanel() {
  const s = await leerSalud();
  const fallosHotmart7d = (s.webhook_7d.error ?? 0) + (s.webhook_7d.unauthorized ?? 0);
  const repetidos = s.errores_7d.filter((e) => e.veces >= 3 || e.personas >= 2);
  const problemas = s.pagaron_sin_acceso + s.vencidos_sin_aviso + fallosHotmart7d + repetidos.length + (s.errores_hoy >= 10 ? 1 : 0);
  const totalWebhook = Object.values(s.webhook_7d).reduce((t, n) => t + n, 0);
  const erroresSemana = s.errores_7d_total ?? s.errores_7d.reduce((t, e) => t + e.veces, 0);
  const fallidos = s.webhook_fallidos ?? [];
  const razones = [
    s.pagaron_sin_acceso > 0 && `${s.pagaron_sin_acceso} pagaron y no tienen acceso`,
    fallosHotmart7d > 0 && `${fallosHotmart7d} ${fallosHotmart7d === 1 ? 'aviso de pago no se aplicó' : 'avisos de pago no se aplicaron'}`,
    s.vencidos_sin_aviso > 0 && `${s.vencidos_sin_aviso} accesos vencieron sin aviso`,
    repetidos.length > 0 && `${repetidos.length} ${repetidos.length === 1 ? 'error se repite' : 'errores se repiten'}`,
  ].filter(Boolean) as string[];

  // Bloques en orden de impacto: si hay pagos que no se aplicaron, Hotmart va antes que los errores.
  const bloqueHotmart = (
    <Tarjeta className="mb-4" indice={fallosHotmart7d > 0 ? 6 : 7}>
      <TituloTarjeta ayuda="Cada compra, renovación, cancelación o reembolso llega como un aviso de Hotmart.">Avisos de pago de Hotmart</TituloTarjeta>
      {totalWebhook === 0 ? (
        <SinDatos porque="Aparecen cuando conectes Hotmart y entre el primer aviso." />
      ) : (
        <>
          <ul className="flex flex-col gap-2">
            {Object.entries(s.webhook_7d)
              .sort((a, b) => b[1] - a[1])
              .map(([r, n]) => (
                <li key={r} className="flex justify-between gap-3 text-caption">
                  <span className={r === 'error' || r === 'unauthorized' ? 'font-semibold text-danger' : 'text-ink-1'}>{RESULTADO[r] ?? r}</span>
                  <span className="tabular-nums text-ink-2">{entero(n)}</span>
                </li>
              ))}
          </ul>
          {fallidos.length > 0 && (
            <ul className="mt-3 flex flex-col divide-y divide-[var(--line)] border-t border-[var(--line)]">
              {fallidos.map((w, i) => (
                <li key={`${w.en}-${i}`} className="flex items-start gap-2 pt-2">
                  <CircleAlert size={16} className="mt-0.5 shrink-0 text-danger" aria-hidden="true" />
                  <span className="min-w-0 flex-1">
                    <span className="block text-caption font-semibold break-all text-ink-1">{w.email ?? 'Hotmart no envió el correo'}</span>
                    <span className="block text-xs text-ink-3">
                      Aviso de {TIPO_AVISO[w.tipo ?? ''] ?? 'un pago'} · {fechaHora(w.en)}
                      {w.resultado === 'unauthorized' && ' · llegó con la clave equivocada'}
                    </span>
                    <span className="flex flex-wrap items-center gap-x-4">
                      {w.email && <BotonCopiar texto={w.email} etiqueta="Copiar correo" />}
                      <Link href="/admin/usuarios?agregar=1" className="inline-flex min-h-11 items-center text-caption font-semibold text-ink-1 underline underline-offset-4">
                        Darle acceso
                      </Link>
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          )}
          {fallosHotmart7d > 0 && (
            <p className="mt-2 text-caption text-ink-2">
              <strong className="font-semibold text-ink-1">Qué hacer:</strong> Hotmart vuelve a intentarlo solo. Si en un día la persona sigue sin acceso, copia su correo y dale acceso tú.
            </p>
          )}
        </>
      )}
    </Tarjeta>
  );
  const bloqueErrores = (
    <Tarjeta className="mb-4 [&>section]:pb-1" indice={fallosHotmart7d > 0 ? 7 : 6}>
      <TituloTarjeta ayuda="Los que más se repiten primero. Copia el detalle y mándaselo a quien te ayuda con la app.">Errores de la app</TituloTarjeta>
      {s.errores_7d.length === 0 ? (
        <SinDatos porque="No hubo errores esta semana." />
      ) : (
        <ul className="divide-y divide-[var(--line)]">
          {s.errores_7d.map((e, i) => (
            <li key={`${e.mensaje}-${i}`} className="pt-2 last:pb-0">
              <p className="text-caption font-semibold text-ink-1">{enSimple(e.mensaje, e.ruta, e.origen)}</p>
              <p className="mt-1 text-xs text-ink-3">
                {entero(e.veces)} {e.veces === 1 ? 'vez' : 'veces'}
                {e.personas > 0 && ` · ${entero(e.personas)} ${e.personas === 1 ? 'persona' : 'personas'}`} · la última {fechaHora(e.ultima)}
              </p>
              <BotonCopiar texto={`${e.origen} · ${e.ruta ?? '-'} · ${e.mensaje} · ${e.veces} veces · último ${e.ultima}`} etiqueta="Copiar el detalle" />
            </li>
          ))}
        </ul>
      )}
    </Tarjeta>
  );

  return (
    <>
      <Encabezado titulo="Salud" periodo="Últimos 7 días" />

      <Entrada indice={1} className="mb-4">
        <div
          role="status"
          className={`flex items-start gap-3 rounded-[var(--radius-card)] border p-4 ${
            problemas === 0
              ? 'border-[color-mix(in_oklab,var(--green)_35%,transparent)] bg-[color-mix(in_oklab,var(--green)_8%,transparent)]'
              : 'border-[color-mix(in_oklab,var(--warning)_45%,transparent)] bg-[color-mix(in_oklab,var(--warning)_8%,transparent)]'
          }`}
        >
          {problemas === 0 ? (
            <CircleCheck size={22} className="mt-0.5 shrink-0 text-green" aria-hidden="true" />
          ) : (
            <CircleAlert size={22} className="mt-0.5 shrink-0 text-warning" aria-hidden="true" />
          )}
          <p className="text-ayuda text-ink-1">
            <strong className="font-semibold">{problemas === 0 ? 'Todo funciona bien.' : 'Hay cosas que revisar.'}</strong>{' '}
            {problemas === 0 ? 'Los pagos dan acceso y no hay errores que se repitan.' : `${razones.join(' · ')}. Están abajo, de lo que más afecta a lo que menos.`}
          </p>
        </div>
      </Entrada>

      <div className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Tarjeta indice={2}>
          <Dato
            etiqueta="Pagaron sin acceso"
            numero={s.pagaron_sin_acceso}
            tono={s.pagaron_sin_acceso > 0 ? 'mal' : 'bien'}
            detalle={
              s.pagaron_sin_acceso > 0 ? (
                <Link href="/admin/usuarios?estado=sin-acceso" className="font-semibold text-ink-1 underline underline-offset-4">
                  Darles acceso
                </Link>
              ) : (
                'Todos recibieron su acceso'
              )
            }
          />
        </Tarjeta>
        <Tarjeta indice={3}>
          <Dato
            etiqueta="Pagos que no se aplicaron"
            numero={fallosHotmart7d}
            tono={fallosHotmart7d > 0 ? 'mal' : 'bien'}
            detalle={fallidos[0] ? `El último falló el ${fechaHora(fallidos[0].en)}` : s.webhook_ultimo ? `Todos bien · el último, ${fechaHora(s.webhook_ultimo)}` : 'Hotmart todavía no envió avisos'}
          />
        </Tarjeta>
        <Tarjeta indice={4}>
          <Dato
            etiqueta="Vencidos sin aviso"
            numero={s.vencidos_sin_aviso}
            tono={s.vencidos_sin_aviso > 0 ? 'mal' : 'bien'}
            detalle={
              s.vencidos_sin_aviso > 0 ? (
                <Link href="/admin/usuarios?estado=vencido" className="font-semibold text-ink-1 underline underline-offset-4">
                  Revisarlos
                </Link>
              ) : (
                'Ninguno'
              )
            }
          />
        </Tarjeta>
        <Tarjeta indice={5}>
          <Dato etiqueta="Errores de la semana" numero={erroresSemana} tono={repetidos.length > 0 ? 'mal' : 'neutro'} detalle={`${entero(s.errores_hoy)} hoy`} />
        </Tarjeta>
      </div>

      {fallosHotmart7d > 0 ? bloqueHotmart : bloqueErrores}
      {fallosHotmart7d > 0 ? bloqueErrores : bloqueHotmart}
      <Tarjeta indice={8}>
        <TituloTarjeta ayuda="Avisos que la app te mandó por correo.">Alertas enviadas</TituloTarjeta>
        {s.alertas.length === 0 ? (
          <SinDatos porque="No hubo alertas." />
        ) : (
          <ul className="flex flex-col gap-2">
            {s.alertas.map((a) => (
              <li key={a.clave} className="flex justify-between gap-3 text-caption">
                <span className="text-ink-1">{ALERTA.find(([k]) => a.clave.startsWith(k))?.[1] ?? 'Alerta de la app'}</span>
                <span className="shrink-0 text-ink-3">{fechaHora(a.en)}</span>
              </li>
            ))}
          </ul>
        )}
      </Tarjeta>
    </>
  );
}
