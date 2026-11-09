// VENTAS: lo que entró, cuántas pruebas pasaron a pago, quién se fue (voluntario vs pago fallido),
// reembolsos y los últimos cobros. Dinero separado por moneda; nada inventado.

import { Dato, Encabezado, SinDatos, Tarjeta, TituloTarjeta, Variacion } from '@/components/admin/ui';
import { dinero, dineroMinor, entero, fechaHora, pct, variacion } from '@/lib/panel-formato';
import {
  calcularChurn,
  calcularMrr,
  leerClientes,
  leerPruebasSinPago,
  leerUltimosCobros,
  leerVentas,
  periodoMes,
  periodoMesHastaHoy,
} from '@/lib/servidor/panel';

const NOMBRE_ESTADO: Record<string, string> = {
  trialing: 'En prueba gratis',
  active: 'Pagando',
  cancelled: 'Cancelaron (aún con acceso)',
  past_due: 'Pago atrasado',
  expired: 'Vencidos',
  refunded: 'Reembolsados',
  chargeback: 'Contracargo',
};
const NOMBRE_COBRO: Record<string, string> = { sale: 'Venta', refund: 'Reembolso', chargeback: 'Contracargo' };

export default async function VentasPanel() {
  const mes = periodoMes(0);
  const anterior = periodoMesHastaHoy(-1);
  const [ventas, ventasAnt, clientes, sinPago, cobros] = await Promise.all([
    leerVentas(mes, 'ventas_mes'),
    leerVentas(anterior, 'ventas_mes_anterior'),
    leerClientes(),
    leerPruebasSinPago(mes),
    leerUltimosCobros(),
  ]);
  const usd = ventas.dinero.find((d) => d.moneda === 'USD');
  const usdAnt = ventasAnt.dinero.find((d) => d.moneda === 'USD');
  const bruto = usd ? usd.bruto_minor / 100 : 0;
  const brutoAnt = usdAnt ? usdAnt.bruto_minor / 100 : 0;
  const { mrr, pagando } = calcularMrr(clientes);
  const churn = calcularChurn(ventas);
  const pruebasTerminadas = ventas.pruebas_a_pago + sinPago;
  const conversion = pruebasTerminadas > 0 ? (ventas.pruebas_a_pago / pruebasTerminadas) * 100 : null;
  const otras = ventas.dinero.filter((d) => d.moneda !== 'USD' && d.ventas > 0);
  const estados = Object.entries(clientes.por_estado).sort((a, b) => b[1] - a[1]);
  const maxEstado = Math.max(1, ...estados.map(([, n]) => n));

  return (
    <>
      <Encabezado titulo="Ventas" periodo={mes.etiqueta} />

      <div className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Tarjeta>
          <Dato
            etiqueta="Ingresos del mes"
            valor={usd && usd.ventas > 0 ? dinero(bruto) : null}
            tono="oro"
            detalle={
              usd && usd.ventas > 0 ? (
                <>
                  {entero(usd.ventas)} {usd.ventas === 1 ? 'cobro' : 'cobros'} · <Variacion cambio={variacion(bruto, brutoAnt)} contra="los mismos días del mes pasado" />
                </>
              ) : (
                'Aún no hay cobros este mes'
              )
            }
          />
        </Tarjeta>
        <Tarjeta>
          <Dato
            etiqueta="Ingreso mensual recurrente"
            valor={pagando > 0 ? dinero(mrr) : null}
            detalle={pagando > 0 ? `${entero(clientes.activos_mensual)} mensual · ${entero(clientes.activos_anual)} anual` : 'Aparece con el primer cliente pagando'}
          />
        </Tarjeta>
        <Tarjeta>
          <Dato
            etiqueta="Pruebas que pasaron a pago"
            valor={conversion !== null ? pct(conversion) : null}
            tono={conversion !== null && conversion >= 40 ? 'bien' : 'neutro'}
            detalle={
              conversion !== null
                ? `${entero(ventas.pruebas_a_pago)} de ${entero(pruebasTerminadas)} pruebas que terminaron`
                : `${entero(ventas.pruebas_iniciadas)} pruebas nuevas; aún ninguna terminó este mes`
            }
          />
        </Tarjeta>
        <Tarjeta>
          <Dato
            etiqueta="Se fueron este mes"
            valor={churn.total !== null ? pct(churn.total, 1) : null}
            tono={churn.total !== null && churn.total > 8 ? 'mal' : 'neutro'}
            detalle={churn.total !== null ? `de ${entero(ventas.pagando_al_inicio)} que pagaban al empezar el mes` : 'Se mide con clientes pagando desde el mes anterior'}
          />
        </Tarjeta>
      </div>

      <div className="mb-4 grid gap-3 lg:grid-cols-2">
        <Tarjeta>
          <TituloTarjeta ayuda="Separado porque se resuelven distinto: unos decidieron irse, a otros les falló el pago.">Quién se fue y por qué</TituloTarjeta>
          <dl className="grid grid-cols-2 gap-3">
            <div>
              <dt className="text-caption text-ink-2">Cancelaron (decidieron irse)</dt>
              <dd className="font-display text-precio font-extrabold tabular-nums text-ink-1">{entero(ventas.cancelaciones_voluntarias)}</dd>
            </div>
            <div>
              <dt className="text-caption text-ink-2">Perdidos por pago fallido</dt>
              <dd className="font-display text-precio font-extrabold tabular-nums text-ink-1">{entero(ventas.perdidos_por_pago)}</dd>
            </div>
            <div>
              <dt className="text-caption text-ink-2">Cobros que fallaron (aún recuperables)</dt>
              <dd className={`font-display text-precio font-extrabold tabular-nums ${ventas.cobros_fallidos > 0 ? 'text-warning' : 'text-ink-1'}`}>{entero(ventas.cobros_fallidos)}</dd>
            </div>
            <div>
              <dt className="text-caption text-ink-2">Reembolsos y contracargos</dt>
              <dd className="font-display text-precio font-extrabold tabular-nums text-ink-1">{entero(ventas.reembolsados)}</dd>
            </div>
          </dl>
          {usd && usd.reembolsos_minor + usd.contracargos_minor > 0 && (
            <p className="mt-3 text-caption text-ink-2">Devolviste {dineroMinor(usd.reembolsos_minor + usd.contracargos_minor, 'USD')} este mes.</p>
          )}
        </Tarjeta>

        <Tarjeta>
          <TituloTarjeta ayuda="Todas las personas registradas, según su estado de hoy.">Tus clientes hoy</TituloTarjeta>
          {estados.length === 0 ? (
            <SinDatos porque="Todavía no hay nadie registrado. Aparecen con la primera prueba gratis." />
          ) : (
            <ul className="flex flex-col gap-2">
              {estados.map(([estado, n]) => (
                <li key={estado} className="grid grid-cols-[1fr_auto] items-center gap-x-3 gap-y-1">
                  <span className="text-caption text-ink-1">{NOMBRE_ESTADO[estado] ?? estado}</span>
                  <span className="text-caption font-semibold tabular-nums text-ink-1">{entero(n)}</span>
                  <span className="col-span-2 h-1.5 rounded-full bg-sunken">
                    <span
                      className={`block h-full rounded-full ${estado === 'active' || estado === 'trialing' ? 'bg-green' : 'bg-[color-mix(in_oklab,var(--ink-3)_60%,transparent)]'}`}
                      style={{ width: `${(n / maxEstado) * 100}%` }}
                    />
                  </span>
                </li>
              ))}
            </ul>
          )}
          {clientes.manuales > 0 && <p className="mt-3 text-caption text-ink-3">Incluye {entero(clientes.manuales)} agregados a mano (no cuentan como venta).</p>}
        </Tarjeta>
      </div>

      <Tarjeta className="mb-4">
        <TituloTarjeta ayuda="Lo que informó Hotmart, del más reciente al más antiguo.">Últimos movimientos</TituloTarjeta>
        {cobros.length === 0 ? (
          <SinDatos porque="Aparecen cuando Hotmart avise la primera venta." />
        ) : (
          <ul className="divide-y divide-[var(--line)]">
            {cobros.map((c, i) => (
              <li key={`${c.en}-${i}`} className="flex items-center justify-between gap-3 py-2">
                <span className="min-w-0">
                  <span className="block truncate text-caption text-ink-1">{c.email ?? 'Correo no informado'}</span>
                  <span className="block text-xs text-ink-3">
                    {NOMBRE_COBRO[c.tipo] ?? c.tipo} · {fechaHora(c.en)}
                  </span>
                </span>
                <span className={`shrink-0 text-ayuda font-semibold tabular-nums ${c.tipo === 'sale' ? 'text-ink-1' : 'text-danger'}`}>
                  {c.tipo === 'sale' ? '' : '−'}
                  {dineroMinor(c.monto_minor, c.moneda)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </Tarjeta>

      {otras.length > 0 && (
        <Tarjeta>
          <TituloTarjeta ayuda="No se suman a los dólares: no hay un tipo de cambio con fuente para convertirlas.">Ventas en otras monedas</TituloTarjeta>
          <ul className="flex flex-col gap-1">
            {otras.map((o) => (
              <li key={o.moneda} className="flex justify-between text-caption text-ink-1">
                <span>
                  {entero(o.ventas)} {o.ventas === 1 ? 'venta' : 'ventas'} en {o.moneda}
                </span>
                <span className="tabular-nums">{dineroMinor(o.bruto_minor, o.moneda)}</span>
              </li>
            ))}
          </ul>
        </Tarjeta>
      )}
    </>
  );
}
