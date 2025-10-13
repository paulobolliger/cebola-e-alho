export type ImageObj = {
  url: string;
  alt?: string;
  source?: string;
};

export type Post = {
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  content?: string | null;
  image_url?: string | null;
  images?: ImageObj[] | null;
  meta_title?: string | null;
  meta_description?: string | null;
  keywords?: string | null;
  shopping_list?: any; // json
  infograph?: any; // json
  category?: string | null;
  published: boolean;
  published_at?: string | null;
  created_at?: string | null;
};
