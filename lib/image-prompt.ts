// lib/image-prompt.ts

// Prompt negativo padrão para evitar imagens de baixa qualidade, digitais ou abstratas
const NEGATIVE_PROMPT =
  'Low quality, ugly, blurry, deformed, cartoon, sketch, painting, digital art, 3d render, watermark, text, out of frame, out of focus, unrealistic colors, food not cooked, bad lighting, dirty kitchen';

/**
 * Cria um prompt de imagem otimizado para foto-realismo de pratos de comida.
 * @param recipeTitle Título da receita (ex: "Macarrão à Bolonhesa")
 * @param mainIngredients Lista dos ingredientes principais
 * @returns Um objeto com o prompt e o prompt negativo.
 */
export function createRealisticImagePrompt(
  recipeTitle: string,
  mainIngredients: string[]
): { prompt: string; negativePrompt: string } {
  // Pega os 4 primeiros ingredientes para dar foco à imagem
  const focusIngredients = mainIngredients.slice(0, 4).join(', ');

  const visualPrompt = `
    Foco na comida: Fotografia de prato individual gourmet de "${recipeTitle}". 
    O prato principal deve estar no centro, com os ingredientes em destaque: ${focusIngredients}.
    Cenário: Mesa de cozinha moderna ou rústica, luz natural suave (como a de uma janela), 
    close-up, alta resolução 8K, fotorrealista, estilo de fotografia de comida de revista, com profundidade de campo rasa. 
    O prato deve parecer apetitoso e recém-preparado.
  `.trim().replace(/\s+/g, ' '); // Limpa espaços extras

  return {
    prompt: visualPrompt,
    negativePrompt: NEGATIVE_PROMPT,
  };
}