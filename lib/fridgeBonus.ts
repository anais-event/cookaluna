// Petite surprise imprimee sur la feuille : change chaque semaine.
// L'idee est qu'une famille qui affiche Cookaluna sur son frigo trouve
// un petit truc en plus a decouvrir : pense-bete, blague, mini-jeu ou
// coloriage. Rien qui prenne autant de place que le menu lui-meme.

export type BonusVariant = "reminder" | "joke" | "game" | "coloring";

export type BonusReminder = {
  type: "reminder";
  title: string;
  subtitle: string;
  footer: string;
};

export type BonusJoke = {
  type: "joke";
  title: string;
  setup: string;
  punchline: string;
  signature: string;
};

export type BonusGame = {
  type: "game";
  title: string;
  prompt: string;
  answer: string;
  hint: string;
};

// Silhouette a colorier : path SVG partage entre le rendu ecran (HTML/SVG)
// et le rendu PDF (@react-pdf/renderer). ViewBox unifie : 0 0 100 100.
export type ColoringShape = {
  key: "tomato" | "lemon" | "pot" | "apple";
  label: string;
  paths: string[]; // trace au contour, aucun remplissage
};

export type BonusColoring = {
  type: "coloring";
  title: string;
  instruction: string;
  shape: ColoringShape;
};

export type BonusContent = BonusReminder | BonusJoke | BonusGame | BonusColoring;

const JOKES: { setup: string; punchline: string }[] = [
  {
    setup: "Pourquoi les légumes sont-ils toujours calmes ?",
    punchline: "Parce qu'ils gardent leur sang-froid.",
  },
  {
    setup: "Que dit une tomate à une autre qui traîne ?",
    punchline: "Allez, ketchup !",
  },
  {
    setup: "Pourquoi le boulanger travaille-t-il si tôt ?",
    punchline: "Parce qu'il ne veut pas rater son pain.",
  },
  {
    setup: "Quel est le comble pour un cuisinier ?",
    punchline: "Se faire prendre la main dans le sachet.",
  },
];

const GAMES: { prompt: string; answer: string }[] = [
  {
    prompt: "Je passe au four et je gonfle. Sans moi, pas de brioche ni de baguette. Qui suis-je ?",
    answer: "La levure",
  },
  {
    prompt: "Je suis rouge, j'aime le soleil, on me mange en salade et parfois en sauce. Qui suis-je ?",
    answer: "La tomate",
  },
  {
    prompt: "J'ai plusieurs couches, je fais pleurer, mais je réchauffe toutes les soupes. Qui suis-je ?",
    answer: "L'oignon",
  },
  {
    prompt: "Je suis blanc au dedans, jaune au dehors, je pars vite quand on me fouette. Qui suis-je ?",
    answer: "L'œuf",
  },
];

// Contours simples remplissant tout le viewBox 100x100 pour rester bien
// lisibles apres impression. Formes generees pour etre reconnaissables
// meme sans remplissage.
const SHAPES: ColoringShape[] = [
  {
    key: "tomato",
    label: "Une petite tomate",
    paths: [
      // corps rond (presque plein viewBox)
      "M50 22 C22 22 12 46 15 68 C18 88 34 96 50 96 C66 96 82 88 85 68 C88 46 78 22 50 22 Z",
      // feuilles en couronne
      "M32 24 L38 10 L44 22 L50 8 L56 22 L62 10 L68 24",
      // tige
      "M50 8 L50 2",
    ],
  },
  {
    key: "lemon",
    label: "Un citron tout jaune",
    paths: [
      // corps ovale allonge
      "M12 50 C12 30 30 12 50 12 C70 12 88 30 88 50 C88 74 70 90 50 90 C30 90 12 74 12 50 Z",
      // pointe haute
      "M50 12 L50 4",
      "M44 4 L56 4",
      // feuille laterale
      "M56 6 C68 -2 82 4 82 18",
      // petit relief
      "M22 50 C28 44 32 44 38 50",
    ],
  },
  {
    key: "pot",
    label: "La casserole du soir",
    paths: [
      // corps casserole
      "M14 40 L86 40 L80 92 L20 92 Z",
      // rebord
      "M10 40 L90 40",
      "M10 40 L10 44 L90 44 L90 40",
      // anses
      "M14 50 C2 50 2 68 14 68",
      "M86 50 C98 50 98 68 86 68",
      // vapeur
      "M35 30 C38 22 32 18 36 8",
      "M50 30 C53 22 47 18 51 8",
      "M65 30 C68 22 62 18 66 8",
    ],
  },
  {
    key: "apple",
    label: "Une pomme croquante",
    paths: [
      // corps double lobe
      "M50 30 C30 30 16 44 18 62 C20 82 36 94 50 94 C64 94 80 82 82 62 C84 44 70 30 50 30 Z",
      // creux central
      "M50 30 C50 22 54 18 60 14",
      // tige
      "M50 30 L50 12",
      // feuille
      "M50 22 C60 12 76 12 78 26",
      // veine feuille
      "M56 20 C62 22 68 22 72 20",
    ],
  },
];

function seedHash(seed: string): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return h;
}

// La case pense-bete a ligne 3 col 3 couvre deja le "reminder", donc la
// rotation du bonus surprise saute cette variante pour eviter le doublon
// visuel. Le type "reminder" reste expose au cas ou on voudrait le
// proposer explicitement plus tard.
const VARIANT_ORDER: BonusVariant[] = ["joke", "game", "coloring"];

// Fait tourner la surprise semaine apres semaine. Meme seed -> meme
// surprise, ce qui rend le PDF deterministe pour une semaine donnee.
// On decoupe le hash en tranches independantes : sinon un simple %N sur
// le meme entier corele fortement le choix de la variante et le choix
// du contenu (ex : coloring finit toujours sur la meme forme).
export function getFridgeBonus(seed: string): BonusContent {
  const h = seedHash(seed);
  const variant = VARIANT_ORDER[h % VARIANT_ORDER.length];
  const contentSlot = (h >>> 5) & 0xffff;
  const shapeSlot = (h >>> 11) & 0xffff;

  switch (variant) {
    case "reminder":
      return {
        type: "reminder",
        title: "Pense-bête du frigo",
        subtitle: "À noter ou à ne pas oublier cette semaine :",
        footer: "✎ À compléter à la main",
      };
    case "joke": {
      const j = JOKES[contentSlot % JOKES.length];
      return {
        type: "joke",
        title: "La blague du frigo",
        setup: j.setup,
        punchline: j.punchline,
        signature: "— Cookaluna",
      };
    }
    case "game": {
      const g = GAMES[contentSlot % GAMES.length];
      return {
        type: "game",
        title: "La devinette du frigo",
        prompt: g.prompt,
        answer: g.answer,
        hint: "Réponse :",
      };
    }
    case "coloring": {
      const shape = SHAPES[shapeSlot % SHAPES.length];
      return {
        type: "coloring",
        title: "Le coloriage du frigo",
        instruction: shape.label,
        shape,
      };
    }
  }
}
