import type { MealProfile, Recipe, RecipeIngredient } from "./types";

const CHILD_FACTOR = 0.65;

export function householdPortions(profile: MealProfile): number {
  return profile.adults + profile.children * CHILD_FACTOR;
}

export function portionLabel(profile: MealProfile): string {
  const parts: string[] = [];
  if (profile.adults > 0) {
    parts.push(`${profile.adults} adulte${profile.adults > 1 ? "s" : ""}`);
  }
  if (profile.children > 0) {
    parts.push(`${profile.children} enfant${profile.children > 1 ? "s" : ""}`);
  }
  return parts.join(" + ");
}

// Arrondi cuisine : quantités lisibles, pas de 0.825 oignon
function roundKitchen(value: number, unit: string): number {
  if (value <= 0) return 0;

  const smallUnits = new Set(["g", "ml", "cl"]);
  if (smallUnits.has(unit)) {
    if (value >= 100) return Math.round(value / 25) * 25;
    if (value >= 10) return Math.round(value / 5) * 5;
    return Math.round(value);
  }

  const spoonUnits = new Set(["c. à soupe", "c. à café", "cuillère"]);
  if (spoonUnits.has(unit)) {
    if (value < 0.4) return 0.5;
    return Math.round(value * 2) / 2; // arrondi au 0.5
  }

  // Unités entières (pièces, sachets, etc.)
  if (value < 0.4) return 0.5;
  if (value < 0.8) return 1;
  return Math.round(value);
}

export function scaleIngredient(
  ing: RecipeIngredient,
  ratio: number,
): RecipeIngredient {
  if (ing.scalable === false) {
    return { ...ing };
  }
  const scaled = ing.quantity * ratio;
  return {
    ...ing,
    quantity: roundKitchen(scaled, ing.unit),
  };
}

export function scaleRecipe(
  recipe: Recipe,
  profile: MealProfile,
): { ingredients: RecipeIngredient[]; ratio: number } {
  const portions = householdPortions(profile);
  const ratio = portions / recipe.servings;
  return {
    ingredients: recipe.ingredients.map((ing) => scaleIngredient(ing, ratio)),
    ratio,
  };
}

export function formatQuantity(qty: number, unit: string): string {
  if (qty === 0) return "";
  if (qty === 0.5) {
    if (unit) return `½ ${unit}`;
    return "½";
  }
  if (Number.isInteger(qty)) return `${qty} ${unit}`.trim();
  // Afficher un décimal propre
  return `${parseFloat(qty.toFixed(1))} ${unit}`.trim();
}
