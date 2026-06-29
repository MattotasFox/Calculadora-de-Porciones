import { Recipe } from "@/data/recipes";

interface RecipeCardProps {
  recipe: Recipe;
  onClick: (recipe: Recipe) => void;
  index: number;
}

const categoryLabel = {
  omnivoro: "Omnívoro",
  vegetariano: "Vegetariano",
  vegano: "Vegano",
};

const RecipeCard = ({ recipe, onClick, index }: RecipeCardProps) => {
  return (
    <button
      onClick={() => onClick(recipe)}
      className="group w-full text-left rounded-xl bg-card border border-border p-5 hover:border-primary/40 hover:shadow-lg transition-all duration-300 animate-fade-in"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className="flex items-start gap-4">
        <span className="text-4xl">{recipe.emoji}</span>
        <div className="flex-1 min-w-0">
          <h3 className="font-display text-lg text-foreground group-hover:text-primary transition-colors">
            {recipe.name}
          </h3>
          <div className="flex items-center gap-3 mt-1.5">
            <span className="text-xs font-body text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
              {categoryLabel[recipe.category]}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-2 font-body">
            Base: {recipe.baseServings} personas · {recipe.ingredients.length} ingredientes
          </p>
        </div>
        <span className="text-muted-foreground group-hover:text-primary transition-colors text-xl">→</span>
      </div>
    </button>
  );
};

export default RecipeCard;
