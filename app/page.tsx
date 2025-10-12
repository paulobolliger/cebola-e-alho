'use client';

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';

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
        throw new Error(errorData.error || 'Falha ao buscar a receita.');
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
    <div className="bg-background">
      <div className="container mx-auto px-4 pt-8 pb-16 md:pt-12 md:pb-24">
        {/* Seção de Herói */}
        <section className="text-center mb-10">
          <h1 className="font-display font-black text-5xl md:text-7xl text-text-primary mb-4 leading-tight">
            Sua despensa,
            <br />
            <span className="text-primary">infinitas receitas.</span>
          </h1>
          <p className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto">
            Diga o que você tem em casa e nossa IA criará uma receita deliciosa e
            exclusiva para você. Chega de desperdício, olá criatividade!
          </p>
        </section>

        {/* Seção do Formulário com Destaque */}
        <section className="max-w-2xl mx-auto">
          <div className="bg-surface p-8 rounded-xl shadow-2xl border-2 border-primary/50 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-sm font-bold px-4 py-1 rounded-full">
              CHEF IA
            </div>
            <form onSubmit={handleSubmit}>
              <label
                htmlFor="ingredients"
                className="block font-display font-bold text-2xl text-text-primary mb-4 text-center pt-2"
              >
                Quais ingredientes você tem aí?
              </label>
              <textarea
                id="ingredients"
                name="ingredients"
                value={ingredients}
                onChange={(e) => setIngredients(e.target.value)}
                rows={5}
                className="w-full p-4 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow duration-300 text-lg"
                placeholder="Ex: 3 cenouras, 4 ovos, 1 xícara de óleo..."
                disabled={loading}
              />
              <button
                type="submit"
                className="w-full mt-6 bg-primary text-white font-display font-bold text-xl py-4 px-6 rounded-md hover:opacity-90 focus:outline-none focus:ring-4 focus:ring-accent/50 transition-all duration-300 transform hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? 'Gerando sua obra-prima...' : 'Gerar Receita'}
              </button>
              {error && <p className="text-red-600 mt-4 text-center font-semibold">{error}</p>}
            </form>
          </div>
        </section>

        {/* Espaço para Anúncio */}
        <div className="my-12 text-center">
          {/* AdBanner Placeholder */}
          <div className="bg-gray-200 h-24 flex items-center justify-center text-gray-500 rounded-md">
            Área para Google AdSense (Ex: 728x90)
          </div>
        </div>

        {/* Seção de Resultado */}
        {recipe && (
          <section className="mt-16 max-w-3xl mx-auto">
            <div className="bg-surface p-8 md:p-10 rounded-lg shadow-lg border border-border">
              <div className="prose lg:prose-xl max-w-none prose-h1:text-primary">
                <ReactMarkdown>{recipe}</ReactMarkdown>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}