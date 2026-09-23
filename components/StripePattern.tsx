interface StripePatternProps {
  className?: string;
  soft?: boolean;
  height?: number | string;
}

// Bande de rayures diagonales corail/blanc réutilisable.
export function StripePattern({
  className = "",
  soft = false,
  height = 16,
}: StripePatternProps) {
  return (
    <div
      aria-hidden="true"
      className={`${soft ? "stripes-soft" : "stripes"} ${className}`}
      style={{ height }}
    />
  );
}
