"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, LayoutGrid, List } from "lucide-react";
import { useStore } from "@/lib/store";
import { createSampleMenu } from "@/lib/sampleMenu";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WeeklyMenu } from "@/components/WeeklyMenu";
import { MenuToolbar } from "@/components/MenuToolbar";
import { PrintPreview } from "@/components/PrintPreview";
import { PrintableMenu } from "@/components/PrintableMenu";
import { FavoritesList } from "@/components/FavoritesList";
import { Sparkle } from "@/components/Sparkle";

export default function MenuPage() {
  const { menu, hydrated, setMenu, sheetView, setSheetView } = useStore();

  // Toujours montrer quelque chose : à défaut, un menu d'exemple.
  useEffect(() => {
    if (hydrated && !menu) setMenu(createSampleMenu());
  }, [hydrated, menu, setMenu]);

  if (!hydrated || !menu) {
    return (
      <>
        <Header />
        <div className="flex min-h-[50vh] items-center justify-center">
          <Sparkle size={32} color="var(--coral)" className="animate-twinkle" />
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="no-print mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <Link
          href="/create"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink/70 underline-offset-4 transition hover:text-ink hover:underline"
        >
          <ArrowLeft size={16} aria-hidden="true" /> Modifier mes réponses
        </Link>

        <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-display text-sm font-bold uppercase tracking-widest text-coral">
              {menu.weekLabel}
            </p>
            <h1 className="mt-1 font-display text-4xl font-extrabold sm:text-5xl">
              Votre semaine est servie.
            </h1>
            <p className="mt-2 text-lg text-ink/70">Vous pouvez tout changer.</p>
            {menu.theme && (
              <p className="mt-3 inline-flex items-center gap-1.5 rounded-full border-2 border-ink bg-coral-light px-3 py-1 text-sm font-bold">
                <Sparkle size={13} color="var(--coral)" /> Thème surprise : {menu.theme}
              </p>
            )}
          </div>
          <Link href="/create" className="btn btn-ghost btn-sm">
            Recommencer
          </Link>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
          <MenuToolbar menu={menu} />
          <div
            role="tablist"
            aria-label="Mise en page de la feuille"
            className="inline-flex rounded-xl border-[3px] border-ink bg-white p-1"
          >
            <button
              type="button"
              role="tab"
              aria-selected={sheetView === "grid"}
              onClick={() => setSheetView("grid")}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-bold transition ${
                sheetView === "grid"
                  ? "bg-ink text-paper"
                  : "text-ink/70 hover:text-ink"
              }`}
            >
              <LayoutGrid size={14} aria-hidden="true" /> Grille
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={sheetView === "list"}
              onClick={() => setSheetView("list")}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-bold transition ${
                sheetView === "list"
                  ? "bg-ink text-paper"
                  : "text-ink/70 hover:text-ink"
              }`}
            >
              <List size={14} aria-hidden="true" /> Liste
            </button>
          </div>
        </div>

        <div className="mt-10">
          <WeeklyMenu />
        </div>

        {/* Recettes gardées */}
        <FavoritesList />

        {/* Aperçu impression */}
        <section className="mt-16">
          <h2 className="font-display text-2xl font-extrabold">
            Aperçu impression
          </h2>
          <p className="mt-1 text-ink/70">
            Voilà à quoi ressemblera votre feuille, prête pour le frigo.
          </p>
          <div className="mt-6">
            <PrintPreview menu={menu} view={sheetView} />
          </div>
        </section>
      </main>

      {/* Version imprimable pure (masquée à l'écran) */}
      <PrintableMenu menu={menu} view={sheetView} />

      <Footer />
    </>
  );
}
