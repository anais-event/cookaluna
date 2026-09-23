import { MenuSheet } from "./MenuSheet";
import type { SheetView } from "@/lib/store";
import type { WeeklyMenuData } from "@/lib/types";

// Rendu réservé à l'impression : masqué à l'écran, affiché via @media print.
export function PrintableMenu({
  menu,
  view = "grid",
}: {
  menu: WeeklyMenuData;
  view?: SheetView;
}) {
  return (
    <div className="print-only">
      <MenuSheet menu={menu} view={view} />
    </div>
  );
}
