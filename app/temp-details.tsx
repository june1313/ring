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
import { LineChart, ContributionGraph } from "react-native-chart-kit";

// --- 타입, 상수, 데이터 ---
const COLORS = {
  primary: "#F39C12",
  text: "#EAEAEA",
  subText: "#BDBDBD",
  background: "#10141C",
  card: "#161B22",
  gridLine: "rgba(255, 255, 255, 0.1)",
};
type Period = "일" | "주" | "월";

const DAILY_DATA = {
  variation: 0.2,
  timeline: Array.from({ length: 96 }, () => Math.random() * 0.5 - 0.25),
};
const WEEKLY_DATA = {
  dailyVariations: [0.2, 0.1, -0.1, 0.3, 0.4, 0.2, 0.1],
  avg: 0.17,
  high: { value: 0.4, day: "목요일" },
  stableDays: 5,
  sleepCorrelation: 78,
};
const MONTHLY_DATA = {
  heatmapData: Array.from({ length: 31 }, (_, i) => ({
    date: `2025-08-${String(i + 1).padStart(2, "0")}`,
    count: Math.floor(Math.abs(Math.random() * 1.5 - 0.75) * 5),
  })),
  weeklyTrend: [0.17, 0.25, -0.05, 0.1],
  avg: 0.12,
  mostVolatileWeek: "8월 2주차",
  warningDays: 6,
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
    <View style={styles.mainValueContainer}>
      <Text
        style={[
          styles.mainValue,
          { color: DAILY_DATA.variation >= 0 ? COLORS.primary : "#5DADE2" },
        ]}
      >
        {DAILY_DATA.variation >= 0 ? "+" : ""}
        {DAILY_DATA.variation.toFixed(1)}
      </Text>
      <Text style={styles.mainUnit}>°C</Text>
    </View>
    <Text style={styles.subText}>어젯밤 평균과의 차이</Text>
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>야간 온도 변화 타임라인</Text>
      <LineChart
        data={{
          labels: ["23:00", "01:00", "03:00", "05:00", "07:00"],
          datasets: [{ data: DAILY_DATA.timeline, strokeWidth: 2 }],
        }}
        width={Dimensions.get("window").width - 48}
        height={200}
        chartConfig={chartConfig()}
        bezier
        withHorizontalLabels={true}
        yAxisSuffix="°C"
      />
    </View>
    <View style={styles.insightCard}>
      <Feather name="info" size={20} color={COLORS.primary} />
      <Text style={styles.insightText}>
        평소보다 높은 체온 변화가 감지되었습니다. 컨디션을 주의 깊게 살펴보세요.
      </Text>
    </View>
  </>
);

const WeeklyView = () => (
  <>
    <View style={styles.summaryGrid}>
      <View style={styles.summaryItem}>
        <Text style={styles.summaryLabel}>주간 평균</Text>
        <Text style={styles.summaryValue}>+{WEEKLY_DATA.avg.toFixed(2)}°C</Text>
      </View>
      <View style={styles.summaryItem}>
        <Text style={styles.summaryLabel}>최고 변화</Text>
        <Text style={styles.summaryValue}>+{WEEKLY_DATA.high.value}°C</Text>
        <Text style={styles.summarySubLabel}>{WEEKLY_DATA.high.day}</Text>
      </View>
      <View style={styles.summaryItem}>
        <Text style={styles.summaryLabel}>안정적인 날</Text>
        <Text style={styles.summaryValue}>
          {WEEKLY_DATA.stableDays}
          <Text style={{ fontSize: 16 }}>/7일</Text>
        </Text>
      </View>
    </View>
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>일일 온도 변화</Text>
      <View>
        <View style={styles.rangeBand} />
        <LineChart
          data={{
            labels: ["월", "화", "수", "목", "금", "토", "일"],
            datasets: [{ data: WEEKLY_DATA.dailyVariations }],
          }}
          width={Dimensions.get("window").width - 48}
          height={220}
          yAxisSuffix="°C"
          chartConfig={chartConfig()}
          bezier
          transparent
        />
      </View>
    </View>
    <View style={styles.insightCard}>
      <FontAwesome5 name="bed" size={20} color={COLORS.subText} />
      <Text style={styles.insightText}>
        체온 변화가 가장 컸던 목요일의 수면 점수는{" "}
        <Text style={{ color: "white", fontWeight: "bold" }}>
          {WEEKLY_DATA.sleepCorrelation}점
        </Text>
        이었습니다.
      </Text>
    </View>
  </>
);

