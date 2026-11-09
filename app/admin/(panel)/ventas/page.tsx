// VENTAS: un número principal (lo que entró) con su tendencia de 6 meses, cuántas pruebas pasaron a
// pago, quién se fue y por qué, tus clientes de hoy (contados igual que en Inicio) y los últimos
// cobros. Dinero separado por moneda; con flechas para ver otros meses.

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Barra, Dato, Encabezado, Lectura, SelectorMes, SinDatos, TOCABLE, Tarjeta, TituloTarjeta, Variacion } from '@/components/admin/ui';
import { Cuenta } from '@/components/admin/movimiento';
import { ChipFiltro } from '@/components/admin/ChipFiltro';
import { dinero, dineroMinor, entero, fechaHora, mesCorto, variacion } from '@/lib/panel-formato';
import {
  calcularChurn,
  calcularMrr,
  gananciaPorMes,
  leerAjustes,
  leerClientes,
  leerPruebasSinPago,
  leerSerie,
  leerCobrosDelMes,
  leerConteosUsuarios,
  leerVentas,
  periodoElegido,
} from '@/lib/servidor/panel';

const NOMBRE_COBRO: Record<string, string> = { sale: 'Cobro', refund: 'Reembolso', chargeback: 'Contracargo' };

export default async function VentasPanel({ searchParams }: { searchParams: Promise<{ mes?: string; tipo?: string }> }) {
  const sp = await searchParams;
  const periodo = periodoElegido(sp.mes);
  const tipo = sp.tipo === 'devoluciones' ? 'devoluciones' : 'todos';
  const [ventas, ventasAnt, clientes, sinPago, cobros, conteos, serie, ajustes] = await Promise.all([
    leerVentas(periodo, 'ventas_mes'),
    leerVentas(periodo.comparar, 'ventas_mes_anterior'),
    leerClientes(),
    leerPruebasSinPago(periodo),
    leerCobrosDelMes(periodo, 300),
    leerConteosUsuarios(''),
    leerSerie(6),
    leerAjustes(),
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
  const meses = gananciaPorMes(serie, ajustes.impuestosPct, 0);
  const maxMes = Math.max(1, ...meses.map((m) => m.ingresos));
  const nadieSeFue = ventas.cancelaciones_voluntarias + ventas.perdidos_por_pago + ventas.cobros_fallidos + ventas.reembolsados === 0;
  // Tus clientes HOY, contados igual que en Inicio (quien entró a mano no cuenta como pago).
  // "Ya no tienen acceso" = el mismo filtro de Usuarios (así el número y su lista coinciden).
  const sinAcceso = conteos.inactivo ?? 0;
  const filasClientes = [
    { texto: 'Pagando', n: pagando, tono: 'verde' as const },
    { texto: 'En prueba gratis', n: clientes.en_prueba, tono: 'verde' as const },
    { texto: 'Acceso regalado por ti', n: clientes.manuales, tono: 'neutra' as const },
    { texto: 'Ya no tienen acceso', n: sinAcceso, tono: 'neutra' as const },
  ].filter((f) => f.n > 0);
  const maxClientes = Math.max(1, ...filasClientes.map((f) => f.n));
  const todos = tipo === 'devoluciones' ? cobros.filter((c) => c.tipo !== 'sale') : cobros;
  const lista = todos.slice(0, 12);
  const resto = todos.slice(12);

  return (
    <div key={periodo.param} className="panel-fundido">
      <Encabezado titulo="Ventas" />
      <SelectorMes periodo={periodo} ruta="/admin/ventas" />

      <Tarjeta destacada className="mb-4" indice={1}>
        <p className="text-caption font-semibold text-ink-2">Lo que entró en {periodo.etiqueta.split(' ')[0]}</p>
        {usd && usd.ventas > 0 ? (
          <>
            <p className="mt-1 font-display text-4xl leading-none font-extrabold text-gold">
              <Cuenta valor={bruto} formato="dinero" decimales={2} />
            </p>
            <p className="mt-2 text-caption text-ink-2">
              {entero(usd.ventas)} {usd.ventas === 1 ? 'cobro' : 'cobros'} · <Variacion cambio={variacion(bruto, brutoAnt)} contra={periodo.textoComparar} />
            </p>
          </>
        ) : (
          <p className="mt-1 text-ayuda text-ink-2">{periodo.esActual ? 'Aún no hay cobros este mes.' : 'No hubo cobros ese mes.'}</p>
        )}
        {meses.some((m) => m.hayVentas) && (
          <ul className="mt-4 flex flex-col gap-2" aria-label="Lo que entró en los últimos 6 meses">
            {meses.map((m, i) => {
              const elegido = m.mes === periodo.param;
              return (
                <li key={m.mes} className="grid grid-cols-[2.5rem_1fr_auto] items-center gap-2 text-xs">
                  <span className={elegido ? 'font-semibold text-ink-1' : 'text-ink-3'}>{mesCorto(m.mes)}</span>
                  <Barra pct={(m.ingresos / maxMes) * 100} tono="neutra" indice={i} />
                  <span className={`whitespace-nowrap tabular-nums ${elegido ? 'font-semibold text-ink-1' : 'text-ink-2'}`}>{dinero(m.ingresos, 0)}</span>
                </li>
              );
            })}
          </ul>
        )}
      </Tarjeta>

      <div className="mb-4 grid grid-cols-2 gap-3">
        <Tarjeta indice={2}>
          <Dato
            etiqueta="Suscripciones al mes"
            numero={pagando > 0 ? mrr : null}
            formato="dinero"
            decimales={2}
            detalle={pagando > 0 ? `${entero(clientes.activos_mensual)} mensual · ${entero(clientes.activos_anual)} anual` : 'Aparece con el primer cliente pagando'}
          />
        </Tarjeta>
        <Tarjeta indice={3}>
          <Dato
            etiqueta="Pruebas que pagaron"
            numero={conversion}
            formato="pct"
            tono={conversion !== null && conversion >= 40 && pruebasTerminadas >= 10 ? 'bien' : 'neutro'}
            detalle={conversion !== null ? `${entero(ventas.pruebas_a_pago)} de ${entero(pruebasTerminadas)} que terminaron${pruebasTerminadas < 10 ? ' (aún son pocas para sacar conclusiones)' : ''}` : `${entero(ventas.pruebas_iniciadas)} pruebas nuevas; ninguna terminó aún`}
          />
        </Tarjeta>
      </div>

      <div className="mb-4 grid gap-3 lg:grid-cols-2">
        <Tarjeta indice={5}>
          <TituloTarjeta ayuda="Separado porque se resuelve distinto: unos decidieron irse, a otros les falló el pago.">Quién se fue y por qué</TituloTarjeta>
          {churn.total !== null && (
            <p className="mb-3 text-caption text-ink-2">
              <strong className={`font-display text-xl font-extrabold tabular-nums ${churn.total > 8 ? 'text-danger' : 'text-ink-1'}`}>{churn.total.toLocaleString('es', { maximumFractionDigits: 1 })}%</strong> de los {entero(ventas.pagando_al_inicio)} que pagaban al empezar el mes
            </p>
          )}
          {nadieSeFue ? (
            <Lectura tono="bien">Nadie se fue este mes: ni cancelaciones, ni pagos fallidos, ni reembolsos.</Lectura>
          ) : (
            <ul className="flex flex-col gap-2">
              {[
                { t: 'Cancelaron (decidieron irse)', n: ventas.cancelaciones_voluntarias },
                { t: 'Perdidos por pago fallido', n: ventas.perdidos_por_pago },
                { t: 'Cobros que fallaron (aún recuperables)', n: ventas.cobros_fallidos, alerta: true },
                { t: 'Reembolsos y contracargos', n: ventas.reembolsados },
              ]
                .filter((x) => x.n > 0)
                .map((x) => (
                  <li key={x.t} className="flex items-baseline justify-between gap-3">
                    <span className="text-caption text-ink-1">{x.t}</span>
                    <span className={`font-display text-xl font-extrabold tabular-nums ${x.alerta ? 'text-warning' : 'text-ink-1'}`}>{entero(x.n)}</span>
                  </li>
                ))}
            </ul>
          )}
          {usd && usd.reembolsos_minor + usd.contracargos_minor > 0 && <p className="mt-3 text-caption text-ink-2">Devolviste {dineroMinor(usd.reembolsos_minor + usd.contracargos_minor, 'USD')} este mes.</p>}
        </Tarjeta>

        <Tarjeta indice={6}>
          <TituloTarjeta ayuda="Todas las personas registradas, según su situación de hoy.">Tus clientes hoy</TituloTarjeta>
          {filasClientes.length === 0 ? (
            <SinDatos porque="Todavía no hay nadie registrado. Aparecen con la primera prueba gratis." />
          ) : (
            <ul className="flex flex-col gap-3">
              {filasClientes.map((f) => (
                <li key={f.texto} className="grid grid-cols-[1fr_auto] items-center gap-x-3 gap-y-1">
                  <span className="text-caption text-ink-1">{f.texto}</span>
                  <span className="text-caption font-semibold tabular-nums text-ink-1">{entero(f.n)}</span>
                  <span className="col-span-2">
                    <Barra pct={(f.n / maxClientes) * 100} tono={f.tono} />
                  </span>
                </li>
              ))}
            </ul>
          )}
          {sinAcceso > 0 && (
            <>
            <Lectura>
              {entero(sinAcceso)} ya no tienen acceso: pruebas que terminaron sin pagar, cancelaciones o reembolsos.
            </Lectura>
            <Link href="/admin/usuarios?estado=inactivo" className={`${TOCABLE} mt-1 flex min-h-11 items-center gap-1 pl-6 text-caption font-semibold text-ink-1 underline underline-offset-4`}>
              Ver a los {entero(sinAcceso)} sin acceso
              <ArrowRight size={14} aria-hidden="true" />
            </Link>
            </>
          )}
        </Tarjeta>
      </div>

      <Tarjeta className="mb-4" indice={7}>
        <TituloTarjeta ayuda="Lo que informó Hotmart, del más reciente al más antiguo.">{`Movimientos de ${periodo.etiqueta.split(' ')[0]}`}</TituloTarjeta>
        <nav aria-label="Filtrar movimientos" className="mb-2 flex flex-wrap gap-2">
          {[
            ['todos', 'Todos'],
            ['devoluciones', 'Solo reembolsos'],
          ].map(([v, t]) => (
            <ChipFiltro key={v} href={`/admin/ventas?mes=${periodo.param}${v === 'todos' ? '' : `&tipo=${v}`}`} activo={tipo === v}>
              {t}
            </ChipFiltro>
          ))}
        </nav>
        {lista.length === 0 ? (
          <SinDatos porque={tipo === 'devoluciones' ? 'No hubo reembolsos en este mes.' : 'No hubo movimientos de Hotmart en este mes.'} />
        ) : (
          <>
            <ul className="divide-y divide-[var(--line)]">
              {lista.map((c, i) => (
                <li key={`${c.en}-${i}`} className="flex items-center justify-between gap-3 py-2">
                  <span className="min-w-0">
                    <span className="block truncate text-caption text-ink-1">{c.email ?? 'Correo no informado'}</span>
                    <span className="block text-xs text-ink-3">
                      {NOMBRE_COBRO[c.tipo] ?? c.tipo} · {fechaHora(c.en)}
                    </span>
                  </span>
                  <span className={`shrink-0 whitespace-nowrap text-ayuda font-semibold tabular-nums ${c.tipo === 'sale' ? 'text-ink-1' : 'text-danger'}`}>
                    {c.tipo === 'sale' ? '' : '−'}
                    {dineroMinor(c.monto_minor, c.moneda)}
                  </span>
                </li>
              ))}
            </ul>
            {resto.length > 0 && (
              <details className="group panel-plegable">
                <summary className="flex min-h-11 cursor-pointer list-none items-center gap-1 text-caption font-semibold text-ink-1 underline underline-offset-4 [&::-webkit-details-marker]:hidden">
                  Ver {resto.length === 1 ? 'el otro movimiento' : `los otros ${resto.length}`}
                </summary>
                <ul className="divide-y divide-[var(--line)]">
                  {resto.map((c, i) => (
                  <li key={`${c.en}-${i}`} className="flex items-center justify-between gap-3 py-2">
                    <span className="min-w-0">
                      <span className="block truncate text-caption text-ink-1">{c.email ?? 'Correo no informado'}</span>
                      <span className="block text-xs text-ink-3">
                        {NOMBRE_COBRO[c.tipo] ?? c.tipo} · {fechaHora(c.en)}
                      </span>
                    </span>
                    <span className={`shrink-0 whitespace-nowrap text-ayuda font-semibold tabular-nums ${c.tipo === 'sale' ? 'text-ink-1' : 'text-danger'}`}>
                      {c.tipo === 'sale' ? '' : '−'}
                      {dineroMinor(c.monto_minor, c.moneda)}
                    </span>
                  </li>
                  ))}
                </ul>
              </details>
            )}
            {cobros.length >= 300 && <p className="mt-2 text-xs text-ink-3">Se muestran los 300 más recientes del mes.</p>}
          </>
        )}
        {clientes.manuales > 0 && (
          <p className="mt-3 text-caption text-ink-3">
            {entero(clientes.manuales)} {clientes.manuales === 1 ? 'persona tiene acceso regalado' : 'personas tienen acceso regalado'} por ti: no cuentan como venta.
          </p>
        )}
      </Tarjeta>

      {otras.length > 0 && (
        <Tarjeta indice={8}>
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
    </div>
  );
}
