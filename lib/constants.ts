import type {
  Allergen,
  DayKey,
  Diet,
  Difficulty,
  Equipment,
  MealSlot,
} from "./types";

export const DAY_ORDER: DayKey[] = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

export const DAY_LABELS: Record<DayKey, string> = {
  monday: "Lundi",
  tuesday: "Mardi",
  wednesday: "Mercredi",
  thursday: "Jeudi",
  friday: "Vendredi",
  saturday: "Samedi",
  sunday: "Dimanche",
};

export const DAY_ABBR: Record<DayKey, string> = {
  monday: "LUN",
  tuesday: "MAR",
  wednesday: "MER",
  thursday: "JEU",
  friday: "VEN",
  saturday: "SAM",
  sunday: "DIM",
};

export const SLOT_LABELS: Record<MealSlot, string> = {
  lunch: "Midi",
  dinner: "Soir",
};

export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  very_easy: "Très facile",
  easy: "Facile",
  medium: "Moyen",
  advanced: "Ambitieux",
};

export const EQUIPMENT_LABELS: Record<Equipment, string> = {
  stovetop: "Plaques de cuisson",
  oven: "Four",
  microwave: "Micro-ondes",
  airfryer: "Airfryer",
  thermomix: "Thermomix",
  robot_cooker: "Robot cuiseur",
  blender: "Blender",
  hand_blender: "Mixeur plongeant",
  toaster: "Grille-pain",
  croque: "Appareil à croques",
  raclette: "Appareil à raclette",
  plancha: "Plancha",
  bbq: "Barbecue",
  pressure_cooker: "Cocotte-minute",
  kettle: "Bouilloire",
};

export const DIET_LABELS: Record<Diet, string> = {
  none: "Sans régime particulier",
  vegetarian: "Végétarien",
  vegan: "Vegan",
  pescetarian: "Pescetarien",
  flexitarian: "Flexitarien",
  halal: "Halal",
  no_pork: "Sans porc",
  gluten_free: "Sans gluten",
  lactose_free: "Sans lactose",
};

export const ALLERGEN_LABELS: Record<Allergen, string> = {
  peanuts: "Arachides",
  tree_nuts: "Fruits à coque",
  milk: "Lait",
  eggs: "Œufs",
  fish: "Poisson",
  shellfish: "Crustacés",
  gluten: "Gluten",
  soy: "Soja",
  sesame: "Sésame",
};

export const ALLERGEN_ORDER: Allergen[] = [
  "peanuts",
  "tree_nuts",
  "milk",
  "eggs",
  "fish",
  "shellfish",
  "gluten",
  "soy",
  "sesame",
];

export const DIET_ORDER: Diet[] = [
  "none",
  "vegetarian",
  "vegan",
  "pescetarian",
  "flexitarian",
  "halal",
  "no_pork",
  "gluten_free",
  "lactose_free",
];

export const EQUIPMENT_ORDER: Equipment[] = [
  "stovetop",
  "oven",
  "microwave",
  "airfryer",
  "thermomix",
  "robot_cooker",
  "blender",
  "hand_blender",
  "toaster",
  "croque",
  "raclette",
  "plancha",
  "bbq",
  "pressure_cooker",
  "kettle",
];

// Ordre des jours en "semaine glissante" : commence aujourd'hui.
export function weekDayOrder(date = new Date()): DayKey[] {
  const todayIdx = (date.getDay() + 6) % 7; // getDay: 0=dimanche → notre index lundi=0
  return Array.from({ length: 7 }, (_, i) => DAY_ORDER[(todayIdx + i) % 7]);
}

export function orderedDays(startDay: DayKey = "monday"): DayKey[] {
  const idx = DAY_ORDER.indexOf(startDay);
  return Array.from({ length: 7 }, (_, i) => DAY_ORDER[(idx + i) % 7]);
}

export const ALLERGY_DISCLAIMER =
  "Les suggestions sont générées automatiquement. En cas d'allergie, vérifiez toujours les ingrédients et les étiquettes des produits.";
