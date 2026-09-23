"use client";

import { useState } from "react";
import { Clock, Repeat, Pencil, Shuffle, Trash2, MoreHorizontal } from "lucide-react";
import { DIFFICULTY_LABELS, EQUIPMENT_LABELS } from "@/lib/constants";
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
  const [menuOpen, setMenuOpen] = useState(false);

  const mainEquip =
    meal.equipment.length > 0 && meal.equipment[0] !== "stovetop"
      ? EQUIPMENT_LABELS[meal.equipment[0]]
      : null;

  return (
    <div>
      <p className="font-display text-lg font-bold leading-snug">{meal.name}</p>
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
        {/* Action principale */}
        <button type="button" onClick={onChange} className="btn btn-ghost btn-sm">
          <Shuffle size={14} aria-hidden="true" /> Changer
        </button>

        {/* Actions secondaires dans un petit menu */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Plus d'actions"
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            className="grid h-9 w-9 place-items-center rounded-xl border-2 border-ink bg-white shadow-pop-sm transition hover:-translate-y-0.5 active:translate-y-0.5"
          >
            <MoreHorizontal size={18} aria-hidden="true" />
          </button>

          {menuOpen && (
            <>
              <button
                type="button"
                aria-hidden="true"
                tabIndex={-1}
                onClick={() => setMenuOpen(false)}
                className="fixed inset-0 z-40 cursor-default"
              />
              <div
                role="menu"
                className="absolute left-0 top-11 z-50 w-44 overflow-hidden rounded-xl border-[3px] border-ink bg-white shadow-pop"
              >
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setMenuOpen(false);
                    onEdit();
                  }}
                  className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm font-bold hover:bg-coral-light"
                >
                  <Pencil size={15} aria-hidden="true" /> Modifier
                </button>
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setMenuOpen(false);
                    onDelete();
                  }}
                  className="flex w-full items-center gap-2 border-t-2 border-ink/10 px-3 py-2.5 text-left text-sm font-bold text-coral hover:bg-coral-light"
                >
                  <Trash2 size={15} aria-hidden="true" /> Supprimer
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
