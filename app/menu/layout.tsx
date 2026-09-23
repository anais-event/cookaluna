import type { Metadata } from "next";

// Page produit : non indexée (menu personnalisé de l'utilisateur).
export const metadata: Metadata = {
  title: "Mon menu de la semaine | Cookaluna",
  robots: { index: false, follow: true },
};

export default function MenuLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
