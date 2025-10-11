import Image from 'next/image'
import Link from 'next/link'

export default function Header() {
  return (
    // 1. Fundo com cor Primária, texto branco e sombra
    <header className="bg-primary text-white p-4 shadow-xl">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-3 transition hover:opacity-90">
          {/* 2. Logo da Chama Orgânica Estilizada */}
          <Image
            src="https://res.cloudinary.com/dhqvjxgue/image/upload/v1760212377/logo-ceboela-e-alho_qqrbpw.png"
            alt="Cebola & Alho - Chama Orgânica"
            width={40}
            height={40}
            priority={true} // Prioridade no LCP
          />
          {/* 3. Título Principal com Fonte de Display */}
          <h1 className="text-3xl font-display font-black tracking-tight">Cebola & Alho</h1>
        </Link>

        {/* 4. Links de Navegação com Fonte de Corpo */}
        <nav className="font-body space-x-6 text-lg">
          {/* CORREÇÃO: Uso de Link para navegação interna */}
          <Link href="/" className="hover:text-accent transition duration-200">
            Home
          </Link>
          <Link href="/blog" className="hover:text-accent transition duration-200">
            Blog
          </Link>
          <Link href="/about" className="hover:text-accent transition duration-200">
            Sobre
          </Link>
        </nav>
      </div>
    </header>
  )
}