"use client";

import { useStore } from "@/lib/store";
import {
  ALLERGEN_LABELS,
  ALLERGEN_ORDER,
  ALLERGY_DISCLAIMER,
  DIET_LABELS,
  DIET_ORDER,
} from "@/lib/constants";
import { OnboardingCard } from "../OnboardingCard";
import { Chip, FieldLabel } from "../controls";
import type { Allergen, Diet } from "@/lib/types";

export function DietStep() {
  const { profile, setProfile } = useStore();

  const toggleAllergen = (a: Allergen) => {
    const next = profile.allergies.includes(a)
      ? profile.allergies.filter((x) => x !== a)
      : [...profile.allergies, a];
    setProfile({ allergies: next });
  };

  const toggleDiet = (d: Diet) => {
    let next: Diet[];
    if (d === "none") {
      next = ["none"];
    } else {
      const base = profile.dietaryPreferences.filter((x) => x !== "none");
      next = base.includes(d)
        ? base.filter((x) => x !== d)
        : [...base, d];
      if (next.length === 0) next = ["none"];
    }
    setProfile({ dietaryPreferences: next });
  };

  const avoidText = profile.foodsToAvoid.join(", ");

  return (
    <OnboardingCard title="On connaît vos petites règles.">
      <FieldLabel>Aliments à éviter</FieldLabel>
      <p className="mb-2 text-sm text-ink/60">
        Séparez par des virgules. Laissez vide si tout va bien.
      </p>
      <input
        type="text"
        defaultValue={avoidText}
        onChange={(e) =>
          setProfile({
            foodsToAvoid: e.target.value
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean),
          })
        }
        placeholder="Ex : champignons, coriandre"
        aria-label="Aliments à éviter"
        className="w-full rounded-xl border-[3px] border-ink bg-white px-4 py-3 text-base focus:outline-none focus:ring-0"
      />

      <FieldLabel>Allergies / intolérances</FieldLabel>
      <div className="flex flex-wrap gap-2">
        {ALLERGEN_ORDER.map((a) => (
          <Chip
            key={a}
            active={profile.allergies.includes(a)}
            onClick={() => toggleAllergen(a)}
          >
            {ALLERGEN_LABELS[a]}
          </Chip>
        ))}
      </div>
      <p className="mt-3 rounded-xl border-2 border-ink/15 bg-coral-light/60 px-3 py-2 text-xs text-ink/70">
        {ALLERGY_DISCLAIMER}
      </p>

      <FieldLabel>Votre façon de manger</FieldLabel>
      <div className="flex flex-wrap gap-2">
        {DIET_ORDER.map((d) => (
          <Chip
            key={d}
            active={profile.dietaryPreferences.includes(d)}
            onClick={() => toggleDiet(d)}
          >
            {DIET_LABELS[d]}
          </Chip>
        ))}
      </div>
    </OnboardingCard>
  );
}
