import Image from 'next/image'
import Link from 'next/link'

// 1. Tipagem das Props
interface BlogCardProps {
  title: string
  excerpt: string
  image: string
}

export default function BlogCard({ title, excerpt, image }: BlogCardProps) {
  // Cria um slug seguro para a URL
  const slug = title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '')

  return (
    // 2. Uso do Link para navegação interna otimizada
    <Link href={`/blog/${slug}`} className="block">
      <div className="bg-background-light rounded-lg shadow-lg overflow-hidden transition-shadow duration-300 hover:shadow-2xl hover:scale-[1.02] transform">
        {/* 3. Uso de Next/Image para Performance */}
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
          {/* 4. Título como h3, Fonte Display e Cor Base */}
          <h3 className="font-display font-bold text-xl text-text-base mb-2 truncate">
            {title}
          </h3>
          {/* 5. Excerto com Fonte Corpo e Cor Base Suave */}
          <p className="text-gray-600 text-sm mb-2 font-body leading-relaxed">
            {excerpt}
          </p>
          {/* 6. CTA com Cor Primária (Vermelho Fogo) para Paixão */}
          <span className="text-primary font-display font-semibold hover:text-secondary transition">
            Leia mais →
          </span>
        </div>
      </div>
    </Link>
  )
}