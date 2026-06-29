import { useEffect, useState } from "react";
import { Recipe, Ingredient } from "@/data/recipes";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Save } from "lucide-react";
import { addMyRecipe, makeId } from "@/lib/myRecipes";
import { toast } from "@/hooks/use-toast";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  recipe: Recipe;
}

const UNITS = ["g", "ml", "unidad", "unidades", "taza", "tazas", "cucharada", "cucharadas", "cucharadita", "cucharaditas", "dientes", "piezas", "hojas", "manojo", "ramas", "rebanadas", "tallos"];

const EditIngredientsDialog = ({ open, onOpenChange, recipe }: Props) => {
  const [name, setName] = useState(recipe.name);
  const [baseServings, setBaseServings] = useState<number>(recipe.baseServings);
  const [ingredients, setIngredients] = useState<Ingredient[]>(recipe.ingredients);

  useEffect(() => {
    if (open) {
      setName(recipe.name + " (mi versión)");
      setBaseServings(recipe.baseServings);
      setIngredients(recipe.ingredients.map((i) => ({ ...i })));
    }
  }, [open, recipe]);

  const updateIng = (idx: number, patch: Partial<Ingredient>) => {
    setIngredients((prev) => prev.map((i, k) => (k === idx ? { ...i, ...patch } : i)));
  };
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
      emoji: recipe.emoji,
      category: recipe.category,
      baseServings: Math.max(1, baseServings || 1),
      ingredients: cleanIngs,
    };
    addMyRecipe(newRecipe);
    toast({ title: "Guardada en Mis Recetas", description: cleanName });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display">Editar ingredientes</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="r-name">Nombre de la receta</Label>
            <Input id="r-name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div>
            <Label htmlFor="r-servings">Cantidad de personas (base)</Label>
            <Input
              id="r-servings"
              type="number"
              min={1}
              value={baseServings}
              onChange={(e) => setBaseServings(parseInt(e.target.value, 10) || 1)}
            />
            <p className="text-xs text-muted-foreground mt-1 font-body">
              Las cantidades se ingresan para esta cantidad de personas. Después se escalarán automáticamente.
            </p>
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

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={save}>
            <Save className="w-4 h-4" /> Guardar en Mis Recetas
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditIngredientsDialog;
