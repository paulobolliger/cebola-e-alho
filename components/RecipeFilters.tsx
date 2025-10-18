// components/RecipeFilters.tsx
'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

const difficultyOptions = ['Fácil', 'Média', 'Difícil'];
const prepTimeOptions = [
  { label: 'Até 15 min', value: '15' },
  { label: 'Até 30 min', value: '30' },
  { label: 'Até 1h', value: '60' },
];

export default function RecipeFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (params.get(name) === value) {
        params.delete(name); // Deseleciona se clicar no mesmo filtro
      } else {
        params.set(name, value);
      }
      return params.toString();
    },
    [searchParams]
  );

  const handleFilterClick = (name: string, value: string) => {
    router.push(pathname + '?' + createQueryString(name, value));
  };

  return (
    <div className="mb-12 p-6 bg-surface rounded-2xl border border-border shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

        {/* Filtro de Dificuldade */}
        <div>
          <h3 className="font-display font-bold text-lg text-text-primary mb-3">Dificuldade</h3>
          <div className="flex flex-wrap gap-2">
            {difficultyOptions.map((level) => (
              <button
                key={level}
                onClick={() => handleFilterClick('difficulty', level)}
                className={`px-4 py-2 text-sm rounded-full transition-colors ${
                  searchParams.get('difficulty') === level
                    ? 'bg-primary text-white font-semibold'
                    : 'bg-background text-text-secondary hover:bg-gray-200'
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        {/* Filtro de Tempo de Preparo */}
        <div>
          <h3 className="font-display font-bold text-lg text-text-primary mb-3">Tempo de Preparo</h3>
          <div className="flex flex-wrap gap-2">
            {prepTimeOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleFilterClick('prep_time', option.value)}
                className={`px-4 py-2 text-sm rounded-full transition-colors ${
                  searchParams.get('prep_time') === option.value
                    ? 'bg-primary text-white font-semibold'
                    : 'bg-background text-text-secondary hover:bg-gray-200'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}