// Marca de EMPRESAI: el rayo dorado (dispositivo ownable de FICHA-ARTE) dentro de un chip con relieve.
import { Zap } from 'lucide-react';

export function LogoEmpresai({ tamano = 28 }: { tamano?: 24 | 28 | 32 }) {
  return (
    <span
      aria-hidden="true"
      className="inline-flex items-center justify-center rounded-[var(--radius-chip)] bg-gradient-to-br from-gold-light to-gold shadow-[0_2px_0_var(--gold-deep)]"
      style={{ width: tamano, height: tamano }}
    >
      <Zap size={Math.round(tamano * 0.58)} fill="currentColor" strokeWidth={0} className="text-on-gold" />
    </span>
  );
}
