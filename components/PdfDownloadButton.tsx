"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { track } from "@/lib/analytics";

type PdfMode = "menu" | "menu_recipes";

export function PdfDownloadButton() {
  const [busy, setBusy] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  const download = async (mode: PdfMode) => {
    setShowOptions(false);

    const element = document.getElementById("print-canvas-area");
    if (!element) return;

    setBusy(true);
    try {
      const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
        import("html2canvas"),
        import("jspdf"),
      ]);

      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      const addElementToPdf = async (el: HTMLElement, addPage: boolean) => {
        if (addPage) pdf.addPage();
        const canvas = await html2canvas(el, {
          scale: 3,
          useCORS: true,
          logging: false,
          backgroundColor: null,
        });
        const imgData = canvas.toDataURL("image/png");
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
      };

      await addElementToPdf(element, false);

      if (mode === "menu_recipes") {
        const recipesEl = document.querySelector(".print-recipes-container") as HTMLElement | null;
        if (recipesEl) {
          recipesEl.style.display = "block";
          const recipeCards = recipesEl.querySelectorAll<HTMLElement>(".print-recipe-half");
          for (let i = 0; i < recipeCards.length; i += 2) {
            pdf.addPage();
            const pageContainer = document.createElement("div");
            pageContainer.style.width = "210mm";
            pageContainer.style.background = "#fff";
            pageContainer.style.position = "absolute";
            pageContainer.style.left = "-9999px";
            pageContainer.style.top = "0";
            const clone1 = recipeCards[i].cloneNode(true) as HTMLElement;
            pageContainer.appendChild(clone1);
            if (i + 1 < recipeCards.length) {
              const clone2 = recipeCards[i + 1].cloneNode(true) as HTMLElement;
              pageContainer.appendChild(clone2);
            }
            document.body.appendChild(pageContainer);
            const canvas = await html2canvas(pageContainer, {
              scale: 3,
              useCORS: true,
              logging: false,
              backgroundColor: "#ffffff",
            });
            const imgData = canvas.toDataURL("image/png");
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
            document.body.removeChild(pageContainer);
          }
          recipesEl.style.display = "";
        }
      }

      pdf.save("mon-menu-cookaluna.pdf");
      track("pdf_downloaded", { mode });
    } catch (err) {
      console.error("PDF error", err);
      alert("Le PDF n'a pas pu être généré. Réessayez.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setShowOptions((v) => !v)}
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

      {showOptions && !busy && (
        <>
          <button
            type="button"
            aria-hidden="true"
            tabIndex={-1}
            onClick={() => setShowOptions(false)}
            className="fixed inset-0 z-40 cursor-default"
          />
          <div className="absolute left-0 top-12 z-50 w-56 overflow-hidden rounded-xl border-[3px] border-ink bg-white shadow-pop">
            <div className="px-3 py-2">
              <p className="font-display text-xs font-bold uppercase tracking-widest text-coral">
                Que voulez-vous télécharger ?
              </p>
            </div>
            <button
              type="button"
              onClick={() => download("menu")}
              className="flex w-full items-center gap-2 border-t-2 border-ink/10 px-3 py-2.5 text-left text-sm font-bold hover:bg-coral-light"
            >
              Menu uniquement
            </button>
            <button
              type="button"
              onClick={() => download("menu_recipes")}
              className="flex w-full items-center gap-2 border-t-2 border-ink/10 px-3 py-2.5 text-left text-sm font-bold hover:bg-coral-light"
            >
              Menu + recettes
            </button>
          </div>
        </>
      )}
    </div>
  );
}
