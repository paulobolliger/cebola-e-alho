import Image from 'next/image'
import Link from 'next/link'

// 1. Tipagem das Props com o novo campo slug
interface BlogCardProps {
  title: string
  excerpt: string
  image: string
  slug: string // Novo campo
}

export default function BlogCard({ title, excerpt, image, slug }: BlogCardProps) {
  // 2. Remove a geração de slug desnecessária e usa o slug do banco
  
  return (
    // 3. Link usa o slug fornecido
    <Link href={`/blog/${slug}`} className="block">
      <div className="bg-background-light rounded-lg shadow-lg overflow-hidden transition-shadow duration-300 hover:shadow-2xl hover:scale-[1.02] transform">
        {/* Uso de Next/Image para Performance */}
        <div className="relative w-full h-40">
          {image && (
            <Image
              src={image}
              alt={`Imagem de capa do post: ${title}`}
              layout="fill"
              objectFit="cover"
            />
          )}
        </div>
        <div className="p-4">
          {/* Título como h3, Fonte Display e Cor Base */}
          <h3 className="font-display font-bold text-xl text-text-base mb-2 truncate">
            {title}
          </h3>
          {/* Excerto com Fonte Corpo e Cor Base Suave */}
          <p className="text-gray-600 text-sm mb-2 font-body leading-relaxed">
            {excerpt}
          </p>
          {/* CTA com Cor Primária (Vermelho Fogo) para Paixão */}
          <span className="text-primary font-display font-semibold hover:text-secondary transition">
            Leia mais →
          </span>
        </div>
      </div>
    </Link>
  )
}