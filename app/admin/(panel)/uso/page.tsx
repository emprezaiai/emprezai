// USO Y RETENCIÓN (24/36): ¿la gente usa la app y vuelve? Activos, activación, retención D1/D7/D30
// (por días con pieza armada), dónde se quedan en la ruta, el camino de venta del mes elegido y los
// pagadores fantasma (con enlace para verlos).

import { Barra, Dato, Encabezado, Lectura, SelectorMes, SinDatos, Tarjeta, TituloTarjeta, Variacion } from '@/components/admin/ui';
import { GraficoBarrasDia } from '@/components/admin/Graficos';
import { entero, pct, variacion } from '@/lib/panel-formato';
import { leerFunnel, leerUso, periodoElegido } from '@/lib/servidor/panel';

const PASOS = [
  { clave: 'landing_vista', texto: 'Vieron tu página de ventas' },
  { clave: 'onboarding_iniciado', texto: 'Empezaron las preguntas' },
  { clave: 'resultado_visto', texto: 'Armaron su pieza 1' },
  { clave: 'paywall_visto', texto: 'Vieron los planes' },
  { clave: 'checkout_iniciado', texto: 'Fueron a pagar a Hotmart' },
] as const;

// La pantalla que decide cada salto del camino (para saber QUÉ mejorar, no a quién culpar).
const PANTALLA = ['tu página de ventas', 'las preguntas de bienvenida', 'la pieza 1 que ven al terminar', 'la pantalla de planes', 'la página de pago de Hotmart'];
const enMinuscula = (t: string) => t.charAt(0).toLowerCase() + t.slice(1);

const semanaDeDia = (d: number) => (d <= 7 ? 1 : d <= 14 ? 2 : d <= 21 ? 3 : 4);
const tasa = (n: number, base: number) => (base > 0 ? (n / base) * 100 : null);

