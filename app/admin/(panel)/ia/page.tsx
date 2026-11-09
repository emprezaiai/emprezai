// IA (30/31): costo REAL de cada uso (tabla ai_calls). El número principal es cuánto de lo que
// facturas se va en IA; después los topes que la frenan sola, qué función gasta más y quién la usa
// más que el resto. Con flechas para ver otros meses.

import { Barra, Dato, Encabezado, Lectura, SelectorMes, SinDatos, Tarjeta, TituloTarjeta } from '@/components/admin/ui';
import { Cuenta } from '@/components/admin/movimiento';
import { dinero, entero, pct } from '@/lib/panel-formato';
import { calcularGanancia, leerAjustes, leerIa, leerVentas, periodoElegido, topesIa } from '@/lib/servidor/panel';

const FUNCION: Record<string, string> = {
  primera_pieza: 'Pieza 1 gratis (antes de pagar)',
  mision_armar: 'Armar la pieza de cada misión',
  mision_opciones: 'Opciones de cada misión',
};

export default async function IaPanel({ searchParams }: { searchParams: Promise<{ mes?: string }> }) {
  const periodo = periodoElegido((await searchParams).mes);
  const [ia, ventas, ajustes] = await Promise.all([leerIa(periodo, 'ia_mes'), leerVentas(periodo, 'ventas_mes'), leerAjustes()]);
  const g = calcularGanancia(ventas, ia.total_usd, ajustes.impuestosPct, 0);
  const topes = topesIa();
  const porcentaje = g.bruto > 0 ? (ia.total_usd / g.bruto) * 100 : null;
  const deClientes = ia.total_usd - ia.anonima_usd;
  const porUsuario = ia.usuarios_con_ia > 0 ? deClientes / ia.usuarios_con_ia : null;
  const usoMes = Math.min(100, (ia.total_usd / topes.mensual) * 100);
  const usoHoy = Math.min(100, (ia.hoy_usd / topes.diario) * 100);
  const sospechosos = porUsuario !== null ? ia.top_usuarios.filter((u) => u.usd > porUsuario * 3) : [];

  return (
    <>
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
            etiqueta="Por cliente que la usa"
            numero={porUsuario}
            formato="dinero"
            decimales={3}
            detalle={porUsuario !== null ? `${entero(ia.usuarios_con_ia)} clientes · sin contar la pieza gratis` : 'Aún ningún cliente la usó'}
          />
        </Tarjeta>
        <Tarjeta indice={3}>
          <Dato etiqueta="La pieza gratis costó" numero={ia.anonima_usd} formato="dinero" decimales={2} detalle="Antes de pagar, en este mes" />
        </Tarjeta>
      </div>

      <Tarjeta className="mb-4" indice={4}>
        <TituloTarjeta ayuda="Si se llega a un tope, la IA se pausa sola y las piezas se arman con las respuestas de cada persona. Si quieres cambiar los topes, pídemelo.">Topes de gasto</TituloTarjeta>
        <div className="flex flex-col gap-3">
          {periodo.esActual && (
            <div>
              <div className="flex items-baseline justify-between gap-3 text-caption">
                <span className="text-ink-1">
                  Hoy: <strong className="font-semibold tabular-nums">{dinero(ia.hoy_usd)}</strong> de {dinero(topes.diario, 0)}
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

      <div className="grid gap-3 lg:grid-cols-2">
        <Tarjeta indice={5}>
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
                    <Barra pct={ia.total_usd > 0 ? (f.usd / ia.total_usd) * 100 : 0} tono="neutra" />
                  </span>
                  <span className="col-span-2 text-xs text-ink-3">
                    {entero(f.llamadas)} usos · {dinero(f.llamadas > 0 ? f.usd / f.llamadas : 0, 3)} cada uno{f.fallos > 0 && ` · ${entero(f.fallos)} fallaron`}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Tarjeta>
        <Tarjeta indice={6}>
          <TituloTarjeta>Quiénes más la usan</TituloTarjeta>
          {ia.top_usuarios.length === 0 ? (
            <SinDatos porque="Aparece cuando los clientes usen la IA dentro de la app." />
          ) : (
            <>
              <ol className="flex flex-col gap-2">
                {ia.top_usuarios.map((u, i) => {
                  const alto = sospechosos.includes(u);
                  return (
                    <li key={`${u.email}-${i}`} className="flex justify-between gap-3 text-caption">
                      <span className={`min-w-0 truncate ${alto ? 'font-semibold text-warning' : 'text-ink-1'}`}>{u.email}</span>
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
    </>
  );
}
