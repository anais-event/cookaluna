import { weekDayOrder } from "./constants";
import type {
  DaySlotSelection,
  MealPlanType,
  MealProfile,
} from "./types";

export function createDefaultProfile(): MealProfile {
  return {
    adults: 2,
    children: 0,
    mealPlan: "dinners",
    selectedDays: buildSelectedDays("dinners"),
    dietaryPreferences: ["none"],
    allergies: [],
    foodsToAvoid: [],
    cookingSkill: "ok",
    maxCookingTime: 30,
    budgetLevel: "normal",
    // Équipements courants pré-cochés (l'utilisateur peut retirer).
    equipment: ["stovetop", "oven", "microwave", "toaster", "kettle"],
    startingMode: "none",
    ideas: [],
  };
}

// Construit la liste des créneaux selon le type de plan.
export function buildSelectedDays(
  plan: MealPlanType,
  custom?: DaySlotSelection[],
): DaySlotSelection[] {
  if (plan === "custom") return custom ?? [];
  const out: DaySlotSelection[] = [];
  // Semaine glissante : commence aujourd'hui (ex. mercredi → mardi prochain).
  for (const day of weekDayOrder()) {
    if (plan === "lunch_dinner") out.push({ day, slot: "lunch" });
    out.push({ day, slot: "dinner" });
  }
  return out;
}
