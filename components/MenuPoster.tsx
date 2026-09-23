import { StripePattern } from "./StripePattern";
import { Sparkle, Dot } from "./Sparkle";

const ROWS: [string, string][] = [
  ["LUN", "Tacos maison express"],
  ["MAR", "Saumon rôti & brocoli"],
  ["MER", "Omelette & salade"],
  ["JEU", "Gratin de courgettes"],
  ["VEN", "Pizza maison express"],
  ["SAM", "Pâtes aux champignons"],
  ["DIM", "Soupe & tartines"],
];

// Représentation graphique d'un menu imprimé, épinglé au frigo.
export function MenuPoster({ tilt = true }: { tilt?: boolean }) {
  return (
    <div className="relative mx-auto w-full max-w-sm">
      {/* aimants */}
      <div className="absolute -left-2 -top-3 z-20">
        <Dot size={22} color="var(--coral)" />
      </div>
      <div className="absolute -right-2 -top-3 z-20">
        <Dot size={22} color="var(--ink)" />
      </div>
      <Sparkle
        size={30}
        color="var(--coral)"
        className="absolute -right-5 top-1/3 z-20"
        animate
      />

      <div
        className="card overflow-hidden"
        style={{ transform: tilt ? "rotate(-2deg)" : undefined }}
      >
        <div className="bg-coral px-5 py-4 text-white">
          <p className="font-display text-xs font-bold uppercase tracking-widest">
            On mange quoi cette semaine ?
          </p>
          <p className="font-display text-2xl font-extrabold leading-none">
            COOKALUNA
          </p>
        </div>
        <StripePattern height={10} />
        <ul className="divide-y-2 divide-ink/10 bg-paper">
          {ROWS.map(([d, meal]) => (
            <li key={d} className="flex items-center gap-3 px-5 py-2.5">
              <span className="font-display w-10 shrink-0 text-sm font-extrabold text-coral">
                {d}
              </span>
              <span className="text-sm font-medium">{meal}</span>
            </li>
          ))}
        </ul>
        <div className="bg-ink px-5 py-2 text-center">
          <span className="font-display text-xs font-bold text-paper">
            Cookaluna · La semaine est servie.
          </span>
        </div>
      </div>
    </div>
  );
}
