"use client";

import { useEffect, useState } from "react";
import { Sparkle, Cross, Dot } from "./Sparkle";

const MESSAGES = [
  "On assemble votre semaine…",
  "On évite de vous faire acheter 46 ingrédients différents…",
  "On garde quelques repas faciles pour les jours compliqués…",
  "On tient compte de votre cuisine…",
  "Encore une assiette et c'est prêt.",
];

export function GenerationLoader() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % MESSAGES.length), 1600);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <div className="relative">
        <div className="stripes h-28 w-28 animate-float rounded-3xl border-[3px] border-ink" />
        <Sparkle size={30} color="var(--coral)" className="absolute -right-4 -top-4 animate-twinkle" />
        <Cross size={18} className="absolute -bottom-3 -left-3" />
      </div>
      <p
        key={i}
        className="animate-pop font-display mt-8 max-w-md text-2xl font-extrabold"
        aria-live="polite"
      >
        {MESSAGES[i]}
      </p>
      <div className="mt-6 flex gap-2">
        {MESSAGES.map((_, idx) => (
          <Dot
            key={idx}
            size={10}
            color={idx === i ? "var(--coral)" : "var(--ink)"}
          />
        ))}
      </div>
    </div>
  );
}
