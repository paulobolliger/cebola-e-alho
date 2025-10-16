// components/BlogCard.tsx
import Link from "next/link";
import Image from "next/image";
import { Post } from "@/types"; // Caminho corrigido

type BlogCardProps = {
  post: Post;
};

const BlogCard = ({ post }: BlogCardProps) => {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="block bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
    >
      <div className="relative h-48 w-full">
        <Image
          src={post.image_url || "/blog-card.png"}
          alt={`Imagem do post ${post.title}`}
          layout="fill"
          objectFit="cover"
        />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
          {post.title}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 line-clamp-3">
          {post.description}
        </p>
      </div>
    </Link>
  );
};

export default BlogCard;