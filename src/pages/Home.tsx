import { useNavigate } from "react-router-dom";
import { ChefHat, BookOpen, Filter, PlusCircle, ChevronRight } from "lucide-react";

const Home = () => {
  const navigate = useNavigate();

  const options = [
    {
      icon: BookOpen,
      title: "Ver todas las recetas",
      desc: "Explora el recetario completo",
      onClick: () => navigate("/recetas"),
    },
    {
      icon: Filter,
      title: "Filtrar por ingrediente",
      desc: "Encuentra recetas con lo que tienes",
      onClick: () => navigate("/filtrar"),
    },
    {
      icon: PlusCircle,
      title: "Agregar receta",
      desc: "Próximamente",
      onClick: () => {},
      disabled: true,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-lg mx-auto px-4 py-12 flex flex-col min-h-screen">
        {/* Header */}
        <div className="text-center mb-10 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-primary/10 mb-5">
            <ChefHat className="w-10 h-10 text-primary" />
          </div>
          <h1 className="font-display text-4xl text-foreground leading-tight">
            Calculadora de Porciones
          </h1>
        </div>

        {/* Options */}
        <div className="flex flex-col gap-4 mt-4">
          {options.map(({ icon: Icon, title, desc, onClick, disabled }, i) => (
            <button
              key={title}
              onClick={onClick}
              disabled={disabled}
              style={{ animationDelay: `${i * 80}ms` }}
              className="group w-full bg-card border border-border rounded-2xl p-5 flex items-center gap-4 text-left transition-all hover:border-primary/40 hover:shadow-md active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 animate-fade-in"
            >
              <div className="shrink-0 w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/15 transition-colors">
                <Icon className="w-7 h-7 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="font-display text-lg text-foreground leading-tight">
                  {title}
                </h2>
                <p className="text-sm text-muted-foreground font-body mt-0.5">
                  {desc}
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
