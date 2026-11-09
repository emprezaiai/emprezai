// FICHA de una persona: primero la decisión (si paga y no entra, o si pagó y no tiene acceso), después
// hasta cuándo tiene acceso, historial, pagos, uso e IA, y las acciones. Todo verificado en el
// servidor. La idea de negocio de la persona NO se muestra: es suya (promesa "Tu idea es tuya").

import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronLeft, CircleAlert, Mail, TriangleAlert } from 'lucide-react';
import { BotonCopiar } from '@/components/admin/BotonCopiar';
import { AccionesFicha } from '@/components/admin/AccionesUsuario';
import { NOMBRE_ESTADO, estadoVisible } from '@/components/admin/estados';
import { Entrada } from '@/components/admin/movimiento';
import { SinDatos, TOCABLE, Tarjeta, TituloTarjeta } from '@/components/admin/ui';
import { dinero, dineroMinor, entero, fechaCorta, fechaHora, nombreCanal } from '@/lib/panel-formato';
import { accesoDe, diasSinActividad, leerFicha } from '@/lib/servidor/panel';
import { leerVariable } from '@/lib/servidor/config';

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const NOMBRE_COBRO: Record<string, string> = { refund: 'Reembolso', chargeback: 'Contracargo' };
const MOMENTO: Record<string, string> = { manana: 'en la mañana', mediodia: 'al mediodía', noche: 'en la noche' };

