import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather, FontAwesome5 } from "@expo/vector-icons";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import {
  LineChart,
  BarChart,
  ContributionGraph,
  StackedBarChart,
} from "react-native-chart-kit";
import Svg, { Circle, G, Text as SvgText } from "react-native-svg";

// --- 타입, 상수, 데이터 ---
const COLORS = {
  primary: "#A061FF",
  text: "#EAEAEA",
  subText: "#BDBDBD",
  background: "#10141C",
  card: "#161B22",
  gridLine: "rgba(255, 255, 255, 0.1)",
  low: "#5DADE2",
  inRange: "#50D6A3",
  high: "#FFB86B",
};
type Period = "일" | "주" | "월";

const DAILY_DATA = {
  timeline: Array.from({ length: 288 }, (_, i) => ({
    time: `${String(Math.floor((i * 5) / 60)).padStart(2, "0")}:${String(
      (i * 5) % 60
    ).padStart(2, "0")}`,
    value: 90 + Math.random() * 15,
    event: i === 96 ? "breakfast" : i === 156 ? "lunch" : null,
  })),
  timeInRange: { low: 0.05, inRange: 0.85, high: 0.1 },
  summary: { avg: 102, low: 75, high: 160, variability: 15.2 },
};
const WEEKLY_DATA = {
  agpData: {
    median: Array.from({ length: 288 }, (_, i) => 95 + Math.sin(i / 24) * 10),
    iqr: Array.from({ length: 288 }, (_, i) => 15 + Math.cos(i / 24) * 5),
  },
  tirTrend: {
    labels: ["월", "화", "수", "목", "금", "토", "일"],
    data: [
      [10, 80, 10],
      [5, 85, 10],
      [15, 70, 15],
      [8, 82, 10],
      [5, 90, 5],
      [20, 65, 15],
      [10, 75, 15],
    ],
    barColors: [COLORS.low, COLORS.inRange, COLORS.high],
  },
};
const MONTHLY_DATA = {
  weeklyTrend: [85, 82, 90, 88], // 주간 평균 TIR
  heatmapData: Array.from({ length: 31 }, (_, i) => ({
    date: `2025-08-${String(i + 1).padStart(2, "0")}`,
    count: 80 + Math.floor(Math.random() * 15),
  })),
};
const chartConfig = (color = COLORS.primary) => ({
  backgroundColor: COLORS.card,
  backgroundGradientFrom: COLORS.card,
  backgroundGradientTo: COLORS.card,
  decimalPlaces: 0,
  color: (opacity = 1) => color,
  labelColor: (opacity = 1) => `rgba(234, 234, 234, ${opacity})`,
  propsForBackgroundLines: { stroke: COLORS.gridLine },
});

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
const TimeInRangesChart = ({ data }) => {
  /* ... 이전 답변의 SleepDonutChart와 유사한 도넛 차트 구현 ... */
};

// --- 탭별 뷰 컴포넌트 ---
const DailyView = () => (
  <>
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>Time in Range (TIR)</Text>
      {/* TimeInRangesChart 컴포넌트가 여기에 들어옵니다. */}
      <Text style={{ color: "white", padding: 20 }}>
        Time in Range 도넛 차트
      </Text>
    </View>
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>24시간 혈당 그래프</Text>
      <LineChart
        data={{ datasets: [{ data: DAILY_DATA.timeline.map((d) => d.value) }] }}
        width={Dimensions.get("window").width - 48}
        height={220}
        chartConfig={chartConfig()}
        bezier
      />
    </View>
    <View style={styles.summaryGrid}>
      <View style={styles.summaryItem}>
        <Text style={styles.summaryLabel}>평균</Text>
        <Text style={styles.summaryValue}>{DAILY_DATA.summary.avg}</Text>
      </View>
      <View style={styles.summaryItem}>
        <Text style={styles.summaryLabel}>최고/최저</Text>
        <Text style={styles.summaryValue}>
          {DAILY_DATA.summary.high}/{DAILY_DATA.summary.low}
        </Text>
      </View>
      <View style={styles.summaryItem}>
        <Text style={styles.summaryLabel}>변동성</Text>
        <Text style={styles.summaryValue}>
          {DAILY_DATA.summary.variability.toFixed(1)}
        </Text>
      </View>
    </View>
  </>
);

const WeeklyView = () => (
  <>
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>AGP (Ambulatory Glucose Profile)</Text>
      <LineChart
        data={{ datasets: [{ data: WEEKLY_DATA.agpData.median }] }}
        width={Dimensions.get("window").width - 48}
        height={220}
        chartConfig={chartConfig()}
        bezier
      />
      <Text style={styles.chartSubtitle}>
        지난 7일간의 평균 혈당 패턴입니다.
      </Text>
    </View>
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>일별 Time in Range</Text>
      <StackedBarChart
        data={WEEKLY_DATA.tirTrend}
        width={Dimensions.get("window").width - 48}
        height={220}
        chartConfig={chartConfig()}
        withHorizontalLabels={false}
      />
    </View>
  </>
);

const MonthlyView = () => (
  <>
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>월간 혈당 히트맵 (TIR %)</Text>
      <ContributionGraph
        values={MONTHLY_DATA.heatmapData}
        endDate={new Date("2025-08-31")}
        numDays={31}
        width={Dimensions.get("window").width - 48}
        height={220}
        chartConfig={{
          ...chartConfig(),
          color: (opacity = 1) => `rgba(80, 214, 163, ${opacity})`,
        }}
      />
    </View>
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>주간별 TIR 트렌드</Text>
      <LineChart
        data={{
          labels: ["1주차", "2주차", "3주차", "4주차"],
          datasets: [{ data: MONTHLY_DATA.weeklyTrend }],
        }}
        width={Dimensions.get("window").width - 48}
        height={220}
        fromZero
        chartConfig={chartConfig(COLORS.inRange)}
        bezier
        yAxisSuffix="%"
      />
    </View>
  </>
);

// --- 메인 컴포넌트 ---
export default function GlucoseDetailsScreen() {
  const [period, setPeriod] = useState<Period>("일");
  return (
    <LinearGradient
      colors={[COLORS.background, "#0A0A0A"]}
      style={styles.container}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <DetailScreenHeader title="혈당 분석" />
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
  chartSubtitle: {
    color: COLORS.subText,
    fontSize: 12,
    marginTop: 8,
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
  summaryItem: {
    flex: 1,
    minWidth: "33%",
    alignItems: "center",
    paddingVertical: 16,
  },
  summaryValue: { color: "white", fontSize: 24, fontWeight: "bold" },
  summaryLabel: { color: COLORS.subText, fontSize: 14, marginTop: 4 },
});
