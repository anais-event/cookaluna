"use client";

export function StepProgress({
  current,
  total,
}: {
  current: number;
  total: number;
}) {
  const pct = Math.round(((current + 1) / total) * 100);
  return (
    <div className="no-print">
      <div className="flex items-center justify-between">
        <span className="font-display text-sm font-bold text-ink/70">
          Étape {current + 1} sur {total}
        </span>
        <span className="font-display text-sm font-bold text-coral">{pct}%</span>
      </div>
      <div
        className="mt-2 h-4 w-full overflow-hidden rounded-full border-[3px] border-ink bg-white"
        role="progressbar"
        aria-valuenow={current + 1}
        aria-valuemin={1}
        aria-valuemax={total}
      >
        <div
          className="h-full bg-coral transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
