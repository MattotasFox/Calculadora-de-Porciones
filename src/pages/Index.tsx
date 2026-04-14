import { useState, useMemo } from "react";
import { recipes, Recipe } from "@/data/recipes";
import RecipeCard from "@/components/RecipeCard";
import RecipeDetail from "@/components/RecipeDetail";
import { ChefHat, Filter as FilterIcon, X } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";

type CategoryFilter = "todos" | "almuerzo" | "cena";

const Index = () => {
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [filter, setFilter] = useState<CategoryFilter>("todos");
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [ingredientSearch, setIngredientSearch] = useState("");

  // Extract all unique ingredient names
  const allIngredients = useMemo(() => {
    const set = new Set<string>();
    recipes.forEach(r => r.ingredients.forEach(i => set.add(i.name)));
    return Array.from(set).sort();
  }, []);

  const filteredIngredients = allIngredients.filter(name =>
    name.toLowerCase().includes(ingredientSearch.toLowerCase())
  );

  const toggleIngredient = (name: string) => {
    setSelectedIngredients(prev =>
      prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]
    );
  };

  const filtered = useMemo(() => {
    let result = filter === "todos"
      ? recipes
      : recipes.filter(r => r.category === filter || r.category === "ambos");

    if (selectedIngredients.length > 0) {
      result = result.filter(r =>
        selectedIngredients.every(ing =>
          r.ingredients.some(i => i.name === ing)
        )
      );
    }
    return result;
  }, [filter, selectedIngredients]);

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

        {/* Category Filter */}
        <div className="flex gap-2 justify-center mb-4">
          {([
            ["todos", "Todos"],
            ["almuerzo", "🍽 Almuerzo"],
            ["cena", "🌙 Cena"],
          ] as [CategoryFilter, string][]).map(([key, label]) => (
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

        {/* Ingredient Filter */}
        <div className="mb-6">
          <Popover>
            <PopoverTrigger asChild>
              <button className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-card text-sm font-body text-muted-foreground hover:border-primary/40 transition-colors">
                <FilterIcon className="w-4 h-4 text-primary" />
                {selectedIngredients.length > 0
                  ? `${selectedIngredients.length} ingrediente(s) seleccionado(s)`
                  : "Filtrar por ingredientes…"}
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-3" align="center">
              <input
                type="text"
                placeholder="Buscar ingrediente…"
                value={ingredientSearch}
                onChange={e => setIngredientSearch(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring mb-2"
              />
              <div className="max-h-48 overflow-y-auto space-y-0.5">
                {filteredIngredients.map(name => (
                  <button
                    key={name}
                    onClick={() => toggleIngredient(name)}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-sm font-body transition-colors ${
                      selectedIngredients.includes(name)
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-foreground hover:bg-muted"
                    }`}
                  >
                    {selectedIngredients.includes(name) ? "✓ " : ""}{name}
                  </button>
                ))}
              </div>
            </PopoverContent>
          </Popover>

          {/* Selected badges */}
          {selectedIngredients.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {selectedIngredients.map(name => (
                <Badge
                  key={name}
                  variant="secondary"
                  className="cursor-pointer gap-1 font-body text-xs"
                  onClick={() => toggleIngredient(name)}
                >
                  {name}
                  <X className="w-3 h-3" />
                </Badge>
              ))}
              <button
                onClick={() => setSelectedIngredients([])}
                className="text-xs text-muted-foreground hover:text-foreground font-body underline ml-1"
              >
                Limpiar
              </button>
            </div>
          )}
        </div>

        {/* Recipe list */}
        <div className="space-y-3">
          {filtered.length === 0 ? (
            <p className="text-center text-muted-foreground font-body text-sm py-8">
              No se encontraron recetas con esos ingredientes.
            </p>
          ) : (
            filtered.map((recipe, i) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                onClick={setSelectedRecipe}
                index={i}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
