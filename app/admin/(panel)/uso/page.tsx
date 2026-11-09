// USO Y RETENCIÓN (24/36): ¿la gente usa la app y vuelve? Activos, activación, retención D1/D7/D30
// (por días con pieza armada), dónde se quedan en la ruta, el camino de venta y los pagadores fantasma.

import { Dato, Encabezado, SinDatos, Tarjeta, TituloTarjeta } from '@/components/admin/ui';
import { GraficoBarrasDia } from '@/components/admin/Graficos';
import { entero, pct } from '@/lib/panel-formato';
import { leerFunnel, leerUso, periodoMes } from '@/lib/servidor/panel';

const PASOS = [
  { clave: 'landing_vista', texto: 'Vieron tu página de ventas' },
  { clave: 'onboarding_iniciado', texto: 'Empezaron las preguntas' },
  { clave: 'resultado_visto', texto: 'Armaron su pieza 1' },
  { clave: 'paywall_visto', texto: 'Vieron los planes' },
  { clave: 'checkout_iniciado', texto: 'Fueron a pagar a Hotmart' },
] as const;

const semanaDeDia = (d: number) => (d <= 7 ? 1 : d <= 14 ? 2 : d <= 21 ? 3 : 4);
const tasa = (n: number, base: number) => (base > 0 ? (n / base) * 100 : null);

