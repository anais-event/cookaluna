import Link from "next/link";
import { StripePattern } from "./StripePattern";
import { Sparkle } from "./Sparkle";

export function Footer() {
  return (
    <footer className="no-print mt-20">
      <StripePattern height={12} />
      <div className="border-t-[3px] border-ink bg-ink text-paper">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:px-6">
          <div className="flex items-center gap-2">
            <Sparkle size={20} color="var(--coral)" />
            <span className="font-display text-xl font-extrabold">COOKALUNA</span>
          </div>
          <p className="font-display text-sm font-bold text-coral">
            La semaine est servie.
          </p>
          <nav
            className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm"
            aria-label="Liens de pied de page"
          >
            <Link href="/menu-semaine" className="hover:text-coral">
              Menu de la semaine
            </Link>
            <Link href="/menu-semaine-a-imprimer" className="hover:text-coral">
              À imprimer
            </Link>
            <Link href="/menu-semaine-famille" className="hover:text-coral">
              En famille
            </Link>
            <Link href="/menu-semaine-sans-four" className="hover:text-coral">
              Sans four
            </Link>
            <Link href="/idees-repas-semaine" className="hover:text-coral">
              Idées repas
            </Link>
            <Link href="/about" className="hover:text-coral">
              Comment ça marche
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
