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
import { LineChart, BarChart, ContributionGraph } from "react-native-chart-kit";

// --- 타입, 상수, 데이터 ---
const COLORS = {
  primary: "#3ACCE1",
  text: "#EAEAEA",
  subText: "#BDBDBD",
  background: "#10141C",
  card: "#161B22",
  gridLine: "rgba(255, 255, 255, 0.1)",
  normal: "rgba(58, 204, 225, 0.1)",
  caution: "rgba(255, 184, 107, 0.1)",
  danger: "rgba(255, 112, 141, 0.1)",
};
type Period = "일" | "주" | "월";

const DAILY_DATA = {
  timeline: Array.from({ length: 96 }, () => 95 + Math.random() * 5),
  summary: { avg: 97.5, low: 94, dips: 3 },
  log: Array.from({ length: 15 }, (_, i) => ({
    time: `0${Math.floor(i / 3) + 2}:${String((i * 15) % 60).padStart(2, "0")}`,
    value: (96 + Math.random() * 3).toFixed(1),
  })),
};
const WEEKLY_DATA = {
  dailyAvg: [97.5, 98.1, 96.9, 97.2, 98.0, 97.7, 97.4],
  totalDips: 15,
  avg: 97.5,
};
const MONTHLY_DATA = {
  heatmapData: Array.from({ length: 31 }, (_, i) => ({
    date: `2025-08-${String(i + 1).padStart(2, "0")}`,
    count: Math.floor(95 + Math.random() * 5),
  })),
  weeklyTrend: [97.5, 97.2, 96.8, 97.8],
  highestAvg: 98.2,
  lowestAvg: 96.5,
};
const chartConfig = (color = COLORS.primary) => ({
  backgroundColor: COLORS.card,
  backgroundGradientFrom: COLORS.card,
  backgroundGradientTo: COLORS.card,
  decimalPlaces: 1,
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

// --- 탭별 뷰 컴포넌트 ---
const DailyView = () => (
  <>
    <View style={styles.summaryGrid}>
      <View style={styles.summaryItem}>
        <Text style={styles.summaryLabel}>수면 중 평균</Text>
        <Text style={styles.summaryValue}>
          {DAILY_DATA.summary.avg.toFixed(1)}
          <Text style={styles.summaryUnit}>%</Text>
        </Text>
      </View>
      <View style={styles.summaryItem}>
        <Text style={styles.summaryLabel}>최저</Text>
        <Text style={styles.summaryValue}>
          {DAILY_DATA.summary.low}
          <Text style={styles.summaryUnit}>%</Text>
        </Text>
      </View>
      <View style={styles.summaryItem}>
        <Text style={styles.summaryLabel}>저하 횟수</Text>
        <Text style={styles.summaryValue}>
          {DAILY_DATA.summary.dips}
          <Text style={styles.summaryUnit}>회</Text>
        </Text>
      </View>
    </View>
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>수면 중 SpO2 타임라인</Text>
      <View>
        <LineChart
          data={{
            labels: ["23:00", "01:00", "03:00", "05:00", "07:00"],
            datasets: [{ data: DAILY_DATA.timeline, strokeWidth: 2.5 }],
          }}
          width={Dimensions.get("window").width - 48}
          height={220}
          chartConfig={chartConfig()}
          bezier
          withHorizontalLabels={false}
        />
        <View style={StyleSheet.absoluteFill}>
          <View style={{ flex: 1, backgroundColor: COLORS.normal }} />
          <View style={{ flex: 0.2, backgroundColor: COLORS.caution }} />
          <View style={{ flex: 0.1, backgroundColor: COLORS.danger }} />
        </View>
      </View>
    </View>
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>측정 기록 로그</Text>
      {DAILY_DATA.log.map((item) => (
        <View key={item.time} style={styles.logRow}>
          <Text style={styles.logTime}>{item.time}</Text>
          <Text style={styles.logValue}>{item.value}%</Text>
        </View>
      ))}
    </View>
  </>
);

const WeeklyView = () => (
  <>
    <View style={styles.summaryGrid}>
      <View style={styles.summaryItem}>
        <Text style={styles.summaryLabel}>주간 평균</Text>
        <Text style={styles.summaryValueLg}>
          {WEEKLY_DATA.avg.toFixed(1)}
          <Text style={styles.summaryUnit}>%</Text>
        </Text>
      </View>
      <View style={styles.summaryItem}>
        <Text style={styles.summaryLabel}>총 저하 횟수</Text>
        <Text style={styles.summaryValueLg}>
          {WEEKLY_DATA.totalDips}
          <Text style={styles.summaryUnit}>회</Text>
        </Text>
      </View>
    </View>
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>야간 평균 SpO2</Text>
      <BarChart
        data={{
          labels: ["월", "화", "수", "목", "금", "토", "일"],
          datasets: [{ data: WEEKLY_DATA.dailyAvg }],
        }}
        width={Dimensions.get("window").width - 48}
        height={220}
        fromZero={false}
        yAxisSuffix="%"
        yAxisLabel="" // [수정] 필수 속성 추가
        chartConfig={chartConfig()}
      />
    </View>
  </>
);

const MonthlyView = () => (
  <>
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>월간 SpO2 히트맵</Text>
      <ContributionGraph
        values={MONTHLY_DATA.heatmapData}
        endDate={new Date("2025-08-31")}
        numDays={31}
        width={Dimensions.get("window").width - 48}
        height={220}
        chartConfig={{
          ...chartConfig(),
          color: (opacity = 1) => `rgba(58, 204, 225, ${opacity})`,
        }}
        tooltipDataAttrs={() => ({})} // [수정] 필수 속성 추가
      />
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
    <View style={styles.summaryGrid}>
      <View style={styles.summaryItem}>
        <Text style={styles.summaryLabel}>월간 최고 평균</Text>
        <Text style={styles.summaryValue}>
          {MONTHLY_DATA.highestAvg.toFixed(1)}
          <Text style={styles.summaryUnit}>%</Text>
        </Text>
      </View>
      <View style={styles.summaryItem}>
        <Text style={styles.summaryLabel}>월간 최저 평균</Text>
        <Text style={styles.summaryValue}>
          {MONTHLY_DATA.lowestAvg.toFixed(1)}
          <Text style={styles.summaryUnit}>%</Text>
        </Text>
      </View>
    </View>
  </>
);

// --- 메인 컴포넌트 ---
export default function Spo2DetailsScreen() {
  const [period, setPeriod] = useState<Period>("일");
  return (
    <LinearGradient
      colors={[COLORS.background, "#0A0A0A"]}
      style={styles.container}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <DetailScreenHeader title="SpO2 분석" />
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
    marginBottom: 24,
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
    marginBottom: 24,
  },
  summaryItem: {
    flex: 1,
    minWidth: "33%",
    alignItems: "center",
    paddingVertical: 16,
  },
  summaryValue: { color: "white", fontSize: 28, fontWeight: "bold" },
  summaryValueLg: { color: "white", fontSize: 32, fontWeight: "bold" },
  summaryLabel: { color: COLORS.subText, fontSize: 14, marginTop: 4 },
  summaryUnit: { fontSize: 18, color: COLORS.subText },
  logRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gridLine,
  },
  logTime: { color: COLORS.subText, fontFamily: "SpaceMono", fontSize: 15 },
  logValue: {
    color: COLORS.text,
    fontFamily: "SpaceMono",
    fontSize: 15,
    fontWeight: "600",
  },
});
