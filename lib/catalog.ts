import type { Allergen, CostLevel, Diet, Difficulty, Equipment, Meal, Recipe } from "./types";

// Base alimentaire utilisée pour dériver les régimes compatibles.
type Base = "meat" | "pork" | "fish" | "veg" | "vegan";

function diets(base: Base, gf: boolean, lf: boolean): Diet[] {
  const out: Diet[] = ["none", "flexitarian"];
  if (base === "meat") out.push("halal", "no_pork");
  if (base === "pork") {
    /* rien de plus */
  }
  if (base === "fish") out.push("pescetarian", "halal", "no_pork");
  if (base === "veg") out.push("vegetarian", "pescetarian", "halal", "no_pork");
  if (base === "vegan") out.push("vegetarian", "vegan", "pescetarian", "halal", "no_pork");
  const veganLf = base === "vegan"; // vegan => sans lactose
  if (gf) out.push("gluten_free");
  if (lf || veganLf) out.push("lactose_free");
  return out;
}

interface Raw {
  id: string;
  name: string;
  description: string;
  prepTime: number;
  difficulty: Difficulty;
  tags: string[];
  ingredients: string[];
  kid?: boolean;
  base: Base;
  gf?: boolean;
  lf?: boolean;
  allergens?: Allergen[];
  cost?: CostLevel;
  req?: Equipment[];
  alt?: Equipment[];
  reuse?: string[];
  category: string;
  recipe?: Recipe;
}

function meal(r: Raw): Meal {
  return {
    id: r.id,
    name: r.name,
    description: r.description,
    prepTime: r.prepTime,
    difficulty: r.difficulty,
    tags: r.tags,
    ingredients: r.ingredients,
    kidFriendly: r.kid ?? false,
    dietTags: diets(r.base, r.gf ?? false, r.lf ?? false),
    possibleAllergens: r.allergens ?? [],
    costLevel: r.cost ?? "normal",
    requiredEquipment: r.req ?? ["stovetop"],
    alternativeEquipment: r.alt ?? [],
    reuseIngredients: r.reuse ?? [],
    category: r.category,
    recipe: r.recipe,
  };
}

