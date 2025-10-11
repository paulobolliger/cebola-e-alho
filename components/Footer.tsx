export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    // 1. Fundo Preto Carvão e Margem automática (mt-auto) para Sticky Footer
    <footer className="bg-footer-bg text-gray-400 p-6 text-center mt-auto font-body">
      <div className="max-w-6xl mx-auto">
        <p className="mb-1">
          &copy; {currentYear} Cebola & Alho. Todos os direitos reservados.
        </p>
        <p className="text-sm">
          A Alquimia da Cozinha Digital.
        </p>
        <p className="text-sm mt-2">
          GitHub: <a
            href="https://github.com/paulobolliger"
            className="hover:text-accent transition underline"
            target="_blank"
            rel="noopener noreferrer" // 2. Prática de segurança Sênior
          >
            paulobolliger
          </a>
        </p>
      </div>
    </footer>
  )
}