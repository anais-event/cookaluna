import { MEAL_CATALOG } from "./catalog";
import { weekDayOrder } from "./constants";
import type {
  DaySlotSelection,
  Equipment,
  Meal,
  MealProfile,
  MenuMeal,
  WeeklyMenuData,
} from "./types";

// ---------- Validation ----------

export interface ProfileValidation {
  valid: boolean;
  errors: string[];
}

export function validateProfile(p: MealProfile): ProfileValidation {
  const errors: string[] = [];
  if (p.adults < 1) errors.push("Il faut au moins un adulte.");
  if (p.children < 0) errors.push("Le nombre d'enfants est invalide.");
  if (!p.selectedDays || p.selectedDays.length === 0)
    errors.push("Sélectionnez au moins un repas à prévoir.");
  if (!p.equipment || p.equipment.length === 0)
    errors.push("Sélectionnez au moins un équipement de cuisine.");
  return { valid: errors.length === 0, errors };
}

// ---------- Compatibilité équipement ----------

export function isEquipmentCompatible(
  meal: Meal,
  equipment: Equipment[],
): boolean {
  const has = (e: Equipment) => equipment.includes(e);
  const requiredMet = meal.requiredEquipment.every(has);
  if (requiredMet) return true;
  // Un équipement alternatif disponible peut remplacer le requis.
  const altMet =
    meal.alternativeEquipment.length > 0 &&
    meal.alternativeEquipment.some(has);
  return altMet;
}

// ---------- Filtrage ----------

function norm(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .trim();
}

export function matchesProfile(meal: Meal, p: MealProfile): boolean {
  // Allergies : sécurité prioritaire, filtre dur.
  if (p.allergies.some((a) => meal.possibleAllergens.includes(a))) return false;

  // Régimes : le repas doit être compatible avec chaque régime sélectionné.
  const diets = p.dietaryPreferences.filter((d) => d !== "none");
  if (diets.length > 0 && !diets.every((d) => meal.dietTags.includes(d)))
    return false;

  // Aliments à éviter : recherche texte.
  if (p.foodsToAvoid.length > 0) {
    const hay = norm(
      [meal.name, meal.description, ...meal.ingredients, ...meal.tags].join(" "),
    );
    if (p.foodsToAvoid.some((f) => f.trim() && hay.includes(norm(f))))
      return false;
  }

  // Équipements : filtre dur.
  if (!isEquipmentCompatible(meal, p.equipment)) return false;

  return true;
}

// ---------- Scoring ----------

export function scoreMeal(meal: Meal, p: MealProfile): number {
  let score = 0;

  // Temps de cuisine
  if (meal.prepTime <= p.maxCookingTime) score += 3;
  else if (meal.prepTime <= p.maxCookingTime + 15) score += 1;
  else score -= 2;

  // Niveau de cuisine
  const easy = meal.difficulty === "very_easy" || meal.difficulty === "easy";
  const hard = meal.difficulty === "advanced";
  if (p.cookingSkill === "mini") {
    if (easy) score += 3;
    if (hard) score -= 4;
  } else if (p.cookingSkill === "ok") {
    if (easy) score += 1;
    if (hard) score -= 1;
  } else if (p.cookingSkill === "chef") {
    if (meal.difficulty === "medium" || hard) score += 2;
  }

  // Budget
  if (p.budgetLevel === "low") {
    if (meal.costLevel === "low") score += 2;
    if (meal.costLevel === "treat") score -= 3;
  } else if (p.budgetLevel === "treat") {
    if (meal.costLevel === "treat") score += 1;
  }

  // Enfants au foyer : bonus repas kid-friendly
  if (p.children > 0 && meal.kidFriendly) score += 2;

  // Léger bruit pour varier les générations
  score += Math.random() * 1.5;

  return score;
}

// ---------- Helpers ----------

function toMenuMeal(meal: Meal, sel: DaySlotSelection): MenuMeal {
  return {
    day: sel.day,
    slot: sel.slot,
    name: meal.name,
    description: meal.description,
    prepTime: meal.prepTime,
    difficulty: meal.difficulty,
    ingredients: meal.ingredients,
    tags: meal.tags,
    equipment: meal.requiredEquipment,
    reuseIngredients: meal.reuseIngredients,
    mealId: meal.id,
  };
}

// Mots trop génériques pour servir de correspondance fiable.
const MATCH_STOPWORDS = new Set([
  "plat",
  "plats",
  "maison",
  "express",
  "legumes",
  "legume",
  "sauce",
  "facile",
  "rapide",
  "repas",
  "avec",
  "sans",
  "petit",
  "grand",
  "chaud",
  "froid",
]);

function matchIdeaToMeal(idea: string, pool: Meal[]): Meal | undefined {
  const n = norm(idea);
  if (!n) return undefined;
  // 1) Correspondance forte : le nom du repas contient toute l'idée.
  const strong = pool.find((m) => norm(m.name).includes(n));
  if (strong) return strong;
  // 2) Chevauchement de mots significatifs (token exact, hors mots génériques).
  const ideaTokens = n
    .split(/[^a-z0-9]+/)
    .filter((w) => w.length >= 4 && !MATCH_STOPWORDS.has(w));
  if (ideaTokens.length === 0) return undefined;
  return pool.find((m) => {
    const mealTokens = new Set(
      norm(m.name)
        .split(/[^a-z0-9]+/)
        .filter((w) => w.length >= 4 && !MATCH_STOPWORDS.has(w)),
    );
    return ideaTokens.some((w) => mealTokens.has(w));
  });
}

