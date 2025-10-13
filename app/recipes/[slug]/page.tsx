// app/recipes/[slug]/page.tsx

import { notFound } from 'next/navigation'
import Image from 'next/image'
import { Metadata } from 'next'
import Link from 'next/link'
import { clientSupabase } from '@/lib/supabaseClient' // 1. Uso do cliente público para leitura

// 2. Definição da interface de dados da Receita (Ajustada para a estrutura do banco)
interface Recipe {
  id: string;
  title: string;
  slug: string;
  image: string; // Assumindo que a imagem ainda é mockada
  description: string;
  // A API Route salva ingredientes/instruções como strings separadas
  ingredients_string: string;
  instructions_string: string;
}

// 3. Função de busca de dados (Server Component)
async function getRecipeBySlug(slug: string): Promise<Recipe | null> {
  // Chamada ao Supabase usando o cliente público (clientSupabase)
  const { data, error } = await clientSupabase
    .from('recipes')
    .select('id, title, slug, image, description, ingredients_string, instructions_string') // Seleciona apenas as colunas necessárias
    .eq('slug', slug)
    .single()

  if (error || !data) {
    // console.error(error) // Log do erro de DB (apenas para debug)
    return null
  }

  // Adiciona campo image mockado
  return {
    ...data,
    image: data.image || '/recipe-card.png',
  } as Recipe
}

// 4. Tipagem dos Props da Page (parâmetros dinâmicos)
interface RecipePageProps {
  params: { slug: string }
}

// 5. Função para gerar metadados dinâmicos (SEO - Server Component)
export async function generateMetadata({ params }: RecipePageProps): Promise<Metadata> {
  const recipe = await getRecipeBySlug(params.slug)

  if (!recipe) {
    return {
      title: 'Receita não encontrada | Cebola & Alho',
      description: 'Oops! Não encontramos esta receita.'
    }
  }

  return {
    title: `${recipe.title} | Cebola & Alho`,
    description: recipe.description,
    keywords: ['receita', 'cebola', 'alho', 'ia', recipe.slug, 'cozinha digital', 'alquimia culinária'],
    openGraph: {
      images: [{ url: recipe.image }],
    },
  }
}

// 6. Componente principal (Server Component)
export default async function RecipePage({ params }: RecipePageProps) {
  const recipe = await getRecipeBySlug(params.slug)

  if (!recipe) {
    // Redireciona para a página 404 nativa do Next.js
    notFound()
  }

  // 7. Processamento das strings para exibição em lista
  const ingredientsArray = recipe.ingredients_string.split(/\n|,/g).map(s => s.trim()).filter(s => s.length > 0)
  const instructionsArray = recipe.instructions_string.split(/\n/g).map(s => s.trim()).filter(s => s.length > 0)


  return (
    <section className="p-8 max-w-5xl mx-auto">
      <article className="bg-surface p-6 md:p-10 rounded-xl shadow-2xl border border-border">

        {/* Imagem de Destaque */}
        <div className="relative w-full h-96 mb-8 rounded-lg overflow-hidden">
          <Image
            src={recipe.image}
            alt={recipe.title}
            fill
            className="object-cover"
            priority // Priorizar o carregamento da LCP
          />
        </div>

        {/* Título e Descrição */}
        <header className="mb-8 border-b border-border pb-4">
          <h1 className="text-5xl font-display font-black text-primary mb-2">
            {recipe.title}
          </h1>
          <p className="text-xl font-body text-text-secondary font-semibold">
            Gerada por IA para você, com precisão e sabor.
          </p>
        </header>

        <p className="text-text-primary text-lg font-body italic mb-8 border-l-4 border-accent pl-4">
          "A sugestão do nosso Chef Amigo: {recipe.description}"
        </p>

        <div className="grid md:grid-cols-2 gap-10">
          {/* Ingredientes */}
          <div>
            <h2 className="text-3xl font-display font-bold text-text-primary mb-4 border-b pb-2">
              Ingredientes
            </h2>
            <ul className="space-y-3 font-body text-text-secondary text-lg list-disc list-inside">
              {ingredientsArray.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>

          {/* Modo de Preparo */}
          <div>
            <h2 className="text-3xl font-display font-bold text-text-primary mb-4 border-b pb-2">
              Modo de Preparo
            </h2>
            <ol className="space-y-4 font-body text-text-secondary text-lg list-decimal list-inside">
              {instructionsArray.map((step, index) => (
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
        <Link href="/" className="inline-block bg-primary text-white p-4 rounded-lg hover:opacity-90 transition font-display font-bold text-lg uppercase tracking-wider shadow-lg">
          Transforme Outros Ingredientes com IA
        </Link>
      </div>

    </section>
  )
}