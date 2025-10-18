export type Post = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  images: { url: string; alt?: string }[];
  meta_title: string;
  meta_description: string;
  keywords: string[];
  published_at: string;
  author_id: string;
  category_id: string;
};