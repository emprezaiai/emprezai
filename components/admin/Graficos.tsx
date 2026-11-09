'use client';

// Gráficos del panel (17: máximo dato, mínima tinta — sin rejas, sin 3D, etiqueta sobre el dato,
// color con significado: dorado = lo que te quedó, apagado = lo facturado, rojo = pérdida, verde =
// actividad). Sin animación si la persona pidió menos movimiento.

import { useReducedMotion } from 'motion/react';
import { Bar, BarChart, Cell, LabelList, ResponsiveContainer, Tooltip, XAxis } from 'recharts';
import { dinero, mesCorto } from '@/lib/panel-formato';

const corto = (n: number) => `${n < 0 ? '−' : ''}${Math.abs(n) >= 1000 ? `$${(Math.abs(n) / 1000).toFixed(1).replace('.', ',')}k` : `$${Math.round(Math.abs(n))}`}`;
const ESTILO_TOOLTIP = { background: 'var(--surface-raised-2)', border: '1px solid var(--line)', borderRadius: 12, color: 'var(--ink-1)' };

export function GraficoMeses({ datos }: { datos: { mes: string; ingresos: number; quedo: number }[] }) {
  const reduce = useReducedMotion();
  const filas = datos.map((d) => ({ ...d, etiqueta: mesCorto(d.mes) }));
  return (
    <div className="h-56 w-full min-w-0" role="img" aria-label={`Ingresos y lo que quedó por mes: ${filas.map((f) => `${f.etiqueta} ${dinero(f.ingresos, 0)} y ${dinero(f.quedo, 0)}`).join('; ')}`}>
      <ResponsiveContainer width="100%" height="100%" minWidth={0}>
        <BarChart data={filas} margin={{ top: 24, right: 4, bottom: 0, left: 4 }} barGap={4}>
          <XAxis dataKey="etiqueta" axisLine={false} tickLine={false} tick={{ fill: 'var(--ink-3)', fontSize: 12 }} />
          <Tooltip
            cursor={{ fill: 'rgb(255 255 255 / 0.04)' }}
            contentStyle={ESTILO_TOOLTIP}
            formatter={(v, nombre) => [dinero(Number(v)), nombre === 'ingresos' ? 'Facturaste' : 'Te quedó']}
            labelStyle={{ color: 'var(--ink-2)' }}
          />
          <Bar dataKey="ingresos" fill="var(--surface-raised-2)" radius={[6, 6, 0, 0]} isAnimationActive={!reduce} animationDuration={600} />
          <Bar dataKey="quedo" radius={[6, 6, 0, 0]} isAnimationActive={!reduce} animationDuration={600}>
            {filas.map((f) => (
              <Cell key={f.mes} fill={f.quedo < 0 ? 'var(--danger)' : 'var(--gold)'} />
            ))}
            <LabelList dataKey="quedo" position="top" formatter={(v) => corto(Number(v))} style={{ fill: 'var(--ink-2)', fontSize: 11, fontWeight: 600 }} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

const fechaEje = (f: string) => new Intl.DateTimeFormat('es', { day: 'numeric', month: 'short', timeZone: 'UTC' }).format(new Date(`${f}T12:00:00Z`)).replace('.', '');

/** Piezas armadas por día (últimos 30 días): la acción principal de la app, con 3 fechas en el eje. */
export function GraficoBarrasDia({ datos }: { datos: { fecha: string; piezas: number }[] }) {
  const reduce = useReducedMotion();
  const marcas = datos.length > 2 ? [datos[0].fecha, datos[Math.floor(datos.length / 2)].fecha, datos[datos.length - 1].fecha] : datos.map((d) => d.fecha);
  return (
    <div className="h-40 w-full min-w-0" role="img" aria-label={`Piezas armadas por día en los últimos 30 días: ${datos.reduce((t, d) => t + d.piezas, 0)} en total`}>
      <ResponsiveContainer width="100%" height="100%" minWidth={0}>
        <BarChart data={datos} margin={{ top: 8, right: 0, bottom: 0, left: 0 }}>
          <XAxis dataKey="fecha" ticks={marcas} tickFormatter={fechaEje} axisLine={false} tickLine={false} tick={{ fill: 'var(--ink-3)', fontSize: 11 }} interval="preserveStartEnd" />
          <Tooltip cursor={{ fill: 'rgb(255 255 255 / 0.04)' }} contentStyle={ESTILO_TOOLTIP} formatter={(v) => [String(v), 'Piezas']} labelFormatter={(f) => fechaEje(String(f))} labelStyle={{ color: 'var(--ink-2)' }} />
          <Bar dataKey="piezas" fill="var(--green)" radius={[3, 3, 0, 0]} isAnimationActive={!reduce} animationDuration={600} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
