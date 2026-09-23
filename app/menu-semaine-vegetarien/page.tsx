import { SeoLanding } from "@/components/SeoLanding";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Menu de la semaine végétarien | Cookaluna",
  description:
    "Créez un menu de la semaine végétarien selon votre foyer, votre temps de cuisine et vos préférences, puis imprimez-le.",
  path: "/menu-semaine-vegetarien",
});

export default function Page() {
  return (
    <SeoLanding
      kicker="Sans viande, avec des idées"
      h1="Votre menu de la semaine végétarien"
      intro="Besoin d'idées végétariennes pour toute la semaine ? Cookaluna vous aide à construire un menu varié selon votre quotidien."
      ctaLabel="Créer mon menu végétarien"
      sections={[
        {
          h2: "Des idées pour toute la semaine",
          body: "Légumes, œufs, légumineuses, pâtes, riz, bowls ou gratins : Cookaluna compose une semaine végétarienne variée, sans se transformer en catalogue de recettes.",
        },
        {
          h2: "Adaptez votre menu",
          body: "Vous pouvez changer un repas, saisir votre propre idée ou demander une nouvelle proposition à tout moment.",
        },
        {
          h2: "Sélectionnez le régime végétarien",
          body: "Dans votre profil, choisissez « végétarien » (ou vegan) : les suggestions respectent alors ce choix sur l'ensemble de la semaine.",
        },
      ]}
    />
  );
}
