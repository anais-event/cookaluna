import { SeoLanding } from "@/components/SeoLanding";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Idées repas pour la semaine | Que manger cette semaine ? | Cookaluna",
  description:
    "À court d'idées pour les repas de la semaine ? Découvrez des idées simples et variées puis créez votre propre menu avec Cookaluna.",
  path: "/idees-repas-semaine",
});

export default function Page() {
  return (
    <SeoLanding
      kicker="On mange quoi ce soir ?"
      h1="Que manger cette semaine ?"
      intro="Le fameux « on mange quoi ce soir ? » peut attendre cinq minutes. Voici des pistes pour varier les repas de la semaine, puis les transformer en véritable menu."
      ctaLabel="Créer mon menu"
      finalTitle="Vous préférez qu'on prépare directement votre semaine ?"
      sections={[
        {
          h2: "Des idées pour les soirs pressés",
          body: "Pâtes express, omelette, wraps, riz sauté ou poêlée de légumes : de quoi manger vite sans y penser trop longtemps.",
        },
        {
          h2: "Des repas familiaux",
          body: "Gratins, plats mijotés, tacos maison ou poulet rôti : des valeurs sûres qui plaisent aux petits comme aux grands.",
        },
        {
          h2: "Des idées végétariennes",
          body: "Curry de légumes, dahl, bowls, quiches ou salades complètes pour varier sans viande.",
        },
        {
          h2: "Des plats réconfortants",
          body: "Pâtes crémeuses, soupes, gratins fondants : les repas doudou des jours plus fatigués.",
        },
        {
          h2: "Des repas avec peu d'équipement",
          body: "Une poêle, un micro-ondes ou un airfryer suffisent. Cookaluna adapte les idées à ce que vous avez vraiment.",
        },
      ]}
    />
  );
}
