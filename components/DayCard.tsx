"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { useStore } from "@/lib/store";
import { track } from "@/lib/analytics";
import { DAY_LABELS, SLOT_LABELS } from "@/lib/constants";
import { MealCard } from "./MealCard";
import { ManualMealInput } from "./ManualMealInput";
import { MealEditModal } from "./MealEditModal";
import { RecipeModal } from "./RecipeModal";
import { getMealById } from "@/lib/catalog";
import type { DayKey, MealSlot, MenuMeal } from "@/lib/types";

type EditState = { slot: MealSlot; mode: "manual" | "change" } | null;

export function DayCard({ day, slots }: { day: DayKey; slots: MealSlot[] }) {
  const { menu, profile, replaceMealAt, updateMealAt, clearMealAt } = useStore();
  const [edit, setEdit] = useState<EditState>(null);
  const [recipeMeal, setRecipeMeal] = useState<MenuMeal | null>(null);

  const mealAt = (slot: MealSlot): MenuMeal | undefined =>
    menu?.meals.find((m) => m.day === day && m.slot === slot);

  const applyMeal = (slot: MealSlot, meal: MenuMeal) => {
    replaceMealAt(day, slot, meal);
    track("meal_changed", { day, slot });
    setEdit(null);
  };

  const applyManual = (slot: MealSlot, name: string) => {
    updateMealAt(day, slot, {
      name,
      description: "Votre idée.",
      manual: true,
      mealId: undefined,
      prepTime: 0,
      ingredients: [],
      tags: ["mon-idée"],
      equipment: [],
      reuseIngredients: [],
    });
    track("manual_meal_added", { day, slot });
    setEdit(null);
  };

  return (
    <div className="card">
      <div className="stripes-soft rounded-t-[15px] border-b-[3px] border-ink px-5 py-3">
        <h3 className="font-display text-lg font-extrabold uppercase tracking-wide">
          {DAY_LABELS[day]}
        </h3>
      </div>
      <div className="divide-y-2 divide-ink/10">
        {slots.map((slot) => {
          const meal = mealAt(slot);
          const isEmpty = !meal || !meal.name;
          const editing = edit?.slot === slot;
          return (
            <div key={slot} className="p-5">
              <p className="font-display mb-2 text-xs font-bold uppercase tracking-widest text-coral">
                {SLOT_LABELS[slot]}
              </p>

              {editing && edit?.mode === "manual" && (
                <ManualMealInput
                  initial={meal?.name ?? ""}
                  onSave={(name) => applyManual(slot, name)}
                  onCancel={() => setEdit(null)}
                />
              )}

              {editing && edit?.mode === "change" && meal && (
                <MealEditModal
                  currentName={meal.name}
                  onChoose={(m) => applyMeal(slot, m)}
                  onChooseManual={(name) => applyManual(slot, name)}
                  onClose={() => setEdit(null)}
                />
              )}

              {!editing && !isEmpty && meal && (
                <MealCard
                  meal={meal}
                  onChange={() => setEdit({ slot, mode: "change" })}
                  onEdit={() => setEdit({ slot, mode: "manual" })}
                  onDelete={() => clearMealAt(day, slot)}
                  onViewRecipe={
                    meal.mealId && getMealById(meal.mealId)?.recipe
                      ? () => setRecipeMeal(meal)
                      : undefined
                  }
                />
              )}

              {!editing && isEmpty && (
                <button
                  type="button"
                  onClick={() => setEdit({ slot, mode: "manual" })}
                  className="flex w-full items-center gap-2 rounded-xl border-[3px] border-dashed border-ink/40 px-3 py-3 text-left text-ink/60 hover:border-coral hover:text-coral"
                >
                  <Plus size={18} aria-hidden="true" />
                  <span className="font-display font-bold">Ajouter un repas</span>
                </button>
              )}
            </div>
          );
        })}
      </div>

      {recipeMeal && (
        <RecipeModal
          meal={recipeMeal}
          profile={profile}
          onClose={() => setRecipeMeal(null)}
        />
      )}
    </div>
  );
}
