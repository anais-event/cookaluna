"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Sparkle } from "./Sparkle";

const PRIMARY_LINKS = [
  { href: "/menu-semaine", label: "Menu de la semaine" },
  { href: "/about", label: "Comment ça marche" },
];

const DISCOVER_LINKS = [
  { href: "/menu-semaine-a-imprimer", label: "Menu à imprimer" },
  { href: "/menu-semaine-famille", label: "Menu famille" },
  { href: "/menu-semaine-rapide", label: "Menu rapide" },
  { href: "/menu-semaine-vegetarien", label: "Menu végétarien" },
  { href: "/menu-semaine-sans-four", label: "Menu sans four" },
  { href: "/idees-repas-semaine", label: "Idées repas semaine" },
];

export function Header() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <header className="no-print sticky top-0 z-40 border-b-[3px] border-ink bg-paper/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2" aria-label="Cookaluna, accueil">
          <Sparkle size={22} color="var(--coral)" />
          <span className="font-display text-2xl font-extrabold tracking-tight">
            COOKALUNA
          </span>
        </Link>

        <nav
          className="hidden items-center gap-6 sm:flex"
          aria-label="Navigation principale"
        >
          {PRIMARY_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="font-display text-base font-bold hover:text-coral"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/create"
            className="btn btn-coral btn-sm !hidden sm:!inline-flex"
          >
            Créer mon menu
          </Link>
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Ouvrir le menu"
            aria-expanded={open}
            aria-controls="mobile-menu"
            className="flex items-center justify-center rounded-xl border-[3px] border-ink bg-white p-2 sm:hidden"
          >
            <Menu size={20} aria-hidden="true" />
          </button>
        </div>
      </div>

      {open && (
        <>
          <button
            type="button"
            aria-label="Fermer le menu"
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-40 bg-ink/40 sm:hidden"
          />
          <div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu principal"
            className="fixed inset-x-3 top-3 z-50 rounded-2xl border-[3px] border-ink bg-paper shadow-pop sm:hidden"
          >
            <div className="flex items-center justify-between border-b-2 border-ink px-4 py-3">
              <span className="font-display text-lg font-extrabold">Menu</span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Fermer"
                className="flex items-center justify-center rounded-xl border-[3px] border-ink bg-white p-2"
              >
                <X size={18} aria-hidden="true" />
              </button>
            </div>
            <nav className="flex flex-col gap-1 p-4" aria-label="Navigation mobile">
              <Link
                href="/create"
                onClick={() => setOpen(false)}
                className="btn btn-coral btn-sm justify-center"
              >
                Créer mon menu
              </Link>

              <ul className="mt-3 flex flex-col">
                {PRIMARY_LINKS.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      onClick={() => setOpen(false)}
                      className="block rounded-xl px-3 py-2 font-display text-base font-bold hover:bg-coral-light"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>

              <p className="mt-3 px-3 font-display text-[10px] font-bold uppercase tracking-[0.2em] text-ink/50">
                Découvrir
              </p>
              <ul className="mt-1 flex flex-col">
                {DISCOVER_LINKS.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      onClick={() => setOpen(false)}
                      className="block rounded-xl px-3 py-2 text-sm font-semibold text-ink/85 hover:bg-coral-light"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </>
      )}
    </header>
  );
}
