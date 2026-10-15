// Marca de EMPREZAI: el isotipo es el logo ORIGINAL de la dueña (public/marca/isotipo.png, preparado
// con scripts/preparar-marca.mjs) y el nombre se escribe con la Z: "EMPREZ" claro + "AI" turquesa,
// en la letra del logo (--font-marca). Es la ÚNICA pieza que usa esa letra.

import Image from 'next/image';

// El PNG trae el halo alrededor: el cuadro ocupa ~74% del archivo. Se dibuja más grande con margen
// negativo para que el CUADRO mida exactamente `tamano` y el halo sobresalga sin empujar nada.
const ESCALA_HALO = 198 / 146;

export function Isotipo({ tamano = 28, className = '' }: { tamano?: number; className?: string }) {
  const lado = Math.round(tamano * ESCALA_HALO);
  const margen = -Math.round((lado - tamano) / 2);
  return (
    <span aria-hidden="true" className={`relative inline-flex shrink-0 ${className}`} style={{ width: tamano, height: tamano }}>
      <Image src="/marca/isotipo.png" alt="" width={lado} height={lado} className="pointer-events-none absolute max-w-none" style={{ top: margen, left: margen }} priority />
    </span>
  );
}

const TAMANOS = {
  sm: { iso: 24, texto: 'text-ayuda', gap: 'gap-2' },
  md: { iso: 28, texto: 'text-boton', gap: 'gap-2' },
  lg: { iso: 40, texto: 'text-precio', gap: 'gap-3' },
} as const;

/** El nombre escrito como en el logo: EMPREZ claro + AI turquesa. */
export function NombreMarca({ className = '' }: { className?: string }) {
  return (
    <span className={`font-marca font-extrabold tracking-[0.01em] whitespace-nowrap ${className}`}>
      <span className="text-ink-1">EMPREZ</span>
      <span className="text-marca-ai">AI</span>
    </span>
  );
}

/** Isotipo + nombre (cabeceras y pies). */
export function Marca({ tamano = 'md', className = '' }: { tamano?: keyof typeof TAMANOS; className?: string }) {
  const t = TAMANOS[tamano];
  return (
    <span className={`inline-flex items-center ${t.gap} ${className}`}>
      <Isotipo tamano={t.iso} />
      <span aria-hidden="true">
        <NombreMarca className={`${t.texto} leading-none`} />
      </span>
      <span className="sr-only">EMPREZAI</span>
    </span>
  );
}
