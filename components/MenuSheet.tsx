import { Moon, Sun } from "lucide-react";
import { Sparkle } from "./Sparkle";
import { DAY_LABELS, DIFFICULTY_LABELS, SLOT_LABELS } from "@/lib/constants";
import {
  SHEET_CELLS,
  groupMealsByDay,
  reusedIngredients,
  type SlotsByDay,
} from "@/lib/menuSheet";
import type { DayKey, MealSlot, MenuMeal, WeeklyMenuData } from "@/lib/types";

const DECOR_QUOTES = [
  { text: "La vie est un repas partagé.", author: "Proverbe" },
  { text: "Le bonheur, c'est du temps, pas de la vaisselle.", author: "Cookaluna" },
  { text: "Moins de charge mentale, plus de place à table.", author: "Cookaluna" },
  { text: "Un bon repas efface une mauvaise journée.", author: "Proverbe" },
];

function pickQuote(seed: string) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return DECOR_QUOTES[h % DECOR_QUOTES.length];
}

function SlotIcon({ slot }: { slot: MealSlot }) {
  return slot === "lunch" ? (
    <Sun size={11} strokeWidth={2.5} className="text-coral" aria-hidden="true" />
  ) : (
    <Moon size={11} strokeWidth={2.5} className="text-coral" aria-hidden="true" />
  );
}

function DayCard({ day, slots }: { day: DayKey; slots?: Map<MealSlot, MenuMeal> }) {
  const activeSlots = (["lunch", "dinner"] as MealSlot[]).filter((sl) =>
    slots?.get(sl)?.name?.trim(),
  );
  return (
    <div className="sheet-day flex h-full flex-col overflow-hidden rounded-2xl border-2 border-ink bg-white">
      <div className="day-head flex items-center justify-between gap-2 border-b-2 border-ink bg-coral-light px-3 py-1.5">
        <span className="font-display text-[12.5px] font-extrabold uppercase tracking-wide text-ink">
          {DAY_LABELS[day]}
        </span>
        <Sparkle size={10} color="var(--coral)" />
      </div>
      <div className="day-body flex flex-1 flex-col justify-center gap-3 px-2.5 py-2.5">
        {activeSlots.length === 0 ? (
          <p className="text-center text-[10px] italic text-ink/50">Journée libre</p>
        ) : (
          activeSlots.map((sl) => {
            const meal = slots!.get(sl)!;
            return (
              <div key={sl} className="meal">
                <p className="flex items-center gap-1.5 font-display text-[9.5px] font-bold uppercase tracking-[0.14em] text-coral">
                  <SlotIcon slot={sl} /> {SLOT_LABELS[sl]}
                </p>
                <p className="mt-0.5 line-clamp-3 text-[11.5px] font-semibold leading-snug text-ink">
                  {meal.name}
                </p>
                {(meal.prepTime > 0 || meal.difficulty) && (
                  <p className="mt-0.5 text-[9.5px] text-ink/55">
                    {meal.prepTime > 0 ? `${meal.prepTime} min` : null}
                    {meal.prepTime > 0 && meal.difficulty ? " · " : null}
                    {meal.difficulty ? DIFFICULTY_LABELS[meal.difficulty] : null}
                  </p>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

function NotesCard({ reused }: { reused: string[] }) {
  return (
    <div className="notes-card flex h-full flex-col rounded-2xl border-2 border-dashed border-coral bg-coral-light p-3">
      <p className="flex items-center gap-1.5 font-display text-[10px] font-extrabold uppercase tracking-wider text-coral">
        <Sparkle size={11} color="var(--coral)" /> Pense-bête du frigo
      </p>
      {reused.length > 0 ? (
        <>
          <p className="mt-1 text-[9px] italic text-ink/60">
            Ingrédients qui reviennent cette semaine
          </p>
          <ul className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5">
            {reused.map((item) => (
              <li key={item} className="text-[11px] font-semibold text-ink">
                • {item}
              </li>
            ))}
          </ul>
          <p className="mt-1 text-[9px] italic text-ink/60">
            À racheter ou noter ci-dessous :
          </p>
        </>
      ) : (
        <p className="mt-1 text-[9px] italic text-ink/60">
          Courses, envies, restes à finir…
        </p>
      )}
      <div className="mt-2 flex flex-1 flex-col justify-between pb-1">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-3.5 border-b border-coral/55" />
        ))}
      </div>
    </div>
  );
}

function DecorCard({ seed }: { seed: string }) {
  const q = pickQuote(seed);
  return (
    <div className="decor-card flex h-full flex-col items-center justify-center rounded-2xl border-2 border-ink bg-paper p-3 text-center">
      <Sparkle size={18} color="var(--coral)" />
      <p className="mt-2 font-display text-[10px] font-extrabold uppercase tracking-widest text-coral">
        On respire
      </p>
      <p className="mt-2 text-[11px] italic leading-snug text-ink">
        « {q.text} »
      </p>
      <p className="mt-1 text-[9px] text-ink/60">— {q.author}</p>
    </div>
  );
}

function Cell({
  cellIndex,
  byDay,
  reused,
  seed,
}: {
  cellIndex: number;
  byDay: SlotsByDay;
  reused: string[];
  seed: string;
}) {
  const cell = SHEET_CELLS[cellIndex];
  if (cell.kind === "day") return <DayCard day={cell.day} slots={byDay.get(cell.day)} />;
  if (cell.kind === "notes") return <NotesCard reused={reused} />;
  return <DecorCard seed={seed} />;
}

// La feuille imprimable Cookaluna. Structure fixe 3x3, identique en ecran,
// en impression navigateur et en PDF (@react-pdf/renderer). Aucune coupure :
// tout tient sur une A4 portrait.
export function MenuSheet({ menu }: { menu: WeeklyMenuData }) {
  const byDay = groupMealsByDay(menu.meals);
  const reused = reusedIngredients(menu.meals);

  return (
    <div className="menu-sheet flex flex-col bg-paper">
      <header className="sheet-header flex flex-col justify-between bg-coral px-7 pb-5 pt-5 text-white">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-2">
            <Sparkle size={20} color="#FFFFFF" />
            <span className="brand-name font-display text-[26px] font-extrabold tracking-tight">
              COOKALUNA
            </span>
          </div>
          <div className="text-right">
            <p className="font-display text-[10px] font-bold uppercase tracking-[0.25em] text-white/85">
              Semaine du
            </p>
            <p className="font-display text-base font-extrabold">{menu.weekLabel}</p>
          </div>
        </div>
        <p className="sheet-tagline mt-3 max-w-[80%] font-display text-[28px] font-extrabold leading-[1.08]">
          On mange quoi cette semaine&nbsp;?
        </p>
      </header>
      <div className="stripes h-1.5" />

      <div className="sheet-grid grid flex-1 grid-cols-3 grid-rows-3 gap-2 p-3">
        {SHEET_CELLS.map((_, i) => (
          <Cell key={i} cellIndex={i} byDay={byDay} reused={reused} seed={menu.weekLabel} />
        ))}
      </div>

      <div className="stripes h-1.5" />
      <footer className="sheet-footer flex items-center justify-between bg-ink px-6 py-2 text-paper">
        <span className="font-display flex items-center gap-1.5 text-[11px] font-bold tracking-wide">
          <Sparkle size={11} color="var(--coral)" /> COOKALUNA
        </span>
        <span className="font-display text-[11px] font-bold tracking-wide">
          La semaine est servie.
        </span>
        <span className="font-display text-[11px] font-bold tracking-wide">
          À afficher sur le frigo.
        </span>
      </footer>
    </div>
  );
}
