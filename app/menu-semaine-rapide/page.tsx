import { SeoLanding } from "@/components/SeoLanding";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Menu de la semaine rapide | Idées de repas faciles | Cookaluna",
  description:
    "Créez un menu de la semaine avec des repas adaptés au temps dont vous disposez : 15, 30 ou 45 minutes.",
  path: "/menu-semaine-rapide",
});

export default function Page() {
  return (
    <SeoLanding
      kicker="Quand on manque de temps"
      h1="Un menu de la semaine quand on manque de temps"
      intro="Certains soirs demandent simplement quelque chose de rapide. Cookaluna construit une semaine à la hauteur du temps que vous voulez y consacrer."
      ctaLabel="Créer mon menu rapide"
      sections={[
        {
          h2: "15 minutes, 30 minutes ou davantage ?",
          body: "Dites à Cookaluna combien de temps vous voulez passer en cuisine et indiquez votre niveau. Les suggestions s'ajustent en conséquence.",
        },
        {
          h2: "Des idées simples pour les jours compliqués",
          body: "Votre menu peut intégrer des repas faciles à préparer tout en conservant de la variété sur l'ensemble de la semaine.",
        },
        {
          h2: "Vous changez d'avis ?",
          body: "Remplacez uniquement le repas concerné. Pas besoin de recommencer toute votre semaine.",
        },
      ]}
    />
  );
}