export function buildWeekLabel(date = new Date()): string {
  const d = date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
  });
  return `Semaine du ${d}`;
}

function sameProtein(a: Meal, b: Meal): boolean {
  const proteins = ["chicken", "beef", "pork", "fish"];
  return (
    a.category === b.category && proteins.includes(a.category)
  );
}

// ---------- Génération démo (sans IA) ----------

export function generateDemoMenu(p: MealProfile): WeeklyMenuData {
  const eligible = MEAL_CATALOG.filter((m) => matchesProfile(m, p));
  const pool = eligible.length > 0 ? eligible : MEAL_CATALOG.slice();

  const slots = orderSelectedDays(p.selectedDays);
  const meals: MenuMeal[] = [];
  const usedNames = new Set<string>();
  const usedMealById = new Map<string, Meal>(); // pour diversification par jour

  // 1) Intégrer les idées de l'utilisateur en premier.
  const ideaMeals: (Meal | { manualName: string })[] = [];
  for (const idea of p.ideas) {
    const m = matchIdeaToMeal(idea, pool);
    if (m) ideaMeals.push(m);
    else ideaMeals.push({ manualName: idea.trim() });
  }

  let slotIndex = 0;

  const placeManual = (name: string, sel: DaySlotSelection) => {
    meals.push({
      day: sel.day,
      slot: sel.slot,
      name,
      description: "Votre idée.",
      prepTime: 0,
      difficulty: "easy",
      ingredients: [],
      tags: ["mon-idée"],
      equipment: [],
      reuseIngredients: [],
      manual: true,
    });
  };

  for (const im of ideaMeals) {
    if (slotIndex >= slots.length) break;
    const sel = slots[slotIndex++];
    if ("manualName" in im) {
      if (im.manualName) placeManual(im.manualName, sel);
    } else {
      meals.push(toMenuMeal(im, sel));
      usedNames.add(im.name);
      usedMealById.set(sel.day + sel.slot, im);
    }
  }

  // 2) Remplir le reste avec scoring + diversification.
  const scored = pool
    .map((m) => ({ m, s: scoreMeal(m, p) }))
    .sort((a, b) => b.s - a.s);

  for (; slotIndex < slots.length; slotIndex++) {
    const sel = slots[slotIndex];
    const prev = meals[meals.length - 1];
    const prevMeal = prev?.mealId
      ? MEAL_CATALOG.find((m) => m.id === prev.mealId)
      : undefined;

    let choice: Meal | undefined;

    // Recalcul du bruit à chaque slot pour de la variété.
    const ranked = scored
      .map(({ m }) => {
        let s = scoreMeal(m, p);
        if (usedNames.has(m.name)) s -= 100; // éviter doublons
        if (prevMeal) {
          if (m.category === prevMeal.category) s -= 4;
          if (sameProtein(m, prevMeal)) s -= 6;
          // Bonus réutilisation d'ingrédients
          if (
            m.reuseIngredients.some((r) => prevMeal.reuseIngredients.includes(r))
          )
            s += 3;
        }
        return { m, s };
      })
      .sort((a, b) => b.s - a.s);

    choice = ranked[0]?.m;

    if (choice) {
      meals.push(toMenuMeal(choice, sel));
      usedNames.add(choice.name);
      usedMealById.set(sel.day + sel.slot, choice);
    } else {
      placeManual("À compléter", sel);
    }
  }

  const reusedNote = detectReuse(meals);

  return {
    weekLabel: buildWeekLabel(),
    meals,
    source: "demo",
    reusedNote,
  };
}

export function detectReuse(meals: MenuMeal[]): boolean {
  const seen = new Set<string>();
  for (const m of meals) {
    for (const r of m.reuseIngredients) {
      if (seen.has(r)) return true;
      seen.add(r);
    }
  }
  return false;
}

function orderSelectedDays(sel: DaySlotSelection[]): DaySlotSelection[] {
  const order = weekDayOrder();
  return [...sel].sort((a, b) => {
    const d = order.indexOf(a.day) - order.indexOf(b.day);
    if (d !== 0) return d;
    return a.slot === "lunch" ? -1 : 1;
  });
}

// Résout une envie libre en un repas du catalogue (ou null si non reconnue).
// Utilisé côté démo : on n'injecte JAMAIS le texte brut comme repas.
export function resolveWish(p: MealProfile, wish: string): string | null {
  const eligible = MEAL_CATALOG.filter((m) => matchesProfile(m, p));
  const pool = eligible.length > 0 ? eligible : MEAL_CATALOG.slice();
  const m = matchIdeaToMeal(wish, pool);
  return m ? m.name : null;
}

// ---------- Alternatives pour un repas ----------

export function getAlternatives(
  p: MealProfile,
  currentName: string,
  count = 4,
): MenuMeal[] {
  const eligible = MEAL_CATALOG.filter((m) => matchesProfile(m, p));
  const pool = eligible.length > 0 ? eligible : MEAL_CATALOG.slice();
  const ranked = pool
    .filter((m) => m.name !== currentName)
    .map((m) => ({ m, s: scoreMeal(m, p) }))
    .sort((a, b) => b.s - a.s)
    .slice(0, count)
    .map(({ m }) =>
      toMenuMeal(m, { day: "monday", slot: "dinner" }),
    );
  return ranked;
}
