"use client";

import { useMemo, useState } from "react";
import { Clock, RefreshCw, PencilLine } from "lucide-react";
import { getAlternatives } from "@/lib/generator";
import { DIFFICULTY_LABELS } from "@/lib/constants";
import { useStore } from "@/lib/store";
import type { MenuMeal } from "@/lib/types";

export function MealSuggestionPicker({
  currentName,
  onChoose,
  onChooseManual,
}: {
  currentName: string;
  onChoose: (meal: MenuMeal) => void;
  onChooseManual: (name: string) => void;
}) {
  const { profile } = useStore();
  const [seed, setSeed] = useState(0);
  const [manual, setManual] = useState(false);
  const [text, setText] = useState("");

  // seed force le recalcul (bruit aléatoire dans le scoring).
  const list = useMemo(
    () => getAlternatives(profile, currentName),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [profile, currentName, seed],
  );

  return (
    <div>
      <ul className="space-y-2">
        {list.map((m) => (
          <li
            key={m.name}
            className="flex items-center justify-between gap-3 rounded-xl border-[3px] border-ink bg-white px-3 py-2"
          >
            <div>
              <p className="font-display font-bold leading-tight">{m.name}</p>
              <p className="flex items-center gap-1 text-xs text-ink/60">
                <Clock size={12} aria-hidden="true" /> {m.prepTime} min ·{" "}
                {DIFFICULTY_LABELS[m.difficulty]}
              </p>
            </div>
            <button
              type="button"
              onClick={() => onChoose(m)}
              className="btn btn-coral btn-sm shrink-0"
            >
              Choisir
            </button>
          </li>
        ))}
      </ul>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setSeed((s) => s + 1)}
          className="btn btn-ghost btn-sm"
        >
          <RefreshCw size={14} aria-hidden="true" /> Encore
        </button>
        <button
          type="button"
          onClick={() => setManual((v) => !v)}
          className="btn btn-ghost btn-sm"
        >
          <PencilLine size={14} aria-hidden="true" /> Je vais saisir mon idée
        </button>
      </div>

      {manual && (
        <div className="mt-3 flex gap-2">
          <input
            type="text"
            value={text}
            autoFocus
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && text.trim()) onChooseManual(text.trim());
            }}
            placeholder="Mon idée : …"
            aria-label="Mon idée de plat"
            className="w-full rounded-xl border-[3px] border-ink bg-white px-3 py-2"
          />
          <button
            type="button"
            onClick={() => text.trim() && onChooseManual(text.trim())}
            className="btn btn-coral btn-sm shrink-0"
          >
            Choisir
          </button>
        </div>
      )}
    </div>
  );
}
