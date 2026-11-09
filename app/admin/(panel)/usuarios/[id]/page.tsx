// FICHA de una persona: estado, hasta cuándo tiene acceso, historial, pagos, uso e IA, y las
// acciones (copiar enlace, reenviar, extender, quitar). Todo verificado en el servidor. La idea de
// negocio de la persona NO se muestra: es suya (promesa "Tu idea es tuya", Constitución del Producto).

import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { AccionesFicha } from '@/components/admin/AccionesUsuario';
import { NOMBRE_ESTADO } from '@/components/admin/estados';
import { Dato, SinDatos, Tarjeta, TituloTarjeta } from '@/components/admin/ui';
import { dinero, dineroMinor, entero, fechaCorta, fechaHora } from '@/lib/panel-formato';
import { accesoDe, leerFicha, modoCaptura } from '@/lib/servidor/panel';
import { leerVariable } from '@/lib/servidor/config';

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const NOMBRE_COBRO: Record<string, string> = { sale: 'Venta', refund: 'Reembolso', chargeback: 'Contracargo' };
const MOMENTO: Record<string, string> = { manana: 'en la mañana', mediodia: 'al mediodía', noche: 'en la noche' };

export default async function FichaUsuario({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!UUID.test(id)) notFound();
  const f = await leerFicha(id);
  if (!f) notFound();
  const e = NOMBRE_ESTADO[f.estado] ?? { texto: f.estado, tono: 'text-ink-2' };
  const { hasta, vigente: conAcceso } = accesoDe(f);

  return (
    <>
      <Link href="/admin/usuarios" className="mb-2 inline-flex min-h-11 items-center gap-1 text-caption font-semibold text-ink-2 hover:text-ink-1">
        <ChevronLeft size={16} aria-hidden="true" /> Usuarios
      </Link>
      <div className="mb-6">
        <h1 className="font-display text-pregunta font-extrabold break-words text-ink-1">{f.nombre || f.email}</h1>
        <p className="mt-1 text-ayuda break-all text-ink-2">{f.email}</p>
        <p className="mt-2 text-caption">
          <span className={`font-semibold ${e.tono}`}>{e.texto}</span>
          <span className="text-ink-3">
            {f.plan && ` · plan ${f.plan}`}
            {f.origen === 'manual' ? ' · agregado a mano' : f.canal ? ` · llegó por "${f.canal}"` : ''}
          </span>
        </p>
      </div>

      <div className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Tarjeta>
          <Dato
            etiqueta="Acceso"
            valor={hasta ? (conAcceso ? `Hasta ${fechaCorta(hasta)}` : 'Sin acceso') : null}
            tono={conAcceso ? 'bien' : 'mal'}
            detalle={!f.acceso_enviado && conAcceso ? <span className="text-danger">El correo de acceso no salió</span> : f.tiene_cuenta ? 'Ya tiene su cuenta' : 'Aún no creó su cuenta'}
          />
        </Tarjeta>
        <Tarjeta>
          <Dato etiqueta="Piezas armadas" valor={entero(f.piezas)} detalle={f.dia_maximo ? `Llegó al día ${f.dia_maximo} de 30` : 'Todavía no arma piezas en la app'} />
        </Tarjeta>
        <Tarjeta>
          <Dato etiqueta="Última actividad" valor={f.ultima_actividad ? fechaCorta(f.ultima_actividad) : null} detalle={f.momento ? `Eligió hacer su misión ${MOMENTO[f.momento] ?? f.momento}` : undefined} />
        </Tarjeta>
        <Tarjeta>
          <Dato etiqueta="Costo de su IA" valor={dinero(Number(f.ia_usd), 2)} detalle="Desde que entró" />
        </Tarjeta>
      </div>

      <Tarjeta className="mb-4">
        <TituloTarjeta ayuda="Cada acción queda registrada.">Acciones</TituloTarjeta>
        {modoCaptura ? (
          <SinDatos porque="Las acciones funcionan en el panel real (en esta captura de prueba no hay base de datos)." />
        ) : (
          <AccionesFicha id={f.id} conAcceso={conAcceso} puedeEnviarCorreo={Boolean(leerVariable('RESEND_API_KEY') && leerVariable('EMAIL_FROM'))} />
        )}
      </Tarjeta>

      <div className="grid gap-3 lg:grid-cols-2">
        <Tarjeta>
          <TituloTarjeta>Historial</TituloTarjeta>
          {f.historial.length === 0 ? (
            <SinDatos porque="No hay cambios de estado registrados." />
          ) : (
            <ol className="flex flex-col gap-2">
              {f.historial.map((h, i) => (
                <li key={`${h.en}-${i}`} className="flex justify-between gap-3 text-caption">
                  <span className="text-ink-1">
                    {h.de ? `${NOMBRE_ESTADO[h.de]?.texto ?? h.de} → ` : 'Entró · '}
                    <span className={NOMBRE_ESTADO[h.a]?.tono ?? 'text-ink-1'}>{NOMBRE_ESTADO[h.a]?.texto ?? h.a}</span>
                  </span>
                  <span className="shrink-0 text-ink-3">{fechaHora(h.en)}</span>
                </li>
              ))}
            </ol>
          )}
        </Tarjeta>
        <Tarjeta>
          <TituloTarjeta>Pagos</TituloTarjeta>
          {f.pagos.length === 0 ? (
            <SinDatos porque={f.origen === 'manual' ? 'Lo agregaste a mano: no tiene pagos.' : 'Hotmart todavía no informó pagos de esta persona.'} />
          ) : (
            <ul className="flex flex-col gap-2">
              {f.pagos.map((p, i) => (
                <li key={`${p.en}-${i}`} className="flex justify-between gap-3 text-caption">
                  <span className="text-ink-1">
                    {NOMBRE_COBRO[p.tipo] ?? p.tipo} <span className="text-ink-3">· {fechaCorta(p.en)}</span>
                  </span>
                  <span className={`shrink-0 tabular-nums ${p.tipo === 'sale' ? 'text-ink-1' : 'text-danger'}`}>
                    {p.tipo === 'sale' ? '' : '−'}
                    {dineroMinor(p.monto_minor, p.moneda)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Tarjeta>
      </div>
    </>
  );
}
