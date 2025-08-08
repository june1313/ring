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
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { LineChart, BarChart } from "react-native-chart-kit";

const COLORS = {
  primary: "#48C9B0",
  text: "#EAEAEA",
  subText: "#BDBDBD",
  background: "#10141C",
  card: "#161B22",
  gridLine: "rgba(255, 255, 255, 0.1)",
};
type Period = "일" | "주" | "월";

const DAILY_DATA = {
  timeline: Array.from({ length: 96 }, () => 50 + Math.random() * 25),
  summary: { avg: 62, high: 78, balance: "균형 잡힘" },
};
const WEEKLY_DATA = { dailyAvg: [62, 58, 65, 61, 55, 68, 70], avg: 62.7 };
const MONTHLY_DATA = { weeklyTrend: [60, 62.7, 59, 65], avg: 61.7 };
const chartConfig = (color = COLORS.primary) => ({
  backgroundColor: COLORS.card,
  backgroundGradientFrom: COLORS.card,
  backgroundGradientTo: COLORS.card,
  decimalPlaces: 0,
  color: (opacity = 1) => color,
  labelColor: (opacity = 1) => `rgba(234, 234, 234, ${opacity})`,
  propsForBackgroundLines: { stroke: COLORS.gridLine },
});

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

const DailyView = () => (
  <>
    <View style={styles.mainValueContainer}>
      <Text style={styles.mainValue}>{DAILY_DATA.summary.avg}</Text>
      <Text style={styles.mainUnit}>ms</Text>
    </View>
    <Text style={styles.subText}>수면 중 평균</Text>
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>야간 HRV 타임라인</Text>
      <LineChart
        data={{
          labels: ["23:00", "01:00", "03:00", "05:00", "07:00"],
          datasets: [{ data: DAILY_DATA.timeline, strokeWidth: 2 }],
        }}
        width={Dimensions.get("window").width - 48}
        height={200}
        chartConfig={chartConfig()}
        bezier
        withHorizontalLabels={false}
      />
    </View>
    <View style={styles.summaryGrid}>
      <View style={styles.summaryItem}>
        <Text style={styles.summaryLabel}>최고</Text>
        <Text style={styles.summaryValue}>{DAILY_DATA.summary.high}</Text>
      </View>
      <View style={styles.summaryItem}>
        <Text style={styles.summaryLabel}>HRV 균형</Text>
        <Text style={styles.summaryValue}>{DAILY_DATA.summary.balance}</Text>
      </View>
    </View>
  </>
);
const WeeklyView = () => (
  <>
    <View style={styles.mainValueContainer}>
      <Text style={styles.mainValue}>{WEEKLY_DATA.avg.toFixed(1)}</Text>
      <Text style={styles.mainUnit}>ms (주간 평균)</Text>
    </View>
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>일일 평균 HRV</Text>
      <BarChart
        data={{
          labels: ["월", "화", "수", "목", "금", "토", "일"],
          datasets: [{ data: WEEKLY_DATA.dailyAvg }],
        }}
        width={Dimensions.get("window").width - 48}
        height={220}
        fromZero={false}
        yAxisSuffix="ms"
        chartConfig={chartConfig()}
      />
    </View>
  </>
);
const MonthlyView = () => (
  <>
    <View style={styles.mainValueContainer}>
      <Text style={styles.mainValue}>{MONTHLY_DATA.avg.toFixed(1)}</Text>
      <Text style={styles.mainUnit}>ms (월간 평균)</Text>
    </View>
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>주간별 평균 트렌드</Text>
      <LineChart
        data={{
          labels: ["1주차", "2주차", "3주차", "4주차"],
          datasets: [{ data: MONTHLY_DATA.weeklyTrend }],
        }}
        width={Dimensions.get("window").width - 48}
        height={220}
        fromZero={false}
        chartConfig={chartConfig()}
        bezier
      />
    </View>
  </>
);

export default function HrvDetailsScreen() {
  const [period, setPeriod] = useState<Period>("일");
  return (
    <LinearGradient
      colors={[COLORS.background, "#0A0A0A"]}
      style={styles.container}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <DetailScreenHeader title="HRV 분석" />
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
  scrollContent: { padding: 16, paddingBottom: 100, alignItems: "center" },
  toggleContainer: {
    flexDirection: "row",
    backgroundColor: COLORS.card,
    borderRadius: 20,
    padding: 4,
  },
  toggleButton: { paddingVertical: 8, paddingHorizontal: 24, borderRadius: 16 },
  activeToggleButton: { backgroundColor: COLORS.primary },
  toggleText: { color: COLORS.subText, fontSize: 16, fontWeight: "bold" },
  activeToggleText: { color: "white" },
  mainValueContainer: { alignItems: "center", marginVertical: 24 },
  mainValue: { fontSize: 64, color: "white", fontWeight: "bold" },
  mainUnit: { fontSize: 18, color: COLORS.subText, marginTop: 4 },
  subText: {
    fontSize: 16,
    color: COLORS.subText,
    marginTop: -20,
    marginBottom: 24,
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 24,
    padding: 12,
    marginBottom: 16,
    width: "100%",
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
    width: "100%",
    justifyContent: "space-around",
    backgroundColor: COLORS.card,
    borderRadius: 24,
    padding: 16,
  },
  summaryItem: { alignItems: "center", flex: 1 },
  summaryValue: { color: "white", fontSize: 28, fontWeight: "bold" },
  summaryLabel: { color: COLORS.subText, fontSize: 14, marginTop: 4 },
});
