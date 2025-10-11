import Head from 'next/head'

// CEBOLA & ALHO - Single-file layout (Next.js + Tailwind)
// Usage: paste this file as pages/index.jsx in a Next.js + Tailwind project.
// Notes:
// - Replace sample data with calls to your CMS / API.
// - Search engine and AI integration points are marked.

export default function HomePage() {
  const sampleRecipes = [
    {
      id: 1,
      title: 'Frango na Cebola Caramelizada',
      time: '35 min',
      difficulty: 'Fácil',
      img: '/images/frango-cebola.jpg',
      ingredients: ['frango', 'cebola', 'alho', 'azeite', 'sal']
    },
    {
      id: 2,
      title: 'Arroz de Forno Simples',
      time: '40 min',
      difficulty: 'Médio',
      img: '/images/arroz-forno.jpg',
      ingredients: ['arroz', 'queijo', 'cebola', 'leite']
    },
    {
      id: 3,
      title: 'Sopa Rápida de Legumes',
      time: '20 min',
      difficulty: 'Fácil',
      img: '/images/sopa-legumes.jpg',
      ingredients: ['batata', 'cenoura', 'cebola', 'alho']
    }
  ]

  return (
    <>
      <Head>
        <title>Cebola & Alho — O que eu cozinho com o que tenho?</title>
        <meta name="description" content="Informe o que tem na sua despensa e receba receitas inteligentes e fáceis de fazer." />
      </Head>

      <div className="min-h-screen bg-cream text-gray-800">
        <Header />

        <main className="max-w-6xl mx-auto px-4 py-12">
          <Hero />

          <section className="mt-10">
            <h2 className="text-2xl font-semibold mb-4">Receitas que combinam com o que você tem</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {sampleRecipes.map(r => (
                <RecipeCard key={r.id} recipe={r} />
              ))}
            </div>
          </section>

          <section className="mt-14">
            <h2 className="text-2xl font-semibold mb-4">Do blog</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <BlogCard title="Como substituir ingredientes sem drama" excerpt="5 trocas fáceis quando faltar algo..." />
              <BlogCard title="Truques para dourar cebola como chef" excerpt="O segredo da caramelização perfeita." />
              <BlogCard title="Planejamento de almoço com 5 ingredientes" excerpt="Menu completo usando 5 itens da despensa." />
            </div>
          </section>

          <section className="mt-14 flex flex-col md:flex-row gap-6 items-start">
            <NewsletterCard />
            <PartnersCard />
          </section>
        </main>

        <Footer />
      </div>
    </>
  )
}

function Header() {
  return (
    <header className="bg-white border-b shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-purple flex items-center justify-center text-white font-bold">C&A</div>
          <div>
            <div className="text-lg font-bold">Cebola & Alho</div>
            <div className="text-xs text-gray-500">Cozinhe com o que tem</div>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-6 text-sm">
          <a className="hover:underline">Receitas</a>
          <a className="hover:underline">Cozinhar com o que tenho</a>
          <a className="hover:underline">Blog</a>
          <a className="hover:underline">Anunciar</a>
        </nav>

        <div className="flex items-center gap-3">
          <button className="px-4 py-2 rounded-md border">Entrar</button>
          <button className="px-4 py-2 rounded-md bg-gold text-white font-semibold">Cadastrar</button>
        </div>
      </div>
    </header>
  )
}

function Hero() {
  return (
    <section className="bg-white p-6 rounded-2xl shadow-md">
      <div className="md:flex md:items-center md:gap-8">
        <div className="md:flex-1">
          <h1 className="text-3xl md:text-4xl font-extrabold mb-3">O que tem na sua cozinha? Nós transformamos em jantar.</h1>
          <p className="text-gray-600 mb-6">Digite os ingredientes (ex: arroz, frango, cebola). Nossa IA — ou a lógica esperta — vai sugerir receitas, substituições e uma lista de compras com um clique.</p>

          <IngredientSearch />

          <div className="mt-4 text-sm text-gray-500">Dica: Experimente enviar uma foto da geladeira no futuro — tecnologia de visão pode fazer a mágica.</div>
        </div>

        <div className="md:w-1/3 mt-6 md:mt-0">
          <div className="h-48 rounded-lg bg-gradient-to-br from-purple to-gold flex items-center justify-center text-white font-semibold">
            Espaço para imagem / carrossel
          </div>
        </div>
      </div>
    </section>
  )
}

