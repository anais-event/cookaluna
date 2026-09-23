import { Citrus, CookingPot, Leaf, Moon, Sun } from "lucide-react";
import { Sparkle } from "./Sparkle";
import { DAY_LABELS, DIFFICULTY_LABELS, SLOT_LABELS, weekDayOrder } from "@/lib/constants";
import type { DayKey, MealSlot, MenuMeal, WeeklyMenuData } from "@/lib/types";

// Petites citations de secours quand aucun ingrédient n'est réellement réutilisé
// cette semaine — évite une case vide dans la grille 3x3.
const FALLBACK_QUOTES = [
  { text: "La vie est un repas partagé.", author: "Proverbe" },
  { text: "Le bonheur, c'est du temps, pas de la vaisselle.", author: "Cookaluna" },
  { text: "Moins de charge mentale, plus de place à table.", author: "Cookaluna" },
  { text: "Un bon repas efface une mauvaise journée.", author: "Proverbe" },
];

function pickFallbackQuote(seed: string) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return FALLBACK_QUOTES[h % FALLBACK_QUOTES.length];
}

function reusedIngredients(meals: MenuMeal[]): string[] {
  const counts = new Map<string, number>();
  for (const m of meals) {
    for (const r of m.reuseIngredients) counts.set(r, (counts.get(r) || 0) + 1);
  }
  return [...counts.entries()]
    .filter(([, n]) => n >= 2)
    .map(([name]) => name)
    .slice(0, 4);
}

function SlotIcon({ slot }: { slot: MealSlot }) {
  return slot === "lunch" ? (
    <Sun size={11} strokeWidth={2.5} className="text-coral" aria-hidden="true" />
  ) : (
    <Moon size={11} strokeWidth={2.5} className="text-coral" aria-hidden="true" />
  );
}

