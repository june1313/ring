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
import { BarChart, LineChart, ContributionGraph } from "react-native-chart-kit";

const COLORS = {
  primary: "#50D6A3",
  text: "#EAEAEA",
  subText: "#BDBDBD",
  background: "#10141C",
  card: "#161B22",
  gridLine: "rgba(255, 255, 255, 0.1)",
  zone1: "#5DADE2",
  zone2: "#50D6A3",
  zone3: "#F39C12",
  zone4: "#E74C3C",
};

type Period = "일" | "주" | "월";

// --- 데이터 ---
const DAILY_DATA = {
  summary: {
    steps: 8680,
    distance: "6.2 km",
    calories: 450,
    activeTime: "1h 15m",
  },
  hourlyActivity: Array.from({ length: 24 }, (_, i) =>
    i > 7 && i < 22 ? Math.random() * 800 : Math.random() * 50
  ),
  hrZones: [
    { label: "웜업", time: "15분", percentage: 0.2, color: COLORS.zone1 },
    { label: "지방 연소", time: "35분", percentage: 0.47, color: COLORS.zone2 },
    { label: "카디오", time: "20분", percentage: 0.26, color: COLORS.zone3 },
    { label: "최대", time: "5분", percentage: 0.07, color: COLORS.zone4 },
  ],
};
const WEEKLY_DATA = {
  dailySteps: [8680, 9200, 7500, 11050, 8900, 12500, 6400],
  totalSteps: 64230,
  avgSteps: 9175,
  totalKcal: 3150,
  goalMetDays: 5,
  activityBreakdown: [
    { type: "걷기", duration: "5h 30m", icon: "walking" as const },
    { type: "달리기", duration: "1h 15m", icon: "running" as const },
    { type: "근력 운동", duration: "45m", icon: "dumbbell" as const },
  ],
  comparison: { avgSteps: "+850", activeTime: "+45m" },
  intensityMinutes: 150,
};
const MONTHLY_DATA = {
  heatmapData: Array.from({ length: 31 }, (_, i) => ({
    date: `2025-08-${String(i + 1).padStart(2, "0")}`,
    count: Math.floor(Math.random() * 15000),
  })),
  weeklyTrend: [9175, 8500, 10200, 9800],
  totalSteps: 275400,
  totalDistance: "210.5 km",
  totalDaysActive: 25,
  longestStreak: 12,
  personalRecords: [
    { type: "하루 최다 걸음", value: "15,200 걸음", date: "8월 17일" },
    { type: "최장 달리기", value: "10.5 km", date: "8월 24일" },
  ],
};

