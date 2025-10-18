// types/recipes.ts

export type IngredientItem = {
  item: string;
  quantity: string;
};

export type InstructionStep = {
  step: number;
  description: string;
};

// Tipo principal da Receita (Lido do Supabase)
export type Recipe = {
  id: string;
  title: string;
  slug: string;
  description: string; 
  
  // JSONB - Usaremos estes no frontend
  ingredients_json: IngredientItem[];
  instructions_json: InstructionStep[];
  
  // Campos de Imagem e AI
  image_url: string; 
  image_public_id: string;
  image_prompt: string;
  ai_model: string; 
  image_ai_model: string;

  // Campos de metadados
  prep_time: number; // Agora como number
  cook_time: number; // Agora como number
  servings: string;
  difficulty: 'Fácil' | 'Média' | 'Difícil';
  cuisine: string;
  calories: number; 
  tags: string[];

  // Campos de Autor e Status
  author_id: string; // Chave estrangeira para a próxima etapa (Parte D)
  source: 'user' | 'editorial';
  status: 'draft' | 'published' | 'blocked';
  average_rating: number;
  rating_count: number;

  created_at: string;
  updated_at: string;

  // Manter campos antigos que o banco ainda pode ter (para segurança)
  ingredients?: string[]; // array antigo
  instructions?: string; // string html antiga
  images?: { url: string; alt?: string }[]; // array de imagens antigo
  excerpt?: string; // Sinônimo de description no seu código
};

// Tipo para exibição no Card (simplificado)
export type RecipeForCard = {
  id: string;
  title: string;
  slug: string;
  description?: string; 
  
  // Campos atualizados para o card
  image_url: string;
  ingredients_json: IngredientItem[]; 
  
  prep_time: number;
  difficulty: 'Fácil' | 'Média' | 'Difícil';
  average_rating: number;
  rating_count: number;
};