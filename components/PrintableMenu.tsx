import { MenuSheet } from "./MenuSheet";
import type { WeeklyMenuData } from "@/lib/types";

// Rendu réservé à l'impression : masqué à l'écran, affiché via @media print.
export function PrintableMenu({ menu }: { menu: WeeklyMenuData }) {
  return (
    <div className="print-only">
      <MenuSheet menu={menu} />
    </div>
  );
}
