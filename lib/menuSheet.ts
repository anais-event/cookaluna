import { DAY_ORDER } from "./constants";
import type { DayKey, MealSlot, MenuMeal, WeeklyMenuData } from "./types";

// Ordre fixe lundi -> dimanche pour la feuille imprimable.
// Independant de la date du jour : le document doit rester identique quelle
// que soit la journee ou l'utilisateur genere son PDF.
export const SHEET_DAY_ORDER: DayKey[] = DAY_ORDER;

export type SlotsByDay = Map<DayKey, Map<MealSlot, MenuMeal>>;

export function groupMealsByDay(meals: MenuMeal[]): SlotsByDay {
  const byDay: SlotsByDay = new Map();
  for (const m of meals) {
    if (!byDay.has(m.day)) byDay.set(m.day, new Map());
    byDay.get(m.day)!.set(m.slot, m);
  }
  return byDay;
}

export function reusedIngredients(meals: MenuMeal[], limit = 4): string[] {
  const counts = new Map<string, number>();
  for (const m of meals) {
    for (const r of m.reuseIngredients) counts.set(r, (counts.get(r) || 0) + 1);
  }
  return [...counts.entries()]
    .filter(([, n]) => n >= 2)
    .map(([name]) => name)
    .slice(0, limit);
}

// Tokens partages PDF / ecran / impression.
export const SHEET_TOKENS = {
  coral: "#FF6B5F",
  coralLight: "#FFE3DE",
  ink: "#111111",
  paper: "#FFFDF8",
  white: "#FFFFFF",
  mutedInk: "rgba(17,17,17,0.55)",
} as const;

// Structure fixe 3x3 :
// [Lundi, Mardi, Mercredi]
// [Jeudi, Vendredi, Samedi]
// [Dimanche, Fridge Bonus (surprise), Pense-bete]
export type SheetCell =
  | { kind: "day"; day: DayKey }
  | { kind: "bonus" }
  | { kind: "notes" };

export const SHEET_CELLS: SheetCell[] = [
  { kind: "day", day: "monday" },
  { kind: "day", day: "tuesday" },
  { kind: "day", day: "wednesday" },
  { kind: "day", day: "thursday" },
  { kind: "day", day: "friday" },
  { kind: "day", day: "saturday" },
  { kind: "day", day: "sunday" },
  { kind: "bonus" },
  { kind: "notes" },
];
