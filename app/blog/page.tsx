import BlogCard from '../../components/BlogCard'
import { clientSupabase } from '@/lib/supabaseClient' // 1. Importação do cliente público

// 2. Tipagem do Post (Ajustada para o Banco de Dados)
interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  image_url: string; // Coluna do banco de dados (ajustada para image_url)
}

// 3. Função de busca de dados (Server Component)
async function getBlogPosts(): Promise<BlogPost[]> {
  const { data: posts, error } = await clientSupabase
    .from('posts')
    .select('id, title, slug, excerpt, image_url') // Colunas a serem retornadas
    .order('created_at', { ascending: false }) // Ordena pelos mais novos

  if (error) {
    // Em produção, isso seria logado. Para o usuário, retorna um array vazio.
    console.error("Erro ao buscar posts do Supabase:", error.message)
    return []
  }

  // Adicionar um valor padrão para a imagem se o banco não retornar
  return (posts as BlogPost[]).map(post => ({
    ...post,
    image_url: post.image_url || '/blog-card.png'
  }))
}

// 4. Componente principal (Server Component)
export default async function BlogPage() {
  const posts = await getBlogPosts()

  return (
    <section className="p-8 max-w-6xl mx-auto">
      <h1 className="text-4xl font-display font-black mb-6 text-primary text-center">
        Inspiração do Chef Amigo
      </h1>
      <p className="text-lg text-text-base text-center mb-12 font-body">
        Conteúdo Inteligente e Caloroso para sua Jornada Culinária.
      </p>

      {posts.length === 0 ? (
        <div className="text-center py-10 text-gray-500 font-body">
          <p>Nenhum post encontrado. O Chef Amigo ainda está escrevendo!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {posts.map((post) => (
            // 5. Passa a image_url para o BlogCard
            <BlogCard 
              key={post.id} 
              title={post.title} 
              excerpt={post.excerpt} 
              image={post.image_url} 
              slug={post.slug} // Novo: Passa o slug para o card
            />
          ))}
        </div>
      )}
    </section>
  )
}