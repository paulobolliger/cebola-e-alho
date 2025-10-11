import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { z } from 'zod';

// Initialize OpenAI client with the API key from environment variables
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Define a schema for input validation using Zod
const recipeRequestSchema = z.object({
  ingredients: z.string().min(3, 'Os ingredientes devem ter pelo menos 3 caracteres.'),
});

export async function POST(req: NextRequest) {
  // 1. Securely get the API Key
  if (!process.env.OPENAI_API_KEY) {
    console.error('OPENAI_API_KEY is not set.');
    return NextResponse.json(
      { error: 'A configuração do servidor está incompleta.' },
      { status: 500 },
    );
  }

  try {
    const body = await req.json();

    // 2. Validate the input
    const validationResult = recipeRequestSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Entrada inválida.', details: validationResult.error.errors },
        { status: 400 },
      );
    }
    const { ingredients } = validationResult.data;

    // 3. Enhanced Prompt Engineering
    const prompt = `
      Você é um assistente culinário chamado "Cebola & Alho". Seu tom é de um "Chef Amigo": caloroso, acessível e inspirador.
      Sua tarefa é criar uma receita deliciosa e simples usando principalmente os seguintes ingredientes: ${ingredients}.
      Você pode adicionar ingredientes básicos como sal, pimenta, azeite, água, etc., se necessário.

      Por favor, estruture sua resposta usando Markdown da seguinte forma:

      # [Nome Criativo e Saboroso para a Receita]

      ## Ingredientes
      - [Ingrediente 1 da lista fornecida]
      - [Ingrediente 2 da lista fornecida]
      - [Etc.]
      - [Qualquer ingrediente básico que você adicionou]

      ## Modo de Preparo
      1. [Primeiro passo, claro e direto]
      2. [Segundo passo]
      3. [Continue com os passos necessários]

      ## Dica do Chef
      - [Uma dica ou sugestão para variar o prato ou uma técnica especial]
    `;

    // 4. Call the OpenAI API
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 500,
    });

    const recipe = completion.choices[0]?.message?.content?.trim() ?? '';

    if (!recipe) {
      throw new Error('A IA não retornou uma receita.');
    }

    return NextResponse.json({ recipe });
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    return NextResponse.json(
      { error: 'Não foi possível gerar a receita no momento.' },
      { status: 500 },
    );
  }
}