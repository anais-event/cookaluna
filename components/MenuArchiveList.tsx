"use client";

import { useState, useRef, useEffect } from "react";
import { MENU_ARCHIVE } from "@/lib/menuArchive";
import { MenuSheet } from "./MenuSheet";
import { Sparkle } from "./Sparkle";
import { StripePattern } from "./StripePattern";
import { Printer, ChevronDown } from "lucide-react";

export function MenuArchiveList() {
  const [selected, setSelected] = useState(0);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const menu = MENU_ARCHIVE[selected];

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  const print = () => {
    document.body.removeAttribute("data-print-recipes");
    window.print();
  };

  return (
    <>
      {/* Week selector */}
      <section className="no-print mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex flex-col items-center gap-4">
          <div ref={dropdownRef} className="relative">
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              className="flex items-center gap-3 rounded-2xl border-[3px] border-ink bg-white px-6 py-3 font-display text-xl font-extrabold shadow-pop transition-colors hover:bg-coral-light sm:text-2xl"
            >
              {menu.weekLabel}
              <ChevronDown
                size={20}
                className={`transition-transform ${open ? "rotate-180" : ""}`}
              />
            </button>

            {open && (
              <div className="absolute left-1/2 z-30 mt-2 w-72 -translate-x-1/2 rounded-2xl border-[3px] border-ink bg-white py-2 shadow-pop">
                {MENU_ARCHIVE.map((m, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      setSelected(i);
                      setOpen(false);
                    }}
                    className={`w-full px-5 py-2.5 text-left font-display text-sm font-bold transition-colors ${
                      i === selected
                        ? "bg-coral text-white"
                        : "text-ink hover:bg-coral-light"
                    }`}
                  >
                    {m.weekLabel}
                  </button>
                ))}
              </div>
            )}
          </div>
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

          <div className="no-print mt-8 flex justify-center gap-4">
            <button
              type="button"
              onClick={print}
              className="btn btn-coral"
            >
              <Printer size={18} aria-hidden="true" />
              Télécharger / imprimer
            </button>
          </div>

          <p className="no-print mt-4 flex items-center justify-center gap-2 text-sm text-ink/60">
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
