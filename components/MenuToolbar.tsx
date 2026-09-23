"use client";

import { useState } from "react";
import { Printer, RefreshCw, Wand2, Loader2 } from "lucide-react";
import { useStore } from "@/lib/store";
import { track } from "@/lib/analytics";
import { generateDemoMenu, resolveWish } from "@/lib/generator";
import { PdfDownloadButton } from "./PdfDownloadButton";
import type { MealProfile, WeeklyMenuData } from "@/lib/types";

export function MenuToolbar({ menu }: { menu: WeeklyMenuData }) {
  const { profile, setMenu } = useStore();
  const [busy, setBusy] = useState(false);
  const [wish, setWish] = useState("");

  const print = () => {
    track("print_clicked");
    window.print();
  };

  const regenerate = async (extraWish?: string) => {
    setBusy(true);
    let p: MealProfile = profile;
    if (extraWish) {
      // L'envie libre n'est jamais placée telle quelle comme repas.
      // Démo : on tente de la relier à un plat du catalogue.
      // IA : elle est transmise en langage naturel (adaptWish) pour interprétation.
      const matched = resolveWish(profile, extraWish);
      p = {
        ...profile,
        adaptWish: extraWish,
        ideas: matched ? [...profile.ideas, matched] : profile.ideas,
      };
    }
    try {
      const res = await fetch("/api/generate-menu", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(p),
      });
      if (!res.ok) throw new Error("bad");
      const data = await res.json();
      setMenu(data.menu);
      track("menu_generated", { source: data.menu?.source, regen: true });
    } catch {
      setMenu(generateDemoMenu(p));
      track("menu_generated", { source: "demo", regen: true, fallback: true });
    } finally {
      setBusy(false);
      setWish("");
    }
  };

  return (
    <div className="no-print">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => regenerate()}
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
        <button type="button" onClick={print} className="btn btn-coral btn-sm">
          <Printer size={16} aria-hidden="true" /> Imprimer
        </button>
        <PdfDownloadButton menu={menu} />
      </div>

      <div className="card mt-4 p-4">
        <p className="font-display text-lg font-bold">Une envie précise ?</p>
        <div className="mt-2 flex flex-col gap-2 sm:flex-row">
          <input
            type="text"
            value={wish}
            onChange={(e) => setWish(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && wish.trim()) regenerate(wish.trim());
            }}
            placeholder="Ex : je veux un plat de pâtes jeudi soir"
            aria-label="Votre envie"
            className="w-full rounded-xl border-[3px] border-ink bg-white px-3 py-2"
          />
          <button
            type="button"
            onClick={() => wish.trim() && regenerate(wish.trim())}
            disabled={busy || !wish.trim()}
            className="btn btn-primary btn-sm shrink-0"
          >
            <Wand2 size={16} aria-hidden="true" /> Adapter ma semaine
          </button>
        </div>
      </div>
    </div>
  );
}
