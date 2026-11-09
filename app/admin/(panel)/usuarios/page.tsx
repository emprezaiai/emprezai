// USUARIOS: buscador por correo o nombre, filtros por estado (los 5 más usados a la vista, el resto
// en "Más filtros"), lista con lo importante de cada persona y el alta manual.

import Link from 'next/link';
import { ChevronDown, ChevronLeft, ChevronRight, Search, UserPlus } from 'lucide-react';
import { FormAgregarUsuario } from '@/components/admin/AccionesUsuario';
import { estadoVisible } from '@/components/admin/estados';
import { Entrada } from '@/components/admin/movimiento';
import { Encabezado, SinDatos, TOCABLE, Tarjeta, TituloTarjeta } from '@/components/admin/ui';
import { entero, fechaCorta } from '@/lib/panel-formato';
import { FILTROS_USUARIOS, POR_PAGINA, leerUsuarios, modoCaptura, type FiltroUsuarios } from '@/lib/servidor/panel';

const ETIQUETA_FILTRO: Record<FiltroUsuarios, string> = {
  todos: 'Todos',
  activo: 'Con acceso hoy',
  trialing: 'En prueba',
  active: 'Pagando',
  'sin-acceso': 'Pagaron sin acceso',
  fantasma: 'Pagan y no entran',
  cancelled: 'Cancelaron',
  past_due: 'Pago atrasado',
  expired: 'Sin acceso',
  refunded: 'Reembolsados',
  vencido: 'Vencidos sin aviso de Hotmart',
  manual: 'Acceso regalado',
};
const PRINCIPALES: FiltroUsuarios[] = ['todos', 'activo', 'trialing', 'active', 'sin-acceso'];

