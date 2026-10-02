import Link from "next/link";
import { pageMeta } from "@/lib/seo";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MenuPoster } from "@/components/MenuPoster";
import { StripePattern } from "@/components/StripePattern";
import { Sparkle, Cross, Dot } from "@/components/Sparkle";
import { LandingTracker } from "@/components/LandingTracker";
import { ComingSoon } from "@/components/ComingSoon";

const STEPS: [string, string, string][] = [
  ["01", "Vous nous dites", "ce que vous aimez, qui mange et comment vous cuisinez."],
  ["02", "On vous prépare", "une semaine de repas qui colle à votre vraie vie."],
  ["03", "Vous imprimez", "et c'est parti."],
];

export const metadata = pageMeta({
  title: "Cookaluna | Votre menu de la semaine prêt pour le frigo",
  description:
    "Créez votre menu de la semaine selon votre famille, vos envies, votre temps et votre cuisine. Modifiez-le puis imprimez-le pour le frigo.",
  path: "/",
});

export default function LandingPage() {
  return (
    <>
      <LandingTracker />
      <Header />
      <main>
        {/* HERO — l'affiche à coller sur le frigo */}
        <section className="relative overflow-hidden">
          <Sparkle size={40} color="var(--coral)" className="absolute left-6 top-10 animate-twinkle" />
          <Cross size={22} className="absolute right-10 top-24 hidden sm:block" />
          <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1fr_1.05fr] md:gap-14 md:py-24">
            <div>
              <span className="font-display inline-flex items-center gap-2 rounded-full border-[3px] border-ink bg-coral-light px-4 py-1.5 text-sm font-bold">
                <Sparkle size={16} color="var(--coral)" /> On mange quoi ce soir ?
              </span>
              <h1 className="mt-5 font-display text-5xl font-extrabold leading-[0.92] sm:text-6xl md:text-7xl">
                Le menu de la semaine,{" "}
                <span className="text-coral">prêt pour le frigo.</span>
              </h1>
              <p className="mt-6 max-w-sm text-lg font-medium text-ink/80">
                Trois questions. Une semaine de dîners. À coller sur le frigo.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link href="/create" className="btn btn-coral text-lg">
                  Créer mon menu
                </Link>
                <Link href="/about" className="btn btn-ghost">
                  Voir comment ça marche
                </Link>
              </div>
              <p className="mt-4 flex items-center gap-2 text-sm font-medium text-ink/70">
                <Dot size={8} color="var(--coral)" /> Gratuit · sans inscription
              </p>
            </div>

            {/* Affiche : légèrement plus grande, posée de travers comme sur le frigo */}
            <div className="relative md:scale-[1.08] md:pl-6">
              <div className="stripes-soft absolute inset-0 -z-10 translate-x-6 translate-y-6 rounded-[28px] border-[3px] border-ink" />
              <MenuPoster />
            </div>
          </div>
          <StripePattern height={16} />
        </section>

        {/* COMMENT — bandeau éditorial 01/02/03, pas de cartes */}
        <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 md:py-28">
          <div className="grid gap-y-12 md:grid-cols-3 md:gap-x-10">
            {STEPS.map(([num, title, sub], i) => (
              <div
                key={num}
                className={i === 1 ? "md:translate-y-8" : i === 2 ? "md:translate-y-16" : ""}
              >
                <span className="font-display block text-7xl font-extrabold text-coral leading-none sm:text-8xl">
                  {num}
                </span>
                <h2 className="mt-4 font-display text-2xl font-extrabold sm:text-3xl">
                  {title}
                </h2>
                <p className="mt-2 max-w-xs text-lg text-ink/70">{sub}</p>
              </div>
            ))}
          </div>
        </section>

        {/* PUNCHLINES — la vraie voix de Cookaluna */}
        <section className="relative overflow-hidden bg-coral-light">
          <StripePattern height={14} />
          <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-20 sm:px-6 md:grid-cols-2 md:py-24">
            <div>
              <h2 className="font-display text-5xl font-extrabold leading-[0.95] sm:text-6xl">
                Pas d&rsquo;idée&nbsp;?
                <br />
                <span className="text-coral">On en a.</span>
              </h2>
              <ul className="mt-10 space-y-6">
                {[
                  "Celui-là ne vous fait pas envie ? Changez-le.",
                  "Pas de four ? Aucun problème.",
                ].map((t) => (
                  <li key={t} className="flex items-start gap-4">
                    <Sparkle size={22} color="var(--coral)" className="mt-1 shrink-0" />
                    <span className="font-display text-2xl font-bold leading-snug sm:text-3xl">
                      {t}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <MenuPoster tilt={false} />
          </div>
          <StripePattern height={14} />
        </section>

        {/* LA SUITE DE COOKALUNA */}
        <ComingSoon />

        {/* CLÔTURE — légère, une dernière phrase */}
        <section className="relative mx-auto max-w-3xl px-4 py-20 text-center sm:px-6">
          <Sparkle size={30} color="var(--coral)" className="absolute left-8 top-12 animate-twinkle hidden sm:block" />
          <h2 className="font-display text-4xl font-extrabold leading-tight sm:text-5xl">
            Bon. On mange quoi cette semaine ?
          </h2>
          <p className="mt-3 text-lg text-ink/70">Votre frigo aimerait bien savoir.</p>
          <Link href="/create" className="btn btn-coral mt-8">
            Créer mon menu
          </Link>
        </section>
      </main>
      <Footer />
    </>
  );
}
