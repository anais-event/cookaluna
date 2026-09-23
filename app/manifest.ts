import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Cookaluna — Menu de la semaine",
    short_name: "Cookaluna",
    description:
      "Créez votre menu de la semaine selon votre famille, vos envies et votre budget. Imprimez-le pour le frigo.",
    start_url: "/",
    display: "standalone",
    background_color: "#FFFDF8",
    theme_color: "#FF6B5F",
    icons: [
      {
        src: "/favicon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
