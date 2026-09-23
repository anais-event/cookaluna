"use client";

import React, { useEffect, useState } from "react";
import { X, Clock, Printer, Heart } from "lucide-react";
import { DIFFICULTY_LABELS } from "@/lib/constants";
import { getMealById } from "@/lib/catalog";
import { useStore } from "@/lib/store";
import {
  scaleRecipe,
  portionLabel,
  formatQuantity,
} from "@/lib/recipeScale";
import { RecipeSheet } from "./RecipeSheet";
import type { MealProfile, MenuMeal } from "@/lib/types";

export function RecipeModal({
  meal,
  profile,
  onClose,
}: {
  meal: MenuMeal;
  profile: MealProfile;
  onClose: () => void;
}) {
  const { toggleFavorite, isFavorite } = useStore();
  const [checked, setChecked] = useState<Set<number>>(new Set());
  const saved = meal.mealId ? isFavorite(meal.mealId) : false;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    document.body.dataset.printRecipe = "true";
    return () => {
      document.body.style.overflow = "";
      delete document.body.dataset.printRecipe;
    };
  }, []);

  const catalogMeal = meal.mealId ? getMealById(meal.mealId) : undefined;
  const recipe = catalogMeal?.recipe;

  if (!recipe) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 p-0 sm:items-center sm:p-4"
        role="dialog"
        aria-modal="true"
        aria-label={meal.name}
        onClick={onClose}
      >
        <div
          className="card max-h-[90vh] w-full max-w-md overflow-y-auto rounded-b-none p-6 sm:rounded-card"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-start justify-between gap-4">
            <h2 className="font-display text-2xl font-extrabold leading-tight">
              {meal.name}
            </h2>
            <button
              type="button"
              onClick={onClose}
              aria-label="Fermer"
              className="btn btn-ghost btn-sm shrink-0"
            >
              <X size={16} aria-hidden="true" />
            </button>
          </div>
          <p className="mt-4 text-ink/60">
            La recette détaillée de ce plat sera bientôt disponible.
          </p>
        </div>
      </div>
    );
  }

  const { ingredients } = scaleRecipe(recipe, profile);
  const label = portionLabel(profile);

  const toggleCheck = (idx: number) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <React.Fragment>
      <div
        className="no-print fixed inset-0 z-50 flex items-end justify-center bg-ink/40 p-0 sm:items-center sm:p-4"
        role="dialog"
        aria-modal="true"
        aria-label={meal.name}
        onClick={onClose}
      >
        <div
          className="card flex max-h-[95vh] w-full flex-col overflow-hidden rounded-b-none sm:max-w-lg sm:rounded-card"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="stripes-soft flex items-start justify-between gap-4 border-b-[3px] border-ink px-5 py-4 sm:rounded-t-[15px]">
            <div>
              <h2 className="font-display text-2xl font-extrabold leading-tight">
                {meal.name}
              </h2>
              <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-ink/70">
                {meal.prepTime > 0 && (
                  <span className="inline-flex items-center gap-1">
                    <Clock size={14} aria-hidden="true" /> {meal.prepTime} min
                  </span>
                )}
                <span aria-hidden="true">&middot;</span>
                <span>{DIFFICULTY_LABELS[meal.difficulty]}</span>
              </p>
              <p className="mt-1 text-sm font-semibold text-ink/80">
                Pour {label}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Fermer"
              className="btn btn-ghost btn-sm shrink-0"
            >
              <X size={20} aria-hidden="true" />
            </button>
          </div>

          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto px-5 py-4">
            {/* Ingredients */}
            <h3 className="font-display text-sm font-extrabold uppercase tracking-widest text-coral">
              Ingrédients
            </h3>
            <ul className="mt-3 space-y-2">
              {ingredients.map((ing, i) => {
                const qty = formatQuantity(ing.quantity, ing.unit);
                return (
                  <li key={i}>
                    <button
                      type="button"
                      onClick={() => toggleCheck(i)}
                      className={`flex w-full items-start gap-3 rounded-lg px-2 py-1.5 text-left transition hover:bg-coral-light/50 ${
                        checked.has(i) ? "text-ink/40 line-through" : ""
                      }`}
                    >
                      <span
                        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 text-xs font-bold ${
                          checked.has(i)
                            ? "border-coral bg-coral text-white"
                            : "border-ink/30"
                        }`}
                      >
                        {checked.has(i) && "✓"}
                      </span>
                      <span>
                        {qty && <strong>{qty}</strong>}{" "}
                        {ing.name}
                        {ing.optional && (
                          <span className="ml-1 text-xs text-ink/50">(optionnel)</span>
                        )}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>

            {/* Preparation */}
            <h3 className="mt-6 font-display text-sm font-extrabold uppercase tracking-widest text-coral">
              Préparation
            </h3>
            <ol className="mt-3 space-y-4">
              {recipe.steps.map((step, i) => (
                <li key={i} className="flex gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 border-ink bg-coral-light font-display text-sm font-extrabold">
                    {i + 1}
                  </span>
                  <p className="pt-0.5 text-[15px] leading-relaxed">{step}</p>
                </li>
              ))}
            </ol>

            {/* Notes */}
            {recipe.notes && (
              <p className="mt-6 rounded-xl bg-coral-light/50 px-4 py-3 text-sm text-ink/70">
                {"💡"} {recipe.notes}
              </p>
            )}
          </div>

          {/* Footer actions */}
          <div className="flex items-center gap-3 border-t-2 border-ink/10 px-5 py-3">
            <button
              type="button"
              onClick={handlePrint}
              className="btn btn-ghost btn-sm"
            >
              <Printer size={16} aria-hidden="true" /> Imprimer
            </button>
            {meal.mealId && (
              <button
                type="button"
                onClick={() => toggleFavorite(meal.mealId!, meal.name)}
                className={`btn btn-sm ${saved ? "btn-coral" : "btn-ghost"}`}
              >
                <Heart
                  size={16}
                  aria-hidden="true"
                  fill={saved ? "currentColor" : "none"}
                />{" "}
                {saved ? "Gardé !" : "Garder"}
              </button>
            )}
          </div>
        </div>
      </div>

      <RecipeSheet
        name={meal.name}
        prepTime={meal.prepTime}
        difficulty={meal.difficulty}
        recipe={recipe}
        profile={profile}
      />
    </React.Fragment>
  );
}
