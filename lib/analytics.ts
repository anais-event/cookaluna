// Abstraction analytics minimale. Aucune dépendance externe en V1.
// Branchable plus tard sur un vrai fournisseur.

export type AnalyticsEvent =
  | "landing_view"
  | "onboarding_started"
  | "onboarding_completed"
  | "menu_generated"
  | "meal_changed"
  | "manual_meal_added"
  | "print_clicked"
  | "pdf_downloaded";

export function track(event: AnalyticsEvent, props?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  // Placeholder : en dev, on log simplement. Remplaçable par un vrai sink.
  if (process.env.NODE_ENV !== "production") {
    // eslint-disable-next-line no-console
    console.debug("[analytics]", event, props ?? {});
  }
}
