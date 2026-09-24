"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { track } from "@/lib/analytics";

export function PdfDownloadButton() {
  const [busy, setBusy] = useState(false);

  const download = async () => {
    const element = document.getElementById("print-canvas-area");
    if (!element) return;

    setBusy(true);
    try {
      const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
        import("html2canvas"),
        import("jspdf"),
      ]);

      const canvas = await html2canvas(element, {
        scale: 3,
        useCORS: true,
        logging: false,
        backgroundColor: null,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      const imgRatio = canvas.width / canvas.height;
      const pageRatio = pdfWidth / pdfHeight;

      let w: number, h: number, x: number, y: number;
      if (imgRatio > pageRatio) {
        w = pdfWidth;
        h = pdfWidth / imgRatio;
        x = 0;
        y = 0;
      } else {
        h = pdfHeight;
        w = pdfHeight * imgRatio;
        x = (pdfWidth - w) / 2;
        y = 0;
      }

      pdf.addImage(imgData, "PNG", x, y, w, h, undefined, "FAST");
      pdf.save("mon-menu-cookaluna.pdf");
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
