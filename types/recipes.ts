export type Recipe = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  ingredients: string[];
  instructions: string;
  prep_time: number;
  cook_time: number;
  servings: number;
  images: { url: string; alt?: string }[];
  meta_title: string;
  meta_description: string;
  keywords: string[];
  published_at: string;
  author_id: string;
  category_id: string;
};

export type RecipeForCard = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  images: { url: string; alt?: string }[];
  ingredients: string[];
  prep_time?: number;
  difficulty?: 'Fácil' | 'Média' | 'Difícil';
  rating?: number;
  rating_count?: number;
  description?: string;
};