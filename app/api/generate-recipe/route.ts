// app/api/generate-recipe/route.ts

// Ações:
// 1. Geração de Receita: gpt-5-mini (texto)
// 2. Geração de Imagem: gpt-image-1-mini (visual)
// 3. Upload: Cloudinary
// 4. Persistência: Supabase (JSONB + URL)

import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { z } from 'zod';
<<<<<<< Updated upstream
import fs from 'fs';
import path from 'path';
=======
>>>>>>> Stashed changes
import slugify from 'slugify';
import { createSupabaseClient } from '@/lib/supabaseClient'; // Usa a lib existente
import { uploadImageToCloudinary } from '@/lib/cloudinary'; // Nova lib
import { createRealisticImagePrompt } from '@/lib/image-prompt'; // Nova lib

// Inicializa clientes
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const DEFAULT_AUTHOR_ID = 'd9b73b5e-9a9c-4c7b-9d4a-1e3f8c2b0e1a'; // Food Guru ID

<<<<<<< Updated upstream
// Zod schema for input validation
=======
// Zod schema para validação de entrada (agora aceita userId e isEditorial)
>>>>>>> Stashed changes
const recipeRequestSchema = z.object({
  ingredients: z.string().min(3, 'Os ingredientes devem ter pelo menos 3 caracteres.'),
  authorId: z.string().uuid().optional(), // ID do usuário autenticado, se houver
  isEditorial: z.boolean().default(false).optional(), // Para receitas de Python/Admin
});

// Estrutura de saída do JSON (Mapeada para os campos da tabela recipes)
interface RecipeData {
  title: string;
  description: string;
<<<<<<< Updated upstream
  prep_time: number;
  cook_time: number;
=======
  prep_time: number; // INTEGER
  cook_time: number; // INTEGER
>>>>>>> Stashed changes
  servings: string;
  difficulty: 'Fácil' | 'Média' | 'Difícil';
  cuisine: string;
  calories: number; // INTEGER
  tags: string[]; // TEXT[]
  ingredients: { item: string; quantity: string }[]; // JSONB -> ingredients_json
  instructions: { step: number; description: string }[]; // JSONB -> instructions_json
}

