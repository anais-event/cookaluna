import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MenuPoster } from "@/components/MenuPoster";
import { StripePattern } from "@/components/StripePattern";
import { Sparkle, Cross, Dot } from "@/components/Sparkle";
import { LandingTracker } from "@/components/LandingTracker";

const STEPS: [string, string, string][] = [
  ["01", "Vous nous dites ce qui vous convient.", "Foyer, envies, temps, cuisine."],
  ["02", "COOKALUNA vous propose votre semaine.", "Un menu cohérent, adapté à vous."],
  ["03", "Vous imprimez. C'est tout.", "Une feuille prête pour le frigo."],
];

export default function LandingPage() {
  return (
    <>
      <LandingTracker />
      <Header />
      <main>
        {/* HERO */}
        <section className="relative overflow-hidden">
          <Sparkle size={40} color="var(--coral)" className="absolute left-6 top-10 animate-twinkle" />
          <Cross size={22} className="absolute right-10 top-24" />
          <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 md:py-20">
            <div>
              <span className="font-display inline-flex items-center gap-2 rounded-full border-[3px] border-ink bg-coral-light px-4 py-1.5 text-sm font-bold">
                <Sparkle size={16} color="var(--coral)" /> On mange quoi ce soir ?
              </span>
              <h1 className="mt-5 font-display text-5xl font-extrabold leading-[0.95] sm:text-6xl">
                Le menu de la semaine,{" "}
                <span className="text-coral">prêt pour le frigo.</span>
              </h1>
              <p className="mt-5 max-w-md text-lg text-ink/80">
                Quelques questions, quelques idées, et hop : votre menu est prêt à
                imprimer.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link href="/create" className="btn btn-coral">
                  Créer mon menu
                </Link>
                <Link href="/about" className="btn btn-ghost">
                  Voir comment ça marche
                </Link>
              </div>
              <p className="mt-3 flex items-center gap-2 text-sm font-medium text-ink/70">
                <Dot size={8} color="var(--coral)" /> Gratuit · sans inscription
              </p>
            </div>

            <div className="relative">
              <div className="stripes-soft absolute inset-0 -z-10 translate-x-6 translate-y-6 rounded-[28px] border-[3px] border-ink" />
              <MenuPoster />
            </div>
          </div>
          <StripePattern height={16} />
        </section>

        {/* CA MARCHE COMME CA */}
        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="font-display text-4xl font-extrabold">Ça marche comme ça</h2>
          <p className="mt-2 text-ink/70">On s'occupe du casse-tête. Vous gardez le contrôle.</p>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {STEPS.map(([num, title, sub]) => (
              <div key={num} className="card p-6">
                <span className="font-display text-5xl font-extrabold text-coral">
                  {num}
                </span>
                <h3 className="mt-3 font-display text-xl font-bold">{title}</h3>
                <p className="mt-1 text-ink/70">{sub}</p>
              </div>
            ))}
          </div>
        </section>

        {/* EXEMPLE */}
        <section className="bg-coral-light">
          <StripePattern height={14} />
          <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 sm:px-6 md:grid-cols-2">
            <div>
              <h2 className="font-display text-4xl font-extrabold">
                Une semaine qui nous ressemble
              </h2>
              <p className="mt-3 max-w-md text-lg text-ink/80">
                Des repas simples, variés, adaptés à votre cuisine. On réutilise
                certains ingrédients pour vous simplifier la vie.
              </p>
              <ul className="mt-6 space-y-2">
                {[
                  "Pas d'idée ? On en a.",
                  "Celui-là ne vous fait pas envie ? Changez-le.",
                  "Pas de four ? Aucun problème.",
                ].map((t) => (
                  <li key={t} className="flex items-center gap-3">
                    <Sparkle size={16} color="var(--coral)" />
                    <span className="font-medium">{t}</span>
                  </li>
                ))}
              </ul>
              <Link href="/create" className="btn btn-primary mt-8">
                Créer mon menu
              </Link>
            </div>
            <MenuPoster tilt={false} />
          </div>
          <StripePattern height={14} />
        </section>

        {/* BLOC FINAL */}
        <section className="relative mx-auto max-w-4xl px-4 py-20 text-center sm:px-6">
          <Sparkle size={34} color="var(--coral)" className="absolute left-10 top-10 animate-twinkle" />
          <Cross size={20} className="absolute right-16 bottom-16" />
          <h2 className="font-display text-5xl font-extrabold leading-tight">
            Bon. On mange quoi cette semaine ?
          </h2>
          <p className="mt-4 text-lg text-ink/70">Votre frigo va aimer.</p>
          <Link href="/create" className="btn btn-coral mt-8 text-xl">
            Créer mon menu
          </Link>
        </section>
      </main>
      <Footer />
    </>
  );
}
