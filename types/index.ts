// types/index.ts
export interface Post {
  id: string;
  created_at: string;
  title: string;
  slug: string;
  excerpt: string;
  image_url?: string;
  content: string;
}

export interface Recipe {
  id: string;
  title: string;
  slug: string;
  image: string;
  description: string;
  ingredients_string: string;
  instructions_string: string;
}