// El enlace del correo vuelve aquí con token_hash: se verifica EN SERVIDOR y la sesión queda en
// cookies. Si venció o ya se usó, a Entrar con un aviso claro (pedir uno nuevo).

import { type NextRequest, NextResponse } from 'next/server';
import { supabaseConfigurado } from '@/lib/servidor/config';
import { clienteSesion } from '@/lib/servidor/supabase';

const TIPOS = new Set(['magiclink', 'email']);

export async function GET(req: NextRequest) {
  const destino = req.nextUrl.clone();
  destino.search = '';
  const tokenHash = req.nextUrl.searchParams.get('token_hash');
  const tipo = req.nextUrl.searchParams.get('type') ?? 'magiclink';

  if (!supabaseConfigurado() || !tokenHash || !TIPOS.has(tipo)) {
    destino.pathname = '/login';
    destino.searchParams.set('estado', 'enlace-vencido');
    return NextResponse.redirect(destino);
  }
  const db = await clienteSesion();
  const { error } = await db.auth.verifyOtp({ token_hash: tokenHash, type: tipo as 'magiclink' | 'email' });
  if (error) {
    destino.pathname = '/login';
    destino.searchParams.set('estado', 'enlace-vencido');
    return NextResponse.redirect(destino);
  }
  destino.pathname = '/app';
  return NextResponse.redirect(destino);
}
