import { useState } from "react";
import { Recipe } from "@/data/recipes";
import { Button } from "@/components/ui/button";
import { Minus, Plus, ArrowLeft, Users, ShoppingCart, Scale, Pencil } from "lucide-react";
import EditIngredientsDialog from "./EditIngredientsDialog";

interface RecipeDetailProps {
  recipe: Recipe;
  onBack: () => void;
}

const formatQuantity = (qty: number): string => {
  if (qty === 0) return "0";
  if (Number.isInteger(qty)) return qty.toString();
  if (Math.abs(qty - Math.round(qty)) < 0.01) return Math.round(qty).toString();
  const rounded = Math.round(qty * 100) / 100;
  return rounded.toString();
};

// Approximate conversions to grams
const unitToGrams: Record<string, number> = {
  cucharada: 15,
  cucharadas: 15,
  cucharadita: 5,
  cucharaditas: 5,
  taza: 150,
  tazas: 150,
  unidad: 150,
  unidades: 150,
  piezas: 200,
  dientes: 5,
  diente: 5,
  hojas: 30,
  manojo: 50,
  ramas: 5,
  rebanadas: 30,
  tallos: 10,
  ml: 1, // ml ≈ g for liquids
};

const canConvert = (unit: string): boolean => {
  return unit !== "g" && unit in unitToGrams;
};

const toGrams = (qty: number, unit: string): { quantity: number; unit: string } => {
  if (unit === "g") return { quantity: qty, unit: "g" };
  const factor = unitToGrams[unit];
  if (!factor) return { quantity: qty, unit };
  return { quantity: Math.round(qty * factor), unit: "g" };
};

const RecipeDetail = ({ recipe, onBack }: RecipeDetailProps) => {
  const [servings, setServings] = useState(recipe.baseServings);
  const [showGrams, setShowGrams] = useState(false);
  const [editingServings, setEditingServings] = useState(false);
  const [servingsInput, setServingsInput] = useState(String(recipe.baseServings));
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
          {editingServings ? (
            <input
              type="number"
              min={1}
              max={500}
              autoFocus
              value={servingsInput}
              onChange={(e) => setServingsInput(e.target.value)}
              onBlur={() => {
                const n = parseInt(servingsInput, 10);
                if (!isNaN(n) && n >= 1) setServings(Math.min(500, n));
                setEditingServings(false);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") (e.target as HTMLInputElement).blur();
                if (e.key === "Escape") setEditingServings(false);
              }}
              className="text-4xl font-display text-primary w-24 text-center bg-transparent border-b-2 border-primary focus:outline-none tabular-nums"
            />
          ) : (
            <button
              onClick={() => {
                setServingsInput(String(servings));
                setEditingServings(true);
              }}
              className="text-4xl font-display text-primary w-16 text-center hover:opacity-80 transition-opacity"
              aria-label="Editar número de personas"
            >
              {servings}
            </button>
          )}
          <Button
            variant="outline"
            size="icon"
            onClick={() => setServings(servings + 1)}
            disabled={servings >= 500}
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Ingredients List */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-secondary" />
            <h3 className="font-display text-lg text-foreground">Ingredientes</h3>
          </div>
          <button
            onClick={() => setShowGrams(!showGrams)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-body transition-colors ${
              showGrams
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
            {showGrams ? "En gramos" : "Original"}
          </button>
        </div>
        <ul className="space-y-3">
          {recipe.ingredients.map((ing, i) => {
            const scaledQty = ing.quantity * ratio;
            const display = showGrams && canConvert(ing.unit)
              ? toGrams(scaledQty, ing.unit)
              : { quantity: scaledQty, unit: ing.unit };
            return (
              <li
                key={i}
                className="flex items-center justify-between py-2 border-b border-border last:border-0 animate-fade-in"
                style={{ animationDelay: `${i * 40}ms` }}
              >
                <span className="font-body text-foreground">{ing.name}</span>
                <span className="font-body font-semibold text-primary tabular-nums">
                  {formatQuantity(display.quantity)} {display.unit}
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
