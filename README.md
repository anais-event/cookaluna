# COOKALUNA

**On mange quoi ce soir ?** — Votre menu de la semaine, prêt pour le frigo.

Petit outil du quotidien : on répond à 5 questions, COOKALUNA propose une semaine
cohérente, on l'ajuste, on l'imprime (ou on télécharge le PDF). Pas de compte, pas
de base de données, pas de paiement.

## Stack

Next.js 15 (App Router) · TypeScript · Tailwind CSS · lucide-react ·
OpenAI SDK (côté serveur) · @react-pdf/renderer · impression `@media print`.

## Démarrer

```bash
npm install
npm run dev
```

Ouvrir http://localhost:3000

## Variables d'environnement

Copier `.env.example` vers `.env.local` :

```
OPENAI_API_KEY=      # optionnel
OPENAI_MODEL=gpt-5
```

- **Sans clé** : l'app tourne en **mode DEMO** avec le catalogue local (~100 repas)
  et l'algorithme de génération. Aucune erreur serveur.
- **Avec clé** : `POST /api/generate-menu` utilise l'IA (sortie JSON structurée,
  schéma strict) ; en cas d'échec, repli silencieux sur le mode démo.

La clé n'est lue que côté serveur, jamais exposée au client.

## Scripts

```bash
npm run dev        # développement
npm run build      # build production
npm run start      # serveur production
npm run lint       # ESLint
npm run typecheck  # TypeScript
npm run test       # tests unitaires (vitest)
```

## Pages

- `/` landing · `/create` onboarding (5 étapes) · `/menu` menu généré + impression/PDF · `/about` comment ça marche

## Impression / PDF

- **Imprimer** : ouvre le dialogue navigateur ; `@media print` masque l'app et ne
  laisse que la feuille A4.
- **Télécharger le PDF** : vrai fichier A4 généré via `@react-pdf/renderer`.
