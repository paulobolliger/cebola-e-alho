'use client';

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import Image from 'next/image';
import Link from 'next/link';

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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ingredients }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'A IA da cozinha está de folga.');
      }

      const data = await response.json();
      setRecipe(data.recipe);
    } catch (e: any) {
      console.error(e);
      setError(e.message || 'Oops! Algo deu errado.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* 🔥 HERO SECTION - Dramático e Vibrante */}
      <section className="relative overflow-hidden bg-gradient-fire py-20 md:py-32">
        {/* Efeito de chama animada no fundo */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent rounded-full blur-3xl animate-pulse-slow"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary rounded-full blur-3xl animate-pulse-slow"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center text-white">
            {/* Badge de destaque */}
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <span className="text-2xl animate-flame">🔥</span>
              <span className="font-display font-bold text-sm uppercase tracking-wider">
                Receitas Geradas por IA
              </span>
            </div>

            <h1 className="font-display font-black text-5xl md:text-7xl lg:text-8xl mb-6 leading-tight">
              Sua despensa,
              <br />
              <span className="text-accent drop-shadow-lg">infinitas receitas</span>
            </h1>

            <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-2xl mx-auto leading-relaxed">
              Diga o que você tem na geladeira e nossa <strong>Inteligência Artificial</strong> cria uma receita 
              deliciosa e exclusiva. Chega de desperdício, olá criatividade!
            </p>

            {/* CTAs principais */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a 
                href="#gerador" 
                className="bg-white text-primary font-display font-bold text-lg px-8 py-4 rounded-lg hover:scale-105 transition-transform shadow-fire"
              >
                Gerar Minha Receita 🍳
              </a>
              <Link 
                href="/recipes" 
                className="bg-white/10 backdrop-blur-sm text-white font-display font-bold text-lg px-8 py-4 rounded-lg hover:bg-white/20 transition-colors border-2 border-white/30"
              >
                Ver Receitas da Comunidade
              </Link>
            </div>
          </div>
        </div>

        {/* Ondas decorativas */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="#ECECEC"/>
          </svg>
        </div>
      </section>

      {/* 🎯 GERADOR DE RECEITAS - ID para scroll */}
      <section id="gerador" className="py-16 md:py-24 container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Título da seção */}
          <div className="text-center mb-12">
            <h2 className="font-display font-black text-4xl md:text-5xl text-text-primary mb-4">
              Transforme Ingredientes em <span className="text-primary">Obras-Primas</span>
            </h2>
            <p className="text-lg text-text-secondary">
              Nossa IA analisa seus ingredientes e cria receitas personalizadas em segundos
            </p>
          </div>

          {/* Card do Formulário - Mais destacado */}
          <div className="bg-surface p-8 md:p-10 rounded-2xl shadow-fire border-2 border-primary/20 relative overflow-hidden">
            {/* Elemento decorativo */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-fire-subtle opacity-10 rounded-full blur-3xl"></div>

            <form onSubmit={handleSubmit} className="relative z-10">
              <label
                htmlFor="ingredients"
                className="block font-display font-bold text-2xl text-text-primary mb-6 text-center"
              >
                Quais ingredientes você tem? 🥕🥚🧅
              </label>

              <textarea
                id="ingredients"
                value={ingredients}
                onChange={(e) => setIngredients(e.target.value)}
                rows={6}
                className="w-full p-5 border-2 border-border rounded-xl placeholder-text-secondary/60 focus:ring-4 focus:ring-accent/30 focus:border-primary transition-all text-lg shadow-inner resize-none"
                placeholder="Ex: 3 cenouras, 4 ovos, 1 xícara de farinha, sal, pimenta..."
                disabled={loading}
              />

              <div className="mt-6 flex flex-col sm:flex-row gap-4">
                <button
                  type="submit"
                  className="flex-1 bg-primary text-white font-display font-bold text-xl py-5 px-8 rounded-xl hover:bg-primary/90 focus:ring-4 focus:ring-accent/50 transition-all transform hover:scale-[1.02] disabled:bg-gray-400 disabled:cursor-not-allowed shadow-fire"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-6 w-6" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Criando sua receita...
                    </span>
                  ) : (
                    '🔥 Gerar Receita Agora'
                  )}
                </button>

                {ingredients && (
                  <button
                    type="button"
                    onClick={() => {
                      setIngredients('');
                      setRecipe('');
                      setError('');
                    }}
                    className="sm:w-auto bg-gray-200 text-text-primary font-display font-bold py-5 px-6 rounded-xl hover:bg-gray-300 transition-all"
                  >
                    Limpar
                  </button>
                )}
              </div>

              {error && (
                <div className="mt-6 p-4 bg-red-50 border-l-4 border-red-500 rounded">
                  <p className="text-red-700 font-semibold">{error}</p>
                </div>
              )}
            </form>
          </div>
        </div>
      </section>

      {/* 💰 ANÚNCIO 1 - Após o formulário */}
      <section className="py-8 container mx-auto px-4">
        <div className="max-w-4xl mx-auto bg-neutral/50 rounded-lg p-8 border border-border">
          <ins 
            className="adsbygoogle block"
            style={{ display: 'block' }}
            data-ad-client="ca-pub-6261445349446333"
            data-ad-slot="YOUR_AD_SLOT_1"
            data-ad-format="horizontal"
            data-full-width-responsive="true"
          />
        </div>
      </section>

      {/* 📖 RESULTADO DA RECEITA */}
      {recipe && (
        <section className="py-16 md:py-24 bg-gradient-to-b from-background to-neutral/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              {/* Header da receita */}
              <div className="text-center mb-10">
                <div className="inline-flex items-center gap-2 bg-primary/10 px-6 py-3 rounded-full mb-4">
                  <span className="text-3xl">👨‍🍳</span>
                  <span className="font-display font-bold text-primary">Receita Exclusiva Gerada</span>
                </div>
                <h2 className="font-display font-black text-4xl text-text-primary">
                  Sua Obra-Prima Culinária
                </h2>
              </div>

              {/* Card da receita */}
              <div className="bg-surface p-8 md:p-12 rounded-2xl shadow-card border border-border">
                <div className="prose lg:prose-xl max-w-none 
                  prose-h1:text-primary prose-h1:font-display prose-h1:font-black prose-h1:mb-6
                  prose-h2:text-text-primary prose-h2:font-display prose-h2:font-bold prose-h2:mt-8
                  prose-li:text-text-secondary prose-p:text-text-secondary prose-p:leading-relaxed
                  prose-strong:text-primary">
                  <ReactMarkdown>{recipe}</ReactMarkdown>
                </div>

                {/* Ações pós-receita */}
                <div className="mt-10 pt-8 border-t border-border flex flex-wrap gap-4 justify-center">
                  <button
                    onClick={() => navigator.share?.({ title: 'Minha receita', text: recipe })}
                    className="bg-accent text-text-primary font-display font-bold px-6 py-3 rounded-lg hover:opacity-90 transition-opacity"
                  >
                    📤 Compartilhar
                  </button>
                  <button
                    onClick={() => {
                      setRecipe('');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="bg-primary text-white font-display font-bold px-6 py-3 rounded-lg hover:opacity-90 transition-opacity"
                  >
                    🔥 Gerar Outra Receita
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 💰 ANÚNCIO 2 - Após a receita */}
      {recipe && (
        <section className="py-8 container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-neutral/50 rounded-lg p-8 border border-border">
            <ins 
              className="adsbygoogle block"
              style={{ display: 'block' }}
              data-ad-client="ca-pub-6261445349446333"
              data-ad-slot="YOUR_AD_SLOT_2"
              data-ad-format="horizontal"
              data-full-width-responsive="true"
            />
          </div>
        </section>
      )}

      {/* 🌟 COMO FUNCIONA - Social Proof */}
      <section className="py-16 md:py-24 bg-background-dark text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="font-display font-black text-4xl md:text-5xl text-center mb-16">
              Como Funciona a <span className="text-accent">Alquimia Digital</span>
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                { icon: '📝', title: 'Liste Ingredientes', desc: 'Digite o que você tem na geladeira ou despensa' },
                { icon: '🤖', title: 'IA Analisa', desc: 'Nossa inteligência artificial combina sabores e técnicas' },
                { icon: '🍽️', title: 'Receita Pronta', desc: 'Receba uma receita personalizada e deliciosa' }
              ].map((step, i) => (
                <div key={i} className="text-center">
                  <div className="text-6xl mb-4">{step.icon}</div>
                  <h3 className="font-display font-bold text-2xl mb-3 text-accent">{step.title}</h3>
                  <p className="text-white/80 leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 📚 CTA para Blog/Receitas */}
      <section className="py-16 md:py-24 container mx-auto px-4">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
          {/* Card Blog */}
          <Link 
            href="/blog"
            className="group bg-gradient-to-br from-primary to-secondary p-8 rounded-2xl shadow-fire hover:scale-105 transition-transform"
          >
            <span className="text-5xl block mb-4">📖</span>
            <h3 className="font-display font-black text-3xl text-white mb-3">Diário do Sabor</h3>
            <p className="text-white/90 mb-6 leading-relaxed">
              Dicas, truques e histórias fascinantes do mundo da gastronomia
            </p>
            <span className="inline-flex items-center gap-2 text-white font-bold group-hover:gap-4 transition-all">
              Explorar Blog <span>→</span>
            </span>
          </Link>

          {/* Card Receitas */}
          <Link 
            href="/recipes"
            className="group bg-gradient-to-br from-accent to-secondary p-8 rounded-2xl shadow-fire hover:scale-105 transition-transform"
          >
            <span className="text-5xl block mb-4">👨‍🍳</span>
            <h3 className="font-display font-black text-3xl text-text-primary mb-3">Receitas da Comunidade</h3>
            <p className="text-text-primary/80 mb-6 leading-relaxed">
              Milhares de receitas aprovadas e testadas pela nossa comunidade
            </p>
            <span className="inline-flex items-center gap-2 text-text-primary font-bold group-hover:gap-4 transition-all">
              Ver Receitas <span>→</span>
            </span>
          </Link>
        </div>
      </section>
    </div>
  );
}