'use client'

import { useState } from 'react'
import RecipeCard from '../components/RecipeCard'

export default function Home() {
  const [ingredients, setIngredients] = useState('')
  const [recipes, setRecipes] = useState([
    { title: 'Macarrão ao Alho e Óleo', image: '/recipe-card.png' },
    { title: 'Sopa de Cebola', image: '/recipe-card.png' },
    { title: 'Risoto de Legumes', image: '/recipe-card.png' },
    { title: 'Omelete de Queijo', image: '/recipe-card.png' },
    { title: 'Salada Mediterrânea', image: '/recipe-card.png' },
    { title: 'Frango com Alho e Ervas', image: '/recipe-card.png' }
  ])

  const handleSubmit = (e) => {
    e.preventDefault()
    alert(`Procurando receitas com: ${ingredients}`)
    setIngredients('')
  }

  return (
    <section className="p-8 max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold mb-4 text-center text-purple-700">Cebola & Alho</h1>
      <p className="mb-8 text-center text-gray-700">
        Digite os ingredientes que você tem em casa e descubra receitas deliciosas!
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 mb-12 justify-center">
        <input
          type="text"
          placeholder="Ex: Cebola, Alho, Tomate"
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          className="border p-3 rounded flex-1 focus:outline-none focus:ring-2 focus:ring-purple-600"
        />
        <button
          type="submit"
          className="bg-purple-600 text-white p-3 rounded hover:bg-purple-700 transition"
        >
          Procurar Receitas
        </button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {recipes.map((recipe, idx) => (
          <RecipeCard key={idx} title={recipe.title} image={recipe.image} />
        ))}
      </div>
    </section>
  )
}