export default async function UsoPanel() {
  const mes = periodoMes(0);
  const [uso, funnel] = await Promise.all([leerUso(), leerFunnel(mes, 'funnel_mes')]);
  const r = uso.retencion;
  const activacion = tasa(uso.activados, uso.base_activacion);
  const semanas = [1, 2, 3, 4].map((s) => {
    // Las semanas de la ruta (lib/ruta): días 1-7, 8-14, 15-21 y 22-30.
    const dias = Object.entries(uso.dia_maximo).filter(([d]) => semanaDeDia(Number(d)) === s);
    return { semana: s, personas: dias.reduce((t, [, n]) => t + n, 0) };
  });
  const totalSemanas = Math.max(1, semanas.reduce((t, s) => t + s.personas, 0));
  const pasos = [...PASOS.map((p) => ({ texto: p.texto, n: funnel.pasos[p.clave] ?? 0 })), { texto: 'Empezaron prueba o compraron', n: funnel.pruebas_o_compras }];
  const base = pasos[0].n;

  return (
    <>
      <Encabezado titulo="Uso y retención" periodo={mes.etiqueta}>
        ¿La gente usa la app y vuelve al día siguiente?
      </Encabezado>

      <div className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Tarjeta>
          <Dato etiqueta="Activos hoy" valor={uso.con_piezas > 0 ? entero(uso.activos_hoy) : null} detalle={uso.con_piezas > 0 ? `${entero(uso.activos_7)} esta semana · ${entero(uso.activos_30)} este mes` : 'Aún nadie arma piezas en la app'} />
        </Tarjeta>
        <Tarjeta>
          <Dato
            etiqueta="Activación"
            valor={activacion !== null ? pct(activacion) : null}
            tono={activacion !== null && activacion >= 50 ? 'bien' : 'neutro'}
            detalle={activacion !== null ? 'Armaron su pieza 2 en su primera semana' : 'Se mide cuando alguien cumpla su primera semana'}
          />
        </Tarjeta>
        <Tarjeta>
          <Dato
            etiqueta="Pagadores fantasma"
            valor={uso.con_piezas > 0 ? entero(uso.fantasmas) : null}
            tono={uso.fantasmas > 0 ? 'mal' : 'neutro'}
            detalle={uso.fantasmas > 0 ? 'Pagan y llevan 14 días sin entrar: escríbeles hoy' : 'Nadie paga sin usar la app'}
          />
        </Tarjeta>
        <Tarjeta>
          <Dato etiqueta="Usan la app" valor={uso.con_piezas > 0 ? entero(uso.con_piezas) : null} detalle="Personas con al menos una pieza" />
        </Tarjeta>
      </div>

      <Tarjeta className="mb-4">
        <TituloTarjeta ayuda="De quienes empezaron hace al menos 1, 7 o 30 días: cuántos armaron una pieza ese día exacto.">¿Vuelven?</TituloTarjeta>
        {r.base_d1 === 0 ? (
          <SinDatos porque="Se mide desde el día siguiente a la primera pieza armada en la app." />
        ) : (
          <div className="grid grid-cols-3 gap-3">
            {[
              { t: 'Al día siguiente', n: r.d1, b: r.base_d1, meta: 40 },
              { t: 'A la semana', n: r.d7, b: r.base_d7, meta: 20 },
              { t: 'Al mes', n: r.d30, b: r.base_d30, meta: 10 },
            ].map(({ t, n, b, meta }) => {
              const v = tasa(n, b);
              return (
                <Dato
                  key={t}
                  etiqueta={t}
                  valor={v !== null ? pct(v) : null}
                  tono={v !== null && v >= meta ? 'bien' : 'neutro'}
                  detalle={v !== null ? `${entero(n)} de ${entero(b)}` : 'Aún nadie llegó a ese día'}
                />
              );
            })}
          </div>
        )}
      </Tarjeta>

      <div className="mb-4 grid gap-3 lg:grid-cols-2">
        <Tarjeta>
          <TituloTarjeta ayuda="La acción principal de la app, día por día (últimos 30 días).">Piezas armadas</TituloTarjeta>
          {uso.piezas_por_dia.some((d) => d.piezas > 0) ? <GraficoBarrasDia datos={uso.piezas_por_dia} /> : <SinDatos porque="Aparece con la primera pieza armada en la app." />}
        </Tarjeta>
        <Tarjeta>
          <TituloTarjeta ayuda="Hasta qué semana de la ruta llegó cada persona.">Dónde se quedan</TituloTarjeta>
          {uso.con_piezas === 0 ? (
            <SinDatos porque="Aparece cuando la gente arme piezas en la app." />
          ) : (
            <ul className="flex flex-col gap-3">
              {semanas.map((s) => (
                <li key={s.semana} className="grid grid-cols-[1fr_auto] gap-x-3 gap-y-1">
                  <span className="text-caption text-ink-1">Semana {s.semana}</span>
                  <span className="text-caption font-semibold tabular-nums text-ink-1">
                    {entero(s.personas)} <span className="font-normal text-ink-3">({pct((s.personas / totalSemanas) * 100)})</span>
                  </span>
                  <span className="col-span-2 h-1.5 rounded-full bg-sunken">
                    <span className="block h-full rounded-full bg-gold" style={{ width: `${(s.personas / totalSemanas) * 100}%` }} />
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Tarjeta>
      </div>

      <Tarjeta>
        <TituloTarjeta ayuda="Personas distintas en cada paso este mes, sin tus visitas de prueba.">El camino de venta</TituloTarjeta>
        {funnel.sin_eventos || base === 0 ? (
          <SinDatos porque="Se llena solo con las visitas a tu página de ventas (se empezaron a medir con este panel)." />
        ) : (
          <ol className="flex flex-col gap-3">
            {pasos.map((p, i) => {
              const delAnterior = i > 0 ? tasa(p.n, pasos[i - 1].n) : null;
              return (
                <li key={p.texto} className="grid grid-cols-[1fr_auto] gap-x-3 gap-y-1">
                  <span className="text-caption text-ink-1">{p.texto}</span>
                  <span className="text-caption font-semibold tabular-nums text-ink-1">
                    {entero(p.n)}
                    {delAnterior !== null && <span className={`ml-2 font-normal ${delAnterior < 30 ? 'text-warning' : 'text-ink-3'}`}>{pct(delAnterior)} del paso anterior</span>}
                  </span>
                  <span className="col-span-2 h-2 rounded-full bg-sunken">
                    <span className={`block h-full rounded-full ${i === pasos.length - 1 ? 'bg-green' : 'bg-gold'}`} style={{ width: `${Math.max(2, (p.n / base) * 100)}%` }} />
                  </span>
                </li>
              );
            })}
          </ol>
        )}
        {!funnel.sin_eventos && base > 0 && (
          <p className="mt-3 text-caption text-ink-2">
            De cada 100 visitas, <strong className="font-semibold text-ink-1">{pct(((funnel.pruebas_o_compras || 0) / base) * 100, 1)}</strong> terminan empezando la prueba o comprando.
          </p>
        )}
      </Tarjeta>
    </>
  );
}
