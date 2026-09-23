import Link from "next/link";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { StripePattern } from "./StripePattern";
import { MenuPoster } from "./MenuPoster";
import { MenuSheet } from "./MenuSheet";
import { Sparkle, Cross } from "./Sparkle";
import { createSampleMenu } from "@/lib/sampleMenu";

export interface SeoSection {
  h2: string;
  body: string;
}

export interface SeoFaq {
  q: string;
  a: string;
}

export interface SeoLandingProps {
  kicker?: string;
  h1: string;
  intro: string;
  ctaLabel?: string;
  poster?: boolean;
  features?: boolean;
  sections: SeoSection[];
  note?: string;
  showSheet?: boolean;
  sheetTitle?: string;
  faq?: SeoFaq[];
  finalTitle?: string;
}

const FEATURES: [string, string][] = [
  ["👨‍👩‍👧", "Votre foyer"],
  ["🥕", "Vos préférences"],
  ["⏱", "Votre temps"],
  ["💶", "Votre budget"],
  ["🍳", "Votre cuisine"],
  ["📝", "Vos envies"],
];

export function SeoLanding({
  kicker = "On mange quoi cette semaine ?",
  h1,
  intro,
  ctaLabel = "Créer mon menu",
  poster = true,
  features = false,
  sections,
  note,
  showSheet = false,
  sheetTitle = "Exemple de menu Cookaluna",
  faq,
  finalTitle = "Bon. On mange quoi cette semaine ?",
}: SeoLandingProps) {
  const sample = showSheet ? createSampleMenu() : null;

  const faqJsonLd = faq
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faq.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      }
    : null;

  return (
    <>
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}
      <Header />
      <main>
        {/* HERO */}
        <section className="relative overflow-hidden">
          <Sparkle size={34} color="var(--coral)" className="absolute left-6 top-10 animate-twinkle" />
          <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 sm:px-6 md:grid-cols-2">
            <div>
              <span className="font-display inline-flex items-center gap-2 rounded-full border-[3px] border-ink bg-coral-light px-4 py-1.5 text-sm font-bold">
                <Sparkle size={14} color="var(--coral)" /> {kicker}
              </span>
              <h1 className="mt-5 font-display text-4xl font-extrabold leading-[0.98] sm:text-5xl">
                {h1}
              </h1>
              <p className="mt-5 max-w-md text-lg text-ink/80">{intro}</p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link href="/create" className="btn btn-coral">
                  {ctaLabel}
                </Link>
                <Link href="/menu-semaine" className="btn btn-ghost">
                  Le menu de la semaine
                </Link>
              </div>
              <p className="mt-3 text-sm font-medium text-ink/70">
                Gratuit · sans inscription
              </p>
            </div>
            {poster && (
              <div className="relative">
                <div className="stripes-soft absolute inset-0 -z-10 translate-x-6 translate-y-6 rounded-[28px] border-[3px] border-ink" />
                <MenuPoster />
              </div>
            )}
          </div>
          <StripePattern height={14} />
        </section>

        {/* FEATURES */}
        {features && (
          <section className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
            <h2 className="font-display text-3xl font-extrabold">
              Voici ce que Cookaluna peut prendre en compte
            </h2>
            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
              {FEATURES.map(([emoji, label]) => (
                <div key={label} className="card flex items-center gap-3 p-4">
                  <span className="text-2xl" aria-hidden="true">
                    {emoji}
                  </span>
                  <span className="font-display font-bold">{label}</span>
                </div>
              ))}
            </div>
            <p className="font-display mt-6 text-lg font-bold">
              Et maintenant, on prépare votre semaine.
            </p>
          </section>
        )}

        {/* SECTIONS */}
        <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
          <div className="space-y-10">
            {sections.map((s, i) => (
              <div key={i} className="relative">
                {i % 2 === 1 && (
                  <div className="stripes-faint absolute -left-6 top-0 hidden h-full w-3 rounded lg:block" />
                )}
                <h2 className="font-display flex items-center gap-2 text-2xl font-extrabold">
                  <Sparkle size={16} color="var(--coral)" />
                  {s.h2}
                </h2>
                <p className="mt-2 text-lg leading-relaxed text-ink/80">{s.body}</p>
              </div>
            ))}
          </div>
          {note && (
            <p className="mt-8 rounded-xl border-2 border-ink/15 bg-coral-light/60 px-4 py-3 text-sm text-ink/70">
              {note}
            </p>
          )}
        </section>

        {/* EXEMPLE VISUEL */}
        {sample && (
          <section className="bg-coral-light">
            <StripePattern height={14} />
            <div className="mx-auto max-w-4xl px-4 py-14 text-center sm:px-6">
              <h2 className="font-display text-3xl font-extrabold">{sheetTitle}</h2>
              <p className="mt-2 text-ink/70">Vous voulez le vôtre ?</p>
              <div className="mx-auto mt-8 max-w-2xl overflow-hidden rounded-card border-[3px] border-ink shadow-pop">
                <MenuSheet menu={sample} />
              </div>
              <Link href="/create" className="btn btn-primary mt-8">
                {ctaLabel}
              </Link>
            </div>
            <StripePattern height={14} />
          </section>
        )}

        {/* FAQ */}
        {faq && faq.length > 0 && (
          <section className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
            <h2 className="font-display text-3xl font-extrabold">Questions fréquentes</h2>
            <dl className="mt-8 space-y-5">
              {faq.map((f) => (
                <div key={f.q} className="card p-5">
                  <dt className="font-display text-lg font-bold">{f.q}</dt>
                  <dd className="mt-2 text-ink/80">{f.a}</dd>
                </div>
              ))}
            </dl>
          </section>
        )}

        {/* CTA FINAL */}
        <section className="relative mx-auto max-w-4xl px-4 py-20 text-center sm:px-6">
          <Cross size={20} className="absolute right-16 top-14" />
          <h2 className="font-display text-4xl font-extrabold leading-tight sm:text-5xl">
            {finalTitle}
          </h2>
          <Link href="/create" className="btn btn-coral mt-8 text-xl">
            {ctaLabel}
          </Link>
        </section>
      </main>
      <Footer />
    </>
  );
}
