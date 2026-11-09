// GANANCIA REAL (40): lo que de verdad queda tras todos los costos. Primero el número y adónde se
// va cada dólar (una barra por tramos), después la cuenta paso a paso. Lo real se marca como real y
// lo estimado, como estimado. Con flechas para ver otros meses.

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Encabezado, FilaMonto, Lectura, SelectorMes, TOCABLE, Tarjeta, TituloTarjeta, Variacion } from '@/components/admin/ui';
import { Cuenta } from '@/components/admin/movimiento';
import { dinero, entero, pct, variacion } from '@/lib/panel-formato';
import { calcularGanancia, leerAjustes, leerIa, leerVentas, periodoElegido } from '@/lib/servidor/panel';

// Los costos van en grises que se aclaran según su tamaño (el más grande, el más visible); el dorado
// es solo lo que queda y el rojo, lo devuelto. Bajo la barra, cada tramo con su nombre y su %.
const GRISES = ['var(--ink-2)', 'color-mix(in oklab, var(--ink-2) 62%, var(--surface-raised-2))', 'color-mix(in oklab, var(--ink-3) 55%, var(--surface-raised-2))', 'color-mix(in oklab, var(--ink-3) 35%, var(--surface-raised-2))', 'color-mix(in oklab, var(--ink-3) 22%, var(--surface-raised-2))'];
const QUEDA = 'var(--gold)';
const DEVUELTO = 'var(--danger)';
const monto = (n: number) => (Math.abs(n) < 0.005 ? dinero(0) : dinero(-n));

