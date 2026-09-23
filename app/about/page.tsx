import Link from "next/link";
import { pageMeta } from "@/lib/seo";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { StripePattern } from "@/components/StripePattern";
import { Sparkle } from "@/components/Sparkle";
import { ALLERGY_DISCLAIMER } from "@/lib/constants";

export const metadata = pageMeta({
  title: "Comment fonctionne Cookaluna ? | Votre menu de la semaine",
  description:
    "Découvrez comment Cookaluna vous aide à créer, modifier et imprimer votre menu de la semaine en quelques minutes.",
  path: "/about",
});

const STEPS: [string, string, string][] = [
  ["01", "Vous nous dites ce qui vous convient", "Le foyer, les allergies, vos envies, votre temps, votre budget et votre cuisine. Cinq écrans, deux minutes."],
  ["02", "COOKALUNA vous propose votre semaine", "Un menu cohérent, adapté à vos équipements. On ne propose jamais un plat qui exige un appareil que vous n'avez pas."],
  ["03", "Vous imprimez. C'est tout.", "Une feuille A4 nette, prête à afficher sur le frigo. Ou un vrai PDF à télécharger."],
];

const PRINCIPLES: [string, string][] = [
  ["Pas de compte", "Aucune inscription. On commence tout de suite."],
  ["Vous gardez le contrôle", "Chaque repas se change, se modifie ou se remplace par le vôtre."],
  ["On tient compte de votre cuisine", "Four, airfryer, thermomix, plaques… on adapte les idées à votre matériel."],
  ["On mutualise", "On réutilise certains ingrédients d'un repas à l'autre pour vous simplifier la vie."],
];

export default function AboutPage() {
  return (
    <>
      <Header />
      <main>
        <section className="relative mx-auto max-w-4xl px-4 py-14 sm:px-6">
          <Sparkle size={34} color="var(--coral)" className="absolute right-8 top-10 animate-twinkle" />
          <h1 className="font-display text-5xl font-extrabold leading-tight">
            Votre menu de la semaine,{" "}
            <span className="text-coral">prêt pour le frigo.</span>
          </h1>
          <p className="mt-4 max-w-xl text-lg text-ink/80">
            Cookaluna est un petit outil du quotidien. Pas une app de nutrition,
            pas un assistant qui parle. On s'occupe du casse-tête, vous gardez le
            contrôle.
          </p>
          <Link href="/create" className="btn btn-coral mt-8">
            Créer mon menu
          </Link>
        </section>

        <StripePattern height={14} />

        <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
          <div className="grid gap-6 md:grid-cols-3">
            {STEPS.map(([num, title, sub]) => (
              <div key={num} className="card p-6">
                <span className="font-display text-5xl font-extrabold text-coral">
                  {num}
                </span>
                <h2 className="mt-3 font-display text-xl font-bold">{title}</h2>
                <p className="mt-2 text-ink/70">{sub}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-coral-light">
          <StripePattern height={14} />
          <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
            <h2 className="font-display text-4xl font-extrabold">Nos petites règles</h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              {PRINCIPLES.map(([t, d]) => (
                <div key={t} className="flex gap-3">
                  <Sparkle size={20} color="var(--coral)" className="mt-1 shrink-0" />
                  <div>
                    <h3 className="font-display text-lg font-bold">{t}</h3>
                    <p className="text-ink/70">{d}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-8 rounded-xl border-2 border-ink/15 bg-paper px-4 py-3 text-sm text-ink/70">
              {ALLERGY_DISCLAIMER}
            </p>
          </div>
          <StripePattern height={14} />
        </section>

        <section className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6">
          <h2 className="font-display text-4xl font-extrabold">
            Bon. On mange quoi cette semaine ?
          </h2>
          <Link href="/create" className="btn btn-coral mt-8 text-xl">
            Créer mon menu
          </Link>
        </section>
      </main>
      <Footer />
    </>
  );
}
