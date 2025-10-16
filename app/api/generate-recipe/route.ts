import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { z } from 'zod';
import { createSupabaseClient } from '@/lib/supabaseClient';
import slugify from 'slugify';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Zod schema for input validation
const recipeRequestSchema = z.object({
  prompt: z.string().min(10, 'O tema da receita deve ter pelo menos 10 caracteres.'),
  category_id: z.string().uuid('ID de categoria inválido.'),
});

// Zod schema for AI output validation
const recipeResponseSchema = z.object({
  title: z.string(),
  excerpt: z.string(),
  content: z.string(),
  ingredients: z.array(z.string()),
  instructions: z.string(),
  prep_time: z.number(),
  cook_time: z.number(),
  servings: z.number(),
  meta_title: z.string(),
  meta_description: z.string(),
  keywords: z.array(z.string()),
});

export async function POST(req: NextRequest) {
  const supabase = createSupabaseClient();

  if (!process.env.OPENAI_API_KEY) {
    console.error('OPENAI_API_KEY is not set.');
    return NextResponse.json({ error: 'Configuration error.' }, { status: 500 });
  }

  try {
    const body = await req.json();
    const validation = recipeRequestSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ error: 'Invalid input.', details: validation.error.format() }, { status: 400 });
    }

    const { prompt, category_id } = validation.data;

    const systemPrompt = `
      You are a world-class culinary expert assistant named "Cebola & Alho". Your tone is that of a "Friendly Chef": warm, inspiring, and accessible.
      Your main task is to create a delicious and practical recipe based on the user's prompt: "${prompt}".
      You must return the response exclusively in a valid JSON object, following the specified schema.
      Do not include any markdown, comments, or extra text outside the JSON object.

      JSON Schema:
      {
        "title": "Creative and tasty name for the recipe",
        "excerpt": "A short, enticing summary of the recipe (max 150 characters).",
        "content": "A brief introductory text about the recipe, its origin, or a special tip. Use Markdown for formatting.",
        "ingredients": ["Ingredient 1", "Ingredient 2", "etc..."],
        "instructions": "Step-by-step preparation guide. Use Markdown with numbered lists.",
        "prep_time": "Preparation time in minutes (number only).",
        "cook_time": "Cooking time in minutes (number only).",
        "servings": "Number of servings the recipe yields (number only).",
        "meta_title": "SEO-optimized title (max 60 characters).",
        "meta_description": "SEO-optimized description (max 160 characters).",
        "keywords": ["keyword1", "keyword2", "keyword3"]
      }
    `;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo',
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Generate a recipe about: ${prompt}` },
      ],
      temperature: 0.8,
    });

    const recipeJson = JSON.parse(completion.choices[0]?.message?.content ?? '{}');
    const recipeValidation = recipeResponseSchema.safeParse(recipeJson);

    if (!recipeValidation.success) {
      console.error('AI response validation error:', recipeValidation.error.format());
      throw new Error('AI returned invalid recipe data.');
    }

    const recipeData = recipeValidation.data;
    const slug = slugify(recipeData.title, { lower: true, strict: true });

    const { data: newRecipe, error } = await supabase
      .from('recipes')
      .insert([
        {
          ...recipeData,
          slug,
          category_id,
          author_id: 'd9b73b5e-9a9c-4c7b-9d4a-1e3f8c2b0e1a', // Default author for now
          published_at: new Date().toISOString(),
          images: [{ url: '/recipe-card.png', alt: recipeData.title }],
        },
      ])
      .select('slug')
      .single();

    if (error) {
      console.error('Supabase insert error:', error);
      throw new Error('Could not save the new recipe to the database.');
    }

    return NextResponse.json({ slug: newRecipe.slug });

  } catch (error) {
    console.error('Error in generate-recipe route:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
    return NextResponse.json({ error: 'Failed to generate and save recipe.', details: errorMessage }, { status: 500 });
  }
}