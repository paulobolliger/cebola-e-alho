import Image from 'next/image'
import Link from 'next/link'

// 1. Tipagem das Props
interface RecipeCardProps {
  title: string
  image: string
}

export default function RecipeCard({ title, image }: RecipeCardProps) {
  // Cria um slug simples para a URL, alinhado com as rotas do Next.js App Router
  const slug = title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '')

  return (
    // 2. Uso do Link para navegação otimizada
    <Link href={`/recipes/${slug}`} className="block">
      <div className="bg-background-light rounded-lg shadow-lg overflow-hidden transition-shadow duration-300 hover:shadow-2xl hover:scale-[1.02] transform">
        {/* 3. Uso de Next/Image para Performance */}
        <div className="relative w-full h-48">
          {image && (
            <Image
              src={image}
              alt={`Imagem da receita: ${title}`}
              layout="fill"
              objectFit="cover"
            />
          )}
        </div>
        <div className="p-4">
          {/* 4. Título com Fonte Display e Cor Principal */}
          <h3 className="font-display font-bold text-xl text-text-base mb-2 truncate">
            {title}
          </h3>
          {/* 5. Acento de Cor Secundaria no CTA */}
          <p className="text-secondary text-sm font-body font-semibold hover:underline transition">
            Clique para ver a receita completa.
          </p>
        </div>
      </div>
    </Link>
  )
}