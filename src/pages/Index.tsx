import { useState } from "react";
import { recipes, Recipe } from "@/data/recipes";
import RecipeCard from "@/components/RecipeCard";
import RecipeDetail from "@/components/RecipeDetail";
import { ChefHat } from "lucide-react";

type Filter = "todos" | "almuerzo" | "cena";

const Index = () => {
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [filter, setFilter] = useState<Filter>("todos");

  const filtered = filter === "todos"
    ? recipes
    : recipes.filter(r => r.category === filter || r.category === "ambos");

  if (selectedRecipe) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-lg mx-auto px-4 py-8">
          <RecipeDetail recipe={selectedRecipe} onBack={() => setSelectedRecipe(null)} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-lg mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
            <ChefHat className="w-8 h-8 text-primary" />
          </div>
          <h1 className="font-display text-3xl text-foreground">Porciones Justas</h1>
          <p className="text-muted-foreground font-body mt-2 text-sm">
            Calcula los ingredientes exactos para cada receta.<br />
            Sin desperdicios, sin que falte nada.
          </p>
        </div>

        {/* Filter */}
        <div className="flex gap-2 justify-center mb-6">
          {([
            ["todos", "Todos"],
            ["almuerzo", "🍽 Almuerzo"],
            ["cena", "🌙 Cena"],
          ] as [Filter, string][]).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-4 py-1.5 rounded-full text-sm font-body transition-colors ${
                filter === key
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Recipe list */}
        <div className="space-y-3">
          {filtered.map((recipe, i) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              onClick={setSelectedRecipe}
              index={i}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;
