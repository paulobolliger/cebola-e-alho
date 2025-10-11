// app/blog/[slug]/page.tsx

import { notFound } from 'next/navigation'
import Image from 'next/image'
import { Metadata } from 'next'
import { supabase } from '@/lib/supabaseClient' // Importação do cliente Supabase

// 1. Tipagem de dados para o Post
interface BlogPost {
    id: string;
    title: string;
    slug: string;
    image: string;
    author: string;
    content: string;
    created_at: string;
}

// 2. Mock de dados
const MOCK_POST_DATA: BlogPost = {
  id: '5-receitas-faceis-com-cebola',
  title: '5 Receitas Fáceis com Cebola',
  slug: '5-receitas-faceis-com-cebola',
  image: '/blog-card.png',
  author: 'Chef Amigo IA',
  created_at: new Date().toISOString(),
  content: `
    <p>A cebola é o ingrediente secreto em 9 de 10 receitas deliciosas. Por que não dar a ela o merecido destaque? Nossos algoritmos analisaram milhares de pratos e simplificaram 5 clássicos que transformam a cebola, de coadjuvante a estrela principal. Seja criativo, seja eficiente!</p>
    
    <h3 class="text-2xl font-display font-bold text-secondary mt-8 mb-4">1. Sopa de Cebola Gratinada (A Elegância IA)</h3>
    <p>Nossa versão usa um caldo de carne mais limpo para destacar o sabor da cebola caramelizada, um processo que o Chef Amigo adora. A precisão no tempo de cozimento é chave. Sirva com queijo Emmenthal gratinado.</p>
    
    <h3 class="text-2xl font-display font-bold text-secondary mt-8 mb-4">2. Anéis de Cebola Assados com Panko</h3>
    <p>Fugindo da fritura (a IA preza pela saúde!), esta receita substitui a massa pesada por Panko e azeite de oliva. O resultado é um anel crocante, leve e cheio de sabor, perfeito para acompanhar um hambúrguer gourmet.</p>
    
    <h3 class="text-2xl font-display font-bold text-secondary mt-8 mb-4">3. Geleia de Cebola e Vinho Tinto</h3>
    <p>Esta é a Alquimia da Cozinha Digital em ação: transformar a pungência da cebola em uma geleia agridoce, perfeita para queijos ou carnes. O vinho tinto (de preferência um Malbec) adiciona profundidade e calor.</p>
  `
}

// 3. Tipagem dos Props da Page
interface BlogPostPageProps {
  params: { slug: string }
}

// 4. Geração de Metadados Dinâmicos
export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = params;

  // Realizar a busca aqui (Substituir o Mock em Produção)
  // const { data: post } = await supabase.from('posts').select('*').eq('slug', slug).single()
  const post = slug === MOCK_POST_DATA.slug ? MOCK_POST_DATA : null

  if (!post) {
    return { title: 'Post não encontrado | Blog Cebola & Alho' }
  }

  return {
    title: `${post.title} | Blog Cebola & Alho`,
    description: `Leia o post de ${post.author} sobre ${post.title}.`,
    keywords: ['blog', 'cebola', 'alho', 'gastronomia', 'dicas', post.slug],
    openGraph: { images: [{ url: post.image }] },
  }
}

// 5. Componente Principal (Server Component)
export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = params

  // Realizar a busca (Substituir o Mock em Produção)
  // const { data: post } = await supabase.from('posts').select('*').eq('slug', slug).single()
  const post = slug === MOCK_POST_DATA.slug ? MOCK_POST_DATA : null
  
  if (!post) {
    notFound()
  }

  return (
    <section className="p-8 max-w-4xl mx-auto">
      <article className="bg-background-light p-0 rounded-xl">
        
        {/* Imagem de Destaque */}
        <div className="relative w-full h-80 mb-8 rounded-t-xl overflow-hidden shadow-lg">
          <Image
            src={post.image}
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

          {/* Conteúdo (Renderizado via dangerouslySetInnerHTML - Atenção à Segurança) */}
          <div 
            className="prose max-w-none text-text-base font-body leading-relaxed" 
            dangerouslySetInnerHTML={{ __html: post.content }} 
          />
        </div>

      </article>
      
      {/* 6. CTA de Retorno */}
      <div className="text-center mt-12">
        <Link href="/blog" className="inline-block bg-primary text-white p-4 rounded-lg hover:bg-secondary transition font-display font-bold text-lg uppercase tracking-wider shadow-lg">
          ← Ver Todos os Posts do Blog
        </Link>
      </div>
    </section>
  )
}