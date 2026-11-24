import { OFERTA_TRIAL, OFERTA_GARANTIA } from './ofertaFrase';

/** La frase de oferta única; el corte de línea cae siempre entre las dos ideas, nunca dentro de ellas. */
export function FraseOferta({ className = '' }: { className?: string }) {
  return (
    <span className={`inline-block text-balance ${className}`}>
      <span className="whitespace-nowrap">{OFERTA_TRIAL}</span> · <span className="whitespace-nowrap">{OFERTA_GARANTIA}</span>
    </span>
  );
}
