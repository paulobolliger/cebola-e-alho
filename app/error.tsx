'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="bg-background min-h-screen flex items-center justify-center">
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-md mx-auto bg-surface p-8 md:p-12 rounded-lg shadow-lg border border-border">
          <h2 className="font-display font-bold text-2xl md:text-3xl text-text-primary mt-4 mb-6">
            Oops! Algo deu errado.
          </h2>
          <p className="text-text-secondary mb-8">
            Nossa cozinha teve um imprevisto, mas já estamos trabalhando para
            consertar. Por favor, tente novamente.
          </p>
          <button
            onClick={() => reset()}
            className="inline-block bg-primary text-white font-display font-bold text-lg py-3 px-8 rounded-md hover:opacity-90 transition-all duration-300 transform hover:scale-105"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    </div>
  );
}