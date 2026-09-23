import { DAY_LABELS, SLOT_LABELS, weekDayOrder } from "@/lib/constants";
import type { DayKey, MealSlot, WeeklyMenuData } from "@/lib/types";

// Mise en page "feuille" partagée entre l'aperçu écran et l'impression.
export function MenuSheet({ menu }: { menu: WeeklyMenuData }) {
  const byDay = new Map<DayKey, Map<MealSlot, string>>();
  for (const m of menu.meals) {
    if (!byDay.has(m.day)) byDay.set(m.day, new Map());
    byDay.get(m.day)!.set(m.slot, m.name);
  }
  const days = weekDayOrder().filter((d) => byDay.has(d));

  return (
    <div className="mx-auto w-full bg-paper" style={{ maxWidth: "210mm" }}>
      {/* En-tête */}
      <div className="bg-coral px-6 py-5 text-white">
        <p className="font-display text-xs font-bold uppercase tracking-[0.2em]">
          On mange quoi cette semaine ?
        </p>
        <div className="mt-1 flex items-end justify-between gap-4">
          <h1 className="font-display text-4xl font-extrabold leading-none">
            COOKALUNA
          </h1>
          <p className="font-display text-sm font-bold">{menu.weekLabel}</p>
        </div>
      </div>
      <div className="stripes" style={{ height: 10 }} />

      {/* Jours */}
      <div className="grid grid-cols-1 gap-0 sm:grid-cols-2">
        {days.map((day, idx) => {
          const slots = byDay.get(day)!;
          return (
            <div
              key={day}
              className="border-b-2 border-ink/15 px-6 py-3"
              style={{
                borderRight: idx % 2 === 0 ? "2px solid rgba(17,17,17,0.15)" : undefined,
              }}
            >
              <p className="font-display text-lg font-extrabold uppercase tracking-wide text-coral">
                {DAY_LABELS[day]}
              </p>
              <div className="mt-1 space-y-1">
                {(["lunch", "dinner"] as MealSlot[])
                  .filter((s) => slots.has(s))
                  .map((s) => (
                    <div key={s} className="flex gap-2 text-sm">
                      <span className="font-display w-12 shrink-0 font-bold text-ink/60">
                        {SLOT_LABELS[s]}
                      </span>
                      <span className="font-medium">
                        {slots.get(s) || "—"}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="stripes" style={{ height: 10 }} />
      <div className="bg-ink px-6 py-2 text-center">
        <span className="font-display text-xs font-bold text-paper">
          Cookaluna · La semaine est servie.
        </span>
      </div>
    </div>
  );
}
