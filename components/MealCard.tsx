"use client";

import { Clock, Repeat, Pencil, Shuffle, Trash2 } from "lucide-react";
import {
  DIFFICULTY_LABELS,
  EQUIPMENT_LABELS,
} from "@/lib/constants";
import type { MenuMeal } from "@/lib/types";

export function MealCard({
  meal,
  onChange,
  onEdit,
  onDelete,
}: {
  meal: MenuMeal;
  onChange: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const mainEquip =
    meal.equipment.length > 0 &&
    meal.equipment[0] !== "stovetop"
      ? EQUIPMENT_LABELS[meal.equipment[0]]
      : null;

  return (
    <div className="group">
      <p className="font-display text-lg font-bold leading-snug">{meal.name}</p>
      {(meal.prepTime > 0 || meal.difficulty) && !meal.manual && (
        <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-ink/70">
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

      <div className="mt-3 flex flex-wrap gap-2">
        <button type="button" onClick={onChange} className="btn btn-ghost btn-sm">
          <Shuffle size={14} aria-hidden="true" /> Changer
        </button>
        <button type="button" onClick={onEdit} className="btn btn-ghost btn-sm">
          <Pencil size={14} aria-hidden="true" /> Modifier
        </button>
        <button
          type="button"
          onClick={onDelete}
          aria-label={`Supprimer ${meal.name}`}
          className="btn btn-ghost btn-sm"
        >
          <Trash2 size={14} aria-hidden="true" /> Supprimer
        </button>
      </div>
    </div>
  );
}
