import { Zap } from 'lucide-react';
import { OFERTA_TRIAL, OFERTA_GARANTIA } from './ofertaFrase';

/** La frase de oferta única. En móvil: dos líneas limpias, sin separador suelto. Con más ancho: una línea con el rayo de marca. */
export function FraseOferta({ className = '', alinear = 'centro' }: { className?: string; alinear?: 'centro' | 'izquierda' }) {
  return (
    <span className={`inline-flex flex-col sm:flex-row sm:items-center sm:gap-2 ${alinear === 'centro' ? 'items-center' : 'items-start'} ${className}`}>
      <span className="whitespace-nowrap">{OFERTA_TRIAL}</span>
      <Zap aria-hidden="true" size={14} fill="currentColor" strokeWidth={0} className="hidden shrink-0 text-[var(--portada-amarillo)] sm:block" />
      <span className="whitespace-nowrap">{OFERTA_GARANTIA}</span>
    </span>
  );
}
