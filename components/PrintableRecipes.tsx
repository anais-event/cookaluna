"use client";

import { orderedDays, DAY_LABELS, DIFFICULTY_LABELS } from "@/lib/constants";
import { getMealById } from "@/lib/catalog";
import { scaleRecipe, portionLabel, formatQuantity } from "@/lib/recipeScale";
import type { DayKey, MealProfile, MenuMeal, WeeklyMenuData } from "@/lib/types";

function HalfPageRecipe({
  meal,
  profile,
}: {
  meal: MenuMeal;
  profile: MealProfile;
}) {
  const catalogMeal = meal.mealId ? getMealById(meal.mealId) : undefined;
  const recipe = catalogMeal?.recipe;
  if (!recipe) return null;

  const { ingredients } = scaleRecipe(recipe, profile);
  const label = portionLabel(profile);
  const diffLabel =
    DIFFICULTY_LABELS[meal.difficulty as keyof typeof DIFFICULTY_LABELS] ??
    meal.difficulty;

  return (
    <div className="print-recipe-half">
      <div className="print-recipe-day">{DAY_LABELS[meal.day]}</div>
      <h2 className="print-recipe-name">{meal.name}</h2>
      <p className="print-recipe-meta">
        {meal.prepTime > 0 && `${meal.prepTime} min · `}
        {diffLabel} · Pour {label}
      </p>
      <div className="print-recipe-content">
        <div className="print-recipe-ingredients">
          <h3 className="print-recipe-section">INGRÉDIENTS</h3>
          <ul>
            {ingredients.map((ing, i) => {
              const qty = formatQuantity(ing.quantity, ing.unit);
              return (
                <li key={i}>
                  {qty && <strong>{qty}</strong>} {ing.name}
                  {ing.optional && " (opt.)"}
                </li>
              );
            })}
          </ul>
        </div>
        <div className="print-recipe-steps">
          <h3 className="print-recipe-section">PRÉPARATION</h3>
          <ol>
            {recipe.steps.map((step, i) => (
              <li key={i}>
                <span className="print-step-num">{i + 1}.</span> {step}
              </li>
            ))}
          </ol>
        </div>
      </div>
      {recipe.notes && (
        <p className="print-recipe-notes">{recipe.notes}</p>
      )}
    </div>
  );
}

export function PrintableRecipes({
  menu,
  profile,
  startDay,
}: {
  menu: WeeklyMenuData;
  profile: MealProfile;
  startDay?: DayKey;
}) {
  const days = orderedDays(startDay);
  const mealsWithRecipes = days.flatMap((day) =>
    menu.meals
      .filter((m) => m.day === day && m.mealId && getMealById(m.mealId)?.recipe)
      .sort((a, b) => {
        const order = ["lunch", "dinner"];
        return order.indexOf(a.slot) - order.indexOf(b.slot);
      }),
  );

  if (mealsWithRecipes.length === 0) return null;

  return (
    <div className="print-recipes-container print-only">
      {mealsWithRecipes.map((meal, i) => (
        <HalfPageRecipe key={`${meal.day}-${meal.slot}-${i}`} meal={meal} profile={profile} />
      ))}
    </div>
  );
}
