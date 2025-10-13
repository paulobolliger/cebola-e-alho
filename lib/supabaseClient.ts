// lib/supabaseClient.tsx
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

// Função para criar o cliente Supabase no server-side
export function createSupabaseClient() {
  const cookieStore = cookies();

  // Verificação explícita das variáveis (para debug no build)
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL is missing in environment variables');
  }
  if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    throw new Error('NEXT_PUBLIC_SUPABASE_ANON_KEY is missing in environment variables');
  }

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get: (name: string) => cookieStore.get(name)?.value,
      },
    }
  );
}