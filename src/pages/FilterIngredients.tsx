import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { recipes } from "@/data/recipes";
import { getIngredientEmoji } from "@/lib/ingredientEmojis";
import { ArrowLeft, ChefHat, Search } from "lucide-react";

const FilterIngredients = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<string[]>([]);
  const [search, setSearch] = useState("");

  const allIngredients = useMemo(() => {
    const set = new Set<string>();
    recipes.forEach((r) => r.ingredients.forEach((i) => set.add(i.name)));
    return Array.from(set).sort();
  }, []);

  const visible = allIngredients.filter((n) =>
    n.toLowerCase().includes(search.toLowerCase())
  );

  const toggle = (name: string) =>
    setSelected((p) => (p.includes(name) ? p.filter((n) => n !== name) : [...p, name]));

  const matchingCount = useMemo(() => {
    if (selected.length === 0) return recipes.length;
    return recipes.filter((r) =>
      selected.every((ing) => r.ingredients.some((i) => i.name === ing))
    ).length;
  }, [selected]);

  const goCook = () => {
    navigate("/recetas", { state: { preselectedIngredients: selected } });
  };

  return (
    <div className="min-h-screen bg-background pb-32">
      <div className="max-w-lg mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate("/")}
            className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center hover:bg-muted transition-colors"
            aria-label="Volver"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <div>
            <h1 className="font-display text-2xl text-foreground leading-tight">
              Filtrar por ingrediente
            </h1>
            <p className="text-xs text-muted-foreground font-body">
              Selecciona los que tengas a mano
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-5">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar ingrediente…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-input bg-card text-sm font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        {/* Grid of ingredient buttons */}
        <div className="grid grid-cols-3 gap-2.5">
          {visible.map((name) => {
            const active = selected.includes(name);
            return (
              <button
                key={name}
                onClick={() => toggle(name)}
                className={`aspect-square rounded-2xl border-2 p-2 flex flex-col items-center justify-center gap-1 transition-all active:scale-95 ${
                  active
                    ? "border-primary bg-primary/10 shadow-sm"
                    : "border-border bg-card hover:border-primary/40"
                }`}
              >
                <span className="text-3xl leading-none">
                  {getIngredientEmoji(name)}
                </span>
                <span
                  className={`text-[11px] font-body text-center leading-tight line-clamp-2 ${
                    active ? "text-primary font-medium" : "text-foreground"
                  }`}
                >
                  {name}
                </span>
              </button>
            );
          })}
        </div>

        {visible.length === 0 && (
          <p className="text-center text-muted-foreground font-body text-sm py-8">
            No se encontraron ingredientes.
          </p>
        )}
      </div>

      {/* Floating "A Cocinar!" button */}
      <div className="fixed bottom-0 left-0 right-0 px-4 pb-6 pt-4 bg-gradient-to-t from-background via-background to-transparent pointer-events-none">
        <div className="max-w-lg mx-auto pointer-events-auto">
          <button
            onClick={goCook}
            className="w-full bg-primary text-primary-foreground rounded-2xl px-6 py-4 flex items-center justify-center gap-2 font-display text-lg shadow-lg shadow-primary/30 active:scale-[0.98] transition-transform"
          >
            <ChefHat className="w-5 h-5" />
            ¡A Cocinar!
            <span className="text-sm font-body opacity-90">
              ({matchingCount} {matchingCount === 1 ? "receta" : "recetas"})
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterIngredients;