function DayCard({
  day,
  slots,
  doodle,
}: {
  day: DayKey;
  slots: Map<MealSlot, MenuMeal>;
  doodle?: React.ReactNode;
}) {
  return (
    <div className="sheet-day flex flex-col overflow-hidden rounded-2xl border-2 border-ink bg-white">
      <div className="day-head flex items-center justify-between gap-2 bg-coral-light px-3 py-1.5">
        <span className="font-display text-[15px] font-extrabold uppercase tracking-wide text-ink">
          {DAY_LABELS[day]}
        </span>
        {doodle}
      </div>
      <div className="day-body flex flex-1 flex-col justify-center gap-3 px-3 py-3">
        {(["lunch", "dinner"] as MealSlot[])
          .filter((s) => slots.has(s))
          .map((s) => {
            const meal = slots.get(s)!;
            return (
              <div key={s}>
                <p className="flex items-center gap-1.5 font-display text-[10px] font-bold uppercase tracking-[0.12em] text-coral">
                  <SlotIcon slot={s} /> {SLOT_LABELS[s]}
                </p>
                <p className="mt-1 text-[13px] font-semibold leading-snug text-ink">
                  {meal.name || "—"}
                </p>
                {(meal.prepTime > 0 || meal.difficulty) && (
                  <p className="mt-0.5 text-[10.5px] text-ink/55">
                    {meal.prepTime > 0 ? `${meal.prepTime} min` : null}
                    {meal.prepTime > 0 && meal.difficulty ? " · " : null}
                    {meal.difficulty ? DIFFICULTY_LABELS[meal.difficulty] : null}
                  </p>
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
}

// Mise en page "feuille" partagée entre l'aperçu écran et l'impression.
export function MenuSheet({ menu }: { menu: WeeklyMenuData }) {
  const byDay = new Map<DayKey, Map<MealSlot, MenuMeal>>();
  for (const m of menu.meals) {
    if (!byDay.has(m.day)) byDay.set(m.day, new Map());
    byDay.get(m.day)!.set(m.slot, m);
  }
  const days = weekDayOrder().filter((d) => byDay.has(d));
  const firstDays = days.slice(0, 6);
  const lastDay = days[6];

  const tips = reusedIngredients(menu.meals);
  const quote = pickFallbackQuote(menu.weekLabel);

  return (
    <div className="menu-sheet mx-auto flex w-full flex-col bg-paper" style={{ maxWidth: "210mm" }}>
      {/* En-tête */}
      <header className="sheet-header relative overflow-hidden bg-coral px-7 pb-6 pt-6 text-white">
        <Citrus
          size={54}
          strokeWidth={1.5}
          className="pointer-events-none absolute -right-2 -top-3 text-white/15"
          aria-hidden="true"
        />
        <div className="relative flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Sparkle size={20} color="#FFFFFF" />
            <span className="brand-name font-display text-2xl font-extrabold tracking-tight sm:text-[28px]">
              COOKALUNA
            </span>
          </div>
          <div className="text-right">
            <p className="font-display text-[10px] font-bold uppercase tracking-[0.25em] text-white/85">
              Semaine du
            </p>
            <p className="font-display text-base font-extrabold sm:text-lg">
              {menu.weekLabel}
            </p>
          </div>
        </div>
        <p className="sheet-tagline relative mt-4 max-w-[80%] font-display text-3xl font-extrabold leading-[1.08] sm:text-4xl">
          On mange quoi cette semaine&nbsp;?
        </p>
      </header>
      <div className="stripes h-3" />

      {/* Grille 3x3 : 6 jours, dimanche, puis bloc astuce */}
      <div className="sheet-grid grid flex-1 grid-cols-3 gap-3 px-6 py-5 sm:gap-4">
        {firstDays.map((day, idx) => (
          <DayCard
            key={day}
            day={day}
            slots={byDay.get(day)!}
            doodle={idx === 2 ? <Leaf size={14} strokeWidth={2} className="text-ink/40" aria-hidden="true" /> : undefined}
          />
        ))}

        {lastDay && <DayCard day={lastDay} slots={byDay.get(lastDay)!} />}

        <div className="tips-card relative col-span-2 flex flex-col justify-center overflow-hidden rounded-2xl border-2 border-dashed border-coral bg-coral-light px-4 py-3">
          <CookingPot
            size={46}
            strokeWidth={1.5}
            className="pointer-events-none absolute -bottom-3 -right-3 text-coral/20"
            aria-hidden="true"
          />
          {tips.length > 0 ? (
            <>
              <p className="relative flex items-center gap-1.5 font-display text-[11px] font-extrabold uppercase tracking-wider text-coral">
                <Sparkle size={11} color="var(--coral)" /> On réutilise certains ingrédients
              </p>
              <ul className="relative mt-1.5 flex flex-wrap gap-x-4 gap-y-1">
                {tips.map((item) => (
                  <li key={item} className="text-[13px] font-semibold text-ink">
                    ✓ {item}
                  </li>
                ))}
              </ul>
              <p className="relative mt-1.5 text-[10.5px] text-ink/60">
                Moins de courses, moins de gaspillage, plus de temps pour le reste.
              </p>
            </>
          ) : (
            <>
              <p className="relative flex items-center gap-1.5 font-display text-[11px] font-extrabold uppercase tracking-wider text-coral">
                <Sparkle size={11} color="var(--coral)" /> Petite pensée du frigo
              </p>
              <p className="relative mt-1.5 text-[13px] font-semibold italic leading-snug text-ink">
                « {quote.text} »
              </p>
              <p className="relative mt-1 text-[10.5px] text-ink/60">— {quote.author}</p>
            </>
          )}
        </div>
      </div>

      <div className="stripes h-2" />
      <footer className="flex flex-wrap items-center justify-between gap-2 bg-ink px-6 py-2.5 text-paper">
        <span className="font-display flex items-center gap-1.5 text-xs font-bold">
          <Sparkle size={11} color="var(--coral)" /> COOKALUNA
        </span>
        <span className="font-display text-xs font-bold">La semaine est servie.</span>
        <span className="font-display text-xs font-bold">À afficher sur le frigo.</span>
      </footer>
    </div>
  );
}
