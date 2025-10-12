import BlogCard from '@/components/BlogCard';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Post } from '@/types';

async function getPosts() {
  const cookieStore = cookies();
  // Verificação para garantir que as variáveis de ambiente não são nulas
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Supabase URL or Anon Key is missing from environment variables.");
    return [];
  }
  
  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
    },
  });

  const { data, error } = await supabase.from('posts').select('*');

  if (error) {
    console.error('Error fetching posts:', error);
    return [];
  }

  return data as Post[];
}

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto px-4 py-16">
        <section className="text-center mb-12">
          <h1 className="font-display font-black text-5xl md:text-6xl text-text-primary mb-4">
            Diário do Sabor
          </h1>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            Dicas, truques de cozinha e histórias por trás dos ingredientes. Um
            espaço para explorar o universo da gastronomia além das receitas.
          </p>
        </section>

        <section>
          {posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-surface border border-border rounded-lg shadow-sm">
              <h2 className="font-display text-2xl text-text-primary">
                Nenhum post encontrado.
              </h2>
              <p className="text-text-secondary mt-2">
                Estamos preparando conteúdo incrível. Volte em breve!
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}