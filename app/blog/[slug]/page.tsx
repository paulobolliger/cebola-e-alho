// app/blog/[slug]/page.tsx

import { notFound } from 'next/navigation'
import Image from 'next/image'
import { Metadata } from 'next'
import Link from 'next/link'
import { clientSupabase } from '@/lib/supabaseClient' // 1. Uso do cliente público

// 2. Tipagem de dados para o Post (Ajustada para o Banco)
interface BlogPost {
    id: string;
    title: string;
    slug: string;
    image_url: string; // Coluna do banco
    author: string;
    content: string; // Conteúdo HTML completo (do CMS)
    created_at: string;
}

// 3. Função de busca de dados (Server Component)
async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  // Busca no Supabase usando o slug
  const { data: post, error } = await clientSupabase
    .from('posts')
    .select('id, title, slug, image_url, author, content, created_at')
    .eq('slug', slug)
    .single()

  if (error || !post) {
    return null
  }
  
  return {
    ...post,
    image_url: post.image_url || '/blog-card.png'
  } as BlogPost
}

// 4. Tipagem dos Props e Geração de Metadados Dinâmicos
interface BlogPostPageProps {
  params: { slug: string }
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const post = await getBlogPostBySlug(params.slug)

  if (!post) {
    return { title: 'Post não encontrado | Blog Cebola & Alho' }
  }

  return {
    title: `${post.title} | Blog Cebola & Alho`,
    description: `Leia o post de ${post.author} sobre ${post.title}.`,
    keywords: ['blog', 'cebola', 'alho', 'gastronomia', 'dicas', post.slug],
    openGraph: { images: [{ url: post.image_url }] },
  }
}

// 5. Componente Principal (Server Component)
export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const post = await getBlogPostBySlug(params.slug)
  
  if (!post) {
    notFound()
  }

  return (
    <section className="p-8 max-w-4xl mx-auto">
      <article className="bg-background-light p-0 rounded-xl">
        
        {/* Imagem de Destaque */}
        <div className="relative w-full h-80 mb-8 rounded-t-xl overflow-hidden shadow-lg">
          <Image
            src={post.image_url}
            alt={post.title}
            layout="fill"
            objectFit="cover"
            priority
          />
        </div>

        {/* Título e Meta */}
        <div className="p-6">
          <h1 className="text-4xl font-display font-black text-text-base mb-3">
            {post.title}
          </h1>
          <p className="text-sm font-body text-gray-500 mb-6">
            Por <span className="text-secondary font-bold">{post.author}</span> em {new Date(post.created_at).toLocaleDateString('pt-BR')}
          </p>

          {/* 6. Renderização do Conteúdo (Supondo que venha em formato HTML/Markdown) */}
          <div 
            className="prose max-w-none text-text-base font-body leading-relaxed" 
            dangerouslySetInnerHTML={{ __html: post.content }} 
          />
        </div>

      </article>
      
      {/* CTA de Retorno */}
      <div className="text-center mt-12">
        <Link href="/blog" className="inline-block bg-primary text-white p-4 rounded-lg hover:bg-secondary transition font-display font-bold text-lg uppercase tracking-wider shadow-lg">
          ← Ver Todos os Posts do Blog
        </Link>
      </div>
    </section>
  )
}