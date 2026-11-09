// USUARIOS: buscador por correo o nombre, filtros por estado, lista con lo importante de cada
// persona y el alta manual (correo + nombre + hasta cuándo). La lista la arma la base (panel_usuarios).

import Link from 'next/link';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { FormAgregarUsuario } from '@/components/admin/AccionesUsuario';
import { NOMBRE_ESTADO } from '@/components/admin/estados';
import { Encabezado, SinDatos, Tarjeta, TituloTarjeta } from '@/components/admin/ui';
import { entero, fechaCorta } from '@/lib/panel-formato';
import { FILTROS_USUARIOS, POR_PAGINA, leerUsuarios, modoCaptura, type FiltroUsuarios } from '@/lib/servidor/panel';

const ETIQUETA_FILTRO: Record<FiltroUsuarios, string> = {
  todos: 'Todos',
  activo: 'Con acceso hoy',
  trialing: 'En prueba',
  active: 'Pagando',
  cancelled: 'Cancelaron',
  past_due: 'Pago atrasado',
  expired: 'Vencidos',
  refunded: 'Reembolsados',
  'sin-acceso': 'Pagaron sin acceso',
  vencido: 'Vencidos sin aviso',
  manual: 'Agregados a mano',
};

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

  return (
    <>
      <Encabezado titulo="Usuarios">
        {entero(total)} {total === 1 ? 'persona' : 'personas'}
        {estado !== 'todos' || buscar ? ' con este filtro' : ' en total'}
      </Encabezado>

      <Tarjeta className="mb-4">
        <form action="/admin/usuarios" className="flex gap-2" role="search">
          {estado !== 'todos' && <input type="hidden" name="estado" value={estado} />}
          <label className="relative flex-1">
            <span className="sr-only">Buscar por correo o nombre</span>
            <Search size={18} className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-ink-3" aria-hidden="true" />
            <input
              name="q"
              defaultValue={buscar}
              placeholder="Buscar por correo o nombre"
              className="h-12 w-full rounded-[var(--radius-pill)] border border-[color-mix(in_oklab,var(--ink-3)_45%,transparent)] bg-sunken pr-4 pl-11 text-base text-ink-1 placeholder:text-ink-3 focus:border-ink-2 focus:outline-none"
            />
          </label>
          <button type="submit" className="opcion-recorrido min-h-12 px-5 text-caption font-semibold text-ink-1">
            Buscar
          </button>
        </form>
        <nav aria-label="Filtrar por estado" className="mt-3 flex flex-wrap gap-2">
          {FILTROS_USUARIOS.map((f) => (
            <Link
              key={f}
              href={enlace({ estado: f === 'todos' ? undefined : f })}
              aria-current={estado === f ? 'true' : undefined}
              className={`flex min-h-9 items-center rounded-[var(--radius-pill)] border px-3 text-xs font-semibold ${
                estado === f ? 'border-gold bg-[color-mix(in_oklab,var(--gold)_14%,transparent)] text-gold' : 'border-[var(--line)] text-ink-2 hover:text-ink-1'
              }`}
            >
              {ETIQUETA_FILTRO[f]}
            </Link>
          ))}
        </nav>
      </Tarjeta>

      <Tarjeta className="mb-4">
        {filas.length === 0 ? (
          <SinDatos porque={buscar || estado !== 'todos' ? 'Nadie coincide con este filtro. Prueba con otra búsqueda.' : 'Todavía no hay usuarios. Aparecen con la primera prueba gratis o si agregas a alguien abajo.'} />
        ) : (
          <ul className="divide-y divide-[var(--line)]">
            {filas.map((u) => {
              const e = NOMBRE_ESTADO[u.estado] ?? { texto: u.estado, tono: 'text-ink-2' };
              return (
                <li key={u.id}>
                  <Link href={`/admin/usuarios/${u.id}`} className="flex items-center gap-3 py-3 transition-colors duration-150 hover:bg-raised">
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-ayuda font-semibold text-ink-1">{u.nombre || u.email}</span>
                      <span className="block truncate text-caption text-ink-2">{u.email}</span>
                      <span className="mt-1 block text-xs text-ink-3">
                        Desde {fechaCorta(u.alta)}
                        {u.plan && ` · plan ${u.plan}`}
                        {` · ${entero(u.piezas)} ${u.piezas === 1 ? 'pieza' : 'piezas'}`}
                        {u.ultima_actividad && ` · activo ${fechaCorta(u.ultima_actividad)}`}
                        {u.origen === 'manual' && ' · agregado a mano'}
                      </span>
                    </span>
                    <span className="flex shrink-0 flex-col items-end gap-1">
                      <span className={`text-caption font-semibold ${e.tono}`}>{e.texto}</span>
                      {!u.acceso_enviado && ['trialing', 'active'].includes(u.estado) && <span className="text-xs font-semibold text-danger">Sin acceso enviado</span>}
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
              <Link href={enlace({ pagina: pagina - 1 })} className="flex min-h-11 items-center gap-1 text-caption font-semibold text-ink-1">
                <ChevronLeft size={16} aria-hidden="true" /> Anterior
              </Link>
            ) : (
              <span />
            )}
            <span className="text-caption text-ink-3">
              Página {pagina} de {paginas}
            </span>
            {pagina < paginas ? (
              <Link href={enlace({ pagina: pagina + 1 })} className="flex min-h-11 items-center gap-1 text-caption font-semibold text-ink-1">
                Siguiente <ChevronRight size={16} aria-hidden="true" />
              </Link>
            ) : (
              <span />
            )}
          </nav>
        )}
      </Tarjeta>

      <Tarjeta id="agregar">
        <TituloTarjeta ayuda="Para regalar acceso o para alguien a quien no le llegó. Se crea su cuenta y te damos el enlace para entrar.">Agregar a alguien a mano</TituloTarjeta>
        {modoCaptura ? <SinDatos porque="El formulario funciona en el panel real (en esta captura de prueba no hay base de datos)." /> : <FormAgregarUsuario />}
      </Tarjeta>
    </>
  );
}
