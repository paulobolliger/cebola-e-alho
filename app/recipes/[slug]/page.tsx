// app/recipes/[slug]/page.tsx
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Image from "next/image";
// Importa os novos tipos com as estruturas JSONB
import { Recipe, IngredientItem, InstructionStep } from "@/types/recipes"; 
import Script from "next/script"; // Importa o Script do Next.js para o JSON-LD

type Props = {
  params: {
    slug: string;
  };
};

export const revalidate = 60;

// Tipagem para os dados que virão do join com a tabela authors
type RecipeWithAuthor = Recipe & {
  authors: {
    name: string;
    avatar_url: string | null;
  } | null;
};

// Componente auxiliar para injetar o JSON-LD
const RecipeJsonLd = ({ recipe, authorName, authorImageUrl }: { 
  recipe: Recipe; 
  authorName: string;
  authorImageUrl: string | null;
}) => {
  
  // Mapeia ingredientes para o formato Schema.org (String array)
  // Usa o novo campo ingredients_json
  const recipeIngredient = recipe.ingredients_json?.map((ing: IngredientItem) => 
    `${ing.quantity} ${ing.item}`.trim()
  ) || [];

  // Mapeia instruções para o formato Schema.org (HowToStep array)
  // Usa o novo campo instructions_json
  const recipeInstruction = recipe.instructions_json?.map((inst: InstructionStep) => ({
    "@type": "HowToStep",
    "name": `Passo ${inst.step}`,
    "text": inst.description
  })) || [];

  // Converte tempo para o formato ISO 8601 (ex: PT30M)
  const prepTimeIso = recipe.prep_time ? `PT${recipe.prep_time}M` : undefined;
  const cookTimeIso = recipe.cook_time ? `PT${recipe.cook_time}M` : undefined;
  const totalTimeIso = (recipe.prep_time && recipe.cook_time) ? `PT${recipe.prep_time + recipe.cook_time}M` : undefined;

  // Cria o objeto JSON-LD
  const jsonLd = {
    "@context": "https://schema.org/",
    "@type": "Recipe",
    "name": recipe.title,
    "image": [
      recipe.image_url, 
    ],
    "author": {
      "@type": "Person",
      "name": authorName,
      ...(authorImageUrl && { "image": authorImageUrl })
    },
    "datePublished": recipe.created_at, // Use created_at do banco
    "description": recipe.description,
    // Tempos em formato ISO 8601
    ...(prepTimeIso && { "prepTime": prepTimeIso }), 
    ...(cookTimeIso && { "cookTime": cookTimeIso }),
    ...(totalTimeIso && { "totalTime": totalTimeIso }),
    "recipeYield": recipe.servings,
    "recipeIngredient": recipeIngredient,
    "recipeInstructions": recipeInstruction,
    "recipeCategory": recipe.cuisine,
    "keywords": recipe.tags?.join(', '),
    // Você pode adicionar AggregateRating aqui quando implementar o sistema de avaliação.
    // "aggregateRating": { ... }
  };

  return (
    // Componente Script do Next.js para carregar o JSON-LD
    <Script
      id="recipe-jsonld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
};


// ------------------------------------------------------------------
// Page Component 
// ------------------------------------------------------------------

export async function generateMetadata({ params }: Props) {
  const supabase = createClient();
  const { data: recipe } = await supabase
    .from("recipes")
    .select("title, description")
    .eq("slug", params.slug)
    .single();

  if (!recipe) {
    return {
      title: "Receita não encontrada",
    };
  }

  // ✅ CORREÇÃO: Usar o título dinâmico da marca Cebola & Alho
  return {
    title: `${recipe.title} | Cebola & Alho`,
    description: recipe.description,
  };
}

export default async function RecipePage({ params }: Props) {
  const supabase = createClient();
  
  // ✅ Busca a receita E os dados do autor em um único SELECT com JOIN
  const { data, error } = await supabase
    .from("recipes")
    .select(
      `
        *,
        authors (name, avatar_url)
      `
    )
    .eq("slug", params.slug)
    .single();

  if (error || !data) {
    console.error("Error fetching recipe:", error);
    notFound();
  }

  // Cast para o tipo com o autor
  const recipeData = data as RecipeWithAuthor;
  const recipe = data as Recipe;

  // Dados do Autor para o Schema e exibição
  const authorName = recipeData.authors?.name || "Food Guru (IA)";
  const authorImageUrl = recipeData.authors?.avatar_url || null;

  const imageUrl = recipe.image_url || '/recipe-card.png';
  const prepTime = recipe.prep_time || 0;
  const cookTime = recipe.cook_time || 0;


  return (
    <>
      {/* ✅ NOVO: Inclui o JSON-LD no topo do componente */}
      <RecipeJsonLd 
        recipe={recipe} 
        authorName={authorName}
        authorImageUrl={authorImageUrl}
      />

      <div className="container mx-auto px-4 py-8">
        <article className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          {imageUrl && (
            <div className="relative h-64 w-full">
              <Image
                src={imageUrl}
                alt={`Imagem da receita ${recipe.title}`}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 80vw"
              />
            </div>
          )}
          <div className="p-6 md:p-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
              {recipe.title}
            </h1>
            
            {/* NOVO: Exibição do Autor (Parte D) */}
            <div className="flex items-center gap-3 mb-6">
                {authorImageUrl ? (
                    <Image src={authorImageUrl} alt={authorName} width={32} height={32} className="rounded-full object-cover" />
                ) : (
                    // Fallback visual
                    <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-xs font-semibold">
                        {authorName[0]}
                    </div>
                )}
                <span className="text-sm text-gray-700 dark:text-gray-300">
                    Por <strong className="text-primary">{authorName}</strong>
                </span>
            </div>


            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {recipe.description}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {/* Usando prep_time (number) */}
              <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg text-center">
                <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-200">Preparo</h3>
                <p>{prepTime} min</p>
              </div>
              {/* Usando cook_time (number) */}
              <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg text-center">
                <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-200">Cozimento</h3>
                <p>{cookTime} min</p>
              </div>
              {/* Usando servings (string) */}
              <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg text-center">
                <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-200">Porções</h3>
                <p>{recipe.servings}</p>
              </div>
            </div>

            <div className="prose prose-lg max-w-none dark:prose-invert">
              <h2 className="font-semibold">Ingredientes</h2>
              {/* ✅ Renderização do JSONB (Parte C) */}
              <ul className="list-disc list-inside">
                {recipe.ingredients_json?.map((ing, index) => (
                  <li key={index}>
                    <strong>{ing.quantity}</strong> {ing.item}
                  </li>
                ))}
              </ul>

              <h2 className="font-semibold mt-6">Instruções</h2>
              {/* ✅ Renderização do JSONB (Parte C) */}
              <ol className="list-decimal list-inside">
                {recipe.instructions_json?.map((inst) => (
                  <li key={inst.step}>
                    {inst.description}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </article>
      </div>
    </>
  );
}