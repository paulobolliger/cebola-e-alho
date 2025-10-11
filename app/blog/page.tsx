import BlogCard from '../../components/BlogCard'
import { v4 as uuidv4 } from 'uuid' // Necessário para gerar IDs únicos

// 1. Tipagem do Post
interface BlogPost {
  id: string
  title: string
  excerpt: string
  image: string
}

export default function BlogPage() {
  // 2. Mock com ID único e tipagem
  const posts: BlogPost[] = [
    {
      id: uuidv4(),
      title: '5 Receitas Fáceis com Cebola',
      excerpt: 'Descubra como transformar a cebola em pratos incríveis em minutos.',
      image: '/blog-card.png'
    },
    {
      id: uuidv4(),
      title: 'Como Aproveitar Sobras de Comida',
      excerpt: 'Dicas práticas para reaproveitar ingredientes que você já tem em casa.',
      image: '/blog-card.png'
    },
    {
      id: uuidv4(),
      title: 'Molhos Rápidos para Qualquer Prato',
      excerpt: 'Aprenda molhos simples que dão sabor instantâneo às suas receitas.',
      image: '/blog-card.png'
    },
    {
      id: uuidv4(),
      title: 'Receitas Vegetarianas Simples',
      excerpt: 'Pratos leves e deliciosos que agradam toda a família.',
      image: '/blog-card.png'
    },
    {
      id: uuidv4(),
      title: 'Cozinhando com Crianças',
      excerpt: 'Ideias divertidas e educativas para envolver os pequenos na cozinha.',
      image: '/blog-card.png'
    },
    {
      id: uuidv4(),
      title: 'Segredos do Risoto Perfeito',
      excerpt: 'Dicas para deixar seu risoto cremoso e saboroso todas as vezes.',
      image: '/blog-card.png'
    }
  ]

  return (
    <section className="p-8 max-w-6xl mx-auto">
      {/* 3. Título h1 com Fonte Display e Cor Primária */}
      <h1 className="text-4xl font-display font-black mb-6 text-primary text-center">
        Inspiração do Chef Amigo
      </h1>
      <p className="text-lg text-text-base text-center mb-12 font-body">
        Conteúdo Inteligente e Caloroso para sua Jornada Culinária.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 4. Uso do ID único como key (necessário após a tipagem) */}
        {posts.map((post) => (
          <BlogCard key={post.id} title={post.title} excerpt={post.excerpt} image={post.image} />
        ))}
      </div>
    </section>
  )
}