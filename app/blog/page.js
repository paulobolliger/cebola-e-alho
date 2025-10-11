import BlogCard from '../../components/BlogCard'

export default function BlogPage() {
  const posts = [
    {
      title: '5 Receitas Fáceis com Cebola',
      excerpt: 'Descubra como transformar a cebola em pratos incríveis em minutos.',
      image: '/blog-card.png'
    },
    {
      title: 'Como Aproveitar Sobras de Comida',
      excerpt: 'Dicas práticas para reaproveitar ingredientes que você já tem em casa.',
      image: '/blog-card.png'
    },
    {
      title: 'Molhos Rápidos para Qualquer Prato',
      excerpt: 'Aprenda molhos simples que dão sabor instantâneo às suas receitas.',
      image: '/blog-card.png'
    },
    {
      title: 'Receitas Vegetarianas Simples',
      excerpt: 'Pratos leves e deliciosos que agradam toda a família.',
      image: '/blog-card.png'
    },
    {
      title: 'Cozinhando com Crianças',
      excerpt: 'Ideias divertidas e educativas para envolver os pequenos na cozinha.',
      image: '/blog-card.png'
    },
    {
      title: 'Segredos do Risoto Perfeito',
      excerpt: 'Dicas para deixar seu risoto cremoso e saboroso todas as vezes.',
      image: '/blog-card.png'
    }
  ]

  return (
    <section className="p-8 max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold mb-6 text-purple-700 text-center">Blog Cebola & Alho</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {posts.map((post, idx) => (
          <BlogCard key={idx} title={post.title} excerpt={post.excerpt} image={post.image} />
        ))}
      </div>
    </section>
  )
}
