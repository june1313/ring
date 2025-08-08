import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather, FontAwesome5 } from "@expo/vector-icons";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { LineChart } from "react-native-chart-kit";
import {
  Canvas,
  Path,
  Skia,
  Text as SkiaText,
  useFont,
  Line,
  Circle,
} from "@shopify/react-native-skia";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { useSharedValue, runOnJS } from "react-native-reanimated";

// --- 타입 및 상수 ---
const COLORS = {
  primary: "#FF708D",
  text: "#EAEAEA",
  subText: "#BDBDBD",
  background: "#10141C",
  card: "#161B22",
  gridLine: "rgba(255, 255, 255, 0.1)",
};
type Period = "일" | "주" | "월";
type HrTimelinePoint = { time: string; hr: number; event: "workout" | null };

// --- 데이터 ---
const DAILY_DATA = {
  timeline: Array.from({ length: 288 }, (_, i) => ({
    time: `${String(Math.floor((i * 5) / 60)).padStart(2, "0")}:${String(
      (i * 5) % 60
    ).padStart(2, "0")}`,
    hr: 60 + Math.random() * 15 + (i > 180 && i < 204 ? Math.random() * 50 : 0),
    event: i === 190 ? ("workout" as const) : null,
  })),
  summary: { resting: 58, avg: 72, high: 145, low: 55, hrv: 58 },
  zones: [
    { label: "고강도", time: "0h 45m", color: "#E74C3C" },
    { label: "활동", time: "3h 15m", color: "#F39C12" },
    { label: "안정", time: "20h 00m", color: "#5DADE2" },
  ],
};
const WEEKLY_DATA = { rhrTrend: [58, 59, 57, 58, 56, 57, 55], avgRhr: 57 };
const MONTHLY_DATA = { rhrTrend: [59, 57, 58, 56], avgRhr: 57.5 };
const chartConfig = {
  backgroundColor: COLORS.card,
  backgroundGradientFrom: COLORS.card,
  backgroundGradientTo: COLORS.card,
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(255, 112, 141, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(234, 234, 234, ${opacity})`,
  propsForBackgroundLines: { stroke: COLORS.gridLine },
};

// --- 재사용 컴포넌트 ---
const DetailScreenHeader = ({ title }: { title: string }) => (
  <View style={styles.header}>
    <TouchableOpacity onPress={() => router.back()}>
      <Feather name="chevron-left" size={28} color={COLORS.text} />
    </TouchableOpacity>
    <Text style={styles.headerTitle}>{title}</Text>
    <TouchableOpacity>
      <Feather name="help-circle" size={24} color={COLORS.text} />
    </TouchableOpacity>
  </View>
);
const PeriodToggle = ({
  period,
  setPeriod,
}: {
  period: Period;
  setPeriod: (p: Period) => void;
}) => (
  <View style={styles.toggleContainer}>
    {(["일", "주", "월"] as Period[]).map((p) => (
      <TouchableOpacity
        key={p}
        style={[styles.toggleButton, period === p && styles.activeToggleButton]}
        onPress={() => setPeriod(p)}
      >
        <Text
          style={[styles.toggleText, period === p && styles.activeToggleText]}
        >
          {p}
        </Text>
      </TouchableOpacity>
    ))}
  </View>
);

// --- 인터랙티브 차트 컴포넌트 ---
const InteractiveHRChart = ({
  timeline,
  onScrub,
}: {
  timeline: HrTimelinePoint[];
  onScrub: (data: HrTimelinePoint | null) => void;
}) => {
  const { width } = useWindowDimensions();
  const chartWidth = width - 48;
  const chartHeight = 150;
  const font = useFont(require("@/assets/fonts/SpaceMono-Regular.ttf"), 12);
  const activeX = useSharedValue(-1);

  const pan = Gesture.Pan()
    .onUpdate((event) => {
      if (event.x >= 0 && event.x <= chartWidth) {
        activeX.value = event.x;
        const index = Math.min(
          timeline.length - 1,
          Math.max(0, Math.floor((event.x / chartWidth) * timeline.length))
        );
        runOnJS(onScrub)(timeline[index]);
      }
    })
    .onEnd(() => {
      activeX.value = -1;
      runOnJS(onScrub)(null);
    });

  if (!timeline || timeline.length === 0) return null;

  const hrValues = timeline.map((p) => p.hr);
  const minHr = Math.min(...hrValues);
  const maxHr = Math.max(...hrValues);
  const hrPath = Skia.Path.Make();
  timeline.forEach((p, i) => {
    const x = (i / (timeline.length - 1)) * chartWidth;
    const y = (1 - (p.hr - minHr) / (maxHr - minHr)) * chartHeight;
    if (i === 0) hrPath.moveTo(x, y);
    else hrPath.lineTo(x, y);
  });

  return (
    <GestureDetector gesture={pan}>
      <Canvas style={{ width: chartWidth, height: chartHeight }}>
        <Path
          path={hrPath}
          style="stroke"
          strokeWidth={2.5}
          color={COLORS.primary}
        />
        {timeline.map((p, i) => {
          if (p.event === "workout") {
            const x = (i / (timeline.length - 1)) * chartWidth;
            return (
              <Circle
                key={i}
                cx={x}
                cy={(1 - (p.hr - minHr) / (maxHr - minHr)) * chartHeight}
                r={5}
                color="#FFB86B"
              />
            );
          }
          return null;
        })}
        {font && activeX.value > 0 && (
          <>
            <Line
              p1={{ x: activeX.value, y: 0 }}
              p2={{ x: activeX.value, y: chartHeight }}
              color="rgba(255,255,255,0.5)"
              strokeWidth={1}
            />
            <SkiaText
              x={
                activeX.value > chartWidth - 50
                  ? activeX.value - 45
                  : activeX.value + 5
              }
              y={15}
              text={`${Math.round(
                timeline[
                  Math.floor((activeX.value / chartWidth) * timeline.length)
                ].hr
              )}bpm`}
              font={font}
              color={COLORS.primary}
            />
            <SkiaText
              x={
                activeX.value > chartWidth - 50
                  ? activeX.value - 45
                  : activeX.value + 5
              }
              y={30}
              text={`${
                timeline[
                  Math.floor((activeX.value / chartWidth) * timeline.length)
                ].time
              }`}
              font={font}
              color={COLORS.subText}
            />
          </>
        )}
      </Canvas>
    </GestureDetector>
  );
};

// --- 각 탭별 뷰 컴포넌트 ---
const DailyView = () => {
  const [scrubData, setScrubData] = useState<HrTimelinePoint | null>(null);
  return (
    <>
      <View style={styles.scrubInfoContainer}>
        <Text style={styles.scrubTime}>
          {scrubData ? scrubData.time : "24시간 그래프를 탐색해보세요"}
        </Text>
        {scrubData && (
          <Text style={styles.scrubValue}>
            {scrubData.hr.toFixed(0)}{" "}
            <Text style={styles.summaryUnit}>bpm</Text>
          </Text>
        )}
      </View>
      <View style={styles.card}>
        <InteractiveHRChart
          timeline={DAILY_DATA.timeline}
          onScrub={setScrubData}
        />
        <View style={styles.chartEventLegend}>
          <FontAwesome5 name="running" size={12} color="#FFB86B" />
          <Text style={styles.legendText}>운동 감지</Text>
        </View>
      </View>
      <View style={styles.summaryGrid}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>안정(RHR)</Text>
          <Text style={styles.summaryValue}>
            {DAILY_DATA.summary.resting}{" "}
            <Text style={styles.summaryUnit}>bpm</Text>
          </Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>평균</Text>
          <Text style={styles.summaryValue}>
            {DAILY_DATA.summary.avg} <Text style={styles.summaryUnit}>bpm</Text>
          </Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>최고/최저</Text>
          <Text style={styles.summaryValue}>
            {DAILY_DATA.summary.high}/{DAILY_DATA.summary.low}
          </Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>일일 HRV</Text>
          <Text style={styles.summaryValue}>
            {DAILY_DATA.summary.hrv} <Text style={styles.summaryUnit}>ms</Text>
          </Text>
        </View>
      </View>
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>심박수 구간</Text>
        {DAILY_DATA.zones.map((zone) => (
          <View key={zone.label} style={styles.zoneRow}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View
                style={[styles.legendDot, { backgroundColor: zone.color }]}
              />
              <Text style={styles.zoneLabel}>{zone.label}</Text>
            </View>
            <Text style={styles.zoneValue}>{zone.time}</Text>
          </View>
        ))}
      </View>
    </>
  );
};

const WeeklyView = () => (
  <>
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>주간 안정 시 심박수(RHR) 트렌드</Text>
      <LineChart
        data={{
          labels: ["월", "화", "수", "목", "금", "토", "일"],
          datasets: [{ data: WEEKLY_DATA.rhrTrend }],
        }}
        width={Dimensions.get("window").width - 48}
        height={220}
        fromZero={false}
        chartConfig={chartConfig}
        bezier
      />
    </View>
    <View style={styles.summaryGrid}>
      <View style={styles.summaryItem}>
        <Text style={styles.summaryLabel}>주간 평균 RHR</Text>
        <Text style={styles.summaryValueLg}>
          {WEEKLY_DATA.avgRhr} <Text style={styles.summaryUnit}>bpm</Text>
        </Text>
      </View>
      <View style={styles.summaryItem}>
        <Text style={styles.summaryLabel}>최저 RHR</Text>
        <Text style={styles.summaryValueLg}>
          {Math.min(...WEEKLY_DATA.rhrTrend)}{" "}
          <Text style={styles.summaryUnit}>bpm</Text>
        </Text>
      </View>
    </View>
  </>
);

const MonthlyView = () => (
  <>
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>월간 안정 시 심박수(RHR) 트렌드</Text>
      <LineChart
        data={{
          labels: ["1주차", "2주차", "3주차", "4주차"],
          datasets: [{ data: MONTHLY_DATA.rhrTrend }],
        }}
        width={Dimensions.get("window").width - 48}
        height={220}
        fromZero={false}
        chartConfig={chartConfig}
        bezier
      />
    </View>
    <View style={styles.summaryGrid}>
      <View style={styles.summaryItem}>
        <Text style={styles.summaryLabel}>월간 평균 RHR</Text>
        <Text style={styles.summaryValueLg}>
          {MONTHLY_DATA.avgRhr} <Text style={styles.summaryUnit}>bpm</Text>
        </Text>
      </View>
      <View style={styles.summaryItem}>
        <Text style={styles.summaryLabel}>최저 RHR</Text>
        <Text style={styles.summaryValueLg}>
          {Math.min(...MONTHLY_DATA.rhrTrend)}{" "}
          <Text style={styles.summaryUnit}>bpm</Text>
        </Text>
      </View>
    </View>
  </>
);

// --- 메인 컴포넌트 ---
export default function HrDetailsScreen() {
  const [period, setPeriod] = useState<Period>("일");
  return (
    <LinearGradient
      colors={[COLORS.background, "#0A0A0A"]}
      style={styles.container}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <DetailScreenHeader title="심박수 분석" />
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <PeriodToggle period={period} setPeriod={setPeriod} />
          {period === "일" && <DailyView />}
          {period === "주" && <WeeklyView />}
          {period === "월" && <MonthlyView />}
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

// --- 전체 스타일시트 ---
const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: { color: COLORS.text, fontSize: 20, fontWeight: "bold" },
  scrollContent: { padding: 16, paddingBottom: 100 },
  toggleContainer: {
    flexDirection: "row",
    backgroundColor: "#161B22",
    borderRadius: 20,
    alignSelf: "center",
    marginBottom: 24,
  },
  toggleButton: {
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 20,
  },
  activeToggleButton: { backgroundColor: COLORS.primary },
  toggleText: { color: COLORS.subText, fontSize: 16, fontWeight: "bold" },
  activeToggleText: { color: "white" },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 24,
    padding: 12,
    marginBottom: 16,
    alignItems: "center",
  },
  sectionTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    alignSelf: "flex-start",
    paddingHorizontal: 12,
  },
  summaryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    backgroundColor: COLORS.card,
    borderRadius: 24,
    padding: 12,
    marginBottom: 16,
  },
  summaryItem: { width: "50%", alignItems: "center", padding: 16 },
  summaryValue: { color: "white", fontSize: 24, fontWeight: "bold" },
  summaryValueLg: { color: "white", fontSize: 28, fontWeight: "bold" },
  summaryLabel: { color: COLORS.subText, fontSize: 14, marginTop: 4 },
  summaryUnit: { fontSize: 16, color: COLORS.subText },
  zoneRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gridLine,
  },
  zoneLabel: { color: COLORS.text, fontSize: 16 },
  zoneValue: { color: COLORS.text, fontSize: 16, fontWeight: "600" },
  legendDot: { width: 10, height: 10, borderRadius: 5, marginRight: 12 },
  scrubInfoContainer: { alignItems: "center", marginBottom: 16, minHeight: 50 },
  scrubTime: { color: "#BDBDBD", fontSize: 16, fontFamily: "SpaceMono" },
  scrubValue: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 4,
  },
  chartEventLegend: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-end",
    marginTop: 8,
    paddingHorizontal: 12,
    opacity: 0.7,
  },
  legendText: { color: COLORS.subText, fontSize: 12, marginLeft: 6 },
});
