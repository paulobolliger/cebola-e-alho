import Link from 'next/link';
import Image from 'next/image';

const Header = () => {
  return (
    <header className="bg-brand-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between p-4">
        <Link href="/" className="flex items-center space-x-2">
          <Image
            src="/logo.png"
            alt="Cebola & Alho Logo"
            width={40}
            height={40}
            className="rounded-full"
          />
          <span className="font-display font-bold text-2xl text-brand-charcoal">
            Cebola & Alho
          </span>
        </Link>
        <nav>
          <ul className="flex items-center space-x-6">
            <li>
              <Link
                href="/"
                className="font-display font-semibold text-brand-charcoal hover:text-brand-primary transition-colors duration-300"
              >
                Gerador de Receitas
              </Link>
            </li>
            <li>
              <Link
                href="/blog"
                className="font-display font-semibold text-brand-charcoal hover:text-brand-primary transition-colors duration-300"
              >
                Blog
              </Link>
            </li>
            <li>
              <Link
                href="/about"
                className="font-display font-semibold text-brand-charcoal hover:text-brand-primary transition-colors duration-300"
              >
                Sobre
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;