// CANALES (21/34/40): de dónde vienen los clientes y si cada canal deja dinero. Cada canal muestra su
// veredicto en grande y una barra "lo gastado contra lo que dejarán sus clientes"; ordenados de peor
// a mejor para decidir dónde cortar. El canal sale del código sck del enlace de Hotmart.

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Dato, Encabezado, Lectura, SelectorMes, SinDatos, TOCABLE, Tarjeta, TituloTarjeta } from '@/components/admin/ui';
import { dinero, entero, nombreCanal } from '@/lib/panel-formato';
import { Entrada, Llenado } from '@/components/admin/movimiento';
import { calcularChurn, calcularLtv, leerCanales, leerClientes, leerVentas, periodoElegido } from '@/lib/servidor/panel';

function veredicto(canal: string, ratio: number | null, gasto: number, clientes: number) {
  const neutro = 'border border-[var(--line)]';
  if (gasto <= 0) return /^afiliad/.test(canal) ? { texto: 'Paga por venta', tono: 'text-ink-2', fondo: neutro, orden: 3 } : { texto: 'Sin gasto', tono: 'text-ink-3', fondo: '', orden: 3 };
  if (clientes === 0) return { texto: 'Sin clientes nuevos', tono: 'text-danger', fondo: 'bg-[color-mix(in_oklab,var(--danger)_14%,transparent)]', orden: 0 };
  if (ratio === null) return { texto: 'Sin datos', tono: 'text-ink-3', fondo: '', orden: 2 };
  if (ratio >= 3) return { texto: 'Sano', tono: 'text-green', fondo: 'bg-[color-mix(in_oklab,var(--green)_14%,transparent)]', orden: 2 };
  if (ratio >= 1) return { texto: 'Se paga', tono: 'text-ink-1', fondo: 'bg-raised-2', orden: 1 };
  return { texto: 'Pierde dinero', tono: 'text-danger', fondo: 'bg-[color-mix(in_oklab,var(--danger)_14%,transparent)]', orden: 0 };
}

