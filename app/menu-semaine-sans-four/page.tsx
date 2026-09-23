import { SeoLanding } from "@/components/SeoLanding";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Menu de la semaine sans four | Cookaluna",
  description:
    "Pas de four ? Créez un menu de la semaine adapté aux équipements dont vous disposez et trouvez des idées de repas faciles à préparer.",
  path: "/menu-semaine-sans-four",
});

export default function Page() {
  return (
    <SeoLanding
      kicker="On tient compte de votre cuisine"
      h1="Un menu de la semaine sans four"
      intro="Pas besoin d'une cuisine parfaitement équipée pour préparer une semaine de repas variés. Indiquez simplement les équipements que vous avez réellement à disposition."
      ctaLabel="Créer mon menu sans four"
      sections={[
        {
          h2: "Cookaluna tient compte de votre cuisine",
          body: "Plaques de cuisson, Airfryer, micro-ondes, Thermomix ou aucun équipement particulier : sélectionnez votre matériel et Cookaluna adapte ses suggestions.",
        },
        {
          h2: "Aucun équipement ne doit apparaître par magie",
          body: "Si un repas nécessite un équipement absent de votre cuisine, il n'est pas proposé. Ce que vous n'avez pas coché n'est jamais considéré comme disponible.",
        },
        {
          h2: "Un menu simple, quoi qu'il arrive",
          body: "Poêle, micro-ondes ou airfryer suffisent pour une semaine complète. Vous gardez la main pour changer chaque repas.",
        },
      ]}
    />
  );
}
