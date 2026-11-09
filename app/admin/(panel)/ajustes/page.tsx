// AJUSTES: lo que solo la dueña sabe y el panel necesita para la ganancia real y los canales:
// % de impuestos (estimado), costos fijos mensuales y lo que gasta en cada canal. En la captura de
// prueba se ven los MISMOS formularios (las acciones responden "sin permiso" porque no hay base).

import { FormImpuestos, ListaCostos, ListaGastos } from '@/components/admin/FormulariosAjustes';
import { Encabezado, Tarjeta, TituloTarjeta } from '@/components/admin/ui';
import { calcularGanancia, fechasPorDefecto, leerAjustes, leerCanales, leerVentas, periodoElegido } from '@/lib/servidor/panel';

const CANALES_BASE = ['tiktok', 'instagram', 'facebook', 'youtube', 'google'];

export default async function AjustesPanel() {
  const periodo = periodoElegido();
  const [a, ventas, canalesMes] = await Promise.all([leerAjustes(), leerVentas(periodo, 'ventas_mes'), leerCanales(periodo, 'canales_mes')]);
  const impuestosMes = calcularGanancia(ventas, 0, a.impuestosPct, 0).impuestos;
  // Los canales que ya conoce el panel (de las ventas y de gastos anteriores) + los más comunes.
  const canales = [...new Set([...canalesMes.map((c) => c.canal), ...a.gastos.map((g) => g.canal), ...CANALES_BASE])].filter((c) => c !== 'sin código');
  const { desde, hasta } = fechasPorDefecto();

  return (
    <>
      <Encabezado titulo="Ajustes">Datos que solo tú sabes y que el panel usa para calcular tu ganancia.</Encabezado>

      <Tarjeta destacada className="mb-4" indice={1}>
        <TituloTarjeta ayuda="Es una estimación: depende de tu país y de cómo factures. Pregúntale a tu contador el número exacto.">Impuestos y retenciones</TituloTarjeta>
        <FormImpuestos actual={a.impuestosPct} esteMes={impuestosMes} />
      </Tarjeta>

      <Tarjeta className="mb-4" indice={2}>
        <TituloTarjeta ayuda="Lo que pagas cada mes para que la app funcione: Vercel, Supabase, dominio, correos.">Costos fijos mensuales</TituloTarjeta>
        <ListaCostos costos={a.costos} />
      </Tarjeta>

      <Tarjeta id="gastos" indice={3}>
        <TituloTarjeta ayuda="Para saber qué canal te deja dinero. Anota cuánto gastaste y en qué fechas.">Gasto en anuncios por canal</TituloTarjeta>
        <ListaGastos gastos={a.gastos} canales={canales} desde={desde} hasta={hasta} />
      </Tarjeta>
    </>
  );
}
