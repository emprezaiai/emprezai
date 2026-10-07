import { Suspense } from 'react';
import { Empresa } from '@/components/interna/Empresa';

export default function PaginaEmpresa() {
  return (
    <Suspense>
      <Empresa />
    </Suspense>
  );
}
