// SALUD (21): ¿funciona todo? Avisos de Hotmart, errores de la app agrupados (los que afectan a más
// personas primero), accesos que vencieron sin aviso y alertas enviadas. Sin jerga.

import Link from 'next/link';
import { CircleAlert, CircleCheck } from 'lucide-react';
import { Dato, Encabezado, SinDatos, Tarjeta, TituloTarjeta } from '@/components/admin/ui';
import { entero, fechaHora } from '@/lib/panel-formato';
import { leerSalud } from '@/lib/servidor/panel';

const RESULTADO: Record<string, string> = {
  applied: 'Aplicados',
  duplicate: 'Repetidos (ya estaban)',
  ignored: 'Sin efecto',
  illegal: 'Rechazados (reembolso previo)',
  rejected: 'Rechazados (otro producto o viejos)',
  unauthorized: 'Con clave incorrecta',
  error: 'Fallaron',
};

const ALERTA: Record<string, string> = {
  'ia-tope': 'La IA se pausó por llegar al tope de gasto',
  'accesos-vencidos': 'Accesos vencidos sin aviso de Hotmart',
};

export default async function SaludPanel() {
  const s = await leerSalud();
  const problemas = s.webhook_errores_24h + s.pagaron_sin_acceso + s.vencidos_sin_aviso + (s.errores_hoy >= 10 ? 1 : 0);
  const totalWebhook = Object.values(s.webhook_7d).reduce((t, n) => t + n, 0);

  return (
    <>
      <Encabezado titulo="Salud" periodo="Últimos 7 días" />

      <div
        role="status"
        className={`mb-4 flex items-center gap-3 rounded-[var(--radius-card)] border p-4 ${
          problemas === 0
            ? 'border-[color-mix(in_oklab,var(--green)_35%,transparent)] bg-[color-mix(in_oklab,var(--green)_8%,transparent)]'
            : 'border-[color-mix(in_oklab,var(--warning)_45%,transparent)] bg-[color-mix(in_oklab,var(--warning)_8%,transparent)]'
        }`}
      >
        {problemas === 0 ? <CircleCheck size={22} className="shrink-0 text-green" aria-hidden="true" /> : <CircleAlert size={22} className="shrink-0 text-warning" aria-hidden="true" />}
        <p className="text-ayuda text-ink-1">
          <strong className="font-semibold">{problemas === 0 ? 'Todo funciona bien.' : 'Hay cosas que revisar.'}</strong>{' '}
          {problemas === 0 ? 'Los pagos dan acceso y no hay errores que se repitan.' : 'Míralas abajo: están ordenadas por lo que más afecta.'}
        </p>
      </div>

      <div className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Tarjeta>
          <Dato
            etiqueta="Pagaron y no tienen acceso"
            valor={entero(s.pagaron_sin_acceso)}
            tono={s.pagaron_sin_acceso > 0 ? 'mal' : 'bien'}
            detalle={s.pagaron_sin_acceso > 0 ? <Link href="/admin/usuarios?estado=sin-acceso" className="font-semibold text-ink-1 underline underline-offset-4">Verlos y darles acceso</Link> : 'Todos recibieron su acceso'}
          />
        </Tarjeta>
        <Tarjeta>
          <Dato
            etiqueta="Avisos de Hotmart con fallo (24 h)"
            valor={entero(s.webhook_errores_24h)}
            tono={s.webhook_errores_24h > 0 ? 'mal' : 'bien'}
            detalle={s.webhook_ultimo ? `Último aviso: ${fechaHora(s.webhook_ultimo)}` : 'Hotmart todavía no envió avisos'}
          />
        </Tarjeta>
        <Tarjeta>
          <Dato
            etiqueta="Vencidos sin aviso"
            valor={entero(s.vencidos_sin_aviso)}
            tono={s.vencidos_sin_aviso > 0 ? 'mal' : 'bien'}
            detalle={s.vencidos_sin_aviso > 0 ? <Link href="/admin/usuarios?estado=vencido" className="font-semibold text-ink-1 underline underline-offset-4">Revisarlos</Link> : 'Ninguno'}
          />
        </Tarjeta>
        <Tarjeta>
          <Dato etiqueta="Errores hoy" valor={entero(s.errores_hoy)} tono={s.errores_hoy >= 10 ? 'mal' : 'neutro'} detalle="En pantallas y servidor" />
        </Tarjeta>
      </div>

      <div className="mb-4 grid gap-3 lg:grid-cols-2">
        <Tarjeta>
          <TituloTarjeta ayuda="Cada compra, renovación, cancelación o reembolso llega como un aviso.">Avisos de Hotmart</TituloTarjeta>
          {totalWebhook === 0 ? (
            <SinDatos porque="Aparecen cuando conectes Hotmart y entre el primer aviso." />
          ) : (
            <ul className="flex flex-col gap-2">
              {Object.entries(s.webhook_7d)
                .sort((a, b) => b[1] - a[1])
                .map(([r, n]) => (
                  <li key={r} className="flex justify-between gap-3 text-caption">
                    <span className={r === 'error' || r === 'unauthorized' ? 'text-danger' : 'text-ink-1'}>{RESULTADO[r] ?? r}</span>
                    <span className="tabular-nums text-ink-2">{entero(n)}</span>
                  </li>
                ))}
            </ul>
          )}
        </Tarjeta>
        <Tarjeta>
          <TituloTarjeta ayuda="Avisos que la app te mandó por correo.">Alertas enviadas</TituloTarjeta>
          {s.alertas.length === 0 ? (
            <SinDatos porque="No hubo alertas." />
          ) : (
            <ul className="flex flex-col gap-2">
              {s.alertas.map((a) => (
                <li key={a.clave} className="flex justify-between gap-3 text-caption">
                  <span className="text-ink-1">{Object.entries(ALERTA).find(([k]) => a.clave.startsWith(k))?.[1] ?? a.clave}</span>
                  <span className="shrink-0 text-ink-3">{fechaHora(a.en)}</span>
                </li>
              ))}
            </ul>
          )}
        </Tarjeta>
      </div>

      <Tarjeta>
        <TituloTarjeta ayuda="Los que afectan a más personas primero. Si uno se repite, pásamelo para arreglarlo.">Errores de la app</TituloTarjeta>
        {s.errores_7d.length === 0 ? (
          <SinDatos porque="No hubo errores esta semana." />
        ) : (
          <ul className="divide-y divide-[var(--line)]">
            {s.errores_7d.map((e, i) => (
              <li key={`${e.mensaje}-${i}`} className="py-2">
                <p className="text-caption font-semibold break-words text-ink-1">{e.mensaje}</p>
                <p className="mt-1 text-xs text-ink-3">
                  {e.origen === 'cliente' ? 'En la pantalla' : 'En el servidor'} {e.ruta && `· ${e.ruta}`} · {entero(e.veces)} {e.veces === 1 ? 'vez' : 'veces'}
                  {e.personas > 0 && ` · ${entero(e.personas)} ${e.personas === 1 ? 'persona' : 'personas'}`} · último {fechaHora(e.ultima)}
                </p>
              </li>
            ))}
          </ul>
        )}
      </Tarjeta>
    </>
  );
}
