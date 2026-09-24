import { MenuSheet } from "./MenuSheet";
import type { SheetView } from "@/lib/store";
import type { DayKey, WeeklyMenuData } from "@/lib/types";

export function PrintableMenu({
  menu,
  view = "grid",
  startDay,
}: {
  menu: WeeklyMenuData;
  view?: SheetView;
  startDay?: DayKey;
}) {
  return (
    <div className="print-only">
      <MenuSheet menu={menu} view={view} startDay={startDay} />
    </div>
  );
}
