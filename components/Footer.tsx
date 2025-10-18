import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-text-primary text-background p-8">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
        {/* Coluna 1: Marca e Slogan */}
        <div className="flex flex-col items-center md:items-start">
          <div className="relative w-24 h-24 mb-4">
            <Image
              src="https://res.cloudinary.com/dhqvjxgue/image/upload/v1760213016/logo-ceboela-e-alho-2-removebg-preview_1_uwm5eu.png"
              alt="Cebola & Alho Logo"
              fill
              className="object-contain"
              sizes="96px"
            />
          </div>
          <h3 className="font-display font-bold text-2xl mb-2 text-white">
            Cebola & Alho
          </h3>
          <p className="text-sm">
            Sua despensa, infinitas receitas. Geradas por IA.
          </p>
        </div>

        {/* Coluna 2: Links de Navegação - CORREÇÃO: Ajustando links para a nova estrutura */}
        <div>
          <h4 className="font-display font-bold text-lg mb-3 text-white">Navegue</h4>
          <nav className="flex flex-col space-y-2 items-center md:items-start">
            <Link href="/" className="hover:text-accent transition-colors">
              Home (Gerador)
            </Link>
            <Link href="/recipes" className="hover:text-accent transition-colors">
              Receitas
            </Link>
            <Link href="/blog" className="hover:text-accent transition-colors">
              Blog
            </Link>
            <Link href="/about" className="hover:text-accent transition-colors">
              Sobre
            </Link>
            <Link href="/privacy-policy" className="hover:text-accent transition-colors">
              Política de Privacidade
            </Link>
          </nav>
        </div>

        {/* Coluna 3: Social (espaço reservado) */}
        <div>
          <h4 className="font-display font-bold text-lg mb-3 text-white">Siga-nos</h4>
          <p className="text-sm">
            {/* Ícones de redes sociais podem ser adicionados aqui no futuro */}
            Em breve!
          </p>
        </div>
      </div>

      {/* Linha de Direitos Autorais */}
      <div className="container mx-auto text-center border-t border-gray-700 mt-8 pt-6">
        <p className="text-sm">
          &copy; {currentYear} Cebola & Alho. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}