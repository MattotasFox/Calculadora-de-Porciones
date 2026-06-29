import { Recipe } from "@/data/recipes";

const KEY = "myRecipes.v1";

export const getMyRecipes = (): Recipe[] => {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Recipe[];
  } catch {
    return [];
  }
};

export const saveMyRecipes = (list: Recipe[]) => {
  localStorage.setItem(KEY, JSON.stringify(list));
};

export const addMyRecipe = (recipe: Recipe) => {
  const list = getMyRecipes();
  list.unshift(recipe);
  saveMyRecipes(list);
};

export const deleteMyRecipe = (id: string) => {
  saveMyRecipes(getMyRecipes().filter((r) => r.id !== id));
};

export const makeId = (name: string) =>
  `mi-${name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")}-${Date.now().toString(36)}`;
