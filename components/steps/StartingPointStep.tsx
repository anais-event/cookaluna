"use client";

import { useStore } from "@/lib/store";
import { OnboardingCard } from "../OnboardingCard";
import { OptionCard } from "../controls";
import type { StartingMode } from "@/lib/types";

const MODES: { value: StartingMode; title: string; desc: string }[] = [
  { value: "none", title: "Aucune idée", desc: "Faites-moi toute la semaine, sans thème particulier." },
  { value: "some_ideas", title: "Quelques inspis", desc: "J'ai 2 ou 3 envies, complétez le reste." },
  { value: "my_list", title: "Ma liste", desc: "J'ai déjà mes idées." },
  { value: "surprise", title: "Surprenez-moi", desc: "Un thème surprise (tour du monde, comfort food, léger...) pour toute la semaine." },
];

export function StartingPointStep() {
  const { profile, setProfile } = useStore();

  const setMode = (m: StartingMode) => setProfile({ startingMode: m });

  const setIdeasFromText = (text: string, oneLine: boolean) => {
    const ideas = oneLine
      ? text.split("\n").map((s) => s.trim()).filter(Boolean)
      : text.split(",").map((s) => s.trim()).filter(Boolean);
    setProfile({ ideas });
  };

  return (
    <OnboardingCard title="Vous partez de zéro ?">
      <div className="grid gap-3 sm:grid-cols-2">
        {MODES.map((m) => (
          <OptionCard
            key={m.value}
            active={profile.startingMode === m.value}
            onClick={() => setMode(m.value)}
            title={m.title}
            desc={m.desc}
          />
        ))}
      </div>

      {profile.startingMode === "some_ideas" && (
        <div className="mt-5">
          <label htmlFor="ideas-some" className="font-display mb-2 block text-sm font-bold">
            Vos envies (séparées par des virgules)
          </label>
          <input
            id="ideas-some"
            type="text"
            defaultValue={profile.ideas.join(", ")}
            onChange={(e) => setIdeasFromText(e.target.value, false)}
            placeholder="Ex : tacos, poulet rôti, curry"
            className="w-full rounded-xl border-[3px] border-ink bg-white px-4 py-3 text-base"
          />
        </div>
      )}

      {profile.startingMode === "my_list" && (
        <div className="mt-5">
          <label htmlFor="ideas-list" className="font-display mb-2 block text-sm font-bold">
            Une idée par ligne
          </label>
          <textarea
            id="ideas-list"
            rows={6}
            defaultValue={profile.ideas.join("\n")}
            onChange={(e) => setIdeasFromText(e.target.value, true)}
            placeholder={"Poulet rôti\nTacos\nPâtes carbonara\nSoupe de légumes"}
            className="w-full rounded-xl border-[3px] border-ink bg-white px-4 py-3 text-base"
          />
        </div>
      )}
    </OnboardingCard>
  );
}
