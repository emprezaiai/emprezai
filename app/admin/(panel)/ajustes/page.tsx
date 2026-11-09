// AJUSTES: lo que solo la dueña sabe y el panel necesita para la ganancia real y los canales:
// % de impuestos (estimado), costos fijos mensuales y lo que gasta en cada canal.

import { FormImpuestos, ListaCostos, ListaGastos } from '@/components/admin/FormulariosAjustes';
import { Encabezado, SinDatos, Tarjeta, TituloTarjeta } from '@/components/admin/ui';
import { leerAjustes, modoCaptura } from '@/lib/servidor/panel';

export default async function AjustesPanel() {
  const a = await leerAjustes();
  const enCaptura = <SinDatos porque="Se edita en el panel real (en esta captura de prueba no hay base de datos)." />;

  return (
    <>
      <Encabezado titulo="Ajustes">Datos que solo tú sabes y que el panel usa para calcular tu ganancia.</Encabezado>

      <Tarjeta className="mb-4">
        <TituloTarjeta ayuda="Es una estimación (depende de tu país y de cómo factures). Pregúntale a tu contador el número exacto.">Impuestos</TituloTarjeta>
        {modoCaptura ? <p className="text-ayuda text-ink-1">Hoy: {a.impuestosPct}% de lo que facturas.</p> : <FormImpuestos actual={a.impuestosPct} />}
      </Tarjeta>

      <Tarjeta className="mb-4">
        <TituloTarjeta ayuda="Lo que pagas cada mes para que la app funcione: Vercel, Supabase, dominio, correos.">Costos fijos mensuales</TituloTarjeta>
        {modoCaptura ? (
          <>
            <ul className="mb-3 divide-y divide-[var(--line)]">
              {a.costos.map((c) => (
                <li key={c.id} className="flex justify-between py-2 text-ayuda">
                  <span className="text-ink-1">{c.nombre}</span>
                  <span className="tabular-nums text-ink-2">${c.monto_usd.toFixed(2)} al mes</span>
                </li>
              ))}
            </ul>
            {enCaptura}
          </>
        ) : (
          <ListaCostos costos={a.costos} />
        )}
      </Tarjeta>

      <Tarjeta id="gastos">
        <TituloTarjeta ayuda="Para saber qué canal te deja dinero. El canal tiene que ser el mismo código sck que pusiste en tu enlace de Hotmart (ej.: …?sck=tiktok).">Gasto en anuncios por canal</TituloTarjeta>
        {modoCaptura ? (
          <>
            <ul className="mb-3 divide-y divide-[var(--line)]">
              {a.gastos.map((g) => (
                <li key={g.id} className="flex justify-between py-2 text-ayuda">
                  <span className="text-ink-1">{g.canal}</span>
                  <span className="tabular-nums text-ink-2">${g.monto_usd.toFixed(2)}</span>
                </li>
              ))}
            </ul>
            {enCaptura}
          </>
        ) : (
          <ListaGastos gastos={a.gastos} />
        )}
      </Tarjeta>
    </>
  );
}
