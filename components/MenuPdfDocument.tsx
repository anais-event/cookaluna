import {
  Document,
  Page,
  Path,
  StyleSheet,
  Svg,
  Text,
  View,
} from "@react-pdf/renderer";
import { DAY_LABELS, DIFFICULTY_LABELS, SLOT_LABELS } from "@/lib/constants";
import {
  SHEET_CELLS,
  SHEET_TOKENS,
  groupMealsByDay,
  reusedIngredients,
  type SlotsByDay,
} from "@/lib/menuSheet";
import type { DayKey, MealSlot, MenuMeal, WeeklyMenuData } from "@/lib/types";

const { coral: CORAL, coralLight: CORAL_LIGHT, ink: INK, paper: PAPER, white: WHITE } =
  SHEET_TOKENS;

// Dimensions A4 en points PDF (72 pt / pouce).
// 210 mm x 297 mm = 595.28 x 841.89 pt.
// Le document est concu pour tenir sur UNE seule page, sans marge sortante,
// avec des hauteurs fixes qui somment strictement a la hauteur A4.
const A4_W = 595.28;
const A4_H = 841.89;
const HEADER_H = 138;
const STRIPES_H = 6;
const FOOTER_H = 30;
const GRID_H = A4_H - HEADER_H - STRIPES_H * 2 - FOOTER_H; // ~ 661.89 pt

const GRID_PAD = 14;
const CELL_GAP = 8;

