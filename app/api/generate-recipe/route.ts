import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { z } from 'zod';
import { createSupabaseClient } from '@/lib/supabaseClient';
import slugify from 'slugify';

// Init OpenAI
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Schema input
const recipeRequestSchema = z.object({
  ingredients: z.string().min(3, 'Os ingredientes devem ter pelo menos 3 caracteres.'),
});

// Output type
interface RecipeData {
  title: string;
  description: string;
  cooking_time: number;
  servings: string;
  ingredients: { item: string; quantity: string }[];
  instructions: { step: number; description: string }[];
  tips: string[];
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const supabase = createSupabaseClient();
    const validation = recipeRequestSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ error: validation.error.issues[0].message }, { status: 400 });
    }

    const { ingredients } = validation.data;

    const systemPrompt = `
      You are a world-class culinary expert assistant named "Cebola & Alho".
      Your tone is friendly, creative, and home-cook accessible.
      Create a detailed recipe based on the ingredients: "${ingredients}".
      Return ONLY a valid JSON matching this schema:
      {
        "title": "string",
        "description": "string",
        "cooking_time": "number (in minutes)",
        "servings": "string",
        "ingredients": [{"item": "string", "quantity": "string"}],
        "instructions": [{"step": "number", "description": "string"}],
        "tips": ["string"]
      }
    `;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'system', content: systemPrompt }],
      temperature: 0.7,
      response_format: { type: 'json_object' },
    });

    const content = response.choices[0]?.message?.content;
    if (!content) throw new Error('No content received from OpenAI');

    const recipeData: RecipeData = JSON.parse(content);
    const slug = slugify(recipeData.title, { lower: true, strict: true });

    // Insert into Supabase
    const { data: newRecipe, error } = await supabase
      .from('recipes')
      .insert([
        {
          title: recipeData.title,
          slug,
          description: recipeData.description,
          prep_time: recipeData.cooking_time,
          cooking_time: recipeData.cooking_time,
          difficulty: 'Fácil',
          rating: 0,
          rating_count: 0,
          ingredients: recipeData.ingredients,
          instructions: recipeData.instructions.map(i => i.description),
          steps: recipeData.tips,
          tags: ['automática', 'cebola-e-alho'],
          author_id: 'd9b73b5e-9a9c-4c7b-9d4a-1e3f8c2b0e1a',
          published: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          image: null,
          image_alt: null,
          json_ld: null,
          images: null,
          category: 'Receitas rápidas'
        },
      ])
      .select('slug')
      .single();

    if (error) throw new Error(`Supabase insert failed: ${error.message}`);

    return NextResponse.json({ slug: newRecipe.slug }, { status: 201 });
  } catch (error) {
    console.error('API Error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
