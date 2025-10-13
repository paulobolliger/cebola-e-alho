import React from 'react';
import { getPostBySlug } from '@/lib/api/posts';

interface Props { params: { slug: string } }

export default async function PostPage({ params }: Props) {
  const post = await getPostBySlug(params.slug);
  if (!post) return <div>Post não encontrado</div>;

  return (
    <article className="prose max-w-none">
      <h1>{post.title}</h1>
      <p className="text-sm text-gray-500">{post.published_at}</p>
      <div dangerouslySetInnerHTML={{ __html: post.content || '' }} />
    </article>
  );
}
