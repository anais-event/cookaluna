"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { createSampleMenu } from "@/lib/sampleMenu";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WeeklyMenu } from "@/components/WeeklyMenu";
import { MenuToolbar } from "@/components/MenuToolbar";
import { PrintPreview } from "@/components/PrintPreview";
import { PrintableMenu } from "@/components/PrintableMenu";
import { Sparkle } from "@/components/Sparkle";

export default function MenuPage() {
  const { menu, hydrated, setMenu } = useStore();

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
      <main className="no-print mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-display text-sm font-bold uppercase tracking-widest text-coral">
              {menu.weekLabel}
            </p>
            <h1 className="font-display text-4xl font-extrabold sm:text-5xl">
              Votre semaine est servie.
            </h1>
            <p className="mt-2 text-lg text-ink/70">Vous pouvez tout changer.</p>
          </div>
          <Link href="/create" className="btn btn-ghost btn-sm">
            Recommencer
          </Link>
        </div>

        <div className="mt-6">
          <MenuToolbar menu={menu} />
        </div>

        <div className="mt-8">
          <WeeklyMenu />
        </div>

        {/* Aperçu impression */}
        <section className="mt-14">
          <h2 className="font-display text-2xl font-extrabold">
            Aperçu impression
          </h2>
          <p className="mt-1 text-ink/70">
            Voilà à quoi ressemblera votre feuille, prête pour le frigo.
          </p>
          <div className="mt-5">
            <PrintPreview menu={menu} />
          </div>
        </section>
      </main>

      {/* Version imprimable pure (masquée à l'écran) */}
      <PrintableMenu menu={menu} />

      <Footer />
    </>
  );
}
