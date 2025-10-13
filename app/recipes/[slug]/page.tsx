import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";

interface RecipePageProps {
  params: { slug: string };
}

export default async function RecipePage({ params }: RecipePageProps) {
  const supabase = createClient();
  const { slug } = params;

  // busca receita pelo slug
  const { data: recipeData, error } = await supabase
    .from("recipes")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !recipeData) {
    console.error("Erro ao buscar receita:", error);
    return notFound(); // redireciona para 404 se não encontrar
  }

  const recipe = recipeData;

  return (
    <article className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-6">{recipe.title}</h1>
      <p className="text-gray-600 mb-8">{recipe.excerpt}</p>

      {recipe.images && recipe.images.length > 0 && (
        <div className="mb-8">
          {recipe.images.map((img: string, idx: number) => (
            <img
              key={idx}
              src={img}
              alt={recipe.title}
              className="w-full rounded-lg mb-4"
            />
          ))}
        </div>
      )}

      <div
        className="prose max-w-full"
        dangerouslySetInnerHTML={{ __html: recipe.content }}
      />

      {/* Meta e SEO (opcional, se usar Next.js Head) */}
      <head>
        <title>{recipe.meta_title || recipe.title}</title>
        <meta
          name="description"
          content={recipe.meta_description || recipe.excerpt}
        />
        {recipe.keywords && (
          <meta name="keywords" content={recipe.keywords.join(", ")} />
        )}
      </head>
    </article>
  );
}