const MonthlyView = () => (
  <>
    <View style={styles.summaryGrid}>
      <View style={styles.summaryItem}>
        <Text style={styles.summaryLabel}>월간 평균</Text>
        <Text style={styles.summaryValue}>
          +{MONTHLY_DATA.avg.toFixed(2)}°C
        </Text>
      </View>
      <View style={styles.summaryItem}>
        <Text style={styles.summaryLabel}>'주의' 일수</Text>
        <Text style={styles.summaryValue}>{MONTHLY_DATA.warningDays}일</Text>
      </View>
      <View style={styles.summaryItem}>
        <Text style={styles.summaryLabel}>변동폭 최심 주</Text>
        <Text style={[styles.summaryValue, { fontSize: 18 }]}>
          {MONTHLY_DATA.mostVolatileWeek}
        </Text>
      </View>
    </View>
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>월간 온도 변화 히트맵</Text>
      <ContributionGraph
        values={MONTHLY_DATA.heatmapData}
        endDate={new Date("2025-08-31")}
        numDays={31}
        width={Dimensions.get("window").width - 48}
        height={220}
        chartConfig={{
          ...chartConfig(),
          color: (opacity = 1) => `rgba(243, 156, 18, ${opacity})`,
        }}
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
        yAxisSuffix="°C"
        chartConfig={chartConfig()}
        bezier
      />
    </View>
  </>
);

// --- 메인 컴포넌트 ---
export default function TempDetailsScreen() {
  const [period, setPeriod] = useState<Period>("일");
  return (
    <LinearGradient
      colors={[COLORS.background, "#0A0A0A"]}
      style={styles.container}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <DetailScreenHeader title="온도 분석" />
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
    backgroundColor: COLORS.card,
    borderRadius: 20,
    alignSelf: "center",
    padding: 4,
  },
  toggleButton: { paddingVertical: 8, paddingHorizontal: 24, borderRadius: 16 },
  activeToggleButton: { backgroundColor: COLORS.primary },
  toggleText: { color: COLORS.subText, fontSize: 16, fontWeight: "bold" },
  activeToggleText: { color: "white" },
  mainValueContainer: {
    alignItems: "center",
    marginVertical: 24,
    flexDirection: "row",
    alignSelf: "center",
  },
  mainValue: { fontSize: 64, fontWeight: "bold" },
  mainUnit: { fontSize: 24, color: COLORS.subText, marginLeft: 8 },
  subText: {
    fontSize: 16,
    color: COLORS.subText,
    marginTop: -20,
    marginBottom: 24,
    alignSelf: "center",
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
  insightCard: {
    flexDirection: "row",
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    width: "100%",
  },
  insightText: {
    color: COLORS.text,
    fontSize: 15,
    marginLeft: 12,
    flex: 1,
    lineHeight: 22,
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
  summaryValue: { color: "white", fontSize: 22, fontWeight: "bold" },
  summaryLabel: { color: COLORS.subText, fontSize: 14, marginTop: 4 },
  summarySubLabel: { color: COLORS.subText, fontSize: 12, marginTop: 2 },
  rangeBand: {
    position: "absolute",
    top: "45%",
    bottom: "45%",
    left: 0,
    right: 0,
    backgroundColor: "rgba(80, 214, 163, 0.1)",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "rgba(80, 214, 163, 0.3)",
  },
});
