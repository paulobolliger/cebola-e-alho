// components/RatingSystem.tsx
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/Auth/AuthContextProvider';
import { useRouter } from 'next/navigation';

interface RatingSystemProps {
  recipeId: string;
  initialAverageRating: number;
  initialRatingCount: number;
  initialUserRating: number | null; // A avaliação que o usuário já deu
}

export default function RatingSystem({
  recipeId,
  initialAverageRating,
  initialRatingCount,
  initialUserRating,
}: RatingSystemProps) {
  const { user, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();

  const [averageRating, setAverageRating] = useState(initialAverageRating);
  const [ratingCount, setRatingCount] = useState(initialRatingCount);
  const [userRating, setUserRating] = useState(initialUserRating);
  const [hoverRating, setHoverRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setUserRating(initialUserRating);
  }, [initialUserRating]);

  const handleRatingSubmit = async (rating: number) => {
    if (!user) {
      // Poderia abrir um modal de login aqui
      alert('Você precisa estar logado para avaliar!');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/ratings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipe_id: recipeId, rating }),
      });

      if (!response.ok) {
        throw new Error('Falha ao enviar avaliação.');
      }

      setUserRating(rating);

      // Para uma melhor UX, poderíamos recalcular a média no client-side
      // ou (melhor) receber a nova média da API. Por simplicidade,
      // vamos apenas atualizar a avaliação do usuário e recarregar os dados do servidor.
      router.refresh();

    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Ocorreu um erro inesperado.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = (ratingValue: number, isInteractive: boolean = false) => {
    const displayRating = isInteractive ? hoverRating || userRating || 0 : ratingValue;

    return (
      <div
        className={`flex ${isInteractive ? 'cursor-pointer' : ''}`}
        onMouseLeave={() => isInteractive && setHoverRating(0)}
      >
        {[...Array(5)].map((_, index) => {
          const starValue = index + 1;
          return (
            <span
              key={starValue}
              className={`text-3xl ${starValue <= displayRating ? 'text-accent' : 'text-gray-300'}`}
              onMouseEnter={() => isInteractive && setHoverRating(starValue)}
              onClick={() => isInteractive && handleRatingSubmit(starValue)}
            >
              ★
            </span>
          );
        })}
      </div>
    );
  };

  return (
    <div className="my-8 p-6 bg-surface rounded-lg shadow-md border border-border">
      <h3 className="text-xl font-display font-bold mb-4">Avaliações</h3>

      <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
        {/* Média Geral */}
        <div className="text-center">
          <p className="text-4xl font-bold">{averageRating.toFixed(1)}</p>
          <div className="flex items-center justify-center">
            {renderStars(averageRating)}
          </div>
          <p className="text-sm text-text-secondary mt-1">({ratingCount} {ratingCount === 1 ? 'avaliação' : 'avaliações'})</p>
        </div>

        {/* Avaliação do Usuário */}
        <div className="flex-1 text-center md:text-left border-t md:border-t-0 md:border-l border-border pt-4 md:pt-0 md:pl-8">
          <h4 className="font-semibold mb-2">
            {userRating ? 'Sua Avaliação:' : 'Avalie esta receita!'}
          </h4>
          {isAuthLoading ? (
            <p className="text-sm text-text-secondary">Carregando...</p>
          ) : user ? (
            <div>
              {renderStars(0, true)}
              {isSubmitting && <p className="text-sm text-accent mt-2">Enviando...</p>}
              {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
            </div>
          ) : (
            <p className="text-sm text-text-secondary">
              <a href="/login" className="text-primary underline">Faça login</a> para deixar sua avaliação.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}