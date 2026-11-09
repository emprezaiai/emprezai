// INICIO del panel: los avisos primero, después "facturaste $X y te quedaron $Y", los 4 números del
// negocio y la evolución de 6 meses. Todo sale de la base (funciones panel_*), nada se inventa.

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { BannerAvisos, Dato, Encabezado, SinDatos, Tarjeta, TituloTarjeta, Variacion } from '@/components/admin/ui';
import { GraficoMeses } from '@/components/admin/Graficos';
import { SECCIONES } from '@/components/admin/secciones';
import { dinero, entero, pct, variacion } from '@/lib/panel-formato';
import {
  calcularAvisos,
  calcularChurn,
  calcularGanancia,
  calcularMrr,
  gananciaPorMes,
  leerAjustes,
  leerCanales,
  leerClientes,
  leerIa,
  leerSalud,
  leerSerie,
  leerUso,
  calcularLtv,
  leerVentas,
  periodoMes,
  periodoMesHastaHoy,
} from '@/lib/servidor/panel';

export default async function InicioPanel() {
  const mes = periodoMes(0);
  // Comparación justa: los mismos días del mes anterior (del 1 a hoy), no el mes completo.
  const anterior = periodoMesHastaHoy(-1);
  const [ventas, ventasAnt, clientes, serie, ia, iaAnt, salud, canales, uso, ajustes] = await Promise.all([
    leerVentas(mes, 'ventas_mes'),
    leerVentas(anterior, 'ventas_mes_anterior'),
    leerClientes(),
    leerSerie(6),
    leerIa(mes, 'ia_mes'),
    leerIa(anterior, 'ia_mes_anterior'),
    leerSalud(),
    leerCanales(mes, 'canales_mes'),
    leerUso(),
    leerAjustes(),
  ]);

  const fijos = ajustes.costos.filter((c) => c.activo).reduce((t, c) => t + c.monto_usd, 0);
  const g = calcularGanancia(ventas, ia.total_usd, ajustes.impuestosPct, fijos);
  const gAnt = calcularGanancia(ventasAnt, iaAnt.total_usd, ajustes.impuestosPct, fijos);
  const { mrr, pagando } = calcularMrr(clientes);
  const churn = calcularChurn(ventas);
  const ltv = calcularLtv(clientes, churn.total)?.ltv ?? null;
  const avisos = calcularAvisos({ ganancia: g, ventas, salud, canales, uso, ltv });
  const meses = gananciaPorMes(serie, ajustes.impuestosPct, fijos);
  const hayHistoria = meses.some((m) => m.hayVentas);
  const activos = pagando + clientes.en_prueba;

  return (
    <>
      <Encabezado titulo="Tu negocio hoy" periodo={mes.etiqueta} />
      <BannerAvisos avisos={avisos} periodo={mes.etiqueta} />

      {/* El dato que más importa: lo que de verdad queda */}
      <Tarjeta destacada className="mb-4">
        {g.bruto > 0 ? (
          <>
            <p className="text-ayuda text-ink-2">
              Facturaste <strong className="font-semibold text-ink-1 tabular-nums">{dinero(g.bruto)}</strong> y te quedaron
            </p>
            <p className={`mt-1 font-display text-4xl leading-none font-extrabold tabular-nums ${g.ganancia < 0 ? 'text-danger' : 'text-gold'}`}>
              {dinero(g.ganancia)}
            </p>
            <p className="mt-2 text-caption text-ink-2">
              limpios · margen {g.margenPct !== null ? pct(g.margenPct) : '—'} ·{' '}
              <Variacion cambio={variacion(g.ganancia, gAnt.bruto > 0 ? gAnt.ganancia : 0)} contra={`los mismos días de ${anterior.etiqueta.split(' ')[0]}`} />
            </p>
            {(g.comisionEstimada || g.otrasMonedas.length > 0) && (
              <p className="mt-2 text-caption text-ink-3">
                {g.comisionEstimada && 'Incluye comisiones de Hotmart estimadas en las ventas que llegaron sin el detalle. '}
                {g.otrasMonedas.length > 0 && `Ventas en ${g.otrasMonedas.join(', ')} aparte (no se suman sin tipo de cambio).`}
              </p>
            )}
            <Link href="/admin/ganancia" className="mt-2 inline-flex min-h-11 items-center gap-1 text-caption font-semibold text-ink-1 underline underline-offset-4">
              Ver la cuenta completa
              <ArrowRight size={14} aria-hidden="true" />
            </Link>
          </>
        ) : (
          <>
            <p className="font-display text-base font-bold text-ink-1">Todavía no hay ventas este mes</p>
            <p className="mt-1 text-ayuda text-ink-2">
              Cuando entre la primera venta de Hotmart, aquí verás cuánto facturaste y cuánto te quedó limpio.
              {g.ia + g.fijos > 0 && (
                <>
                  {' '}
                  Por ahora tus costos del mes van en <strong className="font-semibold text-ink-1 tabular-nums">{dinero(g.ia + g.fijos)}</strong>.
                </>
              )}
            </p>
          </>
        )}
      </Tarjeta>

      {/* Los 4 números del negocio */}
      <div className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Tarjeta>
          <Dato
            etiqueta="Clientes activos"
            valor={clientes.total > 0 ? entero(activos) : null}
            detalle={clientes.total > 0 ? `${entero(pagando)} pagando · ${entero(clientes.en_prueba)} en prueba` : 'Aún nadie compró'}
          />
        </Tarjeta>
        <Tarjeta>
          <Dato
            etiqueta="Ingreso mensual recurrente"
            valor={pagando > 0 ? dinero(mrr) : null}
            detalle={pagando > 0 ? 'A precio de lista; el anual se reparte en 12' : 'Aparece con el primer cliente pagando'}
          />
        </Tarjeta>
        <Tarjeta>
          <Dato
            etiqueta="Costo de la IA del mes"
            valor={ia.llamadas > 0 ? dinero(ia.total_usd) : null}
            tono={g.bruto > 0 && ia.total_usd / g.bruto > 0.2 ? 'mal' : 'neutro'}
            detalle={
              ia.llamadas === 0 ? 'La IA no se usó este mes' : g.bruto > 0 ? `${pct((ia.total_usd / g.bruto) * 100)} de lo que facturaste` : `${entero(ia.llamadas)} usos, sin ventas aún`
            }
          />
        </Tarjeta>
        <Tarjeta>
          <Dato
            etiqueta="Se fueron este mes"
            valor={churn.total !== null ? pct(churn.total, 1) : null}
            tono={churn.total !== null && churn.total > 8 ? 'mal' : 'neutro'}
            detalle={
              churn.total !== null
                ? `${entero(churn.voluntario)} cancelaron · ${entero(churn.involuntario)} por pago fallido`
                : 'Se mide cuando haya clientes pagando desde el mes anterior'
            }
          />
        </Tarjeta>
      </div>

      <Tarjeta className="mb-4">
        <TituloTarjeta ayuda="Barra apagada: lo que facturaste. Dorada: lo que te quedó después de todos los costos.">Últimos 6 meses</TituloTarjeta>
        {hayHistoria ? <GraficoMeses datos={meses} /> : <SinDatos porque="El gráfico aparece con la primera venta." />}
      </Tarjeta>

      <nav aria-label="Ir a una sección" className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {SECCIONES.slice(1).map(({ href, etiqueta, icono: Icono }) => (
          <Link
            key={href}
            href={href}
            className="tarjeta-relieve-base flex min-h-12 items-center gap-3 rounded-[var(--radius-card)] px-4 text-ayuda font-semibold text-ink-1 transition-colors duration-150 hover:bg-raised"
          >
            <Icono size={18} className="text-ink-2" aria-hidden="true" />
            {etiqueta}
            <ArrowRight size={16} className="ml-auto text-ink-3" aria-hidden="true" />
          </Link>
        ))}
      </nav>
    </>
  );
}
