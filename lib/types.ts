// Types coeur de COOKALUNA

export type Equipment =
  | "stovetop"
  | "oven"
  | "microwave"
  | "airfryer"
  | "thermomix"
  | "robot_cooker"
  | "blender"
  | "hand_blender"
  | "toaster"
  | "croque"
  | "raclette"
  | "plancha"
  | "bbq"
  | "pressure_cooker"
  | "kettle";

export type Diet =
  | "none"
  | "vegetarian"
  | "vegan"
  | "pescetarian"
  | "flexitarian"
  | "halal"
  | "no_pork"
  | "gluten_free"
  | "lactose_free";

export type Allergen =
  | "peanuts"
  | "tree_nuts"
  | "milk"
  | "eggs"
  | "fish"
  | "shellfish"
  | "gluten"
  | "soy"
  | "sesame";

export type Difficulty = "very_easy" | "easy" | "medium" | "advanced";

export type MealSlot = "lunch" | "dinner";

export type MealPlanType = "dinners" | "lunch_dinner" | "custom";

export type CookingSkill = "mini" | "ok" | "likes" | "chef";

export type BudgetLevel = "low" | "normal" | "treat";

export type CostLevel = "low" | "normal" | "treat";

export type StartingMode = "none" | "some_ideas" | "my_list" | "surprise";

export type MaxCookingTime = 15 | 30 | 45 | 999;

// Un jour de la semaine (clé stable)
export type DayKey =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

export interface DaySlotSelection {
  day: DayKey;
  slot: MealSlot;
}

// Repas du catalogue local
export interface Meal {
  id: string;
  name: string;
  description: string;
  prepTime: number; // minutes
  difficulty: Difficulty;
  tags: string[];
  ingredients: string[];
  kidFriendly: boolean;
  dietTags: Diet[]; // régimes compatibles
  possibleAllergens: Allergen[];
  costLevel: CostLevel;
  requiredEquipment: Equipment[];
  alternativeEquipment: Equipment[];
  reuseIngredients: string[]; // ingrédients "signature" mutualisables
  category: string; // ex: "pasta", "chicken", "soup"
}

// Profil saisi pendant l'onboarding
export interface MealProfile {
  adults: number;
  children: number;
  mealPlan: MealPlanType;
  selectedDays: DaySlotSelection[]; // liste effective des créneaux à remplir
  dietaryPreferences: Diet[];
  allergies: Allergen[];
  foodsToAvoid: string[];
  cookingSkill: CookingSkill;
  maxCookingTime: MaxCookingTime;
  budgetLevel: BudgetLevel;
  equipment: Equipment[];
  startingMode: StartingMode;
  ideas: string[];
  adaptWish?: string; // envie libre saisie sur la page menu (interprétée par l'IA)
}

// Un repas placé dans le menu généré
export interface MenuMeal {
  day: DayKey;
  slot: MealSlot;
  name: string;
  description: string;
  prepTime: number;
  difficulty: Difficulty;
  ingredients: string[];
  tags: string[];
  equipment: Equipment[];
  reuseIngredients: string[];
  mealId?: string; // si issu du catalogue
  manual?: boolean; // saisi à la main
}

export interface WeeklyMenuData {
  weekLabel: string;
  meals: MenuMeal[];
  source: "demo" | "ai";
  reusedNote?: boolean;
  theme?: string; // libellé du thème surprise, si startingMode === "surprise"
}

// Réponse structurée attendue de l'IA
export interface AiMenuResponse {
  weekLabel: string;
  meals: {
    day: string;
    slot: MealSlot;
    name: string;
    description: string;
    prepTime: number;
    difficulty: Difficulty;
    ingredients: string[];
    tags: string[];
    equipment: string[];
    reuseIngredients: string[];
  }[];
}
