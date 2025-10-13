// app/recipes/page.tsx
import RecipeCard from '@/components/RecipeCard';
import { createSupabaseClient } from '@/lib/supabaseClient';
import { Recipe } from '@/types';

// Função para buscar a lista de receitas no Supabase
async function getRecipes() {
  const supabase = createSupabaseClient();
  
  // Selecionando os campos necessários para o card
  const { data, error } = await supabase
    .from('recipes')
    .select('id, title, slug, image, description');

  if (error) {
    console.error('Error fetching recipes:', error);
    return [];
  }

  // Adicionando um fallback de imagem
  return (data as Recipe[]).map(recipe => ({
    ...recipe,
    image: recipe.image || '/recipe-card.png'
  }));
}

// Página de listagem de Receitas (listagem principal)
export default async function RecipesPage() {
  const recipes = await getRecipes();

  return (
    // Removido 'bg-background' para herdar a cor do layout (CORREÇÃO para duplicação)
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

        <section>
          {recipes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recipes.map((recipe) => (
                // RecipeCard usa 'title' e 'image'
                <RecipeCard key={recipe.id} title={recipe.title} image={recipe.image} />
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