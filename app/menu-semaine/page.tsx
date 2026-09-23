import { SeoLanding } from "@/components/SeoLanding";
import { pageMeta } from "@/lib/seo";
import { ALLERGY_DISCLAIMER } from "@/lib/constants";

export const metadata = pageMeta({
  title: "Menu de la semaine | Créez votre menu avec Cookaluna",
  description:
    "Besoin d'un menu pour la semaine ? Créez une semaine de repas selon votre foyer, vos envies, votre temps et votre cuisine, puis imprimez-la.",
  path: "/menu-semaine",
});

export default function Page() {
  return (
    <SeoLanding
      h1="Créez votre menu de la semaine"
      intro="Organiser les repas de toute la semaine ne devrait pas prendre une heure. Cookaluna vous aide à construire un menu adapté à votre quotidien, puis vous laisse le modifier jusqu'à ce qu'il vous convienne."
      features
      showSheet
      note={ALLERGY_DISCLAIMER}
      sections={[
        {
          h2: "Comment préparer son menu de la semaine ?",
          body: "Commencez par indiquer combien de personnes mangent, les repas à prévoir et vos préférences alimentaires. Ajoutez ensuite votre temps de cuisine, votre budget et les équipements disponibles dans votre cuisine.",
        },
        {
          h2: "Un menu adapté à votre vraie cuisine",
          body: "Pas de four ? Cookaluna en tient compte. Vous avez un Airfryer, un Thermomix ou simplement des plaques de cuisson ? Les suggestions sont adaptées aux équipements que vous avez réellement sélectionnés.",
        },
        {
          h2: "Vous gardez la main",
          body: "Une idée ne vous plaît pas ? Changez uniquement ce repas. Vous pouvez aussi saisir votre propre idée ou modifier directement une case du menu.",
        },
        {
          h2: "Et ensuite ? Direction le frigo.",
          body: "Une fois votre semaine prête, imprimez-la ou téléchargez-la en PDF. Un menu simple, visible et facile à retrouver toute la semaine.",
        },
      ]}
      faq={[
        {
          q: "Comment faire un menu pour la semaine ?",
          a: "Déterminez les repas à prévoir, puis tenez compte du nombre de personnes, des préférences alimentaires, du temps disponible et des équipements de votre cuisine. Cookaluna rassemble ces informations pour vous aider à construire votre semaine.",
        },
        {
          q: "Que manger le soir pendant la semaine ?",
          a: "Cela dépend du temps dont vous disposez, de vos goûts et de votre façon de cuisiner. Cookaluna propose des idées adaptées à votre profil et vous permet de changer chaque repas.",
        },
        {
          q: "Peut-on imprimer un menu de la semaine ?",
          a: "Oui. Cookaluna permet d'imprimer le menu directement ou de télécharger une version PDF au format A4.",
        },
        {
          q: "Peut-on créer un menu familial ?",
          a: "Oui. Vous pouvez indiquer le nombre d'adultes et d'enfants et renseigner vos préférences alimentaires.",
        },
        {
          q: "Peut-on créer un menu sans four ?",
          a: "Oui. Les équipements disponibles font partie des informations prises en compte lors de la génération du menu.",
        },
        {
          q: "Peut-on modifier un seul repas ?",
          a: "Oui. Vous pouvez changer un repas sans régénérer toute la semaine.",
        },
      ]}
    />
  );
}