const s = StyleSheet.create({
  page: {
    backgroundColor: PAPER,
    fontFamily: "Helvetica",
    color: INK,
    fontSize: 10,
  },
  header: {
    height: HEADER_H,
    backgroundColor: CORAL,
    paddingHorizontal: 28,
    paddingTop: 22,
    paddingBottom: 18,
    justifyContent: "space-between",
  },
  brandRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  brandGroup: { flexDirection: "row", alignItems: "center", gap: 8 },
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
    fontSize: 26,
    lineHeight: 1.1,
    maxWidth: "78%",
  },
  stripes: { flexDirection: "row", height: STRIPES_H, overflow: "hidden" },
  stripe: { flex: 1, height: STRIPES_H },
  grid: {
    height: GRID_H,
    padding: GRID_PAD,
    flexDirection: "column",
  },
  row: {
    flex: 1,
    flexDirection: "row",
    marginBottom: CELL_GAP,
  },
  rowLast: { marginBottom: 0 },
  cell: {
    flex: 1,
    marginRight: CELL_GAP,
  },
  cellLast: { marginRight: 0 },
  card: {
    flex: 1,
    borderWidth: 1.4,
    borderColor: INK,
    borderRadius: 10,
    backgroundColor: WHITE,
    overflow: "hidden",
  },
  cardHead: {
    backgroundColor: CORAL_LIGHT,
    paddingHorizontal: 10,
    paddingVertical: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: INK,
  },
  dayName: {
    color: INK,
    fontFamily: "Helvetica",
    fontWeight: "bold",
    fontSize: 11.5,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  cardBody: {
    paddingHorizontal: 9,
    paddingVertical: 8,
    flex: 1,
    justifyContent: "space-around",
  },
  meal: {},
  slotRow: { flexDirection: "row", alignItems: "center", gap: 4 },
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
    fontSize: 9,
    lineHeight: 1.22,
    marginTop: 2,
  },
  mealMeta: {
    fontSize: 7.5,
    color: SHEET_TOKENS.mutedInk,
    marginTop: 2,
  },
  notesCard: {
    flex: 1,
    borderWidth: 1.4,
    borderStyle: "dashed",
    borderColor: CORAL,
    borderRadius: 10,
    backgroundColor: CORAL_LIGHT,
    padding: 10,
  },
  notesTitle: {
    color: CORAL,
    fontFamily: "Helvetica",
    fontWeight: "bold",
    fontSize: 8,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  notesSubtitle: {
    marginTop: 4,
    fontSize: 8,
    color: SHEET_TOKENS.mutedInk,
    fontStyle: "italic",
  },
  notesLines: {
    marginTop: 8,
    flex: 1,
    justifyContent: "space-between",
    paddingBottom: 4,
  },
  notesLine: {
    borderBottomWidth: 0.8,
    borderBottomColor: "rgba(255,107,95,0.55)",
    borderBottomStyle: "solid",
    height: 14,
  },
  reuseRow: {
    marginTop: 6,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  reuseItem: {
    fontFamily: "Helvetica",
    fontWeight: "bold",
    fontSize: 8.5,
  },
  decorCard: {
    flex: 1,
    borderWidth: 1.4,
    borderColor: INK,
    borderRadius: 10,
    backgroundColor: PAPER,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  decorTitle: {
    fontFamily: "Helvetica",
    fontWeight: "bold",
    fontSize: 9,
    color: CORAL,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  decorQuote: {
    fontFamily: "Helvetica",
    fontStyle: "italic",
    fontSize: 10,
    marginTop: 8,
    textAlign: "center",
    lineHeight: 1.3,
  },
  decorAuthor: {
    fontSize: 8,
    color: SHEET_TOKENS.mutedInk,
    marginTop: 6,
  },
  footer: {
    height: FOOTER_H,
    backgroundColor: INK,
    paddingHorizontal: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  footerText: {
    color: PAPER,
    fontFamily: "Helvetica",
    fontWeight: "bold",
    fontSize: 8,
    letterSpacing: 0.5,
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
  const cells = Array.from({ length: 60 });
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

function truncate(str: string, max: number) {
  if (str.length <= max) return str;
  return str.slice(0, max - 1).trimEnd() + "…";
}

function DayCard({ day, slots }: { day: DayKey; slots?: Map<MealSlot, MenuMeal> }) {
  const lunch = slots?.get("lunch");
  const dinner = slots?.get("dinner");
  return (
    <View style={s.card}>
      <View style={s.cardHead}>
        <Text style={s.dayName}>{DAY_LABELS[day]}</Text>
        <Sparkle size={8} color={CORAL} />
      </View>
      <View style={s.cardBody}>
        {(["lunch", "dinner"] as MealSlot[]).map((sl) => {
          const meal = sl === "lunch" ? lunch : dinner;
          return (
            <View key={sl} style={s.meal}>
              <View style={s.slotRow}>
                <SlotIcon slot={sl} />
                <Text style={s.slotLabel}>{SLOT_LABELS[sl]}</Text>
              </View>
              <Text style={s.mealName}>{meal ? truncate(meal.name || "—", 90) : "—"}</Text>
              {meal && (meal.prepTime > 0 || meal.difficulty) && (
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

function NotesCard({ reused }: { reused: string[] }) {
  return (
    <View style={s.notesCard}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
        <Sparkle size={9} color={CORAL} />
        <Text style={s.notesTitle}>Pense-bete du frigo</Text>
      </View>
      {reused.length > 0 ? (
        <>
          <Text style={s.notesSubtitle}>Ingredients qui reviennent cette semaine</Text>
          <View style={s.reuseRow}>
            {reused.map((item) => (
              <Text key={item} style={s.reuseItem}>
                {"• " + item}
              </Text>
            ))}
          </View>
          <Text style={s.notesSubtitle}>A racheter ou noter ci-dessous :</Text>
        </>
      ) : (
        <Text style={s.notesSubtitle}>Courses, envies, restes a finir...</Text>
      )}
      <View style={s.notesLines}>
        {Array.from({ length: 4 }).map((_, i) => (
          <View key={i} style={s.notesLine} />
        ))}
      </View>
    </View>
  );
}

const DECOR_QUOTES = [
  { text: "La vie est un repas partage.", author: "Proverbe" },
  { text: "Le bonheur, c'est du temps, pas de la vaisselle.", author: "Cookaluna" },
  { text: "Moins de charge mentale, plus de place a table.", author: "Cookaluna" },
  { text: "Un bon repas efface une mauvaise journee.", author: "Proverbe" },
];

function pickQuote(seed: string) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return DECOR_QUOTES[h % DECOR_QUOTES.length];
}

function DecorCard({ seed }: { seed: string }) {
  const q = pickQuote(seed);
  return (
    <View style={s.decorCard}>
      <Sparkle size={16} color={CORAL} />
      <Text style={s.decorTitle}>{"« On respire »"}</Text>
      <Text style={s.decorQuote}>{"« " + q.text + " »"}</Text>
      <Text style={s.decorAuthor}>{"— " + q.author}</Text>
    </View>
  );
}

function GridCell({
  cellIndex,
  byDay,
  reused,
  seed,
}: {
  cellIndex: number;
  byDay: SlotsByDay;
  reused: string[];
  seed: string;
}) {
  const cell = SHEET_CELLS[cellIndex];
  if (cell.kind === "day")
    return <DayCard day={cell.day} slots={byDay.get(cell.day)} />;
  if (cell.kind === "notes") return <NotesCard reused={reused} />;
  return <DecorCard seed={seed} />;
}

export function MenuPdfDocument({ menu }: { menu: WeeklyMenuData }) {
  const byDay = groupMealsByDay(menu.meals);
  const reused = reusedIngredients(menu.meals);

  return (
    <Document title="Cookaluna - Menu de la semaine">
      <Page size="A4" style={s.page}>
        {/* Header */}
        <View style={s.header}>
          <View style={s.brandRow}>
            <View style={s.brandGroup}>
              <Sparkle size={18} color={WHITE} />
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

        {/* Grille 3x3 fixe */}
        <View style={s.grid}>
          {[0, 1, 2].map((r) => (
            <View key={r} style={[s.row, r === 2 ? s.rowLast : {}]}>
              {[0, 1, 2].map((c) => {
                const i = r * 3 + c;
                return (
                  <View key={c} style={[s.cell, c === 2 ? s.cellLast : {}]}>
                    <GridCell
                      cellIndex={i}
                      byDay={byDay}
                      reused={reused}
                      seed={menu.weekLabel}
                    />
                  </View>
                );
              })}
            </View>
          ))}
        </View>

        <Stripes light />

        {/* Footer */}
        <View style={s.footer}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
            <Sparkle size={9} color={CORAL} />
            <Text style={s.footerText}>COOKALUNA</Text>
          </View>
          <Text style={s.footerText}>La semaine est servie.</Text>
          <Text style={s.footerText}>A afficher sur le frigo.</Text>
        </View>
      </Page>
    </Document>
  );
}
