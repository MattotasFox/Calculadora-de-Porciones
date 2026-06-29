import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Recipe } from "@/data/recipes";
import { getMyRecipes, deleteMyRecipe } from "@/lib/myRecipes";
import RecipeDetail from "@/components/RecipeDetail";
import { ArrowLeft, Plus, Trash2, BookOpen } from "lucide-react";

const MyRecipes = () => {
  const navigate = useNavigate();
  const [list, setList] = useState<Recipe[]>([]);
  const [selected, setSelected] = useState<Recipe | null>(null);

  const reload = () => setList(getMyRecipes());
  useEffect(() => { reload(); }, []);

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm("¿Eliminar esta receta?")) {
      deleteMyRecipe(id);
      reload();
    }
  };

  if (selected) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-lg mx-auto px-4 py-8">
          <RecipeDetail recipe={selected} onBack={() => { setSelected(null); reload(); }} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-28">
      <div className="max-w-lg mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate("/")}
            className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center hover:bg-muted transition-colors shrink-0"
            aria-label="Volver"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <div className="flex items-center gap-3">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/10">
              <BookOpen className="w-6 h-6 text-primary" />
            </div>
            <h1 className="font-display text-2xl text-foreground leading-tight">Mis Recetas</h1>
          </div>
        </div>

        {list.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground font-body mb-2">Aún no tienes recetas guardadas.</p>
            <p className="text-sm text-muted-foreground font-body">Crea una nueva o guarda una versión editada desde el detalle de una receta.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {list.map((recipe, i) => (
              <div
                key={recipe.id}
                onClick={() => setSelected(recipe)}
                className="group w-full text-left rounded-xl bg-card border border-border p-5 hover:border-primary/40 hover:shadow-lg transition-all cursor-pointer animate-fade-in"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <div className="flex items-start gap-4">
                  <span className="text-4xl">{recipe.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display text-lg text-foreground group-hover:text-primary transition-colors">
                      {recipe.name}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1.5 font-body">
                      Base: {recipe.baseServings} personas · {recipe.ingredients.length} ingredientes
                    </p>
                  </div>
                  <button
                    onClick={(e) => handleDelete(e, recipe.id)}
                    className="text-muted-foreground hover:text-destructive transition-colors p-2"
                    aria-label="Eliminar"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 px-4 pb-6 pt-4 bg-gradient-to-t from-background via-background to-transparent pointer-events-none">
        <div className="max-w-lg mx-auto pointer-events-auto">
          <button
            onClick={() => navigate("/mis-recetas/crear")}
            className="w-full bg-primary text-primary-foreground rounded-2xl px-6 py-4 flex items-center justify-center gap-2 font-display text-lg shadow-lg shadow-primary/30 active:scale-[0.98] transition-transform"
          >
            <Plus className="w-5 h-5" />
            Crear nueva receta
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyRecipes;
