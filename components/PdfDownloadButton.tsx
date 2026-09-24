"use client";

import { useState } from "react";
import { Download, Loader2, Check } from "lucide-react";
import { track } from "@/lib/analytics";

export function PdfDownloadButton() {
  const [busy, setBusy] = useState(false);
  const [includeRecipes, setIncludeRecipes] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  const download = async (withRecipes: boolean) => {
    setShowOptions(false);
    setBusy(true);

    try {
      const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
        import("html2canvas"),
        import("jspdf"),
      ]);

      const pdf = new jsPDF("p", "mm", "a4");
      const pdfW = pdf.internal.pageSize.getWidth();
      const pdfH = pdf.internal.pageSize.getHeight();

      const captureToPdf = async (el: HTMLElement, addPage: boolean) => {
        if (addPage) pdf.addPage();
        const canvas = await html2canvas(el, {
          scale: 3,
          useCORS: true,
          logging: false,
          backgroundColor: "#ffffff",
        });
        const imgData = canvas.toDataURL("image/png");
        const ratio = canvas.width / canvas.height;
        const pageRatio = pdfW / pdfH;
        let w: number, h: number, x: number, y: number;
        if (ratio > pageRatio) {
          w = pdfW; h = pdfW / ratio; x = 0; y = 0;
        } else {
          h = pdfH; w = pdfH * ratio; x = (pdfW - w) / 2; y = 0;
        }
        pdf.addImage(imgData, "PNG", x, y, w, h, undefined, "FAST");
      };

      // --- Menu page: capture the print-only full-size MenuSheet ---
      const printMenu = document.querySelector(".print-only .menu-sheet") as HTMLElement | null;
      if (!printMenu) {
        alert("Impossible de trouver le menu. Réessayez.");
        return;
      }

      const wrapper = printMenu.parentElement!;
      wrapper.style.cssText = "display:block !important;position:absolute;left:-9999px;top:0;z-index:-1;";
      printMenu.style.cssText = "width:794px;height:1123px;overflow:visible;";

      await captureToPdf(printMenu, false);

      printMenu.style.cssText = "";
      wrapper.style.cssText = "";

      // --- Recipe pages ---
      if (withRecipes) {
        const recipesEl = document.querySelector(".print-recipes-container") as HTMLElement | null;
        if (recipesEl) {
          recipesEl.style.cssText = "display:block !important;position:absolute;left:-9999px;top:0;z-index:-1;";
          const cards = recipesEl.querySelectorAll<HTMLElement>(".print-recipe-half");

          for (const card of cards) {
            const page = document.createElement("div");
            page.style.cssText = "width:794px;padding:40px 48px;background:#fff;position:absolute;left:-9999px;top:0;font-family:system-ui,sans-serif;";

            const day = card.querySelector(".print-recipe-day");
            const name = card.querySelector(".print-recipe-name");
            const meta = card.querySelector(".print-recipe-meta");
            const ingSec = card.querySelector(".print-recipe-ingredients");
            const stepsSec = card.querySelector(".print-recipe-steps");
            const notes = card.querySelector(".print-recipe-notes");

            if (day) {
              const el = document.createElement("div");
              el.style.cssText = "font-size:13px;font-weight:900;text-transform:uppercase;letter-spacing:0.2em;color:#FF6B5F;margin-bottom:10px;";
              el.textContent = day.textContent;
              page.appendChild(el);
            }
            if (name) {
              const el = document.createElement("h2");
              el.style.cssText = "font-size:28px;font-weight:900;line-height:1.2;margin:0 0 8px;color:#111;";
              el.textContent = name.textContent;
              page.appendChild(el);
            }
            if (meta) {
              const el = document.createElement("p");
              el.style.cssText = "font-size:14px;color:#555;margin:0 0 20px;";
              el.textContent = meta.textContent;
              page.appendChild(el);
            }

            const grid = document.createElement("div");
            grid.style.cssText = "display:grid;grid-template-columns:1fr 1.6fr;gap:28px;";

            if (ingSec) {
              const col = document.createElement("div");
              const h3 = document.createElement("h3");
              h3.style.cssText = "font-size:12px;font-weight:900;letter-spacing:0.12em;color:#FF6B5F;margin:0 0 10px;";
              h3.textContent = "INGRÉDIENTS";
              col.appendChild(h3);
              ingSec.querySelectorAll("li").forEach((li) => {
                const row = document.createElement("div");
                row.style.cssText = "font-size:14px;padding:5px 0;border-bottom:1px solid #eee;";
                row.innerHTML = li.innerHTML;
                col.appendChild(row);
              });
              grid.appendChild(col);
            }

            if (stepsSec) {
              const col = document.createElement("div");
              const h3 = document.createElement("h3");
              h3.style.cssText = "font-size:12px;font-weight:900;letter-spacing:0.12em;color:#FF6B5F;margin:0 0 10px;";
              h3.textContent = "PRÉPARATION";
              col.appendChild(h3);
              stepsSec.querySelectorAll("li").forEach((li) => {
                const row = document.createElement("div");
                row.style.cssText = "font-size:14px;line-height:1.6;margin-bottom:10px;";
                row.innerHTML = li.innerHTML;
                const num = row.querySelector("span");
                if (num) (num as HTMLElement).style.cssText = "font-weight:900;color:#FF6B5F;";
                col.appendChild(row);
              });
              grid.appendChild(col);
            }

            page.appendChild(grid);

            if (notes) {
              const el = document.createElement("p");
              el.style.cssText = "font-size:13px;color:#666;margin-top:16px;padding:10px;background:#f9f5f0;border-radius:4px;";
              el.textContent = notes.textContent;
              page.appendChild(el);
            }

            document.body.appendChild(page);
            await captureToPdf(page, true);
            document.body.removeChild(page);
          }

          recipesEl.style.cssText = "";
        }
      }

      pdf.save("mon-menu-cookaluna.pdf");
      track("pdf_downloaded", { mode: withRecipes ? "menu_recipes" : "menu" });
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
          <div className="absolute right-0 top-12 z-50 w-60 overflow-hidden rounded-xl border-[3px] border-ink bg-white shadow-pop sm:left-0 sm:right-auto">
            <label className="flex cursor-pointer items-center gap-3 px-4 py-3 text-sm font-bold hover:bg-coral-light/50">
              <span className="grid h-5 w-5 place-items-center rounded border-2 border-ink bg-coral-light text-ink">
                <Check size={14} strokeWidth={3} />
              </span>
              Menu
            </label>
            <label className="flex cursor-pointer items-center gap-3 border-t-2 border-ink/10 px-4 py-3 text-sm font-bold hover:bg-coral-light/50">
              <input
                type="checkbox"
                checked={includeRecipes}
                onChange={(e) => setIncludeRecipes(e.target.checked)}
                className="sr-only"
              />
              <span
                className={`grid h-5 w-5 place-items-center rounded border-2 border-ink transition ${
                  includeRecipes ? "bg-coral text-white" : "bg-white"
                }`}
              >
                {includeRecipes && <Check size={14} strokeWidth={3} />}
              </span>
              Recettes
            </label>
            <div className="border-t-2 border-ink/10 px-4 py-2.5">
              <button
                type="button"
                onClick={() => download(includeRecipes)}
                className="btn btn-primary btn-sm w-full"
              >
                <Download size={14} aria-hidden="true" /> Télécharger
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
