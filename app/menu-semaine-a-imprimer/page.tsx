import { SeoLanding } from "@/components/SeoLanding";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Menu de la semaine à imprimer | Cookaluna",
  description:
    "Créez un menu de la semaine personnalisé, modifiez vos repas puis imprimez-le en A4 pour l'afficher sur votre frigo.",
  path: "/menu-semaine-a-imprimer",
});

export default function Page() {
  return (
    <SeoLanding
      kicker="Prêt pour le frigo"
      h1="Votre menu de la semaine à imprimer"
      intro="Votre menu ne devrait pas rester enfermé dans une application. Avec Cookaluna, créez votre semaine, ajustez les repas qui ne vous tentent pas et imprimez votre menu en A4."
      ctaLabel="Créer mon menu"
      showSheet
      sheetTitle="Un menu pensé pour le frigo"
      sections={[
        {
          h2: "Un menu pensé pour le frigo",
          body: "Les sept jours sont présentés clairement avec les repas du midi et du soir, dans un format conçu pour être consulté facilement au quotidien.",
        },
        {
          h2: "Modifiez avant d'imprimer",
          body: "Changez un repas, ajoutez votre propre idée ou régénérez toute la semaine. Vous imprimez uniquement lorsque votre menu vous convient.",
        },
        {
          h2: "PDF ou impression directe",
          body: "Téléchargez votre menu au format PDF ou utilisez directement la fonction d'impression de votre navigateur.",
        },
      ]}
    />
  );
}
