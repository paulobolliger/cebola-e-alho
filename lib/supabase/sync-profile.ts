// lib/supabase/sync-profile.ts
import { User } from '@supabase/supabase-js';
import { createClient } from './server'; // Usamos o cliente de server component

/**
 * Garante que o usuário logado (via Auth) tenha um perfil correspondente
 * na tabela customizada 'authors'.
 * @param user O objeto User do Supabase Auth.
 */
export async function syncUserProfileToAuthorsTable(user: User) {
  if (!user || !user.email) {
    console.error('User object is missing or invalid for synchronization.');
    return;
  }

  // Usamos o 'raw_user_meta_data' para pegar o nome e foto do Google
  const name = user.user_metadata.full_name || user.email.split('@')[0];
  const avatar_url = user.user_metadata.avatar_url;
  
  // Usamos o cliente de server component para interagir com o banco
  const supabase = createClient();

  const { error } = await supabase
    .from('authors')
    .upsert(
      {
        id: user.id, // O ID do autor é o mesmo ID do usuário Auth
        name: name,
        email: user.email,
        avatar_url: avatar_url,
        // role: 'colaborador' (se o default do banco for esse, não precisa passar)
        updated_at: new Date().toISOString(),
      },
      // Chave de conflito: se o 'id' já existir, atualize o registro (UPSERT)
      { onConflict: 'id' }
    );

  if (error) {
    console.error('Erro ao sincronizar perfil do autor:', error);
    // Em um ambiente real, você pode querer logar esse erro para investigação
  }
}