// app/recipes/page.tsx
import RecipeCard from '@/components/RecipeCard';
import { createSupabaseClient } from '@/lib/supabaseClient';
import { RecipeForCard } from '@/types';
import RecipeFilters from '@/components/RecipeFilters'; // Importa o novo componente

type RecipesPageProps = {
  searchParams: {
    difficulty?: string;
    prep_time?: string;
  };
};

// Função para buscar a lista de receitas no Supabase
async function getRecipes(searchParams: RecipesPageProps['searchParams']): Promise<RecipeForCard[]> {
  const supabase = createSupabaseClient();
  
  let query = supabase
    .from('recipes')
    .select(`
      id, title, slug, description, image_url, prep_time, difficulty,
      average_rating, rating_count, ingredients_json
    `);

  // Aplica filtros dinamicamente
  if (searchParams.difficulty) {
    query = query.eq('difficulty', searchParams.difficulty);
  }
  if (searchParams.prep_time) {
    query = query.lte('prep_time', parseInt(searchParams.prep_time, 10));
  }

  const { data, error } = await query.order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching recipes:', error);
    return [];
  }

  return data as RecipeForCard[];
}

// Página de listagem de Receitas (listagem principal)
export default async function RecipesPage({ searchParams }: RecipesPageProps) {
  const recipes = await getRecipes(searchParams);

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-16">
        <section className="text-center mb-12">
          <h1 className="font-display font-black text-5xl md:text-6xl text-text-primary mb-4">
            Receitas da Comunidade
          </h1>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            Explore as melhores receitas geradas e aprovadas pela nossa comunidade
            de cozinheiros criativos.
          </p>
        </section>

        {/* Adiciona o componente de filtros */}
        <RecipeFilters />

        <section>
          {recipes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recipes.map((recipe) => (
                <RecipeCard 
                  key={recipe.id} 
                  recipe={recipe} 
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-surface border border-border rounded-xl shadow-md">
              <h2 className="font-display text-2xl text-text-primary">
                Nenhuma receita encontrada.
              </h2>
              <p className="text-text-secondary mt-2">
                Parece que o chef ainda está dormindo. Tente gerar a primeira!
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}