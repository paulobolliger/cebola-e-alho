import { createClient } from '@supabase/supabase-js'
import { Post } from '../../types/post'

// usa lib/supabaseClient.ts se já existir; aqui exemplo standalone
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function getPublishedPosts(limit = 10, offset = 0): Promise<Post[]> {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('published', true)
    .order('published_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) throw error;
  return data as Post[];
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', slug)
    .limit(1)
    .single();

  if (error) {
    if ((error as any).status === 406 || (error as any).status === 404) return null;
    throw error;
  }
  return data as Post;
}

export async function searchPostsByKeyword(q: string, limit = 10) {
  // se tiver search_vector, use full text search; caso contrário, simples ilike
  const { data, error } = await supabase
    .from('posts')
    .select('id, title, excerpt, slug, image_url, category')
    .ilike('title', `%${q}%`)
    .or(`content.ilike.%${q}%`)
    .limit(limit);
  if (error) throw error;
  return data as Partial<Post>[];
}
