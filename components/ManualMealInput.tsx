"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { QUICK_SUGGESTIONS } from "@/lib/suggestions";

export function ManualMealInput({
  initial = "",
  onSave,
  onCancel,
}: {
  initial?: string;
  onSave: (name: string) => void;
  onCancel?: () => void;
}) {
  const [value, setValue] = useState(initial);

  const save = () => {
    const v = value.trim();
    if (v) onSave(v);
  };

  return (
    <div>
      <div className="flex gap-2">
        <input
          type="text"
          value={value}
          autoFocus
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") save();
            if (e.key === "Escape" && onCancel) onCancel();
          }}
          placeholder="Tapez un plat…"
          aria-label="Nom du plat"
          className="w-full rounded-xl border-[3px] border-ink bg-white px-3 py-2 text-base"
        />
        <button
          type="button"
          onClick={save}
          aria-label="Valider le plat"
          className="btn btn-coral btn-sm"
        >
          <Check size={16} aria-hidden="true" />
        </button>
      </div>

      <p className="mt-2 text-xs font-bold text-ink/60">Besoin d&apos;une idée ?</p>
      <div className="mt-1 flex flex-wrap gap-1.5">
        {QUICK_SUGGESTIONS.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => onSave(s)}
            className="rounded-full border-2 border-ink bg-white px-2.5 py-1 text-xs font-bold hover:bg-coral hover:text-white"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
