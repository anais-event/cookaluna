import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, DM_Sans } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "@/lib/store";

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-display",
  display: "swap",
});

const body = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Cookaluna | Votre menu de la semaine prêt à imprimer",
  description:
    "Créez votre menu de la semaine selon votre famille, vos envies, votre temps, votre budget et votre cuisine. Modifiez-le puis imprimez-le pour le frigo.",
  openGraph: {
    title: "Cookaluna — Votre menu de la semaine prêt pour le frigo",
    description:
      "Quelques questions, quelques idées, et hop : votre menu est prêt à imprimer.",
    type: "website",
    locale: "fr_FR",
    siteName: "Cookaluna",
  },
  icons: {
    icon: "/favicon.svg",
  },
};

export const viewport: Viewport = {
  themeColor: "#FF6B5F",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${display.variable} ${body.variable}`}>
      <body>
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
