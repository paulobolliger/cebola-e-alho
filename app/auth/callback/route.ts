// app/auth/callback/route.ts
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server' 
import { syncUserProfileToAuthorsTable } from '@/lib/supabase/sync-profile'; // NOVO: Importa a função

// Esta rota lida com o redirecionamento do provedor OAuth (ex: Google)
// e troca o código de autorização pela sessão do usuário.
export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const supabase = createClient() 
    
    // 1. Troca o código pela sessão (Login)
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error && data.session && data.user) {
      // 2. ✅ NOVO: Sincroniza o perfil do usuário para a tabela 'authors'
      await syncUserProfileToAuthorsTable(data.user);
    }
  }

  // Redireciona para a home page após o login ser concluído
  return NextResponse.redirect(requestUrl.origin)
}