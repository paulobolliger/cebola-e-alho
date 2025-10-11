// app/api/generate-recipe/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient' // Uso do Path Alias "@" e do cliente Supabase
import { v4 as uuidv4 } from 'uuid'

// 1. Tipagem da estrutura de dados esperada no corpo da requisição
interface RequestBody {
  ingredients: string // Ingredientes digitados pelo usuário
}

// 2. Tipagem da Receita (para consistência)
interface RecipeResponse {
  id: string;
  title: string;
  image: string;
  slug: string;
}

// MOCK: Simulação da IA gerando uma resposta com base nos ingredientes
const MOCK_AI_RESPONSE = (ingredients: string): RecipeResponse => {
  const baseTitle = ingredients.split(',')[0] || 'Cebola e Alho'
  const title = `Sugestão da IA: ${baseTitle} ao molho de pimenta.`
  const slug = title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '')

  return {
    id: uuidv4(),
    title: title,
    image: '/recipe-card.png',
    slug: slug
  }
}

// 3. Handler da Rota POST (obrigatório para lógica de envio de dados)
export async function POST(request: NextRequest) {
  try {
    const { ingredients }: RequestBody = await request.json()

    if (!ingredients || ingredients.trim() === '') {
      return NextResponse.json(
        { message: "Por favor, forneça ingredientes válidos." }, 
        { status: 400 }
      )
    }

    // SIMULAÇÃO DA LÓGICA CORE:
    // 4. Chamada à IA (MOCK)
    const recipeResult = MOCK_AI_RESPONSE(ingredients)
    
    // 5. Inserção no Supabase (MOCK - Descomentar em produção)
    /*
    const { data, error } = await supabase
      .from('recipes')
      .insert({ 
        slug: recipeResult.slug, 
        title: recipeResult.title, 
        // outros campos de receita (ingredientes, instruções, etc.)
      })
      .select()

    if (error) {
        // Logar o erro do banco de dados (prática sênior)
        console.error("Erro ao inserir receita no Supabase:", error.message);
        return NextResponse.json({ message: "Erro interno do servidor." }, { status: 500 });
    }
    */

    // 6. Retorno de sucesso (direcionando o cliente para a nova receita)
    return NextResponse.json(
      { 
        message: "Receita gerada com sucesso!", 
        slug: recipeResult.slug 
      }, 
      { status: 200 }
    )

  } catch (error) {
    // 7. Tratamento de erro robusto
    console.error("Erro na API de Geração de Receita:", error)
    return NextResponse.json(
      { message: "Erro interno do servidor." }, 
      { status: 500 }
    )
  }
}