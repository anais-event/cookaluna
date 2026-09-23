"use client";

import { useStore } from "@/lib/store";
import { OnboardingCard } from "../OnboardingCard";
import { FieldLabel, OptionCard } from "../controls";
import type { BudgetLevel, CookingSkill, MaxCookingTime } from "@/lib/types";

const TIMES: { value: MaxCookingTime; title: string }[] = [
  { value: 15, title: "15 min max" },
  { value: 30, title: "30 min" },
  { value: 45, title: "45 min" },
  { value: 999, title: "Peu importe" },
];

const SKILLS: { value: CookingSkill; title: string; desc?: string }[] = [
  { value: "mini", title: "Mini cuisto", desc: "Je veux du simple et du rapide." },
  { value: "ok", title: "Je me débrouille" },
  { value: "likes", title: "J'aime cuisiner" },
  {
    value: "chef",
    title: "Chef du dimanche",
    desc: "Prêt à sortir la poêle qui fait peur.",
  },
];

const BUDGETS: { value: BudgetLevel; title: string }[] = [
  { value: "low", title: "Petit budget" },
  { value: "normal", title: "Budget normal" },
  { value: "treat", title: "Je me fais plaisir" },
];

export function CookingStep() {
  const { profile, setProfile } = useStore();
  return (
    <OnboardingCard title="À table dans combien de temps ?">
      <FieldLabel>Temps de cuisine</FieldLabel>
      <div className="grid gap-3 sm:grid-cols-4">
        {TIMES.map((t) => (
          <OptionCard
            key={t.value}
            active={profile.maxCookingTime === t.value}
            onClick={() => setProfile({ maxCookingTime: t.value })}
            title={t.title}
          />
        ))}
      </div>

      <FieldLabel>Niveau</FieldLabel>
      <div className="grid gap-3 sm:grid-cols-2">
        {SKILLS.map((s) => (
          <OptionCard
            key={s.value}
            active={profile.cookingSkill === s.value}
            onClick={() => setProfile({ cookingSkill: s.value })}
            title={s.title}
            desc={s.desc}
          />
        ))}
      </div>

      <FieldLabel>Budget</FieldLabel>
      <div className="grid gap-3 sm:grid-cols-3">
        {BUDGETS.map((b) => (
          <OptionCard
            key={b.value}
            active={profile.budgetLevel === b.value}
            onClick={() => setProfile({ budgetLevel: b.value })}
            title={b.title}
          />
        ))}
      </div>
    </OnboardingCard>
  );
}
