"use client";

import { useState, useRef, type FormEvent } from "react";
import { Sparkle, Cross, Dot } from "./Sparkle";
import { StripePattern } from "./StripePattern";
import { Loader2, Check, ArrowRight } from "lucide-react";

const FEATURES = [
  {
    num: "01",
    title: "Créer votre compte Cookaluna",
    body: "Pour que Cookaluna se souvienne de vous, de vos goûts et de vos petites habitudes.",
    accent: "bg-coral",
  },
  {
    num: "02",
    title: "Retrouver vos menus et vos recettes",
    body: "Parce qu’une bonne idée de dîner mérite parfois une deuxième tournée.",
    accent: "bg-ink",
  },
  {
    num: "03",
    title: "Recevoir votre menu chaque semaine",
    body: "Votre menu arrive tout seul dans votre boîte mail. Plus besoin de venir le chercher.",
    accent: "bg-coral",
  },
  {
    num: "04",
    title: "Découvrir des menus pensés pour les enfants",
    body: "Parce que « qu’est-ce qu’on mange ? » est déjà une question suffisamment compliquée comme ça.",
    accent: "bg-ink",
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
          <div className="relative mb-10 sm:mb-14">
            <div className="stripes-deco absolute -left-4 top-1 h-14 w-3 rounded-full hidden lg:block" />
            <h2 className="font-display text-4xl font-extrabold leading-[0.95] sm:text-5xl md:text-6xl">
              Vous aimez Cookaluna ?
            </h2>
            <p className="mt-3 font-display text-2xl font-extrabold text-ink/60 sm:text-3xl">
              On prépare quand même la suite. 😉
            </p>
            <p className="mt-4 max-w-lg text-lg text-ink/70">
              Et on a quelques idées pour vous faciliter encore un peu la vie.
            </p>
          </div>

          {/* Intro line */}
          <p className="mb-10 font-display text-xl font-bold text-ink/80">
            Demain, vous pourrez :
          </p>

          {/* Liste éditoriale — filets, gros index, pas de grille uniforme */}
          <ul className="border-t-[3px] border-ink">
            {FEATURES.map((f) => (
              <li
                key={f.num}
                className="flex flex-col gap-3 border-b-[3px] border-ink py-6 sm:flex-row sm:items-baseline sm:gap-8 sm:py-7"
              >
                <span className="font-display text-3xl font-extrabold text-coral leading-none sm:w-16 sm:shrink-0 sm:text-4xl">
                  {f.num}
                </span>
                <div className="sm:flex sm:items-baseline sm:gap-8">
                  <h3 className="font-display text-xl font-extrabold leading-tight sm:w-72 sm:shrink-0">
                    {f.title}
                  </h3>
                  <p className="mt-1.5 text-[15px] leading-relaxed text-ink/70 sm:mt-0">
                    {f.body}
                  </p>
                </div>
              </li>
            ))}
          </ul>

          {/* Email signup */}
          <div className="relative mx-auto mt-14 max-w-xl sm:mt-20">
            <div className="stripes-deco absolute -right-3 -top-3 h-full w-full rounded-card hidden sm:block" />

            <div className="card relative overflow-hidden p-8 sm:p-10">
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
                    On vous fera signe quand les nouveautés seront prêtes.
                  </p>
                </div>
              ) : (
                <>
                  <h3 className="font-display text-2xl font-extrabold sm:text-3xl">
                    Vous voulez savoir quand ça arrive ?
                  </h3>
                  <p className="mt-2 text-[15px] text-ink/70">
                    Laissez-nous votre email. On vous fera signe quand les
                    nouveautés seront prêtes.
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
