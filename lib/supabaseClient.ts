// lib/supabaseClient.ts

import { createClient } from '@supabase/supabase-js'

// Variáveis de ambiente
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// 1. Verificação de ambiente em tempo de execução
if (!supabaseUrl || !supabaseAnonKey) {
  // Em um projeto real, isso deve ser um erro fatal para evitar falhas de runtime
  console.error("ERRO: Variáveis de ambiente do Supabase (NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY) não estão definidas. Verifique seu arquivo .env.local.")
}

// 2. Criação do cliente Supabase tipado
// (A tipagem <Database> é um placeholder para o seu types.ts gerado pelo Supabase CLI)
// export const supabase = createClient<Database>(supabaseUrl as string, supabaseAnonKey as string)

// Usando tipagem básica por enquanto:
export const supabase = createClient(
  supabaseUrl as string, 
  supabaseAnonKey as string
)

// Nota: Para Server Components que exigem mais segurança (e que buscam dados com autenticação), 
// o Next.js recomenda criar uma instância de cliente separada que gerencie cookies.