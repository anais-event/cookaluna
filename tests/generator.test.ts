import { describe, expect, it } from "vitest";
import { MEAL_CATALOG } from "@/lib/catalog";
import {
  generateDemoMenu,
  isEquipmentCompatible,
  matchesProfile,
  scoreMeal,
  validateProfile,
  getAlternatives,
} from "@/lib/generator";
import { createDefaultProfile, buildSelectedDays } from "@/lib/profile";
import { createSampleMenu } from "@/lib/sampleMenu";
import { MenuSheet } from "@/components/MenuSheet";
import type { Equipment, MealProfile } from "@/lib/types";

function profile(patch: Partial<MealProfile> = {}): MealProfile {
  return { ...createDefaultProfile(), ...patch };
}

describe("catalogue", () => {
  it("contient au moins 80 repas", () => {
    expect(MEAL_CATALOG.length).toBeGreaterThanOrEqual(80);
  });
  it("chaque repas déclare des équipements requis", () => {
    for (const m of MEAL_CATALOG) {
      expect(m.requiredEquipment.length).toBeGreaterThan(0);
    }
  });
  it("ids uniques", () => {
    const ids = new Set(MEAL_CATALOG.map((m) => m.id));
    expect(ids.size).toBe(MEAL_CATALOG.length);
  });
});

describe("validateProfile", () => {
  it("valide un profil par défaut", () => {
    expect(validateProfile(profile()).valid).toBe(true);
  });
  it("rejette sans équipement", () => {
    expect(validateProfile(profile({ equipment: [] })).valid).toBe(false);
  });
  it("rejette sans créneau", () => {
    expect(validateProfile(profile({ selectedDays: [] })).valid).toBe(false);
  });
  it("rejette 0 adulte", () => {
    expect(validateProfile(profile({ adults: 0 })).valid).toBe(false);
  });
});

describe("isEquipmentCompatible", () => {
  const oven = MEAL_CATALOG.find((m) => m.requiredEquipment.includes("oven") && m.alternativeEquipment.length === 0)!;
  it("exclut un plat au four sans four", () => {
    expect(isEquipmentCompatible(oven, ["stovetop"])).toBe(false);
  });
  it("autorise un plat au four avec four", () => {
    expect(isEquipmentCompatible(oven, ["stovetop", "oven"])).toBe(true);
  });
  it("autorise via équipement alternatif", () => {
    const alt = MEAL_CATALOG.find(
      (m) => m.requiredEquipment.includes("oven") && m.alternativeEquipment.includes("airfryer"),
    )!;
    expect(isEquipmentCompatible(alt, ["stovetop", "airfryer"])).toBe(true);
  });
});

describe("matchesProfile — régimes", () => {
  it("végétarien : aucun repas à base de viande/poisson", () => {
    const p = profile({ dietaryPreferences: ["vegetarian"] });
    const pool = MEAL_CATALOG.filter((m) => matchesProfile(m, p));
    expect(pool.length).toBeGreaterThan(0);
    for (const m of pool) expect(m.dietTags).toContain("vegetarian");
  });
  it("vegan : uniquement des repas vegan", () => {
    const p = profile({ dietaryPreferences: ["vegan"] });
    const pool = MEAL_CATALOG.filter((m) => matchesProfile(m, p));
    expect(pool.length).toBeGreaterThan(0);
    for (const m of pool) expect(m.dietTags).toContain("vegan");
  });
  it("sans porc : aucun plat de porc", () => {
    const p = profile({ dietaryPreferences: ["no_pork"] });
    const pool = MEAL_CATALOG.filter((m) => matchesProfile(m, p));
    for (const m of pool) expect(m.category).not.toBe("pork");
  });
});

describe("matchesProfile — allergies", () => {
  it("gluten : aucun allergène gluten", () => {
    const p = profile({ allergies: ["gluten"] });
    const pool = MEAL_CATALOG.filter((m) => matchesProfile(m, p));
    for (const m of pool) expect(m.possibleAllergens).not.toContain("gluten");
  });
  it("plusieurs allergies respectées", () => {
    const p = profile({ allergies: ["milk", "eggs"] });
    const pool = MEAL_CATALOG.filter((m) => matchesProfile(m, p));
    for (const m of pool) {
      expect(m.possibleAllergens).not.toContain("milk");
      expect(m.possibleAllergens).not.toContain("eggs");
    }
  });
});

