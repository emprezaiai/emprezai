import Link from 'next/link';

/**
 * Micro-aviso de IA junto a la salida (47: el disclaimer no vive solo en los Términos). Es un <span> para
 * poder ir dentro de un <p> (la nota del botón principal) sin anidar párrafos.
 */
export function AvisoIA({ className = '' }: { className?: string }) {
  return (
    <span className={`block ${className}`}>
      La IA puede equivocarse: revisa tu pieza antes de usarla. Es orientación, no asesoría profesional.{' '}
      <Link href="/aviso-ia" className="underline underline-offset-4 hover:text-ink-2">
        Más info
      </Link>
    </span>
  );
}

/** Aviso en el punto donde se escribe la idea: qué se envía a la IA y qué se acepta al seguir. */
export function AvisoAntesDeEnviar({ className = '' }: { className?: string }) {
  return (
    <span className={`block ${className}`}>
      Al continuar, tu idea se envía a un servicio de IA (Anthropic, EE. UU.) y aceptas los{' '}
      <Link href="/terminos" className="underline underline-offset-4 hover:text-ink-2">
        Términos
      </Link>{' '}
      y la{' '}
      <Link href="/privacidad" className="underline underline-offset-4 hover:text-ink-2">
        Política de Privacidad
      </Link>
      .
    </span>
  );
}
