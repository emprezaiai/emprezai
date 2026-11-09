// CANALES (21/34/40): de dónde vienen los clientes y si cada canal deja dinero. Cada canal muestra su
// veredicto en grande y una barra "lo gastado contra lo que dejarán sus clientes"; ordenados de peor
// a mejor para decidir dónde cortar. El canal sale del código sck del enlace de Hotmart.

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Dato, Encabezado, Lectura, SelectorMes, SinDatos, TOCABLE, Tarjeta, TituloTarjeta } from '@/components/admin/ui';
import { decimal, dinero, entero, nombreCanal } from '@/lib/panel-formato';
import { calcularChurn, calcularLtv, leerCanales, leerClientes, leerVentas, periodoElegido } from '@/lib/servidor/panel';

function veredicto(ratio: number | null, gasto: number, clientes: number) {
  if (gasto <= 0) return { texto: 'Gratis', tono: 'text-ink-2', orden: 3 };
  if (clientes === 0) return { texto: 'Sin clientes', tono: 'text-danger', orden: 0 };
  if (ratio === null) return { texto: 'Sin datos', tono: 'text-ink-3', orden: 2 };
  if (ratio >= 3) return { texto: 'Sano', tono: 'text-green', orden: 2 };
  if (ratio >= 1) return { texto: 'Gana poco', tono: 'text-warning', orden: 1 };
  return { texto: 'Pierde dinero', tono: 'text-danger', orden: 0 };
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
      return { ...c, neto, cac, valor, ratio, recupero, v: veredicto(ratio, c.gasto_usd, c.clientes) };
    })
    .sort((a, b) => a.v.orden - b.v.orden || b.gasto_usd - a.gasto_usd);
  const gastoTotal = filas.reduce((t, f) => t + f.gasto_usd, 0);
  const clientesConGasto = filas.filter((f) => f.gasto_usd > 0).reduce((t, f) => t + f.clientes, 0);
  const cacGeneral = gastoTotal > 0 && clientesConGasto > 0 ? gastoTotal / clientesConGasto : null;
  const pierde = cacGeneral !== null && vida !== null && cacGeneral > vida.ltv;

  return (
    <>
      <Encabezado titulo="Canales">De dónde vienen tus clientes y si cada canal te deja dinero.</Encabezado>
      <SelectorMes periodo={periodo} ruta="/admin/canales" />

      <div className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-3">
        <Tarjeta indice={1}>
          <Dato etiqueta="Gastaste en anuncios" numero={gastoTotal > 0 ? gastoTotal : null} formato="dinero" decimales={2} detalle={gastoTotal > 0 ? 'Lo que anotaste en Ajustes' : 'Anota tu gasto por canal en Ajustes'} />
        </Tarjeta>
        <Tarjeta indice={2}>
          <Dato
            etiqueta="Conseguir un cliente te cuesta"
            numero={cacGeneral}
            formato="dinero"
            decimales={2}
            tono={pierde ? 'mal' : 'neutro'}
            detalle={cacGeneral !== null ? 'Promedio de los canales con gasto' : 'Se calcula con gasto y clientes del mismo canal'}
          />
        </Tarjeta>
        <Tarjeta indice={3} className="col-span-2 lg:col-span-1">
          <Dato
            etiqueta="Un cliente te deja en total"
            numero={vida ? vida.ltv : null}
            formato="dinero"
            decimales={2}
            estimado={Boolean(vida)}
            detalle={vida ? `Se queda unos ${Math.round(vida.vidaMeses)} meses (tope 24) según quiénes se van` : 'Aparece con el primer cliente pagando'}
          />
        </Tarjeta>
      </div>
      {pierde && cacGeneral !== null && vida && (
        <div role="status" className="mb-4 rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--danger)_45%,transparent)] bg-[color-mix(in_oklab,var(--danger)_8%,transparent)] p-4 text-ayuda text-ink-1">
          <strong className="font-semibold">Cada cliente de anuncios te cuesta más de lo que deja</strong> ({dinero(cacGeneral)} contra unos {dinero(vida.ltv)}). Baja el gasto en los canales en rojo o sube lo que deja cada cliente (precio, plan anual).
        </div>
      )}

      <Tarjeta className="mb-4" indice={4}>
        <TituloTarjeta ayuda="Ordenados de peor a mejor. Lo sano es que cada $1 que gastas vuelva como $3 o más.">Cada canal</TituloTarjeta>
        {filas.length === 0 ? (
          <SinDatos porque="Aparecen con los primeros clientes. Para saber de dónde vienen, agrega ?sck=tiktok (o instagram, afiliado-ana…) al final de tu enlace de Hotmart en cada lugar donde lo publiques." />
        ) : (
          <ul className="flex flex-col gap-3">
            {filas.map((f) => {
              const tope = Math.max(f.gasto_usd, f.valor ?? 0, 1);
              return (
                <li key={f.canal} className="rounded-[var(--radius-chip)] bg-sunken p-3">
                  <div className="flex items-start justify-between gap-3">
                    <span className="min-w-0">
                      <span className="block font-display text-base font-bold break-words text-ink-1">{nombreCanal(f.canal)}</span>
                      <span className="block text-caption text-ink-2">
                        {entero(f.clientes)} {f.clientes === 1 ? 'cliente nuevo' : 'clientes nuevos'} · {entero(f.siguen)} siguen
                        {f.cac !== null && ` · cada uno costó ${dinero(f.cac)}`}
                      </span>
                    </span>
                    <span className="shrink-0 text-right">
                      <span className={`block font-display text-xl font-extrabold ${f.v.tono}`}>{f.v.texto}</span>
                      {f.ratio !== null && <span className="block text-xs whitespace-nowrap text-ink-3">vuelve ${decimal(f.ratio)} por cada $1</span>}
                    </span>
                  </div>
                  {f.gasto_usd > 0 && (
                    <div className="mt-3 flex flex-col gap-1.5" aria-label={`Gastado ${dinero(f.gasto_usd)}; dejarían ${f.valor !== null ? dinero(f.valor) : 'sin dato'}`}>
                      <div className="grid grid-cols-[5.5rem_1fr_auto] items-center gap-2 text-xs">
                        <span className="text-ink-3">Gastaste</span>
                        <span className="h-2 rounded-full bg-base">
                          <span className="block h-full rounded-full bg-[color-mix(in_oklab,var(--ink-2)_55%,transparent)]" style={{ width: `${(f.gasto_usd / tope) * 100}%` }} />
                        </span>
                        <span className="whitespace-nowrap tabular-nums text-ink-1">{dinero(f.gasto_usd, 0)}</span>
                      </div>
                      {f.valor !== null && (
                        <div className="grid grid-cols-[5.5rem_1fr_auto] items-center gap-2 text-xs">
                          <span className="text-ink-3">Te dejarán</span>
                          <span className="h-2 rounded-full bg-base">
                            <span className={`block h-full rounded-full ${f.valor >= f.gasto_usd ? 'bg-green' : 'bg-danger'}`} style={{ width: `${(f.valor / tope) * 100}%` }} />
                          </span>
                          <span className="whitespace-nowrap tabular-nums text-ink-1">{dinero(f.valor, 0)}</span>
                        </div>
                      )}
                    </div>
                  )}
                  <p className="mt-2 text-caption text-ink-2">
                    Cobrado este mes: <span className="font-semibold whitespace-nowrap text-ink-1 tabular-nums">{dinero(f.neto)}</span>
                    {f.recupero !== null && (
                      <>
                        {' '}
                        · recuperas lo gastado en unos {f.recupero} {f.recupero === 1 ? 'mes' : 'meses'}
                      </>
                    )}
                  </p>
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
    </>
  );
}