export default async function GananciaPanel({ searchParams }: { searchParams: Promise<{ mes?: string }> }) {
  const periodo = periodoElegido((await searchParams).mes);
  const [ventas, ia, ajustes, ventasAnt, iaAnt] = await Promise.all([
    leerVentas(periodo, 'ventas_mes'),
    leerIa(periodo, 'ia_mes'),
    leerAjustes(),
    leerVentas(periodo.comparar, 'ventas_mes_anterior'),
    leerIa(periodo.comparar, 'ia_mes_anterior'),
  ]);
  const costosActivos = ajustes.costos.filter((c) => c.activo);
  const fijos = costosActivos.reduce((t, c) => t + c.monto_usd, 0);
  const g = calcularGanancia(ventas, ia.total_usd, ajustes.impuestosPct, fijos);
  const gAnt = calcularGanancia(ventasAnt, iaAnt.total_usd, ajustes.impuestosPct, fijos);
  const tramos = [
    { id: 'hotmart', texto: 'Comisión de Hotmart', v: g.comision },
    { id: 'afiliados', texto: 'Afiliados', v: g.afiliados },
    { id: 'impuestos', texto: 'Impuestos', v: g.impuestos },
    { id: 'ia', texto: 'IA', v: g.ia },
    { id: 'fijos', texto: 'Servidores, dominio y correo', v: g.fijos },
    { id: 'devuelto', texto: 'Reembolsos', v: g.devuelto },
  ] as const;
  const mayor = [...tramos].sort((a, b) => b.v - a.v)[0];
  const ordenCostos = tramos.filter((t) => t.id !== 'devuelto').sort((a, b) => b.v - a.v).map((t) => t.id);
  const COLOR: Record<string, string> = { queda: QUEDA, devuelto: DEVUELTO };
  ordenCostos.forEach((id, i) => (COLOR[id] = GRISES[Math.min(i, GRISES.length - 1)]));
  const leyenda = tramos.filter((t) => t.v > 0.005);
  const deCadaDolar = g.bruto > 0 ? Math.round((mayor.v / g.bruto) * 100) : 0;

  return (
    <div key={periodo.param} className="panel-fundido">
      <Encabezado titulo="Ganancia real">Lo que de verdad te queda después de pagar todo.</Encabezado>
      <SelectorMes periodo={periodo} ruta="/admin/ganancia" />

      <Tarjeta destacada className="mb-4" indice={1}>
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

            {/* Adónde se va cada dólar */}
            <div className="panel-crecer mt-4 flex h-3 w-full overflow-hidden rounded-full bg-sunken" role="img" aria-label={`De cada dólar: te quedan ${pct(Math.max(0, (g.ganancia / g.bruto) * 100))}, el resto se va en costos.`}>
              {g.ganancia > 0 && <span style={{ width: `${(g.ganancia / g.bruto) * 100}%`, background: QUEDA }} />}
              {tramos.map((t) => t.v > 0 && <span key={t.id} style={{ width: `${(t.v / g.bruto) * 100}%`, background: COLOR[t.id] }} />)}
            </div>
            <ul className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-ink-2">
              {leyenda.map((t) => (
                <li key={t.id} className="inline-flex items-center gap-1.5">
                  <span aria-hidden="true" className="size-2 rounded-full" style={{ background: COLOR[t.id] }} />
                  {t.texto} <span className="font-semibold text-ink-1 tabular-nums">{pct((t.v / g.bruto) * 100)}</span>
                </li>
              ))}
            </ul>
            <Lectura tono={g.ganancia >= 0 ? 'neutro' : 'mal'}>
              Tu mayor costo es <strong className="font-semibold text-ink-1">{mayor.texto.toLowerCase()}</strong>: {deCadaDolar} de cada 100 dólares que facturas.
            </Lectura>
          </>
        ) : (
          <>
            <p className="font-display text-base font-bold text-ink-1">{periodo.esActual ? 'Todavía no hay ventas este mes' : `No hubo ventas en ${periodo.etiqueta}`}</p>
            <p className="mt-1 text-ayuda text-ink-2">
              Los costos de ese mes van en <strong className="font-semibold text-ink-1 tabular-nums">{dinero(g.ia + g.fijos)}</strong>. Con la primera venta verás la cuenta completa.
            </p>
          </>
        )}
      </Tarjeta>

      <Tarjeta className="mb-4" indice={2}>
        <TituloTarjeta ayuda="En dólares. Todo es real, salvo lo marcado como estimado.">La cuenta, paso a paso</TituloTarjeta>
        <div className="divide-y divide-[var(--line)]">
          <FilaMonto concepto="Facturaste" monto={dinero(g.bruto)} nota={g.ventas > 0 ? `${entero(g.ventas)} ${g.ventas === 1 ? 'cobro' : 'cobros'} de Hotmart` : 'Sin cobros todavía'} />
          <FilaMonto concepto="Reembolsos y contracargos" color={COLOR.devuelto} monto={monto(g.devuelto)} apagada={g.devuelto < 0.005} />
          <FilaMonto
            concepto="Comisión de Hotmart"
            color={COLOR.hotmart}
            monto={monto(g.comision)}
            nota={g.comisionEstimada ? 'Parte estimada (9,9% + $0,45) en las ventas que llegaron sin el detalle' : undefined}
            apagada={g.comision < 0.005}
          />
          <FilaMonto concepto="Afiliados" color={COLOR.afiliados} monto={monto(g.afiliados)} nota={g.afiliadosSinInformar > 0 ? `${g.afiliadosSinInformar} ventas llegaron sin el detalle` : undefined} apagada={g.afiliados < 0.005} />
          <FilaMonto concepto="Impuestos" color={COLOR.impuestos} monto={monto(g.impuestos)} nota={`Estimado: el ${pct(g.impuestosPct)} que pusiste en Ajustes`} apagada={g.impuestos < 0.005} />
          <FilaMonto concepto="IA" color={COLOR.ia} monto={monto(g.ia)} nota={`${entero(ia.llamadas)} usos`} apagada={g.ia < 0.005} />
          <FilaMonto
            concepto="Servidores, dominio y correo"
            color={COLOR.fijos}
            monto={monto(g.fijos)}
            nota={costosActivos.length > 0 ? costosActivos.map((c) => `${c.nombre} ${dinero(c.monto_usd)}`).join(' · ') : 'Aún no anotaste tus costos fijos en Ajustes'}
            apagada={g.fijos < 0.005}
          />
          <FilaMonto total concepto="Te quedaron limpios" monto={dinero(g.ganancia)} color={COLOR.queda} />
        </div>
        {g.otrasMonedas.length > 0 && <p className="mt-2 text-caption text-ink-3">Las ventas en {g.otrasMonedas.join(', ')} no están en esta cuenta: no se suman sin un tipo de cambio con fuente.</p>}
      </Tarjeta>

      <Link href="/admin/ajustes" className={`${TOCABLE} inline-flex min-h-11 items-center gap-1 text-caption text-ink-2 underline underline-offset-4 hover:text-ink-1`}>
        Cambiar impuestos o costos fijos
        <ArrowRight size={14} aria-hidden="true" />
      </Link>
    </div>
  );
}
