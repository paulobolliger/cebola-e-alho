// app/page.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/Auth/AuthContextProvider'; // NOVO: Hook de Auth

export default function HomePage() {
  const router = useRouter();
  // ✅ CORREÇÃO: Pega o estado do usuário do contexto
  const { user, isLoading: isAuthLoading } = useAuth();
  
  const [ingredients, setIngredients] = useState('');
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
    
    // ✅ CORREÇÃO: Passa o UUID do usuário logado, se existir
    const authorId = user?.id; 
    
    const payload = { 
      ingredients,
      authorId: authorId, // Será null se deslogado, e a API usará o DEFAULT_AUTHOR_ID
    };

    try {
      const response = await fetch('/api/generate-recipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || 'A IA da cozinha está de folga.');
      }

      const data: { slug: string; imageUrl: string } = await response.json();
      router.push(`/recipes/${data.slug}`);

    } catch (e: any) {
      console.error(e);
      // Mensagem de erro genérica. A API de back-end faz o trabalho pesado de autoria
      setError(e.message || 'Oops! Algo deu errado ao gerar a receita.');
    } finally {
      setLoading(false);
    }
  };

  // Desabilita o botão se estiver carregando a autenticação ou a receita
  const isDisabled = loading || isAuthLoading;

  return (
    <div className="min-h-screen bg-background">
      {/* ... (Seção HERO) ... */}
      
      {/* 🎯 GERADOR DE RECEITAS */}
      <section id="gerador" className="py-16 md:py-24 container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* ... (título da seção) ... */}

          <div className="bg-surface p-8 md:p-10 rounded-2xl shadow-fire border-2 border-primary/20 relative overflow-hidden">
            <form onSubmit={handleSubmit} className="relative z-10">
              {/* ... (label) ... */}

              <textarea
                id="ingredients"
                value={ingredients}
                onChange={(e) => setIngredients(e.target.value)}
                rows={6}
                className="w-full p-5 border-2 border-border rounded-xl placeholder-text-secondary/60 focus:ring-4 focus:ring-accent/30 focus:border-primary transition-all text-lg shadow-inner resize-none"
                placeholder="Ex: 3 cenouras, 4 ovos, 1 xícara de farinha, sal, pimenta..."
                disabled={isDisabled}
              />

              <div className="mt-6 flex flex-col sm:flex-row gap-4">
                <button
                  type="submit"
                  className="flex-1 bg-primary text-white font-display font-bold text-xl py-5 px-8 rounded-xl hover:bg-primary/90 focus:ring-4 focus:ring-accent/50 transition-all transform hover:scale-[1.02] disabled:bg-gray-400 disabled:cursor-not-allowed shadow-fire"
                  disabled={isDisabled}
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

                {/* ... (botão Limpar) ... */}
              </div>

              {error && (
                <div className="mt-6 p-4 bg-red-50 border-l-4 border-red-500 rounded">
                  <p className="text-red-700 font-semibold">{error}</p>
                </div>
              )}

              {/* Mensagem se não estiver logado */}
              {!user && !isAuthLoading && (
                 <p className="mt-4 text-sm text-center text-text-secondary/80">
                   Receitas geradas por visitantes anônimos são atribuídas ao nosso "Food Guru". Faça login para ter seu nome de autor na receita!
                 </p>
              )}
            </form>
          </div>
        </div>
      </section>

      {/* ... (Demais seções) ... */}
    </div>
  );
}