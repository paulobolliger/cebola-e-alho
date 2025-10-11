// lib/supabaseClient.ts

import { createClient } from '@supabase/supabase-js'

// --- 1. Variáveis de Ambiente ---
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const publicAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
// CHAVE SECRETA: Usada APENAS em API Routes ou Server Actions. Deve ser configurada no .env.local como SUPABASE_SERVICE_ROLE_KEY
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY 

// 2. Cliente Público (Para leituras em Server Components e Client Components)
if (!supabaseUrl || !publicAnonKey) {
  console.error("ERRO: As variáveis públicas do Supabase não estão definidas. Verifique seu .env.local.")
}

export const clientSupabase = createClient(
  supabaseUrl as string, 
  publicAnonKey as string
)


// 3. Cliente Server-Side/Admin (Para API Routes, Escritas Seguras)
// Usado na API de geração de receita. Não deve vazar para o frontend!
export const serverSupabase = createClient(
  supabaseUrl as string, 
  serviceRoleKey as string, 
  {
    auth: {
      persistSession: false // Desabilita sessões HTTP, pois não são necessárias para API Routes
    }
  }
)