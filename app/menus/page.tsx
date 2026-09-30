import { pageMeta } from "@/lib/seo";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { StripePattern } from "@/components/StripePattern";
import { Sparkle, Cross } from "@/components/Sparkle";
import { MenuArchiveList } from "@/components/MenuArchiveList";

export const metadata = pageMeta({
  title: "Menus de la semaine | Les derniers menus Cookaluna",
  description:
    "Retrouvez les derniers menus de la semaine proposés par Cookaluna. Parcourez, imprimez ou téléchargez celui qui vous plaît.",
  path: "/menus",
});

export default function MenusPage() {
  return (
    <>
      <Header />
      <main>
        <section className="relative overflow-hidden">
          <Sparkle
            size={34}
            color="var(--coral)"
            className="absolute left-6 top-10 animate-twinkle"
          />
          <Cross size={20} className="absolute right-10 top-24" />
          <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
            <span className="font-display inline-flex items-center gap-2 rounded-full border-[3px] border-ink bg-coral-light px-4 py-1.5 text-sm font-bold">
              <Sparkle size={14} color="var(--coral)" /> Chaque semaine, un
              nouveau menu
            </span>
            <h1 className="mt-5 font-display text-4xl font-extrabold leading-[0.95] sm:text-5xl">
              Les menus de la semaine{" "}
              <span className="text-coral">Cookaluna</span>
            </h1>
            <p className="mt-4 max-w-lg text-lg text-ink/80">
              Parcourez nos menus, trouvez celui qui vous plaît, et
              imprimez-le pour le frigo.
            </p>
          </div>
          <StripePattern height={14} />
        </section>

        <MenuArchiveList />
      </main>
      <Footer />
    </>
  );
}
