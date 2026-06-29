import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { ChefHat, BookOpen, Filter, PlusCircle, ChevronRight } from "lucide-react";
import {
  applyTheme,
  getStoredThemeIndex,
  setStoredThemeIndex,
  themes,
} from "@/lib/themes";

const Home = () => {
  const navigate = useNavigate();
  const [themeIndex, setThemeIndex] = useState<number>(() =>
    getStoredThemeIndex()
  );
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    applyTheme(themes[themeIndex]);
    setStoredThemeIndex(themeIndex);
  }, [themeIndex]);

  const changeTheme = (dir: 1 | -1) => {
    setThemeIndex((i) => (i + dir + themes.length) % themes.length);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 40) changeTheme(dx < 0 ? 1 : -1);
    touchStartX.current = null;
  };

  // Pointer (mouse drag) support
  const pointerStartX = useRef<number | null>(null);
  const onPointerDown = (e: React.PointerEvent) => {
    pointerStartX.current = e.clientX;
  };
  const onPointerUp = (e: React.PointerEvent) => {
    if (pointerStartX.current === null) return;
    const dx = e.clientX - pointerStartX.current;
    if (Math.abs(dx) > 40) changeTheme(dx < 0 ? 1 : -1);
    pointerStartX.current = null;
  };

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
      title: "Mis Recetas",
      desc: "Crea y guarda tus propias versiones",
      onClick: () => navigate("/mis-recetas"),
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-lg mx-auto px-4 py-12 flex flex-col min-h-screen">
        {/* Header */}
        <div className="text-center mb-10 animate-fade-in">
          <div
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
            onPointerDown={onPointerDown}
            onPointerUp={onPointerUp}
            role="button"
            aria-label="Desliza para cambiar el color de la app"
            className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-primary/10 mb-5 cursor-grab active:cursor-grabbing select-none touch-pan-y transition-colors"
            style={{ touchAction: "pan-y" }}
          >
            <ChefHat
              key={themeIndex}
              className="w-10 h-10 text-primary animate-scale-in"
            />
          </div>
          <h1 className="font-display text-4xl text-foreground leading-tight">
            Calculadora de Porciones
          </h1>

          {/* Theme dots */}
          <div className="flex items-center justify-center gap-2 mt-4">
            {themes.map((t, i) => (
              <button
                key={t.id}
                onClick={() => setThemeIndex(i)}
                aria-label={`Tema ${t.name}`}
                className={`h-2.5 rounded-full transition-all ${
                  i === themeIndex ? "w-6" : "w-2.5 opacity-50"
                }`}
                style={{ backgroundColor: t.hex }}
              />
            ))}
          </div>
        </div>

        {/* Options */}
        <div className="flex flex-col gap-4 mt-4">
          {options.map(({ icon: Icon, title, desc, onClick }, i) => (
            <button
              key={title}
              onClick={onClick}
              style={{ animationDelay: `${i * 80}ms` }}
              className="group w-full bg-card border border-border rounded-2xl p-5 flex items-center gap-4 text-left transition-all hover:border-primary/40 hover:shadow-md active:scale-[0.98] animate-fade-in"
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
