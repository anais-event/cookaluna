import {
  Document,
  Page,
  Path,
  StyleSheet,
  Svg,
  Text,
  View,
} from "@react-pdf/renderer";
import {
  DAY_LABELS,
  DIFFICULTY_LABELS,
  SLOT_LABELS,
  weekDayOrder,
} from "@/lib/constants";
import type { DayKey, MealSlot, MenuMeal, WeeklyMenuData } from "@/lib/types";

const CORAL = "#FF6B5F";
const CORAL_LIGHT = "#FFE3DE";
const INK = "#111111";
const PAPER = "#FFFDF8";
const WHITE = "#FFFFFF";

// Polices standard intégrées à @react-pdf/renderer : pas de dépendance réseau
// au moment de la génération (Bricolage Grotesque / DM Sans restent réservées au web).

const s = StyleSheet.create({
  page: {
    backgroundColor: PAPER,
    fontSize: 10.5,
    fontFamily: "Helvetica",
    color: INK,
  },
  header: {
    backgroundColor: CORAL,
    paddingHorizontal: 26,
    paddingTop: 22,
    paddingBottom: 20,
  },
  brandRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  brandGroup: { flexDirection: "row", alignItems: "center", gap: 6 },
  brand: {
    color: WHITE,
    fontFamily: "Helvetica",
    fontWeight: "bold",
    fontSize: 22,
    letterSpacing: -0.5,
  },
  weekKicker: {
    color: "rgba(255,255,255,0.85)",
    fontFamily: "Helvetica",
    fontWeight: "bold",
    fontSize: 7.5,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    textAlign: "right",
  },
  weekLabel: {
    color: WHITE,
    fontFamily: "Helvetica",
    fontWeight: "bold",
    fontSize: 12,
    textAlign: "right",
    marginTop: 2,
  },
  tagline: {
    color: WHITE,
    fontFamily: "Helvetica",
    fontWeight: "bold",
    fontSize: 25,
    lineHeight: 1.1,
    marginTop: 14,
    maxWidth: "78%",
  },
  stripes: { flexDirection: "row", height: 8, overflow: "hidden" },
  stripe: { width: 8, height: 8 },
  grid: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 4,
  },
  cellWrap: { width: "33.333%", padding: 5 },
  cellWrapWide: { width: "66.666%", padding: 5 },
  card: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: INK,
    borderRadius: 10,
    backgroundColor: WHITE,
    overflow: "hidden",
  },
  cardHead: {
    backgroundColor: CORAL_LIGHT,
    paddingHorizontal: 10,
    paddingVertical: 6,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dayName: {
    color: INK,
    fontFamily: "Helvetica",
    fontWeight: "bold",
    fontSize: 11.5,
    textTransform: "uppercase",
    letterSpacing: 0.3,
  },
  cardBody: {
    paddingHorizontal: 10,
    paddingVertical: 9,
    flex: 1,
    justifyContent: "center",
    gap: 8,
  },
  slotLabelRow: { flexDirection: "row", alignItems: "center", gap: 3 },
  slotLabel: {
    color: CORAL,
    fontFamily: "Helvetica",
    fontWeight: "bold",
    fontSize: 7,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  mealName: {
    fontFamily: "Helvetica",
    fontWeight: "bold",
    fontSize: 9.5,
    lineHeight: 1.25,
    marginTop: 2,
  },
  mealMeta: { fontSize: 8, color: "rgba(17,17,17,0.55)", marginTop: 1 },
  tipsCard: {
    flex: 1,
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderColor: CORAL,
    borderRadius: 10,
    backgroundColor: CORAL_LIGHT,
    paddingHorizontal: 12,
    paddingVertical: 10,
    justifyContent: "center",
  },
  tipsTitle: {
    color: CORAL,
    fontFamily: "Helvetica",
    fontWeight: "bold",
    fontSize: 8,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  tipsRow: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginTop: 6 },
  tipsItem: { fontFamily: "Helvetica", fontWeight: "bold", fontSize: 9.5 },
  tipsNote: { marginTop: 6, fontSize: 8, color: "rgba(17,17,17,0.6)" },
  quote: {
    fontFamily: "Helvetica",
    fontStyle: "italic",
    fontWeight: "bold",
    fontSize: 9.5,
    marginTop: 6,
    lineHeight: 1.3,
  },
  quoteAuthor: { marginTop: 4, fontSize: 8, color: "rgba(17,17,17,0.6)" },
  footer: {
    backgroundColor: INK,
    paddingVertical: 9,
    paddingHorizontal: 22,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  footerText: {
    color: PAPER,
    fontFamily: "Helvetica",
    fontWeight: "bold",
    fontSize: 8,
    letterSpacing: 0.3,
  },
});

const SPARKLE_PATH =
  "M12 0 C13 8 16 11 24 12 C16 13 13 16 12 24 C11 16 8 13 0 12 C8 11 11 8 12 0 Z";
const SUN_PATH =
  "M12 5.5a6.5 6.5 0 100 13 6.5 6.5 0 000-13zM12 0v2.2M12 21.8V24M4.9 4.9l1.6 1.6M17.5 17.5l1.6 1.6M0 12h2.2M21.8 12H24M4.9 19.1l1.6-1.6M17.5 6.5l1.6-1.6";
const MOON_PATH = "M20 13.5A8.5 8.5 0 1110.5 3 6.7 6.7 0 0020 13.5z";

function Sparkle({ size = 14, color = WHITE }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d={SPARKLE_PATH} fill={color} />
    </Svg>
  );
}

function SlotIcon({ slot }: { slot: MealSlot }) {
  return (
    <Svg width={8} height={8} viewBox="0 0 24 24">
      <Path
        d={slot === "lunch" ? SUN_PATH : MOON_PATH}
        stroke={CORAL}
        strokeWidth={slot === "lunch" ? 2 : 0}
        fill={slot === "lunch" ? "none" : CORAL}
      />
    </Svg>
  );
}