describe("matchesProfile — aliments à éviter", () => {
  it("exclut les plats contenant le terme", () => {
    const p = profile({ foodsToAvoid: ["champignon"] });
    const pool = MEAL_CATALOG.filter((m) => matchesProfile(m, p));
    for (const m of pool) {
      const hay = [m.name, ...m.ingredients].join(" ").toLowerCase();
      expect(hay).not.toContain("champignon");
    }
  });
});

describe("scoreMeal", () => {
  it("pénalise l'avancé pour un mini cuisto", () => {
    const easy = MEAL_CATALOG.find((m) => m.difficulty === "very_easy")!;
    const hard = MEAL_CATALOG.find((m) => m.difficulty === "advanced")!;
    const p = profile({ cookingSkill: "mini", maxCookingTime: 999 });
    expect(scoreMeal(easy, p)).toBeGreaterThan(scoreMeal(hard, p));
  });
});

describe("generateDemoMenu", () => {
  it("remplit tous les créneaux (7 dîners)", () => {
    const p = profile();
    const menu = generateDemoMenu(p);
    expect(menu.meals.length).toBe(p.selectedDays.length);
    expect(menu.source).toBe("demo");
  });
  it("midi + soir = 14 créneaux", () => {
    const p = profile({ mealPlan: "lunch_dinner", selectedDays: buildSelectedDays("lunch_dinner") });
    const menu = generateDemoMenu(p);
    expect(menu.meals.length).toBe(14);
  });
  it("respecte l'absence de four", () => {
    const equipment: Equipment[] = ["stovetop"];
    const p = profile({ equipment });
    const menu = generateDemoMenu(p);
    // Aucun repas issu du catalogue ne doit exiger le four sans alternative.
    for (const m of menu.meals) {
      if (m.equipment.includes("oven")) {
        // seul cas admis : un équipement alternatif détenu
        expect(equipment.some((e) => e === "oven")).toBe(false);
      }
    }
    // Vérif plus stricte via matchesProfile sur les repas catalogue.
    for (const m of menu.meals) {
      if (!m.mealId) continue;
      const src = MEAL_CATALOG.find((x) => x.id === m.mealId)!;
      expect(isEquipmentCompatible(src, equipment)).toBe(true);
    }
  });
  it("respecte le végétarien de bout en bout", () => {
    const p = profile({ dietaryPreferences: ["vegetarian"] });
    const menu = generateDemoMenu(p);
    for (const m of menu.meals) {
      if (!m.mealId) continue;
      const src = MEAL_CATALOG.find((x) => x.id === m.mealId)!;
      expect(src.dietTags).toContain("vegetarian");
    }
  });
  it("intègre les idées de l'utilisateur", () => {
    const p = profile({ startingMode: "my_list", ideas: ["Tacos maison express"] });
    const menu = generateDemoMenu(p);
    expect(menu.meals.some((m) => m.name.toLowerCase().includes("tacos"))).toBe(true);
  });
  it("place une idée libre non cataloguée en manuel", () => {
    const p = profile({ startingMode: "my_list", ideas: ["Plat inventé zzz"] });
    const menu = generateDemoMenu(p);
    const found = menu.meals.find((m) => m.name === "Plat inventé zzz");
    expect(found?.manual).toBe(true);
  });
});

describe("getAlternatives", () => {
  it("renvoie des alternatives différentes du repas courant", () => {
    const p = profile();
    const alts = getAlternatives(p, "Tacos maison express", 4);
    expect(alts.length).toBeLessThanOrEqual(4);
    for (const a of alts) expect(a.name).not.toBe("Tacos maison express");
  });
});

describe("menu -> feuille imprimable", () => {
  it("construit un composant MenuSheet sans erreur", () => {
    const menu = createSampleMenu();
    const el = MenuSheet({ menu });
    expect(el).toBeTruthy();
    expect(menu.meals.length).toBe(14);
  });
});
