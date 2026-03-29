import { useState } from "react";
import { Recipe } from "@/data/recipes";
import { Button } from "@/components/ui/button";
import { Minus, Plus, ArrowLeft, Users, ShoppingCart } from "lucide-react";

interface RecipeDetailProps {
  recipe: Recipe;
  onBack: () => void;
}

const formatQuantity = (qty: number): string => {
  if (qty === 0) return "0";
  if (Number.isInteger(qty)) return qty.toString();
  if (Math.abs(qty - Math.round(qty)) < 0.01) return Math.round(qty).toString();
  // Show fractions nicely
  const rounded = Math.round(qty * 100) / 100;
  return rounded.toString();
};

const RecipeDetail = ({ recipe, onBack }: RecipeDetailProps) => {
  const [servings, setServings] = useState(recipe.baseServings);
  const ratio = servings / recipe.baseServings;

  return (
    <div className="animate-fade-in">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors font-body mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver a recetas
      </button>

      {/* Header */}
      <div className="text-center mb-8">
        <span className="text-6xl block mb-3">{recipe.emoji}</span>
        <h2 className="font-display text-3xl text-foreground">{recipe.name}</h2>
        <p className="text-muted-foreground font-body mt-1">⏱ {recipe.prepTime}</p>
      </div>

      {/* Servings Selector */}
      <div className="bg-card border border-border rounded-xl p-6 mb-6">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Users className="w-5 h-5 text-primary" />
          <span className="font-display text-lg text-foreground">¿Para cuántas personas?</span>
        </div>
        <div className="flex items-center justify-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setServings(Math.max(1, servings - 1))}
            disabled={servings <= 1}
          >
            <Minus className="w-4 h-4" />
          </Button>
          <span className="text-4xl font-display text-primary w-16 text-center">{servings}</span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setServings(servings + 1)}
            disabled={servings >= 50}
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        {servings !== recipe.baseServings && (
          <p className="text-center text-xs text-muted-foreground mt-3 font-body">
            Receta original para {recipe.baseServings} personas — ajustada ×{ratio.toFixed(2)}
          </p>
        )}
      </div>

      {/* Ingredients List */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <ShoppingCart className="w-5 h-5 text-secondary" />
          <h3 className="font-display text-lg text-foreground">Ingredientes</h3>
        </div>
        <ul className="space-y-3">
          {recipe.ingredients.map((ing, i) => {
            const scaledQty = ing.quantity * ratio;
            return (
              <li
                key={i}
                className="flex items-center justify-between py-2 border-b border-border last:border-0 animate-fade-in"
                style={{ animationDelay: `${i * 40}ms` }}
              >
                <span className="font-body text-foreground">{ing.name}</span>
                <span className="font-body font-semibold text-primary tabular-nums">
                  {formatQuantity(scaledQty)} {ing.unit}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default RecipeDetail;
