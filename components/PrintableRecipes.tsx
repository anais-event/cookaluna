"use client";

import { orderedDays, DAY_LABELS, DIFFICULTY_LABELS, DIET_LABELS, ALLERGEN_LABELS } from "@/lib/constants";
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

function PrintSummary({
  menu,
  profile,
}: {
  menu: WeeklyMenuData;
  profile: MealProfile;
}) {
  const totalMeals = menu.meals.filter((m) => m.name?.trim()).length;
  const diets = profile.dietaryPreferences.filter((d) => d !== "none");
  const allergies = profile.allergies;

  return (
    <div className="print-summary">
      <div className="print-summary-brand">COOKALUNA</div>
      <h2 className="print-summary-title">Récapitulatif</h2>
      <div className="print-summary-body">
        <div className="print-summary-item">
          <span className="print-summary-label">Repas pour</span>
          <span className="print-summary-value">{portionLabel(profile)}</span>
        </div>
        <div className="print-summary-item">
          <span className="print-summary-label">Nombre de repas</span>
          <span className="print-summary-value">{totalMeals} repas cette semaine</span>
        </div>
        {diets.length > 0 && (
          <div className="print-summary-item">
            <span className="print-summary-label">Régime</span>
            <span className="print-summary-value">
              {diets.map((d) => DIET_LABELS[d]).join(", ")}
            </span>
          </div>
        )}
        {allergies.length > 0 && (
          <div className="print-summary-item">
            <span className="print-summary-label">Sans</span>
            <span className="print-summary-value">
              {allergies.map((a) => ALLERGEN_LABELS[a]).join(", ")}
            </span>
          </div>
        )}
        {profile.foodsToAvoid.length > 0 && (
          <div className="print-summary-item">
            <span className="print-summary-label">Aliments évités</span>
            <span className="print-summary-value">
              {profile.foodsToAvoid.join(", ")}
            </span>
          </div>
        )}
      </div>
      <p className="print-summary-footer">
        Généré avec Cookaluna · La semaine est servie.
      </p>
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

  return (
    <div className="print-recipes-container print-only">
      {mealsWithRecipes.map((meal, i) => (
        <HalfPageRecipe key={`${meal.day}-${meal.slot}-${i}`} meal={meal} profile={profile} />
      ))}
      <PrintSummary menu={menu} profile={profile} />
    </div>
  );
}
