import { supabase } from '@/lib/supabaseClient';
import type { Post } from '@/types';
import { notFound } from 'next/navigation';
import Image from 'next/image';

interface PostPageProps {
  params: {
    slug: string;
  };
}

// Revalidate the page every hour to fetch potential updates
export const revalidate = 3600;

async function getPost(slug: string) {
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

// Generate static pages for existing posts at build time for better performance
export async function generateStaticParams() {
  const { data: posts } = await supabase.from('posts').select('slug');
  return posts?.map(({ slug }) => ({ slug })) || [];
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

export default async function PostPage({ params }: PostPageProps) {
  const post = await getPost(params.slug);

  return (
    <article className="container mx-auto px-4 py-12">
      <header className="max-w-3xl mx-auto text-center mb-8">
        <h1 className="font-display font-bold text-4xl md:text-5xl text-brand-charcoal mb-4">
          {post.title}
        </h1>
        <p className="text-gray-500">{formatDate(post.created_at)}</p>
      </header>

      <div className="relative h-64 md:h-96 w-full max-w-4xl mx-auto mb-12 rounded-lg overflow-hidden shadow-lg">
        <Image
          src={post.image_url || '/blog-card.png'}
          alt={`Imagem de capa do post: ${post.title}`}
          fill
          style={{ objectFit: 'cover' }}
          priority
        />
      </div>

      <div className="prose lg:prose-lg max-w-3xl mx-auto">
        <p>{post.content}</p>
      </div>
    </article>
  );
}