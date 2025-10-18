import Link from 'next/link';
import Image from 'next/image';

// Usa a nova tipagem
import { RecipeForCard } from '@/types';

interface RecipeCardProps {
  recipe: RecipeForCard;
}

export default function RecipeCard({ recipe }: RecipeCardProps) {
  // Renderiza ícones de chama baseado na dificuldade
  const renderDifficulty = () => {
    // A dificuldade é baseada no campo 'difficulty' ou 'Média'
    const flames = {
      'Fácil': 1,
      'Média': 2,
      'Difícil': 3
    }[recipe.difficulty || 'Média'];

    return (
      <div className="flex items-center gap-1">
        {[...Array(3)].map((_, i) => (
          <span 
            key={i} 
            className={`text-sm ${i < flames ? 'text-primary' : 'text-gray-300'}`}
          >
            🔥
          </span>
        ))}
      </div>
    );
  };

  // Renderiza estrelas de avaliação (mantido como está no seu código)
  const renderRating = () => {
    if (!recipe.rating) return null;
    
    return (
      <div className="flex items-center gap-1">
        <div className="flex">
          {[...Array(5)].map((_, i) => (
            <span 
              key={i}
              className={`text-sm ${i < Math.floor(recipe.rating!) ? 'text-accent' : 'text-gray-300'}`}
            >
              ⭐
            </span>
          ))}
        </div>
        {recipe.rating_count && (
          <span className="text-xs text-text-secondary">
            ({recipe.rating_count})
          </span>
        )}
      </div>
    );
  };

  // ✅ CORREÇÃO: Usar recipe.image_url
  const imageUrl = recipe.image_url || '/recipe-card.png';
  // ✅ CORREÇÃO: Usar recipe.ingredients_json.length
  const ingredientCount = recipe.ingredients_json?.length || 0;

  return (
    <article className="group bg-surface rounded-2xl shadow-card hover:shadow-fire overflow-hidden transition-all duration-300 hover:scale-[1.02] border border-border">
      <Link href={`/recipes/${recipe.slug}`}>
        {/* Imagem com Overlay de Tempo */}
        <div className="relative h-56 overflow-hidden">
          <Image
            src={imageUrl}
            alt={recipe.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          
          {/* Overlay escuro sutil */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0"></div>
          
          {/* Badge de Tempo (se disponível) */}
          {recipe.prep_time && (
            <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1 shadow-md">
              <span className="text-xs">⏱️</span>
              <span className="text-xs font-bold text-text-primary">
                {recipe.prep_time}min
              </span>
            </div>
          )}

          {/* Badge "NOVO" (pode adicionar lógica baseada em created_at) */}
          <div className="absolute top-3 left-3 bg-primary text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-md">
            🔥 Novo
          </div>

          {/* Badge de Ingredientes */}
          {ingredientCount > 0 && (
            <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-md">
              <span className="text-xs">🍲</span>
              <span className="text-xs font-bold text-text-primary">
                {ingredientCount} ingredientes
              </span>
            </div>
          )}
        </div>

        {/* Conteúdo do Card */}
        <div className="p-5">
          {/* Título */}
          <h3 className="font-display font-bold text-xl text-text-primary mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {recipe.title}
          </h3>

          {/* Descrição - Usando 'description' do novo tipo */}
          {recipe.description && (
            <p className="text-sm text-text-secondary mb-4 line-clamp-2 leading-relaxed">
              {recipe.description}
            </p>
          )}

          {/* Meta Informações */}
          <div className="flex items-center justify-between pt-4 border-t border-border">
            {/* Dificuldade */}
            <div className="flex flex-col">
              <span className="text-xs text-text-secondary mb-1">Dificuldade</span>
              {renderDifficulty()}
            </div>

            {/* Avaliação */}
            <div className="flex flex-col items-end">
              <span className="text-xs text-text-secondary mb-1">Avaliação</span>
              {renderRating() || (
                <span className="text-xs text-text-secondary italic">Sem avaliações</span>
              )}
            </div>
          </div>

          {/* CTA Sutil */}
          <div className="mt-4 flex items-center justify-between">
            <span className="text-sm font-display font-bold text-primary group-hover:underline inline-flex items-center gap-2">
              Ver Receita Completa
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </span>

            {/* Botão de Favorito (futuro - requer autenticação) */}
            <button
              onClick={(e) => {
                e.preventDefault(); // Previne navegação
                console.log('Favoritar receita:', recipe.id);
              }}
              className="p-2 rounded-full hover:bg-accent/10 transition-colors"
              aria-label="Salvar receita"
            >
              <span className="text-xl">🤍</span> 
            </button>
          </div>
        </div>
      </Link>
    </article>
  );
}