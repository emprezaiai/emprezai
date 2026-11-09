// IA (30/31): costo REAL de cada uso (tabla ai_calls), por función y por usuario, contra lo que
// facturas y contra los topes que frenan la IA solos.

import { Dato, Encabezado, SinDatos, Tarjeta, TituloTarjeta } from '@/components/admin/ui';
import { dinero, entero, pct } from '@/lib/panel-formato';
import { calcularGanancia, leerAjustes, leerIa, leerVentas, periodoMes, topesIa } from '@/lib/servidor/panel';

const FUNCION: Record<string, string> = {
  primera_pieza: 'Pieza 1 gratis (antes de pagar)',
  mision_armar: 'Armar la pieza de cada misión',
  mision_opciones: 'Opciones de cada misión',
};

export default async function IaPanel() {
  const mes = periodoMes(0);
  const [ia, ventas, ajustes] = await Promise.all([leerIa(mes, 'ia_mes'), leerVentas(mes, 'ventas_mes'), leerAjustes()]);
  const g = calcularGanancia(ventas, ia.total_usd, ajustes.impuestosPct, 0);
  const topes = topesIa();
  const porcentaje = g.bruto > 0 ? (ia.total_usd / g.bruto) * 100 : null;
  const porUsuario = ia.usuarios_con_ia > 0 ? (ia.total_usd - ia.anonima_usd) / ia.usuarios_con_ia : null;
  const usoMes = Math.min(100, (ia.total_usd / topes.mensual) * 100);

  return (
    <>
      <Encabezado titulo="IA" periodo={mes.etiqueta}>
        Lo que cuesta de verdad cada vez que la IA trabaja.
      </Encabezado>

      <div className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Tarjeta>
          <Dato etiqueta="Costo del mes" valor={ia.llamadas > 0 ? dinero(ia.total_usd) : null} detalle={ia.llamadas > 0 ? `${entero(ia.llamadas)} usos` : 'La IA no se usó este mes'} />
        </Tarjeta>
        <Tarjeta>
          <Dato
            etiqueta="De lo que facturas"
            valor={porcentaje !== null ? pct(porcentaje, 1) : null}
            tono={porcentaje !== null && porcentaje > 20 ? 'mal' : porcentaje !== null ? 'bien' : 'neutro'}
            detalle={porcentaje !== null ? (porcentaje > 20 ? 'Pasa el 20% sano: revisa abajo qué gasta más' : 'Por debajo del 20%: sano') : 'Se calcula con la primera venta'}
          />
        </Tarjeta>
        <Tarjeta>
          <Dato etiqueta="Por cliente que la usa" valor={porUsuario !== null ? dinero(porUsuario, 3) : null} detalle={porUsuario !== null ? `${entero(ia.usuarios_con_ia)} clientes la usaron` : 'Aún ningún cliente la usó'} />
        </Tarjeta>
        <Tarjeta>
          <Dato etiqueta="Hoy" valor={dinero(ia.hoy_usd, 2)} detalle={`Tope diario ${dinero(topes.diario, 0)}: al llegar, la IA se pausa sola`} />
        </Tarjeta>
      </div>

      <Tarjeta className="mb-4">
        <TituloTarjeta ayuda={`Si se llega al tope, la IA se pausa y las piezas se arman con las respuestas de cada persona. Se cambia en Vercel (LIMITE_MENSUAL_USD).`}>Tope del mes</TituloTarjeta>
        <div className="flex items-baseline justify-between gap-3 text-caption">
          <span className="text-ink-1">
            Usaste <strong className="font-semibold tabular-nums">{dinero(ia.total_usd)}</strong> de {dinero(topes.mensual, 0)}
          </span>
          <span className="font-semibold tabular-nums text-ink-2">{pct(usoMes)}</span>
        </div>
        <span className="mt-2 block h-2 rounded-full bg-sunken">
          <span className={`block h-full rounded-full ${usoMes > 80 ? 'bg-warning' : 'bg-green'}`} style={{ width: `${Math.max(1, usoMes)}%` }} />
        </span>
      </Tarjeta>

      <div className="grid gap-3 lg:grid-cols-2">
        <Tarjeta>
          <TituloTarjeta ayuda="Qué parte de la app gasta más.">Por función</TituloTarjeta>
          {ia.por_funcion.length === 0 ? (
            <SinDatos porque="Aparece con el primer uso de la IA." />
          ) : (
            <ul className="flex flex-col gap-3">
              {ia.por_funcion.map((f) => (
                <li key={f.tipo} className="grid grid-cols-[1fr_auto] gap-x-3 gap-y-1">
                  <span className="text-caption text-ink-1">{FUNCION[f.tipo] ?? f.tipo}</span>
                  <span className="text-caption font-semibold tabular-nums text-ink-1">{dinero(f.usd)}</span>
                  <span className="col-span-2 h-1.5 rounded-full bg-sunken">
                    <span className="block h-full rounded-full bg-gold" style={{ width: `${ia.total_usd > 0 ? Math.max(2, (f.usd / ia.total_usd) * 100) : 0}%` }} />
                  </span>
                  <span className="col-span-2 text-xs text-ink-3">
                    {entero(f.llamadas)} usos · {dinero(f.llamadas > 0 ? f.usd / f.llamadas : 0, 4)} cada uno{f.fallos > 0 && ` · ${entero(f.fallos)} fallaron`}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Tarjeta>
        <Tarjeta>
          <TituloTarjeta ayuda="Si alguien gasta muchísimo más que el resto, puede ser abuso.">Quiénes más la usan</TituloTarjeta>
          {ia.top_usuarios.length === 0 ? (
            <SinDatos porque="Aparece cuando los clientes usen la IA dentro de la app." />
          ) : (
            <ol className="flex flex-col gap-2">
              {ia.top_usuarios.map((u, i) => (
                <li key={`${u.email}-${i}`} className="flex justify-between gap-3 text-caption">
                  <span className="min-w-0 truncate text-ink-1">{u.email}</span>
                  <span className="shrink-0 tabular-nums text-ink-2">
                    {dinero(u.usd, 3)} · {entero(u.llamadas)} usos
                  </span>
                </li>
              ))}
            </ol>
          )}
          {ia.anonima_usd > 0 && <p className="mt-3 text-caption text-ink-3">La pieza 1 gratis (antes de pagar) costó {dinero(ia.anonima_usd)} este mes.</p>}
        </Tarjeta>
      </div>
    </>
  );
}
