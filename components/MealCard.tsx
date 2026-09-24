"use client";

import { Clock, Pencil, Repeat, X } from "lucide-react";
import { DIFFICULTY_LABELS, EQUIPMENT_LABELS } from "@/lib/constants";
import type { MenuMeal } from "@/lib/types";

export function MealCard({
  meal,
  onChange,
  onDelete,
  onViewRecipe,
}: {
  meal: MenuMeal;
  onChange: () => void;
  onDelete: () => void;
  onViewRecipe?: () => void;
}) {
  const mainEquip =
    meal.equipment.length > 0 && meal.equipment[0] !== "stovetop"
      ? EQUIPMENT_LABELS[meal.equipment[0]]
      : null;

  return (
    <div>
      {onViewRecipe ? (
        <button
          type="button"
          onClick={onViewRecipe}
          className="font-display text-lg font-bold leading-snug underline decoration-coral decoration-2 underline-offset-2 text-left transition hover:text-coral cursor-pointer"
        >
          {meal.name}
        </button>
      ) : (
        <p className="font-display text-lg font-bold leading-snug">{meal.name}</p>
      )}
      {!meal.manual && (meal.prepTime > 0 || meal.difficulty) && (
        <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-ink/60">
          {meal.prepTime > 0 && (
            <span className="inline-flex items-center gap-1">
              <Clock size={14} aria-hidden="true" /> {meal.prepTime} min
            </span>
          )}
          <span aria-hidden="true">·</span>
          <span>{DIFFICULTY_LABELS[meal.difficulty]}</span>
          {mainEquip && (
            <>
              <span aria-hidden="true">·</span>
              <span>{mainEquip}</span>
            </>
          )}
        </p>
      )}
      {meal.reuseIngredients.length > 0 && (
        <p className="mt-1 inline-flex items-center gap-1 rounded-full bg-coral-light px-2 py-0.5 text-xs font-medium text-ink/80">
          <Repeat size={12} aria-hidden="true" /> Ingrédients réutilisés
        </p>
      )}

      <div className="mt-3 flex items-center gap-2">
        <button type="button" onClick={onChange} className="btn btn-ghost btn-sm">
          <Pencil size={14} aria-hidden="true" /> Modifier
        </button>
        <button
          type="button"
          onClick={onDelete}
          aria-label="Supprimer ce repas"
          className="grid h-9 w-9 place-items-center rounded-xl border-2 border-ink bg-white text-coral shadow-pop-sm transition hover:-translate-y-0.5 hover:bg-coral-light active:translate-y-0.5"
        >
          <X size={16} strokeWidth={3} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
