import { MetadataRoute } from 'next';
import { createSupabaseClient } from '@/lib/supabaseClient';
import { Post, Recipe } from '@/types';

// Usa a variável de ambiente ou o domínio real como fallback
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.cebolaealho.com.br';

/**
 * Gera o sitemap.xml para o site, incluindo rotas estáticas e dinâmicas.
 *
 * Coloque este arquivo em 'app/sitemap.ts'
 *
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Inicializa o cliente Supabase para o Server Component
  const supabase = createSupabaseClient();

  // 1. Obter slugs do Blog (posts)
  // Selecionamos 'slug' e 'created_at' para usar no <loc> e <lastmod>
  const { data: blogPosts, error: postsError } = await supabase
    .from('posts')
    .select('slug, created_at');

  if (postsError) {
    console.error('Error fetching blog post slugs for sitemap:', postsError);
    // Em caso de falha, retorna apenas as rotas estáticas para não quebrar o build
    return buildStaticRoutes(BASE_URL);
  }

  // 2. Obter slugs de Receitas (recipes)
  const { data: recipes, error: recipesError } = await supabase
    .from('recipes')
    .select('slug');

  if (recipesError) {
    console.error('Error fetching recipe slugs for sitemap:', recipesError);
    // Continua com o que for possível
  }

  // Mapeamento de rotas dinâmicas do Blog
  const blogRoutes: MetadataRoute.Sitemap = (blogPosts || []).map((post: Partial<Post>) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    // Converte created_at para o formato ISO 8601 exigido pelo sitemap
    lastModified: post.created_at ? new Date(post.created_at).toISOString() : new Date().toISOString(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  // Mapeamento de rotas dinâmicas de Receitas
  const recipeRoutes: MetadataRoute.Sitemap = (recipes || []).map((recipe: Partial<Recipe>) => ({
    url: `${BASE_URL}/recipes/${recipe.slug}`,
    // A interface Recipe não tem 'created_at', então usamos a data de geração do sitemap.
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  // 3. Juntar rotas estáticas e dinâmicas
  return [
    ...buildStaticRoutes(BASE_URL),
    ...blogRoutes,
    ...recipeRoutes,
  ];
}

/**
 * Função auxiliar para gerar rotas estáticas, garantindo que o BASE_URL seja aplicado.
 * @param baseUrl O URL base do site.
 */
function buildStaticRoutes(baseUrl: string): MetadataRoute.Sitemap {
  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0, // Página principal é a mais importante
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
  ];
}