// Isotipo de EMPREZAI (compatibilidad: los usos existentes muestran ahora el isotipo de la dueña).
import { Isotipo } from './Marca';

export function LogoEmpresai({ tamano = 28 }: { tamano?: 24 | 28 | 32 }) {
  return <Isotipo tamano={tamano} />;
}
