"use client";

import { DIFFICULTY_LABELS } from "@/lib/constants";
import {
  scaleRecipe,
  portionLabel,
  formatQuantity,
} from "@/lib/recipeScale";
import type { MealProfile, Recipe } from "@/lib/types";

export function RecipeSheet({
  name,
  prepTime,
  difficulty,
  recipe,
  profile,
}: {
  name: string;
  prepTime: number;
  difficulty: string;
  recipe: Recipe;
  profile: MealProfile;
}) {
  const { ingredients } = scaleRecipe(recipe, profile);
  const label = portionLabel(profile);
  const diffLabel =
    DIFFICULTY_LABELS[difficulty as keyof typeof DIFFICULTY_LABELS] ?? difficulty;

  return (
    <div className="recipe-sheet print-only">
      {/* Header */}
      <div className="recipe-sheet-header">
        <p className="recipe-sheet-brand">COOKALUNA</p>
        <h1 className="recipe-sheet-title">{name.toUpperCase()}</h1>
        <p className="recipe-sheet-meta">
          {prepTime > 0 && `${prepTime} min · `}
          {diffLabel}
          {" · "}
          Pour {label}
        </p>
      </div>

      {/* Body */}
      <div className="recipe-sheet-body">
        <div className="recipe-sheet-ingredients">
          <h2 className="recipe-sheet-section">INGRÉDIENTS</h2>
          <ul>
            {ingredients.map((ing, i) => {
              const qty = formatQuantity(ing.quantity, ing.unit);
              return (
                <li key={i}>
                  {qty && <strong>{qty}</strong>} {ing.name}
                  {ing.optional && " (optionnel)"}
                </li>
              );
            })}
          </ul>
        </div>

        <div className="recipe-sheet-steps">
          <h2 className="recipe-sheet-section">PRÉPARATION</h2>
          <ol>
            {recipe.steps.map((step, i) => (
              <li key={i}>
                <span className="recipe-step-num">{i + 1}.</span> {step}
              </li>
            ))}
          </ol>
        </div>

        {recipe.notes && (
          <p className="recipe-sheet-notes">💡 {recipe.notes}</p>
        )}
      </div>

      {/* Footer */}
      <div className="recipe-sheet-footer">
        <p>cookaluna.com</p>
      </div>
    </div>
  );
}
