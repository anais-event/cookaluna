import type { Metadata } from "next";

// Page produit : non indexée (interface personnalisée, pas de contenu éditorial).
export const metadata: Metadata = {
  title: "Créer mon menu | Cookaluna",
  robots: { index: false, follow: true },
};

export default function CreateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