function Stripes({ light = false }: { light?: boolean }) {
  const cells = Array.from({ length: 90 });
  const a = light ? CORAL_LIGHT : CORAL;
  const b = light ? PAPER : WHITE;
  return (
    <View style={s.stripes}>
      {cells.map((_, i) => (
        <View key={i} style={[s.stripe, { backgroundColor: i % 2 === 0 ? a : b }]} />
      ))}
    </View>
  );
}

const FALLBACK_QUOTES = [
  { text: "La vie est un repas partagé.", author: "Proverbe" },
  { text: "Le bonheur, c'est du temps, pas de la vaisselle.", author: "Cookaluna" },
  { text: "Moins de charge mentale, plus de place à table.", author: "Cookaluna" },
  { text: "Un bon repas efface une mauvaise journée.", author: "Proverbe" },
];

function pickFallbackQuote(seed: string) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return FALLBACK_QUOTES[h % FALLBACK_QUOTES.length];
}

function reusedIngredients(meals: MenuMeal[]): string[] {
  const counts = new Map<string, number>();
  for (const m of meals) {
    for (const r of m.reuseIngredients) counts.set(r, (counts.get(r) || 0) + 1);
  }
  return [...counts.entries()]
    .filter(([, n]) => n >= 2)
    .map(([name]) => name)
    .slice(0, 4);
}

function DayCard({ day, slots }: { day: DayKey; slots: Map<MealSlot, MenuMeal> }) {
  return (
    <View style={s.card}>
      <View style={s.cardHead}>
        <Text style={s.dayName}>{DAY_LABELS[day]}</Text>
        <Sparkle size={9} color={CORAL} />
      </View>
      <View style={s.cardBody}>
        {(["lunch", "dinner"] as MealSlot[])
          .filter((sl) => slots.has(sl))
          .map((sl) => {
            const meal = slots.get(sl)!;
            return (
              <View key={sl}>
                <View style={s.slotLabelRow}>
                  <SlotIcon slot={sl} />
                  <Text style={s.slotLabel}>{SLOT_LABELS[sl]}</Text>
                </View>
                <Text style={s.mealName}>{meal.name || "—"}</Text>
                {(meal.prepTime > 0 || meal.difficulty) && (
                  <Text style={s.mealMeta}>
                    {meal.prepTime > 0 ? `${meal.prepTime} min` : ""}
                    {meal.prepTime > 0 && meal.difficulty ? " · " : ""}
                    {meal.difficulty ? DIFFICULTY_LABELS[meal.difficulty] : ""}
                  </Text>
                )}
              </View>
            );
          })}
      </View>
    </View>
  );
}

export function MenuPdfDocument({ menu }: { menu: WeeklyMenuData }) {
  const byDay = new Map<DayKey, Map<MealSlot, MenuMeal>>();
  for (const m of menu.meals) {
    if (!byDay.has(m.day)) byDay.set(m.day, new Map());
    byDay.get(m.day)!.set(m.slot, m);
  }
  const days = weekDayOrder().filter((d) => byDay.has(d));
  const firstDays = days.slice(0, 6);
  const lastDay = days[6];
  const tips = reusedIngredients(menu.meals);
  const quote = pickFallbackQuote(menu.weekLabel);

  return (
    <Document title="Cookaluna — Menu de la semaine">
      <Page size="A4" style={s.page}>
        <View style={s.header}>
          <View style={s.brandRow}>
            <View style={s.brandGroup}>
              <Sparkle size={16} color={WHITE} />
              <Text style={s.brand}>COOKALUNA</Text>
            </View>
            <View>
              <Text style={s.weekKicker}>Semaine du</Text>
              <Text style={s.weekLabel}>{menu.weekLabel}</Text>
            </View>
          </View>
          <Text style={s.tagline}>On mange quoi cette semaine ?</Text>
        </View>
        <Stripes />

        <View style={s.grid}>
          {firstDays.map((day) => (
            <View key={day} style={s.cellWrap}>
              <DayCard day={day} slots={byDay.get(day)!} />
            </View>
          ))}

          {lastDay && (
            <View style={s.cellWrap}>
              <DayCard day={lastDay} slots={byDay.get(lastDay)!} />
            </View>
          )}

          <View style={s.cellWrapWide}>
            <View style={s.tipsCard}>
              {tips.length > 0 ? (
                <>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                    <Sparkle size={9} color={CORAL} />
                    <Text style={s.tipsTitle}>On réutilise certains ingrédients</Text>
                  </View>
                  <View style={s.tipsRow}>
                    {tips.map((item) => (
                      <Text key={item} style={s.tipsItem}>• {item}</Text>
                    ))}
                  </View>
                  <Text style={s.tipsNote}>
                    Moins de courses, moins de gaspillage, plus de temps pour le reste.
                  </Text>
                </>
              ) : (
                <>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                    <Sparkle size={9} color={CORAL} />
                    <Text style={s.tipsTitle}>Petite pensée du frigo</Text>
                  </View>
                  <Text style={s.quote}>« {quote.text} »</Text>
                  <Text style={s.quoteAuthor}>— {quote.author}</Text>
                </>
              )}
            </View>
          </View>
        </View>

        <Stripes light />
        <View style={s.footer}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
            <Sparkle size={9} color={CORAL} />
            <Text style={s.footerText}>COOKALUNA</Text>
          </View>
          <Text style={s.footerText}>La semaine est servie.</Text>
          <Text style={s.footerText}>À afficher sur le frigo.</Text>
        </View>
      </Page>
    </Document>
  );
}
