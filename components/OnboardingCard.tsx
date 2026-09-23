"use client";

import { Sparkle } from "./Sparkle";

export function OnboardingCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="card animate-pop relative p-6 sm:p-8">
      <Sparkle
        size={22}
        color="var(--coral)"
        className="absolute -right-3 -top-3"
      />
      <h2 className="font-display text-3xl font-extrabold leading-tight">
        {title}
      </h2>
      {subtitle && <p className="mt-2 text-ink/70">{subtitle}</p>}
      <div className="mt-6">{children}</div>
    </div>
  );
}
