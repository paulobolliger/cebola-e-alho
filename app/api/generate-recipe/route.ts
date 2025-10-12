import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { z } from 'zod';

// 1. Inicializa o cliente da OpenAI com a chave do .env
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// 2. Define um esquema para validar a entrada
const recipeRequestSchema = z.object({
  ingredients: z.string().min(3, 'Os ingredientes devem ter pelo menos 3 caracteres.'),
});

export async function POST(req: NextRequest) {
  // Valida se a chave da API existe no ambiente
  if (!process.env.OPENAI_API_KEY) {
    console.error('OPENAI_API_KEY is not set.');
    return NextResponse.json(
      { error: 'A configuração do servidor está incompleta para gerar receitas.' },
      { status: 500 },
    );
  }

  try {
    const body = await req.json();

    // 3. Valida os dados recebidos do frontend
    const validationResult = recipeRequestSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Entrada inválida.', details: validationResult.error.errors },
        { status: 400 },
      );
    }
    const { ingredients } = validationResult.data;

    // 4. Cria um prompt detalhado para a IA (Prompt Engineering)
    const prompt = `
      Você é um assistente culinário especialista chamado "Cebola & Alho". Seu tom de voz é o de um "Chef Amigo": caloroso, acessível e inspirador.
      Sua principal tarefa é criar uma receita deliciosa e prática usando principalmente os seguintes ingredientes: ${ingredients}.
      Você pode adicionar ingredientes básicos como sal, pimenta, azeite, água, etc., se julgar necessário.

      Por favor, estruture sua resposta **exclusivamente em Markdown** da seguinte forma:

      # [Nome Criativo e Saboroso para a Receita]

      ## Ingredientes
      - [Ingrediente 1]
      - [Ingrediente 2]
      - [Etc...]

      ## Modo de Preparo
      1. [Primeiro passo, claro e direto]
      2. [Segundo passo]
      3. [Continue com os passos necessários]

      ## Dica do Chef
      - [Ofereça uma dica ou sugestão para variar o prato, uma técnica especial ou uma sugestão de harmonização]
    `;

    // 5. Chama a API da OpenAI
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7, // Um pouco de criatividade
      max_tokens: 600,  // Espaço suficiente para uma boa receita
    });

    const recipe = completion.choices[0]?.message?.content?.trim() ?? '';

    if (!recipe) {
      throw new Error('A IA não retornou uma receita válida.');
    }

    return NextResponse.json({ recipe });
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    return NextResponse.json(
      { error: 'Não foi possível gerar a receita no momento. Tente novamente mais tarde.' },
      { status: 500 },
    );
  }
}