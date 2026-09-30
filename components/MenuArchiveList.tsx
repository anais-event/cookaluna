"use client";

import { useState } from "react";
import { MENU_ARCHIVE } from "@/lib/menuArchive";
import { MenuSheet } from "./MenuSheet";
import { Sparkle } from "./Sparkle";
import { StripePattern } from "./StripePattern";
import { Printer, ChevronLeft, ChevronRight } from "lucide-react";

export function MenuArchiveList() {
  const [selected, setSelected] = useState(0);
  const menu = MENU_ARCHIVE[selected];

  const print = () => {
    document.body.removeAttribute("data-print-recipes");
    window.print();
  };

  return (
    <>
      {/* Week selector */}
      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => setSelected((s) => Math.min(s + 1, MENU_ARCHIVE.length - 1))}
            disabled={selected >= MENU_ARCHIVE.length - 1}
            className="btn btn-ghost btn-sm"
            aria-label="Semaine précédente"
          >
            <ChevronLeft size={18} />
          </button>

          <h2 className="font-display text-center text-2xl font-extrabold sm:text-3xl">
            {menu.weekLabel}
          </h2>

          <button
            type="button"
            onClick={() => setSelected((s) => Math.max(s - 1, 0))}
            disabled={selected <= 0}
            className="btn btn-ghost btn-sm"
            aria-label="Semaine suivante"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        {/* Week pills */}
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {MENU_ARCHIVE.map((m, i) => {
            const short = m.weekLabel.replace("Semaine du ", "");
            return (
              <button
                key={i}
                type="button"
                onClick={() => setSelected(i)}
                className={`rounded-full border-2 border-ink px-3 py-1 font-display text-xs font-bold transition-colors ${
                  i === selected
                    ? "bg-coral text-white"
                    : "bg-white text-ink hover:bg-coral-light"
                }`}
              >
                {short}
              </button>
            );
          })}
        </div>
      </section>

      {/* Menu preview + print */}
      <section className="bg-coral-light">
        <StripePattern height={14} />
        <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6">
          <div className="mx-auto max-w-3xl overflow-hidden rounded-card border-[3px] border-ink shadow-pop">
            <div className="menu-sheet-preview">
              <div className="menu-sheet-preview-inner">
                <MenuSheet menu={menu} />
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-center gap-4">
            <button
              type="button"
              onClick={print}
              className="btn btn-coral"
            >
              <Printer size={18} aria-hidden="true" />
              Télécharger / imprimer
            </button>
          </div>

          <p className="mt-4 flex items-center justify-center gap-2 text-sm text-ink/60">
            <Sparkle size={12} color="var(--coral)" />
            Un nouveau menu chaque semaine
          </p>
        </div>
        <StripePattern height={14} />
      </section>

      {/* Meal list for this week */}
      <section className="no-print mx-auto max-w-4xl px-4 py-14 sm:px-6">
        <h3 className="font-display text-2xl font-extrabold">
          Au programme cette semaine
        </h3>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {menu.meals.map((m, i) => (
            <div key={i} className="card-flat flex items-center gap-3 p-4">
              <span className="font-display text-xs font-bold uppercase tracking-widest text-coral">
                {dayAbbr(m.day)}
                <span className="ml-1 text-ink/50">{m.slot === "lunch" ? "midi" : "soir"}</span>
              </span>
              <span className="text-sm font-medium">{m.name}</span>
              {m.prepTime > 0 && (
                <span className="ml-auto text-xs text-ink/50">
                  {m.prepTime} min
                </span>
              )}
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

function dayAbbr(day: string): string {
  const MAP: Record<string, string> = {
    monday: "LUN",
    tuesday: "MAR",
    wednesday: "MER",
    thursday: "JEU",
    friday: "VEN",
    saturday: "SAM",
    sunday: "DIM",
  };
  return MAP[day] ?? day;
}
