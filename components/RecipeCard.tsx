import Link from 'next/link';
import { Recipe } from '@/types/recipe';

export default function RecipeCard({ recipe }: { recipe: Recipe }) {
  return (
    <article className="bg-softWhite rounded-card shadow-card overflow-hidden hover:scale-105 transition-transform">
      <Link href={`/recipes/${recipe.slug}`}>
        <img
          src={recipe.images?.[0]?.url || '/recipe-card.png'}
          alt={recipe.images?.[0]?.alt || recipe.title}
          className="w-full h-48 object-cover"
        />
        <div className="p-4">
          <h3 className="text-deepPurple font-bold text-lg mb-2">{recipe.title}</h3>
          <p className="text-primaryGreen text-sm">{recipe.excerpt}</p>
        </div>
      </Link>
    </article>
  );
}
