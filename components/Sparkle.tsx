interface SparkleProps {
  size?: number;
  color?: string;
  className?: string;
  animate?: boolean;
}

// Étoile à 4 branches — élément décoratif signature.
export function Sparkle({
  size = 24,
  color = "var(--ink)",
  className = "",
  animate = false,
}: SparkleProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={`${animate ? "animate-twinkle" : ""} ${className}`}
    >
      <path
        d="M12 0 C13 8 16 11 24 12 C16 13 13 16 12 24 C11 16 8 13 0 12 C8 11 11 8 12 0 Z"
        fill={color}
      />
    </svg>
  );
}

// Petite croix décorative.
export function Cross({
  size = 16,
  color = "var(--coral)",
  className = "",
}: {
  size?: number;
  color?: string;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
    >
      <rect x="10" y="2" width="4" height="20" rx="2" fill={color} />
      <rect x="2" y="10" width="20" height="4" rx="2" fill={color} />
    </svg>
  );
}

// Point décoratif.
export function Dot({
  size = 12,
  color = "var(--ink)",
  className = "",
}: {
  size?: number;
  color?: string;
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={className}
      style={{
        display: "inline-block",
        width: size,
        height: size,
        borderRadius: "50%",
        background: color,
      }}
    />
  );
}
