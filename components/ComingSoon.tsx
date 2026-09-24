"use client";

import { useState, useRef, type FormEvent } from "react";
import { Sparkle, Cross, Dot } from "./Sparkle";
import { StripePattern } from "./StripePattern";
import { Loader2, Check, ArrowRight } from "lucide-react";

const FEATURES = [
  {
    num: "01",
    title: "Un menu qui vous connaît",
    body: "Cookaluna apprendra vos goûts, vos habitudes et les particularités de votre foyer pour proposer des menus qui vous ressemblent vraiment.",
    accent: "bg-coral",
  },
  {
    num: "02",
    title: "Votre espace Cookaluna",
    body: "Retrouvez vos préférences, vos menus passés et vos recettes préférées. Plus besoin de tout recommencer à chaque visite.",
    accent: "bg-ink",
  },
  {
    num: "03",
    title: "Votre menu arrive tout seul",
    body: "Chaque semaine, un nouveau menu adapté à votre foyer, directement dans votre boîte mail. Sans lever le petit doigt.",
    accent: "bg-coral",
  },
];

export function ComingSoon() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) return;

    setState("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed }),
      });
      const data = await res.json();
      if (!res.ok) {
        setState("error");
        setErrorMsg(data.error ?? "Une erreur est survenue.");
        return;
      }
      setState("success");
    } catch {
      setState("error");
      setErrorMsg("Pas de connexion. Réessayez.");
    }
  };

  return (
    <section className="no-print relative overflow-hidden">
      <StripePattern height={14} />

      <div className="relative bg-coral-light/40 py-16 sm:py-24">
        {/* Decorative elements */}
        <Sparkle
          size={44}
          color="var(--coral)"
          className="absolute left-[8%] top-12 animate-twinkle hidden sm:block"
        />
        <Cross
          size={24}
          className="absolute right-[12%] top-20 hidden sm:block"
        />
        <Sparkle
          size={28}
          color="var(--ink)"
          className="absolute right-[6%] bottom-24 animate-float hidden md:block"
        />
        <Dot
          size={14}
          color="var(--coral)"
          className="absolute left-[15%] bottom-32 hidden md:block"
        />

        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          {/* Title */}
          <div className="relative mb-14 sm:mb-20">
            <div className="stripes-deco absolute -left-4 top-1 h-14 w-3 rounded-full hidden lg:block" />
            <h2 className="font-display text-4xl font-extrabold leading-[0.95] sm:text-5xl md:text-6xl">
              Et ce n&rsquo;est que{" "}
              <span className="relative inline-block text-coral">
                le début
                <svg
                  className="absolute -bottom-2 left-0 w-full"
                  viewBox="0 0 200 12"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M2 8 C40 2, 80 10, 120 4 C150 0, 180 8, 198 3"
                    stroke="var(--coral)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    fill="none"
                  />
                </svg>
              </span>
            </h2>
            <p className="mt-4 max-w-lg text-lg text-ink/70">
              Cookaluna grandit. Voici ce qui mijote pour la suite.
            </p>
          </div>

          {/* Feature cards — asymmetric layout */}
          <div className="grid gap-6 md:grid-cols-3">
            {FEATURES.map((f, i) => (
              <div
                key={f.num}
                className={`group relative ${i === 1 ? "md:translate-y-6" : ""}`}
              >
                {/* Shadow offset stripe block */}
                <div className="stripes-soft absolute inset-0 translate-x-2 translate-y-2 rounded-card border-[3px] border-ink" />
                <div className="card relative flex flex-col p-6 transition-transform duration-200 hover:-translate-y-1">
                  {/* Number badge */}
                  <span
                    className={`${f.accent} inline-flex h-10 w-10 items-center justify-center rounded-full border-[3px] border-ink font-display text-sm font-extrabold text-white`}
                  >
                    {f.num}
                  </span>
                  <h3 className="mt-4 font-display text-xl font-extrabold leading-tight">
                    {f.title}
                  </h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-ink/75">
                    {f.body}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Email signup */}
          <div className="relative mx-auto mt-16 max-w-xl sm:mt-24">
            {/* Decorative stripe corner */}
            <div className="stripes-deco absolute -right-3 -top-3 h-full w-full rounded-card hidden sm:block" />

            <div className="card relative overflow-hidden p-8 sm:p-10">
              {/* Corner stripe accent */}
              <div className="stripes absolute right-0 top-0 h-2 w-24" />

              {state === "success" ? (
                <div className="flex flex-col items-center py-4 text-center">
                  <span className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full border-[3px] border-ink bg-coral text-white">
                    <Check size={28} strokeWidth={3} />
                  </span>
                  <p className="font-display text-2xl font-extrabold">
                    C&rsquo;est noté !
                  </p>
                  <p className="mt-2 text-ink/70">
                    On vous prévient dès que les nouveautés arrivent.
                  </p>
                </div>
              ) : (
                <>
                  <h3 className="font-display text-2xl font-extrabold sm:text-3xl">
                    Vous voulez être au courant ?
                  </h3>
                  <p className="mt-2 text-[15px] text-ink/70">
                    Laissez-nous votre email et on vous prévient dès que les
                    nouveautés arrivent.
                  </p>

                  <form
                    onSubmit={submit}
                    className="mt-6 flex flex-col gap-3 sm:flex-row"
                  >
                    <div className="relative flex-1">
                      <input
                        ref={inputRef}
                        type="email"
                        required
                        placeholder="votre@email.fr"
                        aria-label="Votre adresse email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (state === "error") setState("idle");
                        }}
                        disabled={state === "loading"}
                        className="w-full rounded-xl border-[3px] border-ink bg-white px-4 py-3 font-medium text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-coral focus:ring-offset-2 disabled:opacity-50"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={state === "loading" || !email.trim()}
                      className="btn btn-coral btn-sm whitespace-nowrap"
                    >
                      {state === "loading" ? (
                        <Loader2
                          size={18}
                          className="animate-spin"
                          aria-hidden="true"
                        />
                      ) : (
                        <ArrowRight size={18} aria-hidden="true" />
                      )}
                      Prévenez-moi
                    </button>
                  </form>

                  {state === "error" && (
                    <p className="mt-3 text-sm font-medium text-red-600">
                      {errorMsg}
                    </p>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <StripePattern height={14} />
    </section>
  );
}