export default async function UsoPanel({ searchParams }: { searchParams: Promise<{ mes?: string }> }) {
  const periodo = periodoElegido((await searchParams).mes);
  const [uso, funnel] = await Promise.all([leerUso(), leerFunnel(periodo, 'funnel_mes')]);
  const r = uso.retencion;
  const activacion = tasa(uso.activados, uso.base_activacion);
  const semanas = [1, 2, 3, 4].map((s) => ({
    semana: s,
    personas: Object.entries(uso.dia_maximo)
      .filter(([d]) => semanaDeDia(Number(d)) === s)
      .reduce((t, [, n]) => t + n, 0),
  }));
  const totalSemanas = Math.max(1, semanas.reduce((t, s) => t + s.personas, 0));
  const terminaronRuta = Object.entries(uso.dia_maximo)
    .filter(([d]) => Number(d) >= 30)
    .reduce((t, [, n]) => t + n, 0);
  const pasos = [...PASOS.map((p) => ({ texto: p.texto, n: funnel.pasos[p.clave] ?? 0 })), { texto: 'Empezaron prueba o compraron', n: funnel.pruebas_o_compras }];
  const base = pasos[0].n;
  // El paso donde más gente se pierde (para decidir qué mejorar primero).
  const caidas = pasos.slice(1).map((p, i) => ({ i: i + 1, t: tasa(p.n, pasos[i].n) ?? 100 }));
  const peor = caidas.length > 0 ? caidas.reduce((a, b) => (b.t < a.t ? b : a)) : null;
  const totalPiezas = uso.piezas_por_dia.reduce((t, d) => t + d.piezas, 0);
  const semanaMasComun = semanas.reduce((a, b) => (b.personas > a.personas ? b : a));

  return (
    <div key={periodo.param} className="panel-fundido">
      <Encabezado titulo="Uso y retención">¿La gente usa la app y vuelve al día siguiente?</Encabezado>

      <div className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Tarjeta indice={1}>
          <Dato etiqueta="Activos hoy" numero={uso.con_piezas > 0 ? uso.activos_hoy : null} detalle={uso.con_piezas > 0 ? `${entero(uso.activos_7)} esta semana · ${entero(uso.activos_30)} este mes` : 'Aún nadie arma piezas en la app'} />
        </Tarjeta>
        <Tarjeta indice={2}>
          <Dato
            etiqueta="Activación"
            numero={activacion}
            formato="pct"
            tono={activacion !== null && activacion >= 50 ? 'bien' : 'neutro'}
            detalle={activacion !== null ? 'Armaron su pieza 2 en su primera semana' : 'Se mide cuando alguien cumpla su primera semana'}
          />
        </Tarjeta>
        <Tarjeta indice={3} href={uso.fantasmas > 0 ? '/admin/usuarios?estado=fantasma' : undefined}>
          <Dato
            etiqueta="Pagan y no entran"
            numero={uso.con_piezas > 0 ? uso.fantasmas : null}
            tono={uso.fantasmas > 0 ? 'mal' : 'bien'}
            detalle={
              uso.fantasmas > 0 ? 'Hace 14 días o más · tócala para verlos' : 'Nadie paga sin usar la app'
            }
          />
        </Tarjeta>
        <Tarjeta indice={4}>
          <Dato etiqueta="Llegaron al día 30" numero={uso.con_piezas > 0 ? terminaronRuta : null} detalle={`De ${entero(uso.con_piezas)} que usan la app`} />
        </Tarjeta>
      </div>

      <Tarjeta className="mb-4" indice={5}>
        <TituloTarjeta ayuda="De quienes empezaron hace al menos 1, 7 o 30 días: cuántos armaron una pieza ese día exacto.">¿Vuelven?</TituloTarjeta>
        {r.base_d1 === 0 ? (
          <SinDatos porque="Se mide desde el día siguiente a la primera pieza armada en la app." />
        ) : (
          <>
            <div className="grid grid-cols-3 gap-3">
              {[
                { t: 'Al día siguiente', n: r.d1, b: r.base_d1, meta: 40 },
                { t: 'A la semana', n: r.d7, b: r.base_d7, meta: 20 },
                { t: 'Al mes', n: r.d30, b: r.base_d30, meta: 10 },
              ].map(({ t, n, b, meta }) => {
                const v = tasa(n, b);
                return <Dato key={t} reservar={false} etiqueta={t} numero={v} formato="pct" tono={v !== null && v >= meta ? 'bien' : 'neutro'} detalle={v !== null ? `${entero(n)} de ${entero(b)}` : 'Aún nadie llegó'} />;
              })}
            </div>
            <Lectura tono={(tasa(r.d7, r.base_d7) ?? 0) >= 20 ? 'bien' : 'mal'}>
              {(tasa(r.d7, r.base_d7) ?? 0) >= 20 ? 'Buena señal: en apps de hábito, que 1 de cada 5 siga a la semana ya es sano.' : 'A la semana vuelven pocos: revisa qué pasa entre el día 2 y el 7 de la ruta.'}
            </Lectura>
          </>
        )}
      </Tarjeta>

      <div className="mb-4 grid gap-3 lg:grid-cols-2">
        <Tarjeta indice={6}>
          <TituloTarjeta ayuda="Últimos 30 días: la acción principal de la app, día por día.">Piezas armadas</TituloTarjeta>
          {totalPiezas > 0 ? (
            <>
              <p className="mb-2 text-caption text-ink-2">
                <strong className="font-display text-xl font-extrabold text-ink-1 tabular-nums">{entero(totalPiezas)}</strong> piezas · unas {entero(Math.round(totalPiezas / 30))} por día ·{' '}
                <Variacion cambio={uso.piezas_30_anterior ? variacion(totalPiezas, uso.piezas_30_anterior) : null} contra="los 30 días anteriores" />
              </p>
              <GraficoBarrasDia datos={uso.piezas_por_dia} />
            </>
          ) : (
            <SinDatos porque="Aparece con la primera pieza armada en la app." />
          )}
        </Tarjeta>
        <Tarjeta indice={7}>
          <TituloTarjeta ayuda="Hoy: hasta qué semana de la ruta llegó cada persona.">Dónde se quedan</TituloTarjeta>
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
                  <span className="col-span-2">
                    <Barra pct={(s.personas / totalSemanas) * 100} tono="verde" indice={s.semana} />
                  </span>
                </li>
              ))}
            </ul>
          )}
          {uso.con_piezas > 0 && semanaMasComun.personas > 0 && (
            <Lectura tono={semanaMasComun.semana === 1 ? 'mal' : 'neutro'}>
              La mayoría ({pct((semanaMasComun.personas / totalSemanas) * 100)}) está en la semana {semanaMasComun.semana}.
              {semanaMasComun.semana === 1 ? ' Si no pasan de ahí, mira qué misión de la semana 1 los frena.' : ' Van avanzando por la ruta.'}
            </Lectura>
          )}
        </Tarjeta>
      </div>

      <Tarjeta indice={8}>
        <TituloTarjeta ayuda="Del mes que elijas: personas distintas en cada paso, sin tus visitas de prueba.">El camino de venta</TituloTarjeta>
        <SelectorMes periodo={periodo} ruta="/admin/uso" />
        {funnel.sin_eventos || base === 0 ? (
          <SinDatos porque="Se llena solo con las visitas a tu página de ventas (se empezaron a medir con este panel)." />
        ) : (
          <>
            <ol className="flex flex-col gap-3">
              {pasos.map((p, i) => {
                const delAnterior = i > 0 ? tasa(p.n, pasos[i - 1].n) : null;
                // Se pinta el paso DONDE está la pantalla a mejorar (el de antes de la caída).
                const esPeor = peor !== null && peor.i - 1 === i;
                return (
                  <li key={p.texto} className="grid grid-cols-[1fr_auto] gap-x-3 gap-y-1">
                    <span className={`text-caption ${esPeor ? 'font-semibold text-warning' : 'text-ink-1'}`}>{p.texto}</span>
                    <span className="text-caption font-semibold whitespace-nowrap tabular-nums text-ink-1">
                      {entero(p.n)}
                      {delAnterior !== null && <span className={`ml-2 font-normal ${esPeor ? 'text-warning' : 'text-ink-3'}`}>{pct(delAnterior)}</span>}
                    </span>
                    <span className="col-span-2">
                      <Barra pct={(p.n / base) * 100} tono={esPeor ? 'ambar' : 'verde'} indice={i} />
                    </span>
                  </li>
                );
              })}
            </ol>
            <Lectura tono={peor && peor.t < 30 ? 'mal' : 'neutro'}>
              De cada 100 visitas, <strong className="font-semibold text-ink-1">{pct((funnel.pruebas_o_compras / base) * 100, 1)}</strong> terminan empezando la prueba o comprando.
              {peor && ` Donde más gente se pierde es entre "${enMinuscula(pasos[peor.i - 1].texto)}" y "${enMinuscula(pasos[peor.i].texto)}" (solo sigue el ${pct(peor.t)}): mejora primero ${PANTALLA[peor.i - 1]}.`}
            </Lectura>
          </>
        )}
      </Tarjeta>
    </div>
  );
}
