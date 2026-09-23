import { buildWeekLabel } from "./generator";
import { getMealByName } from "./catalog";
import type { MenuMeal, WeeklyMenuData } from "./types";

const M = (
  day: MenuMeal["day"],
  slot: MenuMeal["slot"],
  name: string,
  prepTime: number,
  difficulty: MenuMeal["difficulty"],
): MenuMeal => {
  const cat = getMealByName(name);
  return {
    day,
    slot,
    name,
    description: cat?.description ?? "",
    prepTime,
    difficulty,
    ingredients: cat?.ingredients ?? [],
    tags: cat?.tags ?? [],
    equipment: cat?.requiredEquipment ?? ["stovetop"],
    reuseIngredients: cat?.reuseIngredients ?? [],
    mealId: cat?.id,
  };
};

export function createSampleMenu(): WeeklyMenuData {
  const meals: MenuMeal[] = [
    M("monday", "lunch", "Bowl poulet, riz & crudités", 25, "easy"),
    M("monday", "dinner", "Tacos maison express", 20, "very_easy"),
    M("tuesday", "lunch", "Salade de pâtes, tomates & mozzarella", 20, "very_easy"),
    M("tuesday", "dinner", "Saumon rôti, pommes de terre & brocoli", 30, "easy"),
    M("wednesday", "lunch", "Wraps au poulet", 20, "very_easy"),
    M("wednesday", "dinner", "Omelette pommes de terre & salade", 20, "very_easy"),
    M("thursday", "lunch", "Riz sauté aux légumes & œufs", 20, "very_easy"),
    M("thursday", "dinner", "Gratin de courgettes & chèvre", 40, "easy"),
    M("friday", "lunch", "Croque-monsieur & salade", 15, "very_easy"),
    M("friday", "dinner", "Pizza maison express", 25, "easy"),
    M("saturday", "lunch", "Poulet rôti & pommes de terre", 60, "easy"),
    M("saturday", "dinner", "Pâtes crémeuses aux champignons", 25, "easy"),
    M("sunday", "lunch", "Lasagnes maison", 75, "advanced"),
    M("sunday", "dinner", "Soupe de légumes & tartines", 30, "very_easy"),
  ];
  return {
    weekLabel: buildWeekLabel(),
    meals,
    source: "demo",
    reusedNote: true,
  };
}
