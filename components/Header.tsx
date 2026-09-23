"use client";

import Link from "next/link";
import { Sparkle } from "./Sparkle";

export function Header() {
  return (
    <header className="no-print sticky top-0 z-40 border-b-[3px] border-ink bg-paper/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2" aria-label="Cookaluna, accueil">
          <Sparkle size={22} color="var(--coral)" />
          <span className="font-display text-2xl font-extrabold tracking-tight">
            COOKALUNA
          </span>
        </Link>

        <nav className="hidden items-center gap-6 sm:flex" aria-label="Navigation principale">
          <Link
            href="/menu-semaine"
            className="font-display text-base font-bold hover:text-coral"
          >
            Menu de la semaine
          </Link>
          <Link
            href="/about"
            className="font-display text-base font-bold hover:text-coral"
          >
            Comment ça marche
          </Link>
        </nav>

        <Link href="/create" className="btn btn-coral btn-sm">
          Créer mon menu
        </Link>
      </div>
    </header>
  );
}
