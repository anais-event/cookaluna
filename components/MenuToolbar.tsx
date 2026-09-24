"use client";

import { useState } from "react";
import { Printer, RefreshCw, Loader2 } from "lucide-react";
import { useStore } from "@/lib/store";
import { track } from "@/lib/analytics";
import { generateDemoMenu } from "@/lib/generator";
import { PdfDownloadButton } from "./PdfDownloadButton";
import type { WeeklyMenuData } from "@/lib/types";

export function MenuToolbar({ menu }: { menu: WeeklyMenuData }) {
  const { profile, setMenu } = useStore();
  const [busy, setBusy] = useState(false);

  const print = () => {
    track("print_clicked");
    window.print();
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
    <div className="no-print flex flex-wrap gap-2">
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
      <button type="button" onClick={print} className="btn btn-coral btn-sm">
        <Printer size={16} aria-hidden="true" /> Imprimer
      </button>
      <PdfDownloadButton />
    </div>
  );
}
