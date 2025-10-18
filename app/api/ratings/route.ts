// app/api/ratings/route.ts
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

const ratingSchema = z.object({
  recipe_id: z.string().uuid(),
  rating: z.number().min(1).max(5),
});

export async function POST(request: Request) {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const body = await request.json();
    const validation = ratingSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ error: validation.error.format() }, { status: 400 });
    }

    const { recipe_id, rating } = validation.data;
    const author_id = user.id;

    const { data, error } = await supabase
      .from('ratings')
      .upsert(
        {
          recipe_id,
          author_id,
          rating,
        },
        {
          onConflict: 'recipe_id,author_id',
        }
      )
      .select()
      .single();

    if (error) {
      console.error('Supabase ratings error:', error);
      return NextResponse.json({ error: 'Failed to save rating.', details: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Rating submitted successfully', data }, { status: 201 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    return NextResponse.json({ error: 'An unexpected error occurred.', details: errorMessage }, { status: 500 });
  }
}