import type { Metadata } from "next";

// URL de base du site (surchargée en prod via NEXT_PUBLIC_SITE_URL).
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "https://cookaluna.fr";

export const SITE_NAME = "Cookaluna";

// Pages destinées au référencement (utilisées par le sitemap + maillage).
export const SEO_PAGES: { path: string; label: string; priority: number }[] = [
  { path: "/", label: "Accueil", priority: 1 },
  { path: "/menu-semaine", label: "Menu de la semaine", priority: 0.9 },
  { path: "/menu-semaine-a-imprimer", label: "Menu de la semaine à imprimer", priority: 0.8 },
  { path: "/menu-semaine-famille", label: "Menu de la semaine en famille", priority: 0.8 },
  { path: "/menu-semaine-rapide", label: "Menu de la semaine rapide", priority: 0.7 },
  { path: "/menu-semaine-vegetarien", label: "Menu de la semaine végétarien", priority: 0.7 },
  { path: "/menu-semaine-sans-four", label: "Menu de la semaine sans four", priority: 0.7 },
  { path: "/idees-repas-semaine", label: "Idées repas pour la semaine", priority: 0.6 },
  { path: "/about", label: "Comment ça marche", priority: 0.5 },
];

// Construit un objet Metadata cohérent (title, description, canonical, OG).
export function pageMeta({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  const url = `${SITE_URL}${path === "/" ? "" : path}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "website",
      locale: "fr_FR",
      siteName: SITE_NAME,
    },
  };
}
