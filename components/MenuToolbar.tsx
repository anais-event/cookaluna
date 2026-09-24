"use client";

import { useState } from "react";
import { Printer, RefreshCw, Loader2 } from "lucide-react";
import { useStore } from "@/lib/store";
import { track } from "@/lib/analytics";
import { generateDemoMenu } from "@/lib/generator";
import { PdfDownloadButton } from "./PdfDownloadButton";
import type { WeeklyMenuData } from "@/lib/types";

export type PrintMode = "menu" | "menu_recipes";

export function MenuToolbar({ menu }: { menu: WeeklyMenuData }) {
  const { profile, setMenu } = useStore();
  const [busy, setBusy] = useState(false);
  const [printMode, setPrintMode] = useState<PrintMode>("menu");
  const [showPrintOptions, setShowPrintOptions] = useState(false);

  const print = () => {
    if (printMode === "menu_recipes") {
      document.body.setAttribute("data-print-recipes", "true");
    } else {
      document.body.removeAttribute("data-print-recipes");
    }
    track("print_clicked", { mode: printMode });
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
            <div className="absolute left-0 top-12 z-50 w-56 overflow-hidden rounded-xl border-[3px] border-ink bg-white shadow-pop">
              <div className="px-3 py-2">
                <p className="font-display text-xs font-bold uppercase tracking-widest text-coral">
                  Que voulez-vous imprimer ?
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setPrintMode("menu");
                  setShowPrintOptions(false);
                  setTimeout(() => {
                    document.body.removeAttribute("data-print-recipes");
                    track("print_clicked", { mode: "menu" });
                    window.print();
                  }, 100);
                }}
                className={`flex w-full items-center gap-2 border-t-2 border-ink/10 px-3 py-2.5 text-left text-sm font-bold hover:bg-coral-light ${
                  printMode === "menu" ? "bg-coral-light" : ""
                }`}
              >
                Menu uniquement
              </button>
              <button
                type="button"
                onClick={() => {
                  setPrintMode("menu_recipes");
                  setShowPrintOptions(false);
                  setTimeout(() => {
                    document.body.setAttribute("data-print-recipes", "true");
                    track("print_clicked", { mode: "menu_recipes" });
                    window.print();
                    document.body.removeAttribute("data-print-recipes");
                  }, 100);
                }}
                className={`flex w-full items-center gap-2 border-t-2 border-ink/10 px-3 py-2.5 text-left text-sm font-bold hover:bg-coral-light ${
                  printMode === "menu_recipes" ? "bg-coral-light" : ""
                }`}
              >
                Menu + recettes
              </button>
            </div>
          </>
        )}
      </div>

      <PdfDownloadButton />
    </div>
  );
}
