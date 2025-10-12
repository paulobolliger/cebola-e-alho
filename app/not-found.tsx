import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="bg-background min-h-screen flex items-center justify-center">
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-md mx-auto bg-surface p-8 md:p-12 rounded-lg shadow-lg border border-border">
          <h1 className="font-display font-black text-6xl md:text-8xl text-primary">
            404
          </h1>
          <h2 className="font-display font-bold text-2xl md:text-3xl text-text-primary mt-4 mb-6">
            Página Não Encontrada
          </h2>
          <p className="text-text-secondary mb-8">
            Oops! Parece que o tempero sumiu ou esta página nunca existiu.
            Vamos voltar para a cozinha?
          </p>
          <Link
            href="/"
            className="inline-block bg-primary text-white font-display font-bold text-lg py-3 px-8 rounded-md hover:opacity-90 transition-all duration-300 transform hover:scale-105"
          >
            Voltar para a Home
          </Link>
        </div>
      </div>
    </div>
  );
}