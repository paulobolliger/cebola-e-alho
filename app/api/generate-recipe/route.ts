// app/api/generate-recipe/route.ts

import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { z } from 'zod';
import slugify from 'slugify';
import { createSupabaseClient } from '@/lib/supabaseClient'; 
import { uploadImageToCloudinary } from '@/lib/cloudinary'; 
import { createRealisticImagePrompt } from '@/lib/image-prompt'; 
import { IngredientItem, InstructionStep } from '@/types/recipes'; // Importa os novos tipos

// Inicializa clientes
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
// Este ID deve ser de um autor 'Food Guru' na sua tabela 'authors'
const DEFAULT_AUTHOR_ID = 'd9b73b5e-9a9c-4c7b-9d4a-1e3f8c2b0e1a'; 

// Zod schema para validação de entrada
const recipeRequestSchema = z.object({
  ingredients: z.string().min(3, 'Os ingredientes devem ter pelo menos 3 caracteres.'),
  // authorId virá da sessão do usuário na Parte D
  authorId: z.string().uuid().optional(), 
  isEditorial: z.boolean().default(false).optional(),
});

// Estrutura de saída do JSON
interface RecipeData {
  title: string;
  description: string;
  prep_time: number; 
  cook_time: number; 
  servings: string;
  difficulty: 'Fácil' | 'Média' | 'Difícil';
  cuisine: string;
  calories: number; 
  tags: string[]; 
  ingredients: IngredientItem[]; // Usando o novo tipo
  instructions: InstructionStep[]; // Usando o novo tipo
}

const SYSTEM_PROMPT = `
  You are a world-class culinary expert assistant named "Cebola & Alho". Your tone is that of a "Friendly Chef": warm, inspiring, and accessible.
  Your main task is to create a complete, delicious, and practical recipe based on the user's ingredients.
  All generated text, including recipe titles, descriptions, and instructions, must be EXCLUSIVELY in Brazilian Portuguese (pt-BR).
  You MUST return the response exclusively in a valid JSON object, following the specified schema exactly.
  Do not include any introductory text like "Here is the recipe".
  Ensure 'prep_time', 'cook_time' and 'calories' are NUMBERS (in minutes/kcal).
  The recipe should be creative but achievable for a home cook.
  
  The JSON schema is:
  {
    "title": "string",
    "description": "string",
    "prep_time": "number",
    "cook_time": "number",
    "servings": "string (e.g., '4 porções')",
    "difficulty": "string ('Fácil', 'Média', 'Difícil')",
    "cuisine": "string (e.g., 'Brasileira', 'Italiana')",
    "calories": "number (estimate in kcal)",
    "tags": "string[] (max 5 tags relevant to the recipe)",
    "ingredients": [{"item": "string", "quantity": "string"}],
    "instructions": [{"step": "number", "description": "string"}]
  }
`;


export async function POST(request: Request) {
  try {
    const body = await request.json();
    // Usa o cliente de server component (lib/supabaseClient)
    const supabase = createSupabaseClient(); 
    const validation = recipeRequestSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ error: validation.error.issues[0].message }, { status: 400 });
    }

    const { ingredients, authorId: inputAuthorId, isEditorial } = validation.data;
    const modelUsed = 'gpt-5-mini';
    const imageModelUsed = 'gpt-image-1-mini';
    
    // 1. Geração da Receita (GPT-5-mini)
    const recipeResponse = await openai.chat.completions.create({
      model: modelUsed, 
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: `Crie uma receita usando os seguintes ingredientes: ${ingredients}` }
      ],
      temperature: 0.7,
      response_format: { type: 'json_object' },
      max_tokens: 1500, 
    });

    const content = recipeResponse.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No recipe content received from OpenAI');
    }

    const recipeData: RecipeData = JSON.parse(content);
    const slug = slugify(recipeData.title, { lower: true, strict: true });
    
    // 2. Geração do Prompt de Imagem
    const { prompt: imagePrompt } = createRealisticImagePrompt(
      recipeData.title,
      recipeData.ingredients.map(i => i.item)
    );

    // 3. Geração da Imagem (GPT-image-1-mini)
    const imageResponse = await openai.images.generate({
      model: imageModelUsed, 
      prompt: imagePrompt,
      n: 1,
      size: '1024x768', 
      response_format: 'b64_json', 
      style: 'vivid',
      quality: 'standard',
    });

    const base64Image = imageResponse.data[0]?.b64_json;
    if (!base64Image) {
      throw new Error('No image generated from OpenAI');
    }
    
    const imageBuffer = Buffer.from(base64Image, 'base64');
    
    // 4. Upload da Imagem no Cloudinary
    const cloudinaryResult = await uploadImageToCloudinary(imageBuffer, slug);

    // 5. Preparação dos Dados para o Supabase
    // Define o autor: se for usuário autenticado (inputAuthorId), usa ele; senão, usa o Food Guru
    const author_id = inputAuthorId || DEFAULT_AUTHOR_ID; 
    const source = isEditorial ? 'editorial' : 'user';

    const recipeToSave = {
      author_id,
      title: recipeData.title,
      description: recipeData.description,
      slug,
      prep_time: recipeData.prep_time,
      cook_time: recipeData.cook_time,
      servings: recipeData.servings,
      difficulty: recipeData.difficulty,
      cuisine: recipeData.cuisine,
      calories: recipeData.calories,
      tags: recipeData.tags,
      // Salva os objetos JSONB
      ingredients_json: recipeData.ingredients, 
      instructions_json: recipeData.instructions, 
      // Metadados da Imagem/AI
      image_url: cloudinaryResult.url,
      image_public_id: cloudinaryResult.publicId,
      image_prompt: imagePrompt,
      ai_model: modelUsed,
      image_ai_model: imageModelUsed,
      source: source,
      status: 'published',
      // Campos de compatibilidade (para evitar erros em componentes antigos antes da Parte C)
      image: cloudinaryResult.url, 
      published: true,
      ingredients: recipeData.ingredients.map(i => `${i.quantity} ${i.item}`), // Array simples para compatibilidade
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // 6. Salvamento no Supabase
    const { data: newRecipe, error } = await supabase
      .from('recipes')
      .insert([recipeToSave])
      .select('slug, image_url') 
      .single();

    if (error) {
      console.error('Supabase error:', error);
      // Inclui o slug para debug caso haja conflito de slug no banco
      throw new Error(`Failed to save recipe to database: ${error.message} (Slug: ${slug})`);
    }

    // Retorno final para o cliente para RE-DIRECIONAR
    return NextResponse.json({ slug: newRecipe.slug, imageUrl: newRecipe.image_url }, { status: 201 });

  } catch (error) {
    console.error('API Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    return NextResponse.json({ error: 'Failed to generate recipe.', details: errorMessage }, { status: 500 });
  }
}