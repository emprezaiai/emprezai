// GANANCIA REAL (40): lo que de verdad queda tras todos los costos, paso a paso. Lo real se marca
// como real (lo informó Hotmart / lo midió la app) y lo estimado, como estimado.

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Encabezado, FilaMonto, Tarjeta, TituloTarjeta } from '@/components/admin/ui';
import { dinero, entero, pct } from '@/lib/panel-formato';
import { calcularGanancia, calcularMrr, leerAjustes, leerClientes, leerIa, leerVentas, periodoMes } from '@/lib/servidor/panel';

export default async function GananciaPanel() {
  const mes = periodoMes(0);
  const [ventas, ia, ajustes, clientes] = await Promise.all([leerVentas(mes, 'ventas_mes'), leerIa(mes, 'ia_mes'), leerAjustes(), leerClientes()]);
  const costosActivos = ajustes.costos.filter((c) => c.activo);
  const fijos = costosActivos.reduce((t, c) => t + c.monto_usd, 0);
  const g = calcularGanancia(ventas, ia.total_usd, ajustes.impuestosPct, fijos);
  const { pagando } = calcularMrr(clientes);
  const porCliente = pagando > 0 && g.bruto > 0 ? g.ganancia / pagando : null;

  return (
    <>
      <Encabezado titulo="Ganancia real" periodo={mes.etiqueta}>
        Lo que de verdad te queda después de pagar todo.
      </Encabezado>

      <Tarjeta destacada className="mb-4">
        {g.bruto > 0 ? (
          <>
            <p className="text-ayuda text-ink-2">
              Facturaste <strong className="font-semibold text-ink-1 tabular-nums">{dinero(g.bruto)}</strong> y te quedaron
            </p>
            <p className={`mt-1 font-display text-4xl leading-none font-extrabold tabular-nums ${g.ganancia < 0 ? 'text-danger' : 'text-gold'}`}>{dinero(g.ganancia)}</p>
            <p className="mt-2 text-caption text-ink-2">
              limpios · margen {g.margenPct !== null ? pct(g.margenPct) : '—'}
              {porCliente !== null && <> · {dinero(porCliente)} por cliente pagando</>}
            </p>
          </>
        ) : (
          <>
            <p className="font-display text-base font-bold text-ink-1">Todavía no hay ventas este mes</p>
            <p className="mt-1 text-ayuda text-ink-2">
              Tus costos del mes van en <strong className="font-semibold text-ink-1 tabular-nums">{dinero(g.ia + g.fijos)}</strong>. Con la primera venta verás la cuenta completa.
            </p>
          </>
        )}
      </Tarjeta>

      <Tarjeta className="mb-4">
        <TituloTarjeta ayuda="En dólares (la moneda de tus planes).">La cuenta, paso a paso</TituloTarjeta>
        <div className="divide-y divide-[var(--line)]">
          <FilaMonto concepto="Facturaste" monto={dinero(g.bruto)} nota={g.ventas > 0 ? `${entero(g.ventas)} ${g.ventas === 1 ? 'cobro' : 'cobros'} de Hotmart` : 'Sin cobros todavía'} />
          <FilaMonto concepto="− Reembolsos y contracargos" monto={dinero(-g.devuelto)} nota="Real (lo informó Hotmart)" />
          <FilaMonto
            concepto="− Comisión de Hotmart"
            monto={dinero(-g.comision)}
            nota={g.comisionEstimada ? 'Parte real y parte estimada (9,9% + $0,45 en las ventas que llegaron sin el detalle)' : g.ventas > 0 ? 'Real (lo informó Hotmart)' : undefined}
          />
          <FilaMonto concepto="− Afiliados" monto={dinero(-g.afiliados)} nota={g.afiliadosSinInformar > 0 ? `Real; ${g.afiliadosSinInformar} ventas llegaron sin el detalle` : 'Real (lo informó Hotmart)'} />
          <FilaMonto concepto="− Impuestos" monto={dinero(-g.impuestos)} nota={`Estimado: ${pct(g.impuestosPct)} que pusiste en Ajustes`} />
          <FilaMonto concepto="− IA" monto={dinero(-g.ia)} nota={`Real: lo que costó cada uso de la IA este mes (${entero(ia.llamadas)} usos)`} />
          <FilaMonto
            concepto="− Servidores, dominio y correo"
            monto={dinero(-g.fijos)}
            nota={costosActivos.length > 0 ? costosActivos.map((c) => `${c.nombre} ${dinero(c.monto_usd)}`).join(' · ') : 'Aún no anotaste tus costos fijos en Ajustes'}
          />
          <FilaMonto total concepto="Te quedaron limpios" monto={dinero(g.ganancia)} />
        </div>
        {g.otrasMonedas.length > 0 && <p className="mt-2 text-caption text-ink-3">Las ventas en {g.otrasMonedas.join(', ')} no están en esta cuenta: no se suman sin un tipo de cambio con fuente.</p>}
      </Tarjeta>

      <Link
        href="/admin/ajustes"
        className="tarjeta-relieve-base flex min-h-12 items-center gap-3 rounded-[var(--radius-card)] px-4 text-ayuda font-semibold text-ink-1 transition-colors duration-150 hover:bg-raised"
      >
        Cambiar el % de impuestos o tus costos fijos
        <ArrowRight size={16} className="ml-auto text-ink-3" aria-hidden="true" />
      </Link>
    </>
  );
}
