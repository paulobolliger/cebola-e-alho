// app/recipes/[slug]/page.tsx
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Image from "next/image";

type Props = {
  params: {
    slug: string;
  };
};

export const revalidate = 60;

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

  return {
    title: `${recipe.title} | Receitas Vistos.guru`,
    description: recipe.description,
  };
}

export default async function RecipePage({ params }: Props) {
  const supabase = createClient();
  const { data: recipe } = await supabase
    .from("recipes")
    .select("*")
    .eq("slug", params.slug)
    .single();

  if (!recipe) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <article className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        {recipe.image_url && (
          <div className="relative h-64 w-full">
            <Image
              src={recipe.image_url}
              alt={`Imagem da receita ${recipe.title}`}
              layout="fill"
              objectFit="cover"
              priority
            />
          </div>
        )}
        <div className="p-6 md:p-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
            {recipe.title}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {recipe.description}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg text-center">
              <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-200">
                Preparo
              </h3>
              <p>{recipe.prep_time}</p>
            </div>
            <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg text-center">
              <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-200">
                Cozimento
              </h3>
              <p>{recipe.cook_time}</p>
            </div>
            <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg text-center">
              <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-200">
                Porções
              </h3>
              <p>{recipe.servings}</p>
            </div>
          </div>

          <div className="prose prose-lg max-w-none dark:prose-invert">
            <h2 className="font-semibold">Ingredientes</h2>
            <div
              dangerouslySetInnerHTML={{ __html: recipe.ingredients || "" }}
            />

            <h2 className="font-semibold mt-6">Instruções</h2>
            <div
              dangerouslySetInnerHTML={{ __html: recipe.instructions || "" }}
            />
          </div>
        </div>
      </article>
    </div>
  );
}