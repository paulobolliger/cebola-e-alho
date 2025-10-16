// components/GenerateRecipeForm.tsx
"use client";

import { useState } from "react";

export default function GenerateRecipeForm() {
  const [ingredients, setIngredients] = useState("");
  const [loading, setLoading] = useState(false);
  const [recipe, setRecipe] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setRecipe("");

    try {
      const response = await fetch("/api/generate-recipe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ingredients }),
      });

      if (!response.ok) {
        throw new Error("Falha ao gerar a receita.");
      }

      const data = await response.json();
      setRecipe(data.recipe);
    } catch (error) {
      console.error(error);
      // Aqui você poderia definir um estado de erro para exibir na UI
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="ingredients"
            className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2"
          >
            Ingredientes
          </label>
          <input
            type="text"
            id="ingredients"
            name="ingredients"
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-200 dark:bg-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Ex: frango, arroz, tomate"
            required
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:bg-gray-400"
          >
            {loading ? "Gerando..." : "Gerar Receita"}
          </button>
        </div>
      </form>

      {recipe && (
        <div className="mt-6 p-4 border rounded-lg bg-gray-50 dark:bg-gray-700">
          <h3 className="text-xl font-semibold mb-2">Sua Receita:</h3>
          <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
            {recipe}
          </p>
        </div>
      )}
    </div>
  );
}