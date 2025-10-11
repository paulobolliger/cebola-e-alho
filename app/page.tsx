'use client';

import { useState } from 'react';

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
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setRecipe(data.recipe);
    } catch (e) {
      console.error(e);
      setError(
        'Oops! Algo deu errado ao gerar sua receita. Tente novamente.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <section className="text-center mb-12">
        <h1 className="font-display font-bold text-4xl md:text-5xl text-brand-charcoal mb-4">
          Sua despensa, infinitas receitas.
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Diga-nos o que você tem em casa e nossa IA criará uma receita deliciosa
          e exclusiva para você. Chega de desperdício, olá criatividade!
        </p>
      </section>

      <section className="max-w-xl mx-auto">
        <form onSubmit={handleSubmit} className="bg-brand-white p-8 rounded-lg shadow-lg">
          <label
            htmlFor="ingredients"
            className="block font-display font-semibold text-lg text-brand-charcoal mb-2"
          >
            Quais ingredientes você tem aí?
          </label>
          <textarea
            id="ingredients"
            name="ingredients"
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            rows={4}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-primary focus:border-transparent transition"
            placeholder="Ex: peito de peru, requeijão, macarrão..."
            disabled={loading}
          />
          <button
            type="submit"
            className="w-full mt-6 bg-brand-primary text-brand-white font-display font-bold text-lg py-3 px-6 rounded-md hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary transition-transform transform hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? 'Gerando sua obra-prima...' : 'Gerar Receita'}
          </button>
          {error && <p className="text-status-error mt-4 text-center">{error}</p>}
        </form>
      </section>

      {recipe && (
        <section className="mt-12 max-w-2xl mx-auto">
          <h2 className="font-display font-bold text-3xl text-center text-brand-charcoal mb-6">
            Sua Receita Exclusiva!
          </h2>
          <div className="bg-brand-white p-8 rounded-lg shadow-lg prose max-w-none">
            {recipe.split('\n').map((line, index) => (
              <p key={index}>{line}</p>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}