// --- 차트 공통 설정 ---
const chartConfig = {
  backgroundColor: COLORS.card,
  backgroundGradientFrom: COLORS.card,
  backgroundGradientTo: COLORS.card,
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(80, 214, 163, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(234, 234, 234, ${opacity})`,
  propsForBackgroundLines: { stroke: COLORS.gridLine, strokeWidth: 0.5 },
  barPercentage: 0.5,
};

// --- 재사용 컴포넌트들 ---
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

// --- 각 탭별 뷰 컴포넌트 ---
const DailyView = () => (
  <>
    <View style={styles.summaryGrid}>
      <View style={styles.summaryItem}>
        <FontAwesome5 name="walking" size={24} color={COLORS.primary} />
        <Text style={styles.summaryValue}>
          {DAILY_DATA.summary.steps.toLocaleString()}
        </Text>
        <Text style={styles.summaryLabel}>걸음</Text>
      </View>
      <View style={styles.summaryItem}>
        <FontAwesome5 name="map-marker-alt" size={24} color={COLORS.primary} />
        <Text style={styles.summaryValue}>{DAILY_DATA.summary.distance}</Text>
        <Text style={styles.summaryLabel}>거리</Text>
      </View>
      <View style={styles.summaryItem}>
        <FontAwesome5 name="fire" size={24} color={COLORS.primary} />
        <Text style={styles.summaryValue}>{DAILY_DATA.summary.calories}</Text>
        <Text style={styles.summaryLabel}>Kcal</Text>
      </View>
      <View style={styles.summaryItem}>
        <FontAwesome5 name="clock" size={24} color={COLORS.primary} />
        <Text style={styles.summaryValue}>{DAILY_DATA.summary.activeTime}</Text>
        <Text style={styles.summaryLabel}>활동 시간</Text>
      </View>
    </View>

    <View style={styles.card}>
      <Text style={styles.sectionTitle}>시간대별 활동</Text>
      <BarChart
        data={{
          labels: ["00", "04", "08", "12", "16", "20", ""],
          datasets: [{ data: DAILY_DATA.hourlyActivity }],
        }}
        width={Dimensions.get("window").width - 48}
        height={220}
        yAxisLabel=""
        yAxisSuffix=""
        fromZero
        showValuesOnTopOfBars={false}
        withInnerLines={false}
        chartConfig={chartConfig}
        style={{ paddingRight: 0 }}
      />
    </View>

    <View style={styles.card}>
      <Text style={styles.sectionTitle}>심박수 구간</Text>
      <View style={styles.hrZoneBar}>
        {DAILY_DATA.hrZones.map((zone) => (
          <View
            key={zone.label}
            style={{
              width: `${zone.percentage * 100}%`,
              height: 12,
              backgroundColor: zone.color,
            }}
          />
        ))}
      </View>
      <View style={styles.hrZoneLegend}>
        {DAILY_DATA.hrZones.map((zone) => (
          <View key={zone.label} style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: zone.color }]} />
            <Text style={styles.legendText}>{zone.label}</Text>
            <Text style={styles.legendValue}>{zone.time}</Text>
          </View>
        ))}
      </View>
    </View>
  </>
);

const WeeklyView = () => (
  <>
    <View style={styles.summaryGrid}>
      <View style={styles.summaryItem}>
        <Text style={styles.summaryValueLg}>
          {WEEKLY_DATA.totalSteps.toLocaleString()}
        </Text>
        <Text style={styles.summaryLabel}>총 걸음</Text>
      </View>
      <View style={styles.summaryItem}>
        <Text style={styles.summaryValueLg}>
          {WEEKLY_DATA.avgSteps.toLocaleString()}
        </Text>
        <Text style={styles.summaryLabel}>일 평균</Text>
      </View>
    </View>
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>요일별 걸음 수</Text>
      <BarChart
        data={{
          labels: ["월", "화", "수", "목", "금", "토", "일"],
          datasets: [{ data: WEEKLY_DATA.dailySteps }],
        }}
        width={Dimensions.get("window").width - 48}
        height={220}
        yAxisLabel=""
        yAxisSuffix=""
        fromZero
        chartConfig={chartConfig}
      />
    </View>
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>주간 활동 분석</Text>
      {WEEKLY_DATA.activityBreakdown.map((act) => (
        <View key={act.type} style={styles.breakdownRow}>
          <FontAwesome5
            name={act.icon}
            size={16}
            color={COLORS.subText}
            style={{ width: 20 }}
          />
          <Text style={styles.breakdownLabel}>{act.type}</Text>
          <Text style={styles.breakdownValue}>{act.duration}</Text>
        </View>
      ))}
    </View>
    <View style={styles.row}>
      <View style={[styles.card, styles.halfCard]}>
        <Text style={styles.sectionTitleSm}>지난 주 비교</Text>
        <Text style={styles.comparisonValue}>
          +{WEEKLY_DATA.comparison.avgSteps}{" "}
          <Text style={styles.comparisonUnit}>걸음/일</Text>
        </Text>
        <Text style={styles.comparisonValue}>
          +{WEEKLY_DATA.comparison.activeTime}{" "}
          <Text style={styles.comparisonUnit}>/주</Text>
        </Text>
      </View>
      <View style={[styles.card, styles.halfCard]}>
        <Text style={styles.sectionTitleSm}>고강도 활동</Text>
        <Text style={styles.mainValueSm}>{WEEKLY_DATA.intensityMinutes}</Text>
        <Text style={styles.comparisonUnit}>분 / 주</Text>
      </View>
    </View>
  </>
);

const MonthlyView = () => (
  <>
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>월간 활동 히트맵</Text>
      <ContributionGraph
        values={MONTHLY_DATA.heatmapData}
        endDate={new Date("2025-08-31")}
        numDays={31}
        width={Dimensions.get("window").width - 48}
        height={220}
        chartConfig={{
          ...chartConfig,
          color: (opacity = 1) => `rgba(80, 214, 163, ${opacity})`,
        }}
      />
    </View>
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>개인 신기록 (PR)</Text>
      {MONTHLY_DATA.personalRecords.map((pr) => (
        <View key={pr.type} style={styles.prRow}>
          <FontAwesome5 name="trophy" size={16} color="#FFD700" />
          <Text style={styles.prLabel}>{pr.type}</Text>
          <View style={{ alignItems: "flex-end" }}>
            <Text style={styles.prValue}>{pr.value}</Text>
            <Text style={styles.prDate}>{pr.date}</Text>
          </View>
        </View>
      ))}
    </View>
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>주간별 활동 트렌드</Text>
      <LineChart
        data={{
          labels: ["1주차", "2주차", "3주차", "4주차"],
          datasets: [{ data: MONTHLY_DATA.weeklyTrend }],
        }}
        width={Dimensions.get("window").width - 48}
        height={220}
        fromZero
        chartConfig={chartConfig}
        bezier
      />
    </View>
    <View style={styles.summaryGrid}>
      <View style={styles.summaryItem}>
        <Text style={styles.summaryValue}>
          {MONTHLY_DATA.totalSteps.toLocaleString()}
        </Text>
        <Text style={styles.summaryLabel}>월간 총 걸음</Text>
      </View>
      <View style={styles.summaryItem}>
        <Text style={styles.summaryValue}>{MONTHLY_DATA.longestStreak}일</Text>
        <Text style={styles.summaryLabel}>최장 연속 달성</Text>
      </View>
    </View>
  </>
);

// --- 메인 컴포넌트 ---
export default function ExerciseDetailsScreen() {
  const [period, setPeriod] = useState<Period>("일");

  return (
    <LinearGradient
      colors={[COLORS.background, "#0A0A0A"]}
      style={styles.container}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <DetailScreenHeader title="활동 분석" />
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
  summaryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    backgroundColor: COLORS.card,
    borderRadius: 24,
    padding: 12,
    marginBottom: 24,
    justifyContent: "space-around",
  },
  summaryItem: { width: "50%", alignItems: "center", padding: 16 },
  summaryValue: {
    color: "white",
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 8,
  },
  summaryValueLg: {
    color: "white",
    fontSize: 32,
    fontWeight: "bold",
    marginTop: 8,
  },
  summaryLabel: { color: COLORS.subText, fontSize: 14, marginTop: 4 },
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
  hrZoneBar: {
    flexDirection: "row",
    height: 12,
    borderRadius: 6,
    overflow: "hidden",
    width: "100%",
    backgroundColor: "rgba(255,255,255,0.1)",
    marginBottom: 20,
  },
  hrZoneLegend: { width: "100%", paddingHorizontal: 12 },
  legendItem: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  legendDot: { width: 10, height: 10, borderRadius: 5, marginRight: 8 },
  legendText: { color: COLORS.text, fontSize: 14, flex: 1 },
  legendValue: { color: COLORS.subText, fontSize: 14 },
  breakdownRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  breakdownLabel: { color: COLORS.text, fontSize: 16, flex: 1, marginLeft: 16 },
  breakdownValue: { color: COLORS.text, fontSize: 16, fontWeight: "600" },
  row: { flexDirection: "row", width: "100%", justifyContent: "space-between" },
  halfCard: {
    width: "48%",
    padding: 16,
    justifyContent: "space-around",
    minHeight: 120,
  },
  sectionTitleSm: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  comparisonValue: { color: "white", fontSize: 24, fontWeight: "bold" },
  comparisonUnit: { color: COLORS.subText, fontSize: 14 },
  mainValueSm: { color: "white", fontSize: 36, fontWeight: "bold" },
  prRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gridLine,
  },
  prLabel: { color: "white", fontSize: 16, flex: 1, marginLeft: 12 },
  prValue: { color: "white", fontSize: 16, fontWeight: "bold" },
  prDate: { color: COLORS.subText, fontSize: 12, marginTop: 2 },
});
