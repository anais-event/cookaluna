import { NextResponse } from "next/server";
import { generateAiMenu, hasApiKey } from "@/lib/ai";
import { generateDemoMenu, validateProfile } from "@/lib/generator";
import type { MealProfile } from "@/lib/types";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let profile: MealProfile;
  try {
    profile = (await req.json()) as MealProfile;
  } catch {
    return NextResponse.json(
      { error: "Requête invalide." },
      { status: 400 },
    );
  }

  const check = validateProfile(profile);
  if (!check.valid) {
    return NextResponse.json(
      { error: check.errors.join(" ") },
      { status: 400 },
    );
  }

  // Sans clé API : mode démo, jamais d'erreur serveur.
  if (!hasApiKey()) {
    const menu = generateDemoMenu(profile);
    return NextResponse.json({ menu });
  }

  try {
    const menu = await generateAiMenu(profile);
    // Sécurité : si l'IA renvoie une semaine vide, on retombe sur la démo.
    if (!menu.meals || menu.meals.length === 0) {
      return NextResponse.json({ menu: generateDemoMenu(profile) });
    }
    return NextResponse.json({ menu });
  } catch (err) {
    // Fallback silencieux vers la démo : l'utilisateur ne voit pas d'erreur brute.
    console.error("[generate-menu] IA indisponible, fallback démo:", err);
    const menu = generateDemoMenu(profile);
    return NextResponse.json({ menu, fallback: true });
  }
}