export default async function CanalesPanel({ searchParams }: { searchParams: Promise<{ mes?: string }> }) {
  const periodo = periodoElegido((await searchParams).mes);
  const [canales, clientes, ventasAnt] = await Promise.all([leerCanales(periodo, 'canales_mes'), leerClientes(), leerVentas(periodoElegido(periodo.anterior), 'ventas_mes_anterior_completo')]);
  const churn = calcularChurn(ventasAnt);
  const vida = calcularLtv(clientes, churn.total);
  const filas = canales
    .map((c) => {
      const neto = c.dinero.filter((m) => m.moneda === 'USD').reduce((t, m) => t + m.neto_minor - m.devuelto_minor, 0) / 100;
      const cac = c.gasto_usd > 0 && c.clientes > 0 ? c.gasto_usd / c.clientes : null;
      const valor = vida ? c.siguen * vida.ltv : null;
      const ratio = c.gasto_usd > 0 && valor !== null ? valor / c.gasto_usd : null;
      const arpuMes = vida ? vida.ltv / vida.vidaMeses : null;
      const recupero = cac !== null && arpuMes ? Math.max(1, Math.ceil(cac / arpuMes)) : null;
      return { ...c, neto, cac, valor, ratio, recupero, v: veredicto(c.canal, ratio, c.gasto_usd, c.clientes) };
    })
    .sort((a, b) => a.v.orden - b.v.orden || b.gasto_usd - a.gasto_usd);
  const gastoTotal = filas.reduce((t, f) => t + f.gasto_usd, 0);
  const clientesConGasto = filas.filter((f) => f.gasto_usd > 0).reduce((t, f) => t + f.clientes, 0);
  const cacGeneral = gastoTotal > 0 && clientesConGasto > 0 ? gastoTotal / clientesConGasto : null;
  const pierde = cacGeneral !== null && vida !== null && cacGeneral > vida.ltv;
  const perdedores = filas.filter((f) => f.gasto_usd > 0 && (f.clientes === 0 || (f.ratio !== null && f.ratio < 1)));
  const ganadores = filas.filter((f) => f.gasto_usd > 0 && f.ratio !== null && f.ratio >= 1);

  return (
    <div key={periodo.param} className="panel-fundido">
      <Encabezado titulo="Canales">De dónde vienen tus clientes y si cada canal te deja dinero.</Encabezado>
      <SelectorMes periodo={periodo} ruta="/admin/canales" />

      <div className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-3">
        <Tarjeta indice={1}>
          <Dato etiqueta="Gasto en anuncios" numero={gastoTotal > 0 ? gastoTotal : null} formato="dinero" decimales={2} detalle={gastoTotal > 0 ? 'Lo que anotaste en Ajustes' : 'Anota tu gasto por canal en Ajustes'} />
        </Tarjeta>
        <Tarjeta indice={2}>
          <Dato
            etiqueta="Costo por cliente"
            numero={cacGeneral}
            formato="dinero"
            decimales={2}
            detalle={cacGeneral !== null ? 'Promedio de los canales con gasto' : 'Se calcula con gasto y clientes del mismo canal'}
          />
        </Tarjeta>
        <Tarjeta indice={3} className="col-span-2 lg:col-span-1">
          <Dato
            etiqueta="Lo que deja un cliente"
            numero={vida ? vida.ltv : null}
            formato="dinero"
            decimales={2}
            detalle={vida ? `Estimado: se queda unos ${Math.round(vida.vidaMeses)} meses, según cuántos se van cada mes` : 'Aparece con el primer cliente pagando'}
          />
        </Tarjeta>
      </div>
      {pierde && cacGeneral !== null && vida && (
        <div role="status" className="mb-4 rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--danger)_45%,transparent)] bg-[color-mix(in_oklab,var(--danger)_8%,transparent)] p-4 text-ayuda text-ink-1">
          <strong className="block font-display text-base font-bold">Los anuncios te cuestan más de lo que dejan</strong>
          <span className="mt-1 block text-caption text-ink-2">Cada cliente de anuncios cuesta {dinero(cacGeneral)} y deja unos {dinero(vida.ltv)}.</span>
          {(perdedores.length > 0 || ganadores.length > 0) && (
            <span className="mt-1 block text-caption text-ink-2">
              {perdedores.length > 0 && `Baja primero el gasto en ${perdedores.map((f) => nombreCanal(f.canal)).join(' y ')}.`}
              {ganadores.length > 0 && ` ${ganadores.map((f) => nombreCanal(f.canal)).join(' y ')} sí se ${ganadores.length === 1 ? 'paga' : 'pagan'}.`}
            </span>
          )}
        </div>
      )}

      <Tarjeta className="mb-4" indice={4}>
        <TituloTarjeta ayuda="Ordenados de peor a mejor. Lo sano es que cada $1 que gastas vuelva como $3 o más.">Cada canal</TituloTarjeta>
        {filas.length === 0 ? (
          <SinDatos porque="Aparecen con los primeros clientes. Para saber de dónde viene cada uno, usa un enlace de Hotmart distinto en cada red (pídeselos a quien te ayuda con la app)." />
        ) : (
          <ul className="flex flex-col gap-3">
            {filas.map((f, i) => {
              const tope = Math.max(f.gasto_usd, f.valor ?? 0, 1);
              return (
                <li key={f.canal}>
                <Entrada indice={i + 5} className="rounded-[var(--radius-chip)] bg-sunken p-3">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                    <span className="font-display text-lg font-bold break-words text-ink-1">{nombreCanal(f.canal)}</span>
                    <span className={`rounded-[var(--radius-pill)] py-0.5 text-caption font-bold ${f.v.fondo ? `px-2.5 ${f.v.fondo}` : ''} ${f.v.tono}`}>{f.v.texto}</span>
                  </div>
                  <p className="text-caption text-ink-2">
                    {entero(f.clientes)} {f.clientes === 1 ? 'cliente nuevo' : 'clientes nuevos'} · {entero(f.siguen)} siguen
                    {f.cac !== null && ` · cada uno costó ${dinero(f.cac)}`}

                  </p>
                  {f.gasto_usd > 0 && (
                    <div className="mt-3 flex flex-col gap-1.5" aria-label={`Gastado ${dinero(f.gasto_usd)}; dejarían ${f.valor !== null ? dinero(f.valor) : 'sin dato'}`}>
                      <div className="grid grid-cols-[5.5rem_1fr_auto] items-center gap-2 text-xs">
                        <span className="text-ink-3">Gastaste</span>
                        <span className="block h-2 rounded-full bg-base">
                          <Llenado pct={(f.gasto_usd / tope) * 100} className="bg-[color-mix(in_oklab,var(--ink-2)_55%,transparent)]" indice={i} />
                        </span>
                        <span className="whitespace-nowrap tabular-nums text-ink-1">{dinero(f.gasto_usd, 0)}</span>
                      </div>
                      {f.valor !== null && f.valor > 0 && (
                        <div className="grid grid-cols-[5.5rem_1fr_auto] items-center gap-2 text-xs">
                          <span className="text-ink-3">Te dejarán</span>
                          <span className="block h-2 rounded-full bg-base">
                            <Llenado pct={(f.valor / tope) * 100} className={f.valor >= f.gasto_usd ? 'bg-green' : 'bg-danger'} indice={i + 1} />
                          </span>
                          <span className="whitespace-nowrap tabular-nums text-ink-1">{dinero(f.valor, 0)}</span>
                        </div>
                      )}
                    </div>
                  )}
                  <p className="mt-2 text-caption text-ink-2">
                    Cobrado en el mes: <span className="font-semibold whitespace-nowrap text-ink-1 tabular-nums">{dinero(f.neto)}</span>
                    {f.clientes === 0 && f.neto > 0 && ' (renovaciones de clientes anteriores)'}
                    {f.recupero !== null && (
                      <>
                        {' '}
                        · recuperas lo gastado en unos {f.recupero} {f.recupero === 1 ? 'mes' : 'meses'}
                      </>
                    )}
                  </p>
                </Entrada>
                </li>
              );
            })}
          </ul>
        )}
        <Lectura>Una suscripción casi nunca se paga en el primer mes: por eso un canal puede ir en negativo este mes y aun así ser sano.</Lectura>
      </Tarjeta>

      <Link href="/admin/ajustes#gastos" className={`${TOCABLE} tarjeta-relieve-base flex min-h-12 items-center gap-3 rounded-[var(--radius-card)] px-4 text-ayuda font-semibold text-ink-1 hover:bg-raised`}>
        Anotar lo que gastas en cada canal
        <ArrowRight size={16} className="ml-auto text-ink-3" aria-hidden="true" />
      </Link>
    </div>
  );
}
