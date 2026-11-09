// INICIO del panel: los avisos primero, después "facturaste $X y te quedaron $Y", los 4 números del
// negocio y la evolución de 6 meses. Con flechas para ver otros meses. Todo sale de la base.

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { BannerAvisos, Dato, Encabezado, Lectura, SelectorMes, SinDatos, TOCABLE, Tarjeta, TituloTarjeta, Variacion } from '@/components/admin/ui';
import { Cuenta, Entrada } from '@/components/admin/movimiento';
import { GraficoMeses } from '@/components/admin/Graficos';
import { dinero, entero, pct, variacion } from '@/lib/panel-formato';
import {
  calcularAvisos,
  calcularChurn,
  calcularGanancia,
  calcularLtv,
  calcularMrr,
  gananciaPorMes,
  leerAjustes,
  leerCanales,
  leerClientes,
  leerIa,
  leerSalud,
  leerSerie,
  leerUso,
  leerVentas,
  periodoElegido,
} from '@/lib/servidor/panel';

export default async function InicioPanel({ searchParams }: { searchParams: Promise<{ mes?: string }> }) {
  const periodo = periodoElegido((await searchParams).mes);
  const [ventas, ventasAnt, clientes, serie, ia, iaAnt, salud, canales, uso, ajustes] = await Promise.all([
    leerVentas(periodo, 'ventas_mes'),
    leerVentas(periodo.comparar, 'ventas_mes_anterior'),
    leerClientes(),
    leerSerie(6),
    leerIa(periodo, 'ia_mes'),
    leerIa(periodo.comparar, 'ia_mes_anterior'),
    leerSalud(),
    leerCanales(periodo, 'canales_mes'),
    leerUso(),
    leerAjustes(),
  ]);

  const fijos = ajustes.costos.filter((c) => c.activo).reduce((t, c) => t + c.monto_usd, 0);
  const g = calcularGanancia(ventas, ia.total_usd, ajustes.impuestosPct, fijos);
  const gAnt = calcularGanancia(ventasAnt, iaAnt.total_usd, ajustes.impuestosPct, fijos);
  const { mrr, pagando } = calcularMrr(clientes);
  const churn = calcularChurn(ventas);
  const ltv = calcularLtv(clientes, churn.total)?.ltv ?? null;
  // Los avisos de hoy solo tienen sentido en el mes en curso.
  const avisos = periodo.esActual ? calcularAvisos({ ganancia: g, ventas, salud, canales, uso, ltv }) : [];
  const meses = gananciaPorMes(serie, ajustes.impuestosPct, fijos);
  const hayHistoria = meses.some((m) => m.hayVentas);
  const activos = pagando + clientes.en_prueba;
  const pctIa = g.bruto > 0 ? (ia.total_usd / g.bruto) * 100 : null;
  const mejorMes = hayHistoria ? meses.reduce((a, b) => (b.quedo > a.quedo ? b : a)) : null;

  return (
    <div key={periodo.param} className="panel-fundido">
      <Encabezado titulo="Tu negocio hoy" />
      <SelectorMes periodo={periodo} ruta="/admin" />
      {periodo.esActual && <BannerAvisos avisos={avisos} periodo={periodo.etiqueta} />}

      {/* El dato que más importa: lo que de verdad queda */}
      <Tarjeta destacada className="mb-4" indice={2}>
        {g.bruto > 0 ? (
          <>
            <p className="text-ayuda text-ink-2">
              Facturaste <strong className="font-semibold text-ink-1 tabular-nums">{dinero(g.bruto)}</strong> y te quedaron
            </p>
            <p className={`mt-1 font-display text-4xl leading-none font-extrabold ${g.ganancia < 0 ? 'text-danger' : 'text-gold'}`}>
              <Cuenta valor={g.ganancia} formato="dinero" decimales={2} />
            </p>
            <p className="mt-2 text-caption text-ink-2">
              limpios · margen {g.margenPct !== null ? pct(g.margenPct) : '—'} · <Variacion cambio={variacion(g.ganancia, gAnt.bruto > 0 ? gAnt.ganancia : 0)} contra={periodo.textoComparar} />
            </p>
            {periodo.diaDeHoy && <p className="mt-1 text-xs text-ink-3">Los costos fijos del mes ya están restados completos, aunque el mes va en el día {periodo.diaDeHoy}.</p>}
            {(g.comisionEstimada || g.otrasMonedas.length > 0) && (
              <p className="mt-1 text-xs text-ink-3">
                {g.comisionEstimada && 'Incluye comisiones de Hotmart estimadas en las ventas que llegaron sin el detalle. '}
                {g.otrasMonedas.length > 0 && `Ventas en ${g.otrasMonedas.join(', ')} aparte (no se suman sin tipo de cambio).`}
              </p>
            )}
            <Link href={`/admin/ganancia?mes=${periodo.param}`} className={`${TOCABLE} mt-2 inline-flex min-h-11 items-center gap-1 text-caption font-semibold text-ink-1 underline underline-offset-4`}>
              Ver la cuenta completa
              <ArrowRight size={14} aria-hidden="true" />
            </Link>
          </>
        ) : (
          <>
            <p className="font-display text-base font-bold text-ink-1">{periodo.esActual ? 'Todavía no hay ventas este mes' : `No hubo ventas en ${periodo.etiqueta}`}</p>
            <p className="mt-1 text-ayuda text-ink-2">
              Cuando entre una venta de Hotmart, aquí verás cuánto facturaste y cuánto te quedó limpio.
              {g.ia + g.fijos > 0 && (
                <>
                  {' '}
                  Los costos de ese mes van en <strong className="font-semibold text-ink-1 tabular-nums">{dinero(g.ia + g.fijos)}</strong>.
                </>
              )}
            </p>
          </>
        )}
      </Tarjeta>

      {/* Los 4 números del negocio: cada tarjeta lleva a su sección */}
      <Entrada indice={3}>
        <p className="mb-2 text-xs font-semibold tracking-[0.08em] text-ink-3 uppercase">Números clave</p>
      </Entrada>
      <div className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Tarjeta indice={3} href="/admin/usuarios?estado=activo">
          <Dato
            etiqueta="Clientes activos"
            numero={clientes.total > 0 ? activos : null}
            detalle={clientes.total > 0 ? `${entero(pagando)} pagando · ${entero(clientes.en_prueba)} en prueba` : 'Aún nadie compró'}
          />
        </Tarjeta>
        <Tarjeta indice={4} href={`/admin/ventas?mes=${periodo.param}`}>
          <Dato
            etiqueta="Suscripciones al mes"
            numero={pagando > 0 ? mrr : null}
            formato="dinero"
            decimales={2}
            detalle={pagando > 0 ? `Lo que pagan tus ${entero(pagando)} clientes cada mes` : 'Aparece con el primer cliente pagando'}
          />
        </Tarjeta>
        <Tarjeta indice={5} href={`/admin/ia?mes=${periodo.param}`}>
          <Dato
            etiqueta="Gasto en IA"
            numero={ia.llamadas > 0 ? ia.total_usd : null}
            formato="dinero"
            decimales={2}
            tono={pctIa !== null && pctIa > 20 ? 'mal' : 'neutro'}
            detalle={ia.llamadas === 0 ? 'La IA no se usó este mes' : pctIa !== null ? `${pct(pctIa, 1)} de lo que facturaste` : `${entero(ia.llamadas)} usos, sin ventas aún`}
          />
        </Tarjeta>
        <Tarjeta indice={6} href={`/admin/ventas?mes=${periodo.param}`}>
          <Dato
            etiqueta="Se fueron"
            numero={churn.total}
            formato="pct"
            decimales={1}
            tono={churn.total !== null && churn.total > 8 ? 'mal' : 'neutro'}
            detalle={
              churn.total !== null ? `${entero(churn.voluntario)} cancelaron · ${entero(churn.involuntario)} por pago fallido` : 'Se mide con clientes pagando desde el mes anterior'
            }
          />
        </Tarjeta>
      </div>

      <Tarjeta indice={7}>
        <TituloTarjeta ayuda="Lo que te quedó cada mes después de todos los costos.">Últimos 6 meses</TituloTarjeta>
        {hayHistoria ? (
          <>
            <GraficoMeses datos={meses} />
            {mejorMes && (
              <Lectura tono={meses[meses.length - 1].quedo >= 0 ? 'bien' : 'mal'}>
                Tu mejor mes fue {new Intl.DateTimeFormat('es', { month: 'long', timeZone: 'UTC' }).format(new Date(`${mejorMes.mes}-15T12:00:00Z`))}: te quedaron{' '}
                <strong className="font-semibold text-ink-1">{dinero(mejorMes.quedo)}</strong>.
              </Lectura>
            )}
          </>
        ) : (
          <SinDatos porque="El gráfico aparece con la primera venta." />
        )}
      </Tarjeta>
    </div>
  );
}
