"use client";

import { MenuSheet } from "./MenuSheet";
import type { SheetView } from "@/lib/store";
import type { DayKey, WeeklyMenuData } from "@/lib/types";

export function PrintPreview({
  menu,
  view = "grid",
  startDay,
}: {
  menu: WeeklyMenuData;
  view?: SheetView;
  startDay?: DayKey;
}) {
  return (
    <div className="no-print">
      <div id="print-canvas-area" className="menu-sheet-preview mx-auto overflow-hidden rounded-card border-[3px] border-ink shadow-pop">
        <div className="menu-sheet-preview-inner">
          <MenuSheet menu={menu} view={view} startDay={startDay} />
        </div>
      </div>
    </div>
  );
}
