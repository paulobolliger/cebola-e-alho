import RecipeCard from '../components/RecipeCard'

export default function Home() {
  return (
    <section className="p-8">
      <h1 className="text-4xl font-bold mb-6">Cebola & Alho</h1>
      <p className="mb-8">Informe os ingredientes que você tem e descubra receitas incríveis!</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <RecipeCard title="Macarrão ao Alho e Óleo" />
        <RecipeCard title="Sopa de Cebola" />
        <RecipeCard title="Risoto de Legumes" />
      </div>
    </section>
  )
}
