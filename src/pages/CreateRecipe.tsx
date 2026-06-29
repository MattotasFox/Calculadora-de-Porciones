import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Recipe, Ingredient } from "@/data/recipes";
import { addMyRecipe, makeId } from "@/lib/myRecipes";
import { foodEmojis } from "@/lib/foodEmojis";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, Trash2, Save } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const UNITS = ["g", "ml", "unidad", "unidades", "taza", "tazas", "cucharada", "cucharadas", "cucharadita", "cucharaditas", "dientes", "piezas", "hojas", "manojo", "ramas", "rebanadas", "tallos"];

type Cat = "omnivoro" | "vegetariano" | "vegano";

const CreateRecipe = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [emoji, setEmoji] = useState("🍽️");
  const [category, setCategory] = useState<Cat>("omnivoro");
  const [baseServings, setBaseServings] = useState(4);
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { name: "", quantity: 1, unit: "unidad" },
  ]);

  const updateIng = (idx: number, patch: Partial<Ingredient>) =>
    setIngredients((p) => p.map((i, k) => (k === idx ? { ...i, ...patch } : i)));
  const removeIng = (idx: number) => setIngredients((p) => p.filter((_, k) => k !== idx));
  const addIng = () => setIngredients((p) => [...p, { name: "", quantity: 1, unit: "unidad" }]);

  const save = () => {
    const cleanName = name.trim();
    if (!cleanName) {
      toast({ title: "Falta el nombre", description: "Escribe un nombre para la receta." });
      return;
    }
    const cleanIngs = ingredients
      .map((i) => ({ ...i, name: i.name.trim() }))
      .filter((i) => i.name && i.quantity > 0);
    if (cleanIngs.length === 0) {
      toast({ title: "Sin ingredientes", description: "Agrega al menos un ingrediente." });
      return;
    }
    const newRecipe: Recipe = {
      id: makeId(cleanName),
      name: cleanName,
      emoji,
      category,
      baseServings: Math.max(1, baseServings || 1),
      ingredients: cleanIngs,
    };
    addMyRecipe(newRecipe);
    toast({ title: "Receta creada", description: cleanName });
    navigate("/mis-recetas");
  };

  return (
    <div className="min-h-screen bg-background pb-28">
      <div className="max-w-lg mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate("/mis-recetas")}
            className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center hover:bg-muted transition-colors shrink-0"
            aria-label="Volver"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="font-display text-2xl text-foreground leading-tight">Crear receta</h1>
        </div>

        <div className="space-y-5">
          <div>
            <Label>Ícono</Label>
            <div className="mt-2 grid grid-cols-8 gap-1.5 max-h-44 overflow-y-auto p-2 bg-card border border-border rounded-xl">
              {foodEmojis.map((e) => (
                <button
                  key={e}
                  onClick={() => setEmoji(e)}
                  className={`aspect-square rounded-lg text-2xl flex items-center justify-center transition-all ${
                    emoji === e ? "bg-primary/15 ring-2 ring-primary" : "hover:bg-muted"
                  }`}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="name">Nombre</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Mi receta favorita" />
          </div>

          <div>
            <Label>Categoría</Label>
            <div className="flex gap-2 mt-2">
              {([
                ["omnivoro", "🍖 Omnívoro"],
                ["vegetariano", "🧀 Vegetariano"],
                ["vegano", "🌱 Vegano"],
              ] as [Cat, string][]).map(([k, l]) => (
                <button
                  key={k}
                  onClick={() => setCategory(k)}
                  className={`flex-1 px-3 py-2 rounded-full text-sm font-body transition-colors ${
                    category === k ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="servings">Cantidad de personas (base)</Label>
            <Input
              id="servings"
              type="number"
              min={1}
              value={baseServings}
              onChange={(e) => setBaseServings(parseInt(e.target.value, 10) || 1)}
            />
          </div>

          <div>
            <Label>Ingredientes</Label>
            <div className="space-y-2 mt-2">
              {ingredients.map((ing, idx) => (
                <div key={idx} className="flex gap-2 items-start">
                  <Input
                    placeholder="Nombre"
                    value={ing.name}
                    onChange={(e) => updateIng(idx, { name: e.target.value })}
                    className="flex-1 min-w-0"
                  />
                  <Input
                    type="number"
                    min={0}
                    step="0.1"
                    value={ing.quantity}
                    onChange={(e) => updateIng(idx, { quantity: parseFloat(e.target.value) || 0 })}
                    className="w-20"
                  />
                  <select
                    value={ing.unit}
                    onChange={(e) => updateIng(idx, { unit: e.target.value })}
                    className="h-10 rounded-md border border-input bg-background px-2 text-sm"
                  >
                    {UNITS.map((u) => (
                      <option key={u} value={u}>{u}</option>
                    ))}
                  </select>
                  <Button variant="ghost" size="icon" onClick={() => removeIng(idx)} aria-label="Eliminar">
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              ))}
              <Button variant="outline" onClick={addIng} className="w-full">
                <Plus className="w-4 h-4" /> Añadir ingrediente
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 px-4 pb-6 pt-4 bg-gradient-to-t from-background via-background to-transparent pointer-events-none">
        <div className="max-w-lg mx-auto pointer-events-auto">
          <button
            onClick={save}
            className="w-full bg-primary text-primary-foreground rounded-2xl px-6 py-4 flex items-center justify-center gap-2 font-display text-lg shadow-lg shadow-primary/30 active:scale-[0.98] transition-transform"
          >
            <Save className="w-5 h-5" />
            Guardar receta
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateRecipe;
