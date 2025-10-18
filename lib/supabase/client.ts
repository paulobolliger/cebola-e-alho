// lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr'
// Assumindo que você usa tipagem de banco de dados gerada
import { Database } from '@/types/database.types' 

// Helper function para criar a instância do Supabase no browser
export const createClient = () =>
  createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )