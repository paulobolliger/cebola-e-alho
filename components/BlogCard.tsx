import Link from 'next/link';
import { Post } from '@/types/post';

export default function BlogCard({ post }: { post: Post }) {
  return (
    <article className="bg-softWhite rounded-card shadow-card overflow-hidden hover:scale-105 transition-transform">
      <Link href={`/blog/${post.slug}`}>
        <img
          src={post.images?.[0]?.url || '/blog-card.png'}
          alt={post.images?.[0]?.alt || post.title}
          className="w-full h-48 object-cover"
        />
        <div className="p-4">
          <h3 className="text-deepPurple font-bold text-lg mb-2">{post.title}</h3>
          <p className="text-primaryGreen text-sm">{post.excerpt}</p>
        </div>
      </Link>
    </article>
  );
}
