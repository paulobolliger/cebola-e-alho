import { MetadataRoute } from 'next';

// Usa a variável de ambiente ou o domínio real como fallback
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.cebolaealho.com.br';

/**
 * Gera o arquivo robots.txt para o site.
 *
 * Coloque este arquivo em 'app/robots.ts'
 *
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // Bloqueia rotas que não são conteúdo principal (ex: APIs internas, páginas de administração)
      disallow: [
        '/api/generate-recipe', // Rota da API de geração de receitas
        '/private', // Exemplo de rota de admin/privada
      ],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}