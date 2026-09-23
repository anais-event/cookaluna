"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useStore } from "@/lib/store";
import { track } from "@/lib/analytics";
import { generateDemoMenu, validateProfile } from "@/lib/generator";
import { Header } from "@/components/Header";
import { StepProgress } from "@/components/StepProgress";
import { GenerationLoader } from "@/components/GenerationLoader";
import { HouseholdStep } from "@/components/steps/HouseholdStep";
import { DietStep } from "@/components/steps/DietStep";
import { CookingStep } from "@/components/steps/CookingStep";
import { EquipmentStep } from "@/components/steps/EquipmentStep";
import { StartingPointStep } from "@/components/steps/StartingPointStep";

const STEP_COUNT = 5;

export default function CreatePage() {
  const router = useRouter();
  const {
    profile,
    currentStep,
    isGenerating,
    setStep,
    setGenerating,
    setMenu,
  } = useStore();

  useEffect(() => {
    track("onboarding_started");
  }, []);

  const step = Math.min(currentStep, STEP_COUNT - 1);

  const next = () => {
    if (step < STEP_COUNT - 1) setStep(step + 1);
    else void generate();
  };
  const back = () => {
    if (step > 0) setStep(step - 1);
  };

  const generate = async () => {
    const check = validateProfile(profile);
    if (!check.valid) {
      alert(check.errors.join("\n"));
      return;
    }
    track("onboarding_completed");
    setGenerating(true);
    try {
      const res = await fetch("/api/generate-menu", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });
      if (!res.ok) throw new Error("bad response");
      const data = await res.json();
      setMenu(data.menu);
      track("menu_generated", { source: data.menu?.source });
    } catch {
      // Fallback client : jamais d'écran d'erreur.
      const menu = generateDemoMenu(profile);
      setMenu(menu);
      track("menu_generated", { source: "demo", fallback: true });
    } finally {
      setGenerating(false);
      setStep(0);
      router.push("/menu");
    }
  };

  if (isGenerating) {
    return (
      <>
        <Header />
        <GenerationLoader />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
        <StepProgress current={step} total={STEP_COUNT} />
        <div className="mt-6">
          {step === 0 && <HouseholdStep />}
          {step === 1 && <DietStep />}
          {step === 2 && <CookingStep />}
          {step === 3 && <EquipmentStep />}
          {step === 4 && <StartingPointStep />}
        </div>

        <div className="mt-8 flex items-center justify-between">
          <button
            type="button"
            onClick={back}
            disabled={step === 0}
            className="btn btn-ghost btn-sm"
          >
            <ArrowLeft size={18} aria-hidden="true" /> Retour
          </button>
          <button type="button" onClick={next} className="btn btn-coral">
            {step === STEP_COUNT - 1 ? "Créer mon menu" : "Suivant"}
            {step < STEP_COUNT - 1 && <ArrowRight size={18} aria-hidden="true" />}
          </button>
        </div>
      </main>
    </>
  );
}
