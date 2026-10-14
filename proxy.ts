// Refresco de la sesión de Supabase en cada petición relevante (26: sin esto "el usuario se
// desloguea solo"). Patrón canónico de @supabase/ssr: getAll/setAll y getUser() sin lógica entre
// medio. La autorización NO vive aquí: /app la decide su layout en servidor y cada API la suya.

import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function proxy(request: NextRequest) {
  let respuesta = NextResponse.next({ request });
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const clave = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !clave) return respuesta;

  const supabase = createServerClient(url, clave, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(lista) {
        lista.forEach(({ name, value }) => request.cookies.set(name, value));
        respuesta = NextResponse.next({ request });
        lista.forEach(({ name, value, options }) => respuesta.cookies.set(name, value, options));
      },
    },
  });
  await supabase.auth.getUser();
  return respuesta;
}

export const config = {
  matcher: ['/app/:path*', '/login', '/auth/:path*', '/api/cuenta/:path*', '/api/piezas/:path*', '/api/ia/mision', '/api/acceso/:path*'],
};
