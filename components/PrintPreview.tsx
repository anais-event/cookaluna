"use client";

import { MenuSheet } from "./MenuSheet";
import type { WeeklyMenuData } from "@/lib/types";

// Aperçu de la feuille à l'écran, encadré façon papier.
export function PrintPreview({ menu }: { menu: WeeklyMenuData }) {
  return (
    <div className="no-print">
      <div className="mx-auto max-w-3xl overflow-hidden rounded-card border-[3px] border-ink shadow-pop">
        <MenuSheet menu={menu} />
      </div>
    </div>
  );
}
