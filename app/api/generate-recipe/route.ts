import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { z } from 'zod';
import { createSupabaseClient } from '@/lib/supabaseClient';
import slugify from 'slugify';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Zod schema for input validation
// Corrigido: Espera 'ingredients' em vez de 'prompt' e remove 'category_id'
const recipeRequestSchema = z.object({
  ingredients: z.string().min(3, 'Os ingredientes devem ter pelo menos 3 caracteres.'),
});

// Define the expected JSON structure from OpenAI
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

    // Validate input using Zod
    const validation = recipeRequestSchema.safeParse(body);

    if (!validation.success) {
      // Retorna a mensagem de erro específica do Zod, que é mais útil
      return NextResponse.json({ error: validation.error.issues[0].message }, { status: 400 });
    }

    // Corrigido: Usa 'ingredients' da validação
    const { ingredients } = validation.data;

    const systemPrompt = `
      You are a world-class culinary expert assistant named "Cebola & Alho". Your tone is that of a "Friendly Chef": warm, inspiring, and accessible.
      Your main task is to create a delicious and practical recipe based on the user's ingredients: "${ingredients}". // Corrigido: usa a variável correta
      You must return the response exclusively in a valid JSON object, following the specified schema.
      Do not include any introductory text like "Here is the recipe". Just the JSON.
      The recipe should be creative but achievable for a home cook.
      Ensure all fields are filled appropriately.
      Cooking time should be in total minutes.
      Servings should be a string like "2-3 pessoas".
      The JSON schema is:
      {
        "title": "string",
        "description": "string",
        "cooking_time": "number (in minutes)",
        "servings": "string",
        "ingredients": [
          {"item": "string", "quantity": "string"}
        ],
        "instructions": [
          {"step": "number", "description": "string"}
        ],
        "tips": ["string"]
      }
    `;

    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'system', content: systemPrompt }],
      temperature: 0.7,
      response_format: { type: 'json_object' },
    });

    const content = response.choices[0]?.message?.content;

    if (!content) {
      throw new Error('No content received from OpenAI');
    }

    const recipeData: RecipeData = JSON.parse(content);

    // Create a slug for the recipe
    const slug = slugify(recipeData.title, { lower: true, strict: true });

    // Save the recipe to Supabase
    const { data: newRecipe, error } = await supabase
      .from('recipes')
      .insert([
        {
          ...recipeData,
          slug,
          // Corrigido: 'category_id' foi removido
          author_id: 'd9b73b5e-9a9c-4c7b-9d4a-1e3f8c2b0e1a', // Hardcoded author_id
          published_at: new Date().toISOString(),
          images: [{ url: '/recipe-card.png', alt: recipeData.title }],
        },
      ])
      .select('slug')
      .single();

    if (error) {
      console.error('Supabase error:', error);
      throw new Error(`Failed to save recipe to database: ${error.message}`);
    }

    return NextResponse.json({ slug: newRecipe.slug }, { status: 201 });
  } catch (error) {
    console.error('API Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    return NextResponse.json({ error: 'Failed to generate recipe.', details: errorMessage }, { status: 500 });
  }
}