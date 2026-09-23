"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createDefaultProfile } from "./profile";
import type {
  DayKey,
  MealProfile,
  MealSlot,
  MenuMeal,
  WeeklyMenuData,
} from "./types";

const STORAGE_KEY = "cookaluna:v1";

export type ThemeName = "coral";

interface PersistShape {
  profile: MealProfile;
  menu: WeeklyMenuData | null;
}

interface StoreValue {
  profile: MealProfile;
  menu: WeeklyMenuData | null;
  currentStep: number;
  isGenerating: boolean;
  selectedTheme: ThemeName;
  hydrated: boolean;
  setProfile: (patch: Partial<MealProfile>) => void;
  replaceProfile: (p: MealProfile) => void;
  setMenu: (menu: WeeklyMenuData | null) => void;
  setStep: (n: number) => void;
  setGenerating: (b: boolean) => void;
  resetAll: () => void;
  updateMealAt: (day: DayKey, slot: MealSlot, patch: Partial<MenuMeal>) => void;
  replaceMealAt: (day: DayKey, slot: MealSlot, meal: MenuMeal) => void;
  clearMealAt: (day: DayKey, slot: MealSlot) => void;
}

const StoreContext = createContext<StoreValue | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfileState] = useState<MealProfile>(createDefaultProfile);
  const [menu, setMenuState] = useState<WeeklyMenuData | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedTheme] = useState<ThemeName>("coral");
  const [hydrated, setHydrated] = useState(false);
  const loaded = useRef(false);

  // Hydratation depuis localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as PersistShape;
        if (parsed.profile) setProfileState(parsed.profile);
        if (parsed.menu) setMenuState(parsed.menu);
      }
    } catch {
      /* ignore */
    }
    loaded.current = true;
    setHydrated(true);
  }, []);

  // Persistance
  useEffect(() => {
    if (!loaded.current) return;
    try {
      const data: PersistShape = { profile, menu };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      /* ignore quota */
    }
  }, [profile, menu]);

  const setProfile = useCallback((patch: Partial<MealProfile>) => {
    setProfileState((prev) => ({ ...prev, ...patch }));
  }, []);

  const replaceProfile = useCallback((p: MealProfile) => setProfileState(p), []);
  const setMenu = useCallback((m: WeeklyMenuData | null) => setMenuState(m), []);
  const setStep = useCallback((n: number) => setCurrentStep(n), []);
  const setGenerating = useCallback((b: boolean) => setIsGenerating(b), []);

  const resetAll = useCallback(() => {
    setProfileState(createDefaultProfile());
    setMenuState(null);
    setCurrentStep(0);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }, []);

  const mutateMeal = useCallback(
    (
      day: DayKey,
      slot: MealSlot,
      fn: (m: MenuMeal | undefined) => MenuMeal | null,
    ) => {
      setMenuState((prev) => {
        if (!prev) return prev;
        const idx = prev.meals.findIndex(
          (m) => m.day === day && m.slot === slot,
        );
        const next = [...prev.meals];
        const updated = fn(idx >= 0 ? next[idx] : undefined);
        if (updated === null) {
          if (idx >= 0) next.splice(idx, 1);
        } else if (idx >= 0) {
          next[idx] = updated;
        } else {
          next.push(updated);
        }
        return { ...prev, meals: next };
      });
    },
    [],
  );

  const updateMealAt = useCallback(
    (day: DayKey, slot: MealSlot, patch: Partial<MenuMeal>) => {
      mutateMeal(day, slot, (m) => ({
        day,
        slot,
        name: "",
        description: "",
        prepTime: 0,
        difficulty: "easy",
        ingredients: [],
        tags: [],
        equipment: [],
        reuseIngredients: [],
        ...(m ?? {}),
        ...patch,
      }));
    },
    [mutateMeal],
  );

  const replaceMealAt = useCallback(
    (day: DayKey, slot: MealSlot, meal: MenuMeal) => {
      mutateMeal(day, slot, () => ({ ...meal, day, slot }));
    },
    [mutateMeal],
  );

  const clearMealAt = useCallback(
    (day: DayKey, slot: MealSlot) => {
      mutateMeal(day, slot, (m) =>
        m ? { ...m, name: "", description: "", manual: true, mealId: undefined } : null,
      );
    },
    [mutateMeal],
  );

  const value = useMemo<StoreValue>(
    () => ({
      profile,
      menu,
      currentStep,
      isGenerating,
      selectedTheme,
      hydrated,
      setProfile,
      replaceProfile,
      setMenu,
      setStep,
      setGenerating,
      resetAll,
      updateMealAt,
      replaceMealAt,
      clearMealAt,
    }),
    [
      profile,
      menu,
      currentStep,
      isGenerating,
      selectedTheme,
      hydrated,
      setProfile,
      replaceProfile,
      setMenu,
      setStep,
      setGenerating,
      resetAll,
      updateMealAt,
      replaceMealAt,
      clearMealAt,
    ],
  );

  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
}

export function useStore(): StoreValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
