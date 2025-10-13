'use client';

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import Image from 'next/image'; // Importado para melhor prática

export default function HomePage() {
  const [ingredients, setIngredients] = useState('');
  const [recipe, setRecipe] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!ingredients.trim()) {
      setError('Por favor, insira pelo menos um ingrediente.');
      return;
    }

    setLoading(true);
    setError('');
    setRecipe('');

    try {
      const response = await fetch('/api/generate-recipe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ingredients }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        // MELHORIA: Mensagem de erro mais amigável
        throw new Error(errorData.error || 'A IA da cozinha está de folga. Tente novamente mais tarde.');
      }

      const data = await response.json();
      setRecipe(data.recipe);

    } catch (e: any) {
      console.error(e);
      setError(e.message || 'Oops! Algo deu errado ao gerar sua receita. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    // CORREÇÃO: Removido 'bg-background' para herdar a cor branca do layout.
    <div className="min-h-screen">
      <div className="container mx-auto px-4 pt-8 pb-16 md:pt-16 md:pb-24">
        {/* Seção de Herói - Melhoria de Layout e Cores */}
        <section className="text-center mb-16">
          <h1 className="font-display font-black text-5xl md:text-7xl text-text-primary mb-4 leading-tight">
            Sua despensa,
            <br />
            <span className="text-primary">infinitas receitas.</span>
          </h1>
          <p className="text-lg md:text-xl text-text-secondary max-w-3xl mx-auto">
            Diga o que você tem em casa e nossa IA criará uma receita deliciosa e
            exclusiva para você. Chega de desperdício, olá criatividade!
          </p>
        </section>

        {/* Seção do Formulário com Destaque - Melhoria de Layout e Cores */}
        <section className="max-w-xl mx-auto">
          {/* MELHORIA: Estilos mais modernos e focados para o container do formulário */}
          <div className="bg-surface p-6 sm:p-8 rounded-xl shadow-2xl border-2 border-primary/50 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-sm font-bold px-4 py-1 rounded-full uppercase tracking-wider">
              Chef IA
            </div>
            <form onSubmit={handleSubmit}>
              <label
                htmlFor="ingredients"
                className="block font-display font-bold text-xl text-text-primary mb-4 text-center pt-2"
              >
                Quais ingredientes você tem aí?
              </label>
              <textarea
                id="ingredients"
                name="ingredients"
                value={ingredients}
                onChange={(e) => setIngredients(e.target.value)}
                rows={5}
                // MELHORIA: Estilos para o campo de texto mais bonitos
                className="w-full p-4 border border-border rounded-lg placeholder-text-secondary/60 focus:ring-4 focus:ring-accent/50 focus:border-primary transition-all duration-300 text-lg shadow-inner"
                placeholder="Ex: 3 cenouras, 4 ovos, 1 xícara de óleo..."
                disabled={loading}
              />
              <button
                type="submit"
                // MELHORIA: Botão mais responsivo e com efeito visual mais agradável
                className="w-full mt-6 bg-primary text-white font-display font-bold text-xl py-4 px-6 rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-4 focus:ring-accent/50 transition-all duration-300 transform hover:scale-[1.01] disabled:bg-gray-400 disabled:cursor-not-allowed shadow-md"
                disabled={loading}
              >
                {loading ? (
                  // MELHORIA: Adicionado um ícone de loading para UX
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Gerando sua obra-prima...
                  </span>
                ) : 'Gerar Receita'}
              </button>
              {error && <p className="text-red-600 mt-4 text-center font-semibold">{error}</p>}
            </form>
          </div>
        </section>

        {/* Espaço para Anúncio - MELHORIA: Sugestão de código AdSense real (bloco de anúncio) */}
        <div className="my-12 text-center">
          {/* Substitua o código abaixo pelo seu código de bloco de anúncio AdSense */}
          <div className="bg-border h-24 flex items-center justify-center text-text-secondary/70 rounded-lg border border-border shadow-inner">
            <ins 
              className="adsbygoogle"
              style={{ display: 'block' }}
              data-ad-client="ca-pub-6261445349446333" 
              data-ad-slot="YOUR_AD_SLOT_ID" // Substitua pelo seu ID de Bloco
              data-ad-format="auto" 
              data-full-width-responsive="true"
            ></ins>
            <script
              dangerouslySetInnerHTML={{
                __html: `(window.adsbygoogle = window.adsbygoogle || []).push({});`,
              }}
            />
          </div>
        </div>

        {/* Seção de Resultado */}
        {recipe && (
          <section className="mt-16 max-w-4xl mx-auto">
            <h2 className="font-display font-black text-3xl md:text-4xl text-text-primary mb-6 text-center">
              Sua Receita Exclusiva
            </h2>
            <div className="bg-surface p-8 md:p-10 rounded-xl shadow-2xl border border-border">
              {/* MELHORIA: Ajuste do estilo do Prose para usar cores do tema */}
              <div className="prose lg:prose-xl max-w-none prose-h1:text-primary prose-h2:text-text-primary prose-li:text-text-secondary prose-p:text-text-secondary">
                <ReactMarkdown>{recipe}</ReactMarkdown>
              </div>
            </div>
          </section>
        )}

      </div>
    </div>
  );
}