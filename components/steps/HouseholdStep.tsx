"use client";

import { useStore } from "@/lib/store";
import { buildSelectedDays } from "@/lib/profile";
import { DAY_LABELS, DAY_ORDER } from "@/lib/constants";
import { OnboardingCard } from "../OnboardingCard";
import { Chip, FieldLabel, OptionCard, Stepper } from "../controls";
import type { DayKey, MealPlanType, MealSlot } from "@/lib/types";

const ADULTS = [
  { value: 1, label: "1" },
  { value: 2, label: "2" },
  { value: 3, label: "3" },
  { value: 4, label: "4+" },
];
const CHILDREN = [
  { value: 0, label: "aucun" },
  { value: 1, label: "1" },
  { value: 2, label: "2" },
  { value: 3, label: "3" },
  { value: 4, label: "4+" },
];

const PLANS: { value: MealPlanType; title: string; desc: string }[] = [
  { value: "dinners", title: "7 dîners", desc: "Un dîner par jour." },
  { value: "lunch_dinner", title: "Midi + soir", desc: "Deux repas par jour." },
  { value: "custom", title: "Personnalisé", desc: "Vous choisissez les créneaux." },
];

export function HouseholdStep() {
  const { profile, setProfile } = useStore();

  const setPlan = (plan: MealPlanType) => {
    if (plan === "custom") {
      // Démarre le custom sur les dîners actuels.
      setProfile({
        mealPlan: "custom",
        selectedDays:
          profile.selectedDays.length > 0
            ? profile.selectedDays
            : buildSelectedDays("dinners"),
      });
    } else {
      setProfile({ mealPlan: plan, selectedDays: buildSelectedDays(plan) });
    }
  };

  const toggleCustomSlot = (day: DayKey, slot: MealSlot) => {
    const exists = profile.selectedDays.some(
      (s) => s.day === day && s.slot === slot,
    );
    const next = exists
      ? profile.selectedDays.filter((s) => !(s.day === day && s.slot === slot))
      : [...profile.selectedDays, { day, slot }];
    setProfile({ selectedDays: next });
  };

  const isSel = (day: DayKey, slot: MealSlot) =>
    profile.selectedDays.some((s) => s.day === day && s.slot === slot);

  return (
    <OnboardingCard title="On nourrit qui cette semaine ?">
      <FieldLabel>Combien d&apos;adultes ?</FieldLabel>
      <Stepper
        label="Nombre d'adultes"
        options={ADULTS}
        value={profile.adults}
        onChange={(v) => setProfile({ adults: v })}
      />

      <FieldLabel>Et les enfants ?</FieldLabel>
      <Stepper
        label="Nombre d'enfants"
        options={CHILDREN}
        value={profile.children}
        onChange={(v) => setProfile({ children: v })}
      />

      <FieldLabel>Combien de repas voulez-vous prévoir ?</FieldLabel>
      <div className="grid gap-3 sm:grid-cols-3">
        {PLANS.map((p) => (
          <OptionCard
            key={p.value}
            active={profile.mealPlan === p.value}
            onClick={() => setPlan(p.value)}
            title={p.title}
            desc={p.desc}
          />
        ))}
      </div>

      <FieldLabel>Ma semaine commence le :</FieldLabel>
      <div className="flex flex-wrap gap-2">
        {DAY_ORDER.map((d) => (
          <Chip
            key={d}
            active={profile.startDay === d}
            onClick={() => setProfile({ startDay: d })}
          >
            {DAY_LABELS[d]}
          </Chip>
        ))}
      </div>

      {profile.mealPlan === "custom" && (
        <div className="mt-6 rounded-card border-[3px] border-ink bg-coral-light p-4">
          <p className="font-display mb-3 text-sm font-bold">
            Sélectionnez les créneaux à prévoir
          </p>
          <div className="space-y-2">
            {DAY_ORDER.map((day) => (
              <div key={day} className="flex items-center gap-2">
                <span className="font-display w-24 shrink-0 text-sm font-bold">
                  {DAY_LABELS[day]}
                </span>
                <Chip active={isSel(day, "lunch")} onClick={() => toggleCustomSlot(day, "lunch")}>
                  Midi
                </Chip>
                <Chip active={isSel(day, "dinner")} onClick={() => toggleCustomSlot(day, "dinner")}>
                  Soir
                </Chip>
              </div>
            ))}
          </div>
        </div>
      )}
    </OnboardingCard>
  );
}
