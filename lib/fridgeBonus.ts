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

// Contours simples, une seule "line" par forme suffit pour rester lisible
// une fois imprime. ViewBox 100x100 partout.
const SHAPES: ColoringShape[] = [
  {
    key: "tomato",
    label: "Une petite tomate",
    paths: [
      // corps
      "M50 30 C28 30 22 50 25 68 C28 84 42 90 50 90 C58 90 72 84 75 68 C78 50 72 30 50 30 Z",
      // feuilles
      "M42 32 L46 22 L50 30 L54 22 L58 32",
      // tige
      "M50 22 L50 16",
    ],
  },
  {
    key: "lemon",
    label: "Un citron tout jaune",
    paths: [
      // corps ovale
      "M30 55 C30 40 40 30 50 30 C60 30 70 40 70 55 C70 70 60 80 50 80 C40 80 30 70 30 55 Z",
      // petit bout haut
      "M50 28 L50 22",
      "M47 22 L53 22",
      // detail feuille
      "M50 22 C55 18 62 20 62 26",
    ],
  },
  {
    key: "pot",
    label: "La casserole du soir",
    paths: [
      // corps casserole
      "M22 45 L78 45 L74 82 L26 82 Z",
      // rebord
      "M20 45 L80 45",
      // anses
      "M22 50 C12 50 12 62 22 62",
      "M78 50 C88 50 88 62 78 62",
      // vapeur
      "M40 35 C42 30 38 26 42 20",
      "M52 35 C54 30 50 26 54 20",
      "M64 35 C66 30 62 26 66 20",
    ],
  },
  {
    key: "apple",
    label: "Une pomme croquante",
    paths: [
      // corps
      "M50 34 C34 34 24 46 26 62 C28 78 42 86 50 86 C58 86 72 78 74 62 C76 46 66 34 50 34 Z",
      // creux
      "M50 34 C50 28 54 26 58 24",
      // tige
      "M50 34 L50 24",
      // feuille
      "M50 28 C56 22 64 22 66 30",
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
export function getFridgeBonus(seed: string): BonusContent {
  const h = seedHash(seed);
  const variant = VARIANT_ORDER[h % VARIANT_ORDER.length];

  switch (variant) {
    case "reminder":
      return {
        type: "reminder",
        title: "Pense-bête du frigo",
        subtitle: "À noter ou à ne pas oublier cette semaine :",
        footer: "✎ À compléter à la main",
      };
    case "joke": {
      const j = JOKES[h % JOKES.length];
      return {
        type: "joke",
        title: "La blague du frigo",
        setup: j.setup,
        punchline: j.punchline,
        signature: "— Cookaluna",
      };
    }
    case "game": {
      const g = GAMES[h % GAMES.length];
      return {
        type: "game",
        title: "La devinette du frigo",
        prompt: g.prompt,
        answer: g.answer,
        hint: "Réponse :",
      };
    }
    case "coloring": {
      const shape = SHAPES[h % SHAPES.length];
      return {
        type: "coloring",
        title: "Le coloriage du frigo",
        instruction: shape.label,
        shape,
      };
    }
  }
}
