export interface Theme {
  id: string;
  name: string;
  hex: string;
  // HSL values as "H S% L%"
  primary: string;
  primaryForeground: string;
  accent: string;
  accentForeground: string;
  ring: string;
  heroGradient: string;
}

export const themes: Theme[] = [
  {
    id: "sage",
    name: "Salvia",
    hex: "#8EB69B",
    primary: "140 22% 54%",
    primaryForeground: "150 30% 12%",
    accent: "140 30% 75%",
    accentForeground: "150 30% 12%",
    ring: "140 22% 54%",
    heroGradient:
      "linear-gradient(135deg, hsl(140 22% 54%), hsl(140 30% 75%))",
  },
  {
    id: "wine",
    name: "Vino",
    hex: "#622347",
    primary: "325 47% 26%",
    primaryForeground: "30 30% 97%",
    accent: "325 40% 55%",
    accentForeground: "30 30% 97%",
    ring: "325 47% 26%",
    heroGradient:
      "linear-gradient(135deg, hsl(325 47% 26%), hsl(325 40% 55%))",
  },
  {
    id: "crimson",
    name: "Carmesí",
    hex: "#9D1242",
    primary: "338 79% 34%",
    primaryForeground: "30 30% 97%",
    accent: "338 65% 60%",
    accentForeground: "30 30% 97%",
    ring: "338 79% 34%",
    heroGradient:
      "linear-gradient(135deg, hsl(338 79% 34%), hsl(338 65% 60%))",
  },
];

export const applyTheme = (theme: Theme) => {
  const root = document.documentElement;
  root.style.setProperty("--primary", theme.primary);
  root.style.setProperty("--primary-foreground", theme.primaryForeground);
  root.style.setProperty("--accent", theme.accent);
  root.style.setProperty("--accent-foreground", theme.accentForeground);
  root.style.setProperty("--ring", theme.ring);
  root.style.setProperty("--sidebar-primary", theme.primary);
  root.style.setProperty("--sidebar-ring", theme.ring);
  root.style.setProperty("--hero-gradient", theme.heroGradient);
};

const STORAGE_KEY = "app-theme-index";

export const getStoredThemeIndex = (): number => {
  if (typeof window === "undefined") return 0;
  const v = window.localStorage.getItem(STORAGE_KEY);
  const n = v ? parseInt(v, 10) : 0;
  return Number.isFinite(n) && n >= 0 && n < themes.length ? n : 0;
};

export const setStoredThemeIndex = (i: number) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, String(i));
};
