"use client";

import { useStore } from "@/lib/store";
import { orderedDays } from "@/lib/constants";
import { DayCard } from "./DayCard";
import type { DayKey, MealSlot } from "@/lib/types";

export function WeeklyMenu() {
  const { menu, profile } = useStore();
  if (!menu) return null;

  const byDay = new Map<DayKey, Set<MealSlot>>();
  for (const m of menu.meals) {
    if (!byDay.has(m.day)) byDay.set(m.day, new Set());
    byDay.get(m.day)!.add(m.slot);
  }
  const days = orderedDays(profile.startDay).filter((d) => byDay.has(d));

  const slotOrder = (set: Set<MealSlot>): MealSlot[] =>
    (["lunch", "dinner"] as MealSlot[]).filter((s) => set.has(s));

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
      {days.map((day) => (
        <DayCard key={day} day={day} slots={slotOrder(byDay.get(day)!)} />
      ))}
    </div>
  );
}