const RAW: Raw[] = [
  // ---------- POULET ----------
  { id: "poulet-roti", name: "Poulet rôti & pommes de terre", description: "Poulet doré au four, pommes de terre fondantes.", prepTime: 60, difficulty: "easy", tags: ["comfort", "familial", "batch"], ingredients: ["poulet entier", "pommes de terre", "thym", "ail", "huile d'olive"], kid: true, base: "meat", gf: true, lf: true, cost: "normal", req: ["oven"], reuse: ["poulet"], category: "chicken", recipe: {
    servings: 4,
    ingredients: [
      { name: "poulet entier", quantity: 1.5, unit: "kg" },
      { name: "pommes de terre", quantity: 800, unit: "g" },
      { name: "gousses d'ail", quantity: 4, unit: "" },
      { name: "branches de thym", quantity: 4, unit: "", scalable: false },
      { name: "huile d'olive", quantity: 3, unit: "c. à soupe" },
      { name: "sel et poivre", quantity: 0, unit: "", scalable: false },
    ],
    steps: [
      "Préchauffer le four à 200 °C.",
      "Éplucher les pommes de terre et les couper en quartiers.",
      "Frotter le poulet avec l'huile d'olive, le sel et le poivre.",
      "Disposer le poulet dans un plat à four, entourer des pommes de terre et de l'ail en chemise.",
      "Ajouter le thym sur le poulet.",
      "Enfourner 50 minutes. Arroser le poulet de jus à mi-cuisson.",
      "Vérifier la cuisson : le jus qui coule de la cuisse doit être clair.",
      "Laisser reposer 5 minutes avant de découper.",
    ],
  } },
  { id: "wraps-poulet", name: "Wraps au poulet & crudités", description: "Galettes garnies de poulet, salade et sauce yaourt.", prepTime: 20, difficulty: "very_easy", tags: ["express", "nomade"], ingredients: ["tortillas", "poulet", "salade", "tomate", "yaourt"], kid: true, base: "meat", allergens: ["gluten", "milk"], cost: "normal", req: ["stovetop"], reuse: ["poulet"], category: "chicken" },
  { id: "bowl-poulet-riz", name: "Bowl poulet, riz & crudités", description: "Bol équilibré poulet grillé, riz et légumes croquants.", prepTime: 25, difficulty: "easy", tags: ["healthy", "bowl"], ingredients: ["poulet", "riz", "concombre", "carotte", "sauce soja"], kid: true, base: "meat", gf: true, allergens: ["soy"], cost: "normal", req: ["stovetop"], reuse: ["poulet", "riz"], category: "chicken" },
  { id: "poulet-airfryer", name: "Poulet croustillant Airfryer", description: "Pilons de poulet ultra croustillants sans friture.", prepTime: 30, difficulty: "easy", tags: ["airfryer", "kids"], ingredients: ["pilons de poulet", "paprika", "chapelure", "huile"], kid: true, base: "meat", allergens: ["gluten"], cost: "normal", req: ["airfryer"], alt: ["oven"], reuse: ["poulet"], category: "chicken" },
  { id: "poulet-curry", name: "Curry de poulet au lait de coco", description: "Poulet mijoté, curry doux et lait de coco.", prepTime: 35, difficulty: "medium", tags: ["monde", "mijote"], ingredients: ["poulet", "lait de coco", "curry", "oignon", "riz"], base: "meat", gf: true, lf: true, cost: "normal", req: ["stovetop"], reuse: ["riz"], category: "chicken" },
  { id: "bowl-poulet-medit", name: "Bowl poulet méditerranéen", description: "Poulet, boulgour, feta et légumes grillés.", prepTime: 25, difficulty: "easy", tags: ["healthy", "mediterraneen"], ingredients: ["poulet", "boulgour", "feta", "poivron", "citron"], base: "meat", allergens: ["gluten", "milk"], cost: "normal", req: ["stovetop"], reuse: ["poulet"], category: "chicken" },
  { id: "poulet-basquaise", name: "Poulet basquaise", description: "Poulet mijoté aux poivrons et tomates.", prepTime: 45, difficulty: "medium", tags: ["france", "mijote"], ingredients: ["poulet", "poivron", "tomate", "oignon", "riz"], base: "meat", gf: true, lf: true, cost: "normal", req: ["stovetop"], category: "chicken" },
  { id: "poulet-citron-cocotte", name: "Poulet citron à la cocotte-minute", description: "Poulet fondant citronné, prêt en un éclair.", prepTime: 30, difficulty: "easy", tags: ["rapide", "cocotte"], ingredients: ["poulet", "citron", "pommes de terre", "ail"], base: "meat", gf: true, lf: true, req: ["pressure_cooker"], alt: ["stovetop"], reuse: ["poulet"], category: "chicken" },
  { id: "brochettes-poulet-plancha", name: "Brochettes de poulet à la plancha", description: "Brochettes marinées grillées à la plancha.", prepTime: 25, difficulty: "easy", tags: ["ete", "grill"], ingredients: ["poulet", "poivron", "oignon", "marinade"], base: "meat", gf: true, lf: true, req: ["plancha"], alt: ["stovetop", "bbq"], category: "chicken" },
  { id: "nuggets-maison", name: "Nuggets de poulet maison", description: "Nuggets dorés faits maison, sauce au choix.", prepTime: 30, difficulty: "easy", tags: ["kids", "airfryer"], ingredients: ["poulet", "chapelure", "œuf", "farine"], kid: true, base: "meat", allergens: ["gluten", "eggs"], req: ["airfryer"], alt: ["oven", "stovetop"], category: "chicken", recipe: {
    servings: 4,
    ingredients: [
      { name: "blancs de poulet", quantity: 500, unit: "g" },
      { name: "chapelure", quantity: 100, unit: "g" },
      { name: "œufs", quantity: 2, unit: "" },
      { name: "farine", quantity: 50, unit: "g" },
      { name: "paprika", quantity: 1, unit: "c. à café" },
      { name: "sel et poivre", quantity: 0, unit: "", scalable: false },
    ],
    steps: [
      "Couper les blancs de poulet en morceaux de la taille d'un nugget.",
      "Préparer trois assiettes : farine, œufs battus, chapelure mélangée au paprika.",
      "Passer chaque morceau dans la farine, puis l'œuf, puis la chapelure.",
      "Disposer les nuggets dans le panier de l'airfryer sans les superposer.",
      "Cuire 12 minutes à 200 °C en retournant à mi-cuisson.",
      "Servir avec du ketchup, de la moutarde ou une sauce au yaourt.",
    ],
  } },

  // ---------- VIANDE ----------
  { id: "steak-hache-puree", name: "Steak haché & purée maison", description: "Grand classique réconfortant, purée crémeuse.", prepTime: 30, difficulty: "very_easy", tags: ["comfort", "kids"], ingredients: ["steak haché", "pommes de terre", "lait", "beurre"], kid: true, base: "meat", gf: true, allergens: ["milk"], req: ["stovetop"], category: "beef" },
  { id: "chili-con-carne", name: "Chili con carne", description: "Bœuf haché, haricots rouges, épices douces.", prepTime: 40, difficulty: "easy", tags: ["batch", "monde"], ingredients: ["bœuf haché", "haricots rouges", "tomate", "riz", "épices"], base: "meat", gf: true, lf: true, cost: "normal", req: ["stovetop"], reuse: ["riz"], category: "beef", recipe: {
    servings: 4,
    ingredients: [
      { name: "bœuf haché", quantity: 500, unit: "g" },
      { name: "haricots rouges (égouttés)", quantity: 400, unit: "g" },
      { name: "pulpe de tomate", quantity: 400, unit: "g" },
      { name: "oignon", quantity: 1, unit: "" },
      { name: "gousse d'ail", quantity: 2, unit: "" },
      { name: "cumin", quantity: 1, unit: "c. à café" },
      { name: "paprika", quantity: 1, unit: "c. à café" },
      { name: "huile d'olive", quantity: 1, unit: "c. à soupe" },
      { name: "riz", quantity: 250, unit: "g" },
      { name: "sel et poivre", quantity: 0, unit: "", scalable: false },
    ],
    steps: [
      "Émincer l'oignon et l'ail.",
      "Faire chauffer l'huile dans une grande cocotte. Faire revenir l'oignon 3 minutes.",
      "Ajouter le bœuf haché et le faire dorer en l'émiettant.",
      "Ajouter l'ail, le cumin et le paprika. Mélanger 1 minute.",
      "Verser la pulpe de tomate, les haricots rouges égouttés, saler et poivrer.",
      "Laisser mijoter 25 minutes à feu doux en remuant de temps en temps.",
      "Pendant ce temps, cuire le riz selon les instructions du paquet.",
      "Servir le chili sur le riz.",
    ],
  } },
  { id: "boeuf-bourguignon", name: "Bœuf bourguignon", description: "Bœuf mijoté longuement, carottes et champignons.", prepTime: 120, difficulty: "advanced", tags: ["france", "dimanche"], ingredients: ["bœuf", "carotte", "champignon", "oignon", "bouillon"], base: "meat", gf: true, lf: true, cost: "treat", req: ["stovetop"], category: "beef" },
  { id: "tacos-boeuf", name: "Tacos maison express", description: "Tortillas garnies de bœuf épicé et cheddar.", prepTime: 20, difficulty: "very_easy", tags: ["express", "kids"], ingredients: ["bœuf haché", "tortillas", "cheddar", "salade", "sauce"], kid: true, base: "meat", allergens: ["gluten", "milk"], req: ["stovetop"], category: "beef" },
  { id: "hachis-parmentier", name: "Hachis parmentier", description: "Bœuf et purée gratinés au four.", prepTime: 50, difficulty: "medium", tags: ["comfort", "familial"], ingredients: ["bœuf haché", "pommes de terre", "lait", "fromage"], kid: true, base: "meat", allergens: ["milk"], req: ["oven"], category: "beef" },
  { id: "brochettes-boeuf-bbq", name: "Brochettes de bœuf au barbecue", description: "Bœuf mariné grillé au barbecue.", prepTime: 25, difficulty: "easy", tags: ["ete", "grill"], ingredients: ["bœuf", "poivron", "oignon", "marinade"], base: "meat", gf: true, lf: true, req: ["bbq"], alt: ["plancha", "stovetop"], category: "beef" },
  { id: "keftas-agneau", name: "Keftas d'agneau & semoule", description: "Boulettes d'agneau épicées, semoule moelleuse.", prepTime: 30, difficulty: "easy", tags: ["monde", "epices"], ingredients: ["agneau haché", "semoule", "menthe", "cumin"], base: "meat", allergens: ["gluten"], req: ["stovetop"], category: "beef" },
  { id: "boeuf-saute-asiat", name: "Bœuf sauté aux légumes", description: "Bœuf émincé sauté au wok, sauce soja.", prepTime: 20, difficulty: "easy", tags: ["express", "asie"], ingredients: ["bœuf", "brocoli", "carotte", "sauce soja", "riz"], base: "meat", allergens: ["soy"], req: ["stovetop"], reuse: ["riz"], category: "beef" },

  // ---------- PORC ----------
  { id: "croque-monsieur", name: "Croque-monsieur & salade", description: "Croque doré, jambon et fromage fondant.", prepTime: 15, difficulty: "very_easy", tags: ["express", "kids"], ingredients: ["pain de mie", "jambon", "fromage", "salade"], kid: true, base: "pork", allergens: ["gluten", "milk"], req: ["croque"], alt: ["oven", "stovetop"], category: "pork" },
  { id: "pates-carbonara", name: "Pâtes carbonara", description: "Pâtes crémeuses aux lardons et parmesan.", prepTime: 20, difficulty: "easy", tags: ["italie", "comfort"], ingredients: ["pâtes", "lardons", "œuf", "parmesan"], kid: true, base: "pork", allergens: ["gluten", "eggs", "milk"], req: ["stovetop"], category: "pasta" },
  { id: "quiche-lorraine", name: "Quiche lorraine", description: "Tarte salée aux lardons et crème.", prepTime: 45, difficulty: "medium", tags: ["france", "batch"], ingredients: ["pâte brisée", "lardons", "œuf", "crème"], base: "pork", allergens: ["gluten", "eggs", "milk"], req: ["oven"], category: "pork" },
  { id: "raclette", name: "Raclette conviviale", description: "Fromage à raclette, charcuterie, pommes de terre.", prepTime: 25, difficulty: "very_easy", tags: ["hiver", "convivial"], ingredients: ["fromage à raclette", "charcuterie", "pommes de terre", "cornichons"], base: "pork", gf: true, allergens: ["milk"], req: ["raclette"], category: "pork" },
  { id: "saute-porc-caramel", name: "Porc au caramel", description: "Porc mijoté façon asiatique, sauce caramel.", prepTime: 35, difficulty: "medium", tags: ["asie", "mijote"], ingredients: ["porc", "sauce soja", "sucre", "riz"], base: "pork", allergens: ["soy"], req: ["stovetop"], reuse: ["riz"], category: "pork" },

  // ---------- POISSON ----------
  { id: "saumon-roti", name: "Saumon rôti, pommes de terre & brocoli", description: "Pavé de saumon au four, légumes vapeur.", prepTime: 30, difficulty: "easy", tags: ["healthy", "omega3"], ingredients: ["saumon", "pommes de terre", "brocoli", "citron"], base: "fish", gf: true, lf: true, allergens: ["fish"], cost: "treat", req: ["oven"], alt: ["airfryer"], category: "fish", recipe: {
    servings: 4,
    ingredients: [
      { name: "pavés de saumon", quantity: 4, unit: "" },
      { name: "pommes de terre", quantity: 600, unit: "g" },
      { name: "brocoli", quantity: 400, unit: "g" },
      { name: "citron", quantity: 1, unit: "" },
      { name: "huile d'olive", quantity: 2, unit: "c. à soupe" },
      { name: "sel et poivre", quantity: 0, unit: "", scalable: false },
    ],
    steps: [
      "Préchauffer le four à 200 °C.",
      "Éplucher les pommes de terre, les couper en rondelles et les disposer sur une plaque recouverte de papier cuisson.",
      "Arroser d'un filet d'huile d'olive, saler. Enfourner 15 minutes.",
      "Sortir la plaque, poser les pavés de saumon et les bouquets de brocoli à côté des pommes de terre.",
      "Arroser le saumon d'un filet de citron et d'huile d'olive.",
      "Remettre au four 12 à 15 minutes.",
      "Servir dès la sortie du four.",
    ],
  } },
  { id: "cabillaud-airfryer", name: "Cabillaud pané à l'Airfryer", description: "Filets de cabillaud croustillants, quartiers de citron.", prepTime: 20, difficulty: "easy", tags: ["airfryer", "rapide"], ingredients: ["cabillaud", "chapelure", "citron", "persil"], kid: true, base: "fish", allergens: ["fish", "gluten"], req: ["airfryer"], alt: ["oven"], category: "fish" },
  { id: "pates-thon", name: "Pâtes au thon & tomate", description: "Pâtes rapides, thon et sauce tomate.", prepTime: 20, difficulty: "very_easy", tags: ["express", "placard"], ingredients: ["pâtes", "thon", "tomate", "ail"], kid: true, base: "fish", allergens: ["fish", "gluten"], cost: "low", req: ["stovetop"], category: "pasta" },
  { id: "papillote-poisson", name: "Papillote de poisson & légumes", description: "Poisson blanc et légumes cuits en papillote.", prepTime: 30, difficulty: "easy", tags: ["healthy", "four"], ingredients: ["poisson blanc", "courgette", "tomate", "citron"], base: "fish", gf: true, lf: true, allergens: ["fish"], req: ["oven"], category: "fish" },
  { id: "risotto-crevettes", name: "Risotto aux crevettes", description: "Risotto crémeux et crevettes rosées.", prepTime: 35, difficulty: "medium", tags: ["italie", "chic"], ingredients: ["riz arborio", "crevettes", "parmesan", "bouillon"], base: "fish", allergens: ["shellfish", "milk"], cost: "treat", req: ["stovetop"], category: "fish" },
  { id: "gambas-plancha", name: "Gambas grillées à la plancha", description: "Gambas à l'ail et persil, grillées minute.", prepTime: 20, difficulty: "easy", tags: ["ete", "grill"], ingredients: ["gambas", "ail", "persil", "citron"], base: "fish", gf: true, lf: true, allergens: ["shellfish"], cost: "treat", req: ["plancha"], alt: ["stovetop", "bbq"], category: "fish" },
  { id: "sardines-grillees", name: "Sardines grillées & salade", description: "Sardines au barbecue, salade fraîche.", prepTime: 20, difficulty: "easy", tags: ["ete", "eco"], ingredients: ["sardines", "salade", "citron", "huile d'olive"], base: "fish", gf: true, lf: true, allergens: ["fish"], cost: "low", req: ["bbq"], alt: ["plancha", "oven"], category: "fish" },
  { id: "fish-and-chips", name: "Fish & chips maison", description: "Poisson pané et frites à l'airfryer.", prepTime: 35, difficulty: "medium", tags: ["kids", "airfryer"], ingredients: ["poisson blanc", "pommes de terre", "farine", "citron"], kid: true, base: "fish", allergens: ["fish", "gluten"], req: ["airfryer"], alt: ["oven"], category: "fish" },

  // ---------- PATES ----------
  { id: "pates-bolo-veg", name: "Pâtes bolognaise végétale", description: "Sauce riche aux lentilles, façon bolognaise.", prepTime: 30, difficulty: "easy", tags: ["veggie", "batch"], ingredients: ["pâtes", "lentilles", "tomate", "carotte", "oignon"], kid: true, base: "vegan", allergens: ["gluten"], cost: "low", req: ["stovetop"], category: "pasta", recipe: {
    servings: 4,
    ingredients: [
      { name: "pâtes", quantity: 400, unit: "g" },
      { name: "lentilles vertes", quantity: 200, unit: "g" },
      { name: "pulpe de tomate", quantity: 400, unit: "g" },
      { name: "carotte", quantity: 2, unit: "" },
      { name: "oignon", quantity: 1, unit: "" },
      { name: "gousse d'ail", quantity: 2, unit: "" },
      { name: "huile d'olive", quantity: 2, unit: "c. à soupe" },
      { name: "sel et poivre", quantity: 0, unit: "", scalable: false },
    ],
    steps: [
      "Cuire les lentilles 20 minutes dans de l'eau bouillante salée. Égoutter.",
      "Émincer l'oignon, l'ail et râper les carottes.",
      "Faire revenir l'oignon dans l'huile d'olive 3 minutes.",
      "Ajouter l'ail et la carotte, cuire 2 minutes.",
      "Verser la pulpe de tomate, ajouter les lentilles cuites, saler et poivrer.",
      "Laisser mijoter 10 minutes à feu doux.",
      "Pendant ce temps, cuire les pâtes selon les instructions du paquet.",
      "Servir les pâtes nappées de sauce.",
    ],
  } },
  { id: "pates-champignons", name: "Pâtes crémeuses aux champignons", description: "Pâtes onctueuses, champignons et crème.", prepTime: 25, difficulty: "easy", tags: ["comfort", "veggie"], ingredients: ["pâtes", "champignon", "crème", "ail", "persil"], kid: true, base: "veg", allergens: ["gluten", "milk"], req: ["stovetop"], category: "pasta" },
  { id: "pates-pesto", name: "Pâtes au pesto & tomates cerises", description: "Pâtes express, pesto et tomates cerises.", prepTime: 15, difficulty: "very_easy", tags: ["express", "veggie"], ingredients: ["pâtes", "pesto", "tomates cerises", "parmesan"], kid: true, base: "veg", allergens: ["gluten", "milk", "tree_nuts"], req: ["stovetop"], category: "pasta" },
  { id: "one-pot-pasta", name: "One pot pasta tomate-basilic", description: "Pâtes cuites dans la sauce, une seule casserole.", prepTime: 20, difficulty: "very_easy", tags: ["express", "veggie"], ingredients: ["pâtes", "tomate", "basilic", "ail", "oignon"], kid: true, base: "vegan", allergens: ["gluten"], cost: "low", req: ["stovetop"], category: "pasta" },
  { id: "lasagnes", name: "Lasagnes maison", description: "Lasagnes à la bolognaise et béchamel.", prepTime: 75, difficulty: "advanced", tags: ["dimanche", "familial"], ingredients: ["pâtes à lasagne", "bœuf haché", "tomate", "béchamel", "fromage"], kid: true, base: "meat", allergens: ["gluten", "milk"], req: ["oven"], category: "pasta" },
  { id: "gratin-pates", name: "Gratin de pâtes au fromage", description: "Pâtes gratinées, croûte dorée.", prepTime: 35, difficulty: "easy", tags: ["comfort", "kids"], ingredients: ["pâtes", "fromage", "crème", "jambon"], kid: true, base: "pork", allergens: ["gluten", "milk"], req: ["oven"], category: "pasta" },
  { id: "pates-burrata", name: "Pâtes tomate & burrata", description: "Pâtes chaudes, tomates confites et burrata crémeuse.", prepTime: 20, difficulty: "very_easy", tags: ["italie", "veggie"], ingredients: ["pâtes", "tomate", "burrata", "basilic"], base: "veg", allergens: ["gluten", "milk"], req: ["stovetop"], category: "pasta" },

  // ---------- RIZ ----------
  { id: "riz-saute-legumes-oeufs", name: "Riz sauté aux légumes & œufs", description: "Riz sauté minute, légumes et œufs brouillés.", prepTime: 20, difficulty: "very_easy", tags: ["express", "veggie"], ingredients: ["riz", "petits pois", "carotte", "œuf", "sauce soja"], kid: true, base: "veg", allergens: ["eggs", "soy"], cost: "low", req: ["stovetop"], reuse: ["riz"], category: "rice" },
  { id: "risotto-champignons", name: "Risotto aux champignons", description: "Risotto crémeux et champignons poêlés.", prepTime: 35, difficulty: "medium", tags: ["italie", "veggie"], ingredients: ["riz arborio", "champignon", "parmesan", "bouillon"], base: "veg", gf: true, allergens: ["milk"], req: ["stovetop"], category: "rice" },
  { id: "riz-cantonais", name: "Riz cantonais", description: "Riz sauté, œuf, jambon et petits pois.", prepTime: 20, difficulty: "easy", tags: ["asie", "kids"], ingredients: ["riz", "œuf", "jambon", "petits pois"], kid: true, base: "pork", allergens: ["eggs", "soy"], req: ["stovetop"], reuse: ["riz"], category: "rice" },
  { id: "buddha-bowl", name: "Buddha bowl quinoa & légumes", description: "Bol complet quinoa, légumes rôtis et houmous.", prepTime: 30, difficulty: "easy", tags: ["healthy", "vegan"], ingredients: ["quinoa", "pois chiches", "avocat", "carotte", "houmous"], base: "vegan", gf: true, cost: "normal", req: ["oven"], alt: ["stovetop"], category: "rice" },
  { id: "riz-poulet-thermomix", name: "Riz au poulet façon Thermomix", description: "Riz et poulet cuits ensemble au robot.", prepTime: 30, difficulty: "easy", tags: ["thermomix", "familial"], ingredients: ["riz", "poulet", "poivron", "bouillon"], base: "meat", gf: true, lf: true, req: ["thermomix"], alt: ["stovetop"], reuse: ["poulet"], category: "rice" },

  // ---------- OEUFS ----------
  { id: "omelette-pdt", name: "Omelette pommes de terre & salade", description: "Omelette moelleuse aux pommes de terre.", prepTime: 20, difficulty: "very_easy", tags: ["express", "eco"], ingredients: ["œuf", "pommes de terre", "oignon", "salade"], kid: true, base: "veg", gf: true, allergens: ["eggs"], cost: "low", req: ["stovetop"], category: "eggs", recipe: {
    servings: 4,
    ingredients: [
      { name: "œufs", quantity: 8, unit: "" },
      { name: "pommes de terre", quantity: 400, unit: "g" },
      { name: "oignon", quantity: 1, unit: "" },
      { name: "huile d'olive", quantity: 2, unit: "c. à soupe" },
      { name: "salade verte", quantity: 1, unit: "", scalable: false },
      { name: "sel et poivre", quantity: 0, unit: "", scalable: false },
    ],
    steps: [
      "Éplucher les pommes de terre et les couper en petits dés.",
      "Faire chauffer l'huile dans une grande poêle. Faire revenir les dés de pommes de terre 10 minutes à feu moyen.",
      "Ajouter l'oignon émincé et cuire encore 3 minutes.",
      "Battre les œufs dans un bol, saler et poivrer.",
      "Verser les œufs sur les pommes de terre. Cuire à feu doux 5 minutes.",
      "Retourner l'omelette à l'aide d'une assiette ou la finir sous le grill.",
      "Servir avec la salade assaisonnée.",
    ],
  } },
  { id: "shakshuka", name: "Shakshuka", description: "Œufs pochés dans une sauce tomate épicée.", prepTime: 25, difficulty: "easy", tags: ["monde", "veggie"], ingredients: ["œuf", "tomate", "poivron", "oignon", "cumin"], base: "veg", gf: true, lf: true, allergens: ["eggs"], cost: "low", req: ["stovetop"], category: "eggs" },
  { id: "oeufs-cocotte", name: "Œufs cocotte aux épinards", description: "Œufs fondants cuits au four avec épinards.", prepTime: 20, difficulty: "easy", tags: ["veggie", "four"], ingredients: ["œuf", "épinard", "crème", "fromage"], base: "veg", gf: true, allergens: ["eggs", "milk"], req: ["oven"], category: "eggs" },
  { id: "frittata-courgette", name: "Frittata courgette & feta", description: "Omelette au four garnie de courgette et feta.", prepTime: 30, difficulty: "easy", tags: ["veggie", "batch"], ingredients: ["œuf", "courgette", "feta", "oignon"], base: "veg", gf: true, allergens: ["eggs", "milk"], req: ["oven"], alt: ["stovetop"], category: "eggs" },

  // ---------- VEGGIE / VEGAN PLATS ----------
  { id: "gratin-courgettes-chevre", name: "Gratin de courgettes & chèvre", description: "Courgettes gratinées au chèvre.", prepTime: 40, difficulty: "easy", tags: ["veggie", "four"], ingredients: ["courgette", "chèvre", "crème", "chapelure"], base: "veg", allergens: ["milk", "gluten"], req: ["oven"], category: "veggie" },
  { id: "gratin-dauphinois", name: "Gratin dauphinois", description: "Pommes de terre fondantes à la crème.", prepTime: 60, difficulty: "medium", tags: ["france", "comfort"], ingredients: ["pommes de terre", "crème", "lait", "ail"], kid: true, base: "veg", gf: true, allergens: ["milk"], req: ["oven"], category: "veggie", recipe: {
    servings: 4,
    ingredients: [
      { name: "pommes de terre", quantity: 1000, unit: "g" },
      { name: "crème liquide", quantity: 30, unit: "cl" },
      { name: "lait", quantity: 20, unit: "cl" },
      { name: "gousse d'ail", quantity: 1, unit: "" },
      { name: "noix de muscade", quantity: 1, unit: "pincée", scalable: false },
      { name: "sel et poivre", quantity: 0, unit: "", scalable: false },
    ],
    steps: [
      "Préchauffer le four à 180 °C.",
      "Éplucher les pommes de terre et les couper en rondelles fines.",
      "Frotter un plat à gratin avec la gousse d'ail coupée en deux.",
      "Disposer les rondelles en couches régulières dans le plat.",
      "Mélanger la crème, le lait, le sel, le poivre et la muscade.",
      "Verser le mélange sur les pommes de terre.",
      "Enfourner 50 minutes. Le gratin est prêt quand le dessus est bien doré.",
    ],
  } },
  { id: "curry-legumes-coco", name: "Curry de légumes au lait de coco", description: "Légumes mijotés, curry doux et coco.", prepTime: 30, difficulty: "easy", tags: ["vegan", "monde"], ingredients: ["pois chiches", "courgette", "lait de coco", "curry", "riz"], base: "vegan", gf: true, cost: "low", req: ["stovetop"], reuse: ["riz"], category: "veggie" },
  { id: "dahl-lentilles", name: "Dahl de lentilles corail", description: "Lentilles corail mijotées aux épices.", prepTime: 30, difficulty: "easy", tags: ["vegan", "eco"], ingredients: ["lentilles corail", "lait de coco", "tomate", "curcuma", "riz"], base: "vegan", gf: true, cost: "low", req: ["stovetop"], reuse: ["riz"], category: "veggie", recipe: {
    servings: 4,
    ingredients: [
      { name: "lentilles corail", quantity: 250, unit: "g" },
      { name: "lait de coco", quantity: 200, unit: "ml" },
      { name: "pulpe de tomate", quantity: 400, unit: "g" },
      { name: "oignon", quantity: 1, unit: "" },
      { name: "gousse d'ail", quantity: 2, unit: "" },
      { name: "curcuma", quantity: 1, unit: "c. à café" },
      { name: "cumin", quantity: 1, unit: "c. à café" },
      { name: "huile d'olive", quantity: 1, unit: "c. à soupe" },
      { name: "riz", quantity: 250, unit: "g" },
      { name: "sel", quantity: 0, unit: "", scalable: false },
    ],
    steps: [
      "Rincer les lentilles corail à l'eau froide.",
      "Émincer l'oignon et l'ail. Les faire revenir dans l'huile d'olive 3 minutes.",
      "Ajouter le curcuma et le cumin, mélanger 30 secondes.",
      "Verser les lentilles, la pulpe de tomate et le lait de coco.",
      "Couvrir et laisser mijoter 15 à 20 minutes en remuant de temps en temps, jusqu'à ce que les lentilles soient fondantes.",
      "Cuire le riz à part selon les instructions du paquet.",
      "Servir le dahl sur le riz.",
    ],
  } },
  { id: "chili-vegetarien", name: "Chili végétarien", description: "Haricots rouges, maïs et légumes épicés.", prepTime: 35, difficulty: "easy", tags: ["vegan", "batch"], ingredients: ["haricots rouges", "maïs", "tomate", "poivron", "riz"], base: "vegan", gf: true, cost: "low", req: ["stovetop"], reuse: ["riz"], category: "veggie" },
  { id: "ratatouille", name: "Ratatouille & riz", description: "Légumes du soleil mijotés, servis avec du riz.", prepTime: 45, difficulty: "easy", tags: ["france", "vegan"], ingredients: ["aubergine", "courgette", "poivron", "tomate", "riz"], base: "vegan", gf: true, cost: "low", req: ["stovetop"], reuse: ["riz"], category: "veggie" },
  { id: "boulettes-veg-thermomix", name: "Boulettes de lentilles (Thermomix)", description: "Boulettes végé préparées au robot, sauce tomate.", prepTime: 35, difficulty: "medium", tags: ["thermomix", "vegan"], ingredients: ["lentilles", "flocons d'avoine", "tomate", "oignon"], base: "vegan", allergens: ["gluten"], req: ["thermomix"], alt: ["stovetop"], category: "veggie" },
  { id: "tofu-saute", name: "Tofu sauté aux légumes", description: "Tofu doré et légumes croquants, sauce soja.", prepTime: 25, difficulty: "easy", tags: ["vegan", "asie"], ingredients: ["tofu", "brocoli", "carotte", "sauce soja", "riz"], base: "vegan", allergens: ["soy"], req: ["stovetop"], reuse: ["riz"], category: "veggie" },
  { id: "chili-patate-douce", name: "Chili patate douce & haricots noirs", description: "Chili doux et coloré, réconfortant.", prepTime: 40, difficulty: "easy", tags: ["vegan", "batch"], ingredients: ["patate douce", "haricots noirs", "tomate", "maïs", "riz"], base: "vegan", gf: true, cost: "low", req: ["stovetop"], reuse: ["riz"], category: "veggie" },

  // ---------- GRATINS / FOUR ----------
  { id: "gratin-chou-fleur", name: "Gratin de chou-fleur", description: "Chou-fleur nappé de béchamel, gratiné.", prepTime: 45, difficulty: "easy", tags: ["veggie", "comfort"], ingredients: ["chou-fleur", "béchamel", "fromage"], base: "veg", allergens: ["milk", "gluten"], req: ["oven"], category: "gratin" },
  { id: "tartiflette", name: "Tartiflette", description: "Pommes de terre, reblochon et lardons.", prepTime: 50, difficulty: "medium", tags: ["hiver", "comfort"], ingredients: ["pommes de terre", "reblochon", "lardons", "oignon"], base: "pork", gf: true, allergens: ["milk"], req: ["oven"], category: "gratin" },
  { id: "parmentier-canard", name: "Parmentier de canard", description: "Confit de canard et purée gratinée.", prepTime: 45, difficulty: "medium", tags: ["france", "chic"], ingredients: ["canard confit", "pommes de terre", "lait"], base: "meat", allergens: ["milk"], cost: "treat", req: ["oven"], category: "gratin" },
  { id: "gratin-legumes-airfryer", name: "Légumes rôtis à l'Airfryer", description: "Assortiment de légumes rôtis, herbes.", prepTime: 25, difficulty: "very_easy", tags: ["airfryer", "vegan"], ingredients: ["courgette", "poivron", "oignon", "pommes de terre", "herbes"], base: "vegan", gf: true, cost: "low", req: ["airfryer"], alt: ["oven"], category: "gratin" },

  // ---------- PIZZAS / TARTES ----------
  { id: "pizza-maison", name: "Pizza maison express", description: "Pâte, sauce tomate, mozzarella et garniture.", prepTime: 25, difficulty: "easy", tags: ["kids", "convivial"], ingredients: ["pâte à pizza", "tomate", "mozzarella", "jambon"], kid: true, base: "pork", allergens: ["gluten", "milk"], req: ["oven"], category: "pizza", recipe: {
    servings: 4,
    ingredients: [
      { name: "pâte à pizza (prête à dérouler)", quantity: 1, unit: "", scalable: false },
      { name: "coulis de tomate", quantity: 200, unit: "g" },
      { name: "mozzarella", quantity: 200, unit: "g" },
      { name: "jambon blanc", quantity: 4, unit: "tranches" },
      { name: "origan", quantity: 1, unit: "c. à café", scalable: false },
      { name: "huile d'olive", quantity: 1, unit: "c. à soupe", scalable: false },
    ],
    steps: [
      "Préchauffer le four à 220 °C.",
      "Dérouler la pâte sur une plaque recouverte de papier cuisson.",
      "Étaler le coulis de tomate en couche fine.",
      "Répartir la mozzarella coupée en morceaux et le jambon déchiré.",
      "Saupoudrer d'origan et d'un filet d'huile d'olive.",
      "Enfourner 10 à 12 minutes, jusqu'à ce que le bord soit bien doré.",
      "Couper en parts et servir aussitôt.",
    ],
    notes: "Pour 2 grandes pizzas, doubler la pâte et cuire en deux fournées.",
  } },
  { id: "pizza-veggie", name: "Pizza végétarienne", description: "Pizza légumes grillés et mozzarella.", prepTime: 25, difficulty: "easy", tags: ["veggie", "convivial"], ingredients: ["pâte à pizza", "tomate", "mozzarella", "courgette", "poivron"], kid: true, base: "veg", allergens: ["gluten", "milk"], req: ["oven"], category: "pizza" },
  { id: "tarte-legumes", name: "Tarte fine aux légumes", description: "Pâte feuilletée et légumes de saison.", prepTime: 35, difficulty: "easy", tags: ["veggie", "leger"], ingredients: ["pâte feuilletée", "courgette", "tomate", "chèvre"], base: "veg", allergens: ["gluten", "milk"], req: ["oven"], category: "pizza" },
  { id: "quiche-legumes", name: "Quiche aux légumes", description: "Tarte salée aux légumes et crème.", prepTime: 45, difficulty: "medium", tags: ["veggie", "batch"], ingredients: ["pâte brisée", "courgette", "œuf", "crème"], base: "veg", allergens: ["gluten", "eggs", "milk"], req: ["oven"], category: "pizza" },

  // ---------- SOUPES ----------
  { id: "soupe-legumes", name: "Soupe de légumes & tartines", description: "Velouté de légumes, tartines grillées.", prepTime: 30, difficulty: "very_easy", tags: ["hiver", "eco"], ingredients: ["carotte", "poireau", "pomme de terre", "pain"], kid: true, base: "vegan", allergens: ["gluten"], cost: "low", req: ["stovetop"], alt: ["hand_blender"], category: "soup" },
  { id: "soupe-potiron-thermomix", name: "Velouté de potiron (Thermomix)", description: "Velouté onctueux de potiron au robot.", prepTime: 25, difficulty: "very_easy", tags: ["thermomix", "hiver"], ingredients: ["potiron", "pomme de terre", "crème", "bouillon"], base: "veg", gf: true, allergens: ["milk"], req: ["thermomix"], alt: ["hand_blender", "stovetop"], category: "soup" },
  { id: "minestrone", name: "Minestrone de légumes", description: "Soupe italienne aux légumes et pâtes.", prepTime: 35, difficulty: "easy", tags: ["italie", "veggie"], ingredients: ["haricots", "courgette", "tomate", "pâtes", "carotte"], base: "vegan", allergens: ["gluten"], cost: "low", req: ["stovetop"], category: "soup" },
  { id: "soupe-thai", name: "Soupe thaï au lait de coco", description: "Bouillon parfumé, légumes et coco.", prepTime: 30, difficulty: "easy", tags: ["asie", "vegan"], ingredients: ["lait de coco", "champignon", "citronnelle", "nouilles de riz"], base: "vegan", gf: true, req: ["stovetop"], category: "soup" },
  { id: "veloute-carotte", name: "Velouté carotte-coco", description: "Velouté doux carotte et lait de coco.", prepTime: 25, difficulty: "very_easy", tags: ["vegan", "hiver"], ingredients: ["carotte", "lait de coco", "oignon", "bouillon"], base: "vegan", gf: true, cost: "low", req: ["stovetop"], alt: ["hand_blender"], category: "soup" },

  // ---------- SALADES / BOWLS ----------
  { id: "salade-cesar", name: "Salade César au poulet", description: "Salade croquante, poulet et parmesan.", prepTime: 20, difficulty: "easy", tags: ["healthy", "leger"], ingredients: ["salade", "poulet", "parmesan", "croûtons", "sauce césar"], base: "meat", allergens: ["gluten", "milk", "eggs"], req: ["stovetop"], reuse: ["poulet"], category: "salad" },
  { id: "salade-pates-mozza", name: "Salade de pâtes, tomates & mozzarella", description: "Salade fraîche de pâtes, idéale à emporter.", prepTime: 20, difficulty: "very_easy", tags: ["express", "veggie"], ingredients: ["pâtes", "tomate", "mozzarella", "basilic"], kid: true, base: "veg", allergens: ["gluten", "milk"], req: ["stovetop"], category: "salad" },
  { id: "salade-nicoise", name: "Salade niçoise", description: "Thon, œuf, haricots verts et olives.", prepTime: 25, difficulty: "easy", tags: ["ete", "healthy"], ingredients: ["thon", "œuf", "haricots verts", "tomate", "olives"], base: "fish", gf: true, lf: true, allergens: ["fish", "eggs"], req: ["stovetop"], category: "salad" },
  { id: "salade-quinoa-feta", name: "Salade quinoa, feta & concombre", description: "Salade fraîche et complète, sans cuisson lourde.", prepTime: 20, difficulty: "very_easy", tags: ["healthy", "veggie"], ingredients: ["quinoa", "feta", "concombre", "menthe", "citron"], base: "veg", gf: true, allergens: ["milk"], req: ["stovetop"], category: "salad" },
  { id: "poke-bowl-saumon", name: "Poke bowl saumon", description: "Riz, saumon cru mariné, avocat et edamame.", prepTime: 25, difficulty: "medium", tags: ["healthy", "tendance"], ingredients: ["riz", "saumon", "avocat", "edamame", "sauce soja"], base: "fish", allergens: ["fish", "soy"], cost: "treat", req: ["stovetop"], reuse: ["riz"], category: "salad" },
  { id: "salade-lentilles", name: "Salade de lentilles & légumes", description: "Lentilles, carottes et herbes, vinaigrette.", prepTime: 25, difficulty: "very_easy", tags: ["vegan", "eco"], ingredients: ["lentilles", "carotte", "oignon rouge", "persil"], base: "vegan", gf: true, cost: "low", req: ["stovetop"], category: "salad" },

  // ---------- WRAPS / SANDWICHS / TARTINES ----------
  { id: "quesadillas", name: "Quesadillas poulet & fromage", description: "Tortillas dorées garnies de poulet fondant.", prepTime: 20, difficulty: "very_easy", tags: ["express", "kids"], ingredients: ["tortillas", "poulet", "fromage", "poivron"], kid: true, base: "meat", allergens: ["gluten", "milk"], req: ["stovetop"], reuse: ["poulet"], category: "wrap" },
  { id: "wraps-veggie", name: "Wraps falafel & crudités", description: "Falafels, crudités et sauce blanche en galette.", prepTime: 20, difficulty: "easy", tags: ["veggie", "nomade"], ingredients: ["tortillas", "falafel", "salade", "tomate", "sauce"], base: "veg", allergens: ["gluten", "sesame"], req: ["stovetop"], category: "wrap", recipe: {
    servings: 4,
    ingredients: [
      { name: "tortillas", quantity: 4, unit: "" },
      { name: "falafels (prêts ou surgelés)", quantity: 12, unit: "" },
      { name: "salade verte", quantity: 1, unit: "", scalable: false },
      { name: "tomate", quantity: 2, unit: "" },
      { name: "concombre", quantity: 0.5, unit: "" },
      { name: "yaourt nature", quantity: 100, unit: "g" },
      { name: "jus de citron", quantity: 1, unit: "c. à soupe" },
      { name: "sel et poivre", quantity: 0, unit: "", scalable: false },
    ],
    steps: [
      "Réchauffer les falafels à la poêle ou au four selon les instructions.",
      "Couper la tomate en dés et le concombre en bâtonnets.",
      "Mélanger le yaourt avec le jus de citron, saler et poivrer.",
      "Réchauffer les tortillas 30 secondes à la poêle.",
      "Tartiner chaque tortilla de sauce yaourt.",
      "Garnir de salade, falafels, tomate et concombre.",
      "Rouler serré et couper en deux.",
    ],
  } },
  { id: "tartines-avocat-oeuf", name: "Tartines avocat & œuf", description: "Pain grillé, avocat écrasé et œuf poché.", prepTime: 15, difficulty: "very_easy", tags: ["express", "leger"], ingredients: ["pain", "avocat", "œuf", "citron"], base: "veg", allergens: ["gluten", "eggs"], cost: "low", req: ["toaster"], alt: ["stovetop"], category: "wrap" },
  { id: "bagels-saumon", name: "Bagels saumon & fromage frais", description: "Bagels garnis de saumon fumé et fromage frais.", prepTime: 15, difficulty: "very_easy", tags: ["express", "chic"], ingredients: ["bagel", "saumon fumé", "fromage frais", "aneth"], base: "fish", allergens: ["fish", "gluten", "milk"], cost: "treat", req: ["toaster"], alt: ["stovetop"], category: "wrap" },
  { id: "croque-veggie", name: "Croque veggie tomate-mozza", description: "Croque fondant tomate et mozzarella.", prepTime: 15, difficulty: "very_easy", tags: ["veggie", "kids"], ingredients: ["pain de mie", "tomate", "mozzarella", "basilic"], kid: true, base: "veg", allergens: ["gluten", "milk"], req: ["croque"], alt: ["stovetop", "oven"], category: "wrap" },

  // ---------- GALETTES / CREPES ----------
  { id: "galettes-completes", name: "Galettes complètes", description: "Galettes de sarrasin, jambon, œuf, fromage.", prepTime: 30, difficulty: "easy", tags: ["france", "convivial"], ingredients: ["farine de sarrasin", "jambon", "œuf", "fromage"], kid: true, base: "pork", gf: true, allergens: ["eggs", "milk"], req: ["stovetop"], category: "misc" },
  { id: "crepes-salees-champi", name: "Crêpes champignons & béchamel", description: "Crêpes garnies de champignons crémeux.", prepTime: 35, difficulty: "medium", tags: ["veggie", "comfort"], ingredients: ["farine", "lait", "champignon", "béchamel"], base: "veg", allergens: ["gluten", "milk", "eggs"], req: ["stovetop"], category: "misc" },

  // ---------- MONDE ----------
  { id: "burritos", name: "Burritos haricots & riz", description: "Tortillas roulées, riz, haricots et légumes.", prepTime: 25, difficulty: "easy", tags: ["monde", "vegan"], ingredients: ["tortillas", "riz", "haricots rouges", "maïs", "avocat"], base: "vegan", allergens: ["gluten"], cost: "low", req: ["stovetop"], reuse: ["riz"], category: "world" },
  { id: "pad-thai", name: "Pad thaï aux légumes", description: "Nouilles de riz sautées, sauce cacahuète.", prepTime: 30, difficulty: "medium", tags: ["asie", "veggie"], ingredients: ["nouilles de riz", "œuf", "cacahuète", "légumes", "sauce"], base: "veg", allergens: ["peanuts", "eggs", "soy"], req: ["stovetop"], category: "world" },
  { id: "couscous-legumes", name: "Couscous de légumes", description: "Semoule et légumes mijotés aux épices.", prepTime: 45, difficulty: "medium", tags: ["monde", "vegan"], ingredients: ["semoule", "pois chiches", "courgette", "carotte", "épices"], base: "vegan", allergens: ["gluten"], cost: "low", req: ["stovetop"], category: "world" },
  { id: "tajine-poulet", name: "Tajine de poulet aux olives", description: "Poulet mijoté, citron confit et olives.", prepTime: 55, difficulty: "medium", tags: ["monde", "mijote"], ingredients: ["poulet", "olives", "citron confit", "semoule", "épices"], base: "meat", allergens: ["gluten"], req: ["stovetop"], reuse: ["poulet"], category: "world" },
  { id: "gyoza-riz", name: "Gyoza & riz sauté", description: "Raviolis japonais poêlés, riz sauté.", prepTime: 25, difficulty: "easy", tags: ["asie", "kids"], ingredients: ["gyoza", "riz", "sauce soja", "légumes"], kid: true, base: "veg", allergens: ["gluten", "soy"], req: ["stovetop"], reuse: ["riz"], category: "world" },
  { id: "nasi-goreng", name: "Nasi goreng (riz sauté indonésien)", description: "Riz sauté épicé, œuf et légumes.", prepTime: 25, difficulty: "easy", tags: ["asie", "eco"], ingredients: ["riz", "œuf", "légumes", "sauce soja", "oignon"], base: "veg", allergens: ["eggs", "soy"], cost: "low", req: ["stovetop"], reuse: ["riz"], category: "world" },

  // ---------- COMFORT / DIVERS ----------
  { id: "hot-dog-maison", name: "Hot-dogs maison & potatoes", description: "Pains, saucisses et potatoes airfryer.", prepTime: 25, difficulty: "very_easy", tags: ["kids", "airfryer"], ingredients: ["pain à hot-dog", "saucisse", "pommes de terre", "moutarde"], kid: true, base: "pork", allergens: ["gluten"], req: ["airfryer"], alt: ["oven", "stovetop"], category: "misc" },
  { id: "burger-maison", name: "Burger maison & frites", description: "Burger juteux et frites airfryer.", prepTime: 30, difficulty: "easy", tags: ["kids", "convivial"], ingredients: ["pain burger", "steak haché", "cheddar", "salade", "pommes de terre"], kid: true, base: "meat", allergens: ["gluten", "milk"], req: ["airfryer"], alt: ["stovetop", "oven"], category: "misc" },
  { id: "veggie-burger", name: "Veggie burger & frites", description: "Galette végétale, crudités et frites.", prepTime: 30, difficulty: "easy", tags: ["veggie", "kids"], ingredients: ["pain burger", "galette végé", "salade", "tomate", "pommes de terre"], base: "veg", allergens: ["gluten"], req: ["airfryer"], alt: ["stovetop", "oven"], category: "misc" },
  { id: "boulettes-tomate", name: "Boulettes de bœuf sauce tomate", description: "Boulettes mijotées, purée ou pâtes.", prepTime: 35, difficulty: "easy", tags: ["comfort", "kids"], ingredients: ["bœuf haché", "tomate", "oignon", "pâtes"], kid: true, base: "meat", allergens: ["gluten"], req: ["stovetop"], category: "beef" },
  { id: "saucisses-lentilles", name: "Saucisses & lentilles", description: "Saucisses fumées sur lit de lentilles.", prepTime: 35, difficulty: "easy", tags: ["hiver", "eco"], ingredients: ["saucisse", "lentilles", "carotte", "oignon"], base: "pork", gf: true, lf: true, cost: "low", req: ["stovetop"], category: "misc" },
  { id: "blanquette-veau", name: "Blanquette de veau", description: "Veau mijoté, sauce crémeuse et riz.", prepTime: 90, difficulty: "advanced", tags: ["france", "dimanche"], ingredients: ["veau", "carotte", "champignon", "crème", "riz"], base: "meat", allergens: ["milk"], cost: "treat", req: ["stovetop"], reuse: ["riz"], category: "beef" },
  { id: "poelee-legumes-oeuf", name: "Poêlée de légumes & œuf au plat", description: "Légumes de saison poêlés, œuf sur le dessus.", prepTime: 20, difficulty: "very_easy", tags: ["express", "veggie"], ingredients: ["pommes de terre", "courgette", "poivron", "œuf"], base: "veg", gf: true, lf: true, allergens: ["eggs"], cost: "low", req: ["stovetop"], category: "veggie" },
  { id: "polenta-cremeuse", name: "Polenta crémeuse aux légumes", description: "Polenta onctueuse et légumes rôtis.", prepTime: 30, difficulty: "easy", tags: ["veggie", "comfort"], ingredients: ["polenta", "parmesan", "courgette", "tomate"], base: "veg", gf: true, allergens: ["milk"], req: ["stovetop"], category: "veggie" },
  { id: "aligot-saucisse", name: "Aligot & saucisse", description: "Purée filante au fromage et saucisse grillée.", prepTime: 40, difficulty: "medium", tags: ["france", "comfort"], ingredients: ["pommes de terre", "tomme", "saucisse", "ail"], base: "pork", gf: true, allergens: ["milk"], req: ["stovetop"], category: "misc" },
  { id: "brandade-morue", name: "Brandade de morue", description: "Morue et pommes de terre gratinées.", prepTime: 45, difficulty: "medium", tags: ["france", "poisson"], ingredients: ["morue", "pommes de terre", "lait", "ail"], base: "fish", gf: true, allergens: ["fish", "milk"], req: ["oven"], category: "fish" },
  { id: "endives-jambon", name: "Endives au jambon", description: "Endives braisées, jambon et béchamel gratinés.", prepTime: 45, difficulty: "medium", tags: ["france", "hiver"], ingredients: ["endives", "jambon", "béchamel", "fromage"], base: "pork", allergens: ["milk", "gluten"], req: ["oven"], category: "gratin" },
  { id: "gnocchis-poelee", name: "Gnocchis poêlés tomate-mozza", description: "Gnocchis dorés, sauce tomate et mozzarella.", prepTime: 20, difficulty: "very_easy", tags: ["express", "veggie"], ingredients: ["gnocchis", "tomate", "mozzarella", "basilic"], kid: true, base: "veg", allergens: ["gluten", "milk"], req: ["stovetop"], category: "misc" },
  { id: "chakchouka-pois-chiche", name: "Poêlée pois chiches & épinards", description: "Pois chiches et épinards épicés, express.", prepTime: 20, difficulty: "very_easy", tags: ["vegan", "express"], ingredients: ["pois chiches", "épinard", "tomate", "cumin"], base: "vegan", gf: true, cost: "low", req: ["stovetop"], category: "veggie" },
  { id: "nouilles-sautees-poulet", name: "Nouilles sautées au poulet", description: "Nouilles wok, poulet et légumes croquants.", prepTime: 25, difficulty: "easy", tags: ["asie", "express"], ingredients: ["nouilles", "poulet", "chou", "carotte", "sauce soja"], base: "meat", allergens: ["gluten", "soy"], req: ["stovetop"], reuse: ["poulet"], category: "chicken" },
  { id: "cordon-bleu-airfryer", name: "Cordon bleu & haricots verts", description: "Cordon bleu croustillant à l'airfryer.", prepTime: 25, difficulty: "very_easy", tags: ["kids", "airfryer"], ingredients: ["cordon bleu", "haricots verts", "pommes de terre"], kid: true, base: "meat", allergens: ["gluten", "milk"], req: ["airfryer"], alt: ["oven", "stovetop"], category: "chicken" },
  { id: "moussaka", name: "Moussaka", description: "Aubergines, viande et béchamel gratinées.", prepTime: 75, difficulty: "advanced", tags: ["monde", "dimanche"], ingredients: ["aubergine", "agneau haché", "tomate", "béchamel"], base: "meat", allergens: ["milk", "gluten"], req: ["oven"], category: "gratin" },
  { id: "risotto-butternut", name: "Risotto butternut", description: "Risotto crémeux à la courge butternut.", prepTime: 40, difficulty: "medium", tags: ["veggie", "hiver"], ingredients: ["riz arborio", "butternut", "parmesan", "bouillon"], base: "veg", gf: true, allergens: ["milk"], req: ["stovetop"], category: "rice" },
  { id: "pizza-blanche-chevre", name: "Pizza blanche chèvre-miel", description: "Pizza crème, chèvre et miel.", prepTime: 25, difficulty: "easy", tags: ["veggie", "convivial"], ingredients: ["pâte à pizza", "crème", "chèvre", "miel"], base: "veg", allergens: ["gluten", "milk"], req: ["oven"], category: "pizza" },
  { id: "poulet-teriyaki", name: "Poulet teriyaki & riz", description: "Poulet laqué sauce teriyaki, riz vapeur.", prepTime: 25, difficulty: "easy", tags: ["asie", "kids"], ingredients: ["poulet", "sauce teriyaki", "riz", "sésame"], kid: true, base: "meat", allergens: ["soy", "sesame", "gluten"], req: ["stovetop"], reuse: ["poulet", "riz"], category: "chicken" },
  { id: "gratin-brocoli", name: "Gratin de brocoli & pommes de terre", description: "Brocoli et pommes de terre gratinés au fromage.", prepTime: 45, difficulty: "easy", tags: ["veggie", "four"], ingredients: ["brocoli", "pommes de terre", "crème", "fromage"], base: "veg", gf: true, allergens: ["milk"], req: ["oven"], category: "gratin" },
  { id: "tacos-poisson", name: "Tacos de poisson", description: "Tortillas, poisson pané et sauce fraîche.", prepTime: 25, difficulty: "easy", tags: ["monde", "poisson"], ingredients: ["tortillas", "poisson blanc", "chou", "citron vert", "sauce"], base: "fish", allergens: ["fish", "gluten"], req: ["airfryer"], alt: ["stovetop", "oven"], category: "fish" },
  { id: "soupe-oignon", name: "Soupe à l'oignon gratinée", description: "Soupe à l'oignon, croûtons et fromage gratiné.", prepTime: 45, difficulty: "medium", tags: ["france", "hiver"], ingredients: ["oignon", "bouillon", "pain", "fromage"], base: "veg", allergens: ["gluten", "milk"], req: ["oven"], alt: ["stovetop"], category: "soup" },
  { id: "chili-sin-carne-airfryer", name: "Patates rôties & guacamole", description: "Pommes de terre rôties airfryer, guacamole maison.", prepTime: 30, difficulty: "very_easy", tags: ["vegan", "airfryer"], ingredients: ["pommes de terre", "avocat", "citron vert", "tomate"], base: "vegan", gf: true, cost: "low", req: ["airfryer"], alt: ["oven"], category: "veggie" },
  { id: "spaghetti-vongole", name: "Spaghetti alle vongole", description: "Spaghetti aux palourdes, ail et persil.", prepTime: 25, difficulty: "medium", tags: ["italie", "chic"], ingredients: ["spaghetti", "palourdes", "ail", "persil", "vin blanc"], base: "fish", allergens: ["shellfish", "gluten"], cost: "treat", req: ["stovetop"], category: "pasta" },
  { id: "curry-crevettes", name: "Curry de crevettes", description: "Crevettes au curry et lait de coco, riz.", prepTime: 30, difficulty: "medium", tags: ["asie", "chic"], ingredients: ["crevettes", "lait de coco", "curry", "riz"], base: "fish", gf: true, lf: true, allergens: ["shellfish"], cost: "treat", req: ["stovetop"], reuse: ["riz"], category: "fish" },
  { id: "pommes-terre-raclette-four", name: "Gratin façon raclette", description: "Pommes de terre et fromage à raclette au four.", prepTime: 40, difficulty: "easy", tags: ["hiver", "comfort"], ingredients: ["pommes de terre", "fromage à raclette", "charcuterie"], base: "pork", gf: true, allergens: ["milk"], req: ["oven"], category: "gratin" },
  { id: "salade-poulet-avocat", name: "Salade poulet-avocat", description: "Salade fraîche poulet grillé et avocat.", prepTime: 20, difficulty: "very_easy", tags: ["healthy", "express"], ingredients: ["poulet", "avocat", "salade", "tomate", "citron"], base: "meat", gf: true, lf: true, req: ["stovetop"], reuse: ["poulet"], category: "salad" },
  { id: "veloute-brocoli", name: "Velouté de brocoli", description: "Velouté doux de brocoli, mixeur plongeant.", prepTime: 25, difficulty: "very_easy", tags: ["veggie", "leger"], ingredients: ["brocoli", "pomme de terre", "bouillon", "crème"], base: "veg", gf: true, allergens: ["milk"], req: ["stovetop"], alt: ["hand_blender"], category: "soup" },
  { id: "smoothie-bowl", name: "Smoothie bowl & granola", description: "Base de fruits mixés, granola et fruits frais.", prepTime: 10, difficulty: "very_easy", tags: ["vegan", "leger"], ingredients: ["banane", "fruits rouges", "lait végétal", "granola"], base: "vegan", req: ["blender"], category: "misc" },
];

export const MEAL_CATALOG: Meal[] = RAW.map(meal);

export function getMealById(id: string): Meal | undefined {
  return MEAL_CATALOG.find((m) => m.id === id);
}

export function getMealByName(name: string): Meal | undefined {
  return MEAL_CATALOG.find((m) => m.name === name);
}
