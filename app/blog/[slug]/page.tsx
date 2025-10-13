import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Post } from '@/types'; // Corrigido de Recipe para Post
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Metadata } from 'next';
import Link from 'next/link';

// Função para buscar o post do Supabase
async function getPost(slug: string) {
  const cookieStore = cookies();
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    throw new Error('Supabase URL or Anon Key is missing in environment variables');
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: { get: (name: string) => cookieStore.get(name)?.value },
    }
  );

  const { data, error } = await supabase.from('posts').select('*').eq('slug', slug).single();
  if (error || !data) {
    notFound();
  }
  return data as Post;
}

// Função para formatar a data
const formatDate = (dateString: string) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleString('pt-BR', {
    day: 'numeric', month: 'long', year: 'numeric',
  });
};

interface PostPageProps {
  params: { slug: string }; // Next.js 14: params é um objeto
}

// Geração de metadados para SEO
export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { slug } = params;
  const post = await getPost(slug);
  return {
    title: `${post.title} | Blog Cebola & Alho`,
    description: post.excerpt,
  };
}

// Componente da página
export default async function PostPage({ params }: PostPageProps) {
  const { slug } = params;
  const post = await getPost(slug);

  return (
    <div className="bg-background min-h-screen">
      <article className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto bg-surface p-8 md:p-12 rounded-lg shadow-lg border border-border">
          <header className="text-center mb-8">
            <h1 className="font-display font-black text-4xl md:text-5xl text-primary mb-4 leading-tight">
              {post.title}
            </h1>
            <p className="text-text-secondary">{formatDate(post.created_at)}</p>
          </header>

          {post.image_url && (
            <div className="relative h-64 md:h-96 w-full mb-12 rounded-lg overflow-hidden">
              <Image
                src={post.image_url}
                alt={`Imagem de capa do post: ${post.title}`}
                fill
                style={{ objectFit: 'cover' }}
                priority
              />
            </div>
          )}

          <div
            className="prose lg:prose-xl max-w-none text-text-secondary prose-h2:text-text-primary prose-h1:text-primary"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          <div className="text-center mt-12">
            <Link
              href="/blog"
              className="inline-block bg-accent text-white py-3 px-6 rounded-lg hover:opacity-90 transition font-display font-bold text-lg"
            >
              Voltar para o Blog
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
}