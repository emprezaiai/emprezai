// IA (30/31): costo REAL de cada uso (tabla ai_calls). El número principal es cuánto de lo que
// facturas se va en IA; después los topes que la frenan sola, qué función gasta más y quién la usa
// más que el resto. Con flechas para ver otros meses.

import Link from 'next/link';
import { Barra, Dato, Encabezado, Lectura, SelectorMes, SinDatos, Tarjeta, TituloTarjeta } from '@/components/admin/ui';
import { Cuenta } from '@/components/admin/movimiento';
import { GraficoGastoDia } from '@/components/admin/Graficos';
import { dinero, entero, fechaCorta, pct } from '@/lib/panel-formato';
import { calcularGanancia, calcularMrr, leerAjustes, leerClientes, leerIa, leerVentas, periodoElegido, topesIa } from '@/lib/servidor/panel';

/** Costo por uso legible: nunca "$0,000" (parece gratis o un error). */
const cadaUso = (usd: number) => (usd > 0 && usd < 0.001 ? 'menos de $0,001' : dinero(usd, 3));

const FUNCION: Record<string, string> = {
  primera_pieza: 'Pieza 1 gratis (antes de pagar)',
  mision_armar: 'Armar la pieza de cada misión',
  mision_opciones: 'Opciones de cada misión',
};

