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
    .select('id, title, slug, excerpt, images, ingredients');

  if (error) {
    console.error('Error fetching recipes:', error);
    return [];
  }

  // Adicionando um fallback de imagem
  return (data as Recipe[]).map(recipe => ({
    ...recipe,
    images: recipe.images && recipe.images.length > 0 ? recipe.images : [{ url: '/recipe-card.png' }]
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

        <div className="mb-12">
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="search"
                placeholder="Buscar por nome ou ingrediente..."
                className="w-full p-4 pr-12 text-text-primary bg-surface border border-border rounded-full shadow-sm focus:ring-2 focus:ring-primary focus:outline-none"
              />
              <svg
                className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-text-tertiary"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <div className="flex items-center justify-center gap-4 mt-4">
              <span className="text-sm font-medium text-text-secondary">Categorias:</span>
              <div className="flex gap-2">
                <button className="px-4 py-2 text-sm bg-primary-light text-primary rounded-full hover:bg-primary hover:text-white transition-colors">Todos</button>
                <button className="px-4 py-2 text-sm bg-surface text-text-secondary rounded-full hover:bg-gray-200 transition-colors">Sopas</button>
                <button className="px-4 py-2 text-sm bg-surface text-text-secondary rounded-full hover:bg-gray-200 transition-colors">Saladas</button>
                <button className="px-4 py-2 text-sm bg-surface text-text-secondary rounded-full hover:bg-gray-200 transition-colors">Sobremesas</button>
              </div>
            </div>
          </div>
        </div>

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