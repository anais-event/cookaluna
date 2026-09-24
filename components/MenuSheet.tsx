import { Moon, Sun } from "lucide-react";
import { Sparkle } from "./Sparkle";
import {
  DAY_ABBR,
  DAY_LABELS,
  DIFFICULTY_LABELS,
  SLOT_LABELS,
} from "@/lib/constants";
import {
  SHEET_CELLS,
  SHEET_DAY_ORDER,
  buildSheetCells,
  sheetDayOrder,
  groupMealsByDay,
  menuBonusSeed,
  stripWeekPrefix,
  type SlotsByDay,
} from "@/lib/menuSheet";
import { getFridgeBonus, type BonusContent } from "@/lib/fridgeBonus";
import type { SheetView } from "@/lib/store";
import type { DayKey, MealSlot, MenuMeal, WeeklyMenuData } from "@/lib/types";

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
    <div className="sheet-day flex h-full flex-col rounded-2xl border-2 border-ink bg-white">
      <div className="day-head flex items-center justify-center gap-1.5 border-b-2 border-ink bg-coral-light px-3 py-2">
        <Sparkle size={9} color="var(--coral)" />
        <span className="font-display text-[12.5px] font-extrabold uppercase tracking-wide text-ink">
          {DAY_LABELS[day]}
        </span>
        <Sparkle size={9} color="var(--coral)" />
      </div>
      <div className="day-body flex flex-1 flex-col justify-center gap-3 px-2.5 py-2.5 overflow-hidden">
        {activeSlots.length === 0 ? (
          <p className="text-center text-[10px] italic text-ink/50">Journée libre</p>
        ) : (
          activeSlots.map((sl) => {
            const meal = slots!.get(sl)!;
            return (
              <div key={sl} className="meal min-w-0">
                <p className="flex items-center gap-1.5 font-display text-[9px] font-bold uppercase tracking-[0.12em] text-coral">
                  <SlotIcon slot={sl} /> {SLOT_LABELS[sl]}
                </p>
                <p className="mt-0.5 line-clamp-3 break-words text-[10.5px] font-semibold leading-snug text-ink">
                  {meal.name}
                </p>
                {(meal.prepTime > 0 || meal.difficulty) && (
                  <p className="mt-0.5 text-[8.5px] text-ink/55">
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

function NotesCard() {
  return (
    <div className="notes-card flex h-full flex-col rounded-2xl border-2 border-dashed border-coral bg-coral-light p-3">
      <p className="flex items-center gap-1.5 font-display text-[10px] font-extrabold uppercase tracking-wider text-coral">
        <Sparkle size={11} color="var(--coral)" /> Pense-bête du frigo
      </p>
      <p className="mt-1 text-[9px] italic text-ink/60">À noter cette semaine :</p>
      <div className="mt-2 flex flex-1 flex-col justify-between pb-1">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-4 border-b border-coral/55" />
        ))}
      </div>
      <p className="mt-1 text-right text-[8.5px] italic text-ink/55">
        ✎ À compléter à la main
      </p>
    </div>
  );
}

function BonusCard({ bonus }: { bonus: BonusContent }) {
  return (
    <div className="bonus-card flex h-full flex-col rounded-2xl border-2 border-dashed border-ink bg-paper p-3">
      <p className="flex items-center gap-1.5 font-display text-[10px] font-extrabold uppercase tracking-wider text-coral">
        <Sparkle size={11} color="var(--coral)" /> {bonus.title}
      </p>
      <div className="mt-2 flex flex-1 flex-col justify-between">
        {bonus.type === "joke" && (
          <>
            <p className="text-[11.5px] font-semibold leading-snug text-ink">
              {bonus.setup}
            </p>
            <p className="mt-1 text-[11.5px] italic leading-snug text-coral">
              {bonus.punchline}
            </p>
            <p className="mt-2 text-right text-[9px] italic text-ink/55">
              {bonus.signature}
            </p>
          </>
        )}
        {bonus.type === "game" && (
          <>
            <p className="text-[11px] leading-snug text-ink">{bonus.prompt}</p>
            <div className="mt-2">
              <p className="text-[9px] italic text-ink/55">{bonus.hint}</p>
              <div className="mt-0.5 h-3.5 border-b border-ink/40" />
            </div>
            <p className="mt-2 text-right text-[9px] italic text-ink/55">
              ↳ {bonus.answer}
            </p>
          </>
        )}
        {bonus.type === "coloring" && (
          <>
            <p className="text-[10px] italic text-ink/60">{bonus.instruction}</p>
            <div className="my-1 flex flex-1 items-center justify-center">
              <svg
                viewBox="0 0 100 100"
                width="140"
                height="140"
                className="max-h-full"
              >
                {bonus.shape.paths.map((d, i) => (
                  <path
                    key={i}
                    d={d}
                    stroke="var(--ink)"
                    strokeWidth={2.2}
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                ))}
              </svg>
            </div>
            <p className="mt-1 text-right text-[9px] italic text-ink/55">
              Sors les crayons !
            </p>
          </>
        )}
        {bonus.type === "reminder" && (
          <>
            <p className="text-[9px] italic text-ink/60">{bonus.subtitle}</p>
            <div className="mt-1 flex flex-1 flex-col justify-around">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-3.5 border-b border-ink/35" />
              ))}
            </div>
            <p className="mt-1 text-right text-[9px] italic text-ink/55">
              {bonus.footer}
            </p>
          </>
        )}
      </div>
    </div>
  );
}

function Cell({
  cell,
  byDay,
  seed,
}: {
  cell: import("@/lib/menuSheet").SheetCell;
  byDay: SlotsByDay;
  seed: string;
}) {
  if (cell.kind === "day") return <DayCard day={cell.day} slots={byDay.get(cell.day)} />;
  if (cell.kind === "notes") return <NotesCard />;
  return <BonusCard bonus={getFridgeBonus(seed)} />;
}

function ListBody({ byDay, startDay }: { byDay: SlotsByDay; startDay?: DayKey }) {
  return (
    <ul className="sheet-list flex flex-1 flex-col divide-y-2 divide-ink/10 px-6 py-5">
      {sheetDayOrder(startDay).map((day) => {
        const slots = byDay.get(day);
        const meals = (["lunch", "dinner"] as MealSlot[])
          .map((s) => slots?.get(s))
          .filter((m): m is MenuMeal => !!m?.name?.trim());
        return (
          <li key={day} className="flex items-center gap-4 py-3">
            <span className="font-display w-14 shrink-0 text-[15px] font-extrabold uppercase tracking-widest text-coral">
              {DAY_ABBR[day]}
            </span>
            {meals.length === 0 ? (
              <span className="text-[13px] italic text-ink/50">Journée libre</span>
            ) : (
              <span className="font-display text-[15px] font-bold leading-snug text-ink">
                {meals.map((m) => m.name).join(" · ")}
              </span>
            )}
          </li>
        );
      })}
    </ul>
  );
}

// La feuille imprimable Cookaluna. Deux vues :
// - grid : structure 3x3 fixe (jours + FridgeBonus + pense-bete), pleine A4.
// - list : liste compacte 7 lignes, meme identite visuelle.
// Identique en ecran, en impression et en PDF (@react-pdf/renderer).
export function MenuSheet({
  menu,
  view = "grid",
  startDay,
}: {
  menu: WeeklyMenuData;
  view?: SheetView;
  startDay?: DayKey;
}) {
  const byDay = groupMealsByDay(menu.meals);
  const bonusSeed = menuBonusSeed(menu);
  const cells = buildSheetCells(startDay);

  return (
    <div className="menu-sheet flex flex-col bg-paper" data-view={view}>
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
            <p className="font-display text-base font-extrabold">
              {stripWeekPrefix(menu.weekLabel)}
            </p>
          </div>
        </div>
        <p className="sheet-tagline mt-3 max-w-[80%] font-display text-[28px] font-extrabold leading-[1.08]">
          On mange quoi cette semaine&nbsp;?
        </p>
      </header>
      <div className="stripes h-1.5" />

      {view === "list" ? (
        <ListBody byDay={byDay} startDay={startDay} />
      ) : (
        <div className="sheet-grid grid flex-1 grid-cols-3 grid-rows-3 gap-2 p-3">
          {cells.map((cell, i) => (
            <Cell key={i} cell={cell} byDay={byDay} seed={bonusSeed} />
          ))}
        </div>
      )}

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
