import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { z } from 'zod';
import fs from 'fs';
import path from 'path';
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
  instructions: { step: number; description: string }[];
  tips: string[];
}

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


export async function POST(request: Request) {
  try {
    const body = await request.json();

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
      temperature: 0.7,
      response_format: { type: 'json_object' },
    });

    const content = response.choices[0]?.message?.content;

    if (!content) {
      throw new Error('No content received from OpenAI');
    }

    const recipeData: RecipeData = JSON.parse(content);

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

  } catch (error) {
    console.error('API Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    return NextResponse.json({ error: 'Failed to generate recipe.', details: errorMessage }, { status: 500 });
  }
}