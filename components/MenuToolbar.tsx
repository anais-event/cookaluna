"use client";

import { useState } from "react";
import { Printer, RefreshCw, Loader2, Check } from "lucide-react";
import { useStore } from "@/lib/store";
import { track } from "@/lib/analytics";
import { generateDemoMenu } from "@/lib/generator";
import { PdfDownloadButton } from "./PdfDownloadButton";
import type { WeeklyMenuData } from "@/lib/types";

export function MenuToolbar({ menu }: { menu: WeeklyMenuData }) {
  const { profile, setMenu } = useStore();
  const [busy, setBusy] = useState(false);
  const [includeRecipes, setIncludeRecipes] = useState(false);
  const [showPrintOptions, setShowPrintOptions] = useState(false);

  const print = (withRecipes: boolean) => {
    setShowPrintOptions(false);
    if (withRecipes) {
      document.body.setAttribute("data-print-recipes", "true");
    } else {
      document.body.removeAttribute("data-print-recipes");
    }
    track("print_clicked", { mode: withRecipes ? "menu_recipes" : "menu" });
    setTimeout(() => {
      window.print();
      document.body.removeAttribute("data-print-recipes");
    }, 100);
  };

  const regenerate = async () => {
    setBusy(true);
    try {
      const res = await fetch("/api/generate-menu", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });
      if (!res.ok) throw new Error("bad");
      const data = await res.json();
      setMenu(data.menu);
      track("menu_generated", { source: data.menu?.source, regen: true });
    } catch {
      setMenu(generateDemoMenu(profile));
      track("menu_generated", { source: "demo", regen: true, fallback: true });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="no-print flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={regenerate}
        disabled={busy}
        className="btn btn-ghost btn-sm"
      >
        {busy ? (
          <Loader2 size={16} className="animate-spin" aria-hidden="true" />
        ) : (
          <RefreshCw size={16} aria-hidden="true" />
        )}
        Tout régénérer
      </button>

      <div className="relative">
        <button
          type="button"
          onClick={() => setShowPrintOptions((v) => !v)}
          className="btn btn-coral btn-sm"
        >
          <Printer size={16} aria-hidden="true" /> Imprimer
        </button>

        {showPrintOptions && (
          <>
            <button
              type="button"
              aria-hidden="true"
              tabIndex={-1}
              onClick={() => setShowPrintOptions(false)}
              className="fixed inset-0 z-40 cursor-default"
            />
            <div className="absolute right-0 top-12 z-50 w-60 overflow-hidden rounded-xl border-[3px] border-ink bg-white shadow-pop sm:left-0 sm:right-auto">
              <label className="flex cursor-pointer items-center gap-3 px-4 py-3 text-sm font-bold hover:bg-coral-light/50">
                <span className="grid h-5 w-5 place-items-center rounded border-2 border-ink bg-coral-light text-ink">
                  <Check size={14} strokeWidth={3} />
                </span>
                Menu
              </label>
              <label className="flex cursor-pointer items-center gap-3 border-t-2 border-ink/10 px-4 py-3 text-sm font-bold hover:bg-coral-light/50">
                <input
                  type="checkbox"
                  checked={includeRecipes}
                  onChange={(e) => setIncludeRecipes(e.target.checked)}
                  className="sr-only"
                />
                <span
                  className={`grid h-5 w-5 place-items-center rounded border-2 border-ink transition ${
                    includeRecipes ? "bg-coral text-white" : "bg-white"
                  }`}
                >
                  {includeRecipes && <Check size={14} strokeWidth={3} />}
                </span>
                Recettes
              </label>
              <div className="border-t-2 border-ink/10 px-4 py-2.5">
                <button
                  type="button"
                  onClick={() => print(includeRecipes)}
                  className="btn btn-primary btn-sm w-full"
                >
                  <Printer size={14} aria-hidden="true" /> Imprimer
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      <PdfDownloadButton />
    </div>
  );
}
