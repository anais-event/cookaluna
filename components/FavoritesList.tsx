"use client";

import { useState } from "react";
import { Heart, Trash2, BookOpen } from "lucide-react";
import { useStore } from "@/lib/store";
import { getMealById } from "@/lib/catalog";
import { RecipeModal } from "./RecipeModal";
import type { MenuMeal } from "@/lib/types";

export function FavoritesList() {
  const { favorites, toggleFavorite, profile } = useStore();
  const [viewMeal, setViewMeal] = useState<MenuMeal | null>(null);

  if (favorites.length === 0) return null;

  const openRecipe = (mealId: string, name: string) => {
    const cat = getMealById(mealId);
    if (!cat) return;
    setViewMeal({
      day: "monday",
      slot: "dinner",
      name: cat.name,
      description: cat.description,
      prepTime: cat.prepTime,
      difficulty: cat.difficulty,
      ingredients: cat.ingredients,
      tags: cat.tags,
      equipment: cat.requiredEquipment,
      reuseIngredients: cat.reuseIngredients,
      mealId: cat.id,
    });
  };

  return (
    <section className="mt-16">
      <div className="flex items-center gap-2">
        <Heart size={20} className="text-coral" fill="currentColor" />
        <h2 className="font-display text-2xl font-extrabold">
          Mes recettes gardées
        </h2>
      </div>
      <p className="mt-1 text-ink/70">
        Vos coups de coeur, à portée de clic.
      </p>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {favorites.map((fav) => {
          const cat = getMealById(fav.mealId);
          return (
            <div
              key={fav.mealId}
              className="card flex items-center gap-3 p-4"
            >
              <button
                type="button"
                onClick={() => openRecipe(fav.mealId, fav.name)}
                className="flex flex-1 items-center gap-3 text-left"
              >
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-coral-light">
                  <BookOpen size={16} className="text-coral" />
                </span>
                <span>
                  <span className="font-display font-bold leading-snug">
                    {fav.name}
                  </span>
                  {cat && (
                    <span className="block text-xs text-ink/50">
                      {cat.prepTime} min
                    </span>
                  )}
                </span>
              </button>
              <button
                type="button"
                onClick={() => toggleFavorite(fav.mealId, fav.name)}
                aria-label="Retirer des favoris"
                className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-ink/40 transition hover:bg-coral-light hover:text-coral"
              >
                <Trash2 size={15} />
              </button>
            </div>
          );
        })}
      </div>

      {viewMeal && (
        <RecipeModal
          meal={viewMeal}
          profile={profile}
          onClose={() => setViewMeal(null)}
        />
      )}
    </section>
  );
}
