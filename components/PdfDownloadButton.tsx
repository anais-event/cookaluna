"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { track } from "@/lib/analytics";
import type { SheetView } from "@/lib/store";
import type { WeeklyMenuData } from "@/lib/types";

export function PdfDownloadButton({
  menu,
  view = "grid",
}: {
  menu: WeeklyMenuData;
  view?: SheetView;
}) {
  const [busy, setBusy] = useState(false);

  const download = async () => {
    setBusy(true);
    try {
      // Import dynamique : @react-pdf/renderer reste hors du bundle initial.
      const [{ pdf }, { MenuPdfDocument }] = await Promise.all([
        import("@react-pdf/renderer"),
        import("./MenuPdfDocument"),
      ]);
      const blob = await pdf(<MenuPdfDocument menu={menu} view={view} />).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "cookaluna-menu.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      track("pdf_downloaded");
    } catch (err) {
      console.error("PDF error", err);
      alert("Le PDF n'a pas pu être généré. Réessayez.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      type="button"
      onClick={download}
      disabled={busy}
      className="btn btn-primary btn-sm"
    >
      {busy ? (
        <Loader2 size={16} className="animate-spin" aria-hidden="true" />
      ) : (
        <Download size={16} aria-hidden="true" />
      )}
      Télécharger le PDF
    </button>
  );
}
