import { DAY_ORDER, orderedDays } from "./constants";
import type { DayKey, MealSlot, MenuMeal, WeeklyMenuData } from "./types";

// Seed pour la surprise imprimee. On combine la semaine ET la signature
// du menu genere : chaque regeneration produit un nouveau bonus, meme
// pour la meme semaine. Reproductible : meme menu -> meme surprise.
export function menuBonusSeed(menu: WeeklyMenuData): string {
  const sig = menu.meals
    .map((m) => `${m.day}:${m.slot}:${m.name}`)
    .sort()
    .join("|");
  return `${menu.weekLabel}::${sig}`;
}

// Le weekLabel est genere sous la forme "Semaine du 23 septembre". Dans
// les feuilles imprimables il y a deja un kicker "SEMAINE DU" au-dessus,
// on retire donc le prefixe pour n'afficher que la date -> pas de
// doublon "SEMAINE DU / Semaine du 23 septembre".
export function stripWeekPrefix(label: string): string {
  return label.replace(/^\s*semaine\s+du\s+/i, "").trim();
}

export const SHEET_DAY_ORDER: DayKey[] = DAY_ORDER;

export function sheetDayOrder(startDay: DayKey = "monday"): DayKey[] {
  return orderedDays(startDay);
}

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

export function buildSheetCells(startDay: DayKey = "monday"): SheetCell[] {
  return [
    ...orderedDays(startDay).map((day): SheetCell => ({ kind: "day", day })),
    { kind: "bonus" },
    { kind: "notes" },
  ];
}
