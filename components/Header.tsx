import Image from 'next/image';
import Link from 'next/link';
import MobileMenu from './MobileMenu'; // Importando o novo componente

export default function Header() {
  return (
    <header className="bg-surface text-text-primary shadow-sm sticky top-0 z-50 border-b border-border">
      <div className="container mx-auto flex justify-between items-center p-4">
        <Link href="/" className="flex items-center space-x-3 transition hover:opacity-80">
          <Image
            src="https://res.cloudinary.com/dhqvjxgue/image/upload/v1760212377/logo-ceboela-e-alho-2_nawzzg.png"
            alt="Cebola & Alho - Logo"
            width={48}
            height={48}
            priority={true}
          />
        </Link>

        {/* Navegação para Desktop */}
        <nav className="hidden md:flex items-center space-x-8 text-md font-body text-text-secondary">
          <Link href="/" className="font-semibold text-primary hover:opacity-80 transition-colors">
            Gerador
          </Link>
          <Link href="/blog" className="hover:text-primary transition-colors">
            Blog
          </Link>
          <Link href="/about" className="hover:text-primary transition-colors">
            Sobre
          </Link>
        </nav>

        {/* Menu para Mobile */}
        <MobileMenu />
      </div>
    </header>
  );
}