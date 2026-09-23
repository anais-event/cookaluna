import { SeoLanding } from "@/components/SeoLanding";
import { pageMeta } from "@/lib/seo";
import { ALLERGY_DISCLAIMER } from "@/lib/constants";

export const metadata = pageMeta({
  title: "Menu de la semaine en famille | Idées repas | Cookaluna",
  description:
    "Organisez les repas de la semaine pour toute la famille. Cookaluna adapte les suggestions à votre foyer, vos préférences et votre quotidien.",
  path: "/menu-semaine-famille",
});

export default function Page() {
  return (
    <SeoLanding
      kicker="Pour toute la famille"
      h1="Le menu de la semaine pour toute la famille"
      intro="Quand plusieurs personnes mangent à la maison, trouver sept jours d'idées peut vite devenir un casse-tête. Cookaluna vous aide à préparer une semaine adaptée à votre foyer."
      ctaLabel="Créer mon menu familial"
      features
      note={ALLERGY_DISCLAIMER}
      sections={[
        {
          h2: "Commencez par votre famille",
          body: "Indiquez le nombre d'adultes et d'enfants, puis choisissez les repas à prévoir dans la semaine.",
        },
        {
          h2: "Vos préférences comptent",
          body: "Régimes alimentaires, aliments à éviter, allergies ou intolérances : renseignez vos contraintes dans le profil avant de générer votre semaine.",
        },
        {
          h2: "Des repas pour les vrais jours de la semaine",
          body: "Des repas rapides pour les soirs chargés, des idées plus tranquilles lorsque vous avez davantage de temps, et des suggestions adaptées à votre façon de cuisiner.",
        },
      ]}
    />
  );
}
