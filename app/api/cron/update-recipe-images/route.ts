// /app/api/cron/update-recipe-images/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const PEXELS_API_KEY = process.env.PEXELS_API_KEY!;

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export async function GET(req: Request) {
  // 🔒 Autenticação via header Authorization
  const auth = req.headers.get('Authorization');
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // 1️⃣ Busca até 5 receitas sem imagem
    const { data: recipes, error } = await supabase
      .from('recipes')
      .select('id, title, slug, description, cooking_time, created_at')
      .is('image', null)
      .limit(5);

    if (error) throw error;
    if (!recipes || recipes.length === 0) {
      console.log('Nenhuma receita sem imagem encontrada.');
      return NextResponse.json({ message: 'Nenhuma receita sem imagem encontrada.' });
    }

    for (const recipe of recipes) {
      const query = encodeURIComponent(`${recipe.title} food dish`);

      // 2️⃣ Busca imagem no Pexels
      const res = await fetch(`https://api.pexels.com/v1/search?query=${query}&per_page=1`, {
        headers: { Authorization: PEXELS_API_KEY },
      });
      const data = await res.json();
      const imageUrl = data?.photos?.[0]?.src?.large2x;

      if (!imageUrl) {
        console.log(`Imagem não encontrada para: ${recipe.title}`);
        continue;
      }

      // 3️⃣ Gera JSON-LD
      const jsonLD = {
        "@context": "https://schema.org/",
        "@type": "Recipe",
        name: recipe.title,
        image: imageUrl,
        description: recipe.description,
        url: `https://nomade.guru/recipes/${recipe.slug}`,
        recipeYield: "1 serving",
        cookTime: `PT${recipe.cooking_time}M`,
        datePublished: recipe.created_at,
      };

      // 4️⃣ Atualiza receita no Supabase
      const { error: updateError } = await supabase
        .from('recipes')
        .update({
          image: imageUrl,
          image_alt: `Foto de ${recipe.title}`,
          json_ld: jsonLD,
        })
        .eq('id', recipe.id);

      if (updateError) {
        console.log(`Erro ao atualizar ${recipe.title}:`, updateError);
      } else {
        console.log(`Atualizado: ${recipe.title}`);
      }
    }

    return NextResponse.json({ message: 'Cron executado com sucesso.' });
  } catch (err) {
    console.error('Erro no cron:', err);
    return NextResponse.json({ error: 'Erro no cron', details: err }, { status: 500 });
  }
}
