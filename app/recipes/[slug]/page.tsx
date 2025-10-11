// app/recipes/[slug]/page.tsx

import { notFound } from 'next/navigation'
import Image from 'next/image'
import { Metadata } from 'next'
import Link from 'next/link'

// 1. Definição da interface de dados da Receita
interface Recipe {
  id: string;
  title: string;
  image: string;
  description: string;
  ingredients: string[];
  instructions: string[];
}

// 2. Mock de dados para simular a busca
const MOCK_RECIPE_DATA: Recipe = {
  id: 'macarrao-ao-alho-e-oleo',
  title: 'Macarrão ao Alho e Óleo com Toque de Limão Siciliano',
  image: '/recipe-card.png',
  description: "Este clássico foi refinado por nosso algoritmo, que sugeriu um toque de raspas de limão siciliano para elevar o frescor. Simples, rápido e incrivelmente saboroso, refletindo a essência da Alquimia da Cozinha Digital.",
  ingredients: [
    '200g de Macarrão Spaguetti (ou o que tiver)',
    '1/2 xícara de azeite de oliva extra virgem',
    '8 dentes de alho fatiados (a paixão do chef!)',
    'Pimenta dedo-de-moça a gosto (opcional)',
    'Salsinha fresca picada',
    'Sal e pimenta do reino',
    'Raspas de 1/2 limão siciliano (a sugestão da IA!)'
  ],
  instructions: [
    'Cozinhe o macarrão em água e sal, reservando uma concha da água do cozimento.',
    'Em uma frigideira grande, aqueça o azeite em fogo baixo e adicione o alho fatiado e a pimenta. Deixe dourar levemente. Não queime!',
    'Adicione a água do cozimento reservada à frigideira. A emulsão criará um molho leve.',
    'Escorra o macarrão e transfira-o para a frigideira.',
    'Misture bem, polvilhe com a salsinha e as raspas de limão. Sirva imediatamente!'
  ]
}

// 3. Tipagem dos Props da Page (parâmetros dinâmicos)
interface RecipePageProps {
  params: { slug: string }
}

// 4. Função para gerar metadados dinâmicos (SEO - Server Component)
export async function generateMetadata({ params }: RecipePageProps): Promise<Metadata> {
  const { slug } = params;
  
  // Aqui você faria a busca de dados via Supabase usando o slug
  const recipe = slug === MOCK_RECIPE_DATA.id ? MOCK_RECIPE_DATA : null

  if (!recipe) {
    return {
      title: 'Receita não encontrada | Cebola & Alho',
      description: 'Oops! Não encontramos esta receita.'
    }
  }

  return {
    title: `${recipe.title} | Cebola & Alho`,
    description: recipe.description,
    // Palavras-chave alinhadas com o Branding Book
    keywords: ['receita', 'cebola', 'alho', 'ia', slug, 'cozinha digital', 'alquimia culinária'],
    openGraph: {
      images: [{ url: recipe.image }],
    },
  }
}

// 5. Componente principal (Server Component)
export default async function RecipePage({ params }: RecipePageProps) {
  const { slug } = params

  // Simulação de busca de dados
  // No projeto real: const { data: recipe } = await supabase.from('recipes').select('*').eq('slug', slug).single()
  const recipe = slug === MOCK_RECIPE_DATA.id ? MOCK_RECIPE_DATA : null

  if (!recipe) {
    // Redireciona para a página 404 nativa do Next.js
    notFound()
  }

  return (
    <section className="p-8 max-w-5xl mx-auto">
      <article className="bg-background-soft p-6 md:p-10 rounded-xl shadow-2xl">
        
        {/* Imagem de Destaque */}
        <div className="relative w-full h-96 mb-8 rounded-lg overflow-hidden">
          <Image
            src={recipe.image}
            alt={recipe.title}
            layout="fill"
            objectFit="cover"
            priority // Priorizar o carregamento da LCP
          />
        </div>

        {/* Título e Descrição */}
        <header className="mb-8 border-b border-gray-300 pb-4">
          <h1 className="text-5xl font-display font-black text-primary mb-2">
            {recipe.title}
          </h1>
          <p className="text-xl font-body text-secondary font-semibold">
            Gerada por IA para você, com precisão e sabor.
          </p>
        </header>

        <p className="text-text-base text-lg font-body italic mb-8 border-l-4 border-accent pl-4">
          "A sugestão do nosso Chef Amigo: {recipe.description}"
        </p>

        <div className="grid md:grid-cols-2 gap-10">
          {/* Ingredientes */}
          <div>
            <h2 className="text-3xl font-display font-bold text-text-base mb-4 border-b pb-2">
              Ingredientes
            </h2>
            <ul className="space-y-3 font-body text-text-base text-lg list-disc list-inside">
              {recipe.ingredients.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>

          {/* Modo de Preparo */}
          <div>
            <h2 className="text-3xl font-display font-bold text-text-base mb-4 border-b pb-2">
              Modo de Preparo
            </h2>
            <ol className="space-y-4 font-body text-text-base text-lg list-decimal list-inside">
              {recipe.instructions.map((step, index) => (
                <li key={index}>
                  <p className="inline pl-2">{step}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>

      </article>
      
      {/* CTA para nova busca */}
      <div className="text-center mt-12">
        <Link href="/" className="inline-block bg-primary text-white p-4 rounded-lg hover:bg-secondary transition font-display font-bold text-lg uppercase tracking-wider shadow-lg">
          Transforme Outros Ingredientes com IA
        </Link>
      </div>

    </section>
  )
}