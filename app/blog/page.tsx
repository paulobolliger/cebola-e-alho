import BlogCard from '@/components/BlogCard';
import { supabase } from '@/lib/supabaseClient';
import type { Post } from '@/types';

async function getPosts() {
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
    <div className="container mx-auto px-4 py-12">
      <section className="text-center mb-12">
        <h1 className="font-display font-bold text-4xl md:text-5xl text-brand-charcoal mb-4">
          Diário do Sabor
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
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
          <div className="text-center py-16">
            <h2 className="font-display text-2xl text-brand-charcoal">
              Nenhum post encontrado.
            </h2>
            <p className="text-gray-500 mt-2">
              Estamos preparando conteúdo incrível. Volte em breve!
            </p>
          </div>
        )}
      </section>
    </div>
  );
}