// app/api/generate-recipe/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { serverSupabase } from '@/lib/supabaseClient' // 1. Uso do cliente Server-Side
import { OpenAI } from 'openai' // 2. Importação do SDK da OpenAI
import { v4 as uuidv4 } from 'uuid'

// 3. Inicialização do Cliente OpenAI (Apenas no Servidor)
const openai = new OpenAI() 

// Tipagem da estrutura de dados esperada no corpo da requisição
interface RequestBody {
  ingredients: string 
}

// 4. Tipagem da Receita (Estrutura de retorno da IA)
interface RecipeResponse {
  id: string;
  title: string;
  image: string;
  slug: string;
  description: string;
  ingredients: string; // Lista de ingredientes formatada
  instructions: string; // Passos formatados
}

// Handler da Rota POST
export async function POST(request: NextRequest) {
  try {
    const { ingredients }: RequestBody = await request.json()

    if (!ingredients || ingredients.trim() === '') {
      return NextResponse.json(
        { message: "Por favor, forneça ingredientes válidos para a IA." }, 
        { status: 400 }
      )
    }

    // --- 5. CHAMADA À API DA OPENAI ---
    const prompt = `Gere uma receita criativa e apetitosa usando os seguintes ingredientes: "${ingredients}". O tom deve ser de um "Cientista de Dados Gourmet" e "Chef Amigo". O retorno deve ser ESTRITAMENTE em JSON no formato { "title": "...", "description": "...", "ingredients": "item 1, item 2...", "instructions": "passo 1, passo 2..." }.`

    const aiResponse = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" }, // Força o retorno JSON
      temperature: 0.7, 
    });

    const aiDataString = aiResponse.choices[0].message.content;
    
    if (!aiDataString) {
        throw new Error("A IA não conseguiu gerar uma resposta válida.");
    }
    
    // Parse da resposta e adição de campos do sistema
    const recipeData: Omit<RecipeResponse, 'id' | 'image' | 'slug'> = JSON.parse(aiDataString);
    
    const title = recipeData.title;
    const slug = title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '')

    const finalRecipe = {
        id: uuidv4(),
        title: title,
        slug: slug,
        image: '/recipe-card.png', // Mock de imagem
        ...recipeData
    }

    // --- 6. INSERÇÃO NO SUPABASE ---
    // Insere todos os dados gerados pela IA no banco de dados
    const { error } = await serverSupabase
      .from('recipes') // Tabela que deve ser criada no Supabase
      .insert({ 
        id: finalRecipe.id,
        slug: finalRecipe.slug, 
        title: finalRecipe.title, 
        description: finalRecipe.description,
        // É recomendável que 'ingredients' e 'instructions' sejam JSONB arrays no Supabase
        // Para simplificar, vou manter a string, mas isso é um ponto de melhoria futuro.
        ingredients_string: finalRecipe.ingredients, 
        instructions_string: finalRecipe.instructions,
      })
      .select()

    if (error) {
        // Erro de banco de dados
        console.error("Erro ao inserir receita no Supabase:", error.message);
        return NextResponse.json({ message: "Erro ao salvar a receita. Tente novamente." }, { status: 500 });
    }
    
    // 7. Retorno de sucesso
    return NextResponse.json(
      { 
        message: "Receita gerada e salva com sucesso!", 
        slug: finalRecipe.slug 
      }, 
      { status: 200 }
    )

  } catch (error) {
    // 8. Tratamento de erro robusto (incluindo erros da OpenAI)
    console.error("Erro fatal na API de Geração de Receita:", error)
    const errorMessage = error instanceof Error ? error.message : "Erro interno do servidor."

    return NextResponse.json(
      { 
        message: `O Chef IA falhou ao criar a receita. ${errorMessage}`
      }, 
      { status: 500 }
    )
  }
}