export default async function UsuariosPanel({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const sp = await searchParams;
  const buscar = (sp.q ?? '').trim();
  const estado = (FILTROS_USUARIOS as readonly string[]).includes(sp.estado ?? '') ? (sp.estado as FiltroUsuarios) : 'todos';
  const pagina = Math.max(1, Number(sp.pagina) || 1);
  const { total, filas } = await leerUsuarios(buscar, estado, pagina);
  const paginas = Math.max(1, Math.ceil(total / POR_PAGINA));
  const enlace = (cambios: Record<string, string | number | undefined>) => {
    const p = new URLSearchParams();
    const todo = { q: buscar || undefined, estado: estado === 'todos' ? undefined : estado, pagina: undefined, ...cambios };
    for (const [k, v] of Object.entries(todo)) if (v !== undefined && v !== '') p.set(k, String(v));
    const qs = p.toString();
    return `/admin/usuarios${qs ? `?${qs}` : ''}`;
  };
  const chip = (f: FiltroUsuarios) => (
    <Link
      key={f}
      href={enlace({ estado: f === 'todos' ? undefined : f })}
      aria-current={estado === f ? 'true' : undefined}
      className={`${TOCABLE} flex min-h-11 items-center rounded-[var(--radius-pill)] border px-3 text-xs font-semibold ${
        estado === f ? 'border-ink-2 bg-raised-2 text-ink-1' : 'border-[var(--line)] text-ink-2 hover:text-ink-1'
      }`}
    >
      {ETIQUETA_FILTRO[f]}
    </Link>
  );
  const otros = FILTROS_USUARIOS.filter((f) => !PRINCIPALES.includes(f));

  return (
    <>
      <Encabezado titulo="Usuarios">
        {entero(total)} {total === 1 ? 'persona' : 'personas'}
        {estado !== 'todos' || buscar ? ' con este filtro' : ' en total'}
      </Encabezado>

      <Entrada indice={1} className="mb-4 flex justify-end">
        <a href="#agregar" className={`${TOCABLE} boton-oro flex h-11 items-center gap-2 rounded-[var(--radius-pill)] px-5 font-display text-base font-bold`}>
          <UserPlus size={18} aria-hidden="true" />
          Dar acceso a alguien
        </a>
      </Entrada>

      <Tarjeta className="mb-4" indice={1}>
        <form action="/admin/usuarios" className="flex gap-2" role="search">
          {estado !== 'todos' && <input type="hidden" name="estado" value={estado} />}
          <label className="relative min-w-0 flex-1">
            <span className="sr-only">Buscar por correo o nombre</span>
            <Search size={18} className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-ink-3" aria-hidden="true" />
            <input
              name="q"
              defaultValue={buscar}
              placeholder="Correo o nombre"
              className="h-12 w-full rounded-[var(--radius-pill)] border border-[color-mix(in_oklab,var(--ink-3)_45%,transparent)] bg-sunken pr-4 pl-11 text-base text-ink-1 placeholder:text-ink-3 focus:border-ink-2 focus:outline-none"
            />
          </label>
          <button type="submit" className={`${TOCABLE} opcion-recorrido min-h-12 shrink-0 px-5 text-caption font-semibold text-ink-1`}>
            Buscar
          </button>
        </form>
        <nav aria-label="Filtrar por estado" className="mt-3 flex flex-wrap gap-2">
          {PRINCIPALES.map(chip)}
        </nav>
        <details className="mt-2" open={otros.includes(estado)}>
          <summary className="flex min-h-11 cursor-pointer list-none items-center gap-1 text-caption font-semibold text-ink-2 [&::-webkit-details-marker]:hidden">
            Más filtros <ChevronDown size={16} aria-hidden="true" />
          </summary>
          <div className="mt-1 flex flex-wrap gap-2">{otros.map(chip)}</div>
        </details>
      </Tarjeta>

      <Tarjeta className="mb-4" indice={2}>
        {filas.length === 0 ? (
          <SinDatos porque={buscar || estado !== 'todos' ? 'Nadie coincide con este filtro. Prueba con otra búsqueda.' : 'Todavía no hay usuarios. Aparecen con la primera prueba gratis o si das acceso a alguien abajo.'} />
        ) : (
          <ul className="divide-y divide-[var(--line)]">
            {filas.map((u) => {
              const e = estadoVisible(u.estado, u.origen);
              const sinEnvio = !u.acceso_enviado && ['trialing', 'active'].includes(u.estado);
              return (
                <li key={u.id}>
                  <Link href={`/admin/usuarios/${u.id}`} className={`${TOCABLE} flex items-center gap-3 rounded-[var(--radius-chip)] py-3 hover:bg-raised`}>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-ayuda font-semibold text-ink-1">{u.nombre || u.email}</span>
                      <span className="block truncate text-caption text-ink-2">{u.email}</span>
                      <span className="mt-1 block text-xs text-ink-3">
                        Desde {fechaCorta(u.alta)}
                        {u.plan && ` · plan ${u.plan}`}
                        {` · ${entero(u.piezas)} ${u.piezas === 1 ? 'pieza' : 'piezas'}`}
                        {u.ultima_actividad && ` · última vez ${fechaCorta(u.ultima_actividad)}`}
                      </span>
                    </span>
                    <span className="flex shrink-0 flex-col items-end gap-1">
                      <span className="flex items-center gap-1.5 text-caption font-semibold text-ink-1">
                        <span aria-hidden="true" className={`size-2 rounded-full ${e.punto}`} />
                        {e.texto}
                      </span>
                      {sinEnvio && <span className="text-xs font-semibold text-danger">Sin acceso enviado</span>}
                    </span>
                    <ChevronRight size={16} className="shrink-0 text-ink-3" aria-hidden="true" />
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
        {paginas > 1 && (
          <nav aria-label="Páginas" className="mt-3 flex items-center justify-between border-t border-[var(--line)] pt-3">
            {pagina > 1 ? (
              <Link href={enlace({ pagina: pagina - 1 })} className={`${TOCABLE} flex min-h-11 items-center gap-1 text-caption font-semibold text-ink-1`}>
                <ChevronLeft size={16} aria-hidden="true" /> Anterior
              </Link>
            ) : (
              <span />
            )}
            <span className="text-caption text-ink-3">
              Página {pagina} de {paginas}
            </span>
            {pagina < paginas ? (
              <Link href={enlace({ pagina: pagina + 1 })} className={`${TOCABLE} flex min-h-11 items-center gap-1 text-caption font-semibold text-ink-1`}>
                Siguiente <ChevronRight size={16} aria-hidden="true" />
              </Link>
            ) : (
              <span />
            )}
          </nav>
        )}
      </Tarjeta>

      <Tarjeta id="agregar" indice={3}>
        <TituloTarjeta ayuda="Para regalar acceso o para alguien a quien no le llegó. Se crea su cuenta y te damos el enlace para entrar.">Dar acceso a alguien</TituloTarjeta>
        {modoCaptura ? <SinDatos porque="El formulario funciona en el panel real (en esta captura de prueba no hay base de datos)." /> : <FormAgregarUsuario />}
      </Tarjeta>
    </>
  );
}
