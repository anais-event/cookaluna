"use client";

import { Repeat } from "lucide-react";
import { useStore } from "@/lib/store";
import { weekDayOrder } from "@/lib/constants";
import { DayCard } from "./DayCard";
import type { DayKey, MealSlot } from "@/lib/types";

export function WeeklyMenu() {
  const { menu } = useStore();
  if (!menu) return null;

  // Regroupe les créneaux présents par jour, dans l'ordre.
  const byDay = new Map<DayKey, Set<MealSlot>>();
  for (const m of menu.meals) {
    if (!byDay.has(m.day)) byDay.set(m.day, new Set());
    byDay.get(m.day)!.add(m.slot);
  }
  const days = weekDayOrder().filter((d) => byDay.has(d));

  const slotOrder = (set: Set<MealSlot>): MealSlot[] =>
    (["lunch", "dinner"] as MealSlot[]).filter((s) => set.has(s));

  return (
    <div>
      {menu.reusedNote && (
        <p className="mb-4 inline-flex items-center gap-2 rounded-full border-[3px] border-ink bg-coral-light px-4 py-1.5 text-sm font-bold">
          <Repeat size={16} aria-hidden="true" /> On réutilise certains
          ingrédients cette semaine.
        </p>
      )}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {days.map((day) => (
          <DayCard key={day} day={day} slots={slotOrder(byDay.get(day)!)} />
        ))}
      </div>
    </div>
  );
}