export default async function FichaUsuario({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!UUID.test(id)) notFound();
  const f = await leerFicha(id);
  if (!f) notFound();
  const e = estadoVisible(f.estado, f.origen);
  const { hasta, vigente: conAcceso } = accesoDe(f);
  const sinVenir = diasSinActividad(f);
  const fantasma = f.estado === 'active' && f.origen === 'hotmart' && conAcceso && sinVenir !== null && sinVenir >= 14;
  const sinAccesoEnviado = conAcceso && !f.acceso_enviado;
  const primerNombre = (f.nombre || f.email).split(' ')[0];
  const ventas = f.pagos.filter((p) => p.tipo === 'sale');
  // El pago más antiguo es el primero; los demás, renovaciones.
  const primerPago = ventas.reduce<string | null>((min, p) => (min === null || p.en < min ? p.en : min), null);
  const nombrePago = (tipo: string, en: string) => (tipo === 'sale' ? (en === primerPago ? 'Primer pago' : 'Renovación') : (NOMBRE_COBRO[tipo] ?? tipo));
  const extra = [f.plan && `plan ${f.plan}`, f.origen === 'manual' ? 'lo agregaste tú' : f.canal ? `llegó desde ${nombreCanal(f.canal)}` : null].filter(Boolean).join(' · ');
  const contacto = (
    <span className="flex flex-wrap items-center gap-x-4">
      <a href={`mailto:${f.email}`} className={`${TOCABLE} inline-flex min-h-11 items-center gap-1 text-caption font-semibold text-ink-1 underline underline-offset-4`}>
        <Mail size={14} aria-hidden="true" /> Escribirle por correo
      </a>
      <BotonCopiar texto={f.email} etiqueta="Copiar correo" />
    </span>
  );

  return (
    <>
      <Link href="/admin/usuarios" className={`${TOCABLE} mb-2 inline-flex min-h-11 items-center gap-1 text-caption font-semibold text-ink-2 hover:text-ink-1`}>
        <ChevronLeft size={16} aria-hidden="true" /> Usuarios
      </Link>
      <Entrada className="mb-6">
        <h1 className="font-display text-pregunta font-extrabold break-words text-ink-1">{f.nombre || f.email}</h1>
        {f.nombre && <p className="mt-1 text-ayuda break-all text-ink-2">{f.email}</p>}
        <p className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-caption">
          <span className="inline-flex items-center gap-1.5 rounded-[var(--radius-pill)] bg-sunken px-2 py-0.5 font-semibold text-ink-1">
            <span aria-hidden="true" className={`size-2 rounded-full ${e.punto}`} />
            {e.texto}
          </span>
          {extra && <span className="text-ink-3">{extra}</span>}
        </p>
        {!fantasma && <div className="mt-1">{contacto}</div>}
      </Entrada>

      {(fantasma || sinAccesoEnviado) && (
        <Entrada indice={1} className="mb-4">
          <div
            role="status"
            className={`flex items-start gap-3 rounded-[var(--radius-card)] border p-4 ${
              sinAccesoEnviado
                ? 'border-[color-mix(in_oklab,var(--danger)_45%,transparent)] bg-[color-mix(in_oklab,var(--danger)_8%,transparent)]'
                : 'border-[color-mix(in_oklab,var(--warning)_45%,transparent)] bg-[color-mix(in_oklab,var(--warning)_8%,transparent)]'
            }`}
          >
            {sinAccesoEnviado ? <CircleAlert size={20} className="mt-0.5 shrink-0 text-danger" aria-hidden="true" /> : <TriangleAlert size={20} className="mt-0.5 shrink-0 text-warning" aria-hidden="true" />}
            <div className="text-ayuda text-ink-1">
              {sinAccesoEnviado ? (
                <>
                  <strong className="font-semibold">Tiene acceso pero el correo para entrar no salió.</strong> Toca &quot;Copiar enlace de acceso&quot; y mándaselo por WhatsApp.
                </>
              ) : (
                <>
                  <strong className="font-semibold">Paga y no entra desde hace {sinVenir} días.</strong> Escríbele hoy a {primerNombre}: es el cliente más fácil de recuperar antes de que cancele.
                  <div className="mt-1">{contacto}</div>
                </>
              )}
            </div>
          </div>
        </Entrada>
      )}

      <Tarjeta className="mb-4" indice={2}>
        <p className="text-caption font-semibold text-ink-2">Última vez que entró</p>
        {f.ultima_actividad ? (
          <>
            <p className={`mt-1 font-display text-4xl leading-none font-extrabold ${fantasma ? 'text-danger' : 'text-ink-1'}`}>
              {sinVenir === 0 ? 'Hoy' : sinVenir === 1 ? 'Ayer' : `Hace ${sinVenir} días`}
            </p>
            <p className="mt-2 text-caption text-ink-2">
              El {fechaCorta(f.ultima_actividad)}
              {f.momento && ` · hace su misión ${MOMENTO[f.momento] ?? f.momento}`}
            </p>
          </>
        ) : (
          <p className="mt-1 text-ayuda text-ink-2">{f.momento ? `Todavía no entra. Eligió hacer su misión ${MOMENTO[f.momento] ?? f.momento}.` : 'Todavía no entra a la app.'}</p>
        )}
        <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-[var(--line)] pt-3 text-caption">
          <div>
            <dt className="text-ink-3">{conAcceso ? 'Acceso hasta' : 'Acceso'}</dt>
            <dd className={`font-semibold ${!conAcceso && hasta ? 'text-danger' : 'text-ink-1'}`}>{hasta ? (conAcceso ? fechaCorta(hasta) : 'Sin acceso') : 'Sin datos'}</dd>
          </div>
          <div>
            <dt className="text-ink-3">Piezas armadas</dt>
            <dd className="font-semibold text-ink-1 tabular-nums">
              {entero(f.piezas)}
              {f.dia_maximo ? <span className="font-normal text-ink-2"> · día {f.dia_maximo} de 30</span> : null}
            </dd>
          </div>
          <div>
            <dt className="text-ink-3">Su cuenta</dt>
            <dd className="font-semibold text-ink-1">{f.tiene_cuenta ? 'Ya la creó' : 'Aún no la crea'}</dd>
          </div>
          <div>
            <dt className="text-ink-3">Costo de su IA</dt>
            <dd className="font-semibold text-ink-1 tabular-nums">{dinero(Number(f.ia_usd))}</dd>
          </div>
        </dl>
      </Tarjeta>

      <Tarjeta className="mb-4" indice={6}>
        <TituloTarjeta ayuda="Cada acción queda registrada con fecha y hora.">Acciones</TituloTarjeta>
        <AccionesFicha id={f.id} conAcceso={conAcceso} puedeEnviarCorreo={Boolean(leerVariable('RESEND_API_KEY') && leerVariable('EMAIL_FROM'))} />
      </Tarjeta>

      <div className="grid gap-3 lg:grid-cols-2">
        <Tarjeta indice={7}>
          <TituloTarjeta>Historial</TituloTarjeta>
          {f.historial.length === 0 ? (
            <SinDatos porque="No hay cambios de estado registrados." />
          ) : (
            <ol className="flex flex-col gap-2">
              {f.historial.map((h, i) => (
                <li key={`${h.en}-${i}`} className="flex justify-between gap-3 text-caption">
                  <span className="text-ink-1">
                    {h.de ? `${NOMBRE_ESTADO[h.de]?.texto ?? h.de} → ` : 'Entró · '}
                    {NOMBRE_ESTADO[h.a]?.texto ?? h.a}
                  </span>
                  <span className="shrink-0 text-ink-3">{fechaHora(h.en)}</span>
                </li>
              ))}
            </ol>
          )}
        </Tarjeta>
        <Tarjeta indice={8}>
          <TituloTarjeta>Pagos</TituloTarjeta>
          {f.pagos.length === 0 ? (
            <SinDatos porque={f.origen === 'manual' ? 'Lo agregaste tú: no tiene pagos.' : 'Hotmart todavía no informó pagos de esta persona.'} />
          ) : (
            <>
              <ul className="flex flex-col gap-2">
                {f.pagos.map((p, i) => (
                  <li key={`${p.en}-${i}`} className="flex justify-between gap-3 text-caption">
                    <span className="text-ink-1">
                      {nombrePago(p.tipo, p.en)} <span className="text-ink-3">· {fechaCorta(p.en)}</span>
                    </span>
                    <span className={`shrink-0 whitespace-nowrap tabular-nums ${p.tipo === 'sale' ? 'text-ink-1' : 'text-danger'}`}>
                      {p.tipo === 'sale' ? '' : '−'}
                      {dineroMinor(p.monto_minor, p.moneda)}
                    </span>
                  </li>
                ))}
              </ul>
              <p className="mt-3 flex justify-between gap-3 border-t border-[var(--line)] pt-2 text-caption font-semibold text-ink-1">
                <span>
                  {entero(ventas.length)} {ventas.length === 1 ? 'pago' : 'pagos'} en total
                </span>
                <span className="tabular-nums">{dinero(ventas.reduce((t, p) => t + (p.moneda === 'USD' ? p.monto_minor : 0), 0) / 100)}</span>
              </p>
            </>
          )}
        </Tarjeta>
      </div>
    </>
  );
}
