"use client";

// Petits contrôles réutilisables pour l'onboarding.

export function Chip({
  active,
  onClick,
  children,
  ariaPressed,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  ariaPressed?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={ariaPressed ?? active}
      className={`font-display rounded-full border-[3px] border-ink px-4 py-2 text-sm font-bold transition ${
        active
          ? "bg-coral text-white shadow-pop-sm"
          : "bg-white text-ink hover:-translate-y-0.5"
      }`}
    >
      {children}
    </button>
  );
}

export function Stepper({
  options,
  value,
  onChange,
  label,
}: {
  options: { value: number; label: string }[];
  value: number;
  onChange: (v: number) => void;
  label: string;
}) {
  return (
    <div role="radiogroup" aria-label={label} className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          role="radio"
          aria-checked={value === o.value}
          onClick={() => onChange(o.value)}
          className={`font-display h-12 min-w-12 rounded-xl border-[3px] border-ink px-4 text-base font-extrabold transition ${
            value === o.value
              ? "bg-ink text-white shadow-pop-sm"
              : "bg-white text-ink hover:-translate-y-0.5"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function OptionCard({
  active,
  onClick,
  title,
  desc,
}: {
  active: boolean;
  onClick: () => void;
  title: string;
  desc?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`w-full rounded-card border-[3px] border-ink p-4 text-left transition ${
        active
          ? "bg-coral text-white shadow-pop"
          : "bg-white text-ink hover:-translate-y-0.5 hover:shadow-pop-sm"
      }`}
    >
      <span className="font-display block text-lg font-extrabold">{title}</span>
      {desc && (
        <span className={`mt-1 block text-sm ${active ? "text-white/90" : "text-ink/70"}`}>
          {desc}
        </span>
      )}
    </button>
  );
}

export function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-display mb-2 mt-6 text-lg font-bold first:mt-0">{children}</p>
  );
}
