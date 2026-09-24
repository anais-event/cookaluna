import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = (body.email ?? "").trim().toLowerCase();

    if (!email || !EMAIL_RE.test(email)) {
      return NextResponse.json(
        { error: "Adresse email invalide." },
        { status: 400 },
      );
    }

    let supabase: ReturnType<typeof getSupabase>;
    try {
      supabase = getSupabase();
    } catch {
      return NextResponse.json(
        { error: "Service temporairement indisponible." },
        { status: 503 },
      );
    }

    const { error } = await supabase.from("subscribers").upsert(
      {
        email,
        language: "fr",
        source: "coming_soon",
        subscribed_at: new Date().toISOString(),
      },
      { onConflict: "email", ignoreDuplicates: true },
    );

    if (error) {
      console.error("Supabase subscribe error:", error);
      return NextResponse.json(
        { error: "Une erreur est survenue. Réessayez." },
        { status: 500 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Une erreur est survenue. Réessayez." },
      { status: 500 },
    );
  }
}
