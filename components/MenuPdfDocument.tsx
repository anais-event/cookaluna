import {
  Document,
  Page,
  Path,
  StyleSheet,
  Svg,
  Text,
  View,
} from "@react-pdf/renderer";
import { DAY_LABELS, SLOT_LABELS, weekDayOrder } from "@/lib/constants";
import type { DayKey, MealSlot, WeeklyMenuData } from "@/lib/types";

const CORAL = "#FF6B5F";
const CORAL_LIGHT = "#FFE3DE";
const INK = "#111111";
const PAPER = "#FFFDF8";
const WHITE = "#FFFFFF";

const s = StyleSheet.create({
  page: {
    backgroundColor: PAPER,
    fontSize: 11,
    fontFamily: "Helvetica",
    color: INK,
    paddingBottom: 46,
  },
  header: {
    backgroundColor: CORAL,
    paddingHorizontal: 30,
    paddingTop: 24,
    paddingBottom: 20,
    position: "relative",
  },
  kicker: {
    color: WHITE,
    fontFamily: "Helvetica-Bold",
    fontSize: 9,
    letterSpacing: 2.5,
    textTransform: "uppercase",
  },
  brandRow: {
    marginTop: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  brand: { color: WHITE, fontFamily: "Helvetica-Bold", fontSize: 34, letterSpacing: -1 },
  weekPill: {
    backgroundColor: INK,
    color: WHITE,
    fontFamily: "Helvetica-Bold",
    fontSize: 10,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
  },
  stripes: { flexDirection: "row", height: 9, overflow: "hidden" },
  stripe: { width: 9, height: 9 },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 18,
    paddingTop: 16,
  },
  cellWrap: { width: "50%", padding: 6 },
  card: {
    borderWidth: 1.5,
    borderColor: INK,
    borderRadius: 10,
    backgroundColor: WHITE,
    overflow: "hidden",
    minHeight: 92,
  },
  cardHead: {
    backgroundColor: CORAL_LIGHT,
    paddingHorizontal: 12,
    paddingVertical: 6,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dayName: {
    color: INK,
    fontFamily: "Helvetica-Bold",
    fontSize: 13,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  cardBody: { paddingHorizontal: 12, paddingVertical: 8 },
  slotBlock: { marginBottom: 7 },
  slotLabel: {
    color: CORAL,
    fontFamily: "Helvetica-Bold",
    fontSize: 8,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    marginBottom: 2,
  },
  mealName: { fontSize: 11, lineHeight: 1.2 },
  footer: { position: "absolute", bottom: 0, left: 0, right: 0 },
  footerBar: {
    backgroundColor: INK,
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  footerText: {
    color: PAPER,
    fontFamily: "Helvetica-Bold",
    fontSize: 9,
    letterSpacing: 0.5,
  },
});

const SPARKLE_PATH =
  "M12 0 C13 8 16 11 24 12 C16 13 13 16 12 24 C11 16 8 13 0 12 C8 11 11 8 12 0 Z";

function Sparkle({ size = 14, color = WHITE }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d={SPARKLE_PATH} fill={color} />
    </Svg>
  );
}

function Stripes({ light = false }: { light?: boolean }) {
  const cells = Array.from({ length: 70 });
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

export function MenuPdfDocument({ menu }: { menu: WeeklyMenuData }) {
  const byDay = new Map<DayKey, Map<MealSlot, string>>();
  for (const m of menu.meals) {
    if (!byDay.has(m.day)) byDay.set(m.day, new Map());
    byDay.get(m.day)!.set(m.slot, m.name);
  }
  const days = weekDayOrder().filter((d) => byDay.has(d));

  return (
    <Document title="Cookaluna — Menu de la semaine">
      <Page size="A4" style={s.page}>
        <View style={s.header}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            <Sparkle size={12} color={WHITE} />
            <Text style={s.kicker}>On mange quoi cette semaine ?</Text>
          </View>
          <View style={s.brandRow}>
            <Text style={s.brand}>COOKALUNA</Text>
            <Text style={s.weekPill}>{menu.weekLabel}</Text>
          </View>
        </View>
        <Stripes />

        <View style={s.grid}>
          {days.map((day) => {
            const slots = byDay.get(day)!;
            return (
              <View key={day} style={s.cellWrap}>
                <View style={s.card}>
                  <View style={s.cardHead}>
                    <Text style={s.dayName}>{DAY_LABELS[day]}</Text>
                    <Sparkle size={10} color={CORAL} />
                  </View>
                  <View style={s.cardBody}>
                    {(["lunch", "dinner"] as MealSlot[])
                      .filter((sl) => slots.has(sl))
                      .map((sl) => (
                        <View key={sl} style={s.slotBlock}>
                          <Text style={s.slotLabel}>{SLOT_LABELS[sl]}</Text>
                          <Text style={s.mealName}>{slots.get(sl) || "—"}</Text>
                        </View>
                      ))}
                  </View>
                </View>
              </View>
            );
          })}
        </View>

        <View style={s.footer}>
          <Stripes light />
          <View style={s.footerBar}>
            <Sparkle size={9} color={CORAL} />
            <Text style={[s.footerText, { marginHorizontal: 8 }]}>
              Cookaluna · La semaine est servie.
            </Text>
            <Sparkle size={9} color={CORAL} />
          </View>
        </View>
      </Page>
    </Document>
  );
}
