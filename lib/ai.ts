import OpenAI from "openai";
import {
  ALLERGEN_LABELS,
  DAY_LABELS,
  DIET_LABELS,
  EQUIPMENT_LABELS,
} from "./constants";
import { buildWeekLabel, detectReuse, pickSurpriseTheme, type SurpriseTheme } from "./generator";
import type {
  AiMenuResponse,
  DayKey,
  Equipment,
  MealProfile,
  MenuMeal,
  WeeklyMenuData,
} from "./types";

export function hasApiKey(): boolean {
  return Boolean(process.env.OPENAI_API_KEY);
}

// Mapping libellé/clé -> Equipment enum
const EQUIPMENT_BY_LABEL: Record<string, Equipment> = Object.entries(
  EQUIPMENT_LABELS,
).reduce(
  (acc, [key, label]) => {
    acc[label.toLowerCase()] = key as Equipment;
    acc[key.toLowerCase()] = key as Equipment;
    return acc;
  },
  {} as Record<string, Equipment>,
);

function mapEquipment(list: string[]): Equipment[] {
  const out: Equipment[] = [];
  for (const raw of list) {
    const hit = EQUIPMENT_BY_LABEL[raw.toLowerCase().trim()];
    if (hit && !out.includes(hit)) out.push(hit);
  }
  return out;
}

const DAY_BY_LABEL: Record<string, DayKey> = Object.entries(DAY_LABELS).reduce(
  (acc, [key, label]) => {
    acc[label.toLowerCase()] = key as DayKey;
    acc[key.toLowerCase()] = key as DayKey;
    return acc;
  },
  {} as Record<string, DayKey>,
);

function mapDay(raw: string): DayKey {
  return DAY_BY_LABEL[raw.toLowerCase().trim()] ?? "monday";
}

const MENU_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    weekLabel: { type: "string" },
    meals: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          day: { type: "string" },
          slot: { type: "string", enum: ["lunch", "dinner"] },
          name: { type: "string" },
          description: { type: "string" },
          prepTime: { type: "number" },
          difficulty: {
            type: "string",
            enum: ["very_easy", "easy", "medium", "advanced"],
          },
          ingredients: { type: "array", items: { type: "string" } },
          tags: { type: "array", items: { type: "string" } },
          equipment: { type: "array", items: { type: "string" } },
          reuseIngredients: { type: "array", items: { type: "string" } },
        },
        required: [
          "day",
          "slot",
          "name",
          "description",
          "prepTime",
          "difficulty",
          "ingredients",
          "tags",
          "equipment",
          "reuseIngredients",
        ],
      },
    },
  },
  required: ["weekLabel", "meals"],
} as const;

function buildPrompt(p: MealProfile, theme?: SurpriseTheme): string {
  const diets = p.dietaryPreferences
    .filter((d) => d !== "none")
    .map((d) => DIET_LABELS[d]);
  const allergies = p.allergies.map((a) => ALLERGEN_LABELS[a]);
  const equipment = p.equipment.map((e) => EQUIPMENT_LABELS[e]);
  const slots = p.selectedDays
    .map((s) => `${DAY_LABELS[s.day]} ${s.slot === "lunch" ? "midi" : "soir"}`)
    .join(", ");

  return [
    `Foyer : ${p.adults} adulte(s), ${p.children} enfant(s).`,
    `Créneaux à remplir (${p.selectedDays.length}) : ${slots}.`,
    diets.length ? `Régimes à respecter : ${diets.join(", ")}.` : "Aucun régime particulier.",
    allergies.length
      ? `Allergies STRICTES (aucun repas ne doit contenir ces allergènes) : ${allergies.join(", ")}.`
      : "Aucune allergie déclarée.",
    p.foodsToAvoid.length ? `Aliments à éviter : ${p.foodsToAvoid.join(", ")}.` : "",
    `Équipements DISPONIBLES (seuls ceux-ci) : ${equipment.join(", ")}.`,
    `Niveau de cuisine : ${p.cookingSkill}.`,
    `Temps max souhaité : ${p.maxCookingTime === 999 ? "peu importe" : p.maxCookingTime + " min"}.`,
    `Budget : ${p.budgetLevel}.`,
    p.ideas.length ? `Idées de l'utilisateur à intégrer si possible : ${p.ideas.join(" ; ")}.` : "",
    p.adaptWish
      ? `Demande précise de l'utilisateur à honorer autant que possible (interprète le jour et le repas visés) : "${p.adaptWish}".`
      : "",
    theme
      ? `Thème surprise à respecter pour la majorité des repas : "${theme.label}" (mots-clés : ${theme.tags.join(", ")}).`
      : "",
  ]
    .filter(Boolean)
    .join("\n");
}

const SYSTEM = `Tu es le moteur de menus de COOKALUNA. Tu construis un menu de semaine réaliste et simple pour un foyer français.
Règles impératives, par ordre de priorité :
1. Respecter toutes les allergies et exclusions alimentaires. Ne jamais inclure un allergène listé.
2. Respecter les régimes sélectionnés.
3. N'utiliser QUE les équipements disponibles. Ne jamais proposer un repas nécessitant un équipement absent.
4. Respecter le temps maximal autant que possible.
5. Respecter le budget indiqué de façon qualitative.
6. Maximiser la variété, éviter de répéter le même plat, éviter la même protéine deux jours de suite si possible.
7. Mutualiser intelligemment certains ingrédients (champ reuseIngredients).
8. Intégrer les idées de l'utilisateur lorsque c'est possible.
Ne donne jamais de conseil médical. N'affirme jamais qu'un plat est sans allergène garanti. Pas de prix précis. Reste simple, pas gastronomique. Ne renvoie que la structure JSON demandée, un objet par créneau exactement.`;

export async function generateAiMenu(p: MealProfile): Promise<WeeklyMenuData> {
  const theme = p.startingMode === "surprise" ? pickSurpriseTheme() : undefined;
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const model = process.env.OPENAI_MODEL || "gpt-5";

  const completion = await client.chat.completions.create({
    model,
    messages: [
      { role: "system", content: SYSTEM },
      { role: "user", content: buildPrompt(p, theme) },
    ],
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "weekly_menu",
        strict: true,
        schema: MENU_SCHEMA,
      },
    },
  });

  const raw = completion.choices[0]?.message?.content;
  if (!raw) throw new Error("Réponse IA vide.");
  const parsed = JSON.parse(raw) as AiMenuResponse;

  const meals: MenuMeal[] = parsed.meals.map((m) => ({
    day: mapDay(m.day),
    slot: m.slot,
    name: m.name,
    description: m.description,
    prepTime: m.prepTime,
    difficulty: m.difficulty,
    ingredients: m.ingredients,
    tags: m.tags,
    equipment: mapEquipment(m.equipment),
    reuseIngredients: m.reuseIngredients,
  }));

  return {
    weekLabel: parsed.weekLabel || buildWeekLabel(),
    meals,
    source: "ai",
    reusedNote: detectReuse(meals),
    theme: theme?.label,
  };
}
