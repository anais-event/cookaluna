import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, DM_Sans } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "@/lib/store";
import { SITE_NAME, SITE_URL } from "@/lib/seo";
import { SpeedInsights } from "@vercel/speed-insights/next";

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
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Cookaluna | Votre menu de la semaine prêt à imprimer",
    template: "%s",
  },
  description:
    "Créez votre menu de la semaine selon votre famille, vos envies, votre temps, votre budget et votre cuisine. Modifiez-le puis imprimez-le pour le frigo.",
  applicationName: SITE_NAME,
  openGraph: {
    title: "Cookaluna — Votre menu de la semaine prêt pour le frigo",
    description:
      "Quelques questions, quelques idées, et hop : votre menu est prêt à imprimer.",
    type: "website",
    locale: "fr_FR",
    siteName: SITE_NAME,
    url: SITE_URL,
  },
  icons: {
    icon: "/favicon.svg",
  },
};

const ORG_JSONLD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/favicon.svg`,
  slogan: "La semaine est servie.",
};

const WEBSITE_JSONLD = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: SITE_URL,
  inLanguage: "fr-FR",
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ORG_JSONLD) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(WEBSITE_JSONLD) }}
        />
        <StoreProvider>{children}</StoreProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}