function IngredientSearch() {
  // In production: hook this input to your backend endpoint which returns recipe matches.
  return (
    <form className="flex gap-3" onSubmit={(e) => e.preventDefault()}>
      <input aria-label="Ingredientes" placeholder="ex: arroz, frango, cebola" className="flex-1 rounded-lg border px-4 py-3" />
      <button className="px-4 py-3 rounded-lg bg-primary text-white font-semibold">Cozinhar</button>
    </form>
  )
}

function RecipeCard({ recipe }) {
  return (
    <article className="bg-white rounded-xl overflow-hidden shadow-sm">
      <div className="h-40 bg-gray-100 flex items-center justify-center">{/* Placeholder imagem */}
        <img src={recipe.img} alt={recipe.title} className="object-cover w-full h-full" />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg">{recipe.title}</h3>
        <div className="text-sm text-gray-500 mt-1">{recipe.time} • {recipe.difficulty}</div>

        <div className="mt-3 flex items-center justify-between">
          <div className="text-xs text-gray-600">Ingredientes: {recipe.ingredients.slice(0,3).join(', ')}{recipe.ingredients.length>3? '...' : ''}</div>
          <div className="flex gap-2">
            <button className="px-3 py-1 rounded-md border text-sm">Ver</button>
            <button className="px-3 py-1 rounded-md bg-primary text-white text-sm">Tenho os ingredientes</button>
          </div>
        </div>
      </div>
    </article>
  )
}

function BlogCard({ title, excerpt }) {
  return (
    <article className="bg-white p-4 rounded-xl shadow-sm">
      <div className="h-36 bg-gray-100 rounded-md mb-3 flex items-center justify-center">Imagem</div>
      <h4 className="font-semibold">{title}</h4>
      <p className="text-sm text-gray-500 mt-2">{excerpt}</p>
      <div className="mt-3">
        <a className="text-sm font-medium text-primary">Ler mais →</a>
      </div>
    </article>
  )
}

function NewsletterCard() {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm flex-1">
      <h3 className="font-semibold text-lg">Receba receitas semanais</h3>
      <p className="text-sm text-gray-600 mt-2">Receitas práticas com o que você já tem. Promoções e parcerias exclusivas.</p>
      <form className="mt-4 flex gap-2" onSubmit={(e) => e.preventDefault()}>
        <input placeholder="Seu melhor e-mail" className="flex-1 rounded-md border px-3 py-2" />
        <button className="px-4 py-2 rounded-md bg-gold text-white font-semibold">Inscrever</button>
      </form>
    </div>
  )
}

function PartnersCard() {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm w-80">
      <h4 className="font-semibold">Parceiros e Anúncios</h4>
      <p className="text-sm text-gray-600 mt-2">Espaços nativos para marcas de alimentos e utensílios. Monetize com publieditoriais.</p>
      <div className="mt-4 flex flex-col gap-2">
        <button className="px-3 py-2 rounded-md border text-sm">Quero anunciar</button>
        <button className="px-3 py-2 rounded-md border text-sm">Programa de afiliados</button>
      </div>
    </div>
  )
}

function Footer() {
  return (
    <footer className="bg-footer py-8 mt-12 text-white">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between gap-6">
        <div>
          <div className="font-bold text-lg">Cebola & Alho</div>
          <div className="text-sm mt-2">Transformando sua despensa em pratos incríveis.</div>
        </div>

        <div className="text-sm">
          <div>Contato: contato@cebolaealho.com.br</div>
          <div className="mt-2">© {new Date().getFullYear()} Cebola & Alho</div>
        </div>
      </div>
    </footer>
  )
}

// Tailwind custom colors (add to tailwind.config.js):
// module.exports = {
//   theme: {
//     extend: {
//       colors: {
//         cream: '#FFF8E6',
//         purple: '#8E4E9E',
//         gold: '#C49A6C',
//         sage: '#A2B29F',
//         primary: '#8E4E9E',
//         footer: '#232323'
//       }
//     }
//   }
// }

/*
  Próximos passos sugeridos:
  - Separar componentes em arquivos (components/RecipeCard.jsx, etc.)
  - Integrar com CMS (Sanity / Strapi) para gerenciar receitas e posts
  - Criar endpoint /api/recipes?ingredients=... que faz o "match" por ingrediente
  - Integrar LLM na camada de sugestão (ex: OpenAI) para variações criativas
  - Adicionar testes unitários e acessibilidade (a11y)
*/
