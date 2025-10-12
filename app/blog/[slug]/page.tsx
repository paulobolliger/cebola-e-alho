import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Post } from '@/types';
import { notFound } from 'next/navigation';
import Image from 'next/image';

// A interface foi removida daqui

export const revalidate = 3600;

async function getPost(slug: string) {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error || !data) {
    notFound();
  }

  return data as Post;
}

const formatDate = (dateString: string) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

// A tipagem agora é feita diretamente aqui
export default async function PostPage({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug);

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

          <div className="prose lg:prose-xl max-w-none text-text-secondary prose-h2:text-text-primary prose-h1:text-primary">
            <p>{post.content}</p>
          </div>
        </div>
      </article>
    </div>
  );
}