import Link from 'next/link';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-brand-charcoal text-brand-light-gray">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left">
          <div className="mb-4 md:mb-0">
            <h3 className="font-display font-bold text-xl mb-2">
              Cebola & Alho
            </h3>
            <p className="text-sm max-w-sm">
              Sua despensa, infinitas receitas. Geradas por IA para transformar
              sua cozinha.
            </p>
          </div>
          <div className="flex flex-col md:flex-row items-center">
            <nav className="mb-4 md:mb-0 md:mr-8">
              <ul className="flex space-x-6">
                <li>
                  <Link
                    href="/about"
                    className="text-sm hover:text-brand-secondary transition-colors duration-300"
                  >
                    Sobre
                  </Link>
                </li>
                <li>
                  <Link
                    href="/blog"
                    className="text-sm hover:text-brand-secondary transition-colors duration-300"
                  >
                    Blog
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy-policy"
                    className="text-sm hover:text-brand-secondary transition-colors duration-300"
                  >
                    Privacidade
                  </Link>
                </li>
              </ul>
            </nav>
            {/* Social media icons can be added here in the future */}
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm">
          <p>
            &copy; {currentYear} Cebola & Alho. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;