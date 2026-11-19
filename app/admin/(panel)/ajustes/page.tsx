// AJUSTES: lo que solo la dueña sabe y el panel necesita para la ganancia real y los canales:
// % de impuestos (estimado), costos fijos mensuales y lo que gasta en cada canal. En la captura de
// prueba se ven los MISMOS formularios (las acciones responden "sin permiso" porque no hay base).

import { FormImpuestos, ListaCostos, ListaGastos } from '@/components/admin/FormulariosAjustes';
import { Encabezado, Tarjeta, TituloTarjeta } from '@/components/admin/ui';
import { calcularGanancia, fechasPorDefecto, leerAdmins, leerAjustes, leerCanales, leerVentas, periodoElegido } from '@/lib/servidor/panel';
import { fechaCorta } from '@/lib/panel-formato';

const CANALES_BASE = ['tiktok', 'instagram', 'facebook', 'youtube', 'google'];

export default async function AjustesPanel() {
  const periodo = periodoElegido();
  const [a, ventas, canalesMes, admins] = await Promise.all([leerAjustes(), leerVentas(periodo, 'ventas_mes'), leerCanales(periodo, 'canales_mes'), leerAdmins()]);
  const impuestosMes = calcularGanancia(ventas, 0, a.impuestosPct, 0).impuestos;
  // Los más comunes primero, luego los que ya conoce el panel. Sin afiliados: no tienen gasto en anuncios.
  const canales = [...new Set([...CANALES_BASE, ...a.gastos.map((g) => g.canal), ...canalesMes.map((c) => c.canal)])].filter((c) => c !== 'sin código' && !/^afiliad/.test(c));
  const { desde, hasta } = fechasPorDefecto();

  return (
    <>
      <Encabezado titulo="Ajustes">Datos que solo tú sabes y que el panel usa para calcular tu ganancia.</Encabezado>

      <Tarjeta destacada className="mb-4" indice={1}>
        <TituloTarjeta ayuda="Estimado. Confírmalo con tu contador.">Impuestos</TituloTarjeta>
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

      <Tarjeta className="mt-4" indice={4}>
        <TituloTarjeta ayuda="Para sumar a alguien: búscalo en Usuarios, abre su ficha y toca «Darle acceso al panel».">Quién puede entrar al panel</TituloTarjeta>
        {admins.length === 0 ? (
          <p className="text-caption text-ink-2">Se ve en el panel real.</p>
        ) : (
          <ul className="divide-y divide-[var(--line)]">
            {admins.map((x) => (
              <li key={x.email} className="flex justify-between gap-3 py-2 text-caption">
                <span className="min-w-0 break-all text-ink-1">{x.email}</span>
                <span className="shrink-0 text-ink-3">desde el {fechaCorta(x.desde)}</span>
              </li>
            ))}
          </ul>
        )}
      </Tarjeta>
    </>
  );
}
