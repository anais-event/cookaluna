"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { MealSuggestionPicker } from "./MealSuggestionPicker";
import type { MenuMeal } from "@/lib/types";

export function MealEditModal({
  currentName,
  onChoose,
  onChooseManual,
  onClose,
}: {
  currentName: string;
  onChoose: (meal: MenuMeal) => void;
  onChooseManual: (name: string) => void;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 p-0 sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label={`Changer ${currentName}`}
      onClick={onClose}
    >
      <div
        className="card max-h-[90vh] w-full max-w-md overflow-y-auto rounded-b-none p-6 sm:rounded-card"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <h2 className="font-display text-2xl font-extrabold leading-tight">
            Vous voulez changer
            <br />
            <span className="text-coral">« {currentName} »</span>
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer"
            className="btn btn-ghost btn-sm shrink-0"
          >
            <X size={16} aria-hidden="true" />
          </button>
        </div>
        <div className="mt-4">
          <MealSuggestionPicker
            currentName={currentName}
            onChoose={onChoose}
            onChooseManual={onChooseManual}
          />
        </div>
      </div>
    </div>
  );
}
