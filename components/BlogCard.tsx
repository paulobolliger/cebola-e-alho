import Link from 'next/link';
import Image from 'next/image';
import type { Post } from '@/types';

interface BlogCardProps {
  post: Post;
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

const BlogCard = ({ post }: BlogCardProps) => {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="block bg-brand-white rounded-lg shadow-md overflow-hidden group transition-transform transform hover:-translate-y-2"
    >
      <div className="relative h-48 w-full">
        <Image
          src={post.image_url || '/blog-card.png'}
          alt={`Imagem de capa do post: ${post.title}`}
          fill
          style={{ objectFit: 'cover' }}
          className="transition-transform duration-500 group-hover:scale-110"
        />
      </div>
      <div className="p-6">
        <p className="text-sm text-gray-500 mb-2">{formatDate(post.created_at)}</p>
        <h3 className="font-display font-bold text-xl text-brand-charcoal mb-3 group-hover:text-brand-primary transition-colors">
          {post.title}
        </h3>
        <p className="text-gray-600 text-sm leading-relaxed">
          {post.excerpt}
        </p>
      </div>
    </Link>
  );
};

export default BlogCard;