import Image from 'next/image';
import Link from 'next/link';
import MobileMenu from './MobileMenu';

export default function Header() {
  return (
    <header className="bg-surface sticky top-0 z-50 border-b-2 border-primary/20 shadow-sm backdrop-blur-sm bg-surface/95">
      <div className="container mx-auto">
        {/* Top Bar - Opcional: Badge promocional */}
        <div className="bg-gradient-fire py-2 text-center">
          <p className="text-white text-sm font-display font-bold">
            ✨ Novo: Gere receitas ilimitadas com nossa IA! <span className="animate-pulse">🔥</span>
          </p>
        </div>

        {/* Main Header */}
        <div className="flex justify-between items-center h-24 px-4">
          {/* Logo + Nome */}
          <Link href="/" className="flex items-center gap-3 group transition-all hover:scale-105">
            <div className="relative h-22 w-22">
              <Image
                src="https://res.cloudinary.com/dhqvjxgue/image/upload/v1760212377/logo-ceboela-e-alho-2_nawzzg.png"
                alt="Cebola & Alho"
                fill
                sizes="88px"
                priority={true}
                className="object-contain drop-shadow-lg"
              />
              {/* Efeito de brilho no hover */}
              <div className="absolute inset-0 bg-accent/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
            <div className="hidden sm:block">
              <h1 className="font-display font-black text-xl text-text-primary leading-none">
                Cebola & Alho
              </h1>
              <p className="text-xs text-text-secondary font-body">
                Receitas por IA
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {[
              { href: '/', label: 'Gerador IA', icon: '🤖', highlight: true },
              { href: '/recipes', label: 'Receitas', icon: '📚' },
              { href: '/blog', label: 'Blog', icon: '✍️' },
              { href: '/about', label: 'Sobre', icon: '👋' },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-lg font-display font-semibold text-sm
                  transition-all hover:scale-105
                  ${link.highlight 
                    ? 'bg-primary text-white shadow-fire hover:bg-primary/90' 
                    : 'text-text-secondary hover:text-primary hover:bg-primary/5'
                  }
                `}
              >
                <span>{link.icon}</span>
                <span>{link.label}</span>
              </Link>
            ))}
          </nav>

          {/* CTA Button - Desktop */}
          <div className="hidden md:block">
            <Link
              href="/#gerador"
              className="bg-accent text-text-primary font-display font-bold px-6 py-3 rounded-lg hover:scale-105 transition-transform shadow-md"
            >
              🔥 Criar Receita
            </Link>
          </div>

          {/* Mobile Menu */}
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}