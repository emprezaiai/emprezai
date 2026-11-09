// CANALES (21/34/40): de dónde vienen los clientes, cuánto cuesta conseguir cada uno, cuánto deja en
// su vida (estimado) y si el canal gana o pierde. El canal sale del código sck del enlace de Hotmart.

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Dato, Encabezado, SinDatos, Tarjeta, TituloTarjeta } from '@/components/admin/ui';
import { dinero, entero } from '@/lib/panel-formato';
import { calcularChurn, calcularLtv, leerCanales, leerClientes, leerVentas, periodoMes } from '@/lib/servidor/panel';

function semaforo(ratio: number | null) {
  if (ratio === null) return { texto: 'Sin gasto anotado', tono: 'text-ink-3' };
  if (ratio >= 3) return { texto: 'Sano', tono: 'text-green' };
  if (ratio >= 1) return { texto: 'Gana poco', tono: 'text-warning' };
  return { texto: 'Pierde dinero', tono: 'text-danger' };
}

export default async function CanalesPanel() {
  const mes = periodoMes(0);
  const [canales, clientes, ventasAnt] = await Promise.all([leerCanales(mes, 'canales_mes'), leerClientes(), leerVentas(periodoMes(-1), 'ventas_mes_anterior_completo')]);
  const churn = calcularChurn(ventasAnt);
  const vida = calcularLtv(clientes, churn.total);
  const filas = canales
    .map((c) => {
      const neto = c.dinero.filter((m) => m.moneda === 'USD').reduce((t, m) => t + m.neto_minor - m.devuelto_minor, 0) / 100;
      const cac = c.gasto_usd > 0 && c.clientes > 0 ? c.gasto_usd / c.clientes : null;
      const valor = vida ? c.siguen * vida.ltv : null;
      const ratio = c.gasto_usd > 0 && valor !== null ? valor / c.gasto_usd : null;
      const arpuMes = vida ? vida.ltv / vida.vidaMeses : null;
      const recupero = cac !== null && arpuMes ? cac / arpuMes : null;
      return { ...c, neto, cac, ratio, recupero, gananciaMes: neto - c.gasto_usd };
    })
    .sort((a, b) => b.clientes - a.clientes);
  const gastoTotal = filas.reduce((t, f) => t + f.gasto_usd, 0);
  const clientesConGasto = filas.filter((f) => f.gasto_usd > 0).reduce((t, f) => t + f.clientes, 0);
  const cacGeneral = gastoTotal > 0 && clientesConGasto > 0 ? gastoTotal / clientesConGasto : null;

  return (
    <>
      <Encabezado titulo="Canales" periodo={mes.etiqueta}>
        De dónde vienen tus clientes y si cada canal te deja dinero.
      </Encabezado>

      <div className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-3">
        <Tarjeta>
          <Dato etiqueta="Gastaste en anuncios" valor={gastoTotal > 0 ? dinero(gastoTotal) : null} detalle={gastoTotal > 0 ? 'Lo que anotaste en Ajustes' : 'Anota tu gasto por canal en Ajustes'} />
        </Tarjeta>
        <Tarjeta>
          <Dato etiqueta="Conseguir un cliente te cuesta" valor={cacGeneral !== null ? dinero(cacGeneral) : null} detalle={cacGeneral !== null ? 'Promedio de los canales con gasto' : 'Se calcula con gasto y clientes del mismo canal'} />
        </Tarjeta>
        <Tarjeta className="col-span-2 lg:col-span-1">
          <Dato
            etiqueta="Un cliente te deja en total"
            valor={vida ? dinero(vida.ltv) : null}
            estimado={Boolean(vida)}
            detalle={vida ? `Se queda unos ${Math.round(vida.vidaMeses)} meses (tope 24) según quiénes se van` : 'Aparece con el primer cliente pagando'}
          />
        </Tarjeta>
      </div>

      <Tarjeta className="mb-4">
        <TituloTarjeta ayuda="Lo sano es que cada $1 que gastas en un canal vuelva como $3 o más.">Cada canal este mes</TituloTarjeta>
        {filas.length === 0 ? (
          <SinDatos porque="Aparecen con los primeros clientes. Para saber de dónde vienen, agrega ?sck=tiktok (o instagram, afiliado-ana…) al final de tu enlace de Hotmart en cada lugar donde lo publiques." />
        ) : (
          <ul className="flex flex-col gap-3">
            {filas.map((f) => {
              const s = semaforo(f.ratio);
              return (
                <li key={f.canal} className="rounded-[var(--radius-chip)] bg-sunken p-3">
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="font-display text-base font-bold break-all text-ink-1">{f.canal}</span>
                    <span className={`shrink-0 text-caption font-semibold ${s.tono}`}>{s.texto}</span>
                  </div>
                  <dl className="mt-2 grid grid-cols-2 gap-x-3 gap-y-2 sm:grid-cols-4">
                    <div>
                      <dt className="text-xs text-ink-3">Clientes nuevos</dt>
                      <dd className="text-ayuda font-semibold tabular-nums text-ink-1">
                        {entero(f.clientes)} <span className="text-caption font-normal text-ink-3">({entero(f.siguen)} siguen)</span>
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs text-ink-3">Gastaste</dt>
                      <dd className="text-ayuda font-semibold tabular-nums text-ink-1">{f.gasto_usd > 0 ? dinero(f.gasto_usd) : '—'}</dd>
                    </div>
                    <div>
                      <dt className="text-xs text-ink-3">Cada cliente costó</dt>
                      <dd className="text-ayuda font-semibold tabular-nums text-ink-1">{f.cac !== null ? dinero(f.cac) : '—'}</dd>
                    </div>
                    <div>
                      <dt className="text-xs text-ink-3">Vuelve por cada $1</dt>
                      <dd className={`text-ayuda font-semibold tabular-nums ${s.tono}`}>{f.ratio !== null ? `$${f.ratio.toFixed(1)}` : '—'}</dd>
                    </div>
                  </dl>
                  <p className="mt-2 text-caption text-ink-2">
                    Cobrado este mes: <strong className="font-semibold text-ink-1 tabular-nums">{dinero(f.neto)}</strong>
                    {f.gasto_usd > 0 && (
                      <>
                        {' '}· este mes va <strong className={`font-semibold tabular-nums ${f.gananciaMes >= 0 ? 'text-green' : 'text-danger'}`}>{dinero(f.gananciaMes)}</strong>
                      </>
                    )}
                    {f.recupero !== null && <> · recuperas lo gastado en unos {Math.max(1, Math.ceil(f.recupero))} {Math.ceil(f.recupero) === 1 ? 'mes' : 'meses'}</>}
                  </p>
                </li>
              );
            })}
          </ul>
        )}
        <p className="mt-3 text-caption text-ink-3">
          &quot;Vuelve por cada $1&quot; usa lo que dejaría en total cada cliente que sigue activo (estimado). Una suscripción casi nunca se paga en el primer mes: por eso el mes puede ir en negativo y el canal ser sano.
        </p>
      </Tarjeta>

      <Link
        href="/admin/ajustes#gastos"
        className="tarjeta-relieve-base flex min-h-12 items-center gap-3 rounded-[var(--radius-card)] px-4 text-ayuda font-semibold text-ink-1 transition-colors duration-150 hover:bg-raised"
      >
        Anotar lo que gastas en cada canal
        <ArrowRight size={16} className="ml-auto text-ink-3" aria-hidden="true" />
      </Link>
    </>
  );
}
