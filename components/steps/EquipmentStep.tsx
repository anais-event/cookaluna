"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { EQUIPMENT_LABELS, EQUIPMENT_ORDER } from "@/lib/constants";
import { OnboardingCard } from "../OnboardingCard";
import { Chip } from "../controls";
import type { Equipment } from "@/lib/types";

export function EquipmentStep() {
  const { profile, setProfile } = useStore();
  const [other, setOther] = useState("");

  const toggle = (e: Equipment) => {
    const next = profile.equipment.includes(e)
      ? profile.equipment.filter((x) => x !== e)
      : [...profile.equipment, e];
    // Toujours garder au moins les plaques.
    setProfile({ equipment: next.length ? next : ["stovetop"] });
  };

  return (
    <OnboardingCard
      title="On cuisine avec quoi ?"
      subtitle="On adapte les idées à ce que vous avez vraiment sous la main."
    >
      <p className="font-display mb-3 text-lg font-bold">
        Quels équipements avez-vous ?
      </p>
      <div className="flex flex-wrap gap-2">
        {EQUIPMENT_ORDER.map((e) => (
          <Chip
            key={e}
            active={profile.equipment.includes(e)}
            onClick={() => toggle(e)}
          >
            {EQUIPMENT_LABELS[e]}
          </Chip>
        ))}
      </div>

      <div className="mt-5">
        <label htmlFor="equip-other" className="font-display mb-2 block text-sm font-bold">
          Autre (facultatif)
        </label>
        <input
          id="equip-other"
          type="text"
          value={other}
          onChange={(e) => setOther(e.target.value)}
          placeholder="Ex : wok, gaufrier…"
          className="w-full rounded-xl border-[3px] border-ink bg-white px-4 py-3 text-base"
        />
      </div>

      <p className="mt-4 text-sm text-ink/60">
        On ne proposera jamais un plat qui exige un équipement que vous n&apos;avez
        pas. Pas de four ? Aucun problème.
      </p>
    </OnboardingCard>
  );
}