export default async function IaPanel({ searchParams }: { searchParams: Promise<{ mes?: string }> }) {
  const periodo = periodoElegido((await searchParams).mes);
  const [ia, ventas, ajustes, clientes] = await Promise.all([leerIa(periodo, 'ia_mes'), leerVentas(periodo, 'ventas_mes'), leerAjustes(), leerClientes()]);
  const g = calcularGanancia(ventas, ia.total_usd, ajustes.impuestosPct, 0);
  const topes = topesIa();
  const porcentaje = g.bruto > 0 ? (ia.total_usd / g.bruto) * 100 : null;
  const deClientes = ia.total_usd - ia.anonima_usd;
  const porUsuario = ia.usuarios_con_ia > 0 ? deClientes / ia.usuarios_con_ia : null;
  const usoMes = Math.min(100, (ia.total_usd / topes.mensual) * 100);
  // "Hoy" sale de la MISMA serie día por día (así nunca contradice al día más caro).
  const serie = ia.por_dia ?? [];
  const hoyUsd = periodo.esActual && serie.length > 0 ? serie[serie.length - 1].usd : ia.hoy_usd;
  const usoHoy = Math.min(100, (hoyUsd / topes.diario) * 100);
  const diaMasCaro = serie.length > 0 ? serie.reduce((a, b) => (b.usd > a.usd ? b : a)) : null;
  const promedioDia = serie.length > 0 ? ia.total_usd / serie.length : 0;
  const hayDisparados = serie.some((d) => promedioDia > 0 && d.usd > promedioDia * 2);
  const { mrr, pagando } = calcularMrr(clientes);
  const pagaUno = pagando > 0 ? mrr / pagando : null;
  const sospechosos = porUsuario !== null ? ia.top_usuarios.filter((u) => u.usd > porUsuario * 3) : [];

  return (
    <div key={periodo.param} className="panel-fundido">
      <Encabezado titulo="IA">Lo que cuesta de verdad cada vez que la IA trabaja.</Encabezado>
      <SelectorMes periodo={periodo} ruta="/admin/ia" />

      <Tarjeta destacada className="mb-4" indice={1}>
        <p className="text-caption font-semibold text-ink-2">De lo que facturas, se va en IA</p>
        {porcentaje !== null ? (
          <>
            <p className={`mt-1 font-display text-4xl leading-none font-extrabold ${porcentaje > 20 ? 'text-danger' : 'text-gold'}`}>
              <Cuenta valor={porcentaje} formato="pct" decimales={1} />
            </p>
            <Lectura tono={porcentaje > 20 ? 'mal' : 'bien'}>
              {porcentaje > 20
                ? 'Pasa el 20% sano: mira abajo qué función gasta más y si alguien la usa mucho más que el resto.'
                : `Sano: está por debajo del 20%. Gastaste ${dinero(ia.total_usd)} en ${entero(ia.llamadas)} usos.`}
            </Lectura>
          </>
        ) : (
          <p className="mt-1 text-ayuda text-ink-2">
            {ia.llamadas > 0 ? `Gastaste ${dinero(ia.total_usd)} en ${entero(ia.llamadas)} usos; el porcentaje aparece con la primera venta.` : 'La IA no se usó en este mes.'}
          </p>
        )}
      </Tarjeta>

      <div className="mb-4 grid grid-cols-2 gap-3">
        <Tarjeta indice={2}>
          <Dato
            etiqueta="IA por cliente"
            numero={porUsuario}
            formato="dinero"
            decimales={3}
            detalle={porUsuario !== null ? (pagaUno ? `${pct((porUsuario / pagaUno) * 100, 1)} de lo que paga uno` : `${entero(ia.usuarios_con_ia)} clientes`) : 'Aún ningún cliente la usó'}
          />
        </Tarjeta>
        <Tarjeta indice={3}>
          <Dato
            etiqueta="Usos de la IA"
            numero={ia.llamadas}
            detalle={ia.fallos > 0 ? `${entero(ia.fallos)} no respondieron (se armó sin IA)` : 'Todos respondieron bien'}
            tono={ia.llamadas > 0 && ia.fallos / ia.llamadas > 0.1 ? 'mal' : 'neutro'}
          />
        </Tarjeta>
      </div>

      <Tarjeta className="mb-4" indice={4}>
        <TituloTarjeta ayuda="Al llegar a un tope, la IA se pausa sola y las piezas se arman sin ella.">Topes de gasto</TituloTarjeta>
        <div className="flex flex-col gap-3">
          {periodo.esActual && (
            <div>
              <div className="flex items-baseline justify-between gap-3 text-caption">
                <span className="text-ink-1">
                  Hoy: <strong className="font-semibold tabular-nums">{dinero(hoyUsd)}</strong> de {dinero(topes.diario, 0)}
                </span>
                <span className="font-semibold tabular-nums text-ink-2">{pct(usoHoy)}</span>
              </div>
              <div className="mt-1">
                <Barra pct={usoHoy} tono={usoHoy > 80 ? 'ambar' : 'verde'} />
              </div>
            </div>
          )}
          <div>
            <div className="flex items-baseline justify-between gap-3 text-caption">
              <span className="text-ink-1">
                {periodo.esActual ? 'Este mes' : 'Ese mes'}: <strong className="font-semibold tabular-nums">{dinero(ia.total_usd)}</strong> de {dinero(topes.mensual, 0)}
              </span>
              <span className="font-semibold tabular-nums text-ink-2">{pct(usoMes)}</span>
            </div>
            <div className="mt-1">
              <Barra pct={usoMes} tono={usoMes > 80 ? 'ambar' : 'verde'} />
            </div>
          </div>
        </div>
      </Tarjeta>

      {ia.por_dia && ia.por_dia.some((d) => d.usd > 0) && (
        <Tarjeta className="mb-4" indice={5}>
          <TituloTarjeta ayuda={`Punteada: tu promedio · verde: hoy${hayDisparados ? ' · ámbar: más del doble' : ''}.`}>Gasto día por día</TituloTarjeta>
          <p className="mb-2 text-caption text-ink-2">
            Promedio <strong className="font-semibold text-ink-1 tabular-nums">{dinero(promedioDia, 2)}</strong> por día
            {diaMasCaro && (
              <>
                {' '}
                · el más caro fue el {fechaCorta(`${diaMasCaro.fecha}T12:00:00Z`)} (<strong className="font-semibold text-ink-1 tabular-nums">{dinero(diaMasCaro.usd, 2)}</strong>)
              </>
            )}
          </p>
          <GraficoGastoDia datos={ia.por_dia} />
        </Tarjeta>
      )}

      <div className="grid gap-3 lg:grid-cols-2">
        <Tarjeta indice={6}>
          <TituloTarjeta ayuda="Qué parte de la app gasta más.">Por función</TituloTarjeta>
          {ia.por_funcion.length === 0 ? (
            <SinDatos porque="Aparece con el primer uso de la IA." />
          ) : (
            <ul className="flex flex-col gap-3">
              {ia.por_funcion.map((f) => (
                <li key={f.tipo} className="grid grid-cols-[1fr_auto] gap-x-3 gap-y-1">
                  <span className="text-caption text-ink-1">{FUNCION[f.tipo] ?? f.tipo}</span>
                  <span className="text-caption font-semibold tabular-nums text-ink-1">{dinero(f.usd)}</span>
                  <span className="col-span-2">
                    <Barra pct={ia.total_usd > 0 ? (f.usd / ia.total_usd) * 100 : 0} tono="neutra" indice={ia.por_funcion.indexOf(f)} />
                  </span>
                  <span className="col-span-2 text-xs text-ink-3">
                    {entero(f.llamadas)} usos · {cadaUso(f.llamadas > 0 ? f.usd / f.llamadas : 0)} cada uno{f.fallos > 0 && ` · ${entero(f.fallos)} fallaron`}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Tarjeta>
        <Tarjeta indice={7}>
          <TituloTarjeta>Quiénes más la usan</TituloTarjeta>
          {ia.top_usuarios.length === 0 ? (
            <SinDatos porque="Aparece cuando los clientes usen la IA dentro de la app." />
          ) : (
            <>
              <ol className="flex flex-col gap-2">
                {ia.top_usuarios.map((u, i) => {
                  const alto = sospechosos.includes(u);
                  return (
                    <li key={`${u.email}-${i}`} className="flex items-center justify-between gap-3 text-caption">
                      {u.id ? (
                        <Link href={`/admin/usuarios/${u.id}`} className={`flex min-h-11 min-w-0 items-center truncate underline underline-offset-4 ${alto ? 'font-semibold text-warning' : 'text-ink-1'}`}>
                          {u.email}
                        </Link>
                      ) : (
                        <span className={`min-w-0 truncate ${alto ? 'font-semibold text-warning' : 'text-ink-1'}`}>{u.email}</span>
                      )}
                      <span className="shrink-0 whitespace-nowrap tabular-nums text-ink-2">
                        {dinero(u.usd, 3)} · {entero(u.llamadas)} usos
                      </span>
                    </li>
                  );
                })}
              </ol>
              <Lectura tono={sospechosos.length > 0 ? 'mal' : 'bien'}>
                {sospechosos.length > 0
                  ? `${sospechosos.length === 1 ? 'Una persona usa' : `${sospechosos.length} personas usan`} más de 3 veces el promedio (marcadas en ámbar). Revisa que no sea abuso.`
                  : 'Nadie se pasa: todos usan la IA en cantidades parecidas.'}
              </Lectura>
            </>
          )}
        </Tarjeta>
      </div>
    </div>
  );
}
