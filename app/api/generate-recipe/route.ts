import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { z } from 'zod';
import { createSupabaseClient } from '@/lib/supabaseClient'; // For user auth
import { supabaseAdmin } from '@/lib/supabase/admin'; // For admin-level writes
import slugify from 'slugify';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Zod schema for input validation
const recipeRequestSchema = z.object({
  ingredients: z.string().min(3, 'Os ingredientes devem ter pelo menos 3 caracteres.'),
});

// Define the expected JSON structure from OpenAI
interface RecipeData {
  title: string;
  description: string;
  prep_time: number;
  cook_time: number;
  servings: string;
  ingredients: { item: string; quantity: string }[];
  instructions: { step: number; description:string }[];
  tips: string[];
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const supabase = createSupabaseClient(); // Standard client for auth

    // **SECURITY FIX: Check for authenticated user**
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Você precisa estar logado para criar uma receita.' }, { status: 401 });
    }

    // Validate input using Zod
    const validation = recipeRequestSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ error: validation.error.issues[0].message }, { status: 400 });
    }

    const { ingredients } = validation.data;

    const systemPrompt = `
      You are a world-class culinary expert assistant named "Cebola & Alho". Your tone is that of a "Friendly Chef": warm, inspiring, and accessible.
      Your main task is to create a delicious and practical recipe based on the user's ingredients: "${ingredients}".
      You must return the response exclusively in a valid JSON object, following the specified schema.
      Do not include any introductory text like "Here is the recipe". Just the JSON.
      The recipe should be creative but achievable for a home cook.
      Ensure all fields are filled appropriately.
      \`prep_time\` is the preparation time in minutes.
      \`cook_time\` is the cooking time in minutes.
      Servings should be a string like "2-3 pessoas".
      The JSON schema is:
      {
        "title": "string",
        "description": "string",
        "prep_time": "number (in minutes)",
        "cook_time": "number (in minutes)",
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
    const slug = slugify(recipeData.title, { lower: true, strict: true });

    // **SECURITY & SCHEMA FIX: Use admin client for insertion**
    const { data: newRecipe, error } = await supabaseAdmin
      .from('recipes')
      .insert([
        {
          title: recipeData.title,
          description: recipeData.description,
          prep_time: recipeData.prep_time,
          cook_time: recipeData.cook_time,
          servings: recipeData.servings,
          ingredients: recipeData.ingredients,
          instructions: recipeData.instructions,
          tips: recipeData.tips,
          slug,
          author_id: user.id, // Use authenticated user's ID
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