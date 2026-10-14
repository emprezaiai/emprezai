// Clientes de Supabase del lado servidor.
// · clienteSesion(): actúa COMO la persona (cookies de su sesión) → RLS decide qué ve y escribe.
// · clienteAdmin(): clave secreta, salta RLS → SOLO para webhook, cron y tareas del servidor.

import { createServerClient } from '@supabase/ssr';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { requerida } from './config';

export async function clienteSesion(): Promise<SupabaseClient> {
  const almacen = await cookies();
  return createServerClient(requerida('NEXT_PUBLIC_SUPABASE_URL'), requerida('NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY'), {
    cookies: {
      getAll() {
        return almacen.getAll();
      },
      setAll(lista) {
        try {
          lista.forEach(({ name, value, options }) => almacen.set(name, value, options));
        } catch {
          // Un Server Component no puede escribir cookies: el refresco de la sesión lo hace
          // proxy.ts en cada petición (patrón canónico de @supabase/ssr, ver 26).
        }
      },
    },
  });
}

let admin: SupabaseClient | null = null;

export function clienteAdmin(): SupabaseClient {
  if (!admin) {
    admin = createClient(requerida('NEXT_PUBLIC_SUPABASE_URL'), requerida('SUPABASE_SECRET_KEY'), {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return admin;
}
