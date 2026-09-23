"use client";

import { MenuSheet } from "./MenuSheet";
import type { SheetView } from "@/lib/store";
import type { WeeklyMenuData } from "@/lib/types";

// Aperçu de la feuille à l'écran, encadré façon papier au format A4 portrait.
// La feuille a des dimensions physiques (mm) : le conteneur applique une mise
// à l'échelle CSS pour l'afficher confortablement dans la page tout en
// respectant strictement les proportions du PDF/impression.
export function PrintPreview({
  menu,
  view = "grid",
}: {
  menu: WeeklyMenuData;
  view?: SheetView;
}) {
  return (
    <div className="no-print">
      <div className="menu-sheet-preview mx-auto overflow-hidden rounded-card border-[3px] border-ink shadow-pop">
        <div className="menu-sheet-preview-inner">
          <MenuSheet menu={menu} view={view} />
        </div>
      </div>
    </div>
  );
}
