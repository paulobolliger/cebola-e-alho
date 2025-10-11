'use client'

import { useState, FormEvent, ChangeEvent } from 'react'
import { useRouter } from 'next/navigation'
import RecipeCard from '../components/RecipeCard'
import { v4 as uuidv4 } from 'uuid' 

// 1. Tipagem da Receita (Usada apenas para o mock inicial)
interface Recipe {
  id: string
  title: string
  image: string
}

const MOCK_RECIPES: Recipe[] = [
  // IDs únicos para a lista de mock
  { id: uuidv4(), title: 'Macarrão ao Alho e Óleo', image: '/recipe-card.png' },
  { id: uuidv4(), title: 'Sopa de Cebola', image: '/recipe-card.png' },
  { id: uuidv4(), title: 'Risoto de Legumes', image: '/recipe-card.png' },
  { id: uuidv4(), title: 'Omelete de Queijo', image: '/recipe-card.png' },
  { id: uuidv4(), title: 'Salada Mediterrânea', image: '/recipe-card.png' },
  { id: uuidv4(), title: 'Frango com Alho e Ervas', image: '/recipe-card.png' }
]

export default function Home() {
  const router = useRouter() // 2. Hook para navegação programática
  
  // 3. Tipagem e Estados
  const [ingredients, setIngredients] = useState<string>('')
  const [recipes] = useState<Recipe[]>(MOCK_RECIPES)
  const [isLoading, setIsLoading] = useState<boolean>(false) // Estado de Loading
  const [error, setError] = useState<string | null>(null) // Estado de Erro

  // 4. Handler de Input (mantido)
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setIngredients(e.target.value)
    if (error) setError(null) // Limpa o erro ao digitar
  }

  // 5. Handler de Submissão (chamada à API)
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)

    if (ingredients.trim() === '') {
      setError('Por favor, adicione pelo menos um ingrediente.')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/generate-recipe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ingredients }),
      })

      // 6. Tratamento de Erros da Resposta da API
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Erro ao gerar receita pela IA.')
      }

      const data = await response.json()

      // 7. Navegação para a rota dinâmica da receita
      router.push(`/recipes/${data.slug}`)
      
      setIngredients('') // Limpa o input após o sucesso
    } catch (err) {
      // 8. Captura e exibe erros de rede ou processamento
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('Ocorreu um erro desconhecido ao tentar se conectar ao Chef IA.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="p-8 max-w-6xl mx-auto">
      {/* Título e Slogan (mantidos do branding) */}
      <h2 className="text-4xl font-display font-black mb-4 text-center text-primary">
        Vamos transformar o que você tem na geladeira?
      </h2>
      <p className="mb-8 text-center text-text-base text-lg font-body">
        Sua despensa, infinitas receitas. Geradas por IA.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 mb-12 justify-center">
        <input
          type="text"
          placeholder="Ex: Cebola, Alho, Tomate"
          value={ingredients}
          onChange={handleInputChange}
          className="border p-3 rounded flex-1 focus:outline-none focus:ring-4 focus:ring-primary focus:border-transparent font-body text-text-base disabled:opacity-75"
          disabled={isLoading} // 9. Desabilita o input durante o loading
        />
        <button
          type="submit"
          className="bg-primary text-white p-3 rounded hover:bg-secondary transition font-display font-bold uppercase tracking-wider disabled:bg-gray-500 disabled:cursor-not-allowed flex items-center justify-center min-w-[200px]"
          disabled={isLoading} // 10. Desabilita o botão durante o loading
        >
          {isLoading ? (
            // 11. Feedback visual de Loading
            <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processando...
            </span>
          ) : (
            'Procurar Receitas'
          )}
        </button>
      </form>

      {/* 12. Exibição de Erros */}
      {error && (
        <div className="text-center mb-6 p-3 bg-primary/10 border border-primary text-primary rounded-lg font-body">
          {error}
        </div>
      )}

      {/* Exibição da Lista de Receitas (Mock) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {recipes.map((recipe) => (
          <RecipeCard key={recipe.id} title={recipe.title} image={recipe.image} />
        ))}
      </div>
    </section>
  )
}