<<<<<<< Updated upstream
// Function to format the recipe data into a Markdown string
function formatRecipeToMarkdown(recipe: RecipeData): string {
  let markdown = `# ${recipe.title}\n\n`;
  markdown += `${recipe.description}\n\n`;
  markdown += `**Tempo de Preparo:** ${recipe.prep_time} minutos\n`;
  markdown += `**Tempo de Cozimento:** ${recipe.cook_time} minutos\n`;
  markdown += `**Rendimento:** ${recipe.servings}\n\n`;

  markdown += `## Ingredientes\n`;
  recipe.ingredients.forEach(ing => {
    markdown += `- **${ing.quantity}** ${ing.item}\n`;
  });
  markdown += `\n`;

  markdown += `## Instruções\n`;
  recipe.instructions.forEach(inst => {
    markdown += `${inst.step}. ${inst.description}\n`;
  });
  markdown += `\n`;

  if (recipe.tips && recipe.tips.length > 0) {
    markdown += `## Dicas do Chef\n`;
    recipe.tips.forEach(tip => {
      markdown += `- ${tip}\n`;
    });
  }

  return markdown;
}
=======
// System Prompt otimizado para extração de JSON com mais metadados
const SYSTEM_PROMPT = `
  You are a world-class culinary expert assistant named "Cebola & Alho". Your tone is that of a "Friendly Chef": warm, inspiring, and accessible.
  Your main task is to create a complete, delicious, and practical recipe based on the user's ingredients.
  You MUST return the response exclusively in a valid JSON object, following the specified schema exactly.
  Do not include any introductory text like "Here is the recipe".
  Ensure 'prep_time', 'cook_time' and 'calories' are numbers (in minutes/kcal).
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
>>>>>>> Stashed changes


export async function POST(request: Request) {
  try {
    const body = await request.json();
<<<<<<< Updated upstream

    // Validate input using Zod
=======
    const supabase = createSupabaseClient(); 
>>>>>>> Stashed changes
    const validation = recipeRequestSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ error: validation.error.issues[0].message }, { status: 400 });
    }

<<<<<<< Updated upstream
    const { ingredients } = validation.data;

    const systemPrompt = `
      You are a world-class culinary expert assistant named "Cebola & Alho". Your tone is that of a "Friendly Chef": warm, inspiring, and accessible.
      Your main task is to create a delicious and practical recipe based on the user's ingredients: "${ingredients}".
      You must return the response exclusively in a valid JSON object, following the specified schema.
      Do not include any introductory text.
      The JSON schema is:
      {
        "title": "string",
        "description": "string",
        "prep_time": "number (in minutes)",
        "cook_time": "number (in minutes)",
        "servings": "string",
        "ingredients": [{"item": "string", "quantity": "string"}],
        "instructions": [{"step": "number", "description": "string"}],
        "tips": ["string"]
      }
    `;

    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'system', content: systemPrompt }],
=======
    const { ingredients, authorId: inputAuthorId, isEditorial } = validation.data;
    const modelUsed = 'gpt-5-mini';
    const imageModelUsed = 'gpt-image-1-mini';
    
    // 1. Geração da Receita (GPT-5-mini - o texto)
    const recipeResponse = await openai.chat.completions.create({
      model: modelUsed, 
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: `Crie uma receita usando os seguintes ingredientes: ${ingredients}` }
      ],
>>>>>>> Stashed changes
      temperature: 0.7,
      response_format: { type: 'json_object' },
      max_tokens: 1500, 
    });

    const content = recipeResponse.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No recipe content received from OpenAI');
    }

    const recipeData: RecipeData = JSON.parse(content);
<<<<<<< Updated upstream

    // --- Save recipe to local file ---
    const slug = slugify(recipeData.title, { lower: true, strict: true });
    const dirPath = path.join(process.cwd(), 'receitas-geradas');
    const filePath = path.join(dirPath, `${slug}.json`);

    // Ensure directory exists
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    // Write the JSON file
    fs.writeFileSync(filePath, JSON.stringify(recipeData, null, 2));

    // --- Format recipe to Markdown for frontend ---
    const markdownRecipe = formatRecipeToMarkdown(recipeData);

    // Return the formatted recipe to be displayed on the page
    return NextResponse.json({ recipe: markdownRecipe }, { status: 200 });
=======
    const slug = slugify(recipeData.title, { lower: true, strict: true });
    
    // 2. Geração do Prompt de Imagem (baseado na receita)
    const { prompt: imagePrompt } = createRealisticImagePrompt(
      recipeData.title,
      recipeData.ingredients.map(i => i.item)
    );

    // 3. Geração da Imagem (GPT-image-1-mini - a imagem realista)
    const imageResponse = await openai.images.generate({
      model: imageModelUsed, 
      prompt: imagePrompt,
      n: 1,
      size: '1024x768', // Formato 4:3 confirmado
      response_format: 'b64_json', // Para upload direto
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
      ingredients_json: recipeData.ingredients, 
      instructions_json: recipeData.instructions, 
      // Campos de Imagem e AI
      image_url: cloudinaryResult.url,
      image_public_id: cloudinaryResult.publicId,
      image_prompt: imagePrompt,
      ai_model: modelUsed,
      image_ai_model: imageModelUsed,
      source: source,
      status: 'published',
      // Campos legados (para compatibilidade com o RecipeCard atual)
      image: cloudinaryResult.url, 
      published: true,
      // Adicionando um array simples de ingredientes (opcional, para compatibilidade)
      ingredients: recipeData.ingredients.map(i => `${i.quantity} ${i.item}`), 
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // 6. Salvamento no Supabase
    const { data: newRecipe, error } = await supabase
      .from('recipes')
      .insert([recipeToSave])
      .select('slug, image_url') // Retorna o slug e a URL para o frontend
      .single();

    if (error) {
      console.error('Supabase error:', error);
      throw new Error(`Failed to save recipe to database: ${error.message}`);
    }

    // Retorno final para o cliente
    return NextResponse.json({ slug: newRecipe.slug, imageUrl: newRecipe.image_url }, { status: 201 });
>>>>>>> Stashed changes

  } catch (error) {
    console.error('API Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    return NextResponse.json({ error: 'Failed to generate recipe.', details: errorMessage }, { status: 500 });
  }
}